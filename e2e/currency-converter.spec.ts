import { test, expect, Page } from '@playwright/test'

test.describe('Currency Converter E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for currencies to load
    await page.locator('#fromCurrency').waitFor({ state: 'visible', timeout: 10000 })
    await page.locator('#toCurrency').waitFor({ state: 'visible', timeout: 10000 })
  })

  const currencyPairs = [
    { from: 'USD', to: 'EUR', fromLabel: 'US Dollar', toLabel: 'Euro' },
    { from: 'EUR', to: 'USD', fromLabel: 'Euro', toLabel: 'US Dollar' },
    { from: 'GBP', to: 'CAD', fromLabel: 'British Pound', toLabel: 'Canadian Dollar' },
    { from: 'CAD', to: 'GBP', fromLabel: 'Canadian Dollar', toLabel: 'British Pound' },
  ]

  const amounts = ['1', '100']

  // Helper function to select currency from dropdown
  async function selectCurrency(page: Page, selectId: 'fromCurrency' | 'toCurrency', currencyLabel: string) {
    // Check if currency is already selected
    const currentText = await page.locator(`#${selectId}`).textContent()
    if (currentText?.includes(currencyLabel)) {
      // Already selected, no need to change
      return
    }

    // Click the select button by id
    await page.locator(`#${selectId}`).click()

    // Wait for listbox to appear
    await page.locator(`#${selectId}-listbox`).waitFor({ state: 'visible', timeout: 5000 })

    // Click directly on the option containing the currency label
    // The button text will contain the full label like "US Dollar", "Euro", etc.
    await page.getByRole('option', { name: currencyLabel }).click()

    // Wait for dropdown to close
    await page.waitForTimeout(300)
  }

  currencyPairs.forEach(({ from, to, fromLabel, toLabel }) => {
    amounts.forEach((amount) => {
      test(`should convert ${amount} ${from} to ${to} correctly`, async ({ page }) => {
        // Fill amount
        const amountInput = page.locator('input[type="text"]').first()
        await amountInput.clear()
        await amountInput.fill(amount)

        // Get current selected currencies
        const currentFrom = await page.locator('#fromCurrency').textContent()
        const currentTo = await page.locator('#toCurrency').textContent()

        // Check if we need to swap (if desired currencies are opposite of current)
        if (currentFrom?.includes(toLabel) && currentTo?.includes(fromLabel)) {
          // Currencies are reversed, use swap button
          await page.locator('button[aria-label="Swap currencies"]').click()
          await page.waitForTimeout(500)
        } else {
          // Change currencies in the correct order to avoid filtering issues
          // First change "to" if needed, then "from"
          await selectCurrency(page, 'toCurrency', toLabel)
          await page.waitForTimeout(500) // Wait for dropdown to update options
          await selectCurrency(page, 'fromCurrency', fromLabel)
        }

        // Wait for conversion to complete
        await page.waitForTimeout(2000)

        // Verify title shows correct amount and currencies
        const formattedAmount = amount.replace('.', ',')
        const expectedTitle = `${formattedAmount} ${from} to ${to} - Convert ${fromLabel} to ${toLabel}`
        await expect(page.locator('h2')).toContainText(expectedTitle)

        // Verify conversion result exists (we can't predict exact values from real API)
        // But we can verify the structure - look for text containing both currency labels
        const resultSection = page.locator('section[aria-label="Conversion results"]')
        await expect(resultSection).toBeVisible()
        await expect(resultSection).toContainText(fromLabel)
        await expect(resultSection).toContainText(toLabel)
        await expect(resultSection).toContainText('=')

        // Verify inverse rate is shown
        await expect(page.locator('p').filter({ hasText: `1 ${to} =` })).toBeVisible()

        // Verify date format shows "at XX:XX UTC"
        await expect(page.locator('time').first()).toContainText('at')
        await expect(page.locator('time').first()).toContainText('UTC')

        // Verify conversion info text with currency labels
        await expect(page.locator('p').filter({ hasText: `${fromLabel} to ${toLabel} conversion —` })).toBeVisible()

        // Verify informational message is visible
        await expect(page.locator('p').filter({ hasText: 'We use the mid-market rate for our Converter' })).toBeVisible()
      })
    })
  })

  test('should display error when currency is not available (BGN)', async ({ page }) => {
    // Mock BGN to return error response
    await page.route('**/api.vatcomply.com/rates?base=BGN**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          error: "Base currency 'BGN' not available in current rates data",
        }),
      })
    })

    // Select BGN as from currency
    await selectCurrency(page, 'fromCurrency', 'Bulgarian Lev')

    // Wait for error
    await page.waitForTimeout(2000)

    // Verify error message with currency label
    await expect(page.locator('[role="alert"]')).toContainText('Base currency not available for Bulgarian Lev')

    // Verify informational message is still visible
    await expect(page.locator('p').filter({ hasText: 'We use the mid-market rate for our Converter' })).toBeVisible()
  })

  test('should display error when no internet connection', async ({ page }) => {
    // Mock network error for specific currency change
    await page.route('**/api.vatcomply.com/rates?base=GBP**', async (route) => {
      await route.abort('failed')
    })

    // Change currency to trigger error
    await selectCurrency(page, 'fromCurrency', 'British Pound')

    // Wait for error
    await page.waitForTimeout(2000)

    // Verify error message
    const errorSection = page.locator('[role="alert"]')
    await expect(errorSection).toBeVisible()

    // Check for either the explicit error message or the fallback message
    const text = await errorSection.textContent()
    const hasConnectionError = text?.includes('Unable to load conversion data') ||
                               text?.includes('Lost internet connection')
    expect(hasConnectionError).toBeTruthy()

    // Verify informational message is still visible
    await expect(page.locator('p').filter({ hasText: 'We use the mid-market rate for our Converter' })).toBeVisible()
  })

  test('should display error when server returns 500', async ({ page }) => {
    // Mock server error
    await page.route('**/api.vatcomply.com/rates?base=CHF**', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      })
    })

    // Select CHF as from currency
    await selectCurrency(page, 'fromCurrency', 'Swiss Franc')

    // Wait for error
    await page.waitForTimeout(2000)

    // Verify error message
    await expect(page.locator('[role="alert"]')).toContainText('The server is experiencing issues')

    // Verify informational message is still visible
    await expect(page.locator('p').filter({ hasText: 'We use the mid-market rate for our Converter' })).toBeVisible()
  })

  test('should keep informational message visible during loading', async ({ page }) => {
    // Verify info message is visible during initial load
    await expect(page.locator('p').filter({ hasText: 'We use the mid-market rate for our Converter' })).toBeVisible()

    // Change currency
    await selectCurrency(page, 'fromCurrency', 'British Pound')

    // Verify info message stays visible during loading
    await expect(page.locator('p').filter({ hasText: 'We use the mid-market rate for our Converter' })).toBeVisible()

    // Wait for conversion to complete
    await page.waitForTimeout(2000)

    // Verify info message is still visible after load
    await expect(page.locator('p').filter({ hasText: 'We use the mid-market rate for our Converter' })).toBeVisible()
  })

  test('should display correct number formatting (European format)', async ({ page }) => {
    // Enter a large amount with decimal
    const amountInput = page.locator('input[type="text"]').first()
    await amountInput.clear()
    await amountInput.fill('1000.50')

    // Wait for conversion
    await page.waitForTimeout(2000)

    // Get the conversion result text
    const resultText = await page.locator('section p').filter({ hasText: '=' }).first().textContent()

    // Verify European number formatting is used
    // Should contain comma for decimals: X,XX
    expect(resultText).toMatch(/\d+,\d+/)
  })

  test('should update amount dynamically in title', async ({ page }) => {
    const amounts = ['5', '50', '500']

    for (const amount of amounts) {
      const amountInput = page.locator('input[type="text"]').first()
      await amountInput.clear()
      await amountInput.fill(amount)

      await page.waitForTimeout(500)

      // Verify title updates with new amount
      const formattedAmount = amount.replace('.', ',')
      await expect(page.locator('h2')).toContainText(`${formattedAmount} USD to EUR`)
    }
  })

  test('should not refetch when amount changes', async ({ page }) => {
    let requestCount = 0

    // Track API requests
    await page.route('**/api.vatcomply.com/rates**', async (route) => {
      requestCount++
      await route.continue()
    })

    // Wait for initial load
    await page.waitForTimeout(1000)
    const initialRequests = requestCount

    // Change amount multiple times
    const amountInput = page.locator('input[type="text"]').first()

    await amountInput.clear()
    await amountInput.fill('50')
    await page.waitForTimeout(500)

    await amountInput.clear()
    await amountInput.fill('100')
    await page.waitForTimeout(500)

    await amountInput.clear()
    await amountInput.fill('200')
    await page.waitForTimeout(500)

    // Verify no additional requests were made
    expect(requestCount).toBe(initialRequests)
  })
})
