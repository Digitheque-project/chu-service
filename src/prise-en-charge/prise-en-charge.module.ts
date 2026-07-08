import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriseEnCharge } from './entities/prise-en-charge.entity';
import { PriseEnChargeService } from './prise-en-charge.service';
import { PriseEnChargeController } from './prise-en-charge.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PriseEnCharge])],
  controllers: [PriseEnChargeController],
  providers: [PriseEnChargeService],
})
export class PriseEnChargeModule {}
