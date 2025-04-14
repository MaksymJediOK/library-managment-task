import { Module } from '@nestjs/common'
import { PrismaModule } from './prisma/prisma.module'
import { BookModule } from './book/book.module'
import { MemberModule } from './member/member.module'
import { BorrowingModule } from './borrowing/borrowing.module'

@Module({
  imports: [PrismaModule, BookModule, MemberModule, BorrowingModule],
})
export class AppModule {}
