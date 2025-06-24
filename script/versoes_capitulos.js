// script/versoes_capitulos.js
// Este arquivo deve conter a função atualizaBotoesCapitulos e qualquer outra função relacionada à criação e manipulação dos botões de capítulos.
// Importe ou defina as dependências necessárias para funcionar de forma independente.

// Função para atualizar os botões de capítulos na tela
window.atualizaBotoesCapitulos = async function(livro, capituloAtual, isReadingMode) {
    const areaConteudo = document.querySelector('section.conteudo');
    if (!areaConteudo) {
        console.error("atualizaBotoesCapitulos: section.conteudo não encontrada.");
        return;
    }

    // Remove todos os contêineres de botões de capítulos existentes
    const containersBotoesCapitulosExistentes = areaConteudo.querySelectorAll('div.capitulos:not(.conteudo-versiculos), #dynamic-chapter-buttons-container');
    containersBotoesCapitulosExistentes.forEach(container => container.remove());

    let containerCapitulos = document.createElement('div');
    containerCapitulos.className = 'capitulos';
    containerCapitulos.id = 'dynamic-chapter-buttons-container';

    const tituloH2 = areaConteudo.querySelector('h2');
    if (tituloH2) tituloH2.insertAdjacentElement('afterend', containerCapitulos);
    else areaConteudo.insertBefore(containerCapitulos, areaConteudo.firstChild);

    // Dependência: obterContagemCapitulosLivro deve estar disponível no escopo global
    if (typeof window.obterContagemCapitulosLivro !== 'function') {
        console.error('Função obterContagemCapitulosLivro não encontrada no escopo global.');
        containerCapitulos.innerHTML = `<p class="error-message">Erro interno: dependência ausente.</p>`;
        return;
    }
    const totalCapitulos = await window.obterContagemCapitulosLivro(livro);
    if (totalCapitulos === 0) {
        containerCapitulos.innerHTML = `<p class="error-message">Não foi possível carregar os capítulos para ${livro}.</p>`;
        return;
    }

    for (let i = 1; i <= totalCapitulos; i++) {
        const botao = document.createElement('button');
        botao.textContent = i;
        botao.dataset.capitulo = i;
        botao.dataset.livro = livro;
        botao.classList.add('botao-capitulo-dinamico');
        if (i === parseInt(capituloAtual)) botao.classList.add('active');
        botao.addEventListener('click', async function() {
            const capituloClicado = parseInt(this.dataset.capitulo);
            const livroClicado = this.dataset.livro;
            window.activeLivro = livroClicado;
            window.activeCapitulo = capituloClicado;

            if (window.modoLeituraAtivo && typeof window.carregarCapituloModoLeitura === 'function') {
                await window.carregarCapituloModoLeitura(livroClicado, capituloClicado);
            } else if (typeof window.toggleVersiculos === 'function') {
                await window.toggleVersiculos(livroClicado, capituloClicado);
            } else {
                console.error("Função toggleVersiculos não encontrada.");
            }
            containerCapitulos.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            if (typeof window.getLivroDisplayName === 'function') {
                const tituloH2Atual = areaConteudo.querySelector('h2');
                if (tituloH2Atual) {
                    let textoTitulo = `${window.getLivroDisplayName(livroClicado)} - CAPÍTULO ${capituloClicado}`;
                    if (!window.modoLeituraAtivo && window.activeVersiculoButton && window.activeVersiculoButton.dataset.versiculo) {
                        textoTitulo += ` - VERSÍCULO ${window.activeVersiculoButton.dataset.versiculo}`;
                    }
                    tituloH2Atual.textContent = textoTitulo;
                }
            }
        });
        containerCapitulos.appendChild(botao);
    }
    // Atualiza as variáveis globais também ao criar os botões, caso ainda não estejam definidas
    if (!window.activeLivro) window.activeLivro = livro;
    if (!window.activeCapitulo) window.activeCapitulo = parseInt(capituloAtual) || 1;
};
