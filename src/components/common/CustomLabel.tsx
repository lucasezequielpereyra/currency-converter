import React from 'react'

interface CustomLabelProps {
  htmlFor?: string
  children: React.ReactNode
  className?: string
}

export const CustomLabel: React.FC<CustomLabelProps> = ({
  htmlFor,
  children,
  className = ''
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-md font-medium text-text mb-1 ${className}`}
    >
      {children}
    </label>
  )
}
