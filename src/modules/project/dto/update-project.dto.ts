import { IsOptional } from 'class-validator';

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
}
