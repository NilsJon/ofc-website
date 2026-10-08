import { spawn } from 'node:child_process';
import { loadEnvFile } from 'node:process';

try { loadEnvFile('.env'); } catch { /* Shell environment is also supported. */ }

if (!process.env.STORYBLOK_MANAGEMENT_TOKEN) {
  console.error('Set STORYBLOK_MANAGEMENT_TOKEN in the ignored .env file or shell.');
  process.exit(1);
}

const child = spawn('./node_modules/.bin/storyblok', process.argv.slice(2), {
  stdio: 'inherit',
  env: {
    ...process.env,
    STORYBLOK_LOGIN: 'token',
    STORYBLOK_TOKEN: process.env.STORYBLOK_MANAGEMENT_TOKEN,
    STORYBLOK_REGION: 'eu',
  },
});
child.on('exit', (code) => process.exit(code ?? 1));
