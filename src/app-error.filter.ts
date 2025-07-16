import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common"
import { AppError } from "@shared/classes/app-error.class.ts"
import { WsException } from "@nestjs/websockets"

interface ErrorResponse {
  error: boolean
  status: number
  messages: Array<{
    message: string
    extra?: Record<string, unknown>
    timestamp: string
    path?: string
  }>
}

@Catch(AppError)
export class AppErrorFilter implements ExceptionFilter {
  catch(exception: AppError, host: ArgumentsHost) {
    const type = host.getType()

    const errorResponse: ErrorResponse = {
      error: true,
      status: exception.statusCode,
      messages: [
        {
          message: exception.message,
          extra: exception.extra,
          timestamp: new Date().toISOString(),
        },
      ],
    }

    if (type === "http") {
      const ctx = host.switchToHttp()
      const response = ctx.getResponse()
      const request = ctx.getRequest()

      errorResponse.messages[0].path = request.url

      return response.status(exception.statusCode).json(errorResponse)
    }

    if (type === "ws") {
      throw new WsException(errorResponse)
    }
  }
}
