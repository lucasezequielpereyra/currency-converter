export interface Currency {
  label: string
  value: string
}

export interface ConversionData {
  amount: number
  fromCurrency: string
  toCurrency: string
  convertedAmount: number
  rate: number
  date: string
}
