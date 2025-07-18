import { Injectable } from "@nestjs/common"
import { PrismaService } from "@shared/services/prisma.service.ts"
import { StandardRepository } from "@shared/standard/repository.ts"
import { WarStatus } from "@database/enums.ts"

@Injectable()
export class WarsRepository extends StandardRepository {
	constructor(private readonly prisma: PrismaService) {
		super(prisma, "war")
	}

	async createWar(data: {
		battleId: string
		code?: string
		createdBy: string
	}) {
		return await this.prisma.war.create({
			data,
			include: {
				battle: true,
				creator: {
					select: {
						userName: true,
					},
				},
				participants: {
					include: {
						user: {
							select: {
								userName: true,
							},
						},
					},
				},
			},
		})
	}

	async findWarWithParticipants(warId: string) {
		return await this.prisma.war.findUnique({
			where: { id: warId },
			include: {
				battle: true,
				creator: {
					select: {
						userName: true,
					},
				},
				participants: {
					include: {
						user: {
							select: {
								userName: true,
							},
						},
					},
				},
			},
		})
	}

	async getUserWars(userId: string) {
		return await this.prisma.war.findMany({
			where: {
				OR: [
					{ createdBy: userId },
					{
						participants: {
							some: {
								userId,
							},
						},
					},
				],
			},
			include: {
				battle: true,
				creator: {
					select: {
						userName: true,
					},
				},
				participants: {
					include: {
						user: {
							select: {
								userName: true,
							},
						},
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		})
	}

	async addParticipant(warId: string, userId: string) {
		return await this.prisma.warParticipant.create({
			data: {
				warId,
				userId,
			},
		})
	}

	async findParticipant(warId: string, userId: string) {
		return await this.prisma.warParticipant.findUnique({
			where: {
				warId_userId: {
					warId,
					userId,
				},
			},
		})
	}

	async updateParticipantPoints(warId: string, userId: string, points: number) {
		return await this.prisma.warParticipant.update({
			where: {
				warId_userId: {
					warId,
					userId,
				},
			},
			data: {
				points: {
					increment: points,
				},
			},
		})
	}

	async finishWar(warId: string, winner?: string) {
		return await this.prisma.war.update({
			where: { id: warId },
			data: {
				status: WarStatus.FINISHED,
				winner,
			},
		})
	}

	async getLeaderboard() {
		return await this.prisma.warParticipant.groupBy({
			by: ["userId"],
			_sum: {
				points: true,
			},
			orderBy: {
				_sum: {
					points: "desc",
				},
			},
		})
	}

	async getLeaderboardWithUserInfo() {
		const leaderboard = await this.prisma.warParticipant.groupBy({
			by: ["userId"],
			_sum: {
				points: true,
			},
			orderBy: {
				_sum: {
					points: "desc",
				},
			},
		})

		const userIds = leaderboard.map(entry => entry.userId)
		const users = await this.prisma.user.findMany({
			where: {
				id: {
					in: userIds,
				},
			},
			select: {
				id: true,
				userName: true,
				firstName: true,
				lastName: true,
				picture: true,
			},
		})

		return leaderboard.map(entry => {
			const user = users.find(u => u.id === entry.userId)
			return {
				...user,
				totalPoints: entry._sum.points || 0,
			}
		})
	}
}