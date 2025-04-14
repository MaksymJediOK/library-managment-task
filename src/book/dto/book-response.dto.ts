import { ApiProperty } from '@nestjs/swagger'
import { Book as PrismaBook, Genre as PrismaGenre } from '@prisma/client'

export class BookResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the book',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'The title of the book',
    example: 'The Great Gatsby',
  })
  title: string

  @ApiProperty({
    description: 'The author of the book',
    example: 'F. Scott Fitzgerald',
  })
  author: string

  @ApiProperty({
    description: 'The ISBN of the book',
    example: '9780743273565',
  })
  isbn: string

  @ApiProperty({
    description: 'Total number of copies in the library',
    example: 5,
  })
  totalCopies: number

  @ApiProperty({
    description: 'Description of the book',
    example: 'A story of the fabulously wealthy Jay Gatsby...',
    required: false,
  })
  description?: string

  @ApiProperty({
    description: 'List of genres associated with the book',
    type: [Object],
    example: [
      { id: 1, name: 'Fiction' },
      { id: 2, name: 'Classic' },
    ],
  })
  genres: PrismaGenre[]

  @ApiProperty({
    description: 'Availability status of the book',
    example: '3 of 5 available',
  })
  availability: string

  constructor(
    book: PrismaBook & {
      genres: { genre: PrismaGenre }[]
      borrowings: { id: number }[]
    },
  ) {
    this.id = book.id
    this.title = book.title
    this.author = book.author
    this.isbn = book.isbn
    this.totalCopies = book.totalCopies
    this.description = book.description ?? undefined
    this.genres = book.genres.map((g) => g.genre)

    const borrowedCount = book.borrowings.length
    const availableCount = book.totalCopies - borrowedCount
    this.availability = `${availableCount} of ${book.totalCopies} available`
  }
}
