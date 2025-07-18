import { Injectable } from "@nestjs/common"
import { BattleRepository } from "@/repos/Battle.repo.ts"
import { BattlesError } from "@/errors/battles.error.ts"
import { CreateBattleDto } from "./dto/create-battle.dto.ts"
import { UpdateBattleDto } from "./dto/update-battle.dto.ts"
import { BattleQueryDto } from "./dto/battle-query.dto.ts"
import BATTLES from '@messages/Battles.json' with { type : "json"}

@Injectable()
export class BattlesService {
	constructor(
		private readonly battleRepository: BattleRepository,
		private readonly battlesError: BattlesError,
	) {}

	async createBattle(createBattleDto: CreateBattleDto) {
		const { name, description, problem } = createBattleDto

		const battle = await this.battleRepository.createBattle({
			name,
			description,
			problem,
		})

		return {
			...battle,
			message: BATTLES.BATTLE_CREATED_SUCCESS,
		}
	}

	async getBattle(battleId: string) {
		const battle = await this.battleRepository.findBattleById(battleId)
		if (!battle) {
			throw this.battlesError.battleNotFound()
		}

		return battle
	}

	async getBattles(query: BattleQueryDto) {
		const { page = 1, limit = 10 } = query
		const skip = (page - 1) * limit

    console.log(skip, limit)

		const [battles, totalCount] = await Promise.all([
			this.battleRepository.findAllBattles(skip, limit),
			this.battleRepository.countBattles(),
		])

		const totalPages = Math.ceil(totalCount / limit)

		return {
			battles,
			pagination: {
				currentPage: page,
				totalPages,
				totalCount,
				hasNextPage: page < totalPages,
				hasPreviousPage: page > 1,
			},
		}
	}

	async updateBattle(battleId: string, updateBattleDto: UpdateBattleDto) {
		const battle = await this.battleRepository.findBattleById(battleId)
		if (!battle) {
			throw this.battlesError.battleNotFound()
		}

		const updatedBattle = await this.battleRepository.updateBattle(
			battleId,
			updateBattleDto,
		)

		return {
			...updatedBattle,
			message: BATTLES.BATTLE_UPDATED_SUCCESS,
		}
	}

	async deleteBattle(battleId: string) {
		const battle = await this.battleRepository.findBattleById(battleId)
		if (!battle) {
			throw this.battlesError.battleNotFound()
		}

		await this.battleRepository.deleteBattle(battleId)

		return {
			message: BATTLES.BATTLE_DELETED_SUCCESS,
		}
	}
}