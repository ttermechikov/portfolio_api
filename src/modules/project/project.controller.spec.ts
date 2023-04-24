import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { createMock } from '@golevelup/ts-jest';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

describe('ProjectController', () => {
  let projectController: ProjectController;
  let projectService: ProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        { provide: ProjectService, useValue: createMock<ProjectService>() },
      ],
    }).compile();

    projectController = module.get<ProjectController>(ProjectController);
    projectService = module.get<ProjectService>(ProjectService);

    jest.clearAllMocks();
  });

  it('findAll', async () => {
    await projectController.findAll();

    expect(projectService.findAll).toHaveBeenCalled();
    expect(projectService.findAll).toHaveBeenCalledTimes(1);
  });

  it('getSingleProject', async () => {
    const someProjectId = 42;
    await projectController.getSingleProject(someProjectId);

    expect(projectService.getSingleProject).toHaveBeenCalledWith(someProjectId);
    expect(projectService.getSingleProject).toHaveBeenCalledTimes(1);

    expect(projectService.buildProjectResponse).toHaveBeenCalledTimes(1);
  });

  it('create', async () => {
    const createProjectDto: CreateProjectDto = {
      name: 'A name',
      description: 'A description',
      url: '',
      repository_url: '',
      weight: 1,
    };

    await projectController.create(createProjectDto);

    expect(projectService.create).toHaveBeenCalledWith(createProjectDto);
    expect(projectService.create).toHaveBeenCalledTimes(1);

    expect(projectService.buildProjectResponse).toHaveBeenCalledTimes(1);
  });

  it('update', async () => {
    const someProjectId = 42;
    const updateProjectDto: UpdateProjectDto = {
      name: 'An updated name',
    };

    await projectController.update(someProjectId, updateProjectDto);

    expect(projectService.update).toHaveBeenCalledWith(
      someProjectId,
      updateProjectDto,
    );
  });

  it('delete', async () => {
    const someProjectId = 42;

    await projectController.delete(42);

    expect(projectService.delete).toHaveBeenCalledWith(someProjectId);
    expect(projectService.delete).toHaveBeenCalledTimes(1);
  });
});
