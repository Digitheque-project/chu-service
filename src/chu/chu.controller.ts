import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChuService } from './chu.service';
import { CreateChuDto } from './dto/create-chu.dto';
import { UpdateChuDto } from './dto/update-chu.dto';

const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE ?? 5 * 1024 * 1024);
const logoInterceptor = FileInterceptor('logo', {
  storage: memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
});

// Schema Swagger commun (multipart) : champs texte + fichier logo binaire.
const chuMultipartBody = {
  type: 'object',
  properties: {
    name: { type: 'string', example: 'CHU Andrainjato Fianarantsoa' },
    address: { type: 'string', example: 'Andrainjato' },
    phone: { type: 'string', example: '+261340232145' },
    email: { type: 'string', example: 'contact@chu.ma' },
    responsable: { type: 'string', example: 'Pr. Tahiry' },
    logo: { type: 'string', format: 'binary' },
  },
};

@ApiBearerAuth('access-token')
@ApiTags('CHU')
@Controller('chu')
export class ChuController {
  constructor(private readonly chuService: ChuService) {}

  @Post()
  @ApiOperation({ summary: 'Creer un CHU (avec logo optionnel)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: chuMultipartBody })
  @ApiResponse({ status: 201, description: 'CHU cree avec succes' })
  @UseInterceptors(logoInterceptor)
  create(
    @Body() dto: CreateChuDto,
    @UploadedFile() logo?: Express.Multer.File,
  ) {
    return this.chuService.create(dto, logo);
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
  @ApiOperation({ summary: 'Modifier un CHU (et/ou remplacer le logo)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: chuMultipartBody })
  @UseInterceptors(logoInterceptor)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateChuDto,
    @UploadedFile() logo?: Express.Multer.File,
  ) {
    return this.chuService.update(id, dto, logo);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un CHU' })
  remove(@Param('id') id: string) {
    return this.chuService.remove(id);
  }
}
