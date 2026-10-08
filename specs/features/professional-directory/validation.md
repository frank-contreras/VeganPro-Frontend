# Professional directory prototype validation

Date: 2026-10-07 (America/Santiago).
Scope: the React + Vite fictional-data prototype, its internal source boundary,
and GitHub Pages build/workflow preparation. This is not live-service validation.

## Result

The planned prototype is implemented. Automated checks pass; no outstanding
implementation defect was found in the read-only review. AC-001 through AC-011
pass within the mocked scope. AC-012 remains **UNVERIFIED** overall because native
screen-reader announcements have not been manually exercised, although keyboard,
focus, semantics, live-region updates, contrast, and axe checks pass.

All task implementation and automated completion checks are recorded in
[tasks.md](tasks.md). No publication or remote repository setting was changed.

## Executed checks

| Check | Status | Evidence |
| --- | --- | --- |
| Clean lockfile install | PASS | Final `npm ci` installed 238 packages; npm reported zero audit vulnerabilities at execution time. |
| Lint | PASS | `npm run lint`, including authored tests and configuration, excluding generated outputs. |
| Type checking | PASS | `npm run typecheck`, including test code. |
| Unit/component suite | PASS | `npm test`: 7 files, 18 tests. |
| Root build browser suite | PASS | `npm run test:browser`: 18 Chromium tests. |
| Representative Pages subpath | PASS | `npm run test:browser:subpath`: 18 Chromium tests with the production entry at `/prototype/`. The exceptional-state fixture site remains at its own root URL. |
| Production build | PASS | `npm run build`: static HTML, CSS and JavaScript in `dist/`. |
| Workflow structure | PASS | Ruby YAML parsing and checks for manual-only publish trigger, build dependency, `dist` artifact, and permission isolation; source inspection against official documentation. |
| Whitespace | PASS | Authored untracked files checked directly, in addition to `git diff --check`; untracked source is absent from a normal diff. |
| Review | PASS | Read-only reviewer found no concrete defects; reviewer inspected source and tests but did not independently rerun the suites. |

Environment: macOS ARM64, Node 26.4.0, npm 11.17.0, React 19.3.0, Vite 8.3.3,
Vitest 5.0.3, Playwright 1.64.0 and its Chromium runtime. Node 24 is the documented
target and configured GitHub runner version; actual Node 24 execution is unverified.
Network access, preview-port access, and browser execution required sandbox
escalation. All final checks listed above completed successfully.

## Acceptance evidence

| Criterion | Status | Evidence and limitations |
| --- | --- | --- |
| AC-001 | PASS | App test renders the public purpose/sample notice and six cards without session input; production browser opens and reloads. |
| AC-002 | PASS | Mock-source and page interaction tests cover category alone, affiliation alone, and their AND intersection. |
| AC-003 | PASS | Page tests clear selections to All and restore the complete fictional result. |
| AC-004 | PASS | Card tests cover absent names/categories/images, neutral text, and broken-image fallback reset when the image changes; optional locations render only when supplied. |
| AC-005 | PASS | Card tests cover verified, explicitly not-verified, absent and unrecognized status; textual status remains visible in browser layouts. |
| AC-006 | PASS | Explicitly eligible unknown-affiliation fixture is retained unfiltered and excluded from specific affiliation matches. No eligibility is inferred. |
| AC-007 | PASS | Controlled initial load shows loading without prematurely rendering empty/error. |
| AC-008 | PASS | Controlled empty and no-matches results have distinct messages; no-matches clear restores All and the result. |
| AC-009 | PASS | Initial/update/repeated failures, safe copy, preserved selections/options, current-selection retry and successful recovery are tested. |
| AC-010 | PASS | Reducer and controlled hook tests reject stale success/failure, including between selection and cleanup; execution cleanup handles root Strict Mode and unmount. Old cards disappear immediately on update. |
| AC-011 | PASS | Five states at 320/768/1280px pass overflow checks with long unbroken text. Populated screenshots at all widths and every feedback state at 320px were visually inspected for clipping/overlap. |
| AC-012 | UNVERIFIED | Keyboard filtering/clear/retry, focus preservation/recovery, live-region DOM updates, axe checks and computed contrast pass. Native assistive-technology announcements have no manual evidence. |

FR-001 through FR-012 are supported by the acceptance evidence above. FR-013 is
UNVERIFIED for its native announcement behavior; its automated checks pass.
BR-001 through BR-005 and CON-001 through CON-003 are satisfied within the
illustrative prototype: explicit mock eligibility, independent truthful display
labels, whole-fixture matching, frontend-only boundaries and responsive parity.
This does not establish real eligibility rules or verification semantics.

## Findings and resolved issues

- **FAIL (resolved):** lint initially analyzed generated minified fixture bundles
  after browser runs. Added `.browser-fixtures/` to lint ignores, then reran lint
  and the final suite successfully.
- Test harness corrections: root Strict Mode uses Testing Library's
  `reactStrictMode` option; native select keyboard testing uses typeahead so it
  does not rely on platform-specific menu-opening behavior. These did not require
  relaxing application requirements.
- No remaining concrete defects were identified. Automated tests and review do
  not prove unexecuted integrations or full assistive-technology behavior.

## Deviations and remaining boundaries

No scope expansion was introduced. TypeScript, npm, test tools, English copy and
mock category vocabulary follow the planning decisions. Exceptional browser
states use a separate test entry/build, excluded from `dist/`, rather than public
scenario controls. The mock loads asynchronously without artificial production
delay; deferred doubles exercise observable loading and races deterministically.

- **UNVERIFIED:** native screen-reader announcements, physical devices, browsers
  other than Chromium, Node 24 runtime, GitHub Actions execution and live Pages.
- **UNKNOWN:** real repository/site base, Pages settings/environment availability,
  external data access, identity/deduplication, eligibility, affiliation/category
  vocabulary, verification authority/meaning/freshness, coverage, invalid-record
  policy and image sources.
- **NOT APPLICABLE:** backend integration, ASP.NET Core DTOs/endpoints,
  authentication, registration, admin, persistence, and other excluded features.

Next: exercise native screen-reader announcements and confirm/run the target
GitHub environment when publication is requested. A live-data adapter requires
a separately specified integration change with documented contracts. Keep the
feature artifacts active until remaining validation is resolved and archival is
appropriate; nothing was archived in this implementation.
