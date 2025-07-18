import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty, IsOptional } from "npm:class-validator"

export class UpdateBattleDto {
	@ApiProperty({ description: "Battle name", required: false })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	name?: string

	@ApiProperty({ description: "Battle description", required: false })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	description?: string

	@ApiProperty({ description: "Problem code base", required: false })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	problem?: string
}