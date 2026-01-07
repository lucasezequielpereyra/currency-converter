import { useCurrencyConverter, CurrencyForm, ConversionResult, ConversionTitle } from '@/features/currency-converter'

export const ContentCard = () => {
  const {
    amount,
    setAmount,
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    currencies,
    conversionData,
    isLoadingConversion,
    conversionError,
    swapCurrencies
  } = useCurrencyConverter()

  const fromCurrencyLabel = currencies.find(c => c.value === fromCurrency)?.label || fromCurrency
  const toCurrencyLabel = currencies.find(c => c.value === toCurrency)?.label || toCurrency

  return (
    <>
      <ConversionTitle
        amount={amount}
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
        fromCurrencyLabel={fromCurrencyLabel}
        toCurrencyLabel={toCurrencyLabel}
      />
      <div className="flex flex-col gap-12 md:gap-24 w-full max-w-290 h-full border-border border-solid border bg-white p-4 md:p-6 rounded-md shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
        <CurrencyForm
          amount={amount}
          onAmountChange={setAmount}
          fromCurrency={fromCurrency}
          onFromCurrencyChange={setFromCurrency}
          toCurrency={toCurrency}
          onToCurrencyChange={setToCurrency}
          currencies={currencies}
          onSwap={swapCurrencies}
        />
        <ConversionResult
          conversionData={conversionData}
          isLoading={isLoadingConversion}
          error={conversionError}
          fromCurrencyLabel={fromCurrencyLabel}
          toCurrencyLabel={toCurrencyLabel}
        />
      </div>
    </>
  )
}
