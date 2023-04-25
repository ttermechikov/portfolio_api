import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from './project.entity';
import { DeleteResult, Repository } from 'typeorm';
import { ProjectsResponsesInterface } from './types/projects-response.interface';
import AppDataSource from '../../ormconfig';
import { ProjectResponseInterface } from './types/project-response.interface';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { TechnologyService } from '../technology/technology.service';
import { TechnologyType } from '../technology/types/technology.type';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    private readonly technologyService: TechnologyService,
  ) {}

  async findAll(): Promise<ProjectsResponsesInterface> {
    const queryBuilder = AppDataSource.getRepository(ProjectEntity)
      .createQueryBuilder('projects')
      .leftJoinAndSelect('projects.technologies', 'technology')
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
      relations: ['technologies'],
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
    return await this.save(createProjectDto);
  }

  async update(
    projectId: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectEntity> {
    return await this.save(updateProjectDto, projectId);
  }

  async save(
    createOrUpdateDto: CreateProjectDto | UpdateProjectDto,
    projectId?: number,
  ) {
    let project: ProjectEntity;

    if (projectId) {
      project = await this.getSingleProject(projectId);
    } else {
      project = new ProjectEntity();
    }

    const { technologyNamesList } = createOrUpdateDto;
    delete createOrUpdateDto.technologyNamesList;

    if (technologyNamesList?.length) {
      project.technologies = await this.findOrCreateTechnologies(
        technologyNamesList,
      );
    }

    Object.assign(project, createOrUpdateDto);

    return await this.projectRepository.save(project);
  }

  async delete(projectId: number): Promise<DeleteResult> {
    return await this.projectRepository.delete(projectId);
  }

  async findOrCreateTechnologies(
    projectTechnologiesList: TechnologyType['name'][],
  ) {
    const findOrCreatePromiseList = [];

    projectTechnologiesList.forEach((technologyName) => {
      findOrCreatePromiseList.push(
        this.technologyService.findOrCreateByName(technologyName),
      );
    });

    return await Promise.all(findOrCreatePromiseList);
  }

  buildProjectResponse(project: ProjectEntity): ProjectResponseInterface {
    return {
      project,
    };
  }
}
