interface ConversionTitleProps {
  amount: string
  fromCurrency: string
  toCurrency: string
  fromCurrencyLabel: string
  toCurrencyLabel: string
}

export const ConversionTitle: React.FC<ConversionTitleProps> = ({
  amount,
  fromCurrency,
  toCurrency,
  fromCurrencyLabel,
  toCurrencyLabel
}) => {
  // Format amount for display (remove formatting and parse)
  const displayAmount = amount || '1'

  return (
    <h2 className="text-white font-bold text-2xl my-12">
      {displayAmount} {fromCurrency} to {toCurrency} - Convert {fromCurrencyLabel} to {toCurrencyLabel}
    </h2>
  )
}
