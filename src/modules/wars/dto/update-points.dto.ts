import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsNotEmpty, Min } from "npm:class-validator"

export class UpdatePointsDto {
	@ApiProperty({ description: "Points to add" })
	@IsNumber()
	@IsNotEmpty()
	@Min(0)
	points: number
}