import {
  IsString,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class createTaskDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  readonly category: string;

  @IsOptional()
  @IsBoolean()
  readonly completed: boolean;

  @IsDate()
  @IsNotEmpty()
  readonly dueDate: Date;
}
