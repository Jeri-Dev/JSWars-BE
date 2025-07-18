import { User } from "@database/client.ts"

declare global {
	namespace Express {
		interface Request {
			user?: User
		}
	}
}