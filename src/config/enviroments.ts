import "jsr:@std/dotenv/load"
import path from "node:path"

export const PORT = Deno.env.get("PORT") || 4000
export const ROOT_PATH = path.join(Deno.cwd(), "..")
export const APP_HOST = Deno.env.get("APP_HOST")
export const DENO_ENV = Deno.env.get("DENO_ENV") ||
  ("DEVELOPMENT" as "DEVELOPMENT" | "PRODUCTION" | "TEST")
