import { Controller, Post, Get, Patch, Body, Param, Req } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger"
import { type Request } from "npm:@types/express"
import { WarsService } from "./wars.service.ts"
import { CreateWarDto } from "./dto/create-war.dto.ts"
import { JoinWarDto } from "./dto/join-war.dto.ts"
import { UpdatePointsDto } from "./dto/update-points.dto.ts"
import { WarResponseDto } from "./dto/war-response.dto.ts"
import { AuthError } from "@/errors/auth.error.ts"

@ApiTags("Wars")
@Controller("wars")
export class WarsController {
	constructor(
		private readonly warsService: WarsService,
		private readonly authError: AuthError,
	) {}

	@Post()
	@ApiOperation({ summary: "Create a new war" })
	@ApiResponse({ 
		status: 201, 
		description: "War created successfully",
		type: WarResponseDto
	})
	async createWar(
		@Req() req: Request,
		@Body() createWarDto: CreateWarDto,
	) {
		if (!req.user) {
			throw this.authError.unauthorized()
		}
		return this.warsService.createWar(req.user.id, createWarDto)
	}

	@Post("join")
	@ApiOperation({ summary: "Join an existing war" })
	@ApiResponse({ status: 200, description: "Successfully joined the war" })
	async joinWar(
		@Req() req: Request,
		@Body() joinWarDto: JoinWarDto,
	) {
		if (!req.user) {
			throw this.authError.unauthorized()
		}
		return this.warsService.joinWar(req.user.id, joinWarDto)
	}

	@Get("my")
	@ApiOperation({ summary: "Get user's wars" })
	@ApiResponse({ 
		status: 200, 
		description: "User wars retrieved successfully",
		type: [WarResponseDto]
	})
	async getUserWars(@Req() req: Request) {
		if (!req.user) {
			throw this.authError.unauthorized()
		}
		return this.warsService.getUserWars(req.user.id)
	}

	@Get(":warId")
	@ApiOperation({ summary: "Get war details" })
	@ApiParam({ name: "warId", description: "War ID" })
	@ApiResponse({ 
		status: 200, 
		description: "War details retrieved successfully",
		type: WarResponseDto
	})
	async getWar(@Param("warId") warId: string) {
		return this.warsService.getWar(warId)
	}

	@Patch(":warId/points")
	@ApiOperation({ summary: "Update points in a war" })
	@ApiParam({ name: "warId", description: "War ID" })
	@ApiResponse({ status: 200, description: "Points updated successfully" })
	async updatePoints(
		@Req() req: Request,
		@Param("warId") warId: string,
		@Body() updatePointsDto: UpdatePointsDto,
	) {
		if (!req.user) {
			throw this.authError.unauthorized()
		}
		return this.warsService.updatePoints(req.user.id, warId, updatePointsDto)
	}

	@Patch(":warId/finish")
	@ApiOperation({ summary: "Finish a war" })
	@ApiParam({ name: "warId", description: "War ID" })
	@ApiResponse({ status: 200, description: "War finished successfully" })
	async finishWar(
		@Req() req: Request,
		@Param("warId") warId: string,
	) {
		if (!req.user) {
			throw this.authError.unauthorized()
		}
		return this.warsService.finishWar(req.user.id, warId)
	}
}