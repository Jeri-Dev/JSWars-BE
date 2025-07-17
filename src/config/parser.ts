import { APP_SIZE_LIMIT_UPLOAD } from "@config/constants"
import { INestApplication } from "@nestjs/common"
import { json, urlencoded } from "npm:body-parser"

export const parserSetup = (app: INestApplication) => {
	app.use(json({ limit: APP_SIZE_LIMIT_UPLOAD }))
	app.use(urlencoded({ extended: true, limit: APP_SIZE_LIMIT_UPLOAD }))
}
