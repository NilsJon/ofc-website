import { defineConfig } from 'storyblok/config';

export default defineConfig({
  region: 'eu',
  space: process.env.STORYBLOK_SPACE_ID,
  path: '.storyblok',
});
