import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty } from "npm:class-validator"

export class JoinWarDto {
	@ApiProperty({ description: "War ID to join" })
	@IsString()
	@IsNotEmpty()
	warId: string
}