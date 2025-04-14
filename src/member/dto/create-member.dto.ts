import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateMemberDto {
  @ApiProperty({
    description: 'Full name of the member',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string

  @ApiProperty({
    description: 'Email address of the member',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiPropertyOptional({
    description: 'Phone number of the member',
    example: '+1234567890',
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string
}
