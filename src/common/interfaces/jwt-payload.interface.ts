// Reflet fidele du token reellement signe par l'auth-service.

export interface ChuInfo {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  responsable?: string;
  // Filename du logo, propage automatiquement depuis l'entite Chu.
  logo?: string;
}

export interface TokenService {
  serviceId: string;
  serviceName: string;
  baseUrl?: string;
  roleId: string;
  roleName: string;
  permissions: string[];
  chu?: ChuInfo | null;
}

export interface JwtPayload {
  userId: string;
  name: string;
  firstname: string;
  email: string;
  services: TokenService[];
  iat?: number;
  exp?: number;
}
