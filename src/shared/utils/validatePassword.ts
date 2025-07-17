interface IValidatePasswordParams {
  password: string
  confirmPassword?: string
}

export const validatePassword = ({
  password,
  confirmPassword,
}: IValidatePasswordParams) => {
  const regexNumber = /\d/
  const regexEspChar = /[!@#$%^&*()_+[\]{};:'"\\<>,.?/~`-]/
  const regexUpper = /[A-Z]/
  const regexLower = /[a-z]/
  if (confirmPassword && password !== confirmPassword) {
    return {
      success: false,
      message: 'Las contraseñas no coinciden',
    }
  }

  if (password.length < 8) {
    return {
      success: false,
      message: 'La contraseña debe tener al menos 8 caracteres',
    }
  }

  if (!regexNumber.test(password)) {
    return {
      success: false,
      message: 'La contraseña debe tener al menos un número',
    }
  }

  if (!regexEspChar.test(password)) {
    return {
      success: false,
      message: 'La contraseña debe tener al menos un carácter especial',
    }
  }

  if (!regexUpper.test(password)) {
    return {
      success: false,
      message: 'La contraseña debe tener al menos una mayúscula',
    }
  }

  if (!regexLower.test(password)) {
    return {
      success: false,
      message: 'La contraseña debe tener al menos una minúscula',
    }
  }

  return {
    success: true,
    message: 'Contraseña válida',
  }
}
