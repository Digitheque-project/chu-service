import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chu } from './entities/chu.entity';
import { CreateChuDto } from './dto/create-chu.dto';
import { UpdateChuDto } from './dto/update-chu.dto';
import { UploadClientService } from '../common/clients/upload-client.service';

@Injectable()
export class ChuService {
  constructor(
    @InjectRepository(Chu)
    private readonly chuRepo: Repository<Chu>,
    private readonly uploadClient: UploadClientService,
  ) {}

  // Ajoute logoUrl (URL publique) a la reponse, sans la persister en base.
  private withLogoUrl(chu: Chu) {
    return { ...chu, logoUrl: this.uploadClient.buildPublicUrl(chu.logo) };
  }

  async create(dto: CreateChuDto, logoFile?: Express.Multer.File) {
    try {
      const existing = await this.chuRepo.findOne({
        where: { name: dto.name },
      });
      if (existing) {
        throw new ConflictException('Ce CHU existe deja');
      }

      // 1) Upload du logo vers le service upload -> on recupere le filename.
      let logo: string | undefined;
      if (logoFile) {
        const stored = await this.uploadClient.upload(logoFile);
        logo = stored.filename;
      }

      // 2) On stocke le filename dans le CHU (embarque ensuite dans le token).
      const chu = this.chuRepo.create({ ...dto, logo });
      await this.chuRepo.save(chu);
      return { message: 'CHU cree avec succes', chu: this.withLogoUrl(chu) };
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Erreur lors de la creation du CHU');
    }
  }

  async findAll() {
    try {
      const chus = await this.chuRepo.find();
      return chus.map((chu) => this.withLogoUrl(chu));
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Erreur lors de la recuperation des CHU',
      );
    }
  }

  async findOne(id: string) {
    try {
      const chu = await this.chuRepo.findOne({ where: { id } });
      if (!chu) throw new NotFoundException('CHU introuvable');
      return this.withLogoUrl(chu);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Erreur lors de la recherche du CHU');
    }
  }

  async update(id: string, dto: UpdateChuDto, logoFile?: Express.Multer.File) {
    try {
      const chu = await this.chuRepo.findOne({ where: { id } });
      if (!chu) throw new NotFoundException('CHU introuvable');

      if (dto.name) {
        const existing = await this.chuRepo.findOne({
          where: { name: dto.name },
        });
        if (existing && existing.id !== id) {
          throw new ConflictException('Ce CHU existe deja');
        }
      }

      Object.assign(chu, dto);

      // Remplacement du logo : upload du nouveau puis suppression de l'ancien.
      if (logoFile) {
        const previousLogo = chu.logo;
        const stored = await this.uploadClient.upload(logoFile);
        chu.logo = stored.filename;
        if (previousLogo && previousLogo !== stored.filename) {
          await this.uploadClient.remove(previousLogo);
        }
      }

      await this.chuRepo.save(chu);
      return { message: 'CHU mis a jour', chu: this.withLogoUrl(chu) };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      )
        throw error;
      console.error(error);
      throw new InternalServerErrorException(
        'Erreur lors de la mise a jour du CHU',
      );
    }
  }

  async remove(id: string) {
    try {
      const chu = await this.chuRepo.findOne({ where: { id } });
      if (!chu) throw new NotFoundException('CHU introuvable');

      const logo = chu.logo;
      await this.chuRepo.remove(chu);
      // Nettoyage du logo associe (best-effort).
      await this.uploadClient.remove(logo);
      return { message: 'CHU supprime' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error(error);
      throw new InternalServerErrorException(
        'Erreur lors de la suppression du CHU',
      );
    }
  }
}
