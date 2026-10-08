# Storyblok content model

The canonical schema is [`src/schema/schema.ts`](../src/schema/schema.ts), managed with Storyblok's supported `@storyblok/schema` and CLI. It contains no generic page builder. Run `npm run schema:validate`, then `npm run schema:push` with the **existing** EU space ID and a Management API personal access token. The push command diffs the remote schema; do not use `--delete` unless existing components have been reviewed.

| Content type | Story location | Editor fields | Layout rule |
| --- | --- | --- | --- |
| `home` | `home` | Short introduction and venue image | One fixed homepage; the current show is derived from dates. |
| `exhibition` | `utstallningar/<slug>` | Title, artist(s), start/end, optional vernissage, summary, body, hero image, credit, gallery images, external URL | One fixed exhibition template. Gallery only accepts `gallery_image`. |
| `gallery_image` | Nested within an exhibition | Image, caption, credit | No layout choices. Asset alt text should describe the image. |
| `about` | `om-ofc` | Introduction, background, building text, image | One fixed About template. |
| `site_settings` | `installningar` | Address, email, phone, hours, map and Instagram URLs, optional announcement | One fixed global entry used by the header/footer/visit page. |
| `archive_entry` | `arkiv/<slug>` | Artist, optional title, year and image | A fixed older exhibitor record; no invented dates are required. |

Storyblok story slugs are the URL slugs; they are not a separate editable field in a block. Exhibition `start_date` and `end_date` are required in the schema so new content can be scheduled safely. Old names with no date use `archive_entry` until researched. The seed script populates them as draft stories without replacing existing entries.

The site's date comparison uses the Swedish calendar day, with both start and end days inclusive. An exhibition with incomplete dates is excluded from current/upcoming and remains unscheduled. Publishing a new exhibition with dates moves it between the lists after a static rebuild. The included daily GitHub Actions workflow triggers another build after midnight in Sweden when the Cloudflare deploy hook secret is configured.

## Visual Editor and publishing

The official Astro integration provides `storyblokEditable()` markers on the homepage, About content, exhibition body and gallery items. The preview build uses `STORYBLOK_PREVIEW=1`, draft content and SSR, as required by the current Storyblok live preview integration. The public build remains static and uses published content. The preview token belongs only on the private preview server/build; the production build needs a public delivery token. Never put a Management API token in the site runtime.

Storyblok's Visual Editor requires HTTPS. Set its preview environment to a reachable HTTPS preview server after deployment. The seed script creates the singleton stories, folders and undated archive drafts through the Management API and sets their preview paths. It also converts Storyblok's unpublished generic demo `home` story if it still contains only default demo blocks. Newly created exhibition stories should use `/utstallningar/<slug>/` as their real path. All seed content remains draft until an editor verifies and publishes it.

## Editorial safeguards

- No arbitrary columns, spacers, colors, typography or reusable layout sections exist in the schema.
- Main and gallery images maintain their aspect ratios. Image alt text, caption and credit remain separate editorial data.
- The frontend handles missing optional fields. Missing opening hours are stated honestly instead of invented.
- The static build reads published stories only. Changes on the public site need a rebuild; configure a Storyblok publish webhook to a Cloudflare deploy hook after hosting is connected.
