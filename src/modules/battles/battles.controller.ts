import { Controller, Post, Get, Put, Delete, Body, Param, Query, Req } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from "@nestjs/swagger"
import { type Request } from "npm:@types/express"
import { BattlesService } from "./battles.service.ts"
import { CreateBattleDto } from "./dto/create-battle.dto.ts"
import { UpdateBattleDto } from "./dto/update-battle.dto.ts"
import { BattleQueryDto } from "./dto/battle-query.dto.ts"
import { BattleResponseDto } from "./dto/battle-response.dto.ts"
import { AuthError } from "@/errors/auth.error.ts"
import { IsPublic } from "@/decorators/IsPublic.ts"

@ApiTags("Battles")
@Controller("battles")
export class BattlesController {
	constructor(
		private readonly battlesService: BattlesService,
		private readonly authError: AuthError,
	) {}

	@Post()
	@ApiOperation({ summary: "Create a new battle" })
	@ApiResponse({ 
		status: 201, 
		description: "Battle created successfully",
		type: BattleResponseDto
	})
	async createBattle(
		@Req() req: Request,
		@Body() createBattleDto: CreateBattleDto,
	) {
		if (!req.user) {
			throw this.authError.unauthorized()
		}
		return this.battlesService.createBattle(createBattleDto)
	}

	@Get()
	@IsPublic()
	@ApiOperation({ summary: "Get all battles with pagination" })
	@ApiQuery({ name: "page", required: false, description: "Page number" })
	@ApiQuery({ name: "limit", required: false, description: "Items per page" })
	@ApiResponse({ 
		status: 200, 
		description: "Battles retrieved successfully",
		type: [BattleResponseDto]
	})
	async getBattles(@Query() query: BattleQueryDto) {
		return this.battlesService.getBattles(query)
	}

	@Get(":battleId")
	@IsPublic()
	@ApiOperation({ summary: "Get battle by ID" })
	@ApiParam({ name: "battleId", description: "Battle ID" })
	@ApiResponse({ 
		status: 200, 
		description: "Battle retrieved successfully",
		type: BattleResponseDto
	})
	async getBattle(@Param("battleId") battleId: string) {
		return this.battlesService.getBattle(battleId)
	}

	@Put(":battleId")
	@ApiOperation({ summary: "Update a battle" })
	@ApiParam({ name: "battleId", description: "Battle ID" })
	@ApiResponse({ 
		status: 200, 
		description: "Battle updated successfully",
		type: BattleResponseDto
	})
	async updateBattle(
		@Req() req: Request,
		@Param("battleId") battleId: string,
		@Body() updateBattleDto: UpdateBattleDto,
	) {
		if (!req.user) {
			throw this.authError.unauthorized()
		}
		return this.battlesService.updateBattle(battleId, updateBattleDto)
	}

	@Delete(":battleId")
	@ApiOperation({ summary: "Delete a battle" })
	@ApiParam({ name: "battleId", description: "Battle ID" })
	@ApiResponse({ status: 200, description: "Battle deleted successfully" })
	async deleteBattle(
		@Req() req: Request,
		@Param("battleId") battleId: string,
	) {
		if (!req.user) {
			throw this.authError.unauthorized()
		}
		return this.battlesService.deleteBattle(battleId)
	}
}