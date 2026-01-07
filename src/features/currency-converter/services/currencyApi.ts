const BASE_URL = 'https://api.vatcomply.com'

export interface RatesResponse {
  date: string
  base: string
  rates: Record<string, number>
}

export interface CurrencyData {
  name: string
  symbol: string
}

export interface CurrenciesResponse {
  [code: string]: CurrencyData
}

export const currencyApi = {
  /**
   * Fetch latest exchange rates for a base currency
   * @param baseCurrency - The base currency code (e.g., 'USD')
   * @param symbols - Optional array of currency codes to filter rates
   * @returns Promise with rates data
   */
  async getRates(baseCurrency: string = 'USD', symbols?: string[]): Promise<RatesResponse> {
    try {
      let url = `${BASE_URL}/rates?base=${baseCurrency}`

      if (symbols && symbols.length > 0) {
        url += `&symbols=${symbols.join(',')}`
      }

      const response = await fetch(url)

      // Check for server errors (5xx)
      if (response.status >= 500) {
        throw new Error('Server error')
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch rates: ${response.statusText}`)
      }

      const data = await response.json()

      // Check if response contains error (API returns 200 with error object)
      if (data.error) {
        if (data.error.includes('Base currency') && data.error.includes('not available')) {
          // Extract base currency code from error message or URL
          const baseMatch = data.error.match(/Base currency '([A-Z]+)'/)
          const currencyCode = baseMatch ? baseMatch[1] : baseCurrency
          throw new Error(`Base currency not available for ${currencyCode}`)
        }
        if (data.error.includes('not available')) {
          // Extract currency code from symbols parameter if it exists
          const symbolMatch = url.match(/symbols=([A-Z]+)/)
          const currencyCode = symbolMatch ? symbolMatch[1] : 'requested currency'
          throw new Error(`Currency conversion not available for ${currencyCode}`)
        }
        throw new Error(data.error)
      }

      return data as RatesResponse
    } catch (error) {
      // Check if error is due to network failure
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('No internet connection')
      }
      console.error('Error fetching currency rates:', error)
      throw error
    }
  },

  /**
   * Convert amount from one currency to another
   * @param amount - Amount to convert
   * @param fromCurrency - Source currency code
   * @param toCurrency - Target currency code
   * @returns Promise with converted amount
   */
  async convert(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<number> {
    try {
      const data = await this.getRates(fromCurrency)
      const rate = data.rates[toCurrency]

      if (!rate) {
        throw new Error(`Rate not found for ${toCurrency}`)
      }

      return amount * rate
    } catch (error) {
      console.error('Error converting currency:', error)
      throw error
    }
  },

  /**
   * Get available currencies with names from API
   * @returns Promise with currencies object
   */
  async getCurrencies(): Promise<CurrenciesResponse> {
    try {
      const response = await fetch(`${BASE_URL}/currencies`)

      // Check for server errors (5xx)
      if (response.status >= 500) {
        throw new Error('Server error')
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch currencies: ${response.statusText}`)
      }

      const data = await response.json()
      return data as CurrenciesResponse
    } catch (error) {
      // Check if error is due to network failure
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('No internet connection')
      }
      console.error('Error fetching currencies:', error)
      throw error
    }
  }
}
