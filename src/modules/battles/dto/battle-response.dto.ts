import { ApiProperty } from "@nestjs/swagger"

export class BattleResponseDto {
	@ApiProperty({ description: "Battle ID" })
	id: string

	@ApiProperty({ description: "Battle name" })
	name: string

	@ApiProperty({ description: "Battle description" })
	description: string

	@ApiProperty({ description: "Problem code base" })
	problem: string

	@ApiProperty({ description: "Date when battle was created" })
	createdAt: Date

	@ApiProperty({ description: "Date when battle was last updated" })
	updatedAt: Date
}