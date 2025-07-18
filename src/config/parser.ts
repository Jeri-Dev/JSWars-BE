import { APP_SIZE_LIMIT_UPLOAD } from "@config/constants"
import { INestApplication } from "@nestjs/common"
import bodyParser from "npm:body-parser"

export const parserSetup = (app: INestApplication) => {
	app.use(bodyParser.json({ limit: APP_SIZE_LIMIT_UPLOAD }))
	app.use(
		bodyParser.urlencoded({ extended: true, limit: APP_SIZE_LIMIT_UPLOAD }),
	)
}
