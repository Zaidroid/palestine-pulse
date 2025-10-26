import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from 'vite-plugin-pwa';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'chart-vendor': ['recharts'],
          'animation-vendor': ['framer-motion'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
          
          // Feature chunks
          'gaza-dashboard': [
            './src/components/v3/gaza/HumanitarianCrisis',
            './src/components/v3/gaza/InfrastructureDestruction',
            './src/components/v3/gaza/PopulationImpact',
            './src/components/v3/gaza/AidSurvival',
          ],
          'westbank-dashboard': [
            './src/components/v3/westbank/OccupationMetrics',
            './src/components/v3/westbank/SettlerViolence',
            './src/components/v3/westbank/EconomicStrangulation',
            './src/components/v3/westbank/PrisonersDetention',
          ],
          'analytics': [
            './src/components/v3/shared/AnalyticsPanel',
            './src/components/analytics/PredictiveAnalytics',
            './src/components/analytics/CorrelationMatrix',
          ],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable source maps for production debugging
    sourcemap: false,
    // Minify with terser for better compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Tech4Palestine API - Main data source for casualties and infrastructure
      '/api/tech4palestine': {
        target: 'https://data.techforpalestine.org/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tech4palestine/, ''),
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Tech4Palestine proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Tech4Palestine proxy request:', req.method, req.url);
          });
        },
      },
      
      // Good Shepherd Collective API - West Bank data, prisoners, healthcare attacks
      '/api/goodshepherd': {
        target: 'https://goodshepherdcollective.org/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/goodshepherd/, ''),
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Good Shepherd proxy error', err);
          });
        },
      },
      
      // World Bank API - Economic indicators for West Bank
      '/api/worldbank': {
        target: 'https://api.worldbank.org/v2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/worldbank/, ''),
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('World Bank proxy error', err);
          });
        },
      },
      
      // B'Tselem API - Checkpoint and settlement data
      '/api/btselem': {
        target: 'https://www.btselem.org/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/btselem/, ''),
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('B\'Tselem proxy error', err);
          });
        },
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'Palestine Pulse - Humanitarian Dashboard',
        short_name: 'Palestine Pulse',
        description: 'Real-time humanitarian data visualization platform documenting the situation in Palestine',
        theme_color: '#CC2936',
        background_color: '#FAFAFA',
        display: 'standalone',
        scope: '/',
        start_url: '/v3/gaza',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MB
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/data\.techforpalestine\.org\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 5 // 5 minutes
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
