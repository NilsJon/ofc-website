# Audit of the existing ÖFC site

Reviewed 6 October 2026. Source: [öfc.se](https://xn--fc-eka.se/), including `/utstallningar/`, `/om-oss/`, `/lankar/` and `/kontakt/`. This is an inventory, not a claim that every item is current.

## Existing navigation and content

| Page | Content found | Treatment |
| --- | --- | --- |
| Home | Venue name, a short announcement for **BYN** by year 5 at Smedstorps school, “last weekend in October”, thanks to Sparbanken Syd, gallery interior photograph. | Preserve the photograph and announcement in the migration record. Do not label BYN as current: its year and exact dates are absent. |
| Utställare | List headed **Utställare 2026** with 16 named people/groups plus “med flera”; separate list of 40 earlier exhibitors without dates, titles or images. | Preserve all names. A dated Storyblok exhibition should only be created once title and exact dates are verified. The historical names remain visible in the archive meanwhile. |
| Om oss | Mission, photography as a physical experience, ÖSTERLEN UNITED wording, Smedstorps Sädesmagasin history, renovation approach, building drawing. | Migrate the lasting mission and building text. Confirm whether ÖSTERLEN UNITED is a continuing programme before keeping that time bound phrase. |
| Länkar | Paris Photo, Svenska Fotoutställningar, Fabriken Bästekille, Fotogalerie Berlin, Fototouren Berlin, Galerie XII, Gylleboverket, Rikstolvan, The Photographers' Gallery and Tokyo Photographic Art Museum. | Do not reproduce as a primary navigation item. Confirm which are still meaningful partners before placing selected links in About. |
| Kontakt | `magasinet@smedstorp.se`, `070 527 60 91`, Gårdlösavägen 49, 273 98 Smedstorp, map link. | Seed visit information from these published details. Confirm before launch. |

The old site links to Instagram, but the handle differs between the home and about page (`sadesmagasinet_smedstorp` versus `sadesmagasinet`). Confirm the intended account.

## Information needing confirmation

- Actual current and future exhibitions, exact dates, vernissage dates, titles, photographs, alt text and image credits.
- Regular and exception opening hours; none were found on the inspected public pages.
- Whether the 2026 exhibitor list is a schedule, historical list, or simply a roster. It cannot drive date based state without dates.
- Whether the BYN announcement belongs to 2025, 2026 or another year.
- Years, exhibition titles and image rights for the older exhibitor list.
- Which external links are active affiliations and which are general recommendations.
- Correct Instagram URL and whether the published contact details remain current.

## Assets retained for the prototype

- `public/images/osterlen-current-site.jpg`: gallery interior photo from the existing homepage (`/wp-content/uploads/2022/03/osterlen2.jpg`). It represents the venue, not a current exhibition.
- `public/images/sadesmagasinet-ritning.jpg`: drawing from the existing About page (`/wp-content/uploads/2022/03/Smedstorps-Sadesmagasin-Ritningar-1.jpg`).

Confirm reproduction rights before public launch, particularly for photography credited to third parties. No image has been invented for an older exhibition.

## Proposed routes and components

| Route | Purpose | Main source |
| --- | --- | --- |
| `/` | Current show when dates establish one, upcoming shows, venue and visit details | Exhibitions + Home + Site settings |
| `/utstallningar/` | Current and upcoming listings | Exhibitions |
| `/utstallningar/[slug]/` | Individual exhibition | Exhibition |
| `/arkiv/` | Past exhibitions plus preserved undated names | Exhibitions + legacy inventory |
| `/om-ofc/` | Mission and building | About |
| `/besok/` | Address, hours and contact | Site settings |

`BaseLayout.astro` owns header, navigation, footer and metadata. `ExhibitionCard.astro` and `RichText.astro` handle repeated presentation. `src/lib/content.ts` owns Storyblok queries, types and image URLs; `src/lib/dates.ts` owns exhibition state. The editor cannot rearrange the layouts.

Old `/om-oss/`, `/kontakt/` and `/lankar/` URLs redirect to the relevant new route. `/utstallningar/` is retained.
