import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from 'node:fs';

const templates = ['inicio.html', 'projetos.html', 'cadastro.html'];

function minificarHtml(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function prepararRecursosEstaticos() {
  return {
    name: 'preparar-recursos-estaticos',
    closeBundle() {
      const raiz = import.meta.dirname;
      const templatesDestino = resolve(raiz, 'dist/html/templates');
      const imagensDestino = resolve(raiz, 'dist/imagens');

      mkdirSync(templatesDestino, { recursive: true });
      mkdirSync(imagensDestino, { recursive: true });

      for (const arquivo of templates) {
        const origem = resolve(raiz, 'html/templates', arquivo);
        const destino = resolve(templatesDestino, arquivo);
        const conteudo = readFileSync(origem, 'utf-8');
        writeFileSync(destino, minificarHtml(conteudo), 'utf-8');
      }

      copyFileSync(
        resolve(raiz, 'imagens/banner-bytefuturo.webp'),
        resolve(imagensDestino, 'banner-bytefuturo.webp')
      );

      copyFileSync(
        resolve(raiz, 'imagens/banner-bytefuturo.jpg'),
        resolve(imagensDestino, 'banner-bytefuturo.jpg')
      );
    }
  };
}

export default defineConfig({
  base: './',

  plugins: [prepararRecursosEstaticos()],

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
