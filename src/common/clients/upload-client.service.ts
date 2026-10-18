import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export interface StoredFile {
  filename: string;
  path: string;
  url: string;
  mimetype?: string;
  size?: number;
}

/**
 * Client interne vers le service upload.
 * Appel de service a service (pas de token utilisateur ici) : JWT de service
 * court signe avec le JWT_SECRET partage par tous les services, accepte par
 * la passerelle (route /files requiresAuth) comme par le service upload.
 */
@Injectable()
export class UploadClientService {
  private readonly logger = new Logger(UploadClientService.name);

  constructor(private readonly config: ConfigService) {}

  private readonly jwt = new JwtService();

  // Origine du service upload, ou de la passerelle du CHU (sans valeur par
  // defaut : elle vient uniquement de UPLOAD_SERVICE_URL).
  private get baseUrl(): string {
    return (this.config.get<string>('UPLOAD_SERVICE_URL') ?? '').replace(/\/+$/, '');
  }

  private authHeaders(): Record<string, string> {
    const token = this.jwt.sign(
      { userId: 'service-chu', role: 'SERVICE' },
      { secret: this.config.get<string>('JWT_SECRET'), expiresIn: '2m' },
    );
    return { Authorization: `Bearer ${token}` };
  }

  /** Envoie un fichier au service upload et renvoie le filename stocke. */
  async upload(file: Express.Multer.File): Promise<StoredFile> {
    if (!file?.buffer) {
      throw new InternalServerErrorException('Fichier logo invalide');
    }

    try {
      const form = new FormData();
      const blob = new Blob([new Uint8Array(file.buffer)], {
        type: file.mimetype || 'application/octet-stream',
      });
      form.append('file', blob, file.originalname);

      const res = await fetch(`${this.baseUrl}/files`, {
        method: 'POST',
        headers: this.authHeaders(),
        body: form,
        signal: AbortSignal.timeout(10000),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`upload-service ${res.status}: ${text}`);
      }

      return (await res.json()) as StoredFile;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Echec upload logo: ${message}`);
      throw new InternalServerErrorException(
        "Echec de l'envoi du logo au service upload",
      );
    }
  }

  /** Supprime un logo du service upload (best-effort). */
  async remove(filename?: string | null): Promise<void> {
    if (!filename) return;
    try {
      await fetch(`${this.baseUrl}/files/${encodeURIComponent(filename)}`, {
        method: 'DELETE',
        headers: this.authHeaders(),
        signal: AbortSignal.timeout(10000),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Suppression du logo "${filename}" echouee: ${message}`);
    }
  }

  /** Construit l'URL publique consommable par le front (GET protege par JWT). */
  buildPublicUrl(filename?: string | null): string | null {
    if (!filename) return null;
    const base = this.config.get<string>('UPLOAD_PUBLIC_URL') ?? this.baseUrl;
    return `${base}/files/${filename}`;
  }
}
