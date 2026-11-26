import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

const DEFAULT_OG_IMAGE_URL =
  'https://raw.githubusercontent.com/nhrdigitalagency-stack/invitation/main/public/og-invitation.jpg';

function resolveHostedOgImageUrl(): string {
  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProd) {
    return `https://${vercelProd.replace(/^https?:\/\//, '').replace(/\/$/, '')}/og-invitation.jpg`;
  }
  const netlifyUrl = process.env.URL;
  if (netlifyUrl && netlifyUrl.startsWith('https://')) {
    return `${netlifyUrl.replace(/\/$/, '')}/og-invitation.jpg`;
  }
  const customSiteUrl = process.env.SITE_URL;
  if (customSiteUrl && customSiteUrl.startsWith('https://')) {
    return `${customSiteUrl.replace(/\/$/, '')}/og-invitation.jpg`;
  }
  return DEFAULT_OG_IMAGE_URL;
}

export default defineConfig(() => {
  const hostedOgImageUrl = resolveHostedOgImageUrl();

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'resolve-og-image-url',
        transformIndexHtml(html: string): string {
          if (hostedOgImageUrl === DEFAULT_OG_IMAGE_URL) {
            return html;
          }
          return html.split(DEFAULT_OG_IMAGE_URL).join(hostedOgImageUrl);
        },
      },
      // Copies src/assets into dist/ so root-relative URLs like
      // "/src/assets/images/..." (e.g. generate_image output) still resolve
      // in production builds. Do not remove.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const srcAssets = path.resolve(__dirname, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
