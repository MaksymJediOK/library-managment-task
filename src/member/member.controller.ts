import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { MemberService } from './member.service'
import { CreateMemberDto } from './dto/create-member.dto'
import { MemberResponseDto } from './dto/member-response.dto'
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger'

@ApiTags('members')
@Controller('members')
@UsePipes(new ValidationPipe())
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new member' })
  @ApiResponse({
    status: 201,
    description: 'The member has been successfully registered.',
    type: MemberResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Invalid input data.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict. A member with this email already exists.',
  })
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.memberService.create(createMemberDto)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get member details by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the member',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Return the member details with currently borrowed books.',
    type: MemberResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Member not found.',
  })
  findOne(@Param('id') id: string) {
    return this.memberService.findOne(+id)
  }

  @Get('member-id/:memberId')
  @ApiOperation({ summary: 'Get member details by member ID' })
  @ApiParam({
    name: 'memberId',
    description: 'The member ID',
    example: 'M12345',
  })
  @ApiResponse({
    status: 200,
    description: 'Return the member details with currently borrowed books.',
    type: MemberResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Member not found.',
  })
  findByMemberId(@Param('memberId') memberId: string) {
    return this.memberService.findByMemberId(memberId)
  }
}
