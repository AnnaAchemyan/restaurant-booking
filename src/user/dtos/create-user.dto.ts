import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ type: String, required: true, description: 'Firstname' })
  @Length(1, 20)
  @IsString()
  firstName: string;

  @ApiProperty({ type: String, required: true, description: 'Lastname' })
  @Length(1, 20)
  @IsString()
  lastName: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Email should be real email address',
    example: 'namesurname@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description:
      'Password has to match a regular expression:  /^(?=.*[A-Za-z])(?=.*\\d).{8,}$/',
    example: 'pass9876',
  })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, {
    message:
      'Password should contain minimum eight characters, at least one letter and one number',
  })
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPhoneNumber('AM')
  phone: string;
}
