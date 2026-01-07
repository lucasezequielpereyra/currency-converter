import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { currencyApi } from '../services/currencyApi'
import type { ConversionData } from '../types'

interface UseConversionParams {
  amount: string
  fromCurrency: string
  toCurrency: string
}

export const useConversion = ({ amount, fromCurrency, toCurrency }: UseConversionParams) => {
  // Fetch rate (only refetch when currencies change, not amount)
  const { data: rateData, isLoading, error } = useQuery({
    queryKey: ['conversion', fromCurrency, toCurrency],
    queryFn: async () => {
      // If same currency, no conversion needed
      if (fromCurrency === toCurrency) {
        return {
          rate: 1,
          date: new Date().toISOString(),
        }
      }

      // Fetch rates (only request the specific currency we need)
      const data = await currencyApi.getRates(fromCurrency, [toCurrency])
      const rate = data.rates[toCurrency]

      if (!rate) {
        throw new Error(`Currency conversion not available for ${toCurrency}`)
      }

      return {
        rate,
        date: data.date,
      }
    },
    enabled: !!fromCurrency && !!toCurrency,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 10, // 10 minutes - keep in cache
    retry: (failureCount, error) => {
      // Don't retry on network errors
      if (error instanceof Error && error.message === 'No internet connection') {
        return false
      }
      return failureCount < 3
    },
  })

  // Calculate conversion locally when amount or rate changes
  const conversionData = useMemo((): ConversionData | undefined => {
    if (!rateData) return undefined

    // Parse amount (remove formatting)
    const numericAmount = parseFloat(amount.replace(/\./g, '').replace(',', '.'))

    if (isNaN(numericAmount) || numericAmount <= 0) {
      return undefined
    }

    const convertedAmount = numericAmount * rateData.rate

    return {
      amount: numericAmount,
      fromCurrency,
      toCurrency,
      convertedAmount,
      rate: rateData.rate,
      date: rateData.date,
    }
  }, [amount, rateData, fromCurrency, toCurrency])

  return {
    data: conversionData,
    isLoading,
    error,
  }
}
