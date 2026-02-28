import { IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class PresignRequestDto {
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    filename!: string;

    @IsString()
    @MinLength(1)
    @MaxLength(200)
    contentType!: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    size?: number;
}