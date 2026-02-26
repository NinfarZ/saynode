import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/saynode',
  build: {
    // Increase warning threshold (kilobytes). Adjust to taste.
    chunkSizeWarningLimit: 1000, // 1000kb = 1MB

    // Manual chunking to keep large deps out of the main bundle
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // React ecosystem in its own chunk
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor_react';
            }

            // Charting libraries
            if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
              return 'vendor_chartjs';
            }

            // CSV / parsing libs
            if (id.includes('papaparse')) {
              return 'vendor_parsing';
            }

            // Put anything else from node_modules into a generic vendor chunk
            return 'vendor';
          }
        },
      },
    },
  },
})
