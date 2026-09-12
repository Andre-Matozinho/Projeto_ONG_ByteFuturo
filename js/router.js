// router.js
// Roteador mínimo, em JavaScript puro, para a SPA da ByteFuturo.
//
// Por que hash routing (#/rota) em vez da History API (pushState):
// o projeto é hospedado como arquivos estáticos (ex.: GitHub Pages), sem
// nenhum servidor configurado para redirecionar todas as rotas de volta
// para o index.html. Com pushState, recarregar a página em "/projetos"
// resultaria em 404, porque o servidor tentaria abrir um arquivo que não
// existe. Com hash routing, tudo depois do "#" nunca é enviado ao
// servidor, então um recarregamento em "#/projetos" sempre abre o mesmo
// index.html e deixa o próprio JavaScript decidir o que renderizar.

const CONTAINER_ID = 'app';

// Mapa de rota -> template HTML a ser buscado e injetado no container.
const ROTAS = {
    '': '../html/templates/inicio.html',
    'projetos': '../html/templates/projetos.html',
    'cadastro': '../html/templates/cadastro.html',
};

/**
 * Lê o hash atual da URL e separa a rota principal de uma âncora
 * secundária, por exemplo "#/projetos/doacao" vira { rota: "projetos",
 * ancora: "doacao" }. Isso permite que o dropdown de navegação aponte
 * para uma seção específica de "Projetos" mesmo com o conteúdo sendo
 * carregado de forma dinâmica.
 */
function interpretarHash() {
    const partes = window.location.hash.replace(/^#\/?/, '').split('/');
    return {
        rota: partes[0] || '',
        ancora: partes[1] || null,
    };
}

function atualizarLinkAtivo(rota) {
    document.querySelectorAll('[data-rota]').forEach(function (link) {
        link.classList.toggle('link-ativo', link.dataset.rota === rota);
    });
}

/**
 * Função central da SPA: limpa o conteúdo atual do container #app e
 * injeta o fragmento HTML correspondente à rota, via fetch + innerHTML.
 */
async function renderizarRota() {
    const { rota, ancora } = interpretarHash();
    const caminho = ROTAS[rota] !== undefined ? ROTAS[rota] : ROTAS[''];
    const container = document.getElementById(CONTAINER_ID);

    if (!container) {
        return;
    }

    try {
        const resposta = await fetch(caminho);

        if (!resposta.ok) {
            throw new Error('Falha ao buscar o template: ' + caminho);
        }

        const html = await resposta.text();
        container.innerHTML = html; // limpa o fragmento anterior e injeta o novo
    } catch (erro) {
        container.innerHTML = '<section class="container"><p>Não foi possível carregar esta página. Tente novamente em instantes.</p></section>';
        console.error('[router] ', erro);
    }

    if (ancora) {
        const alvo = document.getElementById(ancora);
        if (alvo) {
            alvo.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        window.scrollTo(0, 0);
    }

    atualizarLinkAtivo(rota);

    // Avisa os demais módulos (máscaras de input, feedback do formulário
    // etc.) que um novo fragmento acabou de ser inserido no DOM, para que
    // eles possam religar seus event listeners nos elementos recém-criados.
    document.dispatchEvent(new CustomEvent('rota:renderizada', { detail: { rota: rota } }));
}

window.addEventListener('hashchange', renderizarRota);
window.addEventListener('DOMContentLoaded', renderizarRota);
