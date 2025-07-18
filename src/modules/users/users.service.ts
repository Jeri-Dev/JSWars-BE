import { Injectable } from "@nestjs/common"
import { UserRepository } from "@/repos/User.repo.ts"
import { compareHash, hashString } from "@shared/functions/hash.ts"
import { validatePassword } from "@shared/utils/validatePassword.ts"
import { ChangePasswordDto } from "./dto/change-password.dto.ts"
import { UpdateProfileDto } from "./dto/update-profile.dto.ts"
import { UpdateAvatarDto } from "./dto/update-avatar.dto.ts"
import { AuthError } from "@/errors/auth.error.ts"

@Injectable()
export class UsersService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly authError: AuthError,
	) {}

	async getUsers() {
		return await this.userRepository.findAll()
	}

	async getProfile(userId: string) {
		const user = await this.userRepository.findById(userId)
		if (!user) {
			throw this.authError.userNotFound()
		}

		const { password: _p, ...userWithoutPassword } = user
		return userWithoutPassword
	}

	async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
		const { oldPassword, newPassword } = changePasswordDto

		const user = await this.userRepository.findById(userId)
		if (!user) {
			throw this.authError.userNotFound()
		}

		const isOldPasswordValid = await compareHash({
			plain: oldPassword,
			hash: user.password,
		})

		if (!isOldPasswordValid) {
			throw this.authError.invalidOldPassword()
		}

		const passwordValidation = validatePassword({ password: newPassword })
		if (!passwordValidation.success) {
			throw this.authError.invalidPassword()
		}

		const hashedNewPassword = await hashString(newPassword)
		await this.userRepository.update(userId, { password: hashedNewPassword })

		return { message: "Password changed successfully" }
	}

	async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
		const user = await this.userRepository.findById(userId)
		if (!user) {
			throw this.authError.userNotFound()
		}

		await this.userRepository.update(userId, updateProfileDto)
		return { message: "Profile updated successfully" }
	}

	async updateProfilePicture(userId: string, filename: string) {
		const user = await this.userRepository.findById(userId)
		if (!user) {
			throw this.authError.userNotFound()
		}

		await this.userRepository.update(userId, { picture: filename })
		return { message: "Profile picture updated successfully" }
	}

	async updateAvatar(userId: string, updateAvatarDto: UpdateAvatarDto) {
		const user = await this.userRepository.findById(userId)
		if (!user) {
			throw this.authError.userNotFound()
		}

		await this.userRepository.update(userId, {
			picture: updateAvatarDto.avatarUrl,
		})
		return "Avatar updated successfully"
	}
}
