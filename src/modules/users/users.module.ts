import { Module } from "@nestjs/common"
import { UsersController } from "./users.controller.ts"
import { UsersService } from "./users.service.ts"
import { UserRepository } from "@/repos/User.repo.ts"
import { AuthError } from "@errors/auth.error.ts"

@Module({
	imports: [],
	controllers: [UsersController],
	providers: [UsersService, UserRepository, AuthError],
})
export class UsersModule {}
