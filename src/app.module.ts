import { PUBLIC_ASSETS_PATH } from "@config/constants.ts"
import { ServeStaticModule } from "@nestjs/serve-static"
import { AppErrorFilter } from "@/app-error.filter"
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core"
import { Global, Module } from "@nestjs/common"
import { AuthModule } from "./modules/auth/auth.module"
import { PrismaService } from "@shared/services/prisma.service.ts"
import { ResponseInterceptor } from "./app.interceptor.ts"

@Global()
@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: PUBLIC_ASSETS_PATH,
		}),
		AuthModule,
	],
	exports: [PrismaService],
	providers: [
		PrismaService,
		{
			provide: APP_FILTER,
			useClass: AppErrorFilter,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ResponseInterceptor,
		},
	],
})
export class AppModule {}
