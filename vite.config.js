import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Relative base so the site works under https://<user>.github.io/<repo>/
// regardless of the repo name's casing.
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        quiz: resolve(import.meta.dirname, 'quiz.html'),
        game: resolve(import.meta.dirname, 'game.html'),
        hall: resolve(import.meta.dirname, 'hall.html'),
      },
    },
  },
});
