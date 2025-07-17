import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { UserRepository } from "@/repos/User.repo.ts"
import { GeneralError } from "@errors/general.error.ts"
import { AuthError } from "@errors/auth.error.ts"

@Module({
	controllers: [AuthController],
	providers: [AuthService, UserRepository, GeneralError, AuthError],
})
export class AuthModule {}
