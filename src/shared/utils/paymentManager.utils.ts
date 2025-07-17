import * as fs from 'node:fs'
import * as https from 'node:https'
import { AZUL, NODE_ENV } from '@config/enviroments'
import axios from 'axios'
import {
  getLastFourDigitsCreditCard,
  CreditCardPaymentDTO,
} from './payments.dto'
import { ITransactionResponse } from '@contracts/utils/Azul'

const getOptions = () => {
  let certFile
  let keyFile

  const fullPath = process.cwd()

  if (process.env.NODE_ENV === 'development') {
    const routePath = `${fullPath}/certificates_prod/`
    fs.readdirSync(routePath).forEach(function (file: any) {
      const route = routePath + file
      const fileContent = fs.readFileSync(route)
      if (file === 'everydaymetricsCERT.pem') {
        certFile = fileContent
      } else if (file === 'everydaymetricsKEY.pem') {
        keyFile = fileContent
      }
    })
  } else {
    const routePath = `${fullPath}/certificates_dev/`
    fs.readdirSync(routePath).forEach(function (file: any) {
      const route = routePath + file
      const fileContent = fs.readFileSync(route)
      if (file === 'Codika_cert.pem') {
        certFile = fileContent
      } else if (file === 'Key.pem') {
        keyFile = fileContent
      }
    })
  }
  const options: any = new https.Agent({
    key: keyFile,
    cert: certFile,
  })

  return options
}

const formatExpirationDate = (date: string): string => {
  const dateInstance: Date = new Date(date)
  const year: number = dateInstance.getFullYear()
  const month: number = dateInstance.getMonth() + 1 // Month is zero-based, so add 1

  // Pad single-digit months with a leading zero
  const formattedMonth: string = month < 10 ? `0${month}` : `${month}`

  return `${year}${formattedMonth}`
}

interface ISuccessResponse {
  maskCard: string
  brand: string
  expirationCard: string
  token: string
  isSuccess: true
  ErrorDescription: string
  ResponseCode: string
}

interface IErrorResponse {
  isSuccess: false
  ErrorDescription: string
  ResponseCode: string
}

export const SavePaymentMethod = async (
  paymentInformation: CreditCardPaymentDTO,
  otp: string,
): Promise<ISuccessResponse | IErrorResponse> => {
  const maskCard = getLastFourDigitsCreditCard(paymentInformation.cardNumber) // Mask CardNumber

  const orderId = Date.now().toString(36).toUpperCase()

  const jsonData = {
    Channel: AZUL.AZUL_PAYMENT_CHANNEL,
    Store: AZUL.AZUL_PAYMENT_STORE,
    Expiration: formatExpirationDate(paymentInformation.expirationDate),
    CVC: paymentInformation.cvv,
    CardNumber: paymentInformation.cardNumber,
    PosInputMode: 'E-Commerce',
    TrxType: 'Hold',
    Amount: 100, //TODO: esto deberia ser 1 peso pero da error
    Itbis: '00', //this fields only support int, the last two character are the decimals
    CurrencyPosCode: '$',
    Payments: 1,
    Plan: 0,
    AcquirerRefData: 1,
    RRN: '',
    CustomerServicePhone: '',
    OrderNumber: orderId,
    ECommerceUrl: '',
    CustomOrderId: orderId,
    DataVaultBrand: '',
    DataVaultExpiration: formatExpirationDate(
      paymentInformation.expirationDate,
    ),
    DataVaultToken: '',
    SaveToDataVault: 1,
    ForceNo3DS: '',

    //TODO: verificar el este campo, solo funciona en ambiente de producción
    AltMerchantName: otp,
  }

  const response = await sendPayload(jsonData)

  if (response) {
    return {
      maskCard,
      brand: response.DataVaultBrand,
      expirationCard: response.DataVaultExpiration,
      token: response.DataVaultToken,
      isSuccess: true,
      ErrorDescription: response?.ErrorDescription ?? '',
      ResponseCode: response?.ResponseCode ?? '',
    }
  } else {
    return response
  }
}

export const ConfirmPaymentMethod = async (token: string) => {
  const roundedPrice = 100

  const jsonData = {
    Channel: AZUL.AZUL_PAYMENT_CHANNEL,
    Store: AZUL.AZUL_PAYMENT_STORE,
    Expiration: '',
    CVC: '',
    CardNumber: '',
    PosInputMode: 'E-Commerce',
    TrxType: 'Void',
    Amount: roundedPrice,
    Itbis: '00', //this fields only support int, the last two character are the decimals
    CurrencyPosCode: '$',
    Payments: 1,
    Plan: 0,
    AcquirerRefData: 1,
    RRN: '',
    CustomerServicePhone: '',
    OrderNumber: '',
    ECommerceUrl: '',
    CustomOrderId: '',
    DataVaultBrand: '',
    DataVaultExpiration: '',
    DataVaultToken: token,
    SaveToDataVault: 0,
    AltMerchantName: '',
    ForceNo3DS: '',
  }

  return await sendPayload(jsonData)
}

export const MakePayment = async (
  token: string,
  expiration: string,
  price: number,
  order_number: number,
  orderId: string,
) => {
  if (price <= 0) {
    throw new Error('Invalid price')
  }

  const roundedPrice =
    NODE_ENV !== 'DEVELOPMENT' ? Math.round(price * 100) : 100

  const jsonData = {
    Channel: AZUL.AZUL_PAYMENT_CHANNEL,
    Store: AZUL.AZUL_PAYMENT_STORE,
    Expiration: '',
    CVC: '',
    CardNumber: '',
    PosInputMode: 'E-Commerce',
    TrxType: 'Sale',
    Amount: roundedPrice,
    Itbis: '00', //this fields only support int, the last two character are the decimals
    CurrencyPosCode: '$',
    Payments: 1,
    Plan: 0,
    AcquirerRefData: 1,
    RRN: '',
    CustomerServicePhone: '',
    OrderNumber: order_number,
    ECommerceUrl: '',
    CustomOrderId: orderId,
    DataVaultBrand: '',
    DataVaultExpiration: expiration,
    DataVaultToken: token,
    SaveToDataVault: 0,
    AltMerchantName: '',
    ForceNo3DS: '',
  }

  return (await sendPayload(jsonData, true)) as {
    ok: boolean
    data: ITransactionResponse
  }
}

const sendPayload = async (jsonData: any, resultValidate: boolean = false) => {
  const url = `https://${AZUL.AZUL_PAYMENT_URL.toString().trim()}${AZUL.AZUL_PAYMENT_PATH.toString().trim()}`

  const response = await axios.post(url, jsonData, {
    httpsAgent: getOptions(),
    headers: {
      'Content-Type': 'application/json',
      Auth1: process.env.AZUL_PAYMENT_AUTH1.toString().trim(),
      Auth2: process.env.AZUL_PAYMENT_AUTH2.toString().trim(),
    },
  })

  if (response.data.ResponseMessage == 'APROBADA') {
    return resultValidate
      ? {
          ok: true,
          data: response.data,
        }
      : response.data
  }

  return resultValidate ? { ok: false, data: response.data } : false
}
