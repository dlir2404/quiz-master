import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import obfuscator from 'rollup-plugin-obfuscator'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false, // Hide source maps
    minify: 'terser',
    rollupOptions: {
      plugins: [
        obfuscator({
          global: true,
          compact: true,
          controlFlowFlattening: true,
          controlFlowFlatteningThreshold: 0.75,
          deadCodeInjection: true,
          deadCodeInjectionThreshold: 0.4,
          debugProtection: true,
          debugProtectionInterval: 2000,
          disableConsoleOutput: true,
          identifierNamesGenerator: 'hexadecimal',
          log: false,
          numbersToExpressions: true,
          renameGlobals: false,
          selfDefending: true,
          simplify: true,
          splitStrings: true,
          splitStringsChunkLength: 5,
          stringArray: true,
          stringArrayCallsTransform: true,
          stringArrayEncoding: ['base64'],
          stringArrayIndexShift: true,
          stringArrayRotate: true,
          stringArrayShuffle: true,
          stringArrayThreshold: 0.8,
          unicodeEscapeSequence: false
        })
      ]
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
