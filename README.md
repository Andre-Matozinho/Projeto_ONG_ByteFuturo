# ByteFuturo

Projeto acadêmico de desenvolvimento front-end para uma organização social fictícia chamada **ByteFuturo**, criada com o objetivo de ampliar o acesso à tecnologia e à educação digital.

A aplicação apresenta iniciativas da ONG, informações sobre doações e voluntariado e uma área de cadastro. O projeto utiliza uma arquitetura SPA (Single Page Application) desenvolvida com HTML5, CSS3 e JavaScript puro.

## Objetivo

Aplicar, em um cenário próximo ao mercado, práticas de desenvolvimento front-end, responsividade, acessibilidade, versionamento, otimização, integração contínua e preparação para publicação em ambiente de produção.

## Funcionalidades

- navegação SPA sem recarregamento completo da página;
- página inicial com apresentação da ByteFuturo;
- área de projetos e iniciativas;
- informações sobre doação e voluntariado;
- formulário de cadastro com máscaras e validações;
- menu responsivo para dispositivos móveis;
- feedback visual após envio do formulário;
- navegação por teclado e foco visível;
- indicação de rota ativa com `aria-current`;
- gerenciamento de foco em mudanças de rota;
- modo de alto contraste com preferência persistida em `localStorage`;
- suporte a `prefers-reduced-motion`.

## Tecnologias utilizadas

- **HTML5** — estrutura semântica e landmarks;
- **CSS3** — design system, Grid, Flexbox, responsividade e acessibilidade visual;
- **JavaScript** — roteamento, interações, validações e preferências de interface;
- **Vite 8.3.0** — build e otimização para produção;
- **Git** — controle de versão;
- **GitHub** — repositório, branches, issues, milestones e pull requests;
- **GitHub Actions** — integração contínua, validação da build e deploy no GitHub Pages.

## Estrutura do projeto

```text
Projeto_ONG_ByteFuturo/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── css/
│   └── style.css
├── html/
│   ├── index.html
│   └── templates/
│       ├── cadastro.html
│       ├── inicio.html
│       └── projetos.html
├── imagens/
├── js/
│   ├── feedback.js
│   ├── main.js
│   ├── mascaras.js
│   ├── menu.js
│   ├── router.js
│   └── tema.js
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Instalação local

Pré-requisito: Node.js 22 ou versão compatível com o Vite 8.

```bash
git clone https://github.com/Andre-Matozinho/Projeto_ONG_ByteFuturo.git
cd Projeto_ONG_ByteFuturo
npm install
npm run dev
```

O comando `npm run dev` inicia o servidor de desenvolvimento do Vite.

## Build de produção

Para gerar a versão otimizada:

```bash
npm run build
```

A build é criada na pasta `dist/`.

Para validar localmente a versão gerada:

```bash
npm run preview
```

Durante a build, o Vite agrupa e minifica os módulos JavaScript e o CSS. Os templates carregados dinamicamente pela SPA também são preparados para produção, e apenas os formatos de imagem necessários são copiados para `dist/`.

## Otimização e performance

A build validada pelo GitHub Actions apresentou as seguintes reduções aproximadas em relação aos arquivos fonte:

| Recurso | Fonte | Build | Redução aproximada |
| --- | ---: | ---: | ---: |
| CSS | 21.417 bytes | 13.671 bytes | 36,2% |
| JavaScript | 9.919 bytes | 4.675 bytes | 52,9% |
| HTML | 17.024 bytes | 13.107 bytes | 23,0% |
| Imagens publicadas | 182.204 bytes | 67.996 bytes | 62,7% |

O banner utiliza **WebP** como formato preferencial, com **JPEG** como fallback. O arquivo WebP possui aproximadamente 22,3 KB contra 45,7 KB do JPEG, uma redução de cerca de 51% para navegadores compatíveis.

## Acessibilidade

O projeto foi revisado com base nas diretrizes **WCAG 2.1 nível AA**. Entre as principais medidas implementadas estão:

- landmarks semânticos (`header`, `nav`, `main` e `footer`);
- skip link para acesso direto ao conteúdo principal;
- navegação por teclado;
- foco visível com `:focus-visible`;
- uso de `aria-expanded`, `aria-current`, `aria-live` e `aria-pressed`;
- gerenciamento de foco após alterações de rota na SPA;
- ajustes de contraste;
- modo de alto contraste;
- preferência de redução de movimento.

## Estratégia de versionamento

O repositório segue uma estrutura baseada em **GitFlow**:

- `main` — versão estável e pronta para produção;
- `develop` — integração contínua das alterações;
- `feature/*` — desenvolvimento isolado de funcionalidades e melhorias.

As alterações são registradas com commits semânticos e integradas por meio de pull requests.

## CI/CD

O workflow `.github/workflows/deploy.yml` executa automaticamente:

1. checkout do repositório;
2. configuração do Node.js;
3. instalação das dependências;
4. medição dos arquivos fonte;
5. build de produção com Vite;
6. validação e registro dos tamanhos dos arquivos gerados;
7. publicação do artefato e deploy no GitHub Pages quando a alteração chega à branch `main`.

Esse fluxo garante que a versão publicada seja gerada a partir do código versionado e validada em ambiente limpo.

## Deploy

O ambiente de produção utiliza **GitHub Pages**, integrado ao GitHub Actions. O deploy ocorre a partir da branch `main`, após a aprovação e integração da versão de release.

## Versão

Versão preparada para a release **v1.0.0**.
