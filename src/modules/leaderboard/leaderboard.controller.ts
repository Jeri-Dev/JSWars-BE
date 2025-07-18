import { Controller, Get, Query, Req } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger"
import { type Request } from "npm:@types/express"
import { LeaderboardService } from "./leaderboard.service.ts"
import { LeaderboardQueryDto } from "./dto/leaderboard-query.dto.ts"
import { LeaderboardResponseDto } from "./dto/leaderboard-response.dto.ts"
import { IsPublic } from "@/decorators/IsPublic.ts"

@ApiTags("Leaderboard")
@Controller("leaderboard")
export class LeaderboardController {
	constructor(private readonly leaderboardService: LeaderboardService) {}

	@Get()
	@IsPublic()
	@ApiOperation({ summary: "Get leaderboard ranking" })
	@ApiQuery({ name: "page", required: false, description: "Page number" })
	@ApiQuery({ name: "limit", required: false, description: "Items per page" })
	@ApiResponse({ 
		status: 200, 
		description: "Leaderboard retrieved successfully",
		type: LeaderboardResponseDto
	})
	async getLeaderboard(@Query() query: LeaderboardQueryDto) {
		return this.leaderboardService.getLeaderboard(query)
	}

	@Get("me")
	@ApiOperation({ summary: "Get current user's ranking" })
	@ApiResponse({ 
		status: 200, 
		description: "User ranking retrieved successfully"
	})
	async getUserRanking(@Req() req: Request) {
		if (!req.user) {
			return {
				rank: null,
				totalPoints: 0,
				totalUsers: 0,
			}
		}
		return this.leaderboardService.getUserRanking(req.user.id)
	}
}