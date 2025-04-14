import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateBookDto } from './dto/create-book.dto'
import { UpdateBookDto } from './dto/update-book.dto'
import { BookResponseDto } from './dto/book-response.dto'
import { SearchBooksDto } from './dto/search-books.dto'
import { Prisma } from '@prisma/client'

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    const existingBook = await this.prisma.book.findUnique({
      where: { isbn: createBookDto.isbn },
    })

    if (existingBook) {
      throw new ConflictException('A book with this ISBN already exists')
    }

    const genres = await this.prisma.genre.findMany({
      where: {
        id: {
          in: createBookDto.genreIds,
        },
      },
    })

    if (genres.length !== createBookDto.genreIds.length) {
      throw new NotFoundException('One or more genres not found')
    }

    const book = await this.prisma.book.create({
      data: {
        title: createBookDto.title,
        author: createBookDto.author,
        isbn: createBookDto.isbn,
        totalCopies: createBookDto.totalCopies,
        description: createBookDto.description,
        genres: {
          create: createBookDto.genreIds.map((genreId) => ({
            genre: {
              connect: { id: genreId },
            },
          })),
        },
      },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        borrowings: {
          where: {
            returnDate: null,
          },
        },
      },
    })

    return new BookResponseDto(book)
  }

  async findAll() {
    const books = await this.prisma.book.findMany({
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        borrowings: {
          where: {
            returnDate: null,
          },
        },
      },
    })

    return books.map((book) => new BookResponseDto(book))
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        borrowings: {
          where: {
            returnDate: null,
          },
        },
      },
    })

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`)
    }

    return new BookResponseDto(book)
  }

  async search(searchDto: SearchBooksDto) {
    const where: Prisma.BookWhereInput = {
      AND: [
        searchDto.title
          ? {
              title: {
                contains: searchDto.title,
                mode: Prisma.QueryMode.insensitive,
              },
            }
          : {},
        searchDto.author
          ? {
              author: {
                contains: searchDto.author,
                mode: Prisma.QueryMode.insensitive,
              },
            }
          : {},
      ].filter((condition) => Object.keys(condition).length > 0),
    }

    const books = await this.prisma.book.findMany({
      where,
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        borrowings: {
          where: {
            returnDate: null,
          },
        },
      },
    })

    return books.map((book) => new BookResponseDto(book))
  }

  async updateBook(
    isbn: string,
    updateBookDto: UpdateBookDto,
  ): Promise<BookResponseDto> {
    const book = await this.prisma.book.findUnique({
      where: { isbn },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        borrowings: {
          where: {
            returnDate: null,
          },
        },
      },
    })

    if (!book) {
      throw new NotFoundException(`Book with ISBN ${isbn} not found`)
    }

    const { genreIds, ...updateData } = updateBookDto

    const updatedBook = await this.prisma.book.update({
      where: { isbn },
      data: {
        ...updateData,
        genres: genreIds
          ? {
              deleteMany: {},
              create: genreIds.map((genreId) => ({
                genre: {
                  connect: { id: genreId },
                },
              })),
            }
          : undefined,
      },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        borrowings: {
          where: {
            returnDate: null,
          },
        },
      },
    })

    return new BookResponseDto(updatedBook)
  }

  async deleteBook(isbn: string): Promise<void> {
    const book = await this.prisma.book.findUnique({
      where: { isbn },
      include: {
        borrowings: {
          where: {
            returnDate: null,
          },
        },
      },
    })

    if (!book) {
      throw new NotFoundException(`Book with ISBN ${isbn} not found`)
    }

    if (book.borrowings.length > 0) {
      throw new ConflictException(
        `Cannot delete book with ISBN ${isbn} as it is currently borrowed`,
      )
    }

    await this.prisma.book.delete({
      where: { isbn },
    })
  }
}
