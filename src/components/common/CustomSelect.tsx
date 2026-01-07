'use no memo'

import React, { useState, useRef, useEffect, type ChangeEvent } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

export interface SelectOption {
  value: string
  label: string
}

interface CustomSelectProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  id?: string
  disabled?: boolean
  isLoading?: boolean
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className = '',
  id,
  disabled = false,
  isLoading = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const listboxId = `${id}-listbox`
  const searchId = `${id}-search`

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get selected option label
  const selectedOption = options.find(opt => opt.value === value)

  // Virtual scrolling configuration
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => 40,
    overscan: 5
  })

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  const handleToggle = () => {
    if (!disabled && !isLoading) {
      setIsOpen(!isOpen)
      setSearchTerm('')
    }
  }

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setFocusedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault()
        setIsOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setSearchTerm('')
        break
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => Math.max(prev - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          handleSelect(filteredOptions[focusedIndex].value)
        }
        break
    }
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <button
        id={id}
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled || isLoading}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-label={isLoading ? 'Loading currencies...' : selectedOption ? `Selected: ${selectedOption.label}` : placeholder}
        aria-busy={isLoading}
        className={`w-full px-4 py-2 text-left border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-violet focus:border-light-violet hover:border-light-violet transition-all flex items-center justify-between ${
          disabled || isLoading ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white cursor-pointer'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center gap-2 w-full">
            <div className="w-5 h-5 border-2 border-violet border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-400">Loading...</span>
          </div>
        ) : (
          <>
            <span className={selectedOption ? 'text-text' : 'text-gray-400'}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <svg
              className={`w-4 h-4 text-text transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-lg shadow-lg">
          <div className="p-2 border-b border-border">
            <label htmlFor={searchId} className="sr-only">
              Search options
            </label>
            <input
              ref={searchInputRef}
              id={searchId}
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search..."
              aria-label="Search options"
              className="w-full px-3 py-2 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-light-violet focus:border-light-violet"
            />
          </div>

          <div
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-label="Select an option"
            className="overflow-auto"
            style={{
              height: filteredOptions.length === 0 ? 'auto' : `${Math.min(filteredOptions.length * 40, 300)}px`,
              contain: 'strict'
            }}
          >
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center" role="status">
                No options found
              </div>
            ) : (
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative'
                }}
              >
                {rowVirtualizer.getVirtualItems().map(virtualItem => {
                  const option = filteredOptions[virtualItem.index]
                  const isSelected = option.value === value
                  const isFocused = virtualItem.index === focusedIndex

                  return (
                    <div
                      key={option.value}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`
                      }}
                    >
                      <button
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelect(option.value)}
                        className={`w-full h-full px-4 py-2 text-left text-sm hover:bg-light-violet focus:bg-light-violet focus:outline-none focus:ring-2 focus:ring-inset focus:ring-light-violet transition-colors ${
                          isSelected ? 'bg-light-violet-variant text-violet font-medium' : 'text-text'
                        } ${isFocused ? 'bg-light-violet' : ''}`}
                      >
                        {option.label}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
