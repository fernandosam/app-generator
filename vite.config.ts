import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite-plus'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: { port: 3000 },
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  plugins: [tanstackStart(), viteReact(), tailwindcss()],
  test: { include: ['src/**/*.test.ts'], environment: 'node' },
})
