import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chu } from './entities/chu.entity';
import { ChuService } from './chu.service';
import { ChuController } from './chu.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Chu])],
  controllers: [ChuController],
  providers: [ChuService],
  exports: [ChuService],
})
export class ChuModule {}
