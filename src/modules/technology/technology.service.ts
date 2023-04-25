import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TechnologyEntity } from './technology.entity';
import { Repository } from 'typeorm';
import { TechnologiesResponsesInterface } from './types/technologies-response.interface';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
import { TechnologyType } from './types/technology.type';

@Injectable()
export class TechnologyService {
  constructor(
    @InjectRepository(TechnologyEntity)
    private technologyRepository: Repository<TechnologyEntity>,
  ) {}

  async findAll(): Promise<TechnologiesResponsesInterface> {
    const technologies = await this.technologyRepository.find({
      order: {
        weight: 'DESC',
      },
    });
    return { technologies };
  }

  async create(
    createTechnologyDto: CreateTechnologyDto,
  ): Promise<TechnologyEntity> {
    let technology = await this.findByName(createTechnologyDto.name);

    if (technology) {
      return technology;
    }

    technology = new TechnologyEntity();
    Object.assign(technology, createTechnologyDto);

    return await this.technologyRepository.save(technology);
  }

  async update(
    technologyId: number,
    updateTechnologyDto: UpdateTechnologyDto,
  ): Promise<TechnologyEntity> {
    const technology = await this.technologyRepository.findOne({
      where: { id: technologyId },
    });

    Object.assign(technology, updateTechnologyDto);

    return await this.technologyRepository.save(technology);
  }

  async delete(technologyId: TechnologyType['id']) {
    const technology = await this.findById(technologyId);
    if (technology) {
      return await this.technologyRepository.remove(technology);
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  async findOrCreateByName(
    name: TechnologyType['name'],
  ): Promise<TechnologyEntity> {
    const technology = await this.findByName(name);

    if (technology) return technology;

    const createTechnologyDto: CreateTechnologyDto = new TechnologyEntity();
    Object.assign(createTechnologyDto, { name });

    return await this.create(createTechnologyDto);
  }

  async findById(id: TechnologyType['id']) {
    const technology = await this.technologyRepository.findOne({
      where: { id },
    });
    return technology;
  }

  async findByName(name: TechnologyType['name']) {
    const technology = await this.technologyRepository.findOne({
      where: { name },
    });
    return technology;
  }

  buildProjectResponse(technology: TechnologyEntity) {
    return { technology };
  }
}
