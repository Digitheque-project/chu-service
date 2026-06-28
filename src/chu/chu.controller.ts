import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChuService } from './chu.service';
import { CreateChuDto } from './dto/create-chu.dto';
import { UpdateChuDto } from './dto/update-chu.dto';

@ApiBearerAuth('access-token')
@ApiTags('CHU')
@Controller('chu')
export class ChuController {
  constructor(private readonly chuService: ChuService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un CHU' })
  @ApiBody({ type: CreateChuDto })
  @ApiResponse({ status: 201, description: 'CHU créé avec succès' })
  create(@Body() dto: CreateChuDto) {
    return this.chuService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les CHU' })
  findAll() {
    return this.chuService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Afficher un CHU' })
  findOne(@Param('id') id: string) {
    return this.chuService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier un CHU' })
  @ApiBody({ type: UpdateChuDto })
  update(@Param('id') id: string, @Body() dto: UpdateChuDto) {
    return this.chuService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un CHU' })
  remove(@Param('id') id: string) {
    return this.chuService.remove(id);
  }
}
