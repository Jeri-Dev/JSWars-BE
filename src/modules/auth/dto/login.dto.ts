import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "npm:class-transformer"
import { IsNotEmpty, IsString } from "npm:class-validator"

export class LoginDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@Transform(({ value }) => value.toLowerCase())
	email: string

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	password: string
}
