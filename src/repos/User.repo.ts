import { Injectable } from "@nestjs/common"
import { StandardRepository } from "@shared/standard/repository.ts"
import { User } from "@database/client.ts"
import { PrismaService } from "@shared/services/prisma.service.ts"

@Injectable()
export class UserRepository extends StandardRepository<
	User,
	PrismaService["user"]
> {
	constructor(prisma: PrismaService) {
		super(prisma.user)
	}
}
