import { locales, publicCopy } from './copy'
import { expect, test } from '@playwright/test'

function contrast(a: string, b: string) {
  const luminance = (color: string) => {
    const rgb = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map((v) => {
      const c = v / 255
      return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4
    })
    return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722
  }
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (values[0] + .05) / (values[1] + .05)
}

for (const locale of locales) {
  const copy = publicCopy[locale]
  test(`${locale} keyboard can navigate native filters and clear with visible, contrasting focus`, async ({ page }) => {
    await page.goto('./')
    if (locale === 'en') await page.getByRole('combobox', { name: 'Idioma' }).selectOption('en')
    await page.locator('body').click({ position: { x: 1, y: 1 } })
    await expect(page.getByRole('status')).toHaveText(copy.populated)
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: copy.skip })).toBeFocused()
    await page.keyboard.press('Tab')
    const selector = page.locator('.language-selector select')
    await expect(selector).toBeFocused()
    const localeColors = await selector.evaluate((element) => {
      const css = getComputedStyle(element)
      return { text: css.color, background: css.backgroundColor, border: css.borderTopColor, outline: css.outlineColor, width: css.outlineWidth }
    })
    expect(contrast(localeColors.text, localeColors.background)).toBeGreaterThanOrEqual(4.5)
    expect(contrast(localeColors.border, localeColors.background)).toBeGreaterThanOrEqual(3)
    expect(contrast(localeColors.outline, 'rgb(247, 248, 242)')).toBeGreaterThanOrEqual(3)
    expect(parseFloat(localeColors.width)).toBeGreaterThanOrEqual(3)
    await selector.selectOption(locale === 'es' ? 'en' : 'es')
    await expect(page.getByRole('combobox', { name: publicCopy[locale === 'es' ? 'en' : 'es'].language })).toBeFocused()
    await selector.selectOption(locale)
    await page.keyboard.press('Tab')
    const discover = page.getByRole('link', { name: copy.discovery })
    await expect(discover).toBeFocused()
    const discoveryColors = await discover.evaluate((element) => {
      const css = getComputedStyle(element)
      return { text: css.color, background: css.backgroundColor, outline: css.outlineColor }
    })
    expect(contrast(discoveryColors.text, discoveryColors.background)).toBeGreaterThanOrEqual(4.5)
    expect(contrast(discoveryColors.outline, 'rgb(247, 248, 242)')).toBeGreaterThanOrEqual(3)
    await discover.press('Enter')
    await expect(page.getByRole('heading', { name: copy.destination })).toBeFocused()
    await page.keyboard.press('Tab')
    const category = page.getByRole('combobox', { name: copy.category })
    await expect(category).toBeFocused()
    const colors = await category.evaluate((element) => {
      const css = getComputedStyle(element)
      return { outline: css.outlineColor, outlineWidth: css.outlineWidth, text: css.color, background: css.backgroundColor, border: css.borderTopColor }
    })
    expect(parseFloat(colors.outlineWidth)).toBeGreaterThanOrEqual(3)
    expect(contrast(colors.outline, 'rgb(255, 255, 255)')).toBeGreaterThanOrEqual(3)
    expect(contrast(colors.border, colors.background)).toBeGreaterThanOrEqual(3)
    expect(contrast(colors.text, colors.background)).toBeGreaterThanOrEqual(4.5)
    await category.press('n')
    await category.press('Enter')
    await expect(category).toHaveValue('nutrition')
    await expect(page.getByRole('article')).toHaveCount(2)
    await expect(category).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(page.getByRole('combobox', { name: copy.affiliation })).toBeFocused()
    await page.keyboard.press('Tab')
    const clear = page.getByRole('button', { name: copy.clear })
    await expect(clear).toBeFocused()
    await clear.press('Enter')
    await expect(page.getByRole('article')).toHaveCount(6)
    await expect(clear).toBeFocused()
  })

  test(`${locale} keyboard recovery moves focus before its button disappears and not on result completion`, async ({ page }) => {
    await page.goto(`http://127.0.0.1:4174/tests/browser/fixture.html?state=no-matches&locale=${locale}`)
    await expect(page.getByRole('status')).toHaveText(copy.populated)
    await page.getByRole('combobox', { name: copy.category }).selectOption('nutrition')
    const clear = page.getByRole('button', { name: copy.recoveryClear })
    await clear.focus()
    await clear.press('Enter')
    await expect(page.getByRole('status')).toHaveText(copy.populated)
    await expect(page.getByRole('heading', { name: copy.heading })).toBeFocused()

    await page.goto(`http://127.0.0.1:4174/tests/browser/fixture.html?state=error&locale=${locale}`)
    const retry = page.getByRole('button', { name: copy.retry })
    await retry.focus()
    const buttonColors = await retry.evaluate((element) => {
      const css = getComputedStyle(element)
      return { text: css.color, background: css.backgroundColor }
    })
    expect(contrast(buttonColors.text, buttonColors.background)).toBeGreaterThanOrEqual(4.5)
    await retry.press('Enter')
    await expect(page.getByRole('status')).toHaveText(copy.error)
    await expect(page.getByRole('heading', { name: copy.heading })).toBeFocused()
  })

}
