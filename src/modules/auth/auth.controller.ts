import { Body, Controller, Post } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { CreateUserDto } from "./dto/create-user.dto.ts"
import { LoginDto } from "./dto/login.dto.ts"
import { IsPublic } from "../../decorators/IsPublic.ts"

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@IsPublic()
	@Post("register")
	register(@Body() dto: CreateUserDto) {
		return this.authService.register(dto)
	}

	@IsPublic()
	@Post("login")
	login(@Body() dto: LoginDto) {
		return this.authService.login(dto)
	}
}
