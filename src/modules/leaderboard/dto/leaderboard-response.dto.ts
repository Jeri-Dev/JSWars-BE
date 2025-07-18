import { ApiProperty } from "@nestjs/swagger"

export class LeaderboardEntryDto {
	@ApiProperty({ description: "User ID" })
	id: string

	@ApiProperty({ description: "Username" })
	userName: string

	@ApiProperty({ description: "First name" })
	firstName: string

	@ApiProperty({ description: "Last name" })
	lastName: string

	@ApiProperty({ description: "Profile picture URL", nullable: true })
	picture?: string | null

	@ApiProperty({ description: "Total points from all wars" })
	totalPoints: number

	@ApiProperty({ description: "Position in the leaderboard" })
	rank: number
}

export class LeaderboardResponseDto {
	@ApiProperty({ description: "List of leaderboard entries", type: [LeaderboardEntryDto] })
	leaderboard: LeaderboardEntryDto[]

	@ApiProperty({ description: "Total number of users in leaderboard" })
	totalUsers: number

	@ApiProperty({ description: "Current page number" })
	currentPage: number

	@ApiProperty({ description: "Total number of pages" })
	totalPages: number
}