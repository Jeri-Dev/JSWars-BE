import { ApiProperty } from "@nestjs/swagger"

export class WarParticipantDto {
	@ApiProperty({ description: "User ID" })
	userId: string

	@ApiProperty({ description: "Username" })
	username: string

	@ApiProperty({ description: "Points in this war" })
	points: number
}

export class BattleInfoDto {
	@ApiProperty({ description: "Battle ID" })
	id: string

	@ApiProperty({ description: "Battle name" })
	name: string

	@ApiProperty({ description: "Battle description" })
	description: string

	@ApiProperty({ description: "Problem code base" })
	problem: string
}

export class WarResponseDto {
	@ApiProperty({ description: "War ID" })
	id: string

	@ApiProperty({ description: "Battle information", type: BattleInfoDto })
	battle: BattleInfoDto

	@ApiProperty({ description: "War status", enum: ["in_progress", "finished"] })
	status: "in_progress" | "finished"

	@ApiProperty({ description: "Winner username", nullable: true })
	winner?: string | null

	@ApiProperty({ description: "Shared code", nullable: true })
	code?: string | null

	@ApiProperty({ description: "Creator username" })
	createdBy: string

	@ApiProperty({ description: "List of participants", type: [WarParticipantDto] })
	participants: WarParticipantDto[]

	@ApiProperty({ description: "Date when war was created" })
	createdAt: Date

	@ApiProperty({ description: "Date when war was last updated" })
	updatedAt: Date
}