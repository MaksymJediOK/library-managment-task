import { ApiProperty } from '@nestjs/swagger'

class BorrowedBookDto {
  @ApiProperty({
    description: 'Title of the borrowed book',
    example: 'The Great Gatsby',
  })
  title: string

  @ApiProperty({
    description: 'Date when the book was borrowed',
    example: '2024-02-01T00:00:00.000Z',
  })
  borrowDate: Date

  constructor(book: { title: string; borrowDate: Date }) {
    this.title = book.title
    this.borrowDate = book.borrowDate
  }
}

export class MemberResponseDto {
  @ApiProperty({
    description: 'Full name of the member',
    example: 'John Doe',
  })
  fullName: string

  @ApiProperty({
    description: 'Email address of the member',
    example: 'john.doe@example.com',
  })
  email: string

  @ApiProperty({
    description: 'List of currently borrowed books',
    type: [BorrowedBookDto],
  })
  borrowedBooks: BorrowedBookDto[]

  constructor(member: {
    fullName: string
    email: string
    borrowings: {
      book: { title: string }
      borrowDate: Date
      returnDate: Date | null
    }[]
  }) {
    this.fullName = member.fullName
    this.email = member.email
    this.borrowedBooks = member.borrowings
      .filter((borrowing) => !borrowing.returnDate)
      .map(
        (borrowing) =>
          new BorrowedBookDto({
            title: borrowing.book.title,
            borrowDate: borrowing.borrowDate,
          }),
      )
  }
}
