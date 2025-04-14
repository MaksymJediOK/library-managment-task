import { IsString, IsOptional, IsNotEmpty } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class SearchBooksDto {
  @ApiPropertyOptional({
    description: 'Search by book title (case-insensitive, partial match)',
    example: 'Great Gatsby',
  })
  @IsString()
  @IsOptional()
  title?: string

  @ApiPropertyOptional({
    description: 'Search by author name (case-insensitive, partial match)',
    example: 'Fitzgerald',
  })
  @IsString()
  @IsOptional()
  author?: string
}
