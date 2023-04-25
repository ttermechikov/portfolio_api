import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { TechnologiesResponsesInterface } from './types/technologies-response.interface';
import { TechnologyService } from './technology.service';
import { AuthGuard } from '../user/guards/auth.guard';
import { AdminGuard } from '../user/guards/admin.guard';
import { BackendValidationPipe } from '../../shared/pipes/backend-validation.pipe';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { TechnologyResponseInterface } from './types/technology-response.interface';
import { UpdateTechnologyDto } from './dto/update-technology.dto';

@Controller('technologies')
export class TechnologyController {
  constructor(private technologyService: TechnologyService) {}

  @Get()
  async findAll(): Promise<TechnologiesResponsesInterface> {
    return await this.technologyService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @Body('technology') createTechnologyDto: CreateTechnologyDto,
  ): Promise<TechnologyResponseInterface> {
    const technology = await this.technologyService.create(createTechnologyDto);
    return this.technologyService.buildProjectResponse(technology);
  }

  @Put(':id')
  @UseGuards(AuthGuard, AdminGuard)
  @UsePipes(new BackendValidationPipe())
  async update(
    @Param('id', ParseIntPipe) technologyId: number,
    @Body('technology') updateTechnologyDto: UpdateTechnologyDto,
  ) {
    const technology = await this.technologyService.update(
      technologyId,
      updateTechnologyDto,
    );
    return this.technologyService.buildProjectResponse(technology);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, AdminGuard)
  @UsePipes(new BackendValidationPipe())
  async delete(@Param('id', ParseIntPipe) technologyId: number) {
    return await this.technologyService.delete(technologyId);
  }
}
