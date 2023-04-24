import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProjectEntity } from './project.entity';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

describe('ProjectService', () => {
  let projectService: ProjectService;
  let projectRepository: Repository<ProjectEntity>;

  const testProjectEntity: ProjectEntity = {
    id: 42,
    name: 'A test project',
    description: 'Very useful description',
    repository_url: '',
    url: '',
    weight: 7,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        ConfigService,
        {
          provide: getRepositoryToken(ProjectEntity),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    projectService = module.get<ProjectService>(ProjectService);
    projectRepository = module.get<Repository<ProjectEntity>>(
      getRepositoryToken(ProjectEntity),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(projectService).toBeDefined();
    expect(projectRepository).toBeDefined();
  });

  describe('getSingleProject', () => {
    it('should return a project entity', async () => {
      projectRepository.findOne = jest
        .fn()
        .mockResolvedValue({ ...testProjectEntity });

      const foundProject = await projectService.getSingleProject(
        testProjectEntity.id,
      );

      expect(foundProject).toEqual(testProjectEntity);
      expect(projectRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw a http exception if a project is not found', () => {
      projectRepository.findOne = jest.fn().mockResolvedValue(null);

      return projectService
        .getSingleProject(123)
        .catch((err: HttpException) => {
          expect(err instanceof HttpException).toBeTruthy();
          expect(err.getResponse()).toMatchInlineSnapshot(
            `"Project with id "123" is not found"`,
          );
          expect(projectRepository.findOne).toHaveBeenCalledTimes(1);
        });
    });
  });

  describe('create', () => {
    it('should save a project', async () => {
      const testCreateProjectDto = { ...testProjectEntity };
      delete testCreateProjectDto.id;

      await projectService.create(testCreateProjectDto);

      expect(projectRepository.save).toHaveBeenCalledWith(testCreateProjectDto);
      expect(projectRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      const testProject = { ...testProjectEntity };
      const testUpdateProjectDto = { name: 'updated name' };
      projectService.getSingleProject = jest
        .fn()
        .mockResolvedValue(testProject);

      await projectService.update(testProject.id, testUpdateProjectDto);

      expect(projectRepository.save).toHaveBeenCalledWith({
        ...testProject,
        ...testUpdateProjectDto,
      });
      expect(projectRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete a proejct', async () => {
      const testProject = { ...testProjectEntity };

      await projectService.delete(testProject.id);

      expect(projectRepository.delete).toHaveBeenCalledTimes(1);
      expect(projectRepository.delete).toHaveBeenCalledWith(testProject.id);
    });
  });

  describe('buildProjectResponse', () => {
    it('should make a response object by wrapping a passed object into another object', () => {
      const testProject = { ...testProjectEntity };

      const projectResponse = projectService.buildProjectResponse(testProject);

      expect(projectResponse).toMatchObject({
        project: testProject,
      });
    });
  });
});
