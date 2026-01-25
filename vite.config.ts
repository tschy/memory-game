import {defineConfig} from 'vite'
import preact from '@preact/preset-vite'
import {VitePWA} from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/memory-game/',
    plugins: [
        preact(),
        VitePWA({
            manifest: {
                name: 'Memory Game',
                short_name: 'Memory',
                description: 'A fun memory card matching game',
                theme_color: '#ffffff',
                background_color: '#ffffff',
                display: 'standalone',
                scope: '/memory-game/',
                start_url: '/memory-game/',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            },
            workbox: {
                globPatterns: [
                    '**/*.{js,css,html}',
                    '**/*.png',
                    '**/*.svg'
                ],
                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\//,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'external-assets',
                            expiration: {
                                maxEntries: 30,
                                maxAgeSeconds: 24 * 60 * 60 // 24 hours
                            }
                        }
                    }
                ]
            }
        })
    ],
})
