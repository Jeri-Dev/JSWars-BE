import type { INestApplication } from '@nestjs/common'

export const corsSetup = (app: INestApplication) => {
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  })
}
