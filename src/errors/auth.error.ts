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
	userNotFound = AppError.build(HttpStatus.NOT_FOUND, USER.ERROR_USER_NOT_FOUND)
	invalidOldPassword = AppError.build(HttpStatus.BAD_REQUEST, USER.INVALID_OLD_PASSWORD)
	invalidFileType = AppError.build(HttpStatus.BAD_REQUEST, USER.INVALID_FILE_TYPE)
	fileTooLarge = AppError.build(HttpStatus.BAD_REQUEST, USER.FILE_TOO_LARGE)
	unauthorized = AppError.build(HttpStatus.UNAUTHORIZED, AUTH.LOGIN.INVALID_CREDENTIALS)
	invalidPassword = AppError.build(HttpStatus.BAD_REQUEST, "Invalid password format")
	avatarUpdatedSuccess = AppError.build(HttpStatus.OK, USER.AVATAR_UPDATED_SUCCESS)

	passwordError(message: string) {
		return new AppError(HttpStatus.BAD_REQUEST, message)
	}
}


