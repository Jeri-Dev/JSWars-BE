import { Module } from "@nestjs/common"
import { LeaderboardController } from "./leaderboard.controller.ts"
import { LeaderboardService } from "./leaderboard.service.ts"
import { WarsRepository } from "@/repos/Wars.repo.ts"

@Module({
	controllers: [LeaderboardController],
	providers: [LeaderboardService, WarsRepository],
	exports: [LeaderboardService],
})
export class LeaderboardModule {}