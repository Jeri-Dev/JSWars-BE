import { Module } from "@nestjs/common"
import { FriendsController } from "./friends.controller.ts"
import { FriendsService } from "./friends.service.ts"
import { FriendsRepository } from "@/repos/Friends.repo.ts"
import { UserRepository } from "@/repos/User.repo.ts"
import { AuthError } from "@/errors/auth.error.ts"
import { FriendsError } from "@/errors/friends.error.ts"

@Module({
	controllers: [FriendsController],
	providers: [FriendsService, FriendsRepository, UserRepository, AuthError, FriendsError],
	exports: [FriendsService],
})
export class FriendsModule {}