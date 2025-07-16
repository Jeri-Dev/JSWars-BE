import { HttpStatus } from "@nestjs/common"

export class AppError extends Error {
	constructor(
		public readonly statusCode: HttpStatus,
		message: string,
		public readonly extra?: Record<string, unknown>,
		public readonly isOperational: boolean = true,
	) {
		super(message)
		this.name = "AppError"

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, AppError)
		}
	}

	static build(statusCode: HttpStatus, message: string) {
		return (params?: Record<string, unknown>, isOperational = true) => {
			return new AppError(statusCode, message, params, isOperational)
		}
	}
}
