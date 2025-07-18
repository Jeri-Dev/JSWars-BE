import { Injectable } from "@nestjs/common"
import { WarsRepository } from "@/repos/Wars.repo.ts"
import { LeaderboardQueryDto } from "./dto/leaderboard-query.dto.ts"

@Injectable()
export class LeaderboardService {
	constructor(private readonly warsRepository: WarsRepository) {}

	async getLeaderboard(query: LeaderboardQueryDto) {
		const { page = 1, limit = 10 } = query

		const allUsers = await this.warsRepository.getLeaderboardWithUserInfo()
		const totalUsers = allUsers.length
		const totalPages = Math.ceil(totalUsers / limit)
		const offset = (page - 1) * limit

		const paginatedUsers = allUsers.slice(offset, offset + limit)

		const leaderboard = paginatedUsers.map((user, index) => ({
			...user,
			rank: offset + index + 1,
		}))

		return {
			leaderboard,
			totalUsers,
			currentPage: page,
			totalPages,
		}
	}

	async getUserRanking(userId: string) {
		const allUsers = await this.warsRepository.getLeaderboardWithUserInfo()
		const userIndex = allUsers.findIndex(user => user.id === userId)
		
		if (userIndex === -1) {
			return {
				rank: null,
				totalPoints: 0,
				totalUsers: allUsers.length,
			}
		}

		return {
			rank: userIndex + 1,
			totalPoints: allUsers[userIndex].totalPoints,
			totalUsers: allUsers.length,
		}
	}
}