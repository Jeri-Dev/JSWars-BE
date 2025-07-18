import { ApiProperty } from "@nestjs/swagger"

export class FriendResponseDto {
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

	@ApiProperty({ description: "Friendship status" })
	status: "pending" | "accepted"

	@ApiProperty({ description: "Date when friendship was created" })
	createdAt: Date
}