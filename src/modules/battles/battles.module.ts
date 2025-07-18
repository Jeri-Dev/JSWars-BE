import { Module } from "@nestjs/common"
import { BattlesController } from "./battles.controller.ts"
import { BattlesService } from "./battles.service.ts"
import { BattleRepository } from "@/repos/Battle.repo.ts"
import { BattlesError } from "@/errors/battles.error.ts"
import { AuthError } from "@/errors/auth.error.ts"

@Module({
	controllers: [BattlesController],
	providers: [BattlesService, BattleRepository, BattlesError, AuthError],
	exports: [BattlesService, BattleRepository],
})
export class BattlesModule {}