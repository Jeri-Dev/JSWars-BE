import { Injectable } from "@nestjs/common"
import { PrismaService } from "@shared/services/prisma.service.ts"
import { StandardRepository } from "@shared/standard/repository.ts"
import { Battle } from "@database/client.ts"

@Injectable()
export class BattleRepository extends StandardRepository<Battle> {
	constructor(private readonly prisma: PrismaService) {
		super(prisma.battle)
	}

	async createBattle(data: {
		name: string
		description: string
		problem: string
	}) {
		return await this.prisma.battle.create({
			data,
		})
	}

	async findBattleById(battleId: string) {
		return await this.prisma.battle.findUnique({
			where: { id: battleId },
		})
	}

	async findAllBattles(skip: number = 0, take: number = 10) {
		return await this.prisma.battle.findMany({
			take: Number(take),
			skip: Number(skip),
		})
	}

	async countBattles() {
		return await this.prisma.battle.count()
	}

	async updateBattle(
		battleId: string,
		data: {
			name?: string
			description?: string
			problem?: string
		},
	) {
		return await this.prisma.battle.update({
			where: { id: battleId },
			data,
		})
	}

	async deleteBattle(battleId: string) {
		return await this.prisma.battle.delete({
			where: { id: battleId },
		})
	}
}
