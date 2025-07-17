import { AppError } from "@shared/classes/app-error.class.ts"
import { HttpStatus, Injectable } from "@nestjs/common"
import USER from '@messages/Users.json' with { type : "json"}
import AUTH from '@messages/Auth.json' with { type : "json"}

@Injectable()
export class AuthError {
	emailAlreadyExists = AppError.build(HttpStatus.BAD_REQUEST, USER.USER_EMAIL_ALREADY_EXISTS)
	usernameAlreadyExists = AppError.build(HttpStatus.BAD_REQUEST, USER.USER_NAME_ALREADY_EXISTS)
	invalidCredentials = AppError.build(HttpStatus.BAD_REQUEST, AUTH.LOGIN.INVALID_CREDENTIALS)
  userNameError = AppError.build(HttpStatus.BAD_REQUEST, USER.USER_NAME_ERROR)

  passwordError (message: string) {
    return new AppError(HttpStatus.BAD_REQUEST, message)
  }
}


