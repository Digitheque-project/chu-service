import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChuDto {
  @ApiProperty({ example: 'CHU Andrainjato Fianarantsoa', description: 'Nom du CHU' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Andrainjato', description: 'Adresse du CHU' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: '+261340232145', description: 'Numéro de téléphone' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'contact@chu.ma', description: 'Email de contact' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Pr. Tahiry', description: 'Responsable du CHU' })
  @IsString()
  @IsNotEmpty()
  responsable: string;
}
