import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from "vite-tsconfig-paths";
import path from 'path';
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'~': path.resolve(__dirname, 'src'),
		},
	},
	plugins: [
		react(),
		tsconfigPaths(),
		VitePWA({
			workbox: {
				globPatterns: ["**/*"],
			},
			includeAssets: [
				"**/*",
			],
			manifest: {
				"theme_color": "#394f5b",
				"background_color": "#ffffff",
				"display": "standalone",
				"scope": "/",
				"start_url": "/",
				"name": "TokoWA",
				"short_name": "TokoWA",
				"icons": [
					{
						"src": "/icon-192x192.png",
						"sizes": "192x192",
						"type": "image/png"
					},
					{
						"src": "/icon-256x256.png",
						"sizes": "256x256",
						"type": "image/png"
					},
					{
						"src": "/icon-384x384.png",
						"sizes": "384x384",
						"type": "image/png"
					},
					{
						"src": "/icon-512x512.png",
						"sizes": "512x512",
						"type": "image/png"
					}
				]
			}
		})
	],
})
