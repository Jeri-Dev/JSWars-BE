import { AppError } from "@shared/classes/app-error.class.ts"
import { HttpStatus, Injectable } from "@nestjs/common"
import WARS from '@messages/Wars.json' with { type : "json"}

@Injectable()
export class WarsError {
	warNotFound = AppError.build(HttpStatus.NOT_FOUND, WARS.WAR_NOT_FOUND)
	warAlreadyFinished = AppError.build(HttpStatus.BAD_REQUEST, WARS.WAR_ALREADY_FINISHED)
	alreadyParticipating = AppError.build(HttpStatus.BAD_REQUEST, WARS.ALREADY_PARTICIPATING)
	notParticipating = AppError.build(HttpStatus.BAD_REQUEST, WARS.NOT_PARTICIPATING)
	unauthorized = AppError.build(HttpStatus.UNAUTHORIZED, WARS.UNAUTHORIZED)
  minimumParticipantsRequired = AppError.build(HttpStatus.BAD_REQUEST, WARS.MINIMUM_PARTICIPANTS_REQUIRED)
}