import { Injectable } from "@nestjs/common"
import { CreateUserDto } from "./dto/create-user.dto.ts"
import { UserRepository } from "@/repos/User.repo.ts"
import { tryCatch } from "@shared/utils/catch.ts"
import { GeneralError } from "@errors/general.error.ts"
import { AuthError } from "@errors/auth.error.ts"
import { compareHash, hashString } from "@shared/functions/hash.ts"
import { validatePassword } from "@shared/utils/validatePassword.ts"
import { LoginDto } from "./dto/login.dto.ts"
import { createToken } from "@shared/functions/jwt.ts"
import { TOKEN_DESTINATION } from "@config/constants.ts"

@Injectable()
export class AuthService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly generalError: GeneralError,
		private readonly authError: AuthError,
	) {}

	async register(dto: CreateUserDto) {
		const { userName, email } = dto

		if (!/^[A-Za-z0-9_-]{1,15}$/.test(userName)) {
			throw this.authError.userNameError()
		}

		const [errorSearchUser, userFound] = await tryCatch(() =>
			this.userRepository.findOrQuery([
				{
					userName,
				},
				{
					email,
				},
			]),
		)
		if (errorSearchUser) {
			console.log(errorSearchUser)
			throw this.generalError.internalServerError()
		}

		if (userFound && userFound.email == email) {
			throw this.authError.emailAlreadyExists()
		}

		if (userFound && userFound.userName == userName) {
			throw this.authError.usernameAlreadyExists()
		}

		const validPassword = validatePassword({
			password: dto.password,
		})

		if (!validPassword.success) {
			throw this.authError.passwordError(validPassword.message)
		}

		const [errorHashPassword, hashedPassword] = await tryCatch(() =>
			hashString(dto.password),
		)

		if (errorHashPassword) {
			console.log(errorHashPassword)
			throw this.generalError.internalServerError()
		}

		const [errorCreateUser, user] = await tryCatch(() =>
			this.userRepository.create({
				...dto,
				password: hashedPassword,
			}),
		)

		if (errorCreateUser) {
			console.log(errorCreateUser)
			throw this.generalError.internalServerError()
		}

		const { password: _pass, ...rest } = user

		return rest
	}

	async login(dto: LoginDto) {
		const { email, password } = dto

		const [errorSearchUser, userFound] = await tryCatch(() =>
			this.userRepository.findOrQuery([
				{
					email,
				},
			]),
		)
		if (errorSearchUser) {
			throw this.generalError.internalServerError()
		}

		if (!userFound) {
			throw this.authError.invalidCredentials()
		}

		const [errorPasswordMatch] = await tryCatch(() =>
			compareHash({ hash: userFound.password, plain: password }),
		)

		if (errorPasswordMatch) {
			throw this.authError.invalidCredentials()
		}

		const [errorToken, token] = await tryCatch(() =>
			createToken({
				destination: TOKEN_DESTINATION.AUTH,
				payload: {
					id: userFound.id,
					userName: userFound.userName,
					email: userFound.email,
				},
				time: 30 * 24 * 60 * 60 * 1000,
			}),
		)

		console.log(token)

		if (errorToken) {
			throw this.generalError.internalServerError()
		}

		return token
	}
}
