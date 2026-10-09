# Native-select keyboard CI follow-up — 2026-10-09

## Second Linux failure: active investigation

The updated test still fails in both locales despite category being focused
immediately before Tab. The earlier popup explanation is insufficient and its
classification below is historical, not a confirmed root cause.

Current: macOS passes; Linux does not focus affiliation after Tab. Destination
and cause are unknown. Desired: identify the actual destination and distinguish
node replacement, disabled/hidden state, event cancellation and native traversal.
Delta: diagnostic browser-test instrumentation only; preserve every existing
keyboard assertion, production focus behavior, selection and recovery coverage.

Acceptance/plan (authorized by the investigation request):

- [x] Capture active element before/after Tab, tag/id/name/role, DOM-order
  focusable candidates and tabindex/disabled/hidden state for all three controls.
- [x] Capture focus/key events and original control identity across selection
  and traversal; retain diagnostics in test attachments and CI console output.
- [x] Inspect available trace/error context and record evidence limitations.
- [x] Run focused local tests, lint/type checks; distinguish local PASS from
  Linux UNVERIFIED. Redesign only if evidence establishes a native traversal
  limitation; DOM order alone does not prove actual keyboard accessibility.

No design or application change is needed for instrumentation. Risk: diagnostics
must observe without focusing, preventing events, changing tabindex or retrying
Tab. Native popup state is not observable from activeElement alone.

### Evidence and validation for the second attempt

The user-confirmed [failing job](https://github.com/frank-contreras/VeganPro-Frontend/actions/runs/37991472159/job/114032837884#step:9:229)
belongs to run 37991472159, attempt 2. GitHub's public run/job API reports
head SHA `50471dbbcf870f2cd1f94260e458febe9a1afb5d`. Reading keyboard.spec.ts
at that exact SHA confirms it still sends category `n`, then Enter, then Tab.
The updated `selectOption`/reverse traversal/typeahead tests belong to local
commit `c16624a`. This rerun therefore does **not** demonstrate failure of the
updated test. The reported 64 other passing tests also matches the old 66-test
suite, rather than the updated 68-test suite.

The run artifacts API returned `total_count: 0`. Job-log download returned HTTP
403 (repository admin authorization required). No trace.zip/error-context.md
exists locally. Both workflow sources lack a failure-time test-results upload
step; generated runner files are not evidence of downloadable artifacts. The
trace and actual Linux destination could not be inspected. This limitation is
separate from the confirmed commit mismatch.

| Check | Result | Evidence |
| --- | --- | --- |
| Focused keyboard tests | PASS | `npm run test:browser -- tests/browser/keyboard.spec.ts`: 6/6, macOS, Chromium 156.0.8078.4 |
| Local focus transition, es/en | PASS | Immediate snapshots: category → affiliation; Shift+Tab → category; Tab → affiliation; Tab → Clear |
| Rerender/control state locally | PASS | All three original controls remain connected and identical; enabled, visible, natural tabindex 0; zero filter mutations; no cancelled keydown events |
| Lint/typecheck | PASS | `npm run lint`, `npm run typecheck` |
| Patch whitespace | PASS | `git diff --check` |
| Actual Linux focus destination/cause | UNVERIFIED | Historical trace unavailable; updated tests have not run in the linked attempt |
| Production focus change/test redesign | NOT APPLICABLE | No evidence establishes a native traversal limitation in the updated test |

The initial sandboxed browser invocation could not bind port 4173 (EPERM);
the authorized invocation outside the sandbox completed all six tests.

Diagnostics are emitted as `FILTER_FOCUS_DIAGNOSTICS` in console output and a
`filter-focus-diagnostics` JSON attachment, including immediate snapshots before
auto-retrying assertions, DOM-order candidates (including excluded controls),
control identity, focus/blur/input/change/key events, mutation observations,
document focus/visibility, user agent, browser version, platform and retry.
Every original keyboard, contrast, filtering, clearing and recovery assertion
is retained. Instrumentation never focuses controls or cancels events.

Next: start a **new** validation run on the updated commit rather than rerun the
old run. If it fails, the logged snapshots establish the landing element even
when test-result files are not uploaded. Preserve/download trace and error
context when available. Only then consider a portable redesign, retaining
real keyboard access/selection/activation/focus visibility and DOM-order checks;
direct `.focus()` plus structural assertions alone would weaken traversal coverage.

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
