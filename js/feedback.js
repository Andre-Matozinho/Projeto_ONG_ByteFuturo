// feedback.js
// Aciona o toast de confirmação ao enviar o formulário de cadastro.
//
// O <div id="toast"> vive no shell da SPA (html/index.html) e nunca é
// substituído, mas o <form id="form-cadastro"> só existe quando a rota
// "cadastro" está renderizada dentro de #app. Por isso a ligação do
// evento de submit é refeita a cada "rota:renderizada" (disparado pelo
// router.js), e não apenas uma vez no DOMContentLoaded.
//
// Observação para quem for integrar o back-end depois: o projeto ainda
// não tem um servidor real recebendo esse formulário (o action="#" é só
// um placeholder), então o preventDefault() abaixo existe apenas para a
// página não recarregar e o toast poder aparecer. Quando houver uma rota
// real de back-end, o ideal é trocar esse bloco por um fetch()/XHR: em
// caso de sucesso, chamar mostrarToast(); em caso de erro, reaproveitar
// o mesmo componente trocando a classe para exibir uma variação de erro.

let timeoutToast = null;

function mostrarToast(mensagem) {
    const toast = document.getElementById('toast');

    if (!toast) {
        return;
    }

    if (mensagem) {
        toast.querySelector('span:last-child').textContent = mensagem;
    }

    toast.classList.add('is-visible');
    clearTimeout(timeoutToast);
    timeoutToast = setTimeout(function () {
        toast.classList.remove('is-visible');
    }, 4000);
}

document.addEventListener('rota:renderizada', function () {

    const form = document.getElementById('form-cadastro');

    if (!form) {
        return; // rota atual não é a de cadastro, nada a fazer aqui
    }

    form.addEventListener('submit', function (evento) {
        evento.preventDefault(); // ver observação acima: ainda não há back-end real
        mostrarToast();
    });

});
