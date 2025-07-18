import { Module } from "@nestjs/common"
import { WarsController } from "./wars.controller.ts"
import { WarsService } from "./wars.service.ts"
import { WarsRepository } from "@/repos/Wars.repo.ts"
import { UserRepository } from "@/repos/User.repo.ts"
import { BattleRepository } from "@/repos/Battle.repo.ts"
import { AuthError } from "@/errors/auth.error.ts"
import { WarsError } from "@/errors/wars.error.ts"
import { BattlesError } from "@/errors/battles.error.ts"

@Module({
	controllers: [WarsController],
	providers: [WarsService, WarsRepository, UserRepository, BattleRepository, AuthError, WarsError, BattlesError],
	exports: [WarsService, WarsRepository],
})
export class WarsModule {}