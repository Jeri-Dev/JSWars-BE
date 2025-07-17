import GENERAL from "@messages/General.json" with { type : "json"}
import { AppError } from "@shared/classes/app-error.class.ts"
import { HttpStatus, Injectable } from "@nestjs/common"

@Injectable()
export class GeneralError {
	internalServerError = AppError.build(HttpStatus.INTERNAL_SERVER_ERROR, GENERAL.ERROR_DATABASE_MESSAGE)
	hashError = AppError.build(HttpStatus.INTERNAL_SERVER_ERROR, GENERAL.ERROR_HASH_MESSAGE)
}
