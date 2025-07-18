import { AppError } from "@shared/classes/app-error.class.ts"
import { HttpStatus, Injectable } from "@nestjs/common"
import FRIENDS from '@messages/Friends.json' with { type : "json"}

@Injectable()
export class FriendsError {
	userNotFound = AppError.build(HttpStatus.NOT_FOUND, FRIENDS.USER_NOT_FOUND)
	cannotSendToSelf = AppError.build(HttpStatus.BAD_REQUEST, FRIENDS.CANNOT_SEND_TO_SELF)
	friendshipAlreadyExists = AppError.build(HttpStatus.BAD_REQUEST, FRIENDS.FRIENDSHIP_ALREADY_EXISTS)
	friendRequestNotFound = AppError.build(HttpStatus.NOT_FOUND, FRIENDS.FRIEND_REQUEST_NOT_FOUND)
	friendRequestAlreadyResponded = AppError.build(HttpStatus.BAD_REQUEST, FRIENDS.FRIEND_REQUEST_ALREADY_RESPONDED)
	friendshipNotFound = AppError.build(HttpStatus.NOT_FOUND, FRIENDS.FRIENDSHIP_NOT_FOUND)
	unauthorized = AppError.build(HttpStatus.UNAUTHORIZED, FRIENDS.UNAUTHORIZED)
}