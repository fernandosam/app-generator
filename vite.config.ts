import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite-plus'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: { port: 3000 },
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  plugins: [tanstackStart(), viteReact(), tailwindcss()],
  // O lint type-aware utiliza o TypeScript Go; baseUrl foi removido do tsconfig.
  lint: {
    options: { typeAware: true, typeCheck: true },
  },
  fmt: {
    singleQuote: true,
    semi: false,
    ignorePatterns: ['src/routeTree.gen.ts'],
  },
  test: { include: ['src/**/*.test.ts'], environment: 'node' },
})
