// router.js
// Roteador em JavaScript puro para a SPA da ByteFuturo.

const CONTAINER_ID = 'app';

const ROTAS = {
    '': '../html/templates/inicio.html',
    'projetos': '../html/templates/projetos.html',
    'cadastro': '../html/templates/cadastro.html',
};

const TITULOS = {
    '': 'ByteFuturo — Democratizando o Acesso à Tecnologia',
    'projetos': 'Projetos — ByteFuturo',
    'cadastro': 'Cadastre-se — ByteFuturo',
};

function interpretarHash() {
    const partes = window.location.hash.replace(/^#\/?/, '').split('/');

    return {
        rota: partes[0] || '',
        ancora: partes[1] || null,
    };
}

function atualizarLinkAtivo(rota) {
    document.querySelectorAll('[data-rota]').forEach(function (link) {
        const ativo = link.dataset.rota === rota;

        link.classList.toggle('link-ativo', ativo);

        if (ativo) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

function atualizarTitulo(rota) {
    document.title = TITULOS[rota] || TITULOS[''];
}

function moverFocoParaConteudo(container, ancora) {
    if (ancora) {
        const alvo = document.getElementById(ancora);

        if (alvo) {
            alvo.setAttribute('tabindex', '-1');
            alvo.focus({ preventScroll: true });
            alvo.scrollIntoView({ behavior: 'smooth' });
            return;
        }
    }

    const tituloPrincipal = container.querySelector('h1');

    if (tituloPrincipal) {
        tituloPrincipal.setAttribute('tabindex', '-1');
        tituloPrincipal.focus({ preventScroll: true });
    } else {
        container.focus({ preventScroll: true });
    }

    window.scrollTo(0, 0);
}

async function renderizarRota() {
    const { rota, ancora } = interpretarHash();
    const rotaValida = ROTAS[rota] !== undefined ? rota : '';
    const caminho = ROTAS[rotaValida];
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
        container.innerHTML = html;

        atualizarTitulo(rotaValida);
        atualizarLinkAtivo(rotaValida);
        moverFocoParaConteudo(container, ancora);

    } catch (erro) {
        container.innerHTML = `
            <section class="container" role="alert">
                <h1>Não foi possível carregar esta página</h1>
                <p>Tente novamente em instantes.</p>
            </section>
        `;

        container.focus();
        console.error('[router]', erro);
    }

    document.dispatchEvent(
        new CustomEvent('rota:renderizada', {
            detail: { rota: rotaValida }
        })
    );
}

window.addEventListener('hashchange', renderizarRota);
window.addEventListener('DOMContentLoaded', renderizarRota);
