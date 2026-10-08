import { defineBlock, defineField, defineSchema } from '@storyblok/schema';

const galleryImage = defineBlock({
  name: 'gallery_image',
  display_name: 'Bild i galleri',
  is_root: false,
  is_nestable: true,
  fields: [
    defineField('image', { type: 'asset', filetypes: ['images'], required: true, display_name: 'Bild' }),
    defineField('caption', { type: 'text', display_name: 'Bildtext' }),
    defineField('credit', { type: 'text', display_name: 'Fotograf / bildrättighet' }),
  ],
});

const exhibition = defineBlock({
  name: 'exhibition',
  display_name: 'Utställning',
  is_root: true,
  is_nestable: false,
  fields: [
    defineField('title', { type: 'text', required: true, display_name: 'Utställningens titel' }),
    defineField('artists', { type: 'text', required: true, display_name: 'Fotograf(er) / konstnär(er)' }),
    defineField('start_date', { type: 'datetime', required: true, display_name: 'Startdatum' }),
    defineField('end_date', { type: 'datetime', required: true, display_name: 'Slutdatum' }),
    defineField('opening_date', { type: 'datetime', display_name: 'Vernissage (valfritt)' }),
    defineField('summary', { type: 'textarea', display_name: 'Kort introduktion' }),
    defineField('body', { type: 'richtext', display_name: 'Om utställningen' }),
    defineField('hero_image', { type: 'asset', filetypes: ['images'], display_name: 'Huvudbild' }),
    defineField('image_credit', { type: 'text', display_name: 'Fotograf / bildrättighet för huvudbild' }),
    defineField('gallery', { type: 'bloks', allow: [galleryImage], display_name: 'Fler bilder' }),
    defineField('external_url', { type: 'text', display_name: 'Extern länk (valfritt)' }),
  ],
});

const home = defineBlock({
  name: 'home',
  display_name: 'Startsida',
  is_root: true,
  is_nestable: false,
  fields: [
    defineField('introduction', { type: 'textarea', display_name: 'Kort text om ÖFC' }),
    defineField('venue_image', { type: 'asset', filetypes: ['images'], display_name: 'Bild av utställningsrummet' }),
  ],
});

const about = defineBlock({
  name: 'about',
  display_name: 'Om ÖFC',
  is_root: true,
  is_nestable: false,
  fields: [
    defineField('introduction', { type: 'textarea', display_name: 'Introduktion' }),
    defineField('background', { type: 'richtext', display_name: 'Om fotograficentrumet' }),
    defineField('building', { type: 'richtext', display_name: 'Om Sädesmagasinet' }),
    defineField('image', { type: 'asset', filetypes: ['images'], display_name: 'Bild av magasinet' }),
  ],
});

const siteSettings = defineBlock({
  name: 'site_settings',
  display_name: 'Besöksinformation',
  is_root: true,
  is_nestable: false,
  fields: [
    defineField('site_name', { type: 'text', display_name: 'Namn' }),
    defineField('address', { type: 'text', required: true, display_name: 'Adress' }),
    defineField('email', { type: 'text', display_name: 'E-post' }),
    defineField('phone', { type: 'text', display_name: 'Telefon' }),
    defineField('opening_hours', { type: 'textarea', display_name: 'Öppettider' }),
    defineField('map_url', { type: 'text', display_name: 'Kartlänk' }),
    defineField('instagram_url', { type: 'text', display_name: 'Instagramlänk' }),
    defineField('announcement', { type: 'textarea', display_name: 'Meddelande (valfritt)' }),
  ],
});

const archiveEntry = defineBlock({
  name: 'archive_entry',
  display_name: 'Äldre utställare',
  is_root: true,
  is_nestable: false,
  fields: [
    defineField('artist', { type: 'text', required: true, display_name: 'Utställare' }),
    defineField('title', { type: 'text', display_name: 'Utställningens titel (om känd)' }),
    defineField('year', { type: 'text', display_name: 'År (om känt)' }),
    defineField('image', { type: 'asset', filetypes: ['images'], display_name: 'Bild (om tillgänglig)' }),
  ],
});

export const schema = defineSchema({ blocks: { galleryImage, exhibition, home, about, siteSettings, archiveEntry } });
