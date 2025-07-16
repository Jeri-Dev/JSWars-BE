import { PUBLIC_ASSETS_PATH } from "@config/constants.ts"
import { ServeStaticModule } from "@nestjs/serve-static"
import { AppErrorFilter } from "@/app-error.filter"
import { APP_FILTER } from "@nestjs/core"
import { Module } from "@nestjs/common"
import { AuthModule } from './modules/auth/auth.module';

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: PUBLIC_ASSETS_PATH,
		}),
		AuthModule,
	],
	providers: [
		{
			provide: APP_FILTER,
			useClass: AppErrorFilter,
		},
	],
})
export class AppModule {}
