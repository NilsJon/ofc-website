// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { storyblok } from '@storyblok/astro';
import node from '@astrojs/node';
import { loadEnv } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), 'STORYBLOK_');
const preview = process.env.STORYBLOK_PREVIEW === '1';
const accessToken = preview ? env.STORYBLOK_PREVIEW_DELIVERY_API_TOKEN : env.STORYBLOK_DELIVERY_API_TOKEN;

export default defineConfig({
  site: 'https://xn--fc-eka.se',
  output: preview ? 'server' : 'static',
  ...(preview ? { adapter: node({ mode: 'standalone' }) } : {}),
  integrations: [
    storyblok({
      accessToken: accessToken ?? '',
      apiOptions: { region: 'eu' },
      livePreview: preview,
    }),
    sitemap(),
  ],
  redirects: {
    '/om-oss/': '/om-ofc/',
    '/kontakt/': '/besok/',
    '/lankar/': '/om-ofc/',
  },
  vite: { plugins: preview ? [basicSsl()] : [] },
});
