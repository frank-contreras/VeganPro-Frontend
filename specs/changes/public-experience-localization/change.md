# Public experience localization

Status: Approved behavior change implemented; see [tasks.md](tasks.md) and [validation.md](validation.md) for evidence and native accessibility limitations.
Date: 2026-10-07 (America/Santiago).

## Motivation and evidence

Make the public co-creation prototype approachable in Spanish while retaining
English and preparing for additional languages. Improve the public presentation
without expanding the professional directory's functionality or suggesting that
fictional professionals, portraits, or verification values are real.

The completed `sdd-explore` investigation is the scope source. It inspected the
current application, graph relationships, tests and these baseline artifacts:

- [Directory specification](../../features/professional-directory/spec.md).
- [Directory design](../../features/professional-directory/design.md).
- [Implemented tasks](../../features/professional-directory/tasks.md).
- [Validation record](../../features/professional-directory/validation.md).

Confirmed evidence: `ProfessionalDirectoryPage` composes the current intro,
filters, results, live region and footer; `useProfessionalDirectory` and
`directoryState` own operation state; the mock source filters six fictional
records. UI and HTML metadata are English. Filter values are separate from
labels, while sample category display text and some locations are English.
`ProfessionalCard` already handles absent/failed images and resets failure on
image replacement. No sample record currently supplies a portrait.

The exploration ran 18 passing unit/component tests and passing type checking.
It inspected, but did not rerun, browser tests. Historical greenfield wording in
the baseline spec/design is not evidence that the current implementation is
absent. This document defines a prospective delta; it does not rewrite prior
implementation or validation history.

## Current, desired and delta

| Area | Current | Desired | Delta |
| --- | --- | --- | --- |
| Public language | English copy and `lang="en"`; no selector. | Spanish default, Spanish/English selection. | Add locale behavior and translate public presentation. |
| Language readiness | Inline English UI and sample labels. | Further locales can be added without redesigning directory behavior. | Establish an extensible localization structure; defer technical mechanism. |
| Directory state | Feature-local selection, revision, pending/success/error and recovery. | Same behavior and state across locale changes. | Locale affects presentation, not directory operations. |
| Hero | Purpose heading, introduction and prominent fictional-data notice. | Stronger purpose/value hierarchy and clear route to discovery. | Improve existing presentation and add an in-page discovery action. |
| Footer | Minimal brand/tagline footer. | Clear public brand, prototype context and sample-data reminder. | Improve existing footer content and hierarchy. |
| Portraits | Optional-image support; all production samples use fallback. | All five named fictional records show bundled mock portraits; the intentionally incomplete record keeps its fallback. | Add illustrative assets while preserving resilient fallback and disclosure. |

## Desired behavior requirements

| ID | Requirement |
| --- | --- |
| L-01 | With no explicitly retained supported preference, the public UI starts in Spanish (`es`). Browser language must not override this default. If design chooses preference retention, a valid explicit preference may be restored; retention is not required by this change. |
| L-02 | Provide an accessible language selector offering Español and English, with the active selection identifiable. Switching applies without a page reload. Only `es` and `en` are available in this change. |
| L-03 | Localization must accommodate Brazilian Portuguese (`pt-BR`) and Haitian Creole (`ht`) later without redesigning filtering, operation state, or directory behavior. Their translations and selectable availability are deferred. |
| L-04 | Translate visible UI copy, control and region accessible names, status announcements, verification/affiliation labels, unavailable labels, sample vocabulary, feedback and recovery actions, hero/footer and disclosures into the active language. Keep proper names and stable identities intact; translate descriptive sample location text where applicable without inventing facts. |
| L-05 | Filtering identifiers, record keys, affiliation/status identifiers and the All sentinel never change with locale. Localized labels must not determine matching or eligibility. This applies to internal presentation values only and establishes no external schema. |
| L-06 | A locale change preserves both filter selections, ready filter options, record membership/order, current populated/empty/no-matches/error outcome, and pending operation and recovery progress. It must not clear, retry, restart loading, cancel the active operation or reset directory state. Pending completion still follows the latest filter selections. |
| L-07 | Missing or blank translation text falls back to the corresponding Spanish text. If Spanish text is also unavailable, use meaningful safe English text. Never expose an empty label, raw translation key, `undefined`, or technical error. If neither catalog provides usable copy, required controls and feedback still receive meaningful safe text. Such defects must be detectable during validation; normal supported-language rendering must be complete. Fallback must preserve verification/affiliation meaning and accessible naming. |
| L-08 | Public document language, title and description reflect the active locale, including Spanish on a fresh default entry and English after switching. Do not imply a live service or real verification. Fallback text in a different language must remain understandable to assistive technology; document-language handling must not obscure its actual language. |
| L-09 | Improve the hero's readable purpose/value hierarchy, retain a clear directory purpose, and provide a discovery action leading to or focusing the directory filters/results. Keyboard activation provides a meaningful directory destination without clearing selections, fetching data or navigating to a new feature. Keep the fictional-data notice prominent. |
| L-10 | Improve the public footer with VeganPro identity, concise prototype/co-creation context and a sample-data reminder in the active locale. It remains available in every directory outcome. Any included links must have real, in-scope destinations; placeholder links and implied unavailable services are excluded. |
| L-11 | All five normal named fictional professionals show bundled mock portraits served with the prototype's own assets. No remote image service or externally hosted portrait is introduced. Disclose that portraits are illustrative and do not identify real listed professionals; all people, categories, affiliations and verification values remain fictional/sample data. Portraits never imply eligibility, verification, credentials or endorsement. |
| L-12 | Missing, absent, blank or failed portrait sources produce a neutral graceful fallback without broken-image UI, loss of card content or disrupted browsing. Replacing a failed source permits the replacement image to render. Portrait accessibility must avoid redundant identity announcements and false identity claims. |
| L-13 | Preserve keyboard access, visible focus, coherent card semantics, persistent polite outcome announcements and predictable recovery focus. Changing language keeps focus on the language control and does not move it to results or announce the whole card list. Outcome announcements and accessible recovery text reflect the new locale, including when an operation completes after switching. |
| L-14 | At 320, 768 and 1280 CSS pixels, both languages and representative longer localized text keep the selector, hero, disclosure, filters, cards, footer, statuses and actions usable without horizontal page scrolling, clipping or overlap. Preserve information parity, contrast and reduced-motion behavior. |

## Compatibility and unchanged behavior

This delta extends presentation under FR-001, FR-003, FR-005, FR-006, FR-007
through FR-010, FR-012 and FR-013, and preserves FR-002, FR-004 and FR-011.
BR-001 through BR-005 and CON-001 through CON-003 remain applicable.
The prior English-only planning choice is replaced prospectively by L-01–L-04;
prior acceptance evidence remains historical evidence, not validation of this change.

- Public access without a session or authentication gate.
- One category and one affiliation selection, defaulting to All; direct application,
  AND matching, clear-to-All, stable vocabulary and existing record ordering.
- Explicit fixture eligibility; unknown affiliation retained unfiltered and excluded
  from specific affiliation matches. No inference from names, images or categories.
- Textual verification independent of affiliation; unknown/unrecognized status
  remains unavailable rather than negative or positive verification.
- Initial loading; disabled filters until vocabulary is ready; retained options
  after readiness; old cards removed during updates.
- Distinct populated, directory-empty, no-matches and failure states; retry uses
  current selections, technical failures stay private, latest-operation outcomes win.
- Graceful missing-name/category/location/image behavior and recovery focus.
- Static single-page delivery at root and configured Pages subpath, with no
  backend calls or new product routes introduced by this change.

Existing behavioral tests remain regression obligations. Copy and keyboard-order
assertions may be updated to reflect the intentional locale/selector change;
behavioral coverage must not be removed or weakened to obtain passing checks.

## Acceptance criteria

Scenarios use controlled fictional records and outcomes; they establish no API
contract or real-world verification claim.

| ID | Scenario and expected result | Requirements |
| --- | --- | --- |
| AC-L01 | On a fresh entry without a retained explicit preference, Spanish is selected and all required public UI/accessibility copy is Spanish. A non-Spanish browser preference does not change the default. | L-01, L-04 |
| AC-L02 | A keyboard or pointer user switches Spanish → English → Spanish without reload. The selector exposes its purpose/current choice; visible text and accessible names update. Only these two languages are selectable. | L-02, L-04, L-13 |
| AC-L03 | With either filter active or both active and populated results, switching preserves exact selection values, options, record keys/order and result membership. No new directory operation is triggered. | L-05, L-06 |
| AC-L04 | During controlled initial loading, filtered loading, or a pending retry, switching preserves pending progress and selections/readiness. The active operation completes normally in the chosen language; superseded success/failure still cannot replace the latest selection's outcome. | L-06, L-13 |
| AC-L05 | Switch in unfiltered-empty, filtered-no-matches and error states, including after repeated failures. Each outcome, selections and available recovery actions remain intact, with translated text. Clear and Retry subsequently retain their existing semantics and focus recovery. | L-04, L-06, L-13 |
| AC-L06 | In controlled missing/blank translation cases, Spanish fallback appears; with Spanish also missing, meaningful safe English appears. If both are absent, required controls/status still have safe meaningful text. No raw keys, empty names or technical errors appear. Unsupported saved locale values, if retention exists, resolve to Spanish. Fallback does not turn unavailable verification into verified/not-verified. | L-01, L-07 |
| AC-L07 | In each language, pending/populated/empty/no-matches/error updates produce the appropriate localized polite status text. Switching while pending yields a completion announcement in the new locale. The selector retains focus; results/cards are not announced wholesale. Verify semantics/DOM and keyboard behavior; record native screen-reader verification separately. | L-04, L-13 |
| AC-L08 | Fresh entry has Spanish document language/title/description. Switching to English and back updates all three to the active language. Metadata remains truthful about the prototype. Language handling for cross-language fallback supports correct pronunciation. | L-07, L-08 |
| AC-L09 | Both supported languages and longer-text samples fit 320/768/1280 CSS pixels in all five directory outcomes. Controls, disclosure, verification, recovery and footer remain readable/operable; no overflow, clipping or overlap occurs. Focus, contrast and reduced-motion handling remain valid. | L-14 |
| AC-L10 | The localized hero communicates directory purpose and sample context. Activating its discovery action by keyboard or pointer reaches/focuses the directory, preserves filters/outcome and triggers no directory request or new route. | L-09 |
| AC-L11 | The footer is visible and localized in every directory outcome, identifies VeganPro and the co-creation prototype, and reminds users about sample data. Any links are keyboard accessible with working in-scope destinations; no placeholder/service claims are present. | L-10, L-14 |
| AC-L12 | All five normal named fixtures render bundled illustrative portraits at root and a representative Pages subpath without asset failures or remote portrait requests. The public disclosure explicitly covers fictional people/statuses and illustrative portraits in both languages. Card identity, eligibility and verification are unchanged. | L-11 |
| AC-L13 | Absent/blank/failed portrait sources yield a neutral fallback and preserve all card information; replacing a failed source allows rendering. Existing incomplete-data fixtures continue to exercise missing information. Images produce no duplicate/false identity announcement. | L-12 |
| AC-L14 | Regression checks continue to cover category alone, affiliation alone, AND, clear, unknown affiliation, explicit eligibility, unique keys, truthful verification, initial/update loading, distinct empty states, initial/update/repeated failure, current-selection retry, stale completion rejection, Strict Mode/unmount cleanup and recovery focus. All behaviors match the baseline in both locales where presentation is involved. | L-05, L-06, L-12, L-13; baseline AC-001–AC-012 |
| AC-L15 | Design review shows that complete `pt-BR` or `ht` translations can later be added without changing directory matching, identifiers or state transitions. No incomplete future language is advertised by this change. This is readiness evidence, not a claim that those translations exist. | L-03 |

## Risks and affected areas

- Locale-dependent mounting/source identity could reset state or restart pending
  work; preserving state is an explicit acceptance obligation.
- Translated category/affiliation values could break filtering. Sample display
  text and stable identifiers must remain distinct.
- Partial translation can leave English accessibility/status text behind or
  misrepresent verification. Include nonvisual copy and conservative fallbacks.
- Longer text, header controls and a discovery action affect layout and tab order.
  Preserve accessibility behavior while updating intentional ordering expectations.
- Realistic mock portraits can imply real identity/endorsement. Bundled assets,
  truthful disclosure and neutral failure behavior are mandatory.
- Root-relative image references can fail under Pages subpaths.

Affected areas identified by exploration: public page composition, card/filter/
feedback presentation, sample vocabulary/assets, document metadata, CSS,
component/browser tests and related SDD documentation. The directory reducer,
controller and source behavior are compatibility boundaries, not new feature scope.

## Explicit out of scope

- Backend/API contracts, live data, endpoints, authentication, registration,
  administration, persistence services or professional verification workflows.
- Profiles/detail routes, booking, contact, search, ranking, pagination, analytics,
  user accounts, or unrelated public pages and product features.
- Remote image services and portraits representing real listed professionals.
- Shipping `pt-BR`/`ht` translations, automatic browser-language selection,
  locale-specific routes, or multilingual search/filter semantics.
- Actual publication, remote hosting changes, or claiming full accessibility
  compliance based solely on automated checks.

## Open decisions and next step

The required outcomes above are settled for this change. Technical design must
choose localization tooling/catalog organization, locale ownership, fallback
execution and language annotation, document-update mechanism, whether/how an
explicit preference is retained, component boundaries and bundled-asset delivery.
No library, persistence mechanism or component structure is prescribed here.

Exact hero/footer copy, visual treatment, portrait assets and
asset provenance remain to be finalized within these constraints. Translation
review must preserve meanings of affiliation, verification and sample disclosure.
External contracts remain UNKNOWN and unnecessary for this prototype change.

Next: `sdd-design` beside this document, followed by `sdd-plan`. Validation must
distinguish PASS, FAIL, UNVERIFIED and NOT APPLICABLE, especially native
screen-reader behavior and live hosting. No implementation is authorized by
this specification-only step.

## Portrait scope refinement — 2026-10-08

Manual public-prototype review requested portraits for Noah Grove and Robin
Meadow as well as Ada, Leo and Maya. All five normal named fixtures receive
bundled fictional illustrations. Only the intentionally incomplete fixture
remains without a portrait, keeping a visible fallback example. Automated
missing/blank/failed-image coverage uses test-specific fixtures and must remain
intact. This refinement changes no filtering, eligibility or directory behavior.
