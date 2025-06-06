    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';
    import { VitePWA } from 'vite-plugin-pwa';

    export default defineConfig({
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate', // or 'prompt', 'manual'
          manifest: {
            name: 'Valorous Creations PWA',
            short_name: 'VC PWA App',
            start_url: '/vc-pwa',
            background_color: '#fff',
            theme_color: '#000',
            display: 'standalone',
            icons: [
              {
                src: '/icon-192.svg',
                sizes: '192x192',
                type: 'image/png'
              },
              {
                src: '/icon-512.svg',
                sizes: '512x512',
                type: 'image/png'
              }
            ]
          },
        }),
      ],
    base: "/vc-pwa"
    });
