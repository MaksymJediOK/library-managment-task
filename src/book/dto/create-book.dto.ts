import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsOptional,
  IsArray,
  IsISBN,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateBookDto {
  @ApiProperty({
    description: 'The title of the book',
    example: 'The Great Gatsby',
  })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({
    description: 'The author of the book',
    example: 'F. Scott Fitzgerald',
  })
  @IsString()
  @IsNotEmpty()
  author: string

  @ApiProperty({
    description: 'The ISBN of the book',
    example: '9780743273565',
  })
  @IsString()
  @IsNotEmpty()
  @IsISBN()
  isbn: string

  @ApiProperty({
    description: 'Total number of copies available in the library',
    example: 5,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  totalCopies: number

  @ApiPropertyOptional({
    description: 'Description of the book',
    example: 'A story of the fabulously wealthy Jay Gatsby...',
  })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({
    description: 'Array of genre IDs',
    example: [1, 2],
    type: [Number],
  })
  @IsArray()
  @IsNotEmpty()
  genreIds: number[]
}
