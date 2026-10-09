# Public experience localization implementation plan

Status: T-01 through T-12 implemented with evidence below. Native screen-reader verification and live hosting remain open; see [validation.md](validation.md).
Date: 2026-10-07 (America/Santiago).
Sources: approved [change](change.md), [technical design](design.md), existing
[directory tasks](../../features/professional-directory/tasks.md) and
[baseline validation](../../features/professional-directory/validation.md).

## Scope and execution rules

Implement the approved presentation change using typed, eager es/en catalogs,
React context, memory-only locale and no new dependencies. Spanish is the fresh
entry/reload default. `pt-BR` and `ht` remain future catalog additions, not
selectable incomplete languages. Preserve the stable module-level directory
source, controller effect dependencies, selection identifiers, reducer operation
revisions, eligibility, ordering and all loading/error/recovery semantics.

Tasks are ordered by dependency; unchecked means incomplete. A task completes
only when its result and stated checks are satisfied and evidence is recorded.
Each task includes its tests rather than postponing all verification to the end.
Run focused Vitest files and appropriate type/lint checks per slice; use the
existing full suites at the final gate. Do not duplicate unchanged reducer/source
tests merely to attach a new task ID.

Do not introduce backend contracts/API shapes, remote catalogs/images, routing,
authentication, registration, admin, unrelated product features, persistence,
deployment assumptions or publication. Production test-scenario controls are
excluded. This plan does not modify code or authorize a deployment.

## Ordered tasks

### T-01 — Establish complete typed catalogs and safe resolution

- [x] Complete
- **Depends on:** none.
- **Trace:** L-03, L-04, L-07; AC-L06, AC-L15.
- **Areas:** proposed `src/localization/messages.ts`, `catalogs/es.ts`,
  `catalogs/en.ts`, `resolveMessage.ts`, focused unit tests.
- **Result:** canonical message keys, complete reviewed bilingual catalogs and
  independent per-key emergency copy. Cover public/disclosure text, labels,
  feedback, accessibility, metadata and sample vocabulary. Implement nonblank
  active → Spanish → English → emergency resolution returning text/language.
  Registry-derived supported locale codes permit future complete catalog entries.
- **Validate / done:** compile-time catalog shape and unit completeness checks
  reject omissions/blank text. Inject partial catalogs to exercise every fallback
  level, actual language and safe meaningful emergency labels. Check conservative
  verification/affiliation wording and no real-identity/endorsement claims.
  Document the pt-BR/ht extension path without shipping those catalogs. Focused
  tests/typecheck/lint pass; no dependency or lockfile change.
- **Evidence:** PASS: resolver/catalog unit tests verify complete nonblank es/en catalogs, supported registry, actual fallback language, active/Spanish/English/emergency branches and conservative unavailable copy. Typecheck/lint pass; no dependencies changed.

### T-02 — Add independent locale ownership and selector

- [x] Complete
- **Depends on:** T-01.
- **Trace:** L-01, L-02, L-03, L-06, L-13; AC-L01, AC-L02, AC-L06, AC-L15.
- **Areas:** `LocaleProvider.tsx`, `LocalizedText.tsx`, public
  `LanguageSelector.tsx`, `src/main.tsx`, page header, provider test helpers.
- **Result:** one provider above App within Strict Mode, es initialization,
  registry-guarded setter and accessible native selector for Español/English.
  Store locale only in memory. Text/options use effective language annotations;
  preserve component positions/keys and the imported source instance.
- **Validate / done:** component tests cover Spanish despite English browser
  preferences, es/en/es switching without reload, selector names/current value,
  focus retention, unsupported input normalization and same-locale no-op.
  Add provider wrappers to affected existing component tests as needed without
  weakening expectations. Verify no locale-dependent source creation or keys.
  Focused tests/typecheck/lint pass. Full copy localization is completed in T-03.
- **Evidence:** PASS: provider tests prove Spanish despite English browser preference, es/en/es round trip and focus retention. Root browser verifies selector names/default; locale remains memory-only and independent of directory source.

### T-03 — Translate directory presentation and controlled vocabulary

- [x] Complete
- **Depends on:** T-01, T-02.
- **Trace:** L-04, L-05, L-07, L-13; AC-L01, AC-L02, AC-L06, AC-L07, AC-L14.
- **Areas:** page headings/skip/header text, `DirectoryFilters`, `DirectoryResults`,
  `DirectoryFeedback`, `ProfessionalCard`/badge, internal model, fixtures and
  existing App/page/card/recovery tests.
- **Result:** translate visible/nonvisual labels and all outcomes through context.
  Share a kind-to-message-key mapping between visible feedback and the persistent
  polite status region outside busy results. Add optional typed option/category/
  location display hints for controlled fixtures; retain raw unkeyed text.
  Missing/blank identity/category/location retain existing treatment. Stable
  values, sentinel, keys, categoryValue, statuses and eligibility are unchanged.
- **Validate / done:** parameterize existing presentation/filter/recovery cases
  for both locales and retain all original behavior assertions. Independently
  assert representative expected copy, localized names and effective fallback
  lang on inline text/options/ARIA. Test keyed fixture labels and unkeyed/missing
  data; statuses never become false verification claims. Existing source/reducer/
  hook tests pass unchanged in meaning. No translated view is stored in reducer
  state and no locale enters controller dependencies.
- **Evidence:** PASS: original App/page/card/recovery tests now run in both languages; optional vocabulary hints localize categories/locations while source/reducer/hook regressions retain stable values. Fallback tests cover inline, option, region and live text language annotation.

### T-04 — Synchronize document metadata

- [x] Complete
- **Depends on:** T-01, T-02.
- **Trace:** L-01, L-07, L-08; AC-L01, AC-L06, AC-L08.
- **Areas:** proposed `DocumentMetadata.tsx`, provider integration, `index.html`,
  metadata tests and test document cleanup.
- **Result:** Spanish static HTML defaults; one idempotent runtime owner updates
  root lang/title/description from current locale. Create missing description
  meta once, annotate cross-language fallback and avoid directory dependencies.
- **Validate / done:** tests inspect initial HTML and es/en/es runtime updates;
  missing-meta/Strict Mode do not create duplicates. Inject fallback catalogs
  and check resolved language annotations and truthful prototype copy. Restore
  document mutations between tests. Focused tests/typecheck/lint pass.
- **Evidence:** PASS: metadata tests inspect static Spanish HTML, es/en/es runtime updates, missing description creation, Strict Mode idempotence and fallback language. Production browser verifies title/description/lang updates and reload.

### T-05 — Strengthen the public hero and footer

- [x] Complete
- **Depends on:** T-03.
- **Trace:** L-09, L-10, L-11, L-13; AC-L10, AC-L11, disclosure portion of AC-L12.
- **Areas:** public hero/footer modules, page composition/focus refs, related
  component tests, scoped public CSS.
- **Result:** one H1 with stronger readable hierarchy, prominent bilingual
  fictional/sample/illustrative-portrait disclosure and a discovery anchor.
  Add stable `professional-directory` focusable heading before filters; hero
  focuses it without controller actions. Preserve skip target and separate
  results heading used for recovery. Footer includes brand, co-creation context
  and sample reminder in every outcome, without new links/services.
- **Validate / done:** component tests cover both locales, destination ID,
  keyboard/pointer activation and focus, unchanged selections/outcome/request
  count, and footer in all outcomes. Assert one H1 and distinct recovery focus
  target. No route or source operation is introduced. Narrow-layout styling
  keeps action/disclosure usable; browser checks follow in T-10.
- **Evidence:** PASS: populated state-preservation tests activate hero without additional loads or lost selections; browser keyboard tests focus the pre-filter heading. Footer content is checked across every localized outcome; one H1 and separate recovery target remain.

### T-06 — Produce and bundle illustrative portraits

- [x] Complete
- **Depends on:** T-03, T-05.
- **Trace:** L-11; AC-L12, compatibility portion of AC-L14.
- **Areas:** local portrait assets, proposed `samplePortraits.ts`, fixtures,
  fixture documentation and source/card checks.
- **Result:** five locally authored fictional portrait illustrations as compact
  WebP/JPEG imports, mapped to sample-ada/sample-leo/sample-maya/sample-noah/sample-robin at module scope.
  Record creation method/provenance; do not download real people or introduce
  runtime remote services. Only the intentionally incomplete record remains imageless (2026-10-08 refinement).
- **Validate / done:** inspect generated/authored images and confirm selected
  fixture associations, asset format and disclosure. Existing fixture membership,
  order, stable keys, unknown affiliation and missing-data cases remain intact.
  Imports typecheck/build; card tests see optional local URLs. Real decoded image
  and root/subpath checks are completed in T-11. If raster generation is used,
  follow the available image-generation workflow only during implementation.
- **Evidence:** PASS: built-in generated fictional illustrations visually inspected and exported as 256px JPEGs (~18kB each); fixture associations and provenance recorded. Initial implementation verified three imports; the follow-up T-13 verifies all five while retaining the incomplete fixture fallback. Root/subpath asset evidence is recorded in validation.md.

### T-07 — Preserve and extend resilient portrait rendering

- [x] Complete
- **Depends on:** T-06.
- **Trace:** L-12, L-13; AC-L13, AC-L14.
- **Areas:** `Portrait`/card and existing `ProfessionalCard.test.tsx`.
- **Result:** normalize blank sources to absent; retain decorative empty alt,
  neutral fallback, error handling and reset on normalized source change. Failure
  state is independent of locale; no image changes simply because locale changes.
- **Validate / done:** retain existing absent/error/replacement checks and add
  blank/whitespace cases plus failure followed by locale switch. Assert card
  information remains, no broken image or duplicate identity announcement, and
  a replacement source can render. Both locales pass focused tests.
- **Evidence:** PASS: bilingual baseline portrait error/replacement tests retained; blank/whitespace and failure-across-locale tests pass. Decorative empty alt and unchanged card content verified.

### T-08 — Prove preservation across locale changes and recovery

- [x] Complete
- **Depends on:** T-03, T-04, T-05, T-07.
- **Trace:** L-05, L-06, L-13; AC-L03, AC-L04, AC-L05, AC-L07, AC-L14.
- **Areas:** controlled-source helpers and focused locale/directory integration
  tests; existing page/recovery/reducer/controller regression suites.
- **Result:** deterministic evidence that locale changes only presentation.
- **Validate / done:** cover category alone, affiliation alone and AND with
  populated results; compare selections/options/record order and request deltas.
  Switch during initial/update/retry pending, then resolve the same outstanding
  requests to prove they were neither canceled nor restarted. Switch in empty,
  no-matches/error/repeated failure; then clear/retry and verify recovery focus.
  Complete older success/rejection out of order and preserve latest revision.
  Measure additional calls after Strict Mode setup, not a fixed initial count.
  Assert new-language completion/live text, unchanged readiness and selector
  focus; keep stale/unmount/Strict Mode baseline tests. Entire unit/component
  suite passes; investigation fixes must stay within approved behavior.
- **Evidence:** PASS: controlled-source tests exercise both switching directions across initial/update/retry pending, populated category/affiliation/AND, empty/no-matches/error/repeated failure. Request deltas, selections/options, mounted card identity/order, active completion, stale rejection and recovery focus remain correct; Strict Mode and unmount baseline tests pass.

### T-09 — Integrate localized exceptional-state browser fixtures

- [x] Complete
- **Depends on:** T-03, T-04, T-05, T-07.
- **Trace:** L-04, L-07, L-13, L-14; AC-L06, AC-L07, AC-L09, AC-L11.
- **Areas:** `tests/browser/fixture.tsx`, fixture HTML/build, test-only catalog
  injection and browser expectation helpers.
- **Result:** exceptional-state entry uses the same provider/metadata owner.
  Support es/en and controlled long/fallback copy only in test entry. Unkeyed
  long record overrides remove category/location hints so stress text is visible.
- **Validate / done:** fixture build/smoke check confirms populated/loading/empty/
  no-matches/error modes and language choice. No catalog globals are mutated and
  no fixture scenario enters production dist. Explicit expected messages stay
  independent of the resolver under test. Production locale API is not extended
  with scenario controls or test routes.
- **Evidence:** PASS: isolated fixture entry uses provider/metadata and test-only long/fallback catalogs. Long record category/location overrides remove label hints. Fixture build passes; normal production dist contains no scenario entry.

### T-10 — Verify localized responsive and keyboard behavior

- [x] Complete
- **Depends on:** T-08, T-09.
- **Trace:** L-02, L-09, L-10, L-13, L-14; AC-L02, AC-L07, AC-L09, AC-L10, AC-L11, AC-L14.
- **Areas:** public/global/feature CSS as needed, browser layout/keyboard tests.
- **Result:** usable public experience in both languages with long strings and
  the new selector/discovery action; existing card/filter information preserved.
- **Validate / done:** run both locales × five states × 320/768/1280 viewport
  matrix with long-text variants. Check overflow, visible verification/actions/
  disclosures/footer, screenshots for clipping/overlap and axe. Verify tab order
  skip → selector → discovery → enabled filters → clear → optional recovery,
  selector retention, hero destination and recovery focus. Initial disabled
  filters correctly drop out of tab order. Test localized native-select typeahead
  independently from Tab navigation; use selectOption for filtered-state setup
  without opening a platform-specific popup with Enter. Check computed text/control/focus contrast, wrapping
  and reduced-motion preference. Inspect screenshots; do not infer visual PASS
  from geometry alone. Fix only presentation defects; record browser limits.
- **Evidence:** PASS: 60 Chromium layout/axe/overflow checks (es/en × normal/long copy × five states × three widths), bilingual keyboard/contrast/recovery tests and reduced-motion checks. Representative screenshots visually inspected; see validation.md for exact scope. Native announcements are separately UNVERIFIED.

### T-11 — Verify root and Pages repository-subpath delivery

- [x] Complete
- **Depends on:** T-04, T-07, T-10.
- **Trace:** L-01, L-02, L-08, L-09, L-11; AC-L01, AC-L02, AC-L08, AC-L10, AC-L12, AC-L14.
- **Areas:** production browser smoke tests, existing Vite base configuration
  and test commands; adjustments only if an actual scoped defect is found.
- **Result:** same single-page behavior and imported assets at `/` and existing
  representative `/prototype/`, with no new routing/hosting assumptions.
- **Validate / done:** run `npm run test:browser` and
  `npm run test:browser:subpath`; directly open/reload configured bases. Assert
  Spanish reload default, All selections, switching, metadata, filtering and
  discovery focus. Check selected portraits complete with naturalWidth > 0,
  correct local/data URLs and no unexpected asset failures, remote portrait
  requests or fetch/XHR. Dist excludes test fixtures. Keep VITE_BASE_PATH
  validation and module imports; no root-hardcoded assets. Test fixture server
  remains separate at its existing root; subpath claims concern production entry.
  Live Pages and actual destination remain UNVERIFIED; do not publish.
- **Evidence:** PASS: final root and /prototype/ production browser suites; assets decode without failed/remote image or fetch/XHR requests; direct open/reload, language/metadata/filter/hero behavior verified. Real Pages destination and live hosting remain UNVERIFIED.

### T-12 — Validate the change and record handoff

- [x] Complete
- **Depends on:** T-01, T-02, T-03, T-04, T-05, T-06, T-07, T-08, T-09, T-10, T-11.
- **Trace:** L-01 through L-14; AC-L01 through AC-L15 and baseline AC-001 through AC-012.
- **Areas:** change validation artifact via `sdd-validate`, task evidence, README
  and fixture documentation where behavior has changed.
- **Result:** acceptance-by-acceptance evidence, preserved baseline coverage,
  truthful prototype limitations and instructions for locale/reload behavior.
- **Validate / done:** run final lint, typecheck, `npm test`, root/subpath browser
  commands and production build; record environment and results. Review catalogs
  and verify future pt-BR/ht additions require only complete catalog/registry
  extension, not directory redesign. Attempt native screen-reader checks for
  translated status changes, control names and fallback pronunciation (including
  metadata limitations); record UNVERIFIED if unavailable. Retained preferences
  are NOT APPLICABLE for memory-only design. Record PASS/FAIL/UNVERIFIED/NOT
  APPLICABLE for each criterion and split automated from manual accessibility.
  Resolve failures or clearly identify blockers; do not claim live hosting,
  physical-device or full assistive-technology validation without evidence.
  Preserve historical baseline reports and record this change's results separately.
  Archive only as a subsequent SDD operation when appropriate, not in this task.
- **Evidence:** PASS for implementation/automated handoff: final lint/typecheck, 55 unit/component tests, root/subpath Chromium suites and production builds. Validation report maps all criteria and preserves manual accessibility/hosting limitations; README/fixtures updated. Native screen-reader session could not be exercised and is UNVERIFIED, not claimed PASS.

## Acceptance coverage index

| Criterion | Primary tasks / evidence |
| --- | --- |
| AC-L01 | T-02 provider/component default; T-03 copy; T-04 static HTML; T-11 fresh entry/reload. |
| AC-L02 | T-02 selector; T-03 translations; T-10 keyboard; T-11 production round trip. |
| AC-L03 | T-08 controlled populated preservation; T-11 filter regression. |
| AC-L04 | T-08 controlled pending executions and stale completion protection. |
| AC-L05 | T-08 preserved empty/no-matches/error and recovery. |
| AC-L06 | T-01 resolver; T-02 unsupported guard; T-03 annotations; T-04 metadata fallback; T-09 test fixture. |
| AC-L07 | T-03 live semantics; T-08 switched completions; T-10 browser names/focus; T-12 native verification or UNVERIFIED. |
| AC-L08 | T-04 static/runtime metadata and language annotations; T-11 production metadata; T-12 manual limitations. |
| AC-L09 | T-09 long fixture inputs; T-10 language/state/viewport matrix and visual inspection. |
| AC-L10 | T-05 hero integration; T-10 focus/order; T-11 subpath action. |
| AC-L11 | T-05 footer content; T-10 visibility in all localized outcomes. |
| AC-L12 | T-05 disclosures; T-06 assets/provenance; T-11 decoded portraits/root/subpath/no-remote checks. |
| AC-L13 | T-07 absent/blank/error/replacement and locale failure persistence. |
| AC-L14 | T-03 existing presentation coverage; T-07 portraits; T-08 source/reducer/hook/recovery; T-10 and T-11 browser regressions. |
| AC-L15 | T-01 registry/catalog structure; T-12 design/implementation review of extension path. |

## Validation commands and completion boundaries

Existing commands, with no new dependencies planned:

```sh
npm run lint
npm run typecheck
npm test
npm run test:browser
npm run test:browser:subpath
npm run build
```

Use the existing documented Node/toolchain and installed Chromium runtime.
If installation or permissions block a check, report the concrete blocker rather
than treating source inspection as execution. Runtime results from the earlier
directory implementation are historical and must not be reused as proof of this
change. Final runtime evidence is recorded in [validation.md](validation.md); earlier baseline results are not reused as proof.

No optional improvements are included. Persistence, future language translations,
backend integration and real publication require separate scope. Exact final
copy and fictional assets are implementation deliverables bounded by the approved
design, not new architecture decisions. If required behavior cannot be met,
record the deviation before treating a task as complete.

Implementation and automated handoff are complete. Consult [validation.md](validation.md) for acceptance status and manual/integration limitations. No publication or archival was performed; native accessibility follow-up remains open.

### T-13 — Complete normal public fixture portraits

- [x] Complete (manual-review scope refinement, 2026-10-08).
- **Depends on:** T-06, T-07, T-11.
- **Areas:** Noah/Robin local assets and fixture mapping; fixture and production
  browser tests; portrait provenance; change/design/task/validation records.
- **Result:** all five named samples have distinct bundled portraits; only the
  intentionally incomplete sample has no portrait. No card/controller semantics
  or other fixture fields change.
- **Verification:** retain test-specific missing/blank/failed-image tests; assert
  all named fixtures have portraits; decode five portraits at root and Pages
  subpath and check exactly one visible fallback. Run full unit tests, lint and
  typechecked build.
- **Acceptance:** AC-L12, AC-L13, AC-L14, AC-L15.
- **Evidence:** PASS: 56 unit/component tests (11 files), including fixture portrait coverage and existing missing/blank/failed-image, replacement and failure-across-locale tests; lint and typechecked production build. Both focused browser tests pass at root and `/prototype/` (2 + 2): five local portraits decode, Noah/Robin images are visible, exactly one fallback remains, no remote images or asset errors. New illustrations visually inspected; provenance/prompts recorded. Full responsive matrix was not rerun for this asset-only refinement; see validation.md.
