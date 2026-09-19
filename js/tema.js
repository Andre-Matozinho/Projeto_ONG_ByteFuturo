// tema.js
// Controla o modo de alto contraste da aplicação ByteFuturo.

document.addEventListener('DOMContentLoaded', function () {
    const botaoContraste = document.getElementById('contraste-toggle');
    const body = document.body;

    if (!botaoContraste) {
        return;
    }

    // Recupera a preferência salva anteriormente.
    const contrasteSalvo = localStorage.getItem('alto-contraste');

    if (contrasteSalvo === 'ativo') {
        ativarAltoContraste();
    }

    botaoContraste.addEventListener('click', function () {
        const ativo = body.classList.toggle('alto-contraste');

        if (ativo) {
            localStorage.setItem('alto-contraste', 'ativo');
            atualizarBotao(true);
        } else {
            localStorage.setItem('alto-contraste', 'inativo');
            atualizarBotao(false);
        }
    });

    function ativarAltoContraste() {
        body.classList.add('alto-contraste');
        atualizarBotao(true);
    }

    function atualizarBotao(ativo) {
        botaoContraste.setAttribute(
            'aria-pressed',
            ativo ? 'true' : 'false'
        );

        botaoContraste.setAttribute(
            'aria-label',
            ativo
                ? 'Desativar modo de alto contraste'
                : 'Ativar modo de alto contraste'
        );

        botaoContraste.textContent = ativo
            ? 'Contraste normal'
            : 'Alto contraste';
    }
});
