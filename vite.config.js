/// <reference types="vitest" />
// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
// import basicSsl from '@vitejs/plugin-basic-ssl'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import istanbul from 'vite-plugin-istanbul';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({ 
      template: { transformAssetUrls }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
    istanbul({
      include: 'src/*', // specify the files you want to instrument
      exclude: ['node_modules', 'test/*'],
      extension: ['.js', '.vue'], // include your file extensions
    })
    // basicSsl(),
  ],
  base: '/calories_tracker',
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    // https: true,
    host: "127.0.0.1",
    port: 8012,
  },

  test: { // To use with vitest but better with nyc
    globals: true,
    // environment: 'jsdom',
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname,
    },
    include: ['**/*.test.js'],
    exclude: ['node_modules', 'dist', '**/examples/**', 'test'],
    coverage: {
      provider: 'istanbul',
      reporter: ['html', 'text', 'lcov'],
      include: ['src/**/*.js'],
      exclude: [
        'src/scripts/**',
        '**/*.spec.js'
      ]
    }
  },

  build: {
    sourcemap: "inline", // Options: true, 'inline', 'hidden'
  },
  // test: {
  //   // globals: true,
  //   environment: 'jsdom',
  //   setupFiles: 'vitest.setup.js',
  //   server: {
  //     deps: {
  //       inline: ['vuetify'],
  //     },
  //   },
  // },
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `@import "path-to-your-variables.scss";` // If you have global SCSS variables
  //     }
  //   }
  // },
})
