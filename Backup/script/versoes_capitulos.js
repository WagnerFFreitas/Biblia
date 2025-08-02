/*===============================================================================*/
/*                     MÓDULO DE GERENCIAMENTO DE CAPÍTULOS                      */
/*===============================================================================*/
/*  Este script é responsável por:                                               */
/*                       - Criar e exibir a barra de botões de capítulos         */
/*                       - Gerenciar o estado ativo (destaque) do botão atual    */
/*                       - Adicionar a lógica de clique para carregar o conteúdo */
/*                       - Atualizar o título da página ao navegar               */
/*===============================================================================*/

// Este bloco define a função global que cria e atualiza a barra de botões de capítulo.
window.atualizaBotoesCapitulos = async function(livro, capituloAtual, isReadingMode) {
    const areaConteudo = document.querySelector('section.conteudo');                                         // Busca na página o elemento principal onde o conteúdo será exibido.
    if (!areaConteudo) {                                                                                     // Verifica se a área de conteúdo foi encontrada.
        console.error("atualizaBotoesCapitulos: section.conteudo não encontrada.");                          // Exibe um erro no console se a área não for encontrada.
        return;                                                                                              // Interrompe a execução da função se a área de conteúdo não existir.
    }

    // Este bloco busca e remove containers antigos de botões para evitar duplicação.
    const containersBotoesCapitulosExistentes = areaConteudo.querySelectorAll('div.capitulos:not(.conteudo-versiculos), #dynamic-chapter-buttons-container');
    containersBotoesCapitulosExistentes.forEach(container => container.remove());                            // Percorre cada container antigo encontrado e o remove da página.
    let containerCapitulos = document.createElement('div');                                                  // Cria um novo elemento <div> na memória para guardar os novos botões.
    containerCapitulos.className = 'capitulos';                                                              // Define a classe CSS do novo container para estilização.
    containerCapitulos.id = 'dynamic-chapter-buttons-container';                                             // Define um ID único para o container, facilitando sua busca futura.

    // Este bloco insere o novo container de botões na página, logo após o título H2.
    const tituloH2 = areaConteudo.querySelector('h2');                                                       // Busca o elemento do título H2 como ponto de referência.
    if (tituloH2) tituloH2.insertAdjacentElement('afterend', containerCapitulos);                            // Se o H2 existir, insere o container de botões logo após ele.
    else areaConteudo.insertBefore(containerCapitulos, areaConteudo.firstChild);                             // Senão, insere o container no início da área de conteúdo.

    // Este bloco verifica se a função dependente 'obterContagemCapitulosLivro' existe.
    if (typeof window.obterContagemCapitulosLivro !== 'function') {                                          // Verifica se a função, que vem de outro módulo, está disponível.
        console.error('Função obterContagemCapitulosLivro não encontrada no escopo global.');                // Exibe um erro crítico no console se a dependência estiver ausente.
        containerCapitulos.innerHTML = `<p class="error-message">Erro interno: dependência ausente.</p>`;    // Exibe uma mensagem de erro para o usuário.
        return;                                                                                              // Interrompe a execução da função.
    }

    // Este bloco busca o número total de capítulos e lida com possíveis erros.
    const totalCapitulos = await window.obterContagemCapitulosLivro(livro);                                  // Aguarda a contagem de capítulos do livro, usando a função de outro módulo.
    if (totalCapitulos === 0) {                                                                              // Se não houver capítulos (ou ocorreu um erro na contagem)...
        containerCapitulos.innerHTML = `<p class="error-message">Não foi possível carregar os capítulos para ${livro}.</p>`; // ...exibe uma mensagem de erro.
        return;                                                                                              // Interrompe a execução da função.
    }
    
    // Este bloco inicia um laço de repetição para criar um botão para cada capítulo.
    for (let i = 1; i <= totalCapitulos; i++) {
        const botao = document.createElement('button');                                                      // Cria um novo elemento <button> na memória.
        botao.textContent = i;                                                                               // Define o texto visível do botão como o número do capítulo.
        botao.dataset.capitulo = i;                                                                          // Armazena o número do capítulo no atributo 'data-capitulo'.
        botao.dataset.livro = livro;                                                                         // Armazena o nome do livro no atributo 'data-livro'.
        botao.classList.add('botao-capitulo-dinamico');                                                      // Adiciona uma classe CSS genérica para estilização.
        if (i === parseInt(capituloAtual)) botao.classList.add('active');                                    // Se for o capítulo atual, adiciona a classe 'active' para destaque.
        botao.addEventListener('click', async function() {                                                   // Adiciona o "ouvinte" que define o que acontece quando o botão é clicado.
            const capituloClicado = parseInt(this.dataset.capitulo);                                         // Pega o número do capítulo a partir do atributo 'data-capitulo' do botão clicado.
            const livroClicado = this.dataset.livro;                                                         // Pega o nome do livro a partir do atributo 'data-livro' do botão clicado.
            window.activeLivro = livroClicado;                                                               // Atualiza a variável global que armazena o livro ativo.
            window.activeCapitulo = capituloClicado;                                                         // Atualiza a variável global que armazena o capítulo ativo.

            if (window.modoLeituraAtivo && typeof window.carregarCapituloModoLeitura === 'function') {       // Verifica se o modo leitura está ativo para decidir qual função chamar.
                await window.carregarCapituloModoLeitura(livroClicado, capituloClicado);                     // Carregar o capítulo completo no modo leitura.
            } else if (typeof window.toggleVersiculos === 'function') {                                      // Exibir os botões de versículo no modo padrão.
                await window.toggleVersiculos(livroClicado, capituloClicado);                                // Exibir os botões de versículo.
            } else {                                                                                         // Exibir erro se nenhuma função de carregamento for encontrada.
                console.error("Função toggleVersiculos não encontrada.");                                    // Exibir erro no console.
            }                                                                                                // Finalizar a lógica de carregamento.
            containerCapitulos.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));    // Remover a classe 'active' de todos os botões de capítulo.
            this.classList.add('active');                                                                    // Adicionar a classe 'active' ao botão clicado.
            if (typeof window.getLivroDisplayName === 'function') {                                          // Verificar se a função para obter o nome do livro existe.
                const tituloH2Atual = areaConteudo.querySelector('h2');                                      // Buscar o elemento do título H2 para atualizar.
                if (tituloH2Atual) {                                                                         // Atualizar o título H2 se encontrado.
                    let textoTitulo = `${window.getLivroDisplayName(livroClicado)} - CAPÍTULO ${capituloClicado}`; // Montar a string de texto para o novo título.
                    if (!window.modoLeituraAtivo && window.activeVersiculoButton && window.activeVersiculoButton.dataset.versiculo) {
                        textoTitulo += ` - VERSÍCULO ${window.activeVersiculoButton.dataset.versiculo}`;     // Adicionar o número do versículo ao título.
                    }

                    tituloH2Atual.textContent = textoTitulo;                                                 // Definir o texto final do título H2.
                }
            }
        });

        containerCapitulos.appendChild(botao);                                                               // Adiciona o botão recém-criado e configurado ao container de capítulos.
    }


    if (!window.activeLivro) window.activeLivro = livro;                                                     // Define o livro ativo se ele ainda não estiver definido.
    if (!window.activeCapitulo) window.activeCapitulo = parseInt(capituloAtual) || 1;                        // Define o capítulo ativo se ele ainda não estiver definido.
};