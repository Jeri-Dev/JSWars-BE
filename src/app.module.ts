import { PUBLIC_ASSETS_PATH } from "@config/constants.ts"
import { ServeStaticModule } from "@nestjs/serve-static"
import { AppErrorFilter } from "@/app-error.filter"
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core"
import { Global, Module } from "@nestjs/common"
import { AuthModule } from "./modules/auth/auth.module"
import { UsersModule } from "./modules/users/users.module.ts"
import { FriendsModule } from "./modules/friends/friends.module.ts"
import { BattlesModule } from "./modules/battles/battles.module.ts"
import { WarsModule } from "./modules/wars/wars.module.ts"
import { LeaderboardModule } from "./modules/leaderboard/leaderboard.module.ts"
import { PrismaService } from "@shared/services/prisma.service.ts"
import { ResponseInterceptor } from "./app.interceptor.ts"
import { SessionGuard } from "@shared/guards/session/session.guard.ts"
import { UserRepository } from "./repos/User.repo.ts"

@Global()
@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: PUBLIC_ASSETS_PATH,
		}),
		AuthModule,
		UsersModule,
		FriendsModule,
		BattlesModule,
		WarsModule,
		LeaderboardModule,
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
		{
			provide: APP_GUARD,
			useClass: SessionGuard,
		},
		UserRepository,
	],
})
export class AppModule {}
