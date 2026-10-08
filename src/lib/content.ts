import { storyblokApi } from '@storyblok/astro/client';
import type { StoryblokRichTextInput } from '@storyblok/astro';
export { classifyExhibition, formatDateRange } from './dates';

export interface ImageAsset {
  filename?: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
}

export interface GalleryImage {
  _uid?: string;
  _editable?: string;
  component: 'gallery_image';
  image?: ImageAsset;
  caption?: string;
  credit?: string;
}

export interface Exhibition {
  _uid?: string;
  _editable?: string;
  component: 'exhibition';
  title: string;
  artists?: string;
  start_date?: string;
  end_date?: string;
  opening_date?: string;
  summary?: string;
  body?: StoryblokRichTextInput;
  hero_image?: ImageAsset;
  gallery?: GalleryImage[];
  image_credit?: string;
  external_url?: string;
}

export interface SiteSettings {
  _editable?: string;
  component: 'site_settings';
  site_name?: string;
  address?: string;
  email?: string;
  phone?: string;
  opening_hours?: string;
  map_url?: string;
  instagram_url?: string;
  announcement?: string;
}

export interface AboutContent {
  _editable?: string;
  component: 'about';
  introduction?: string;
  background?: StoryblokRichTextInput;
  building?: StoryblokRichTextInput;
  image?: ImageAsset;
}

export interface ArchiveEntry {
  _editable?: string;
  component: 'archive_entry';
  artist: string;
  title?: string;
  year?: string;
  image?: ImageAsset;
}

export interface CmsStory<T> {
  name: string;
  slug: string;
  full_slug: string;
  content: T;
}

export const fallbackSettings: SiteSettings = {
  component: 'site_settings',
  site_name: 'Österlens Fotograficentrum',
  address: 'Gårdlösavägen 49, 273 98 Smedstorp',
  email: 'magasinet@smedstorp.se',
  phone: '070 527 60 91',
  map_url: 'https://maps.google.com/?q=G%C3%A5rdl%C3%B6sav%C3%A4gen+49,+273+98+Smedstorp',
};

const hasToken = Boolean(import.meta.env.STORYBLOK_PREVIEW === '1' ? import.meta.env.STORYBLOK_PREVIEW_DELIVERY_API_TOKEN : import.meta.env.STORYBLOK_DELIVERY_API_TOKEN);
const version = import.meta.env.STORYBLOK_PREVIEW === '1' ? 'draft' : 'published';

export async function getStory<T>(slug: string): Promise<CmsStory<T> | null> {
  if (!hasToken) return null;
  try {
    const response = await storyblokApi.get(`cdn/stories/${slug}`, { version });
    return response.data.story as CmsStory<T>;
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'status' in error && error.status === 404) return null;
    if (import.meta.env.PROD) throw error;
    console.warn(`Storyblok story unavailable: ${slug}`);
    return null;
  }
}

export async function getExhibitions(): Promise<CmsStory<Exhibition>[]> {
  if (!hasToken) return [];
  try {
    const response = await storyblokApi.getAll('cdn/stories', {
      version,
      starts_with: 'utstallningar/',
      is_startpage: false,
    });
    return (response as CmsStory<Exhibition>[]).filter(
      (story) => story.content?.component === 'exhibition',
    );
  } catch (error) {
    if (import.meta.env.PROD) throw error;
    console.warn('Storyblok exhibitions unavailable');
    return [];
  }
}

export async function getArchiveEntries(): Promise<CmsStory<ArchiveEntry>[]> {
  if (!hasToken) return [];
  try {
    const response = await storyblokApi.getAll('cdn/stories', {
      version,
      starts_with: 'arkiv/',
      is_startpage: false,
    });
    return (response as CmsStory<ArchiveEntry>[]).filter(
      (story) => story.content?.component === 'archive_entry',
    );
  } catch (error) {
    if (import.meta.env.PROD) throw error;
    console.warn('Storyblok archive unavailable');
    return [];
  }
}

export async function getSettings(): Promise<SiteSettings> {
  return (await getStory<SiteSettings>('installningar'))?.content ?? fallbackSettings;
}

export function sortExhibitions(stories: CmsStory<Exhibition>[]): CmsStory<Exhibition>[] {
  return [...stories].sort((a, b) => (b.content.start_date ?? '').localeCompare(a.content.start_date ?? ''));
}

export function imageUrl(asset?: ImageAsset, width = 1200): string | undefined {
  if (!asset?.filename) return undefined;
  if (!asset.filename.includes('a.storyblok.com')) return asset.filename;
  return `${asset.filename}/m/${width}x0/filters:quality(82)`;
}

export function imageSrcset(asset?: ImageAsset): string | undefined {
  if (!asset?.filename || !asset.filename.includes('a.storyblok.com')) return undefined;
  return [480, 800, 1200, 1800].map((width) => `${imageUrl(asset, width)} ${width}w`).join(', ');
}
