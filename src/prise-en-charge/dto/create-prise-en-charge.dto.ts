import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsUUID, IsInt, Min, Max, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePriseEnChargeDto {
  @ApiProperty({ example: 'Clinique Saint Michel', description: "Nom de l'entreprise partenaire" })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiPropertyOptional({ example: '123456789', description: 'NIF' })
  @IsOptional()
  @IsString()
  nif?: string;

  @ApiPropertyOptional({ example: 'contact@saintmichel.mg', description: 'Email de contact' })
  @IsOptional()
  @IsString()
  contactEmail?: string;

  @ApiPropertyOptional({ example: '+261340000000', description: 'Téléphone de contact' })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({ example: 'Lot IVT 123, Tananarive', description: 'Adresse' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 80, description: "Part payée par l'entreprise en % (100 par défaut)" })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  tauxCouverture?: number;

  @ApiPropertyOptional({ example: 200000, description: 'Plafond mensuel par patient (Ar), vide = sans plafond' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  plafondMensuel?: number | null;

  @ApiProperty({ example: 'uuid-chu', description: 'ID du CHU' })
  @IsUUID()
  @IsNotEmpty()
  chuId: string;
}
