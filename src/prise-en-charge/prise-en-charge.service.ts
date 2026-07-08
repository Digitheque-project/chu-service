import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriseEnCharge } from './entities/prise-en-charge.entity';
import { CreatePriseEnChargeDto } from './dto/create-prise-en-charge.dto';
import { UpdatePriseEnChargeDto } from './dto/update-prise-en-charge.dto';

@Injectable()
export class PriseEnChargeService {
  constructor(
    @InjectRepository(PriseEnCharge)
    private readonly priseEnChargeRepository: Repository<PriseEnCharge>,
  ) {}

  async create(payload: CreatePriseEnChargeDto): Promise<PriseEnCharge> {
    const newPriseEnCharge = this.priseEnChargeRepository.create(payload);
    return this.priseEnChargeRepository.save(newPriseEnCharge);
  }

  async findAll(chuId?: string): Promise<PriseEnCharge[]> {
    if (chuId) {
      return this.priseEnChargeRepository.find({ where: { chuId } });
    }
    return this.priseEnChargeRepository.find();
  }

  async findOne(id: string): Promise<PriseEnCharge> {
    const priseEnCharge = await this.priseEnChargeRepository.findOne({ where: { id } });
    if (!priseEnCharge) {
      throw new NotFoundException(`Prise en charge ${id} introuvable`);
    }
    return priseEnCharge;
  }

  async findOneInChu(chuId: string, id: string): Promise<PriseEnCharge> {
    const priseEnCharge = await this.priseEnChargeRepository.findOne({ where: { chuId, id } });
    if (!priseEnCharge) {
      throw new NotFoundException(`Prise en charge ${id} introuvable dans le CHU ${chuId}`);
    }
    return priseEnCharge;
  }

  async update(id: string, payload: UpdatePriseEnChargeDto): Promise<PriseEnCharge> {
    const priseEnCharge = await this.findOne(id);
    Object.assign(priseEnCharge, payload);
    return this.priseEnChargeRepository.save(priseEnCharge);
  }

  async remove(id: string): Promise<void> {
    const priseEnCharge = await this.findOne(id);
    await this.priseEnChargeRepository.remove(priseEnCharge);
  }
}