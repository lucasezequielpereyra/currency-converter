import { useCurrencyConverter, CurrencyForm, ConversionResult } from '@/features/currency-converter'

const MOCK_CURRENCIES = [
  { label: 'US Dollar', value: 'USD' },
  { label: 'Euro', value: 'EUR' }
]

export const ContentCard = () => {
  const {
    amount,
    setAmount,
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    swapCurrencies
  } = useCurrencyConverter()

  return (
    <div className="flex flex-col gap-12 md:gap-24 w-full max-w-290 h-full border-border border-solid border bg-white p-4 md:p-6 rounded-md shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
      <CurrencyForm
        amount={amount}
        onAmountChange={setAmount}
        fromCurrency={fromCurrency}
        onFromCurrencyChange={setFromCurrency}
        toCurrency={toCurrency}
        onToCurrencyChange={setToCurrency}
        currencies={MOCK_CURRENCIES}
        onSwap={swapCurrencies}
      />
      <ConversionResult />
    </div>
  )
}
