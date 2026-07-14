import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chu } from './entities/chu.entity';
import { ChuService } from './chu.service';
import { ChuController } from './chu.controller';
import { UploadClientService } from '../common/clients/upload-client.service';

@Module({
  imports: [TypeOrmModule.forFeature([Chu])],
  controllers: [ChuController],
  providers: [ChuService, UploadClientService],
  exports: [ChuService],
})
export class ChuModule {}
