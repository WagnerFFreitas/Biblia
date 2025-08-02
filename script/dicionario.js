/*===============================================================================*/
/*                      SCRIPT DO DICIONÁRIO BÍBLICO (COMPLETO)                  */                 
/*===============================================================================*/
/*      - Define a classe Dicionario para gerenciar a interatividade.            */
/*      - Carrega dados de termos bíblicos sob demanda.                          */
/*      - Implementa busca, paginação e exibição de definições.                  */
/*===============================================================================*/

class Dicionario {
    // Este bloco e o construtor da classe Dicionario.
    constructor() {
        this.currentLetter = null;                                                 // Armazena a letra atualmente selecionada (ex: 'A').
        this.currentPage = 0;                                                      // Controla a página atual para a paginação.
        this.itemsPerPage = 50;                                                    // Define a quantidade de itens a serem mostrados por página.
        this.allTermos = [];                                                       // Mantém um array com todos os termos da letra carregada.
        this.listaLetras = null;                                                   // Armazena em cache o arquivo de mapeamento de letras (lista_letras.json).
        this.initializeElements();                                                 // Mapeia os elementos do DOM.
        this.bindEvents();                                                         // Vincula os eventos de interatividade.
    }

    // Este bloco mapeia os elementos do DOM para a propriedade 'elements' para fácil acesso.
    initializeElements() {
        this.elements = {
            dicionarioInput: document.querySelector('#secao-dicionario .dicionario-busca input'),  // Busca o campo de input da busca do dicionário.
            dicionarioResultados: document.getElementById('dicionario-resultados'),                // Busca o container onde os resultados serão exibidos.
            secaoDicionario: document.getElementById('secao-dicionario'),                          // Busca o elemento da seção principal do dicionário.
        };
    }

    // Este bloco vincula todos os eventos necessários para a interatividade do dicionário.
    bindEvents() {                                                                                 // Validação para garantir que os elementos essenciais existem no DOM.
        if (!this.elements.dicionarioInput || !this.elements.secaoDicionario) {
            console.error("Elementos essenciais do dicionário não foram encontrados no DOM.");     // Exibe um erro se elementos cruciais não forem encontrados.
            return;
        }

        // Este bloco adiciona evento de clique para CADA botão de letra no menu alfabético.
        document.querySelectorAll('.letra-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // A ação só é executada se a seção do dicionário estiver ativa, evitando chamadas desnecessárias.
                if (this.elements.secaoDicionario.classList.contains('secao-ativa')) {
                    const letra = btn.dataset.letra;                                               // Obtém a letra do atributo 'data-letra' do botão.
                    this.loadAndDisplayLetter(letra);                                              // Chama a função para carregar e exibir os termos da letra.
                }
            });
        });

        // Este bloco adiciona evento de digitação no campo de busca para filtrar resultados em tempo real.
        this.elements.dicionarioInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);                                                     // Chama o manipulador de busca com o valor do input.
        });
    }

    // Este bloco cria o método de inicialização chamado quando a aba "Dicionário" é ativada.
    init() {
        // Limpa o campo de busca se existir
        if (this.elements.dicionarioInput) this.elements.dicionarioInput.value = '';
        
        // Seleciona automaticamente a letra "A"
        const letraA = document.querySelector('.letra-btn[data-letra="A"]');
        if (letraA) {
            // Remove classe active de todas as letras
            document.querySelectorAll('.letra-btn.active').forEach(btn => btn.classList.remove('active'));
            // Adiciona classe active na letra A
            letraA.classList.add('active');
            // Carrega e exibe os termos da letra A
            this.loadAndDisplayLetter('A');
        } else {
            // Fallback caso o botão da letra A não seja encontrado
            if (this.elements.dicionarioResultados) {
                this.elements.dicionarioResultados.innerHTML = `<p class="mensagem-inicial">Escolha uma letra para exibir os termos do dicionário.</p>`;
            }
        }
        
        this.clearPagination();                                                                    // Remove qualquer controle de paginação existente.
    }

    // Este bloco carrega e exibe os termos do dicionário para uma letra específica.
    async loadAndDisplayLetter(letra) {
        if (!letra) return;                                                                                  // Aborta se a letra não for válida.
        this.currentLetter = letra.toUpperCase();                                                            // Atualiza a letra atual no estado da classe.
        this.updateActiveLetterButton(this.currentLetter);                                                   // Atualiza a interface para destacar o botão da letra ativa.

        // Este bloco limpa a interface antes de carregar novos dados.
        if (this.elements.dicionarioInput) this.elements.dicionarioInput.value = '';                         // Limpa o campo de busca.
        // Exibe um spinner de carregamento.
        this.elements.dicionarioResultados.innerHTML = '<div class="loading-container"><div class="loading-spinner"></div><p>Carregando dados...</p></div>';
        this.clearPagination();                                                                              // Limpa a paginação anterior.

        // Este bloco carrega o mapa de arquivos (lista_letras.json) se ainda não estiver em cache.
        if (!this.listaLetras) {
            try {
                const response = await fetch('../dicionario/lista_letras.json');                                       // Faz a requisição para o arquivo de índice.
                if (!response.ok) throw new Error('Falha ao carregar o índice de arquivos (lista_letras.json).');      // Lança um erro se a requisição falhar.
                this.listaLetras = await response.json();                                                              // Armazena o índice em cache.
            } catch (error) {
                this.elements.dicionarioResultados.innerHTML = `<p class="erro-mensagem">${error.message}</p>`;        // Exibe mensagem de erro na interface.
                return;
            }
        }

        // Este bloco obtém a lista de arquivos para a letra selecionada.
        const arquivos = this.listaLetras[letra.toLowerCase()];
        if (!arquivos || arquivos.length === 0) { 
            // Informa se não há termos.
            this.elements.dicionarioResultados.innerHTML = `<p class="mensagem-inicial">Nenhum termo encontrado para a letra "${letra}".</p>`;
            return;
        }

        // Este bloco carrega os dados dos arquivos JSON correspondentes à letra.
        try {
            const allTermos = [];

            await Promise.all(arquivos.map(async (nomeArquivo) => {                                          // Usa Promise.all para carregar todos os arquivos da letra em paralelo.
                const response = await fetch(`../dicionario/${letra.toLowerCase()}/${nomeArquivo}.json`);    // Carrega cada arquivo JSON.
                if (response.ok) {
                    const jsonData = await response.json();
                    const termos = jsonData[letra.toUpperCase()] || [];                                      // Extrai os termos do JSON.
                    allTermos.push(...termos);                                                               // Adiciona os termos ao array principal.
                }
            }));

            this.allTermos = allTermos;                                                                      // Armazena todos os termos carregados.
            this.currentPage = 0;                                                                            // Reseta a paginação para a primeira página.
            this.renderDictionaryResults(this.getCurrentPageTerms());                                        // Renderiza a primeira página de resultados.
            this.renderPagination();                                                                         // Cria os controles de paginação.
        } catch (error) {
             // Exibe erro de carregamento.
            this.elements.dicionarioResultados.innerHTML = `<p class="erro-mensagem">Erro ao carregar dados: ${error.message}</p>`;
        }
    }

    // Este bloco renderiza os resultados do dicionário no DOM.
    renderDictionaryResults(results) {
        if (!results || results.length === 0) {                                                              // Exibe mensagem se não houver resultados.
            this.elements.dicionarioResultados.innerHTML = `<div class="sem-resultados"><h3>Nenhum termo encontrado</h3></div>`;
            return;
        }

        // Este bloco mapeia cada resultado para seu elemento HTML e junta tudo em uma string.
        const resultsHtml = results.map(item => this.createDefinitionElement(item)).join('');
        this.elements.dicionarioResultados.innerHTML = resultsHtml;                                          // Insere o HTML gerado no container de resultados.

        // Adiciona eventos de clique para expandir/recolher as definições.
        this.elements.dicionarioResultados.querySelectorAll('.palavra-header').forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;                                                   // Obtém o conteúdo da definição.
                const indicator = header.querySelector('.expand-indicator');                                 // Obtém o ícone indicador.
                const isExpanded = content.style.display === 'block';                                        // Verifica se o conteúdo está visível.
                
                content.style.display = isExpanded ? 'none' : 'block';                                       // Alterna a visibilidade do conteúdo.
                indicator.classList.toggle('expanded', !isExpanded);                                         // Alterna a classe do indicador para rotação.
            });
        });
    }

    // Este bloco cria o HTML para um único item de definição
    createDefinitionElement(item) {                                                                          // Extrai os dados do item, com valores padrão para segurança.
        const definicaoPrincipal = item.definicao || 'Definição não disponível.';
        const definicaoAdicional = item.definicaoAdicional || '';
        const referencias = item.referencias || [];
        const referencesHtml = referencias.map(ref => `<div class="referencia-item">${ref}</div>`).join(''); // Mapeia as referências para elementos HTML.

        return `                                                                                             <!-- Retorna a string HTML completa para o item. -->
            <div class="definicao-item">
                <div class="palavra-header">
                    <span class="palavra-titulo">${item.termo.toUpperCase()}</span>
                    <span class="expand-indicator">▼</span>
                </div>
                <div class="definicao-content" style="display:none;">
                    <div class="definicao-texto">${definicaoPrincipal}</div>
                    ${definicaoAdicional ? `<div class="definicao-adicional">${definicaoAdicional}</div>` : ''}
                    ${referencesHtml ? `
                        <div class="referencias-section">
                            <div class="referencias-titulo">Referências</div>
                            ${referencesHtml}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // Este bloco renderiza os controles de paginação e os insere na barra de busca.
    renderPagination() {
        const linhaBusca = document.querySelector('#secao-dicionario .dicionario-linha');                    // Busca o container da barra superior.
        if (!linhaBusca) return;

        this.clearPagination();                                                                              // Garante que não haja controles de paginação duplicados.

        // Este bloco calcula os índices para a página atual.
        const total = this.allTermos.length;
        const startIndex = this.currentPage * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, total);
        const showingTotal = Math.min((this.currentPage + 1) * this.itemsPerPage, total);                    // Calcula o total de itens exibidos até a página atual.

        if (total === 0) return;                                                                             // Não mostra paginação se não houver resultados.

        // Este bloco cria o contêiner para os controles de paginação.
        const paginacaoGrupo = document.createElement("div");
        paginacaoGrupo.className = "dicionario-paginacao-grupo";

        // Este bloco gera o HTML para os botões e o contador.
        const html = `
            <button id="btn-anterior-dicionario" class="btn-paginacao" ${this.currentPage === 0 ? "disabled" : ""}>ANTERIOR</button>
            <span class="contador-dicionario">Mostrando ${showingTotal} de ${total} resultados</span>
            <button id="btn-proximo-dicionario" class="btn-paginacao" ${endIndex >= total ? "disabled" : ""}>PRÓXIMO</button>
        `;

        paginacaoGrupo.innerHTML = html;
        linhaBusca.appendChild(paginacaoGrupo);                                                              // Adiciona o grupo de paginação à barra superior.

        // Este bloco vincula os eventos de clique aos novos botões.
        const btnAnterior = document.getElementById("btn-anterior-dicionario");
        const btnProximo = document.getElementById("btn-proximo-dicionario");

        if (btnAnterior) {
            btnAnterior.onclick = () => {
                if (this.currentPage > 0) {
                    this.currentPage--;                                                                      // Decrementa a página atual.
                    this.renderDictionaryResults(this.getCurrentPageTerms());                                // Renderiza os novos resultados.
                    this.renderPagination();                                                                 // Re-renderiza a paginação para atualizar o estado dos botões.
                }
            };
        }

        if (btnProximo) {
            btnProximo.onclick = () => {
                if (endIndex < total) {
                    this.currentPage++;                                                                      // Incrementa a página atual.
                    this.renderDictionaryResults(this.getCurrentPageTerms());                                // Renderiza os novos resultados.
                    this.renderPagination();                                                                 // Re-renderiza a paginação.
                }
            };
        }
    }
    
    // Este bloco remove o grupo de paginação da tela.
    clearPagination() {
        const oldPag = document.querySelector('#secao-dicionario .dicionario-paginacao-grupo');
        if (oldPag) oldPag.remove();                                                                         // Remove o elemento do DOM se ele existir.
    }

    // Este bloco retorna a fatia de termos correspondente à página atual.
    getCurrentPageTerms() {
        const start = this.currentPage * this.itemsPerPage;                                                  // Calcula o índice inicial.
        const end = start + this.itemsPerPage;                                                               // Calcula o índice final.
        return this.allTermos.slice(start, end);                                                             // Retorna a fatia do array.
    }

    // Este bloco filtra os resultados com base no termo de busca digitado pelo usuário.
    handleSearch(searchTerm) {
        const term = searchTerm.trim().toLowerCase();                                                        // Normaliza o termo de busca.

        // Este bloco verifica se a busca é limpa, e se for, volta a exibir os resultados paginados da letra selecionada.
        if (term.length === 0) {
            if (this.currentLetter) {
                this.renderDictionaryResults(this.getCurrentPageTerms());                                    // Restaura a visualização paginada.
                this.renderPagination();                                                                     // Restaura a paginação.
            } else {
                this.init();                                                                                 // Se nenhuma letra foi selecionada, reseta a view.
            }
            return;
        }

        // Este bloco filtra os resultados de `allTermos` com base no termo de busca.
        const filteredResults = this.allTermos.filter(item =>
            item.termo.toLowerCase().includes(term)                                                          // Compara o termo de forma insensível a maiúsculas/minúsculas.
        );
        
        this.clearPagination();                                                                              // Remove a paginação durante a busca.
        this.renderDictionaryResults(filteredResults);                                                       // Renderiza os resultados filtrados.
    }

    // Este bloco atualiza a classe 'active' no botão da letra correspondente no menu lateral.
    updateActiveLetterButton(letra) {
        document.querySelectorAll('.letra-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.letra.toUpperCase() === letra.toUpperCase());         // Alterna a classe 'active' com base na correspondência da letra.
        });
    }
}
