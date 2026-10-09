import type { Page } from '@playwright/test'

// Observe only: never focus, cancel events, or alter the tab sequence.
export async function observeFilterFocus(page: Page) {
  return page.evaluateHandle(() => {
    const selectors = ['.filters select[id$="-category"]', '.filters select[id$="-affiliation"]', '.filters .clear-button']
    const originals = selectors.map((selector) => document.querySelector(selector))
    const identities = new WeakMap<Element, number>()
    let nextIdentity = 0
    const describe = (element: Element | null) => {
      if (!(element instanceof HTMLElement)) return null
      if (!identities.has(element)) identities.set(element, ++nextIdentity)
      const css = getComputedStyle(element)
      return {
        node: identities.get(element), tag: element.tagName, id: element.id,
        name: element.getAttribute('name'), role: element.getAttribute('role'),
        nativeRole: element instanceof HTMLSelectElement ? 'combobox' : element instanceof HTMLButtonElement ? 'button' : null,
        label: element instanceof HTMLSelectElement ? Array.from(element.labels ?? []).map((label) => label.textContent).join(' ') : element.getAttribute('aria-label'),
        tabIndex: element.tabIndex, tabindexAttribute: element.getAttribute('tabindex'),
        disabled: element.matches(':disabled'), hidden: element.hidden,
        hiddenAncestor: !!element.closest('[hidden]'), inert: !!element.closest('[inert]'),
        ariaHidden: element.closest('[aria-hidden="true"]') !== null,
        display: css.display, visibility: css.visibility,
        rendered: element.getClientRects().length > 0, connected: element.isConnected,
        inFilters: !!element.closest('.filters'),
        value: element instanceof HTMLSelectElement ? element.value : null,
      }
    }
    const snapshot = () => ({
      active: describe(document.activeElement), documentFocused: document.hasFocus(),
      visibilityState: document.visibilityState,
      controls: selectors.map((selector, index) => {
        const current = document.querySelector(selector)
        return { selector, current: describe(current), sameNode: current === originals[index], originalConnected: originals[index]?.isConnected }
      }),
      // Candidates in DOM order, including excluded/disabled entries and their
      // state; this is evidence, not a replacement for real Tab assertions.
      candidates: Array.from(document.querySelectorAll('a[href], button, input, select, textarea, [tabindex], [contenteditable="true"]')).map(describe),
    })
    const events: unknown[] = []
    const record = (event: Event) => {
      const entry = {
        time: performance.now(), type: event.type,
        key: event instanceof KeyboardEvent ? event.key : null,
        shift: event instanceof KeyboardEvent ? event.shiftKey : null,
        target: describe(event.target instanceof Element ? event.target : null),
        relatedTarget: describe(event instanceof FocusEvent && event.relatedTarget instanceof Element ? event.relatedTarget : null),
        defaultPrevented: event.defaultPrevented,
      }
      if (events.length < 100) events.push(entry)
      // Read cancellation after application handlers have run.
      queueMicrotask(() => { entry.defaultPrevented = event.defaultPrevented })
    }
    const types = ['keydown', 'keyup', 'focusin', 'focusout', 'input', 'change']
    types.forEach((type) => document.addEventListener(type, record, true))
    const observer = new MutationObserver((mutations) => {
      if (events.length < 100) events.push({ time: performance.now(), type: 'mutation',
        changes: mutations.map((mutation) => ({ type: mutation.type, attribute: mutation.attributeName, target: describe(mutation.target instanceof Element ? mutation.target : null) })),
        controls: snapshot().controls, active: describe(document.activeElement),
      })
    })
    observer.observe(document.querySelector('.filters')!, { subtree: true, childList: true, attributes: true })
    return {
      snapshot,
      finish: () => {
        observer.disconnect()
        types.forEach((type) => document.removeEventListener(type, record, true))
        return { events, final: snapshot(), userAgent: navigator.userAgent }
      },
    }
  })
}
