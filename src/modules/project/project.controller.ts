import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectsResponsesInterface } from './types/projects-response.interface';
import { ProjectResponseInterface } from './types/project-response.interface';
import { BackendValidationPipe } from '../../shared/pipes/backend-validation.pipe';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async findAll(): Promise<ProjectsResponsesInterface> {
    return await this.projectService.findAll();
  }

  @Get(':id')
  async getSingleProject(
    @Param('id', ParseIntPipe) projectId: number,
  ): Promise<ProjectResponseInterface> {
    const project = await this.projectService.getSingleProject(projectId);
    return this.projectService.buildProjectResponse(project);
  }

  @Post()
  @UsePipes(new BackendValidationPipe())
  async create(
    @Body('project') createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseInterface> {
    const project = await this.projectService.create(createProjectDto);
    return this.projectService.buildProjectResponse(project);
  }

  @Put(':id')
  @UsePipes(new BackendValidationPipe())
  async update(
    @Param('id', ParseIntPipe) projectId: number,
    @Body('project') updateProjectDto: UpdateProjectDto,
  ) {
    const project = await this.projectService.update(
      projectId,
      updateProjectDto,
    );
    return this.projectService.buildProjectResponse(project);
  }

  @Delete(':id')
  @UsePipes(new BackendValidationPipe())
  async delete(@Param('id', ParseIntPipe) projectId: number) {
    return await this.projectService.delete(projectId);
  }
}
