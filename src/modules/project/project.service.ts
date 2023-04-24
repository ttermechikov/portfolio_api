import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from './project.entity';
import { DeleteResult, Repository } from 'typeorm';
import { ProjectsResponsesInterface } from './types/projects-response.interface';
import AppDataSource from '../../ormconfig';
import { ProjectResponseInterface } from './types/project-response.interface';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
  ) {}
  async findAll(): Promise<ProjectsResponsesInterface> {
    const queryBuilder = AppDataSource.getRepository(ProjectEntity)
      .createQueryBuilder('projects')
      .orderBy('projects.weight', 'DESC');

    const projects = await queryBuilder.getMany();
    const projectsCount = await queryBuilder.getCount();

    return { projects, projectsCount };
  }

  async getSingleProject(projectId: number): Promise<ProjectEntity> {
    const project = await this.projectRepository.findOne({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      throw new HttpException(
        `Project with id "${projectId}" is not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return project;
  }

  async create(createProjectDto: CreateProjectDto): Promise<ProjectEntity> {
    const project = new ProjectEntity();
    Object.assign(project, createProjectDto);

    return await this.projectRepository.save(project);
  }

  async update(
    projectId: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectEntity> {
    const project = await this.getSingleProject(projectId);

    Object.assign(project, updateProjectDto);

    return await this.projectRepository.save(project);
  }

  async delete(projectId: number): Promise<DeleteResult> {
    return await this.projectRepository.delete(projectId);
  }

  buildProjectResponse(project: ProjectEntity): ProjectResponseInterface {
    return {
      project,
    };
  }
}
