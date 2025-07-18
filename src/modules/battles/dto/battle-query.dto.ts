import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsNumber, Min, Max } from "npm:class-validator"
import { Type } from "npm:class-transformer"

export class BattleQueryDto {
	@ApiPropertyOptional({ description: "Page number", minimum: 1, default: 1 })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(1)
	page?: number = 1

	@ApiPropertyOptional({ description: "Number of items per page", minimum: 1, maximum: 100, default: 10 })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(1)
	@Max(100)
	limit?: number = 10
}