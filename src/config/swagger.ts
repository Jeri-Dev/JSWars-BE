import { DocumentBuilder, SwaggerModule } from "npm:@nestjs/swagger"
import { APP_NAME, APP_SWAGGER_URL } from "@config/constants.ts"

const swaggerConfig = new DocumentBuilder()
  .addBearerAuth()
  .setTitle(APP_NAME)
  .setDescription(`The web services for the project ${APP_NAME}`)
  .addSecurityRequirements("bearer")
  .build()

export const swaggerSetup = (app: any) => {
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup(APP_SWAGGER_URL, app, document, {})
}
