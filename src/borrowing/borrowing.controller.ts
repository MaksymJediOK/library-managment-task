import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { BorrowingService } from './borrowing.service'
import { BorrowBookDto } from './dto/borrow-book.dto'
import { BookResponseDto } from '../book/dto/book-response.dto'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'

@ApiTags('borrowings')
@Controller('borrowings')
@UsePipes(new ValidationPipe())
export class BorrowingController {
  constructor(private readonly borrowingService: BorrowingService) {}

  @Post('borrow')
  @ApiOperation({ summary: 'Borrow a book' })
  @ApiResponse({
    status: 201,
    description: 'The book has been successfully borrowed.',
    type: BookResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. No copies available.',
  })
  @ApiResponse({
    status: 404,
    description: 'Member or book not found.',
  })
  @ApiResponse({
    status: 409,
    description: 'Member already has this book borrowed.',
  })
  borrowBook(@Body() borrowBookDto: BorrowBookDto) {
    return this.borrowingService.borrowBook(borrowBookDto)
  }

  @Post('return')
  @ApiOperation({ summary: 'Return a book' })
  @ApiResponse({
    status: 201,
    description: 'The book has been successfully returned.',
    type: BookResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Member, book, or active borrowing not found.',
  })
  returnBook(@Body() borrowBookDto: BorrowBookDto) {
    return this.borrowingService.returnBook(borrowBookDto)
  }
}
