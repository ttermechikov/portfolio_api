import { IsNotEmpty } from 'class-validator';
import { TechnologyType } from 'src/modules/technology/types/technology.type';

export class CreateProjectDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly description: string;

  readonly repository_url: string;

  readonly url: string;

  readonly weight: number;

  technologyNamesList: TechnologyType['name'][];
}
