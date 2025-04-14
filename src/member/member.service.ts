import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateMemberDto } from './dto/create-member.dto'
import { MemberResponseDto } from './dto/member-response.dto'

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  async create(createMemberDto: CreateMemberDto) {
    const existingMember = await this.prisma.member.findUnique({
      where: { email: createMemberDto.email },
    })

    if (existingMember) {
      throw new ConflictException('A member with this email already exists')
    }

    const memberId = `M${Date.now().toString().slice(-5)}`

    const member = await this.prisma.member.create({
      data: {
        ...createMemberDto,
        memberId,
      },
      include: {
        borrowings: {
          where: {
            returnDate: null,
          },
          include: {
            book: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    })

    return new MemberResponseDto(member)
  }

  async findOne(id: number) {
    const member = await this.prisma.member.findUnique({
      where: { id },
      include: {
        borrowings: {
          where: {
            returnDate: null,
          },
          include: {
            book: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    })

    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`)
    }

    return new MemberResponseDto(member)
  }

  async findByMemberId(memberId: string) {
    const member = await this.prisma.member.findUnique({
      where: { memberId },
      include: {
        borrowings: {
          where: {
            returnDate: null,
          },
          include: {
            book: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    })

    if (!member) {
      throw new NotFoundException(`Member with memberId ${memberId} not found`)
    }

    return new MemberResponseDto(member)
  }
}
