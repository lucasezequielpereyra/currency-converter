import { useQuery } from '@tanstack/react-query'
import { currencyApi } from '../services/currencyApi'
import type { Currency } from '../types'

export const useCurrencies = () => {
  return useQuery({
    queryKey: ['currencies'],
    queryFn: async () => {
      const data = await currencyApi.getCurrencies()
      const currencies: Currency[] = Object.entries(data)
        .map(([code, info]) => ({
          value: code,
          label: info.name,
        }))
        .sort((a, b) => a.value.localeCompare(b.value))
      return currencies
    },
    staleTime: 1000 * 60 * 60, // 1 hour - currencies don't change often
  })
}
