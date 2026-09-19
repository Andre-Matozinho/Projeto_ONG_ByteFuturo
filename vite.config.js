import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { cpSync, mkdirSync } from 'node:fs';

function copiarRecursosEstaticos() {
  return {
    name: 'copiar-recursos-estaticos',
    closeBundle() {
      const templatesOrigem = resolve(import.meta.dirname, 'html/templates');
      const templatesDestino = resolve(import.meta.dirname, 'dist/html/templates');
      const imagensOrigem = resolve(import.meta.dirname, 'imagens');
      const imagensDestino = resolve(import.meta.dirname, 'dist/imagens');

      mkdirSync(templatesDestino, { recursive: true });
      cpSync(templatesOrigem, templatesDestino, { recursive: true });

      mkdirSync(imagensDestino, { recursive: true });
      cpSync(imagensOrigem, imagensDestino, { recursive: true });
    }
  };
}

export default defineConfig({
  base: './',

  plugins: [copiarRecursosEstaticos()],

  build: {
    outDir: 'dist',
    emptyOutDir: true,

    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        app: resolve(import.meta.dirname, 'html/index.html')
      }
    }
  }
});
