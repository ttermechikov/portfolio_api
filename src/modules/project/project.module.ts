import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './project.entity';
import { TechnologyModule } from '../technology/technology.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity]), TechnologyModule],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
