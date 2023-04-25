import { IsNotEmpty } from 'class-validator';

export class CreateTechnologyDto {
  @IsNotEmpty()
  readonly name: string;

  readonly weight?: number;
}
