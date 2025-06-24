/*===================================================*/
/*   MÓDULO DE NAVEGAÇÃO PARA O MODO DE LEITURA      */
/*===================================================*/
/* Este script controla:                             */
/* - A criação dos botões de navegação de capítulos  */
/* - A navegação por setas do teclado (Esq/Dir)      */
/*===================================================*/

(function() {
    'use strict';                                                                  // Ativa o modo estrito do JavaScript (ajuda a evitar erros)

    /*******************************************************************************/
    /* Lida com a navegação por teclas (seta esquerda/direita) no modo de leitura. */
    /* Aciona o clique nos botões de navegação de capítulo correspondentes.        */
    /* @param {KeyboardEvent} evento - O objeto do evento do teclado.              */
    /*******************************************************************************/
    function handleKeyNavigation(evento) {
        // Se o modo leitura não está ativo ou o usuário está digitando em um campo de texto, não faz nada
        if (!window.modoLeituraAtivo || (document.activeElement && /INPUT|TEXTAREA|true/.test(document.activeElement.tagName + document.activeElement.isContentEditable))) {
            return;
        }
        
        const acoes = {                                                            // Define qual botão será ativado ao pressionar as setas do teclado
            "ArrowLeft" : 'modoLeitura-capitulo-anterior',                         // Seta para a esquerda
            "ArrowRight": 'modoLeitura-capitulo-proximo'                           // Seta para a direita
        };
        
        const idBotao = acoes[evento.key];                                         // Pega o id do botão correspondente à tecla pressionada
        if (idBotao) {
            const botao = document.getElementById(idBotao);                        // Procura o botão na página pelo id
            if (botao && !botao.disabled) {                                        // Se o botão existe e está habilitado
                evento.preventDefault();                                           // Impede a ação padrão da tecla
                botao.click();                                                     // Simula um clique no botão
            }
        }
    }

    /********************************************************************************************/
    /*  CORREÇÃO: Esta função AGORA APENAS gera e retorna o HTML dos botões de navegação.       */
    /*  Os eventos serão adicionados depois pela função 'configurarListenersNavegacao'.         */
    /*  @param {string} livro   - O nome do livro atual (ex: 'genesis').                        */
    /*  @param {number} capitulo- O número do capítulo atual.                                   */
    /*  @returns {Promise<string>} Uma promessa que resolve com o HTML dos botões de navegação. */
    /********************************************************************************************/
    window.gerarHtmlNavegacao = async function(livro, capitulo) {
        // Busca o capítulo anterior e o próximo (funções externas)
        const livroCapituloAnterior = await window.obterLivroCapituloAnterior(livro, capitulo);
        const proximoLivroCapitulo  = await window.obterProximoLivroECapitulo(livro, capitulo);
        
        let htmlBotoesNavegacao = '<div class="reading-mode-navigation">';                      // Monta o HTML dos botões de navegação
        
        htmlBotoesNavegacao += livroCapituloAnterior ?                                          // Se existe capítulo anterior, cria botão habilitado, senão, desabilitado
            `<button id="modoLeitura-capitulo-anterior" data-livro="${livroCapituloAnterior.livro}" data-capitulo="${livroCapituloAnterior.capitulo}">Cap. Anterior</button>` :
            `<button id="modoLeitura-capitulo-anterior" disabled>Cap. Anterior</button>`;

        htmlBotoesNavegacao += proximoLivroCapitulo ?                                           // Se existe próximo capítulo, cria botão habilitado, senão, desabilitado
            `<button id="modoLeitura-capitulo-proximo" data-livro="${proximoLivroCapitulo.livro}" data-capitulo="${proximoLivroCapitulo.capitulo}">Cap. Próximo</button>` :
            `<button id="modoLeitura-capitulo-proximo" disabled>Cap. Próximo</button>`;
            
        htmlBotoesNavegacao += '</div>';
        
        return htmlBotoesNavegacao;                                                             // Retorna o HTML pronto
    };

    /********************************************************************************************/
    /* CORREÇÃO: Nova função para configurar os event listeners NOS BOTÕES QUE JÁ ESTÃO NO DOM. */
    /* Deve ser chamada DEPOIS que o innerHTML do container for atualizado.                     */
    /* @param {HTMLElement} containerLeitura - O contêiner onde os botões estão inseridos.      */
    /* @param {string} livro   - O nome do livro atual.                                         */
    /* @param {number} capitulo- O número do capítulo atual.                                    */
    /********************************************************************************************/
    window.configurarListenersNavegacao = async function(containerLeitura, livro, capitulo) {
        const configurarBotaoNavegacao = (id) => {                                              // Função para adicionar o evento de clique em cada botão de navegação
            const botao = containerLeitura.querySelector(`#${id}`);                             // Procura o botão pelo id dentro do container
            if (botao && !botao.disabled) {
                const novoBotao = botao.cloneNode(true);                                        // Remove o evento antigo para evitar duplicidade
                botao.parentNode.replaceChild(novoBotao, botao);

                novoBotao.addEventListener('click', async () => {                               // Adiciona o evento de clique
                    const livroDestino    = novoBotao.dataset.livro;                            // Pega o livro do botão
                    const capituloDestino = parseInt(novoBotao.dataset.capitulo);               // Pega o capítulo do botão
                    window.activeLivro    = livroDestino;                                       // Atualiza o livro ativo
                    window.activeCapitulo = capituloDestino;                                    // Atualiza o capítulo ativo
                    
                    await window.carregarCapituloModoLeitura(livroDestino, capituloDestino);    // Chama a função para carregar o capítulo no modo leitura
                });
            }
        };

        // Configura os eventos para os dois botões
        configurarBotaoNavegacao('modoLeitura-capitulo-anterior');
        configurarBotaoNavegacao('modoLeitura-capitulo-proximo');
    };

    document.addEventListener('keydown', handleKeyNavigation);                                  // Adiciona o evento para ouvir as teclas do teclado (setas)
    console.log('[Navegação Modo Leitura] Módulo corrigido carregado.');                        // Mensagem no console para saber que o módulo foi carregado

})();