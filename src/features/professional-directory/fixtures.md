# Prototype fixtures

All six people are fictional. Nutrition, Fitness, and Wellbeing are illustrative
prototype categories, not a confirmed professional taxonomy. Vegan and
vegan-friendly are sample display choices, not confirmed eligibility definitions.
Every verification status is simulated and provides no evidence of credentials,
licensing, endorsement, or real verification.

Fixture eligibility is explicit. Robin demonstrates eligible membership with
unknown displayed affiliation; another record demonstrates unavailable name and
category. Fitness plus vegan-friendly has no matches. Tests supply absent/failed
images and controlled delayed, empty, failing, and out-of-order sources.

The mock source filters the whole sample collection. Its types describe frontend
presentation needs, never ASP.NET Core DTOs, endpoints, or persistence models.

## Localized display and bundled portraits

Stable filter values, fixture categoryValue, keys, affiliation/status identifiers
and eligibility are language-independent. Optional label keys translate only
controlled sample vocabulary and locations; arbitrary supplied text is unchanged.
Spanish is the public default; English can be selected. Locale lives in memory
and resets to Spanish on reload, independently of directory state.

All five named samples have fictional portrait illustrations generated with the
built-in imagegen tool: Ada, Leo and Maya on 2026-10-07; Noah and Robin on
2026-10-08. No real-person image or identity reference
was supplied. Original outputs remain in the generation Library; this repository
bundles 256 × 256 JPEG exports at `assets/portraits/{ada,leo,maya,noah,robin}.jpg`, imported
through `samplePortraits.ts`. Only the intentionally incomplete record has no image.
Portraits are decorative, not evidence of affiliation, credentials or verification.
No runtime remote image service is used.

Generation prompts (built-in tool, one new asset per prompt):

Shared prompt: “Use case: illustration-story. Asset type: small profile portrait
for a fictional sample directory. Create a square hand-painted editorial portrait
illustration, centered head and shoulders with generous margins for circular
crop, soft sage background, muted natural colors, warm approachable expression,
clearly illustrated rather than photographic. Fictional adult, no real person
reference. No text, credentials, badges, logos, watermark or medical equipment.”

- Ada: “Subject: fictional woman with warm light-brown skin, dark wavy
  shoulder-length hair, cream blouse.”
- Leo: “Subject: fictional man with light skin, short curly brown hair,
  subtle beard, rust-colored shirt.”
- Maya: “Subject: fictional woman with dark skin, short natural coily hair,
  sage shirt.”

- Noah: “Subject: fictional man with medium-brown skin, short dark wavy hair,
  clean-shaven face, muted blue shirt.”
- Robin: “Subject: fictional androgynous adult with light olive skin, short
  auburn hair, round glasses, ochre shirt.”

Each final prompt is the shared prompt followed by its subject sentence.
The hero and footer disclose fictional sample data and illustrative portraits
in both supported languages. Tests retain absent and failed-image scenarios.
