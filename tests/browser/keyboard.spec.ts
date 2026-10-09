import { locales, publicCopy } from './copy'
import { expect, test } from '@playwright/test'
import { observeFilterFocus } from './focusDiagnostics'

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
  test(`${locale} keyboard can navigate native filters and clear with visible, contrasting focus`, async ({ page, browser }, testInfo) => {
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
    const probe = await observeFilterFocus(page)
    const snapshots: Array<{ phase: string; active: unknown; controls: unknown; candidates: unknown }> = []
    const capture = async (phase: string) => {
      const state = await probe.evaluate((observer) => observer.snapshot())
      snapshots.push({ phase, ...state })
      return state
    }
    const traverse = async (key: string, phase: string) => {
      await capture(`before ${phase}`)
      await page.keyboard.press(key)
      // Capture before any auto-retrying focus assertion can obscure the move.
      await capture(`immediately after ${phase}`)
    }
    try {
      await capture('before selection')
      // No Enter or popup-opening key is sent during selection setup.
      await category.selectOption('nutrition')
      await expect(category).toHaveValue('nutrition')
      await expect(page.getByRole('article')).toHaveCount(2)
      await expect(category).toBeFocused()
      const beforeTab = await capture('after selection')
      expect(beforeTab.controls.every((control) => control.sameNode && control.originalConnected)).toBe(true)
      expect(beforeTab.candidates.filter((element) => element?.inFilters).map((element) => element?.id))
        .toEqual(beforeTab.controls.map((control) => control.current?.id))
      for (const control of beforeTab.controls) {
        expect(control.current).toMatchObject({ tabIndex: 0, tabindexAttribute: null, disabled: false, hidden: false, hiddenAncestor: false, inert: false, rendered: true, visibility: 'visible' })
      }
      await traverse('Tab', 'category to affiliation')
      const affiliation = page.getByRole('combobox', { name: copy.affiliation })
      await expect(affiliation).toBeFocused()
      await traverse('Shift+Tab', 'affiliation to category')
      await expect(category).toBeFocused()
      await traverse('Tab', 'category to affiliation again')
      await expect(affiliation).toBeFocused()
      await traverse('Tab', 'affiliation to clear')
      const clear = page.getByRole('button', { name: copy.clear })
      await expect(clear).toBeFocused()
      await clear.press('Enter')
      await expect(page.getByRole('article')).toHaveCount(6)
      await expect(clear).toBeFocused()
    } finally {
      const observation = await probe.evaluate((observer) => observer.finish())
      const diagnostics = JSON.stringify({ locale, platform: process.platform, browserVersion: browser.version(), retry: testInfo.retry, snapshots, ...observation }, null, 2)
      console.log(`FILTER_FOCUS_DIAGNOSTICS ${diagnostics}`)
      await testInfo.attach('filter-focus-diagnostics', { body: diagnostics, contentType: 'application/json' })
      await probe.dispose()
    }
  })

  test(`${locale} keyboard typeahead selects a category and filters without moving focus`, async ({ page }) => {
    await page.goto('./')
    if (locale === 'en') await page.getByRole('combobox', { name: 'Idioma' }).selectOption('en')
    await expect(page.getByRole('status')).toHaveText(copy.populated)
    await page.getByRole('link', { name: copy.discovery }).focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('heading', { name: copy.destination })).toBeFocused()
    await page.keyboard.press('Tab')
    const category = page.getByRole('combobox', { name: copy.category })
    await expect(category).toBeFocused()
    // Native typeahead selects directly; Enter is not a portable commit key.
    await page.keyboard.press('n')
    await expect(category).toHaveValue('nutrition')
    await expect(page.getByRole('article')).toHaveCount(2)
    await expect(category).toBeFocused()
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
