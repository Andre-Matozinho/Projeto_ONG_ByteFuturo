// mascaras.js
// Aplica formatação em tempo real nos campos de CPF, Telefone e CEP
// enquanto o usuário digita, sem depender de bibliotecas externas.
//
// Como a página de cadastro agora é um template injetado pela SPA (ver
// js/router.js) e não um documento carregado do zero, esses campos não
// existem ainda no DOMContentLoaded quando a rota inicial é outra. Por
// isso o script escuta o evento customizado "rota:renderizada", disparado
// pelo router toda vez que um novo fragmento é inserido no DOM, e só liga
// as máscaras quando os campos realmente existem na página atual.

document.addEventListener('rota:renderizada', function () {

    const campoCpf = document.getElementById('cpf');
    const campoTelefone = document.getElementById('telefone');
    const campoCep = document.getElementById('cep');

    if (!campoCpf || !campoTelefone || !campoCep) {
        return; // rota atual não é a de cadastro, nada a fazer aqui
    }

    // Máscara de CPF: 000.000.000-00
    campoCpf.addEventListener('input', function (evento) {
        let valor = evento.target.value.replace(/\D/g, ''); // remove tudo que não é número
        valor = valor.slice(0, 11); // limita a 11 dígitos

        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

        evento.target.value = valor;
    });

    // Máscara de Telefone: (00) 00000-0000 ou (00) 0000-0000
    campoTelefone.addEventListener('input', function (evento) {
        let valor = evento.target.value.replace(/\D/g, '');
        valor = valor.slice(0, 11);

        if (valor.length > 10) {
            // celular com 9 dígitos: (00) 00000-0000
            valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
            valor = valor.replace(/(\d{5})(\d{1,4})$/, '$1-$2');
        } else {
            // fixo com 8 dígitos: (00) 0000-0000
            valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
            valor = valor.replace(/(\d{4})(\d{1,4})$/, '$1-$2');
        }

        evento.target.value = valor;
    });

    // Máscara de CEP: 00000-000
    campoCep.addEventListener('input', function (evento) {
        let valor = evento.target.value.replace(/\D/g, '');
        valor = valor.slice(0, 8);

        valor = valor.replace(/(\d{5})(\d{1,3})$/, '$1-$2');

        evento.target.value = valor;
    });

});
