const pa11y = require('pa11y');
const puppeteer = require('puppeteer');

const BASE_URL = 'https://andre-matozinho.github.io/Projeto_ONG_ByteFuturo/html/index.html';
const ROTAS = ['#/', '#/projetos', '#/cadastro'];
const CHROME_ARGS = ['--no-sandbox', '--disable-setuid-sandbox'];
const REGRA_HASH_SPA = 'WCAG2AA.Principle2.Guideline2_4.2_4_1.G1,G123,G124.NoSuchID';

async function auditarWCAG() {
  let totalErros = 0;

  for (const rota of ROTAS) {
    const url = `${BASE_URL}${rota}`;
    const resultado = await pa11y(url, {
      standard: 'WCAG2AA',
      runners: ['axe', 'htmlcs'],
      wait: 1500,
      timeout: 60000,
      includeWarnings: false,
      includeNotices: false,
      ignore: [REGRA_HASH_SPA],
      chromeLaunchConfig: {
        args: CHROME_ARGS
      }
    });

    const erros = resultado.issues.filter((item) => item.type === 'error');
    totalErros += erros.length;

    console.log(`\n[WCAG 2.1 AA] ${rota}: ${erros.length} erro(s)`);
    erros.forEach((erro) => {
      console.log(`- ${erro.code}: ${erro.message}`);
      console.log(`  Seletor: ${erro.selector}`);
    });
  }

  if (totalErros > 0) {
    throw new Error(`A auditoria WCAG encontrou ${totalErros} erro(s).`);
  }
}

async function testarTecladoESemantica() {
  const browser = await puppeteer.launch({
    headless: true,
    args: CHROME_ARGS
  });
  const page = await browser.newPage();

  try {
    await page.goto(`${BASE_URL}#/`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('#app h1', { timeout: 10000 });

    const estrutura = await page.evaluate(() => ({
      lang: document.documentElement.lang,
      header: Boolean(document.querySelector('header')),
      main: Boolean(document.querySelector('main#app')),
      footer: Boolean(document.querySelector('footer')),
      navsRotulados: Array.from(document.querySelectorAll('nav')).every((nav) => nav.hasAttribute('aria-label')),
      liveRegion: Boolean(document.querySelector('[aria-live]')),
      skipLink: Boolean(document.querySelector('a.skip-link[href="#app"]')),
      h1: Boolean(document.querySelector('#app h1')),
      tabindexPositivo: document.querySelectorAll('[tabindex]:not([tabindex="0"]):not([tabindex="-1"])').length
    }));

    const falhasEstrutura = Object.entries(estrutura)
      .filter(([chave, valor]) => chave !== 'lang' && chave !== 'tabindexPositivo' && !valor)
      .map(([chave]) => chave);

    if (estrutura.lang.toLowerCase() !== 'pt-br') {
      falhasEstrutura.push('lang=pt-BR');
    }

    if (estrutura.tabindexPositivo > 0) {
      falhasEstrutura.push('tabindex positivo');
    }

    if (falhasEstrutura.length) {
      throw new Error(`Falhas de semântica assistiva: ${falhasEstrutura.join(', ')}`);
    }

    await page.evaluate(() => {
      document.activeElement?.blur();
      document.body.setAttribute('tabindex', '-1');
      document.body.focus();
      document.body.removeAttribute('tabindex');
    });
    await page.keyboard.press('Tab');

    const primeiroFoco = await page.evaluate(() => ({
      tag: document.activeElement?.tagName,
      classe: document.activeElement?.className,
      texto: document.activeElement?.textContent?.trim()
    }));

    if (!String(primeiroFoco.classe).includes('skip-link')) {
      throw new Error(`Primeiro foco por teclado não é o skip link. Recebido: ${JSON.stringify(primeiroFoco)}`);
    }

    const focos = [];
    for (let i = 0; i < 12; i += 1) {
      await page.keyboard.press('Tab');
      const foco = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? `${el.tagName}#${el.id || ''}.${el.className || ''}:${(el.textContent || '').trim().slice(0, 40)}` : 'sem foco';
      });
      focos.push(foco);
    }

    const focosValidos = focos.filter((foco) => foco !== 'sem foco' && !foco.startsWith('BODY'));
    if (new Set(focosValidos).size < 4) {
      throw new Error(`Poucos elementos alcançáveis por teclado: ${focosValidos.join(' | ')}`);
    }

    for (const rota of ROTAS) {
      await page.goto('about:blank');
      await page.goto(`${BASE_URL}${rota}`, { waitUntil: 'networkidle2' });
      await page.waitForSelector('#app h1', { timeout: 10000 });
      await page.waitForFunction(
        () => document.activeElement === document.querySelector('#app h1'),
        { timeout: 5000 }
      );

      const focoRota = await page.evaluate(() => ({
        tag: document.activeElement?.tagName,
        texto: document.activeElement?.textContent?.trim(),
        h1: document.querySelector('#app h1')?.textContent?.trim(),
        ariaCurrent: document.querySelector('[aria-current="page"]')?.getAttribute('data-rota') ?? null
      }));

      if (focoRota.tag !== 'H1' || focoRota.texto !== focoRota.h1) {
        throw new Error(`A rota ${rota} não moveu o foco para o H1 principal: ${JSON.stringify(focoRota)}`);
      }

      console.log(`[Teclado] ${rota}: foco movido corretamente para "${focoRota.h1}".`);
    }

    console.log('\n[Teclado] Skip link é o primeiro elemento focável e há navegação por Tab entre controles.');
    console.log('[Semântica] Landmarks, idioma, regiões ARIA e ausência de tabindex positivo verificados.');
  } finally {
    await browser.close();
  }
}

(async () => {
  try {
    await auditarWCAG();
    await testarTecladoESemantica();
    console.log('\nRESULTADO: auditoria automatizada de acessibilidade aprovada.');
  } catch (erro) {
    console.error('\nRESULTADO: auditoria reprovada.');
    console.error(erro);
    process.exit(1);
  }
})();
