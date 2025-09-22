import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./setup-vitest.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    server: {
      deps: {
        inline: ['@angular/*']
      }
    },
    transformMode: {
      web: [/\.[jt]sx?$/],
      ssr: [/\.ts$/]
    }
  },
  plugins: [
    {
      name: 'angular-template-loader',
      transform(code, id) {
        if (id.endsWith('.ts') && !id.endsWith('.spec.ts') && !id.endsWith('.test.ts')) {
          // Simple transform to inline templates and styles for testing
          const transformedCode = code
            .replace(/templateUrl:\s*['"`]([^'"`]+)['"`]/g, "template: ''")
            .replace(/styleUrls:\s*\[[^\]]*\]/g, "styles: []");
          return transformedCode;
        }
        return code;
      }
    }
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  esbuild: {
    target: 'es2022',
  },
  define: {
    global: 'globalThis',
  },
});