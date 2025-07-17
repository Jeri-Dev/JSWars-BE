export interface SuccessResponse<T> {
  ok: true
  status: number
  data: T
  error?: never
  headers: Headers
}

export interface ErrorResponse<E> {
  ok: false
  status: number
  data: null
  error: E
  headers: Headers
}

type ResponseType<T, E> = SuccessResponse<T> | ErrorResponse<E>

interface ConfigParams<GlobalErrorType> {
  baseUrl?: string | null
  headers?:
    | (() => Record<string, string> | Promise<Record<string, string>>)
    | Record<string, string>
  query?:
    | (() => Record<string, string | string[]>)
    | Record<string, string | string[]>
  interceptors?: {
    request?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>
    response?: <T>(
      response: ResponseType<T, GlobalErrorType>,
    ) =>
      | ResponseType<T, GlobalErrorType>
      | Promise<ResponseType<T, GlobalErrorType>>
    error?: <T>(
      error: ResponseType<T, GlobalErrorType>,
    ) =>
      | ResponseType<T, GlobalErrorType>
      | Promise<ResponseType<T, GlobalErrorType>>
  }
}

interface RequestConfig {
  url: string
  method: string
  headers: Record<string, string>
  body?: BodyInit
  query?: Record<string, string | string[]>
  signal?: AbortSignal
}

type ContentType = 'json' | 'formData' | 'text' | 'blob' | 'arrayBuffer'

const serializeQuery = (
  query: Partial<Record<string, string | string[]>>,
): string => {
  const params = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== undefined && item !== null) {
            params.append(key, item)
          }
        })
      } else {
        params.append(key, value)
      }
    }
  })
  return params.toString()
}

const createUrl = (
  baseUrl: string | null,
  path: string,
  query: Partial<Record<string, string | string[]>> = {},
): string => {
  const base = baseUrl !== null ? `${baseUrl}${path}` : path
  const queryString = serializeQuery({ ...query })
  return queryString ? `${base}?${queryString}` : base
}

const getContentType = (headers: Record<string, string>): ContentType => {
  const contentType = headers['Content-Type'] || headers['content-type'] || ''
  if (contentType.includes('application/json')) return 'json'
  if (contentType.includes('multipart/form-data')) return 'formData'
  if (contentType.includes('text')) return 'text'
  if (contentType.includes('application/octet-stream')) return 'blob'
  return 'json'
}

const parseResponseData = async (
  response: Response,
  contentType: ContentType,
): Promise<any> => {
  try {
    switch (contentType) {
      case 'json':
        return await response.json()
      case 'formData':
        return await response.formData()
      case 'text':
        return await response.text()
      case 'blob':
        return await response.blob()
      case 'arrayBuffer':
        return await response.arrayBuffer()
      default:
        return await response.json()
    }
  } catch {
    return null
  }
}

const prepareRequestBody = (
  data: any,
  headers: Record<string, string>,
): { body: BodyInit; updatedHeaders: Record<string, string> } => {
  const contentType = getContentType(headers)
  const updatedHeaders = { ...headers }

  if (data instanceof FormData) {
    delete updatedHeaders['Content-Type']
    delete updatedHeaders['content-type']
    return { body: data, updatedHeaders }
  }

  if (data instanceof Blob || data instanceof ArrayBuffer) {
    return { body: data, updatedHeaders }
  }

  switch (contentType) {
    case 'json':
      return { body: JSON.stringify(data), updatedHeaders }
    case 'formData': {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value as string | Blob)
      })
      delete updatedHeaders['Content-Type']
      delete updatedHeaders['content-type']
      return { body: formData, updatedHeaders }
    }
    case 'text':
      return { body: String(data), updatedHeaders }
    default:
      return { body: JSON.stringify(data), updatedHeaders }
  }
}

const resolveValue = async <T>(
  value: T | (() => T | Promise<T>),
): Promise<T> => {
  if (typeof value === 'function') {
    const result = (value as Function)()
    return result instanceof Promise ? await result : result
  }
  return value
}

export const createClientHTTP = <GlobalErrorType = any>({
  baseUrl = null,
  headers: defaultHeaders = {},
  query: globalQuery = {},
  interceptors = {},
}: ConfigParams<GlobalErrorType>) => {
  const executeRequest = async <T>(
    config: RequestConfig,
  ): Promise<ResponseType<T, GlobalErrorType>> => {
    try {
      const finalConfig = interceptors.request
        ? await interceptors.request(config)
        : config

      const response = await fetch(finalConfig.url, {
        method: finalConfig.method,
        headers: finalConfig.headers,
        body: finalConfig.body,
        signal: finalConfig.signal,
      })

      const contentType = getContentType(finalConfig.headers)
      const data = await parseResponseData(response, contentType)

      const responseData: ResponseType<T, GlobalErrorType> = response.ok
        ? {
            ok: true,
            status: response.status,
            data: data as T,
            headers: response.headers,
          }
        : {
            ok: false,
            status: response.status,
            data: null,
            error: data?.error?.messages
              ? data
              : {
                  ...data,
                },
            headers: response.headers,
          }

      if (interceptors.response) {
        return await interceptors.response(responseData)
      }
      return responseData
    } catch (error: any) {
      if (error.name === 'AbortError') {
        const abortErrorResponse: ErrorResponse<GlobalErrorType> = {
          ok: false,
          status: 0,
          data: null,
          error: {
            message: 'Request aborted',
            originalError: error,
            messages: [
              {
                message: error?.message || 'Network error',
                code: 'NETWORK_ERROR',
              },
            ],
          } as GlobalErrorType,
          headers: new Headers(),
        }

        if (interceptors.error) {
          return await interceptors.error(abortErrorResponse)
        }
        return abortErrorResponse
      }

      const errorResponse: ErrorResponse<GlobalErrorType> = {
        ok: false,
        status: 0,
        data: null,
        error: {
          message: error?.message || 'Network error',
          messages: [
            {
              message: error?.message || 'Network error',
              code: 'NETWORK_ERROR',
            },
          ],
          originalError: error,
        } as GlobalErrorType,
        headers: new Headers(),
      }

      if (interceptors.error) {
        return await interceptors.error(errorResponse)
      }
      return errorResponse
    }
  }

  const createMethod = (method: string) => {
    return async <T = any, E = GlobalErrorType>({
      url: urlPath = '/',
      data,
      query = {},
      headers = {},
      signal,
    }: {
      url?: string
      data?: any
      query?: Partial<Record<string, string | string[]>>
      headers?: Record<string, string>
      signal?: AbortSignal
    } = {}): Promise<ResponseType<T, E>> => {
      const defaultConfig: Partial<RequestConfig> = {
        headers: {
          'Content-Type': 'application/json',
        },
        query: await resolveValue(globalQuery),
      }

      const resolvedGlobalQuery = await resolveValue(globalQuery)
      const resolvedGlobalHeaders = await resolveValue(defaultHeaders)

      const mergedQuery = { ...resolvedGlobalQuery, ...query }
      const mergedHeaders = {
        ...defaultConfig.headers,
        ...resolvedGlobalHeaders,
        ...headers,
      }
      const url = createUrl(baseUrl, urlPath, mergedQuery)

      const config: RequestConfig = {
        url,
        method,
        headers: mergedHeaders,
        signal,
      }

      if (data !== undefined) {
        const { body, updatedHeaders } = prepareRequestBody(data, mergedHeaders)
        config.body = body
        config.headers = updatedHeaders
      }

      return executeRequest<T>(config) as unknown as Promise<ResponseType<T, E>>
    }
  }

  const createMockMethod = () => {
    return async <T>(
      mockData: T,
      options: {
        status?: number
        message?: string
        delay?: number
        auth?: {
          permission: string[]
          preferenceBranch: string
        }
      } = {},
    ): Promise<SuccessResponse<T>> => {
      const {
        status = 200,
        message = 'Mock response',
        delay = 0,
        auth,
      } = options

      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay))
      }

      const mockResponse: SuccessResponse<T> = {
        ok: true,
        status,
        data: {
          error: false,
          message,
          result: mockData,
          ...(auth && { auth }),
        } as T,
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      }

      if (interceptors.response) {
        return (await interceptors.response(mockResponse)) as SuccessResponse<T>
      }

      return mockResponse
    }
  }

  return {
    GET: createMethod('GET'),
    POST: createMethod('POST'),
    PUT: createMethod('PUT'),
    PATCH: createMethod('PATCH'),
    DELETE: createMethod('DELETE'),
    MOCK: createMockMethod(),
  }
}
