import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { locales, publicCopy } from './copy'

for (const locale of locales) {
  for (const long of [false, true]) {
    for (const width of [320, 768, 1280]) {
      for (const state of ['populated', 'loading', 'empty', 'no-matches', 'error'] as const) {
        test(`${locale} ${state} ${long ? 'long' : 'normal'} copy fits ${width}px accessibly`, async ({ page }) => {
          await page.setViewportSize({ width, height: 900 })
          await page.emulateMedia({ reducedMotion: 'reduce' })
          await page.goto(`http://127.0.0.1:4174/tests/browser/fixture.html?state=${state}&locale=${locale}&copy=${long ? 'long' : 'normal'}`)
          if (state === 'no-matches') {
            const category = page.locator('.filter-field select').first()
            await expect(category).toBeEnabled()
            await category.selectOption('nutrition')
          }
          await expect(page.getByRole('status')).toHaveText(publicCopy[locale][state])
          expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
          const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
          expect(results.violations).toEqual([])
          for (const element of await page.getByRole('button').all()) await expect(element).toBeVisible()
          await expect(page.getByRole('combobox', { name: publicCopy[locale].language })).toBeVisible()
          await expect(page.getByRole('link', { name: publicCopy[locale].discovery })).toBeVisible()
          await expect(page.locator('.sample-notice')).toBeVisible()
          await expect(page.getByRole('contentinfo')).toContainText(locale === 'es' ? 'Retratos ilustrativos.' : 'Illustrative portraits.')
          if (state === 'populated') {
            await expect(page.getByText(publicCopy[locale].unavailable).first()).toBeVisible()
            await expect(page.getByRole('article')).toHaveCount(6)
          }
          expect(await page.locator('html').evaluate((element) => getComputedStyle(element).scrollBehavior)).toBe('auto')
          await page.screenshot({ path: `test-results/screenshots/${locale}-${state}-${long ? 'long' : 'normal'}-${width}.png`, fullPage: true })
        })
      }
    }
  }
}
