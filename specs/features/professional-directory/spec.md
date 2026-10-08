# Public professional directory

Status: Draft specification; ready for review and technical design.

## Purpose and users

Help public visitors discover vegan or vegan-friendly professionals and compare
their professional identity, practice category, and visible verification status.
Visitors can browse without signing in. This is the first frontend capability in
a greenfield repository; there is no existing application behavior to preserve.

## Scope and proposed assumptions

The first version includes a listing, basic filters, professional cards,
verification status, loading/empty/error states, and responsive behavior.

The following are proposed frontend requirements, not confirmed external facts:

- Basic filtering consists of professional category and vegan affiliation
  (vegan or vegan-friendly), with one selection per filter and an All option.
- Cards prioritize professional name, category, affiliation, and verification
  status. Location is shown when available; images are optional.
- Filter selections apply directly, without a separate submit action.

These choices keep the first version small. Category vocabulary, affiliation
definitions, eligibility, verification semantics, and available data remain
unknown. Resolve these assumptions before implementation depends on them.

## Functional requirements

| ID | Requirement |
| --- | --- |
| FR-001 | A public visitor can open the directory and browse it without authentication. The directory identifies its purpose as discovering vegan or vegan-friendly professionals. |
| FR-002 | When a successful result contains eligible professionals, show one card per professional in that result. With no active filters, show the available unfiltered result. Do not claim this represents every professional in the service. |
| FR-003 | Provide labeled category and affiliation filters, each defaulting to All. Show the current selections and an explicit way to clear all filters. Option labels must come from an agreed vocabulary; do not invent categories. |
| FR-004 | Applying a filter updates the displayed result to matching professionals. Active filters combine using AND. Clearing all filters restores the unfiltered result. Whether matching occurs locally or externally is undecided. |
| FR-005 | Each card shows a readable professional name, category, affiliation, and verification status. Show location when supplied. If identity or category is missing, use neutral unavailable text; do not fabricate details. Optional absent images must not produce broken-image UI or prevent browsing. |
| FR-006 | Every card displays verification status in text. Show Verified only when authoritative data explicitly supports that meaning. Show Not verified only when authoritative data explicitly supports that meaning. Otherwise show Verification status unavailable. Color or icons alone must not communicate status. |
| FR-007 | While the initial directory result is pending, show a visible, accessible loading indication. Do not show a success, empty, or failure message before an outcome is known. |
| FR-008 | During a filter update or retry, retain selected filters and show that the result is pending. Previously displayed cards, if retained, must be clearly identified as previous results, not the completed result for the new selection. |
| FR-009 | A successful empty unfiltered result shows a directory-empty message. A successful empty result with active filters shows a no-matches message and a clear-filters action. Neither state appears as an error. |
| FR-010 | A failed initial load or result update shows a plain-language error and a Retry action. Retry uses the current selections. Preserve filter selections through failure and recovery. Do not expose raw technical error details. |
| FR-011 | The completed result always corresponds to the latest filter selections. An older operation completing later must not replace the current result or status. |
| FR-012 | Filters, cards, status messages, and recovery actions remain usable on narrow and wide viewports. At 320 CSS pixels wide, content must not require horizontal page scrolling. Long names and labels wrap without obscuring status or actions. |
| FR-013 | All controls work by keyboard, have accessible names, and show visible focus. Group each card's information coherently for assistive technology. Loading, result changes, empty states, and errors are announced without moving focus unexpectedly. Text and controls meet WCAG 2.2 AA contrast requirements. |

## Business rules and constraints

- **BR-001:** Only professionals identified as eligible through an agreed source
  may be presented as part of this vegan or vegan-friendly directory. Eligibility
  rules and who supplies that determination are unknown; the frontend must not
  infer affiliation from a name, image, description, or category.
- **BR-002:** Vegan affiliation and verification are independent concepts.
  Neither implies the other. Unknown affiliation must be labeled unavailable,
  never silently assigned to vegan or vegan-friendly.
- **BR-003:** Verification text communicates only the confirmed status meaning.
  Do not imply licensing, clinical quality, credentials, safety, or endorsement
  without a documented definition that supports the claim.
- **BR-004:** Missing or unrecognized verification data means unavailable, not
  Not verified. No verification workflow is included in this capability.
- **BR-005:** Filtering must not introduce duplicates or expose entries outside
  the agreed directory eligibility. Ordering is unspecified; no ranking claim
  or sort control is required.
- **CON-001:** This specification defines frontend behavior only. It does not
  prescribe backend services, persistence, authentication, or API implementation.
- **CON-002:** No endpoint, payload shape, field name, status enum, identifier,
  data-fetching mechanism, or filtering execution location is established here.
  Display concepts below are user-visible needs, not an external data schema.
- **CON-003:** Responsive layouts preserve the same information and actions;
  verification status must not disappear on small screens.

## Inputs, outputs, and states

Visitor inputs are category selection, affiliation selection, clear filters,
and retry. External inputs are professional display information, eligible result
membership, filter vocabulary, verification meaning, and operation outcomes;
their contracts are **UNKNOWN**.

Outputs are cards, current filter selections, and one clearly communicated
result state: loading, populated, directory empty, no matches, or error.

| Trigger | Required transition |
| --- | --- |
| Open directory | Loading, then populated, directory empty, or error. |
| Change a filter | Pending update with latest selections, then populated, no matches, or error. If selections are all All, use directory empty for a successful empty result. |
| Clear filters | Reset both selections to All; resolve to populated, directory empty, or error, with loading shown while pending. |
| Retry after failure | Pending with current selections, then the appropriate successful state or error again. |
| Older outcome arrives | Keep the state and result associated with the latest selections. |

Failure must not be represented as an empty directory. Incomplete optional
display information must not cause an otherwise usable card to disappear.
Malformed or unusable external records require a contract decision; silently
claiming complete results after discarding records is not specified behavior.

## Acceptance criteria

Acceptance scenarios use controlled representative data. They validate frontend
behavior and do not establish an API contract or prove live integration.

| ID | Scenario and expected outcome | Requirements |
| --- | --- | --- |
| AC-001 | Given an unauthenticated visitor and a populated eligible result, opening the directory shows its purpose and one card per professional after loading. | FR-001, FR-002 |
| AC-002 | Given agreed category options and professionals spanning both affiliation choices, selecting a category shows only its matches; selecting affiliation alone shows its matches; selecting both shows their intersection. Selections remain visible. | FR-003, FR-004, BR-005 |
| AC-003 | Given active filters, clearing them sets both to All and restores the unfiltered result when it succeeds. | FR-003, FR-004 |
| AC-004 | Given records with display information and records missing optional images or location, cards remain readable and usable without fabricated information or broken images. Missing names/categories use neutral unavailable text. | FR-005 |
| AC-005 | Given explicitly confirmed verified, explicitly confirmed not-verified, absent, and unrecognized verification values, cards respectively show Verified, Not verified, or Verification status unavailable. Status is understandable without color or icons. | FR-006, BR-003, BR-004 |
| AC-006 | Given unknown affiliation on an otherwise eligible record, its card says affiliation is unavailable and does not claim either affiliation. An affiliation-specific result must not claim this record is a match without an authoritative determination. | BR-001, BR-002 |
| AC-007 | While the initial outcome is delayed, loading is visible and accessible; empty or error messaging appears only after the corresponding outcome. | FR-007 |
| AC-008 | Given a successful empty unfiltered result, show a directory-empty message. Given a successful empty filtered result, show no matches and clear filters; clearing triggers unfiltered recovery. | FR-009 |
| AC-009 | Given failed initial and filtered updates, show a readable error and Retry. Retry preserves current selections, shows pending progress, and recovers to the appropriate result when successful. | FR-008, FR-010 |
| AC-010 | Given rapid selection changes whose outcomes arrive out of order, only the latest selections determine the completed result and status. Any retained previous cards are identified as previous results while pending. | FR-008, FR-011 |
| AC-011 | At 320, 768, and 1280 CSS pixels wide, filters, long-text cards, verification text, and all state/recovery actions are usable without horizontal page scrolling, clipping, or overlapping content. | FR-012, CON-003 |
| AC-012 | Keyboard-only navigation can operate each filter, clear, and retry with visible focus. Assistive technology can identify controls, card content, and state changes; updates do not unexpectedly move focus. Text and controls satisfy the stated contrast requirement. | FR-013 |

## Out of scope

- Professional detail pages, contact actions, booking, messaging, or payments.
- Accounts, sign-in, professional onboarding, editing, or verification workflows.
- Maps, geolocation, distance search, free-text search, advanced filters, sorting,
  reviews, ratings, favorites, or recommendations.
- Pagination and infinite scrolling controls; total-result counts or completeness
  guarantees are not defined until result coverage is known.
- Backend implementation, storage, API design, and authentication infrastructure.
- Selection of frontend framework, components, routing, or state architecture.

## Unknowns and unresolved questions

| Topic | Status and decision needed |
| --- | --- |
| External data access | **UNKNOWN:** source, endpoints, request/response contracts, and error semantics. |
| Professional identity | **UNKNOWN:** authoritative identity, deduplication guarantees, and which display information is available or mandatory. |
| Directory eligibility | **UNKNOWN:** definitions of vegan and vegan-friendly, membership rules, and treatment of incomplete affiliation records. |
| Category and filters | **UNKNOWN:** category vocabulary, option source, matching semantics, and whether the proposed two filters fit available information. |
| Verification | **UNKNOWN:** authority, exact meaning, source values, freshness, and mapping to truthful display labels. |
| Result coverage | **UNKNOWN:** dataset size, ordering, partial-result semantics, and whether external pagination is required. Filter results must not be presented as complete across an unseen dataset. |
| Invalid records | **UNKNOWN:** handling of unusable records and how incomplete outcomes are communicated. |
| Product presentation | **UNDECIDED:** directory entry point, language and final copy, visual identity, and which optional card details are useful. |

These unknowns do not prevent reviewing frontend requirements. They block any
implementation or integration decision that depends on an unconfirmed contract.
Clearly labeled illustrative fixtures may support frontend validation; they
must not be treated as evidence of real professional verification or a live API.

## Recommended next step

Use `sdd-design` after specification review to resolve presentation and state-flow
choices and document external boundary decisions. Keep contract-dependent work
explicitly blocked or isolated from confirmed frontend behavior until evidence
is available, then use `sdd-plan`. Do not implement application code in this step.
