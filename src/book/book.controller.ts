import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common'
import { BookService } from './book.service'
import { CreateBookDto } from './dto/create-book.dto'
import { UpdateBookDto } from './dto/update-book.dto'
import { BookResponseDto } from './dto/book-response.dto'
import { SearchBooksDto } from './dto/search-books.dto'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger'

@ApiTags('books')
@Controller('books')
@UsePipes(new ValidationPipe())
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({
    status: 201,
    description: 'The book has been successfully created.',
    type: BookResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Invalid input data.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict. A book with this ISBN already exists.',
  })
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all books or search books' })
  @ApiQuery({
    name: 'title',
    required: false,
    description: 'Search by book title (case-insensitive, partial match)',
  })
  @ApiQuery({
    name: 'author',
    required: false,
    description: 'Search by author name (case-insensitive, partial match)',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all books or search results.',
    type: [BookResponseDto],
  })
  findAll(@Query() searchDto: SearchBooksDto = {}) {
    if (searchDto.title || searchDto.author) {
      return this.bookService.search(searchDto)
    }
    return this.bookService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the book',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Return the book with the specified ID.',
    type: BookResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Book not found.',
  })
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(+id)
  }

  @Patch(':isbn')
  @ApiOperation({ summary: 'Update book information' })
  @ApiParam({ name: 'isbn', description: 'ISBN of the book to update' })
  @ApiResponse({
    status: 200,
    description: 'Book updated successfully',
    type: BookResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Book not found' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateBook(
    @Param('isbn') isbn: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<BookResponseDto> {
    return this.bookService.updateBook(isbn, updateBookDto)
  }

  @Delete(':isbn')
  @ApiOperation({ summary: 'Delete a book' })
  @ApiParam({ name: 'isbn', description: 'ISBN of the book to delete' })
  @ApiResponse({ status: 200, description: 'Book deleted successfully' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  @ApiResponse({
    status: 409,
    description: 'Cannot delete book as it is currently borrowed',
  })
  async deleteBook(@Param('isbn') isbn: string): Promise<void> {
    return this.bookService.deleteBook(isbn)
  }
}
