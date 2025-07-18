import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common"
import { isExpired, verifyToken } from "../../functions/jwt.ts"
import { UserRepository } from "../../../repos/User.repo.ts"
import { Reflector } from "@nestjs/core"
import { IS_PUBLIC_KEY } from "@config/constants.ts"

@Injectable()
export class SessionGuard implements CanActivate {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly reflector: Reflector,
	) {}

	async canActivate(ctx: ExecutionContext): Promise<boolean> {
		const request = ctx.switchToHttp().getRequest()

		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			ctx.getHandler(),
			ctx.getClass(),
		])

		if (isPublic) return true

		const authorization = request.headers.authorization

		if (!authorization) {
			throw new UnauthorizedException("Authorization header is required")
		}

		const [bearer, token] = authorization.split(" ")

		if (bearer !== "Bearer" || !token) {
			throw new UnauthorizedException("Invalid authorization format")
		}

		try {
			verifyToken(token)
		} catch (_error) {
			throw new UnauthorizedException("Invalid token")
		}

		try {
			const { expired, payload } = isExpired(token)
			console.log(expired, payload)
			if (expired || !payload) {
				throw new UnauthorizedException("Token has expired")
			}

			const user = await this.userRepository.findById(payload.id)

			if (!user) {
				throw new UnauthorizedException("User not found")
			}

			// Attach user to request for use in controllers
			request.user = user
		} catch (error) {
			if (error instanceof UnauthorizedException) {
				throw error
			}
			throw new UnauthorizedException("Authentication failed")
		}

		return true
	}
}
