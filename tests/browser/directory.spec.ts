import { expect, test } from '@playwright/test'

test('public Spanish entry switches without resetting filters, portraits and metadata, then reloads', async ({ page }) => {
  const failedAssets: string[] = []
  const dataRequests: string[] = []
  const remoteImages: string[] = []
  page.on('response', (response) => { if (response.status() >= 400) failedAssets.push(response.url()) })
  page.on('request', (request) => {
    if (['fetch', 'xhr'].includes(request.resourceType())) dataRequests.push(request.url())
    if (request.resourceType() === 'image' && !request.url().startsWith('http://127.0.0.1:')) remoteImages.push(request.url())
  })
  await page.goto('./')
  await expect(page.getByRole('heading', { name: 'Directorio profesional', level: 1 })).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  await expect(page).toHaveTitle('Directorio profesional · VeganPro')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Personas y datos ficticios/)
  await expect(page.getByRole('article')).toHaveCount(6)
  await expect(page.locator('article img')).toHaveCount(5)
  for (const name of ['Noah Grove', 'Robin Meadow']) {
    await expect(page.getByRole('article').filter({ has: page.getByRole('heading', { name, exact: true }) }).locator('img')).toBeVisible()
  }
  await expect(page.locator('article .portrait-fallback')).toHaveCount(1)
  for (const img of await page.locator('article img').all()) {
    await expect.poll(() => img.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true)
    expect(await img.getAttribute('alt')).toBe('')
    const url = await img.getAttribute('src')
    expect(url?.startsWith('data:') || url?.startsWith(new URL(page.url()).pathname + 'assets/')).toBe(true)
  }
  await page.getByRole('combobox', { name: 'Categoría profesional' }).selectOption('nutrition')
  await expect(page.getByRole('article')).toHaveCount(2)
  const names = await page.locator('article h3').allTextContents()
  const selector = page.locator('.language-selector select')
  await selector.focus()
  await selector.selectOption('en')
  await expect(page.getByRole('combobox', { name: 'Language' })).toBeFocused()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page).toHaveTitle('Professional directory · VeganPro')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Fictional people and sample data/)
  await expect(page.getByRole('combobox', { name: 'Professional category' })).toHaveValue('nutrition')
  expect(await page.locator('article h3').allTextContents()).toEqual(names)
  await page.getByRole('link', { name: 'Explore professionals' }).click()
  await expect(page.getByRole('heading', { name: 'Find your next connection' })).toBeFocused()
  await expect(page.getByRole('article')).toHaveCount(2)
  await expect(page.getByText(/Portraits are illustrations and do not identify real professionals/)).toBeVisible()
  await page.getByRole('combobox', { name: 'Language' }).selectOption('es')
  await expect(page.getByRole('contentinfo')).toContainText('Retratos ilustrativos.')
  await expect(page.getByRole('combobox', { name: 'Categoría profesional' })).toHaveValue('nutrition')
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Directorio profesional', level: 1 })).toBeVisible()
  await expect(page.getByRole('combobox', { name: 'Idioma' })).toHaveValue('es')
  await expect(page.getByRole('article')).toHaveCount(6)
  expect(failedAssets).toEqual([])
  expect(dataRequests).toEqual([])
  expect(remoteImages).toEqual([])
  await page.screenshot({ path: 'test-results/screenshots/prototype.png', fullPage: true })
})

test('browser fallback labels retain actual language and safe accessible names', async ({ page }) => {
  await page.goto('http://127.0.0.1:4174/tests/browser/fixture.html?locale=en&copy=fallback')
  await expect(page.getByRole('combobox', { name: 'Categoría profesional' })).toBeEnabled()
  await expect(page.getByText('Categoría profesional')).toHaveAttribute('lang', 'es')
  await expect(page.getByRole('option', { name: 'Nutrición' })).toHaveAttribute('lang', 'es')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})
