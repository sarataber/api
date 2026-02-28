import { IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(1024)
  key!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  contentType?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  size?: number;
}