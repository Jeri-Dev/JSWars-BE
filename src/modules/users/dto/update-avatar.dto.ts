import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty, IsUrl } from "npm:class-validator"

export class UpdateAvatarDto {
	@ApiProperty({ description: "Avatar URL", example: "https://example.com/avatar.jpg" })
	@IsString()
	@IsNotEmpty()
	@IsUrl()
	avatarUrl: string
}