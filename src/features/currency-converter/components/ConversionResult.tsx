import type { ConversionData } from '@/features/currency-converter/types'

interface ConversionResultProps {
  conversionData?: ConversionData
  isLoading: boolean
  error: Error | null
  fromCurrencyLabel: string
  toCurrencyLabel: string
}

export const ConversionResult: React.FC<ConversionResultProps> = ({
  conversionData,
  isLoading,
  error,
  fromCurrencyLabel,
  toCurrencyLabel
}) => {
  if (isLoading) {
    return (
      <section
        className="flex flex-col md:flex-row md:items-start md:justify-between w-full gap-6 md:gap-4"
        aria-label="Conversion results"
        aria-live="polite"
      >
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <div className="h-9 bg-light-violet animate-pulse rounded"></div>
          <div className="h-5 bg-light-violet animate-pulse rounded w-3/4"></div>
        </div>
        <aside className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="bg-light-violet rounded-lg p-4" role="note">
            <p className="text-sm text-black font-semibold leading-6 md:leading-10">
              We use the mid-market rate for our Converter. This is for informational purposes only.
              You won't receive this rate when sending money.
            </p>
          </div>
          <div className="h-4 bg-light-violet animate-pulse rounded"></div>
        </aside>
      </section>
    )
  }

  if (error) {
    // Replace currency code with label in error message
    let errorMessage = error.message

    // Handle network connection errors
    if (errorMessage === 'No internet connection') {
      errorMessage = 'Lost internet connection. Please check your network and try again.'
    }

    // Handle server errors
    if (errorMessage === 'Server error') {
      errorMessage = 'The server is experiencing issues. Please try again later.'
    }

    // Handle base currency (from) errors
    errorMessage = errorMessage.replace(
      /Base currency not available for (\w+)/,
      `Base currency not available for ${fromCurrencyLabel}`
    )

    // Handle target currency (to) errors
    errorMessage = errorMessage.replace(
      /Currency conversion not available for (\w+)/,
      `Currency conversion not available for ${toCurrencyLabel}`
    )

    return (
      <section
        className="flex flex-col md:flex-row md:items-start md:justify-between w-full gap-6 md:gap-4"
        aria-label="Conversion error"
        role="alert"
      >
        <div className="flex flex-col w-full md:w-1/2">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              {errorMessage}
            </p>
          </div>
        </div>
        <aside className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="bg-light-violet rounded-lg p-4" role="note">
            <p className="text-sm text-black font-semibold leading-6 md:leading-10">
              We use the mid-market rate for our Converter. This is for informational purposes only.
              You won't receive this rate when sending money.
            </p>
          </div>
        </aside>
      </section>
    )
  }

  // If no data and no explicit error, might be a connection issue
  if (!conversionData) {
    return (
      <section
        className="flex flex-col md:flex-row md:items-start md:justify-between w-full gap-6 md:gap-4"
        aria-label="Conversion error"
        role="alert"
      >
        <div className="flex flex-col w-full md:w-1/2">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              Unable to load conversion data. Please check your internet connection and try again.
            </p>
          </div>
        </div>
        <aside className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="bg-light-violet rounded-lg p-4" role="note">
            <p className="text-sm text-black font-semibold leading-6 md:leading-10">
              We use the mid-market rate for our Converter. This is for informational purposes only.
              You won't receive this rate when sending money.
            </p>
          </div>
        </aside>
      </section>
    )
  }

  const { amount, fromCurrency, toCurrency, convertedAmount, rate, date } = conversionData
  const inverseRate = 1 / rate

  const formatNumber = (num: number, decimals: number = 6) => {
    return num.toLocaleString('de-DE', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
  }

  const formatDate = (dateString: string) => {
    // Get current time in UTC
    const now = new Date()
    const hours = now.getUTCHours().toString().padStart(2, '0')
    const minutes = now.getUTCMinutes().toString().padStart(2, '0')

    // Format the date from API
    const d = new Date(dateString + 'T00:00:00Z')
    const dateFormatted = d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
    })

    return `${dateFormatted} at ${hours}:${minutes} UTC`
  }

  return (
    <section
      className="flex flex-col md:flex-row md:items-start md:justify-between w-full gap-6 md:gap-4"
      aria-label="Conversion results"
      aria-live="polite"
    >
      <div className="flex flex-col gap-2 w-full md:w-1/2">
        <p className="font-bold text-2xl md:text-3xl text-black" role="status">
          {formatNumber(amount, 2)} {fromCurrencyLabel} = {formatNumber(convertedAmount, 6)} {toCurrencyLabel}
        </p>
        <p className="text-sm md:text-base text-text">
          1 {toCurrency} = {formatNumber(inverseRate, 6)} {fromCurrency}
        </p>
      </div>
      <aside className="w-full md:w-1/2 flex flex-col gap-4">
        <div className="bg-light-violet rounded-lg p-4" role="note">
          <p className="text-sm text-black font-semibold leading-6 md:leading-10">
            We use the mid-market rate for our Converter. This is for informational purposes only.
            You won't receive this rate when sending money.
          </p>
        </div>
        <p className='text-xs md:text-left font-bold text-text'>
          <span className="underline">{fromCurrencyLabel}</span> to <span className="underline">{toCurrencyLabel}</span> conversion — Last updated <time dateTime={date}>{formatDate(date)}</time>
        </p>
      </aside>
    </section>
  )
}
