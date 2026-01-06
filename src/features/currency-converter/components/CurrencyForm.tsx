import { CustomLabel, CustomSelect, PriceInput } from '@/components/common'
import { InvertIcon } from '@/assets/icons/InvertIcon'
import type { Currency } from '@/features/currency-converter/types'

interface CurrencyFormProps {
  amount: string
  onAmountChange: (value: string) => void
  fromCurrency: string
  onFromCurrencyChange: (value: string) => void
  toCurrency: string
  onToCurrencyChange: (value: string) => void
  currencies: Currency[]
  onSwap: () => void
}

export const CurrencyForm: React.FC<CurrencyFormProps> = ({
  amount,
  onAmountChange,
  fromCurrency,
  onFromCurrencyChange,
  toCurrency,
  onToCurrencyChange,
  currencies,
  onSwap
}) => {
  const fromCurrencyOptions = currencies.filter(currency => currency.value !== toCurrency)
  const toCurrencyOptions = currencies.filter(currency => currency.value !== fromCurrency)

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
      <div className="flex flex-col w-full">
        <CustomLabel htmlFor="amount">Amount</CustomLabel>
        <PriceInput
          id="amount"
          placeholder="Enter amount"
          value={amount}
          onChange={onAmountChange}
          minValue={1}
        />
      </div>
      <div className="flex flex-col w-full">
        <CustomLabel htmlFor="fromCurrency">From</CustomLabel>
        <CustomSelect
          options={fromCurrencyOptions}
          value={fromCurrency}
          onChange={onFromCurrencyChange}
          id="fromCurrency"
        />
      </div>
      <div className="flex justify-center md:flex-col">
        <div className="hidden md:block text-md font-medium mb-1 invisible">.</div>
        <button
          onClick={onSwap}
          className="flex items-center justify-center rounded-full border border-violet text-violet hover:opacity-80 transition-opacity p-2 cursor-pointer rotate-90 md:rotate-0"
          aria-label="Swap currencies"
        >
          <InvertIcon width={16} height={16} />
        </button>
      </div>
      <div className="flex flex-col w-full">
        <CustomLabel htmlFor="toCurrency">To</CustomLabel>
        <CustomSelect
          options={toCurrencyOptions}
          value={toCurrency}
          onChange={onToCurrencyChange}
          id="toCurrency"
        />
      </div>
    </div>
  )
}
