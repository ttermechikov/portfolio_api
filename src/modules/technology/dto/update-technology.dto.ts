import { IsOptional } from 'class-validator';

export class UpdateTechnologyDto {
  @IsOptional()
  readonly name?: string;

  @IsOptional()
  readonly weight?: number;
}
