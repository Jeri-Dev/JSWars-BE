import { HttpStatus, HttpException } from '@nestjs/common'
import { WsException } from '@nestjs/websockets'

interface IErrorResponseParams {
  message: string | Array<{ field: string; value: string; message: string }>
  status: HttpStatus
  extra?: Record<string, any>
  error?: Error
}

export const errorResponse = (params: IErrorResponseParams) => {
  const { message, status, extra, error } = params

  if (error && error instanceof HttpException) {
    throw error
  }

  throw new HttpException(
    {
      error: true,
      status,
      messages: [
        ...(Array.isArray(message)
          ? message
          : [
              {
                message,
                extra,
              },
            ]),
      ],
    },
    status,
  )
}

interface ISuccessResponseParams {
  data?: Record<string, any>
  extra?: Record<string, any>
  message: string
}

export const successResponse = ({
  message,
  data,
  extra,
}: ISuccessResponseParams) => {
  return {
    error: false,
    message,
    result: data,
    extra,
  }
}

export const unknownErrorResponse = () => {
  return errorResponse({
    message: 'Ha ocurrido un error inesperado',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
}

interface IWsErrorResponseParams {
  message: string
  extra?: Record<string, any>
  error?: Error
}

export const wsError = (params: IWsErrorResponseParams) => {
  const { message, extra, error } = params

  if (error && error instanceof WsException) {
    throw error
  }

  throw new WsException({
    error: true,
    messages: [
      {
        message,
        extra,
      },
    ],
  })
}

interface IWsSuccessResponseParams {
  data?: Record<string, any>
  extra?: Record<string, any>
  message?: string
}

export const wsSuccess = ({
  message,
  data,
  extra,
}: IWsSuccessResponseParams) => {
  return {
    error: false,
    message,
    result: data,
    extra,
  }
}

export const wsUnknownErrorResponse = () => {
  return wsError({
    message: 'Ha ocurrido un error inesperado',
  })
}

export const createWsResponse = (event: string, data: any) => {
  return { event, data }
}
