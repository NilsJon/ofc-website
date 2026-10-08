import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { loadEnvFile } from 'node:process';

try { loadEnvFile('.env'); } catch { /* Shell environment is also supported. */ }

const spaceId = process.env.STORYBLOK_SPACE_ID;
const token = process.env.STORYBLOK_MANAGEMENT_TOKEN;
if (!spaceId || !token) {
  console.error('Set STORYBLOK_SPACE_ID and STORYBLOK_MANAGEMENT_TOKEN in the environment.');
  process.exit(1);
}

const endpoint = `https://mapi.storyblok.com/v1/spaces/${spaceId}/stories`;
let previousRequest = 0;
async function request(path = '', options = {}) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const pause = Math.max(0, 220 - (Date.now() - previousRequest));
    if (pause) await new Promise((resolve) => setTimeout(resolve, pause));
    previousRequest = Date.now();
    const response = await fetch(`${endpoint}${path}`, {
      ...options,
      headers: { Authorization: token, 'Content-Type': 'application/json' },
    });
    if (response.status === 429) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      continue;
    }
    if (!response.ok) throw new Error(`Storyblok ${response.status}: ${await response.text()}`);
    return response.json();
  }
  throw new Error('Storyblok rate limit remained active after retries.');
}

const existing = [];
for (let page = 1; ; page += 1) {
  const result = await request(`?per_page=100&page=${page}`);
  existing.push(...result.stories);
  if (result.stories.length < 100) break;
}

async function createMissing(fullSlug, story) {
  const found = existing.find((entry) => entry.full_slug === fullSlug || entry.slug === fullSlug);
  if (found) {
    console.log(`Keeping existing ${fullSlug}`);
    return found;
  }
  const result = await request('', { method: 'POST', body: JSON.stringify({ story }) });
  existing.push(result.story);
  console.log(`Created draft ${fullSlug}`);
  return result.story;
}

const homeIntroduction = 'Här på Österlen har vi utvecklat en plats för fotografi där du kan se, uppleva och ta del av fotografi och samtidigt möta fotograferna bakom bilderna.';
const richText = (...paragraphs) => ({ type: 'doc', content: paragraphs.map((text) => ({ type: 'paragraph', content: [{ type: 'text', text }] })) });
const homeStory = await createMissing('home', {
  name: 'Startsida', slug: 'home', path: '/', content: {
    _uid: randomUUID(), component: 'home',
    introduction: homeIntroduction,
  },
});
const homeDetail = (await request(`/${homeStory.id}`)).story;
const starterBlocks = homeDetail.content?.body;
if (homeDetail.content?.component === 'page' && !homeDetail.published && Array.isArray(starterBlocks) && starterBlocks.every((block) => ['teaser', 'grid'].includes(block.component))) {
  await request(`/${homeStory.id}`, {
    method: 'PUT',
    body: JSON.stringify({ story: {
      name: 'Startsida', slug: 'home', path: '/',
      content: { _uid: homeDetail.content._uid ?? randomUUID(), component: 'home', introduction: homeIntroduction },
    } }),
  });
  console.log('Converted the unpublished demo home story to the fixed homepage type');
}
const aboutStory = await createMissing('om-ofc', {
  name: 'Om ÖFC', slug: 'om-ofc', path: '/om-ofc/', content: {
    _uid: randomUUID(), component: 'about',
    introduction: homeIntroduction,
    background: richText(
      'För oss skapar fotografiet en resonans som ligger utanför språket och har som konstform ständigt utvecklats under två hundra år. I dag konsumerar vi detta allt snabbare och allt mer i våra digitala flöden.',
      'Därför har vi byggt en stillsam, fysisk plats där fotografiet kan upplevas, undersökas och utvecklas. Vi tycker att fotografiet, som rymmer angelägna betraktelser om oss själva, vår tid och vår värld i dag, behöver det.',
      'Tanken är att skapa en arena för ett samtida undersökande av bild, film och foto.'
    ),
    building: richText(
      'Platsen är Smedstorps Sädesmagasin, en bruksbyggnad från slutet av 1800-talet. Den ligger i ett levande litet stationssamhälle, klassat som riksintresse, mitt på Österlen. Magasinet har långsamt renoverats utifrån ett hållbart synsätt med små fotavtryck och lokala material.'
    ),
  },
});
const aboutDetail = (await request(`/${aboutStory.id}`)).story;
if (aboutDetail.content?.component === 'about' && !aboutDetail.content.background && !aboutDetail.published) {
  const seed = {
    ...aboutDetail.content,
    background: richText(
      'För oss skapar fotografiet en resonans som ligger utanför språket och har som konstform ständigt utvecklats under två hundra år. I dag konsumerar vi detta allt snabbare och allt mer i våra digitala flöden.',
      'Därför har vi byggt en stillsam, fysisk plats där fotografiet kan upplevas, undersökas och utvecklas. Vi tycker att fotografiet, som rymmer angelägna betraktelser om oss själva, vår tid och vår värld i dag, behöver det.',
      'Tanken är att skapa en arena för ett samtida undersökande av bild, film och foto.'
    ),
    building: richText('Platsen är Smedstorps Sädesmagasin, en bruksbyggnad från slutet av 1800-talet. Den ligger i ett levande litet stationssamhälle, klassat som riksintresse, mitt på Österlen. Magasinet har långsamt renoverats utifrån ett hållbart synsätt med små fotavtryck och lokala material.'),
  };
  await request(`/${aboutStory.id}`, { method: 'PUT', body: JSON.stringify({ story: { content: seed } }) });
  console.log('Filled the empty About draft with source-backed text');
}
await createMissing('installningar', {
  name: 'Besöksinformation', slug: 'installningar', path: '/besok/', content: {
    _uid: randomUUID(), component: 'site_settings',
    site_name: 'Österlens Fotograficentrum',
    address: 'Gårdlösavägen 49, 273 98 Smedstorp',
    email: 'magasinet@smedstorp.se',
    phone: '070 527 60 91',
    map_url: 'https://maps.google.com/?q=G%C3%A5rdl%C3%B6sav%C3%A4gen+49,+273+98+Smedstorp',
  },
});
await createMissing('utstallningar', {
  name: 'Utställningar', slug: 'utstallningar', is_folder: true, parent_id: 0,
  default_root: 'exhibition',
});
const archiveFolder = await createMissing('arkiv', {
  name: 'Arkiv', slug: 'arkiv', is_folder: true, parent_id: 0,
  default_root: 'archive_entry',
});
const legacyNames = JSON.parse(await readFile(new URL('../data/legacy-exhibitors.json', import.meta.url), 'utf8'));
for (const [index, artist] of legacyNames.entries()) {
  const slug = `aldre-utstallare-${String(index + 1).padStart(2, '0')}`;
  await createMissing(`arkiv/${slug}`, {
    name: artist, slug, parent_id: archiveFolder.id, path: '/arkiv/',
    content: { _uid: randomUUID(), component: 'archive_entry', artist },
  });
}
const listed2026 = JSON.parse(await readFile(new URL('../data/listed-2026.json', import.meta.url), 'utf8'));
for (const [index, artist] of listed2026.entries()) {
  const slug = `listad-2026-${String(index + 1).padStart(2, '0')}`;
  await createMissing(`arkiv/${slug}`, {
    name: artist, slug, parent_id: archiveFolder.id, path: '/arkiv/',
    content: { _uid: randomUUID(), component: 'archive_entry', artist, year: '2026' },
  });
}
