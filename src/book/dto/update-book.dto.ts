import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsInt,
  Min,
} from 'class-validator'

export class UpdateBookDto {
  @ApiProperty({
    description: 'The title of the book',
    example: 'The Great Gatsby',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string

  @ApiProperty({
    description: 'The author of the book',
    example: 'F. Scott Fitzgerald',
    required: false,
  })
  @IsString()
  @IsOptional()
  author?: string

  @ApiProperty({
    description: 'Total number of copies in the library',
    example: 5,
    required: false,
  })
  @IsNumber()
  @IsInt()
  @Min(0)
  @IsOptional()
  totalCopies?: number

  @ApiProperty({
    description: 'Description of the book',
    example: 'A story of the fabulously wealthy Jay Gatsby...',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({
    description: 'List of genre IDs associated with the book',
    example: [1, 2],
    required: false,
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  genreIds?: number[]
}
