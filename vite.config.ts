import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite-plus'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: { port: 3000 },
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  plugins: [tanstackStart(), viteReact(), tailwindcss()],
  lint: {
    options: { typeAware: true, typeCheck: true },
  },
  fmt: {
    singleQuote: true,
    semi: false,
    ignorePatterns: ['.github/**', 'src/routeTree.gen.ts'],
  },
  test: { include: ['src/**/*.test.ts', 'scripts/**/*.test.mjs'], environment: 'node' },
})
