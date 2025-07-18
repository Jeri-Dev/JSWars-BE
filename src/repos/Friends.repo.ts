import { Injectable } from "@nestjs/common"
import { PrismaService } from "@shared/services/prisma.service.ts"
import { StandardRepository } from "@shared/standard/repository.ts"
import { FriendshipStatus } from "@database/enums.ts"

@Injectable()
export class FriendsRepository extends StandardRepository {
	constructor(private readonly prisma: PrismaService) {
		super(prisma, "friendship")
	}

	async sendFriendRequest(requesterId: string, addresseeId: string) {
		return await this.prisma.friendship.create({
			data: {
				requesterId,
				addresseeId,
				status: FriendshipStatus.PENDING,
			},
		})
	}

	async findFriendship(requesterId: string, addresseeId: string) {
		return await this.prisma.friendship.findFirst({
			where: {
				OR: [
					{ requesterId, addresseeId },
					{ requesterId: addresseeId, addresseeId: requesterId },
				],
			},
		})
	}

	async respondToFriendRequest(friendshipId: string, status: FriendshipStatus) {
		return await this.prisma.friendship.update({
			where: { id: friendshipId },
			data: { status },
		})
	}

	async getFriends(userId: string) {
		return await this.prisma.friendship.findMany({
			where: {
				OR: [
					{ requesterId: userId },
					{ addresseeId: userId },
				],
				status: FriendshipStatus.ACCEPTED,
			},
			include: {
				requester: {
					select: {
						id: true,
						userName: true,
						firstName: true,
						lastName: true,
						picture: true,
					},
				},
				addressee: {
					select: {
						id: true,
						userName: true,
						firstName: true,
						lastName: true,
						picture: true,
					},
				},
			},
		})
	}

	async getPendingFriendRequests(userId: string) {
		return await this.prisma.friendship.findMany({
			where: {
				addresseeId: userId,
				status: FriendshipStatus.PENDING,
			},
			include: {
				requester: {
					select: {
						id: true,
						userName: true,
						firstName: true,
						lastName: true,
						picture: true,
					},
				},
			},
		})
	}

	async deleteFriendship(friendshipId: string) {
		return await this.prisma.friendship.delete({
			where: { id: friendshipId },
		})
	}

	async findById(friendshipId: string) {
		return await this.prisma.friendship.findUnique({
			where: { id: friendshipId },
		})
	}
}