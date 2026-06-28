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

@Injectable()
export class ChuService {
  constructor(
    @InjectRepository(Chu)
    private readonly chuRepo: Repository<Chu>,
  ) {}

  async create(dto: CreateChuDto) {
    try {
      const existing = await this.chuRepo.findOne({
        where: { name: dto.name },
      });
      if (existing) {
        throw new ConflictException('Ce CHU existe déjà');
      }

      const chu = this.chuRepo.create(dto);
      await this.chuRepo.save(chu);
      return { message: 'CHU créé avec succès', chu };
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      console.error(error);
      throw new InternalServerErrorException("Erreur lors de la création du CHU");
    }
  }

  async findAll() {
    try {
      return await this.chuRepo.find();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Erreur lors de la récupération des CHU");
    }
  }

  async findOne(id: string) {
    try {
      const chu = await this.chuRepo.findOne({ where: { id } });
      if (!chu) throw new NotFoundException('CHU introuvable');
      return chu;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error(error);
      throw new InternalServerErrorException("Erreur lors de la recherche du CHU");
    }
  }

  async update(id: string, dto: UpdateChuDto) {
    try {
      const chu = await this.findOne(id);

      if (dto.name) {
        const existing = await this.chuRepo.findOne({ where: { name: dto.name } });
        if (existing && existing.id !== id) {
          throw new ConflictException('Ce CHU existe déjà');
        }
      }

      Object.assign(chu, dto);
      await this.chuRepo.save(chu);
      return { message: 'CHU mis à jour', chu };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) throw error;
      console.error(error);
      throw new InternalServerErrorException("Erreur lors de la mise à jour du CHU");
    }
  }

  async remove(id: string) {
    try {
      const chu = await this.findOne(id);
      await this.chuRepo.remove(chu);
      return { message: 'CHU supprimé' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error(error);
      throw new InternalServerErrorException("Erreur lors de la suppression du CHU");
    }
  }
}
