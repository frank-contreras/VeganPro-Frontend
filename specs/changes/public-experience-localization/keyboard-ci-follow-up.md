# Native-select keyboard CI follow-up — 2026-10-09

## Current, desired and delta

Reported failure: both localized keyboard cases pass category value/results/focus
assertions, then fail affiliation focus after Tab on Ubuntu Actions. Historical
validation ran on macOS ARM64 (56 unit/component, 66 root and 66 subpath browser
tests). CI and Pages workflows use ubuntu-latest, npm ci, the pinned Playwright
1.64.0 package and `playwright install --with-deps chromium`. Configuration uses
headless Desktop Chrome, one CI retry and retained failure traces, without a
custom executable or channel. Actual failing CI logs/traces are not available
in this workspace; the failure location is user-provided evidence.

Desired: retain L-13/AC-L07 and T-10 keyboard access, focus visibility, selection,
result updates and recovery coverage with a portable native-select interaction.
Delta: browser tests only; application focus behavior and contracts unchanged.

## Investigation

Confirmed source: DirectoryFilters renders category → affiliation → Clear in DOM
order. Both selects are native, labeled, enabled once options exist, with no
tabIndex or key handler. Responsive grid preserves their order. The controller
does not focus on selection or result completion; explicit heading focus belongs
to discovery and recovery actions. Existing passing validation covers macOS,
not Linux Actions.

The old test sends `n`, then Enter on the focused category, then Tab. Chromium
routes Enter through platform theme `PopsMenuByReturnKey`: it can open a popup
rather than commit the already selected typeahead value. Opening retains focus
on the select, so `toBeFocused` alone does not establish a closed popup. This
supports classification **2: platform-dependent native-select interaction**, not
an application tab-order regression. The precise failing popup state remains
inferred until a Linux trace/reproduction is available.

Sources: [Chromium select keyboard handling](https://raw.githubusercontent.com/chromium/chromium/main/third_party/blink/renderer/core/html/forms/select_type.cc),
[Playwright native selection API](https://playwright.dev/docs/input#select-options).
Current upstream source supports the mechanism, not an assertion that the exact
CI Chromium revision was inspected.

## Acceptance and implementation plan

- [x] Separate category setup (`selectOption('nutrition')`) from actual Tab checks;
  keep value, two-result count and category focus assertions.
- [x] Require actual Tab category → affiliation → Clear and Shift+Tab affiliation
  → category, without calling focus on either select in the navigation test.
- [x] Add independent es/en real keyboard typeahead tests: reach category via
  discovery activation and Tab, press `n`, assert nutrition/two results/focus.
  No Enter on a native select; no sleeps, repeated Tab workaround or skipped case.
- [x] Preserve locale, discovery, contrast, Clear and recovery assertions.
- [x] Run focused keyboard, full root/subpath suites, unit/component, lint and
  type checks; record results in validation.md.

No technical design change is needed. Risks: test selection setup must not mask
tab-order defects (actual Tab assertions remain); keyboard selection must remain
covered independently (new typeahead cases). Application changes, dependencies,
workflow changes and native screen-reader acceptance are outside this fix.
