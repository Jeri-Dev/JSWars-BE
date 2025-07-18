import path from "node:path"
export const APP_SWAGGER_URL = "/"
export const APP_NAME = "JS Battle"
export const ROOT_PATH = Deno.cwd()
export const PUBLIC_ASSETS_PATH = path.join(ROOT_PATH, "public")

export const APP_SIZE_LIMIT_UPLOAD = "100mb"

export const TOKEN_DESTINATION = {
	AUTH: "AUTH",
	VERIFICATION: "VERIFICATION",
	CREATE_PASSWORD: "CREATE_PASSWORD",
} as const

export const JWT_ALGORITHM = "HS256"

export const IS_PUBLIC_KEY = "isPublic"
