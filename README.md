# Station Smedstorp — temporary site

The public site currently presents **Station Smedstorp**, a proposed meeting place centred on the historic warehouse buildings. Its pages are `/`, `/foreningen/` and `/magasinen/`. No contact details or opening hours are published in this version. The supplied Swedish purpose statement is kept verbatim in [`src/lib/temporary-site.ts`](src/lib/temporary-site.ts); the surrounding copy is a concise summary of that statement.

The previous ÖFC site is saved in Git tag `ofc-original-2026-10-11`. The Storyblok space, schema, and draft content have not been changed. The temporary pages read no Storyblok content, so publishing an old ÖFC draft cannot put exhibition copy onto this site. To restore ÖFC later, revert the temporary-site commit on `main` and push; the tag provides an exact reference for the prior version.

The shareable deployment is currently the Git-connected [Cloudflare Worker](https://ofc-website.nils-stridbeck.workers.dev/). The temporary build uses this URL for metadata and is marked `noindex`. The original ÖFC setup notes below remain for restoration work.

---

# Österlens Fotograficentrum (original site notes)

An Astro website for ÖFC. The public build is static. Storyblok holds structured exhibition, About and visit content; page layout stays in code so an editor can update content without changing the design.

The [current site audit](docs/current-site-audit.md) records what was found and what still needs confirmation. The [content model](docs/content-model.md) explains the schema and routes.

## Local development

Requires Node.js 22 or newer.

```sh
npm ci
cp .env.example .env
npm run check
npm test
npm run build
```

Set `STORYBLOK_DELIVERY_API_TOKEN` in `.env` to a **public delivery token** for a published build. Without one, the site still builds with verified venue facts and an honest empty exhibition state. `STORYBLOK_SPACE_ID` identifies the existing EU space for schema management. Keep `.env` private; it is ignored by Git.

Start the development server in background mode, as required by this repository:

```sh
npm run astro -- dev --background
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
```

## Storyblok setup in the existing EU space

1. Obtain the numeric ID of the **existing** space, a public delivery token for production, a preview delivery token for draft preview, and a personal Management API token for one-time schema/content setup. Storyblok places personal tokens under **My account → Account settings → Personal access tokens**. Limit this token to the existing space with **Components** and **Stories** read/write permissions. Do not commit any token.
2. Set `STORYBLOK_SPACE_ID` and `STORYBLOK_MANAGEMENT_TOKEN` in the ignored `.env` file or your shell. Run `npm run schema:validate`, `npm run schema:push`, then `npm run cms:seed`. The schema, starter stories, exhibitions folder and older exhibitor entries are created through supported Storyblok tooling/API. The seed script keeps existing stories and creates missing ones as drafts; it does not create a space or replace editorial content. It may convert Storyblok's unpublished generic demo `home` story when that story contains only demo blocks.
3. Review and publish the `home`, `om-ofc` and `installningar` stories when the text and contact details are confirmed. Add exhibitions under the `utstallningar` folder.
4. Set a Visual Editor environment to a reachable HTTPS preview URL once the preview server is deployed. The seed script sets the real paths of the created `home` and `om-ofc` stories to `/` and `/om-ofc/`; created exhibition stories should use `/utstallningar/<slug>/`. Storyblok requires HTTPS for its preview iframe.

For live draft preview, run a separate preview deployment with `STORYBLOK_PREVIEW=1` and a **preview delivery token** in `STORYBLOK_PREVIEW_DELIVERY_API_TOKEN`. The preview build uses the official Astro integration's live preview bridge and Node SSR; the public build remains static. Locally, `npm run dev:preview` starts Astro in background mode with a self-signed HTTPS certificate. Accept the browser's certificate warning for the local preview URL before opening it inside Storyblok's Visual Editor; the iframe must be able to reach that URL. A deployed preview should use a normal trusted HTTPS certificate. Keep the preview environment private because it renders unpublished content. A preview build can be checked with `STORYBLOK_PREVIEW=1 npm run build`.

Storyblok schema changes live in [`src/schema/schema.ts`](src/schema/schema.ts). Re-run validation and push when fields change. The CLI prints a diff before applying it. Avoid `--delete` unless existing space components have been examined. Storyblok's [schema CLI documentation](https://www.storyblok.com/docs/tooling/cli/schema-push) describes rollback and migration support.

## Editing content

To create an exhibition, open **Utställningar** in Storyblok, add an **Utställning**, and enter title, artist names, start and end dates. Add a short introduction and photographs. Set meaningful alt text on each image; add credits if needed. Preview the page in the Visual Editor, then publish it.

The dates determine where it appears automatically: before the start day it is upcoming, from start through end day it is current, and after the end day it enters the archive. The editor does not move it between lists. For the public static site, publication becomes visible after the next deployment build.

To change practical details, edit the single **Besöksinformation** story. Opening hours are currently unconfirmed and intentionally blank. The site shows a clear message until they are entered. Older names can be completed in **Arkiv** as facts become available.

## Deployment

The simplest public target is static Cloudflare Pages: build command `npm run build`, output directory `dist`, Node.js 22+, and `STORYBLOK_DELIVERY_API_TOKEN` set to the public token. Connect the existing GitHub repository to Pages and add `xn--fc-eka.se` / `öfc.se` as the custom domain through Cloudflare. No Cloudflare adapter or runtime secret is required for the public site. A separate protected Node preview deployment is needed if editors require live SSR draft preview outside local development.

Cloudflare currently recommends Workers for new Astro projects, while [Cloudflare's Pages guide](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/) still supports a static `dist` build. Pages is chosen here because the public site has no runtime routes and its [deploy hooks](https://developers.cloudflare.com/pages/configuration/deploy-hooks/) fit Storyblok publishing. If the project later needs an on-demand Cloudflare preview or server features, revisit Workers with the Astro Cloudflare adapter; the current adapter is [Workers-only](https://docs.astro.build/en/guides/integrations-guide/cloudflare/).

Once Cloudflare Pages is connected, create a deploy hook and configure a Storyblok publish webhook to call it. Store the hook URL in Storyblok and as the GitHub Actions secret `CLOUDFLARE_DEPLOY_HOOK_URL`, never in Git. Publishing then triggers a fresh static build. The included daily workflow also rebuilds at 03:15 UTC so exhibitions change state on the correct date even when nobody publishes content. The static build must have the public token and should not receive the preview or Management API token.

The old `/om-oss/`, `/kontakt/` and `/lankar/` routes redirect to the corresponding new pages. Verify the domain and all source content before replacing the current website.
