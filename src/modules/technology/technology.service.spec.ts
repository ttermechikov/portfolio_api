import { Test, TestingModule } from '@nestjs/testing';
import { TechnologyService } from './technology.service';
import { TechnologyEntity } from './technology.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TechnologyType } from './types/technology.type';
import { CreateTechnologyDto } from './dto/create-technology.dto';

describe('TechnologyService', () => {
  let technologyService: TechnologyService;
  let technologyRepository: Repository<TechnologyEntity>;

  const mockFindResponse: TechnologyType[] = [
    {
      id: 1,
      name: 'Node.js',
      weight: 1,
      projects: [],
    },
  ];
  const testCreateTechnologyDto: CreateTechnologyDto = {
    name: 'Nest',
    weight: 2,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TechnologyService,
        {
          provide: getRepositoryToken(TechnologyEntity),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    technologyService = module.get<TechnologyService>(TechnologyService);
    technologyRepository = module.get<Repository<TechnologyEntity>>(
      getRepositoryToken(TechnologyEntity),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(technologyService).toBeDefined();
    expect(technologyRepository).toBeDefined();
  });

  it('findAll', async () => {
    technologyRepository.find = jest
      .fn()
      .mockResolvedValue([...mockFindResponse]);

    const response = await technologyService.findAll();

    expect(technologyRepository.find).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ technologies: mockFindResponse });
  });

  it('create', async () => {
    const createDto = { ...testCreateTechnologyDto };
    const created = new TechnologyEntity();

    await technologyService.create(createDto);

    expect(technologyRepository.save).toHaveBeenCalledTimes(1);
    expect(technologyRepository.save).toHaveBeenCalledWith({
      ...created,
      ...createDto,
    });
  });

  it('update', async () => {
    const updateDto = { name: 'updated' };
    const updatingTechnology = { ...mockFindResponse[0] };
    technologyRepository.findOne = jest
      .fn()
      .mockResolvedValueOnce(updatingTechnology);

    await technologyService.update(updatingTechnology.id, updateDto);

    expect(technologyRepository.save).toHaveBeenCalledTimes(1);
    expect(technologyRepository.save).toHaveBeenCalledWith({
      ...updatingTechnology,
      ...updateDto,
    });
  });
});
