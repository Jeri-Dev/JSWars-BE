import { ApiProperty } from "npm:@nestjs/swagger"
import {
	IsNotEmpty,
	IsString,
	IsEmail,
	IsOptional,
	Matches,
} from "npm:class-validator"
import { Transform } from "npm:class-transformer"

export class CreateUserDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	firstName: string

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	lastName: string

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	userName: string

	@ApiProperty()
	@IsEmail()
	@IsNotEmpty()
	@Transform(({ value }) => value.toLowerCase())
	email: string

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	password: string

	@ApiProperty()
	@IsString()
	@IsOptional()
	picture: string
}
