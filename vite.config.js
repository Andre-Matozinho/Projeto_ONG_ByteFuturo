import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({

  /*
   * Gera URLs relativas.
   * Isso evita problemas quando o projeto é publicado
   * dentro de uma subpasta, como ocorre no GitHub Pages.
   */
  base: './',

  build: {

    /*
     * Pasta gerada pela build de produção.
     */
    outDir: 'dist',

    /*
     * Limpa a pasta dist antes de gerar uma nova build.
     */
    emptyOutDir: true,

    /*
     * Entradas HTML do projeto.
     *
     * Além da página principal, os templates precisam ser
     * preservados porque são carregados dinamicamente
     * pelo router.js através de fetch().
     */
    rolldownOptions: {

      input: {

        main: resolve(import.meta.dirname, 'index.html'),

        app: resolve(
          import.meta.dirname,
          'html/index.html'
        ),

        inicio: resolve(
          import.meta.dirname,
          'html/templates/inicio.html'
        ),

        projetos: resolve(
          import.meta.dirname,
          'html/templates/projetos.html'
        ),

        cadastro: resolve(
          import.meta.dirname,
          'html/templates/cadastro.html'
        )

      }

    }

  }

});
