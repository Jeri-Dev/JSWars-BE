import { JWT_ALGORITHM, TOKEN_DESTINATION } from '@config/constants'
import { JWT_SECRET } from '@config/enviroments'
import { verify, sign } from 'jsonwebtoken'

export const getPayload = (token: string) => {
  try {
    const [, payload] = token.split('.')
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const paddedBase64 = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '=',
    )
    const jsonStr = atob(paddedBase64)
    return JSON.parse(jsonStr)
  } catch (error) {
    throw new Error('Invalid token')
  }
}

export const isExpired = <T = any>(token: string | Record<string, any>) => {
  const payload: Record<string, any> =
    token instanceof Object ? token : getPayload(token)

  if (!payload.exp) {
    throw new Error('Invalid token')
  }

  const expirationDate = payload.exp
  const currentDate = new Date().getTime()

  return {
    payload: payload as T,
    expired: currentDate > expirationDate,
  }
}

export const verifyToken = (token: string) => {
  return verify(token, JWT_SECRET, {
    algorithms: [JWT_ALGORITHM],
  })
}

interface CreateTokenParams {
  time: number
  payload: Record<string, any>
  destination: keyof typeof TOKEN_DESTINATION
}

export const createToken = ({
  payload,
  time,
  destination,
}: CreateTokenParams): string => {
  const thirtyDays = time ?? 30 * 24 * 60 * 60 * 1000
  const expirationDate = new Date().getTime() + thirtyDays

  const token = sign(payload ?? {}, JWT_SECRET, {
    algorithm: JWT_ALGORITHM,
    expiresIn: expirationDate,
    subject: destination,
  })
  return token
}
