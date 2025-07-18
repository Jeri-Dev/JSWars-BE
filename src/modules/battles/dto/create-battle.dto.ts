import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty } from "npm:class-validator"

export class CreateBattleDto {
	@ApiProperty({ description: "Battle name" })
	@IsString()
	@IsNotEmpty()
	name: string

	@ApiProperty({ description: "Battle description" })
	@IsString()
	@IsNotEmpty()
	description: string

	@ApiProperty({ description: "Problem code base" })
	@IsString()
	@IsNotEmpty()
	problem: string
}