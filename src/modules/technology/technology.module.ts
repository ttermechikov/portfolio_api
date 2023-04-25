import { Module } from '@nestjs/common';
import { TechnologyController } from './technology.controller';
import { TechnologyService } from './technology.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnologyEntity } from './technology.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TechnologyEntity])],
  controllers: [TechnologyController],
  providers: [TechnologyService],
  exports: [TechnologyService],
})
export class TechnologyModule {}
