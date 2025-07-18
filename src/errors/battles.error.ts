import { AppError } from "@shared/classes/app-error.class.ts"
import { HttpStatus, Injectable } from "@nestjs/common"
import BATTLES from '@messages/Battles.json' with { type : "json"}

@Injectable()
export class BattlesError {
	battleNotFound = AppError.build(HttpStatus.NOT_FOUND, BATTLES.BATTLE_NOT_FOUND)
	battleNameExists = AppError.build(HttpStatus.BAD_REQUEST, BATTLES.BATTLE_NAME_EXISTS)
	unauthorized = AppError.build(HttpStatus.UNAUTHORIZED, BATTLES.UNAUTHORIZED)
}