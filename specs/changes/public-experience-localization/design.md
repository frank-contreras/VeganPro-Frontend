# Public experience localization technical design

Status: Implemented technical design; see [tasks.md](tasks.md) and [validation.md](validation.md) for evidence and remaining native accessibility limits.
Date: 2026-10-07 (America/Santiago).
Behavior source: [change.md](change.md). Baseline: [directory specification](../../features/professional-directory/spec.md) and [directory design](../../features/professional-directory/design.md).

## Confirmed constraints and selected approach

Prior exploration and current targeted graph/source inspection confirm a React +
Vite + TypeScript application with plain CSS, a stable module-level mock source,
and a feature-local reducer/controller. The source effect depends on
`[source, revision, selection]`; locale is absent. The page already owns public
composition and recovery focus. Filter values and fixture matching are separate
from English display labels. Portrait failure is local component state.
Graph coverage reported matching metadata and no recorded gaps for the inspected
paths; this is best-effort evidence, confirmed against targeted source.

Choose a small React context with typed, eagerly bundled message catalogs and a
pure resolver. Add no localization dependency, router, global directory store,
remote catalog loader or backend adapter. This prototype needs fixed messages
and two locales, not pluralization/interpolation machinery. Tradeoff: the project
owns a bounded resolver and completeness checks. Reconsider tooling if later
requirements introduce rich messages, grammatical plurals or translation tooling;
this change does not require those capabilities.

## Localization modules and contracts

Proposed implementation locations (none created by this design):

| Module | Responsibility |
| --- | --- |
| `src/localization/messages.ts` | Canonical message-key union and read-only emergency Spanish/English copy. Keys cover public UI, accessibility, feedback, metadata and controlled fixture vocabulary. |
| `src/localization/catalogs/es.ts`, `en.ts` | Complete reviewed catalogs satisfying the shared key schema. No raw HTML or executable content. |
| `src/localization/resolveMessage.ts` | Pure resolution returning `{ text, language }`; test injection accepts partial catalogs. |
| `src/localization/LocaleProvider.tsx` | One `useState` locale, guarded setter, catalog registry and context hook. Missing provider is a developer error, not silent extra locale ownership. |
| `src/localization/LocalizedText.tsx` | Render resolved text with its effective `lang` when different from the active document language. Plain text only. |
| `src/localization/DocumentMetadata.tsx` | Sole runtime owner of document language/title/description. |
| `src/components/public/LanguageSelector.tsx`, `PublicHero.tsx`, `PublicFooter.tsx` | Public presentation with locale context; no directory state ownership. |

Supported registry entries contain locale code, self-name and catalog. Initially
register only `es` (Español) and `en` (English). The type for supported locale
codes is derived from that registry, not scattered binary conditions. Adding a
complete `pt-BR` or `ht` catalog and registry entry later extends selection and
resolution without changing directory modules or transitions. Do not advertise
these future entries or add empty catalogs now. Optional selector self-name
constants are intentionally stable and language-annotated.

Catalogs must satisfy the canonical key schema at compile time; tests additionally
reject missing, blank and whitespace-only entries and inspect equivalent meaning
for affiliation, verification and disclosures. Resolver checks runtime input too:

1. Use a nonblank string for the active locale/key.
2. Otherwise use the Spanish catalog entry.
3. Otherwise use the English catalog entry.
4. Otherwise use the canonical emergency copy for that exact key, Spanish for
   Spanish UI and English for other UI. This independently maintained, complete
   read-only baseline is not a third mutable locale catalog.

The resolver records the actual language of the chosen text. Emergency copy is
specific to each control/state/status: never return one generic word for all
controls, a raw key or `undefined`. Unknown verification/affiliation values select
the unavailable key before resolving; fallback never changes the status meaning.
Completeness tests make emergency usage in normal catalogs a validation failure;
fallback tests deliberately inject malformed catalogs. No telemetry, public
debugging panels or runtime technical warnings are added.

For inline text and labeled headings use `LocalizedText` or apply the returned
`lang` to the text-bearing element. For native options, apply it directly to
`option`; do not insert spans inside options. Associated labels and
`aria-labelledby` provide localized control/region names where possible. Where
an `aria-label` is necessary, put effective `lang` on the owning element and
override languages on independently resolved descendants. This avoids silently
pronouncing Spanish fallback as English. Native option/ARIA pronunciation still
requires manual assistive-technology evidence.

## Locale ownership and state preservation

Mount `LocaleProvider` once inside the existing root Strict Mode, above `App`.
Mount `DocumentMetadata` within that provider. Test-only browser entry and
component helpers supply the same provider; standalone directory components do
not invent their own locale state. Provider initialization is `es`.

Use memory only: no localStorage, sessionStorage, cookies, browser detection,
URL synchronization or persistence. Every reload starts Spanish. This is the
smallest choice permitted by L-01; retained-preference acceptance branches are
NOT APPLICABLE. A guarded setter accepts only registered codes; unsupported
input normalizes to Spanish. Selecting the current locale is a no-op.

Context exposes locale, setter and message resolution. Keep provider and child
component types/tree positions constant. Context value may be memoized for
clarity, but preservation must not depend on memoization. Locale must never be
a key on provider, page, directory results, cards, filters, recovery buttons or
portraits. Keep card keys as record keys and portrait reset keys as image URLs.

`App` continues to pass the imported stable `mockDirectorySource`. Do not call
`createMockDirectorySource` while rendering or build locale-specific sources.
Do not pass locale into `DirectorySource.load`, add it to selection, reducer
actions, revision or the source effect dependencies. Do not store translated
views/options in reducer state. Resolve display labels at render time from the
unchanged accepted data.

| Locale-change situation | Effect |
| --- | --- |
| Populated result | Relabel the same records/options in the same order; keep selections. |
| Initial pending | Keep pending execution and disabled filters; translate progress. |
| Update/retry pending | Keep execution, selections and ready options; no new request. |
| Empty/no-matches/error | Keep exact outcome and recovery availability; translate existing branch. |
| Pending completes later | Existing controller accepts/rejects by revision/cleanup; current render supplies current-language feedback. |

No locale handler dispatches clear/retry/select. Keep the persistent status node
and recovery buttons mounted across locale changes within the same outcome.
Selector remains focused after switching. Recovery action still focuses the
existing stable results heading before its button disappears; async completion
does not move focus. Re-rendering alone must not invalidate the active execution.

## Translation boundaries and internal model delta

Translate skip link, prototype label, selector label, hero/footer/disclosures,
directory headings/list/region names, filter labels/All options/actions, missing
identity/category labels, affiliation/verification, all feedback details and
buttons, live messages and metadata. Keep proper names unchanged. Translate
controlled locations such as Remote and country display text; preserve cities
and geographic meaning.

Add optional presentation hints to internal types rather than matching English
strings or looking up records by name/key:

- `FilterOption.labelKey?: MessageKey` for controlled sample option labels.
- `Professional.categoryLabelKey?: MessageKey` and
  `Professional.locationLabelKey?: MessageKey` for sample display fields.

`MessageKey` is a type-only import from the canonical key module. These hints
describe local presentation, not external DTOs. Fixtures supply explicit keys
for their known vocabulary while retaining raw `label`, `category` and `location`
as display fallback for unkeyed records/test doubles. Do not derive localized
categories from affiliation, names or arbitrary string matching.

Resolve a present keyed field through catalogs; unkeyed supplied text remains
unchanged. Missing/blank category still uses unavailable text; do not use a key
to fabricate a missing field. Missing/blank location remains omitted. Long-text
tests that override category/location explicitly omit their corresponding hints,
or use injected long catalog entries, so localization cannot hide stress data.

Keep option `value`, `ALL`, record `key`, fixture `categoryValue`, eligibility,
affiliation and verification identifiers exactly as before. The mock source
remains locale-agnostic and matches the complete fixture collection with AND.
Presentation hints and images do not affect membership or order. Reducer/hook
logic requires no behavior change.

Replace `statusMessage`'s English strings with a pure kind-to-message-key mapping
consumed by both visible feedback and the single existing polite live region.
Keep live text outside busy results, `aria-atomic`, and no extra alert/locale
announcement region. A language switch changes the status text in place; future
completion resolves its message in the current locale, never a captured locale.

## Hero, footer and public composition

Keep `ProfessionalDirectoryPage` as the composition/controller owner to avoid a
larger shell refactor. Extract only presentational hero/footer and the selector;
the existing header can remain inline with the selector mounted alongside brand
and prototype label. Hero receives directory target ID and an activation callback;
it does not import controller or source APIs.

Hero contains one H1, short localized eyebrow/value copy, a clear prototype
disclosure and one discovery anchor. Example direction: Spanish action
“Explorar profesionales”, English “Explore professionals”; copy must describe
the sample directory rather than promise credentials or care quality. Use an
in-page `href="#professional-directory"`. Put that stable ID on a focusable
directory heading immediately before filters (`tabIndex={-1}`), with a page ref.
On ordinary same-page activation, focus that heading and let fragment navigation
reach it; never dispatch or call the source. Keep the existing results heading
separate for recovery focus, and retain the skip link to `main-content`.

Use a visible focus treatment and scroll margin for the destination. No forced
smooth scrolling or motion. Responsive header wraps; hero text/actions stack on
narrow screens. DOM order: skip link, header selector, hero discovery action,
directory filters, clear, optional recovery. Do not use positive tabIndex.

Footer stays outside main and is present in every outcome. Include wordmark,
localized co-creation/prototype sentence and concise fictional-data/illustrative
portrait reminder. Choose no footer links for this change: no destinations are
needed to meet L-10. Full disclosure remains prominent in the hero before cards;
the footer reminder supplements it.

Keep existing responsive grid, shrinkable controls, wrapping, contrast tokens
and reduced-motion rules. Add styling for the new presentation only; do not
change directory controls/results responsiveness or remove verification text.

## Portrait assets and disclosure

Use five locally authored fictional portrait illustrations exported as compact
WebP/JPEG assets under
`src/features/professional-directory/assets/portraits/`. Avoid downloading real
people or using remote avatar/photo providers. If raster generation is used
during implementation, generate fictional people; it introduces no runtime
service dependency. No assets are generated in this design step.

Create a module-level `samplePortraits.ts` mapping `sample-ada`, `sample-leo`,
`sample-maya`, `sample-noah` and `sample-robin` to explicitly imported asset URLs,
then assign the corresponding `image` values in fixture declarations. Keep only
the intentionally incomplete record without an image for the visible fallback.
Use test-specific fixtures for absent/blank/failed-image coverage. This selection
reflects the user’s 2026-10-08 manual-review refinement. Mapping is
fixture-only and is not a data-source contract. Record creation method,
illustrative nature and asset provenance in fixture documentation when assets
are produced. Approval of real identities or external licensing is not presumed.

Normalize blank/whitespace image strings to absent in `Portrait`. Preserve
`onError` fallback, decorative `alt=""`, fixed image dimensions/object-fit, and
reset on normalized source replacement. Do not key by locale; a failed portrait
stays a fallback across switching. No image URL changes with locale, and no
card becomes interactive. Disclosure explicitly says people, categories,
affiliations and verification are fictional and portraits are illustrative,
not evidence of real professional identity or endorsement.

## Metadata and static delivery

Set initial `index.html` lang/title/description to reviewed Spanish prototype
copy so static entry is correct before JavaScript. `DocumentMetadata` uses a
locale/catalog-dependent effect to set `document.documentElement.lang`,
`document.title`, and the existing description meta's content. If description
meta is absent, create one once rather than duplicate it. Locale switching
updates after the committed render; this effect does not depend on directory
state and never owns requests. Make writes idempotent under Strict Mode.

Set root language to the selected locale. If metadata falls back across
languages, annotate the title and description elements with their resolved
language; inline fallback likewise has its own `lang`. Supported catalogs and
emergency metadata copy include both es/en, so ordinary rendering has no mixed
metadata. Browser title pronunciation may not honor element annotation; manual
verification must report that limitation rather than changing page locale to
misdescribe the rest of the UI.

Use ES asset imports; Vite adjusts those URLs to configured `base`. Keep existing
`VITE_BASE_PATH` validation and root/representative-subpath checks. Do not add
hard-coded `/assets/...`, hostname assumptions, locale routes or SPA fallback.
Inline imported images are valid bundled assets too. Eager catalogs require no
fetch/XHR, so the existing no-data-request browser assertion remains meaningful.
No workflow, remote Pages settings or deployment changes are needed.

## Validation strategy and acceptance mapping

| Coverage | Evidence to produce | Criteria |
| --- | --- | --- |
| Resolver/catalog unit tests | Complete es/en key sets and nonblank text; active → Spanish → English → emergency fallback, effective language, unsupported locale guard and conservative status mapping. Test partial catalogs through resolver parameters, not mutating globals. | AC-L01, AC-L06, AC-L15 |
| Provider/component tests | Fresh es despite English browser preference; es/en round trip; real accessible selector/name changes; focus remains; no reload; all visible/nonvisual labels translated. Use an explicit en provider where preserving English baseline assertions is useful, plus Spanish default tests. | AC-L01, AC-L02, AC-L07 |
| Controlled-source preservation | After initial readiness record request count/selections/results, switch and assert no additional call. Cover populated filters, initial pending, update pending, retry pending, empty, no-matches and repeated error. Resolve/reject outstanding requests afterward to prove they remain active and stale outcomes cannot win. Compare deltas after Strict Mode setup, not absolute initial counts. | AC-L03–AC-L05, AC-L14 |
| Metadata tests | Initial HTML defaults plus mounted effect updates lang/title/description for both locales; no duplicate meta; cross-language fallback annotations and no raw keys. | AC-L08 |
| Public/portrait components | Hero focus destination/callback is presentation-only; footer content in every state; portrait absent/blank/failure/source replacement; failure persists across locale changes; names/status preserved. | AC-L10–AC-L13 |
| Browser production root/subpath | Switch locale, filter, activate hero, inspect selector/directory/recovery focus and actual tab order. Reload returns Spanish and All as documented. Portraits complete with naturalWidth > 0; failed-resource list empty for normal fixtures; imported resources local or data URLs, no remote portrait or data requests. | AC-L02, AC-L08, AC-L10–AC-L13 |
| Browser state/viewport matrix | Both locales × five outcomes × 320/768/1280, plus injected long catalog text/unkeyed long records; overflow geometry, screenshots, axe, focus and computed contrast including selector/discovery. Exercise reduced-motion preference. | AC-L07, AC-L09, AC-L11, AC-L14 |

Existing source/reducer/hook tests retain their locale-independent behavior
coverage. Parameterize presentation interaction/recovery/card cases across es/en;
update hard-coded English DOM assertions and keyboard typeahead to locale-aware
expected labels while still selecting stable values. Use explicit expected
messages/selected copy assertions independent of the resolver under test, so
catalog defects are not hidden by tests importing the same output blindly.

Wrap exceptional-state browser fixture entry in the same provider and metadata
owner. Locale/catalog overrides for test cases stay in test-only code and never
become production scenario controls. Retain current root/subpath commands and
test-only fixture output separation. Native screen-reader announcements and
fallback pronunciation need a recorded manual session; DOM/axe evidence alone
does not turn existing AC-012 or AC-L07 into a full accessibility PASS.

Run lint/typecheck, unit/component suite, browser root/subpath checks and build
during implementation validation. Report PASS/FAIL/UNVERIFIED/NOT APPLICABLE.
No runtime tests were rerun for this design-only change; existing exploration
results are historical evidence, not proof that this proposed solution works.

## Tradeoffs, boundaries and handoff

- Context rerenders are acceptable at prototype scale; introducing store
  selectors or memoizing the entire directory is unnecessary. Correct identity
  and effect boundaries, not optimization, preserve operations.
- In-memory locale avoids storage failure/initial-language flash and keeps fresh
  Spanish deterministic; reload intentionally loses language selection.
- Optional label keys retain arbitrary test/source presentation text and missing
  fields, with a small type-level dependency on message keys. They do not change
  external boundaries or promise translation of arbitrary supplied content.
- Emergency copy duplicates a small essential baseline deliberately. Completeness
  tests and meaning review prevent it from hiding catalog maintenance failures.
- Local fictional illustrations provide portrait presence without real-identity
  claims; asset production/provenance and final bilingual copy remain bounded
  implementation deliverables, not architecture blockers.

No changes to eligibility, verification semantics, matching, backend contracts,
authentication, registration, admin, routing or publication. No migration or
persistent-data rollback is needed. Validate the complete new presentation before
delivery; reverting the change as a unit restores English-only presentation and
fallback-only samples without migrating directory state.

Guidance consulted through Context7: React [state identity](https://react.dev/learn/preserving-and-resetting-state)
and [effect dependencies](https://react.dev/learn/removing-effect-dependencies);
Vite [base-aware builds](https://vite.dev/guide/build.html#public-base-path)
and [asset imports](https://vite.dev/guide/assets.html#importing-asset-as-url).
Repository source remains authoritative for current behavior.

Next: `sdd-plan` using this design and all AC-L01–AC-L15. Only this design artifact
is created in this step; application code, tests, dependencies and baseline
specifications are unchanged.
