import React, { type ChangeEvent } from 'react'

interface PriceInputProps {
  value: string
  onChange: (value: string) => void
  minValue?: number
  placeholder?: string
  className?: string
  id?: string
}

export const PriceInput: React.FC<PriceInputProps> = ({
  value,
  onChange,
  minValue,
  placeholder = '0',
  className = '',
  id
}) => {

  const formatPrice = (val: string): string => {
    // Remove everything except digits and commas
    const cleaned = val.replace(/[^\d,]/g, '')

    // Split integer and decimal parts
    const parts = cleaned.split(',')
    let integerPart = parts[0] || ''
    const decimalPart = parts[1] || ''

    // Format integer part with thousand separators
    if (integerPart) {
      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }

    // Reconstruct the value
    if (parts.length > 1) {
      return `${integerPart},${decimalPart.slice(0, 10)}` // Limit to 10 decimals
    }

    return integerPart
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    // Remove "$" prefix
    const withoutPrefix = inputValue.replace(/^\$\s*/, '')

    // Validate it only contains digits, dots and commas
    if (withoutPrefix && !/^[\d.,]*$/.test(withoutPrefix)) {
      return
    }

    // Format the value
    const formatted = formatPrice(withoutPrefix)

    // Validate minValue if defined
    if (minValue !== undefined && formatted) {
      const numericValue = parseFloat(formatted.replace(/\./g, '').replace(',', '.'))
      if (!isNaN(numericValue) && numericValue < minValue) {
        return
      }
    }

    onChange(formatted)
  }

  const displayValue = value ? `$ ${value}` : ''

  return (
    <input
      id={id}
      type="text"
      inputMode="decimal"
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      aria-label="Amount in currency"
      className={`w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-violet focus:border-light-violet hover:border-light-violet transition-all ${className}`}
    />
  )
}
