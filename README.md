# VeganPro frontend

A frontend-only professional directory prototype using React, Vite, TypeScript,
and plain CSS. Application state and sample data stay in the browser.

## Public languages and sample portraits

The public UI starts in Spanish (`es`). Use the header language selector to switch
between Spanish and English without resetting filters, results, loading or
recovery. Language selection stays in memory; reloading starts Spanish again.
Document language, title, description and accessible feedback follow the selected
language. Brazilian Portuguese and Haitian Creole are future catalog additions,
not available translations yet.

The hero action reaches the directory on the same page. The hero and footer
identify the co-creation prototype and fictional sample data. All five named samples have
bundled fictional portrait illustrations; the intentionally incomplete sample
retains a neutral fallback, as do missing or failed portraits. No remote portrait service or live professional verification
is involved. Asset provenance and generation prompts are in
[fixture documentation](src/features/professional-directory/fixtures.md).

## Development

Use Node 24 LTS (`.nvmrc`); the initial local environment uses Node 26.4.0.
Dependency versions are recorded in `package-lock.json`.

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm run build
npm run preview
```

## Automated checks

Install the Chromium test runtime once into the ignored local directory:

```sh
PLAYWRIGHT_BROWSERS_PATH=.playwright npx playwright install chromium
npm test
npm run test:browser
npm run test:browser:subpath
```

Browser tests build the real prototype plus a separate test-only fixture site.
Exceptional states and long text are injected through the source boundary in
that isolated site; fixture controls and failure scenarios never ship in `dist/`.
Tests cover 320/768/1280 pixel viewports, keyboard focus, automated accessibility,
and representative Pages base-path loading. Native screen-reader announcements
still require manual verification.

## Production build and GitHub Pages paths

The static output is `dist/`. The directory uses one entry at the site's base
URL; no nested client routes or SPA fallback are required.

```sh
# Root/user Pages or a custom domain
VITE_BASE_PATH=/ npm run build
npm run preview

# Project Pages: replace this example with the confirmed GitHub repository name
VITE_BASE_PATH=/your-confirmed-repository/ npm run build
npm run preview
```

Open the configured base URL, including its trailing slash, when previewing a
project site. Vite's asset references use that build-time base. `/prototype/` in
the browser test command is a representative test path, not a publication target.

The actual GitHub repository, Pages site type, and live URL remain unconfirmed.
This prototype is prepared for publishing, not already deployed.

## Publishing the prototype

Once the repository destination and hosting path are confirmed:

1. Push the reviewed source and lockfile to that repository.
2. In repository Settings → Pages, select GitHub Actions as the build source.
3. Ensure the `github-pages` environment permits the intended publication branch.
4. Run **Publish directory prototype** manually from Actions and provide the
   confirmed base path (`/` or `/repository-name/`, including the trailing slash).
5. The workflow validates both root and representative project paths, builds the
   selected target, uploads only `dist/`, then deploys the validated artifact.
6. Open the resulting Pages URL and verify reload, assets, and filter behavior.

Pull requests run the separate validation workflow without deployment permissions.
Publication is never triggered automatically by a pull request. Workflow execution,
Pages permissions/settings, target Node 24 execution, and the live URL have not
yet been verified on GitHub. Local checks were run on Node 26.4.0 and Chromium.

Workflow preparation follows the official
[Pages workflow guide](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
and current [checkout](https://github.com/actions/checkout) and
[setup-node](https://github.com/actions/setup-node) usage documentation.

## Architecture and limitations

`ProfessionalDirectoryPage` owns a feature-local controller; UI components receive
controlled state and actions. `DirectorySource` in the feature's `model.ts` is an
internal asynchronous presentation boundary. The mock implementation filters the
entire fictional dataset; components never fetch data or interpret backend values.
Samples and illustrative vocabulary are documented in the feature's `fixtures.md`.

External data access, eligibility, identity, verification authority/meaning, real
filter vocabulary, result coverage, invalid-record policy and image sources remain
UNKNOWN. Fixture types are not ASP.NET Core DTOs. No backend, authentication,
registration, administration, booking, or professional-detail capability is present.

The directory will use fictional sample professionals, affiliations, categories,
and verification statuses. No backend or authentication integration exists.

See [repository guidance](AGENTS.md) and the [SDD workspace](specs/README.md).
