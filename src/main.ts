import { swaggerSetup } from "@config/swagger.ts"
import { INestApplication } from "@nestjs/common"
import { loggerSetup } from "@config/logger.ts"
import { PORT } from "@config/enviroments.ts"
import { AppModule } from "@/app.module.ts"
import { NestFactory } from "@nestjs/core"
import colors from "colors"

const module = await NestFactory.create(AppModule, {
	logger: ["error", "warn"],
})

const app = module as INestApplication

app.setGlobalPrefix("api")

swaggerSetup(app)
loggerSetup(app)
await app.listen(PORT)

console.log(
	colors.yellow(`[APP] Server is running on in http://localhost:${PORT}`),
)
