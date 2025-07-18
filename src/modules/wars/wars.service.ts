import { Injectable } from "@nestjs/common"
import { WarsRepository } from "@/repos/Wars.repo.ts"
import { UserRepository } from "@/repos/User.repo.ts"
import { BattleRepository } from "@/repos/Battle.repo.ts"
import { AuthError } from "@/errors/auth.error.ts"
import { WarsError } from "@/errors/wars.error.ts"
import { BattlesError } from "@/errors/battles.error.ts"
import { CreateWarDto } from "./dto/create-war.dto.ts"
import { JoinWarDto } from "./dto/join-war.dto.ts"
import { UpdatePointsDto } from "./dto/update-points.dto.ts"
import { WarStatus } from "@database/enums.ts"
import WARS from '@messages/Wars.json' with { type : "json"}

@Injectable()
export class WarsService {
	constructor(
		private readonly warsRepository: WarsRepository,
		private readonly userRepository: UserRepository,
		private readonly battleRepository: BattleRepository,
		private readonly authError: AuthError,
		private readonly warsError: WarsError,
		private readonly battlesError: BattlesError,
	) {}

	async createWar(userId: string, createWarDto: CreateWarDto) {
		const { battleId, code, invitedFriends } = createWarDto

		// Verify battle exists
		const battle = await this.battleRepository.findBattleById(battleId)
		if (!battle) {
			throw this.battlesError.battleNotFound()
		}

		const war = await this.warsRepository.createWar({
			battleId,
			code,
			createdBy: userId,
		})

		// Add creator as first participant
		await this.warsRepository.addParticipant(war.id, userId)

		// Add invited friends as participants if provided
		if (invitedFriends && invitedFriends.length > 0) {
			const friends = await this.userRepository.findByIds(invitedFriends)

			for (const friend of friends) {
				await this.warsRepository.addParticipant(war.id, friend.id)
			}
		}

		return this.formatWarResponse(war)
	}

	async joinWar(userId: string, joinWarDto: JoinWarDto) {
		const { warId } = joinWarDto

		const war = await this.warsRepository.findWarWithParticipants(warId)
		if (!war) {
			throw this.warsError.warNotFound()
		}

		if (war.status === WarStatus.FINISHED) {
			throw this.warsError.warAlreadyFinished()
		}

		const existingParticipant = await this.warsRepository.findParticipant(warId, userId)
		if (existingParticipant) {
			throw this.warsError.alreadyParticipating()
		}

		await this.warsRepository.addParticipant(warId, userId)
		return { message: WARS.WAR_JOINED_SUCCESS }
	}

	async getWar(warId: string) {
		const war = await this.warsRepository.findWarWithParticipants(warId)
		if (!war) {
			throw this.warsError.warNotFound()
		}

		return this.formatWarResponse(war)
	}

	async getUserWars(userId: string) {
		const wars = await this.warsRepository.getUserWars(userId)
		return wars.map(war => this.formatWarResponse(war))
	}

	async updatePoints(userId: string, warId: string, updatePointsDto: UpdatePointsDto) {
		const { points } = updatePointsDto

		const war = await this.warsRepository.findWarWithParticipants(warId)
		if (!war) {
			throw this.warsError.warNotFound()
		}

		if (war.status === WarStatus.FINISHED) {
			throw this.warsError.warAlreadyFinished()
		}

		const participant = await this.warsRepository.findParticipant(warId, userId)
		if (!participant) {
			throw this.warsError.notParticipating()
		}

		await this.warsRepository.updateParticipantPoints(warId, userId, points)
		return { message: WARS.POINTS_UPDATED_SUCCESS }
	}

	async finishWar(userId: string, warId: string) {
		const war = await this.warsRepository.findWarWithParticipants(warId)
		if (!war) {
			throw this.warsError.warNotFound()
		}

    if (war.participants.length < 2) {
      throw this.warsError.minimumParticipantsRequired()
    }

		if (war.createdBy !== userId) {
			throw this.warsError.unauthorized()
		}

		if (war.status === WarStatus.FINISHED) {
			throw this.warsError.warAlreadyFinished()
		}

		// Validate minimum participants requirement
		if (war.participants.length < 2) {
			throw this.warsError.minimumParticipantsRequired()
		}

		// Find winner (participant with highest points)
		const sortedParticipants = war.participants.sort((a, b) => b.points - a.points)
		const winner = sortedParticipants[0].user.userName

		await this.warsRepository.finishWar(warId, winner)
		return { message: WARS.WAR_FINISHED_SUCCESS, winner }
	}

	private formatWarResponse(war: any) {
		return {
			id: war.id,
			battle: {
				id: war.battle.id,
				name: war.battle.name,
				description: war.battle.description,
				problem: war.battle.problem,
			},
			status: war.status.toLowerCase(),
			winner: war.winner,
			code: war.code,
			createdBy: war.creator.userName,
			participants: war.participants.map((p: any) => ({
				userId: p.userId,
				username: p.user.userName,
				points: p.points,
			})),
			createdAt: war.createdAt,
			updatedAt: war.updatedAt,
		}
	}
}