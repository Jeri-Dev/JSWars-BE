import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty } from "npm:class-validator"

export class SendFriendRequestDto {
	@ApiProperty({ description: "Username or email of the user to send friend request to" })
	@IsString()
	@IsNotEmpty()
	userIdentifier: string
}