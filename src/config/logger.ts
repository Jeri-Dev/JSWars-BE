import { INestApplication } from "npm:@nestjs/common"
import morgan from "npm:morgan"

export const loggerSetup = (app: INestApplication) => {
  app.use(morgan("dev"))
}
