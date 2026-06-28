import { PartialType } from '@nestjs/swagger';
import { CreateChuDto } from './create-chu.dto';

export class UpdateChuDto extends PartialType(CreateChuDto) {}
