import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty, IsArray, IsOptional } from "npm:class-validator"

export class CreateWarDto {
	@ApiProperty({ description: "Battle ID to use for this war" })
	@IsString()
	@IsNotEmpty()
	battleId: string

	@ApiProperty({ description: "Optional code shared among participants", required: false })
	@IsOptional()
	@IsString()
	code?: string

	@ApiProperty({ description: "List of friend usernames to invite", required: false })
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	invitedFriends?: string[]
}