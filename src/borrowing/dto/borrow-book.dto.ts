import { IsString, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class BorrowBookDto {
  @ApiProperty({
    description: 'The member ID of the borrower',
    example: 'M12345',
  })
  @IsString()
  @IsNotEmpty()
  memberId: string

  @ApiProperty({
    description: 'The ISBN of the book to borrow',
    example: '9780743273565',
  })
  @IsString()
  @IsNotEmpty()
  isbn: string
}
