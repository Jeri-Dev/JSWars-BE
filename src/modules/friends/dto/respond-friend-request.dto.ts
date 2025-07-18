import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty, IsIn } from "npm:class-validator"

export class RespondFriendRequestDto {
	@ApiProperty({ description: "Response to friend request", enum: ["accept", "reject"] })
	@IsString()
	@IsNotEmpty()
	@IsIn(["accept", "reject"])
	response: "accept" | "reject"
}