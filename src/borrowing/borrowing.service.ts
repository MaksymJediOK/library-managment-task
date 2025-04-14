import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { BorrowBookDto } from './dto/borrow-book.dto'
import { BookResponseDto } from '../book/dto/book-response.dto'

@Injectable()
export class BorrowingService {
  constructor(private prisma: PrismaService) {}

  async borrowBook(borrowBookDto: BorrowBookDto) {
    const member = await this.prisma.member.findUnique({
      where: { memberId: borrowBookDto.memberId },
    })

    if (!member) {
      throw new NotFoundException(
        `Member with ID ${borrowBookDto.memberId} not found`,
      )
    }

    const book = await this.prisma.book.findUnique({
      where: { isbn: borrowBookDto.isbn },
      include: {
        borrowings: {
          where: {
            returnDate: null,
          },
        },
        genres: {
          include: {
            genre: true,
          },
        },
      },
    })

    if (!book) {
      throw new NotFoundException(
        `Book with ISBN ${borrowBookDto.isbn} not found`,
      )
    }

    if (book.borrowings.length >= book.totalCopies) {
      throw new BadRequestException(
        'No copies of this book are currently available',
      )
    }

    const existingBorrowing = await this.prisma.borrowing.findFirst({
      where: {
        memberId: member.id,
        bookId: book.id,
        returnDate: null,
      },
    })

    if (existingBorrowing) {
      throw new ConflictException(
        'Member already has a copy of this book borrowed',
      )
    }

    await this.prisma.borrowing.create({
      data: {
        memberId: member.id,
        bookId: book.id,
        borrowDate: new Date(),
      },
    })

    const updatedBook = await this.prisma.book.findUnique({
      where: { id: book.id },
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

    return new BookResponseDto(updatedBook!)
  }

  async returnBook(borrowBookDto: BorrowBookDto) {
    const member = await this.prisma.member.findUnique({
      where: { memberId: borrowBookDto.memberId },
    })

    if (!member) {
      throw new NotFoundException(
        `Member with ID ${borrowBookDto.memberId} not found`,
      )
    }

    const book = await this.prisma.book.findUnique({
      where: { isbn: borrowBookDto.isbn },
    })

    if (!book) {
      throw new NotFoundException(
        `Book with ISBN ${borrowBookDto.isbn} not found`,
      )
    }

    const borrowing = await this.prisma.borrowing.findFirst({
      where: {
        memberId: member.id,
        bookId: book.id,
        returnDate: null,
      },
    })

    if (!borrowing) {
      throw new NotFoundException(
        'No active borrowing found for this book and member',
      )
    }

    await this.prisma.borrowing.update({
      where: { id: borrowing.id },
      data: { returnDate: new Date() },
    })

    const updatedBook = await this.prisma.book.findUnique({
      where: { id: book.id },
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

    return new BookResponseDto(updatedBook!)
  }
}
