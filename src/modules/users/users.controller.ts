import { Controller, Get, Patch, Body, Req } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger"
import { type Request } from "npm:@types/express"
import { UsersService } from "./users.service.ts"
import { ChangePasswordDto } from "./dto/change-password.dto.ts"
import { UpdateProfileDto } from "./dto/update-profile.dto.ts"
import { UpdateAvatarDto } from "./dto/update-avatar.dto.ts"
import { UserResponseDto } from "./dto/user-response.dto.ts"
import { AuthError } from "@/errors/auth.error.ts"

@ApiTags("Users")
@Controller("users")
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly authError: AuthError,
	) {}

	@Get()
	getUsers() {
		return this.usersService.getUsers()
	}

	@Get("me")
	@ApiOperation({ summary: "Get current user profile" })
	@ApiResponse({
		status: 200,
		description: "User profile retrieved successfully",
		type: UserResponseDto,
	})
	getProfile(@Req() req: Request) {
		if (!req.user) {
			throw this.authError.unauthorized()
		}
		return this.usersService.getProfile(req.user.id)
	}

	@Patch("password")
	@ApiOperation({ summary: "Change user password" })
	@ApiResponse({ status: 200, description: "Password changed successfully" })
	async changePassword(
		@Req() req: Request,
		@Body() changePasswordDto: ChangePasswordDto,
	) {
		if (!req.user) {
			throw this.authError.unauthorized()
		}
		return this.usersService.changePassword(req.user.id, changePasswordDto)
	}

	@Patch("profile")
	@ApiOperation({ summary: "Update user profile" })
	@ApiResponse({ status: 200, description: "Profile updated successfully" })
	async updateProfile(
		@Req() req: Request,
		@Body() updateProfileDto: UpdateProfileDto,
	) {
		if (!req.user) {
			throw this.authError.unauthorized()
		}
		return this.usersService.updateProfile(req.user.id, updateProfileDto)
	}

	@Patch("me/avatar")
	@ApiOperation({ summary: "Update user avatar" })
	@ApiResponse({ status: 200, description: "Avatar updated successfully" })
	async updateAvatar(
		@Req() req: Request,
		@Body() updateAvatarDto: UpdateAvatarDto,
	) {
		if (!req.user) {
			throw this.authError.unauthorized()
		}
		return this.usersService.updateAvatar(req.user.id, updateAvatarDto)
	}
}
