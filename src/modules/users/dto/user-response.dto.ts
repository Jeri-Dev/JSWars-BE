import { ApiProperty } from "@nestjs/swagger"

export class UserResponseDto {
	@ApiProperty({ description: "User ID" })
	id: string

	@ApiProperty({ description: "Username" })
	userName: string

	@ApiProperty({ description: "First name" })
	firstName: string

	@ApiProperty({ description: "Last name" })
	lastName: string

	@ApiProperty({ description: "Email address" })
	email: string

	@ApiProperty({ description: "Profile picture filename", required: false })
	picture?: string

	@ApiProperty({ description: "Account creation date" })
	createdAt: Date

	@ApiProperty({ description: "Last update date" })
	updatedAt: Date
}