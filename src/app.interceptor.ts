import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from "@nestjs/common"
import { Observable } from "npm:rxjs"
import { tap } from "npm:rxjs/operators"

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const ctx = context.switchToHttp()
		const response = ctx.getResponse()

		return next.handle().pipe(
			tap((data) => {
				if (response.statusCode >= 200 && response.statusCode < 300) {
					return Array.isArray(data)
						? {
								result: data,
						  }
						: data
				}
			}),
		)
	}
}
