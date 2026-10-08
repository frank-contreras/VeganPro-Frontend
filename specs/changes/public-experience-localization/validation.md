# Public experience localization validation

## Current SDD validation — 2026-10-08

**Result: automated validation PASS; manual accessibility acceptance remains
UNVERIFIED.** No functional defects or unintended directory behavior changes
were found in this pass. Thirteen criteria pass within the stated prototype and
Chromium scope; AC-L07 and AC-L08 remain UNVERIFIED overall. Nothing is classified
FAIL. This pass updates only this report; application code and tests were not
modified. Generated build/browser outputs are verification artifacts.

### Scope and review method

Reviewed the approved change, design, T-01–T-13 and existing professional-directory
spec/design against current source and tests, including the user-approved
five-portrait refinement. Source inspection covers locale/catalog resolution,
state ownership, request lifecycle/revision guards, controlled fixture vocabulary,
metadata, public composition, image fallback and base-aware static delivery.
Codebase Memory search/trace/snippet preceded source confirmation; coverage checks
for 41 code/config paths reported matching metadata with no recorded source gaps
(best-effort generation `2026-10-08T02:31:17Z`). Five JPEGs are excluded from the
graph by suffix; their production decoding was verified in browser tests.

Repository files are untracked, so an ordinary tracked implementation diff is not
available. Findings rely on current source, approved artifacts, retained tests and
executed behavior rather than a claim of exhaustive historical diff comparison.
The baseline spec/design's greenfield wording is historical context; the active
change governs delivered behavior.

### Executed checks

| Command/check | Status | Current evidence |
| --- | --- | --- |
| `npm test` | PASS | 56 unit/component tests across 11 files. |
| `npm run lint` | PASS | No lint errors. |
| `npm run typecheck` | PASS | TypeScript checks source and authored tests. |
| `npm run build` | PASS | Typechecked production build; five local JPEG assets emitted (16.61–19.49kB). |
| `npm run test:browser` | PASS | 66 Chromium tests; root production entry. |
| `npm run test:browser:subpath` | PASS | 66 Chromium tests; production entry at `/prototype/`. Exceptional-state fixture entry intentionally remains on separate root server. |
| Layout/automated accessibility | PASS within tested scope | Each browser run includes 60 es/en × normal/long copy × five outcomes × 320/768/1280 cases, axe, horizontal overflow, visible controls/disclosure/footer and reduced motion. Four additional keyboard/contrast/recovery cases and two production/fallback cases pass. |
| Screenshot inspection | PASS within inspected scope | Inspected current es populated long 320px, en error long 320px, es populated 768px and en populated 1280px. No visible clipping/overlap; named profiles show portraits and incomplete profile retains fallback. Other cases have automated evidence, not individual visual inspection. |

Environment: macOS ARM64, Node 26.4.0, npm 11.17.0, React 19.3.0,
Vite 8.3.3, Vitest 5.0.3, Playwright 1.64.0 and local Chromium.
Browser execution used authorized sandbox escalation for local servers/Chromium.
No dependency installation or publication occurred. Full current browser results
supersede the earlier portrait follow-up's “matrix not rerun” limitation.

### Acceptance status

| Criterion | Status | Current evidence / limits |
| --- | --- | --- |
| AC-L01 — Spanish default | PASS | Provider ignores English browser preference; initial HTML and root/subpath entry/reload select Spanish. Complete nonblank Spanish catalog. |
| AC-L02 — es/en switching | PASS | Exactly Español/English available; bilingual round trip updates visible/accessibility copy without reload and retains selector focus. |
| AC-L03 — populated preservation | PASS | Controlled/counting source tests for category/affiliation/AND keep control values, option identifiers, mounted cards/order and no extra source call. Stable source lives at module scope. |
| AC-L04 — pending preservation | PASS | Both switching directions cover initial/update/retry pending; same outstanding request completes in current language. Revision/cleanup tests protect against old success/failure, Strict Mode and unmount. Locale is absent from controller effect dependencies/actions. |
| AC-L05 — empty/error/recovery | PASS | Bilingual empty/no-matches/error/repeated-error switches preserve outcomes and translated recovery; subsequent Clear/Retry keep established selection/focus semantics. |
| AC-L06 — fallback | PASS | Complete catalogs checked; resolver tests exercise blank/missing active → Spanish → English → per-key emergency copy. Component/browser language annotations and conservative unavailable verification pass. Persistence clause NOT APPLICABLE. |
| AC-L07 — accessibility announcements | UNVERIFIED overall | PASS for localized persistent polite/atomic status DOM, switched pending completion and keyboard focus. Native speech and whether actual assistive technology announces the entire list were not manually exercised. |
| AC-L08 — document metadata/pronunciation | UNVERIFIED overall | PASS for static/runtime es/en lang/title/description, fallback language annotations and Strict Mode missing-meta creation without duplicates. Actual pronunciation, including title handling, lacks native assistive-technology evidence. |
| AC-L09 — responsive long copy | PASS within Chromium viewport scope | Current full normal/long bilingual state matrix at 320/768/1280 passes; representative screenshots inspected. Contrast and reduced-motion assertions pass. Physical devices/other browsers not verified. |
| AC-L10 — hero | PASS | Localized single H1, prominent fictional disclosure and in-page discovery action. Pointer/keyboard activation focuses directory heading before filters, preserves state and does not call source or introduce route. |
| AC-L11 — footer | PASS | Both languages show VeganPro, co-creation/prototype context and sample/portrait reminder in every outcome and viewport. Footer links NOT APPLICABLE (none included). |
| AC-L12 — five bundled portraits | PASS | Five unique local imports; named-fixture invariant test; actual production browser images decode at root/subpath, Noah/Robin visible, exactly one fallback, no asset errors/remote image/data requests. Fictional disclosure remains explicit. |
| AC-L13 — resilient portraits | PASS | Test-specific absent/blank/failed sources, bilingual failure/replacement and failure-across-locale cases pass. Content remains truthful/intact; source replacement resets failure; decorative alt avoids duplicate identity. Incomplete public fixture remains imageless. |
| AC-L14 — directory regressions | PASS for automated behavior | Existing source/reducer/controller and bilingual presentation/recovery tests preserve exact matching, explicit eligibility, unknown affiliation/verification, ordering/keys, readiness, hidden old cards, distinct empty/error branches, current retry, stale guards and focus. Baseline native AC-012 remains UNVERIFIED. |
| AC-L15 — future locale readiness | PASS for design/source review | Typed complete catalogs, registry-derived locale type/selector/catalogs and arbitrary-code resolver support new complete pt-BR/ht entries without changing controller/matching. Resolver test demonstrates ht text. Future actual translations are NOT APPLICABLE. |

Requirements L-01–L-07 and L-09–L-12 pass within the tested prototype scope.
L-08 and L-13 pass automated metadata/focus/semantic checks but remain UNVERIFIED
for native pronunciation/announcements. L-14 passes within Chromium viewport
coverage. Baseline BR-001–BR-005 and CON-001–CON-003 remain respected for explicitly
fictional data; no real eligibility/verification or external contract is inferred.

### Findings, deviations and follow-up

- **Defects/regressions:** none found in executed checks and scoped source review.
- **Approved scope refinement:** all five named samples have local portraits;
  incomplete sample alone has none. Change/design document the user's refinement.
- **Architecture:** implementation follows dependency-free typed catalogs/context,
  memory-only locale, render-time presentation hints, separate metadata effect,
  presentational hero/footer and imported Vite assets. No material unapproved
  design deviation found. Fallback language annotation and registry-derived
  availability are the previously documented compatible refinements.
- **Out of scope:** no backend/API contracts, persistence, auth/registration/admin,
  new routing, remote images or unrelated functionality found in the reviewed
  production flow. No additional runtime dependency is present.
- **UNVERIFIED:** native screen-reader state announcements and mixed-language
  fallback/control/metadata pronunciation; physical devices, other browsers,
  Node 24, Actions execution and live GitHub Pages. Complete a recorded manual
  assistive-technology session before treating AC-L07/AC-L08 as fully PASS.
- **NOT APPLICABLE:** saved preferences (memory-only design), actual pt-BR/ht
  translation delivery, backend integration, authentication and publication.
- **UNKNOWN:** live hosting destination/settings and all deferred external
  identity, taxonomy, eligibility, verification and data-coverage contracts.

No remediation code changes are indicated by this pass. Active artifacts remain
available; archival and publication were not performed.

## Historical implementation evidence

The sections below preserve earlier implementation and portrait-follow-up results.
Their dates/counts/limitations describe those earlier runs; the current report
above is authoritative for this validation pass.


Initial validation: 2026-10-07 (America/Santiago).
Portrait refinement validated: 2026-10-08; see follow-up below.
Scope: [approved change](change.md), [design](design.md), [tasks](tasks.md) and
implemented es/en public directory prototype. This is mocked frontend validation,
not real professional verification, backend integration or live publication.

## Result

T-01 through T-13 are implemented with automated evidence. No remaining concrete
functional defect was found in the scoped review. Spanish defaults, English
switching, independent locale state, complete typed catalogs/fallback, public
hero/footer, local illustrative portraits, metadata and directory regressions
pass the executed checks. AC-L07 and AC-L08 remain **UNVERIFIED** overall for
native assistive-technology announcements/pronunciation; their automated
semantics, language annotations, keyboard and metadata checks pass.

Application code, tests, bundled assets, README/fixture documentation and SDD
tracking changed. No runtime dependencies, backend contracts, authentication,
registration, admin, routing or deployment settings changed. Baseline source
matching, reducer revision transitions and controller effect/cleanup logic were
preserved. No site was published and nothing was archived.

## Executed checks

| Check | Status | Evidence |
| --- | --- | --- |
| Lint | PASS | Final `npm run lint`. |
| Type checking | PASS | Final `npm run typecheck`, including authored tests. |
| Unit/component suite | PASS | Final `npm test`: 11 files, 55 tests. Original 18 behavioral tests retained; presentation cases expanded to es/en and new localization/preservation cases added. |
| Root browser suite | PASS | Final `npm run test:browser`: 66 Chromium tests. |
| Representative Pages subpath | PASS | Final `npm run test:browser:subpath`: 66 Chromium tests, production entry at `/prototype/`. Exceptional-state fixtures remain at their separate root URL. |
| Production build | PASS | `npm run build`; browser commands additionally built final root and subpath production artifacts and isolated fixtures. Three JPEG assets emitted at roughly 18kB each. |
| Layout/accessibility matrix | PASS | Each browser suite includes 60 cases: two locales × normal/long copy × five outcomes × 320/768/1280. Axe, overflow, visible content/actions and reduced-motion checks pass. |
| Keyboard/contrast | PASS | Both languages cover selector switching, skip/main target, hero destination, native filters, clear/retry and predictable recovery focus. Computed text/control/focus contrast checks cover selector, discovery and directory controls. |
| Visual inspection | PASS within inspected scope | Inspected generated portraits, populated screenshots in both languages at all three widths, long populated samples at 320px, and all four long feedback branches in both languages at 320px. No clipping/overlap found. Remaining matrix cases have automated evidence, not individual visual inspection claims. |
| Scoped read-only review | PASS after copy correction | Reviewer found no functional localization/controller defect. Corrected skip wording to identify its existing main-content destination. Task evidence/statuses updated after final checks. |
| Native screen reader | UNVERIFIED | No interactive assistive-technology session available. Attempted VoiceOver process availability check via `pgrep -x VoiceOver`; sandbox process-list access failed. No announcements or actual pronunciation were manually exercised. |

Environment: macOS ARM64, Node 26.4.0, npm 11.17.0, React 19.3.0,
Vite 8.3.3, Vitest 5.0.3, Playwright 1.64.0 with local Chromium.
Node 24 remains the documented target; this execution was on Node 26.
Browser execution required approved sandbox escalation for localhost servers
and Chromium. No lockfile/dependency installation or remote publication was needed.

## Acceptance evidence

| Criterion | Status | Evidence and limits |
| --- | --- | --- |
| AC-L01 | PASS | Provider/default tests ignore English browser preference; static HTML and root/subpath entry/reload start es. |
| AC-L02 | PASS | Provider/component/browser es/en/es switching changes text/names without reload and retains focused selector. Exactly two locales selectable. |
| AC-L03 | PASS | Controlled/counting sources verify category/affiliation/AND preservation, unchanged options/values/order/mounted cards and no additional source call. |
| AC-L04 | PASS | Both switching directions during initial/update/retry pending preserve live requests; resolving those requests succeeds. Stale success/rejection and Strict Mode behavior remain protected. |
| AC-L05 | PASS | Empty/no-matches/error/repeated-error switching retains outcomes and recovery; clear/retry still use correct selections and recovery focus. Footer remains available. |
| AC-L06 | PASS | Completeness/fallback unit tests plus injected partial catalogs test blank/missing active/Spanish/English messages and per-key emergency copy. Unavailable verification remains unavailable; cross-language names/options/announcements are annotated. Saved-locale clause NOT APPLICABLE. |
| AC-L07 | UNVERIFIED overall | DOM/keyboard/live-region evidence PASS in both languages and after pending switches. Actual native announcements/wholesale-announcement behavior not manually exercised. |
| AC-L08 | UNVERIFIED overall | Static/runtime metadata, active root lang, fallback title/description lang and no duplicate meta PASS. Actual pronunciation, particularly browser title handling, has no native assistive-technology evidence. |
| AC-L09 | PASS within Chromium viewport scope | Full 60-case normal/long language/state/width matrix and inspected representative screenshots preserve controls, disclosure, status/verification, footer and actions without overflow/overlap. Contrast/reduced-motion checks pass; physical devices unverified. |
| AC-L10 | PASS | Hero discovery focus before filters works by pointer/keyboard without source operation or lost filter/result state. Single H1 and distinct recovery heading preserved. |
| AC-L11 | PASS | Localized brand/co-creation/sample reminder checked in every outcome; footer visible across matrix. No footer links were added. |
| AC-L12 | PASS | Initial scope: three imported fictional portraits decode locally at root/subpath without asset failures, remote images or data requests. Revised five-portrait evidence is recorded in the follow-up below. Visible disclosure explicitly covers fictional people/statuses and illustrative portraits; provenance/prompts recorded. |
| AC-L13 | PASS | Bilingual absent/error/replacement tests plus blank/whitespace and failure-across-switch tests verify fallback and intact content; decorative empty alt verified. |
| AC-L14 | PASS for automated regressions | Existing source/reducer/hook invariants and bilingual presentation/recovery tests retained; new controlled switching and production browser checks pass. Baseline native-screen-reader AC-012 remains UNVERIFIED. |
| AC-L15 | PASS for readiness | Registry derives supported codes/catalog availability; future complete catalog plus registry entry adds pt-BR/ht without changing matching/state. Resolver test demonstrates another language's catalog resolution. No incomplete future language advertised. |

L-01 through L-12 are supported within the stated prototype and automated
boundaries; L-08 pronunciation remains UNVERIFIED. L-13 native announcements
remain UNVERIFIED while automated focus/semantics checks pass. L-14 passes within
Chromium viewport/contrast/reduced-motion coverage. Baseline BR-001–BR-005 and
CON-001–CON-003 remain satisfied within fictional data; external meanings and
contracts remain UNKNOWN.

## Findings and deviations

- Resolved environment failure: initial sandbox browser startup returned EPERM
  on localhost port 4173; authorized escalation allowed all final browser checks.
- Resolved test harness failures: translated accessible names change after a
  locale switch, so locators use stable control targets and assert the new names.
  Playwright `selectOption` does not focus an unfocused control; production smoke
  explicitly focuses the selector first. Keyboard checks independently verify
  real focus preservation. No application focus workaround or relaxed expectation.
- Resolved review finding: skip-link copy now says main content in both languages,
  matching its unchanged `#main-content` destination.
- Small design refinement: every localized span carries actual `lang`, including
  active-language text inside a fallback-language region, so inheritance cannot
  mislabel it. Catalog availability is derived from registry entries to avoid a
  second list of supported locales. These preserve the approved architecture.
- No scope expansion or unresolved automated failure. Memory-only locale, eager
  catalogs and local JPEG imports match the design. Repeated long copy and
  exceptional outcomes exist only in test fixtures, excluded from production.

## Remaining boundaries and follow-up

- **UNVERIFIED:** native screen-reader announcements/pronunciation, physical
  devices, browsers other than Chromium, Node 24 execution, Actions and live Pages.
- **UNKNOWN:** real publication target/base/settings and all previously deferred
  live-data identity/eligibility/category/verification/coverage/invalid-record
  contracts. This change establishes none of them.
- **NOT APPLICABLE:** preference persistence, backend/API integration,
  authentication/registration/admin, remote portraits, pt-BR/ht translation
  delivery and publication.

Implementation tasks are complete; remaining native accessibility evidence is
explicitly outstanding validation work. Use a future `sdd-validate` pass to record
that manual evidence when available. Retain active artifacts until archival is
appropriate; publication requires a separate request and confirmed destination.

## Portrait refinement validation — 2026-10-08

User manual review expanded the portrait selection to all five named public
fixtures. Noah and Robin now use local 256 × 256 JPEG illustrations generated
with the built-in imagegen tool; the intentionally incomplete fixture alone
retains the visible fallback. Existing card rendering, source/controller,
filtering identifiers, eligibility, verification and locale behavior are unchanged.
Prompts and provenance are in the fixture documentation. The earlier full browser
matrix above remains historical evidence; the focused checks below were rerun
for this refinement.

| Check | Status | Evidence |
|---|---|---|
| Unit/component regressions | PASS | `npm test`: 56 tests across 11 files. New fixture test requires portraits for all five named samples and no image for the incomplete sample. Existing test-specific missing/blank/failed-image, replacement, failure-across-locale, filtering/loading/error/recovery and stale-outcome tests pass. |
| Lint | PASS | `npm run lint`. |
| Types and production build | PASS | `npm run build` includes `tsc --noEmit`; five JPEG assets emitted. Noah 16.61kB, Robin 19.49kB. No dependencies added. |
| Root production browser | PASS | `npm run test:browser -- tests/browser/directory.spec.ts`: 2 Chromium tests. Five portraits complete with naturalWidth > 0; Noah/Robin visible; exactly one fallback; no failed assets/remote images/data requests. Existing switching/filter/metadata/discovery/reload and fallback-language assertions pass. |
| Pages repository-subpath browser | PASS | `npm run test:browser:subpath -- tests/browser/directory.spec.ts`: 2 Chromium tests at `/prototype/`, with the same portrait and behavior assertions. |
| Visual inspection | PASS within inspected scope | Inspected both generated illustrations and the final populated production screenshot; five portraits and the incomplete fallback are visible. |
| AC-L12 / AC-L13 / relevant AC-L14 / AC-L15 | PASS within executed scope | Five bundled portraits, explicit fictional disclosure, retained test-specific image fallback coverage, full unit regressions and focused root/subpath checks. |
| Full responsive browser matrix | UNVERIFIED for this refinement | Not rerun; original 66 root + 66 subpath results above predate the two added assets. Layout/CSS/card rendering were unchanged. |
| Live Pages, other browsers/devices and native screen reader | UNVERIFIED | No deployment or manual assistive-technology/device testing performed. |

Follow-up changed two asset imports/fixture image fields, two JPEG assets, fixture
and browser tests, README/fixture documentation and change/design/task/validation
records. No unrelated application behavior was changed.
