import "jsr:@std/dotenv/load"
import path from "node:path"

export const PORT = Deno.env.get("PORT") || 5000
export const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")
export const ROOT_PATH = path.join(Deno.cwd(), "..")
export const APP_HOST = Deno.env.get("APP_HOST")
export const DENO_ENV =
	Deno.env.get("DENO_ENV") ||
	("DEVELOPMENT" as "DEVELOPMENT" | "PRODUCTION" | "TEST")

export const JWT_SECRET = Deno.env.get("JWT_SECRET")
