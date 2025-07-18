import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty, MinLength } from "npm:class-validator"

export class ChangePasswordDto {
	@ApiProperty({ description: "Current password" })
	@IsString()
	@IsNotEmpty()
	oldPassword: string

	@ApiProperty({ description: "New password", minLength: 8 })
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	newPassword: string
}
