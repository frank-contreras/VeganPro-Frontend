# Professional directory implementation plan

Status: T-01 through T-12 implemented with evidence below. Native screen-reader and live-hosting verification remain open; see [validation.md](validation.md).
Sources: [specification](spec.md), [design](design.md), and the user's prototype
constraints: React + Vite, mocked data, and GitHub Pages publishability.

## Deliverable and planning decisions

Deliver a public, single-page frontend prototype with fictional professionals
behind the designed source boundary. A prominent sample-data notice identifies
all displayed people, affiliation, and verification values as illustrative.
No API integration, backend contract, authentication, or persistence is included.

- Use React + Vite with TypeScript and plain CSS. TypeScript helps enforce the
  internal result/state distinctions; its types are not external schemas.
- Use npm and a committed lockfile for reproducible installs. Select compatible
  stable React/Vite/Node and tooling versions during bootstrap, check their
  requirements, and record them rather than fixing unverified versions here.
- Use Vitest, React Testing Library, user-event, and a DOM test environment for
  behavior tests; Playwright for real-browser layout/keyboard/build checks and
  an axe-based check for automatable accessibility issues. These are development
  tools, not runtime dependencies. Avoid a router, UI kit, query library, or store.
- Show the directory at the site's base URL with no nested client routes. Use
  local bundled assets or decorative fallbacks; no remote image service is needed.
- Use English prototype copy consistent with the current spec and set document
  language accordingly. Final localization and visual identity remain deferred.
- Category labels are explicitly fictional prototype vocabulary, not confirmed
  domain taxonomy. Record the chosen mock vocabulary with fixture documentation.
- Prepare static build/deployment files and instructions; actual publication is
  a distinct operation, not a prerequisite for completing the implementation.

These decisions resolve bootstrap choices left open by the design for this
prototype. They do not resolve any UNKNOWN live-data contract.

## Ordered tasks

Tasks are dependency-ordered. Each checkbox means implementation plus its stated
validation is complete, not merely that files have been created. Run narrow
checks while working; run the combined suite once at the final gate.

### T-01 — Bootstrap the React + Vite workspace

- [x] Complete
- **Depends on:** none.
- **Trace:** FR-001; prototype/toolchain constraint.
- **Areas:** package manifest/lockfile, Vite/TypeScript/ESLint configuration,
  application entry, HTML document, ignore rules, project README.
- **Result:** minimal runnable React shell with document language and title,
  Strict Mode enabled, and dev/build/preview/lint/typecheck commands. Remove
  scaffold branding/demo behavior. Preserve existing guidance and SDD files.
- **Validate / done:** clean npm install using the lockfile succeeds; typecheck,
  lint, and production build pass; local shell loads. Document the selected Node
  version and commands. No feature logic or deployment is required yet.
- **Evidence:** PASS: clean `npm ci`, typecheck, lint, production build, served HTML and Chromium entry/reload. React 19.3.0, Vite 8.3.3; target Node 24 LTS, local Node 26.4.0.

### T-02 — Establish the behavioral test harness

- [x] Complete
- **Depends on:** T-01.
- **Trace:** design testing strategy; AC-001 through AC-012 validation support.
- **Areas:** test scripts/configuration, shared component setup, browser runner
  configuration, test helpers.
- **Result:** unit/component tests and browser tests run non-interactively. Define
  a production-build preview target for browser checks, controlled deferred source
  helpers, and DOM cleanup. Keep scenario injection at the internal source boundary.
- **Validate / done:** one meaningful shell smoke test passes in the component
  harness and real browser; lint/typecheck include test code. No speculative HTTP
  mocks, arbitrary delay-based assertions, or production demo controls are added.
- **Evidence:** PASS: Vitest shell test, Chromium production-build entry/reload, test-inclusive typecheck and lint. Chromium installed in ignored `.playwright/`.

### T-03 — Define the internal source and fictional dataset

- [x] Complete
- **Depends on:** T-02.
- **Trace:** FR-002, FR-004, FR-005, FR-006; BR-001 through BR-005; AC-002, AC-004, AC-005, AC-006.
- **Areas:** feature presentation model, mock source, fixture data and source tests.
- **Result:** an asynchronous mock source supplies stable option vocabulary and
  eligible sample cards for a captured selection. Filter the entire mock dataset
  by category and affiliation with AND semantics; preserve order and stable keys.
  Include both affiliations, unknown affiliation, all verification presentations,
  missing display information, optional images/location, and a combination with
  no matches. Eligibility is explicit fixture setup, never inferred.
- **Validate / done:** tests cover each filter alone, intersections, All, stable
  options across empty results, and unknown affiliation exclusion from specific
  matches. Document fictional vocabulary and records. Test-only doubles support
  empty, delayed, failed, and out-of-order outcomes without becoming an API schema.
- **Evidence:** PASS: 2 source tests verify all/individual/AND matching, stable options and keys, explicit eligibility, and unknown affiliation exclusion; typecheck/lint passed.

### T-04 — Build the feature state machine and async controller

- [x] Complete
- **Depends on:** T-03.
- **Trace:** FR-007, FR-008, FR-010, FR-011; AC-007, AC-009, AC-010.
- **Areas:** feature reducer, selectors, `useProfessionalDirectory`, controller tests.
- **Result:** one owner for selections, operation revision, status, and ready
  vocabulary. Selection/clear/retry atomically begin pending operations. Discard
  previous cards while pending. Use revision checks and individual execution
  cleanup; retries retain selections and superseded cancellation is not an error.
- **Validate / done:** controlled tests cover success/failure, retry with identical
  selections, options retained after readiness, rapid changes, old success and
  old rejection, completion before cleanup, unmount, and Strict Mode repeated
  setup. Assert visible controller outcomes rather than Effect invocation counts.
- **Evidence:** PASS: 2 reducer and 4 controller tests verify atomic revisions, stale success/rejection, retries/options, unmount, synchronous source failure and root Strict Mode cleanup. Typecheck/lint passed.

### T-05 — Deliver the public listing and truthful cards

- [x] Complete
- **Depends on:** T-04.
- **Trace:** FR-001, FR-002, FR-005, FR-006; AC-001, AC-004, AC-005, AC-006.
- **Areas:** page composition, results region, list/cards/badge, application source
  wiring, component tests.
- **Result:** directory purpose and sample-data notice are visible without a
  sign-in gate. Render one semantic card per accepted record with unavailable
  fallbacks, independent affiliation/verification labels, optional location,
  and resilient optional images. Treat unknown/unrecognized presentation status
  conservatively. Do not add detail links or booking actions.
- **Validate / done:** interaction-free page tests confirm card identity/content,
  missing information, unknown status, no real verification claims, and broken
  image fallback/reset on changed image. All controls/content use accessible
  semantics from their introduction; finish visual styling in T-08.
- **Evidence:** PASS: public page renders six sample cards; 3 card tests cover missing labels, explicit/unknown verification and failed-image replacement. Typecheck/lint passed.

### T-06 — Connect basic filters and clear behavior

- [x] Complete
- **Depends on:** T-05.
- **Trace:** FR-003, FR-004, FR-008; AC-002, AC-003, AC-006, AC-010.
- **Areas:** controlled native filter controls, page callbacks, component tests.
- **Result:** category and affiliation default to All, apply directly, and combine
  with AND. Initial controls are disabled until vocabulary is ready; later
  pending/error outcomes preserve selections and options. Keep filter controls
  mounted and clear usable; no-op clear when already unfiltered is acceptable.
- **Validate / done:** user-level tests select each filter and both, clear active
  filters, and change filters rapidly. Confirm options do not shrink to current
  results and old cards disappear immediately while new results are pending.
- **Evidence:** PASS: 2 page interaction tests cover category/affiliation/AND, clear, retained vocabulary, disabled initial filters and immediate removal of old cards. Typecheck/lint passed.

### T-07 — Complete feedback and recovery behavior

- [x] Complete
- **Depends on:** T-06.
- **Trace:** FR-007 through FR-011; AC-007, AC-008, AC-009, AC-010.
- **Areas:** feedback branches, retry/clear wiring, results selector, component tests.
- **Result:** exclusive loading, cards, directory-empty, no-matches, and error
  branches. No-matches offers clear; failures offer Retry with current selections;
  active-filter clear remains available during errors. No technical errors leak.
- **Validate / done:** source-double tests delay initial load, return empty with
  and without filters, fail initial/update/retry operations, and recover. Confirm
  no premature empty state, failure is never empty, latest-selection outcome wins,
  and options survive failure. Test doubles—not public scenario controls—exercise
  exceptional states.
- **Evidence:** PASS: 4 recovery tests cover delayed loading, distinct empty/no-matches, clear, initial/update/repeated errors, retry preservation, safe error copy and focus recovery. Typecheck/lint passed.

### T-08 — Apply responsive presentation

- [x] Complete
- **Depends on:** T-07.
- **Trace:** FR-012, CON-003; AC-011.
- **Areas:** feature/global CSS, local optional assets, browser layout tests.
- **Result:** mobile-first filters and cards, expanding grid where space permits,
  shrinkable controls and wrapping long text. Preserve verification and actions
  in every state. Use contrast-compatible visual tokens, no fixed card heights,
  and reduced-motion handling if any animation is introduced.
- **Validate / done:** browser checks at 320, 768, and 1280 CSS pixels cover long
  text and all result states. Assert no page overflow; inspect screenshots for
  clipping and overlap that geometry assertions can miss. Record actual browser
  coverage; viewport simulation does not establish physical-device verification.
- **Evidence:** PASS: Chromium tested all five states at 320/768/1280px with long unbroken text; all 15 overflow/axe checks passed. Inspected populated screenshots at all three widths and every feedback state at 320px; no clipping/overlap found. Tests use an isolated fixture build outside `dist/`.

### T-09 — Verify accessibility and predictable focus

- [x] Complete
- **Depends on:** T-08.
- **Trace:** FR-013; AC-012.
- **Areas:** stable status/results shell, feedback focus handling, component/browser
  accessibility tests, validation notes.
- **Result:** labeled selects, semantic cards, visible keyboard focus, persistent
  polite status region outside busy content, and no duplicate announcements.
  Preserve focus on mounted controls; move focus predictably to the stable results
  heading when a focused recovery button is about to disappear, never on async
  completion. Preserve initial-failure access to Retry.
- **Validate / done:** keyboard flows, focus recovery, role/name queries, live
  region updates, and axe checks pass for each state. Check text/control/focus
  contrast against the design thresholds. Attempt a manual screen-reader check;
  if unavailable, explicitly mark announcements UNVERIFIED rather than claiming
  automated checks prove them. Automated accessibility cannot certify all WCAG.
- **Evidence:** PASS: 15 state/viewport axe checks, 2 Chromium keyboard/focus tests, component focus/status tests, computed text/control/focus contrast checks. Native select typeahead is used for cross-platform keyboard testing. Native screen-reader announcements remain UNVERIFIED: no interactive assistive-technology session was available; automated checks do not prove announcements.

### T-10 — Make the production build work under a Pages base path

- [x] Complete
- **Depends on:** T-09.
- **Trace:** GitHub Pages deliverable; AC-001, AC-011, AC-012 regression checks.
- **Areas:** Vite base configuration, asset references, production-preview browser
  smoke tests, README deployment-path notes.
- **Result:** deployable `dist/` with the directory at the configured site base.
  Explicitly support `/` for root/custom-domain sites and `/<repository>/` for
  project Pages. Derive the real path from confirmed hosting configuration, not
  the local folder name. Use imported assets or base-aware public references;
  avoid hard-coded root URLs. No router or SPA fallback is needed for this page.
- **Validate / done:** build/preview at both `/` and a representative repository
  subpath; directly open and reload that base URL in a browser. Assert assets
  resolve without 404s, cards/filters work, and no backend requests are made.
  A representative subpath validates the mechanism, not the unknown live URL.
- **Evidence:** PASS: root production entry/filter/reload and 3 subpath entry/keyboard checks at `/prototype/`; asset responses succeeded and no fetch/XHR requests were made. Base is configurable; real target remains UNKNOWN.

### T-11 — Prepare CI and an explicit Pages deployment workflow

- [x] Complete
- **Depends on:** T-10.
- **Trace:** automated validation and GitHub Pages publishability constraints.
- **Areas:** GitHub Actions workflow files and publication instructions.
- **Result:** CI on pull requests runs reproducible install, lint/typecheck,
  component tests, browser checks, and build. Prepare a manually triggered Pages
  workflow that validates, configures the confirmed base, uploads `dist/`, and
  deploys only after validation succeeds. Keep publish credentials/permissions
  confined to the deploy job. Document required Pages repository settings and
  the deployment environment. Check current official action versions when writing
  the workflow. Do not enable remote settings or publish as part of this task.
- **Validate / done:** inspect workflow syntax, job dependencies and least-needed
  permissions; run its validation/build commands locally. Confirm the artifact
  path. Actual Actions execution, environment rules, account/repository Pages
  availability and live deployment stay UNVERIFIED until run on GitHub.
- **Evidence:** PASS: both workflow YAML files parse; inspected/manual-only trigger, build-to-deploy dependency, `dist` artifact and write-permission isolation checked. Clean install, lint/typecheck, all 18 component/unit tests, root/subpath browser commands and build run locally. Current action versions checked against official docs. Actual Actions/Pages execution remains UNVERIFIED.

### T-12 — Validate the complete prototype and document handoff

- [x] Complete
- **Depends on:** T-11.
- **Trace:** AC-001 through AC-012; all prototype constraints.
- **Areas:** existing tests as needed, README, feature validation report through
  `sdd-validate`; no new behavior.
- **Result:** concise instructions for install/dev/test/build/preview and Pages
  publishing, sample-data limitations, and a criterion-by-criterion validation
  record. Keep external contracts UNKNOWN and identify manual/integration gaps.
- **Validate / done:** run lint, typecheck, unit/component tests, browser tests,
  and production build against final code. Map evidence to every AC. Report
  PASS/FAIL/UNVERIFIED/NOT APPLICABLE explicitly, resolve automated failures, and
  distinguish publishable artifact from published website. Archive only after
  validation and durable knowledge promotion; do not archive during implementation.
- **Evidence:** PASS: final clean install, lint, typecheck, 18 unit/component tests, 18 Chromium tests at root and 18 at `/prototype/`, production build, workflow structure and authored-file whitespace. Read-only review found no concrete defects. [Validation report](validation.md) maps every AC; AC-012/native announcements remains UNVERIFIED, as do Node 24 execution, physical devices, Actions and live Pages. README documents commands, fixture limitations and publishing.

## Acceptance coverage index

| Criteria | Primary tasks |
| --- | --- |
| AC-001 | T-05, T-10, T-12 |
| AC-002, AC-003 | T-03, T-06, T-12 |
| AC-004, AC-005, AC-006 | T-03, T-05, T-06, T-12 |
| AC-007, AC-008, AC-009 | T-04, T-07, T-12 |
| AC-010 | T-04, T-06, T-07, T-12 |
| AC-011 | T-08, T-10, T-12 |
| AC-012 | T-09, T-12 |

## Live integration gates and deferred work

There is no backend/API task in this prototype plan. A later integration change
requires evidence for data access/error semantics, identity/deduplication,
eligibility, affiliation/category vocabulary, verification authority/meaning,
coverage/filter execution, invalid-record handling, and image-source policy.
Do not translate fixture types into presumed wire contracts. Revisit spec/design
if confirmed contracts cannot support the proposed behavior.

Repository slug, Pages site type, publication branch/environment and remote
settings remain UNKNOWN. These block live publication, not frontend development
or representative base-path tests. Do not silently select a remote destination.

Detail pages, pagination, maps, search, accounts, booking, ratings, analytics,
localization infrastructure, and URL/persisted filters remain outside this plan.

## Guidance consulted and next step

Context7 supplied current Vite guidance for
[Pages base paths and static deployment](https://vite.dev/guide/static-deploy.html#github-pages),
[base-aware assets](https://vite.dev/guide/build.html#public-base-path), and
[build preview](https://vite.dev/guide/cli.html#vite-preview).
GitHub's [custom Pages workflow guidance](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
supports artifact upload, deploy-job dependencies, the `github-pages` environment,
and deployment permissions `pages: write` and `id-token: write`.

Implementation is complete for the mocked prototype; consult [validation.md](validation.md)
for evidence and unverified items. Application code, tests, configuration, README,
workflow preparation and SDD tracking changed. No remote settings or deployment
were changed. Resolve manual accessibility checks before claiming complete
validation; do not archive while those checks remain open.
