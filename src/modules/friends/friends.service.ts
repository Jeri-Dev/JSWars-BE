import { Injectable } from "@nestjs/common"
import { FriendsRepository } from "@/repos/Friends.repo.ts"
import { UserRepository } from "@/repos/User.repo.ts"
import { AuthError } from "@/errors/auth.error.ts"
import { FriendsError } from "@/errors/friends.error.ts"
import { SendFriendRequestDto } from "./dto/send-friend-request.dto.ts"
import { RespondFriendRequestDto } from "./dto/respond-friend-request.dto.ts"
import { FriendshipStatus } from "@database/enums.ts"
import FRIENDS from '@messages/Friends.json' with { type : "json"}

@Injectable()
export class FriendsService {
	constructor(
		private readonly friendsRepository: FriendsRepository,
		private readonly userRepository: UserRepository,
		private readonly friendsError: FriendsError,
	) {}

	async sendFriendRequest(
		userId: string,
		sendFriendRequestDto: SendFriendRequestDto,
	) {
		const { userIdentifier } = sendFriendRequestDto

		const targetUser = await this.userRepository.findById(userIdentifier)

		if (!targetUser) {
			throw this.friendsError.userNotFound()
		}

		if (targetUser.id === userId) {
			throw this.friendsError.cannotSendToSelf()
		}

		const existingFriendship = await this.friendsRepository.findFriendship(
			userId,
			targetUser.id,
		)
		if (existingFriendship) {
			throw this.friendsError.friendshipAlreadyExists()
		}

		await this.friendsRepository.sendFriendRequest(userId, targetUser.id)
		return { message: FRIENDS.FRIEND_REQUEST_SENT_SUCCESS }
	}

	async respondToFriendRequest(
		userId: string,
		friendshipId: string,
		respondFriendRequestDto: RespondFriendRequestDto,
	) {
		const { response } = respondFriendRequestDto

		const friendship = await this.friendsRepository.findById(friendshipId)
		if (!friendship) {
			throw this.friendsError.friendRequestNotFound()
		}

		if (friendship.addresseeId !== userId) {
			throw this.friendsError.unauthorized()
		}

		if (friendship.status !== FriendshipStatus.PENDING) {
			throw this.friendsError.friendRequestAlreadyResponded()
		}

		const status =
			response === "accept"
				? FriendshipStatus.ACCEPTED
				: FriendshipStatus.REJECTED
		await this.friendsRepository.respondToFriendRequest(friendshipId, status)

		const successMessage = response === "accept" ? FRIENDS.FRIEND_REQUEST_ACCEPTED_SUCCESS : FRIENDS.FRIEND_REQUEST_REJECTED_SUCCESS
		return { message: successMessage }
	}

	async getFriends(userId: string) {
		const friendships = await this.friendsRepository.getFriends(userId)

		return friendships.map((friendship: any) => {
			const friend =
				friendship.requesterId === userId
					? friendship.addressee
					: friendship.requester
			return {
				id: friend.id,
				userName: friend.userName,
				firstName: friend.firstName,
				lastName: friend.lastName,
				picture: friend.picture,
				status: "accepted",
				createdAt: friendship.createdAt,
			}
		})
	}

	async getPendingFriendRequests(userId: string) {
		const friendRequests =
			await this.friendsRepository.getPendingFriendRequests(userId)

		return friendRequests.map((request: any) => ({
			id: request.requester.id,
			userName: request.requester.userName,
			firstName: request.requester.firstName,
			lastName: request.requester.lastName,
			picture: request.requester.picture,
			status: "pending",
			createdAt: request.createdAt,
			friendshipId: request.id,
		}))
	}

	async removeFriend(userId: string, friendId: string) {
		const friendship = await this.friendsRepository.findFriendship(
			userId,
			friendId,
		)
		if (!friendship) {
			throw this.friendsError.friendshipNotFound()
		}

		if (
			friendship.requesterId !== userId &&
			friendship.addresseeId !== userId
		) {
			throw this.friendsError.unauthorized()
		}

		await this.friendsRepository.deleteFriendship(friendship.id)
		return { message: FRIENDS.FRIEND_REMOVED_SUCCESS }
	}
}
