// deno-lint-ignore-file
import { APP_HOST } from '@config/enviroments'
import React from 'npm:react'
import {
  Hr,
  Img,
  Body,
  Head,
  Html,
  Link,
  Text,
  Button,
  Heading,
  Preview,
  Section,
  Tailwind,
  Container,
} from 'npm:@react-email/components'

interface EmailCreateAccountProps {
  name: string
  url: string
}

export function EmailCreateAccount(props: EmailCreateAccountProps) {
  const { name, url } = props

  const previewText = `Crea tu cuenta en MotionCue`

  return (
    <Html lang="es">
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto px-2 font-sans bg-[#0b0c0f]">
          <Preview>{previewText}</Preview>
          <Container className="mx-auto my-[40px] max-w-[465px] rounded p-[20px] border border-gray-800 bg-gray-900">
            <Section className="text-center">
              <Img
                src={`${APP_HOST}/logo.png`}
                width="auto"
                height="60"
                alt="MotionCue Logo"
                className="mx-auto my-0"
              />
            </Section>

            <Heading className="mx-0 my-[30px] p-0 text-center font-semibold text-[24px] text-gray-100">
              Crear cuenta
            </Heading>

            <Text className="text-gray-300 text-[14px] leading-[24px]">
              Hola {name},
            </Text>

            <Text className="text-gray-300 text-[14px] leading-[24px]">
              Clica en el botón de abajo para crear la contraseña de tu cuenta.
            </Text>

            <Section className="text-center my-[30px]">
              <Button
                href={url}
                className="bg-gray-100 text-gray-900 px-10 py-3 rounded-md font-semibold text-base no-underline"
              >
                Crear cuenta
              </Button>
            </Section>

            <Text className="text-gray-500 text-[14px] leading-[24px]">
              Este enlace sera válido por las próximas 2 horas. Si no has
              solicitado crear una cuenta, puedes ignorar este correo.
            </Text>

            <Hr className="mx-0 my-[26px] w-full border border-gray-800 border-solid" />

            <Text className="text-gray-500 text-[12px] leading-[24px]">
              Si no realizaste esta solicitud, por favor ignóra este correo.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

EmailCreateAccount.PreviewProps = {
  name: 'Ejemplo',
  url: 'https://example.com',
} as EmailCreateAccountProps

export default EmailCreateAccount
