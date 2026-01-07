import { useState, useCallback } from 'react'
import { useCurrencies } from './useCurrencies'
import { useConversion } from './useConversion'

export const useCurrencyConverter = () => {
  const [amount, setAmount] = useState<string>('1')
  const [fromCurrency, setFromCurrency] = useState<string>('USD')
  const [toCurrency, setToCurrency] = useState<string>('EUR')

  // Fetch available currencies
  const { data: currencies = [], isLoading: isLoadingCurrencies } = useCurrencies()

  // Fetch conversion data
  const {
    data: conversionData,
    isLoading: isLoadingConversion,
    error: conversionError
  } = useConversion({ amount, fromCurrency, toCurrency })

  /**
   * Swap from and to currencies
   */
  const swapCurrencies = useCallback(() => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }, [fromCurrency, toCurrency])

  return {
    amount,
    setAmount,
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    currencies,
    isLoadingCurrencies,
    conversionData,
    isLoadingConversion,
    conversionError,
    swapCurrencies
  }
}
