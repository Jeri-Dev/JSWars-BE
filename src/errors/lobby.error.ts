import { AppError } from "@shared/classes/app-error.class.ts"
import { HttpStatus, Injectable } from "@nestjs/common"

@Injectable()
export class LobbyError {
  notFound = AppError.build(HttpStatus.NOT_FOUND, "Not found lobby")
}
