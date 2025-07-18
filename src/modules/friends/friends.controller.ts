import { Controller, Post, Get, Delete, Patch, Body, Param, Req } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger"
import { type Request } from "npm:@types/express"
import { FriendsService } from "./friends.service.ts"
import { SendFriendRequestDto } from "./dto/send-friend-request.dto.ts"
import { RespondFriendRequestDto } from "./dto/respond-friend-request.dto.ts"
import { FriendResponseDto } from "./dto/friend-response.dto.ts"
import { AuthError } from "@/errors/auth.error.ts"

@ApiTags("Friends")
@Controller("friends")
export class FriendsController {
	constructor(
		private readonly friendsService: FriendsService,
		private readonly authError: AuthError,
	) {}

	@Post("request")
	@ApiOperation({ summary: "Send a friend request" })
	@ApiResponse({ status: 201, description: "Friend request sent successfully" })
	async sendFriendRequest(
		@Req() req: Request,
		@Body() sendFriendRequestDto: SendFriendRequestDto,
	) {
		if (!req.user) {
			throw this.authError.unauthorized()
		}
		return this.friendsService.sendFriendRequest(req.user.id, sendFriendRequestDto)
	}

	@Patch("request/:friendshipId")
	@ApiOperation({ summary: "Respond to a friend request" })
	@ApiParam({ name: "friendshipId", description: "Friendship ID" })
	@ApiResponse({ status: 200, description: "Friend request responded successfully" })
	async respondToFriendRequest(
		@Req() req: Request,
		@Param("friendshipId") friendshipId: string,
		@Body() respondFriendRequestDto: RespondFriendRequestDto,
	) {
		if (!req.user) {
			throw this.authError.unauthorized()
		}
		return this.friendsService.respondToFriendRequest(req.user.id, friendshipId, respondFriendRequestDto)
	}

	@Get()
	@ApiOperation({ summary: "Get list of friends" })
	@ApiResponse({ 
		status: 200, 
		description: "List of friends retrieved successfully",
		type: [FriendResponseDto]
	})
	async getFriends(@Req() req: Request) {
		if (!req.user) {
			throw this.authError.unauthorized()
		}
		return this.friendsService.getFriends(req.user.id)
	}

	@Get("requests")
	@ApiOperation({ summary: "Get pending friend requests" })
	@ApiResponse({ 
		status: 200, 
		description: "Pending friend requests retrieved successfully",
		type: [FriendResponseDto]
	})
	async getPendingFriendRequests(@Req() req: Request) {
		if (!req.user) {
			throw this.authError.unauthorized()
		}
		return this.friendsService.getPendingFriendRequests(req.user.id)
	}

	@Delete(":friendId")
	@ApiOperation({ summary: "Remove a friend" })
	@ApiParam({ name: "friendId", description: "Friend user ID" })
	@ApiResponse({ status: 200, description: "Friend removed successfully" })
	async removeFriend(
		@Req() req: Request,
		@Param("friendId") friendId: string,
	) {
		if (!req.user) {
			throw this.authError.unauthorized()
		}
		return this.friendsService.removeFriend(req.user.id, friendId)
	}
}