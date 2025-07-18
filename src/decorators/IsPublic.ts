import { SetMetadata, applyDecorators } from '@nestjs/common'
import { IS_PUBLIC_KEY } from '@config/constants'
import { ApiSecurity } from '@nestjs/swagger'

export const IsPublic = () =>
  applyDecorators(SetMetadata(IS_PUBLIC_KEY, true), ApiSecurity({}, []))
