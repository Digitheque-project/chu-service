import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PriseEnChargeService } from './prise-en-charge.service';
import { CreatePriseEnChargeDto } from './dto/create-prise-en-charge.dto';
import { UpdatePriseEnChargeDto } from './dto/update-prise-en-charge.dto';

@ApiTags('Prise en charge')
@ApiBearerAuth('access-token')
@Controller('prise-en-charge')
export class PriseEnChargeController {
  constructor(private readonly priseEnChargeService: PriseEnChargeService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une prise en charge (entreprise partenaire)' })
  create(@Body() createPriseEnChargeDto: CreatePriseEnChargeDto) {
    return this.priseEnChargeService.create(createPriseEnChargeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les prises en charge' })
  findAll() {
    return this.priseEnChargeService.findAll();
  }

  @Get('chu/:chuId/prise-en-charge/:priseEnChargeId')
  @ApiOperation({ summary: 'Obtenir une prise en charge par CHU' })
  findOneByChu(
    @Param('chuId') chuId: string,
    @Param('priseEnChargeId') priseEnChargeId: string,
  ) {
    return this.priseEnChargeService.findOneInChu(chuId, priseEnChargeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une prise en charge' })
  findOne(@Param('id') id: string) {
    return this.priseEnChargeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier une prise en charge' })
  update(@Param('id') id: string, @Body() updatePriseEnChargeDto: UpdatePriseEnChargeDto) {
    return this.priseEnChargeService.update(id, updatePriseEnChargeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une prise en charge' })
  remove(@Param('id') id: string) {
    return this.priseEnChargeService.remove(id);
  }
}
