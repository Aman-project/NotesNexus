import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: true,
      clientPort: 8080,
      timeout: 2000,
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: mode === 'development'
  },
  plugins: [
    react({
      fastRefresh: true,
      swcOptions: {
        jsc: {
          transform: {
            react: {
              runtime: 'automatic',
              refresh: true,
              development: mode === 'development',
            },
          },
        },
      },
    }),
    tailwindcss(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
}));
