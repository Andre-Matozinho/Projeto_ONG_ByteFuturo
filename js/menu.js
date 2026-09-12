// menu.js
// Controla a abertura/fechamento do menu hambúrguer em telas estreitas.
// A exibição em si é feita via CSS (classe "menu-aberto"); este script só
// alterna a classe e mantém o atributo aria-expanded sincronizado para
// leitores de tela.

document.addEventListener('DOMContentLoaded', function () {

    const botao = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu-principal');

    if (!botao || !menu) {
        return;
    }

    botao.addEventListener('click', function () {
        const aberto = menu.classList.toggle('menu-aberto');
        botao.classList.toggle('is-active', aberto);
        botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    });

    // Fecha o menu automaticamente ao clicar em um link (comum em sites
    // de uma página só ou ao navegar entre páginas do site).
    menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            menu.classList.remove('menu-aberto');
            botao.classList.remove('is-active');
            botao.setAttribute('aria-expanded', 'false');
        });
    });

});
