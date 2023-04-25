import { Test, TestingModule } from '@nestjs/testing';
import { TechnologyController } from './technology.controller';
import { ConfigService } from '@nestjs/config';
import { TechnologyService } from './technology.service';
import { createMock } from '@golevelup/ts-jest';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { TechnologyEntity } from './technology.entity';
import { TechnologiesResponsesInterface } from './types/technologies-response.interface';
import { UpdateProjectDto } from '../project/dto/update-project.dto';

describe('TechnologyController', () => {
  let technologyController: TechnologyController;
  let technologyService: TechnologyService;

  const testTechnologyName = 'TypeScript';
  const DEFAULT_TECHNOLOGY_WEIGHT = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TechnologyController],
      providers: [
        ConfigService,
        {
          provide: TechnologyService,
          useValue: createMock<TechnologyService>(),
        },
      ],
    }).compile();

    technologyController =
      module.get<TechnologyController>(TechnologyController);
    technologyService = module.get<TechnologyService>(TechnologyService);

    jest.clearAllMocks();
    technologyService.buildProjectResponse = jest.fn(
      (technology: TechnologyEntity) => ({ technology }),
    );
  });

  it('should be defined', () => {
    expect(technologyController).toBeDefined();
    expect(technologyService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return technologies', async () => {
      const mockedResponse: TechnologiesResponsesInterface = {
        technologies: [],
      };
      technologyService.findAll = jest.fn().mockResolvedValue(mockedResponse);

      const result = await technologyController.findAll();

      expect(technologyService.findAll).toHaveBeenCalledWith(/** nothing */);
      expect(technologyService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockedResponse);
    });
  });

  describe('create', () => {
    it('should create a technology', async () => {
      const technology: CreateTechnologyDto = {
        weight: DEFAULT_TECHNOLOGY_WEIGHT,
        name: testTechnologyName,
      };
      const mockCreateResponse = {
        ...technology,
        id: 1,
      };
      technologyService.create = jest
        .fn()
        .mockResolvedValue(mockCreateResponse);

      const response = await technologyController.create(technology);

      expect(response).toEqual({
        technology: mockCreateResponse,
      });
      expect(technologyService.create).toHaveBeenCalledTimes(1);
      expect(technologyService.create).toHaveBeenCalledWith(technology);
      expect(technologyService.buildProjectResponse).toHaveBeenCalledTimes(1);
      expect(technologyService.buildProjectResponse).toHaveBeenCalledWith(
        mockCreateResponse,
      );
    });
  });

  describe('update', () => {
    it('should update a technology', async () => {
      const technology: TechnologyEntity = {
        id: 1,
        name: 'Test',
        weight: DEFAULT_TECHNOLOGY_WEIGHT,
        projects: [],
      };
      const updateDto: UpdateProjectDto = { name: 'Updated' };

      await technologyController.update(technology.id, updateDto);

      expect(technologyService.update).toHaveBeenCalledWith(
        technology.id,
        updateDto,
      );
      expect(technologyService.update).toHaveBeenCalledTimes(1);
      expect(technologyService.buildProjectResponse).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete a technology', async () => {
      const technology: TechnologyEntity = {
        id: 1,
        name: 'Test',
        weight: DEFAULT_TECHNOLOGY_WEIGHT,
        projects: [],
      };

      await technologyController.delete(technology.id);

      expect(technologyService.delete).toHaveBeenCalledWith(technology.id);
      expect(technologyService.delete).toHaveBeenCalledTimes(1);
    });
  });
});
