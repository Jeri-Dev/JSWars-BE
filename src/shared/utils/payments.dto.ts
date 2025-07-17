import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsString,
  IsCreditCard,
  IsEnum,
  IsOptional,
  IsDateString,
  MaxLength,
  IsNumberString,
  IsBoolean,
} from 'class-validator'

export enum CardType {
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
  AMERICAN_EXPRESS = 'AMERICAN_EXPRESS',
  DISCOVER = 'DISCOVER',
  AMEX = 'AMEX',
  DINERS_CLUB = 'DINERS_CLUB',
  JCB = 'JCB',
  'DINERS/DISCOVER' = 'DINERS/DISCOVER',
}

export class BillingAddressDTO {
  @ApiProperty({
    required: true,
    description: 'Country',
  })
  @IsNotEmpty()
  @IsString()
  country: string

  @ApiProperty({
    required: true,
    description: 'City',
  })
  @IsNotEmpty()
  @IsString()
  city: string

  @ApiProperty({
    required: true,
    description: 'Address Line 1',
  })
  @IsNotEmpty()
  @IsString()
  addressLine1: string

  @ApiProperty({
    required: false,
    description: 'Address Line 2',
  })
  @IsOptional()
  @IsString()
  addressLine2?: string

  @ApiProperty({
    required: true,
    description: 'Zone',
  })
  @IsNotEmpty()
  @IsString()
  zone: string

  @ApiProperty({
    required: true,
    description: 'ZIP code',
  })
  @IsNotEmpty()
  @IsString()
  zipCode: string
}

export class CreditCardPaymentDTO {
  @ApiProperty({
    required: true,
    description: "Cardholder's name",
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  cardholderName: string

  @ApiProperty({
    required: true,
    description: 'Credit card number',
    example: '4012000033330026',
  })
  @IsNotEmpty()
  @IsCreditCard()
  cardNumber: string

  @ApiProperty({
    required: true,
    description: 'Card expiration date',
    example: '2024-12-31',
  })
  @IsNotEmpty()
  @IsDateString({})
  expirationDate: string

  @ApiProperty({
    required: true,
    description: 'CVV code',
    example: '123',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(4)
  @IsNumberString({})
  cvv: string

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  defaultCard: boolean = false

  @ApiProperty({
    required: true,
    description: 'Card type',
    enum: CardType,
  })
  @IsNotEmpty()
  @IsEnum(CardType)
  cardType: CardType
}

export class PaymentMethodSelectionViewDto {
  id: string
  card_holder_name: string
  card_number: string
  card_type: string
}

export function maskCreditCardNumber(creditCardNumber: string): string {
  // Remove non-numeric characters from the input string
  const numericOnly = creditCardNumber.replace(/\D/g, '')

  // Mask all digits except the last four
  const maskedDigits = numericOnly
    .substring(0, numericOnly.length - 4)
    .replace(/\d/g, 'X')

  // Concatenate the masked digits with the last four digits
  const lastFourDigits = numericOnly.substring(numericOnly.length - 4)

  // Return the masked credit card number
  return maskedDigits + lastFourDigits
}

export function getLastFourDigitsCreditCard(creditCardNumber: string): string {
  // Remove non-numeric characters from the input string
  const numericOnly = creditCardNumber.replace(/\D/g, '')

  // Concatenate the masked digits with the last four digits
  const lastFourDigits = numericOnly.substring(numericOnly.length - 4)

  // Return the masked credit card number
  return lastFourDigits
}

/*export function formatNumberWithCommas(num: number): string {
  const truncatedNumber = Math.trunc(num * 100) / 100; // Truncate to two decimal places
  const numberWithTwoDecimals = truncatedNumber.toFixed(2); // Ensure two decimal places
  const options = {
    style: 'decimal',  // Other options: 'currency', 'percent', etc.
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  return numberWithTwoDecimals.toLocaleString('en-US', options);
}*/

export function formatNumberWithCommas(
  value: number,
  locale: string = 'es-DO',
  currency: string = 'DOP',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value)
}
