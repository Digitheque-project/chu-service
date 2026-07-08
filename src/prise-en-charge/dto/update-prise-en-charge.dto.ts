import { PartialType } from '@nestjs/swagger';
import { CreatePriseEnChargeDto } from './create-prise-en-charge.dto';

export class UpdatePriseEnChargeDto extends PartialType(CreatePriseEnChargeDto) {}
