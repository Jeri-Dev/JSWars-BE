import { AppError } from "@shared/classes/app-error.class.ts"
import { HttpStatus, Injectable } from "@nestjs/common"
import USER from '@messages/Users.json' with { type : "json"}

@Injectable()
export class UsersError {
	notFound = AppError.build(HttpStatus.NOT_FOUND, USER.ERROR_USER_NOT_FOUND)
  
	
}


