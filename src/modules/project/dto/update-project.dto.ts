import { IsOptional } from 'class-validator';
import { TechnologyType } from 'src/modules/technology/types/technology.type';

export class UpdateProjectDto {
  @IsOptional()
  readonly name?: string;

  @IsOptional()
  readonly description?: string;

  @IsOptional()
  readonly repository_url?: string;

  @IsOptional()
  readonly url?: string;

  @IsOptional()
  readonly weight?: number;

  @IsOptional()
  technologyNamesList?: TechnologyType['name'][];
}
