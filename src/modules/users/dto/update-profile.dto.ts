import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty, IsOptional } from "npm:class-validator"

export class UpdateProfileDto {
	@ApiProperty({ description: "First name", required: false })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	firstName?: string

	@ApiProperty({ description: "Last name", required: false })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	lastName?: string

	@ApiProperty({ description: "Username", required: false })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	userName?: string
}
