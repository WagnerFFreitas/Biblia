/*===============================================================================*/
/*                     SCRIPT PRINCIPAL DE VERSÕES BÍBLICAS                      */
/*===============================================================================*/
/*  Este script controla:                                                        */
/*                       - Carregamento das versões da Bíblia                    */
/*                       - Navegação entre capítulos                             */
/*                       - Modo de leitura contínua                              */
/*                       - Interação do usuário com a Bíblia                     */
/*===============================================================================*/

// Este bloco cria o IIFE para isolar o escopo do script e evitar conflitos globais
(function() { 
    'use strict';                                                                            // Habilita o modo restrito do JavaScript para evitar más práticas

    // Este bloco cria a função para obter parâmetro da URL
    function obterParametroUrl(parametro) {
        const parametrosUrl = new URLSearchParams(window.location.search);                   // Obtém os parâmetros da URL
        return parametrosUrl.get(parametro);                                                 // Retorna o valor do parâmetro solicitado
    }

    // Este bloco cria a função para carregar os arquivos em JS de forma assíncrona
    function carregaScriptAssincrono(origem, id) {
        return new Promise((resolve, reject) => {
            const scriptAntigo = document.getElementById(id);                               // Busca script antigo pelo id
            if (scriptAntigo) scriptAntigo.remove();                                        // Remove script antigo se existir
            const novoScript = document.createElement('script');                            // Cria novo elemento script
            novoScript.src = origem;                                                        // Define a origem do script
            novoScript.id = id;                                                             // Define o id do script
            novoScript.async = false;                                                       // Define para não ser assíncrono
            novoScript.onload = () => resolve();                                            // Resolve a promise ao carregar
            novoScript.onerror = (evento) => {
                console.error(`Falha ao carregar: ${origem}`, evento);                      // Loga erro no console
                reject(new Error(`Falha ${origem}`));                                       // Rejeita a promise em caso de erro
            };
            document.body.appendChild(novoScript);                                          // Adiciona o script ao body
        });
    }

    window.NOME_VERSAO_COMPLETA_BIBLIA = 'Versão King James';                                // Define o nome completo da versão (pode ser sobrescrito pelo script da versão)

    /*===============================================================================*/
    //   As funções do MODO LEITURA foram movidas para 'versoes_modoleitura.js'      */
    /*===============================================================================*/
    
    // Este bloco inicializa o estado global das variáveis. O módulo do modo leitura irá gerenciá-las.
    window.modoLeituraAtivo = false;                                                        // Indica se o modo leitura está ativo
    window.ultimoLivroSelecionado = null;                                                   // Último livro selecionado
    window.ultimoCapituloSelecionado = null;                                                // Último capítulo selecionado
    window.ultimoVersiculoSelecionado = null;                                               // Último versículo selecionado

    // Este bloco cria a função para inicializa a versão da Bíblia e carrega todos os módulos necessários
    async function inicializarVersao(codigoVersao) {
        console.log(`[Principal] Inicializando ${codigoVersao.toUpperCase()}`);                                                  // Loga início da inicialização
        document.body.className = '';                                                                                            // Limpa as classes do body
        document.body.classList.add(['arc'].includes(codigoVersao.toLowerCase()) ? 'versao-html-ativa' : 'versao-json-ativa');   // Adiciona classe conforme versão
        try {
            // Este bloco carrega os módulos em ordem de dependência
            await carregaScriptAssincrono('../script/versoes_cache.js', 'script-versoes-cache');                                 // Cache de dados da Bíblia
            await carregaScriptAssincrono('../script/versoes_navegacao.js', 'script-versoes-navegacao');                         // Contém a lógica de dados da Bíblia
            await carregaScriptAssincrono('../script/versoes_capitulos.js', 'script-versoes-capitulos');                         // Contém atualizaBotoesCapitulos
            await carregaScriptAssincrono('../script/versoes_versiculos.js', 'script-versoes-versiculos');                       // Contém toggleVersiculos, etc.
            await carregaScriptAssincrono('../script/versoes_interface.js', 'script-versoes-interface');                         // Interface da versão
            await carregaScriptAssincrono('../script/versoes_navegacao_modoleitura.js', 'script-versoes-navegacao-modoleitura'); // Navegação modo leitura
            await carregaScriptAssincrono('../script/versoes_modoleitura.js', 'script-versoes-modoleitura');                     // Carrega o Módulo Leitura

            await carregaScriptAssincrono(`../script/${codigoVersao.toLowerCase()}.js`, 'script-versao-biblica');                // Carrega o script da versão específica

            window.defineTituloPagina(codigoVersao);                                                                             // Define o título da página (agora que o nome da versão está disponível)

            // Este bloco carrega o Modulo Slide
            await carregaScriptAssincrono(`../script/slide.js`, 'script-slide');
            if (typeof window.inicializarDropdowns === 'function') window.inicializarDropdowns();                                // Inicializa dropdowns se existir
            if (typeof window.inicializarSobre === 'function') window.inicializarSobre();                                        // Inicializa sobre se existir
            if (typeof window.inicializarSlide === 'function') window.inicializarSlide();                                        // Inicializa slide se existir

            // Este bloco configura o botão do Modo Leitura
            const botaoModoLeitura = document.getElementById('modo-leitura');                                                    // Busca botão do modo leitura
            if (botaoModoLeitura) {
                const novoBotao = botaoModoLeitura.cloneNode(true);                                                              // Clona o botão para remover eventos antigos
                botaoModoLeitura.parentNode.replaceChild(novoBotao, botaoModoLeitura);                                           // Substitui o botão antigo
                novoBotao.addEventListener('click', (e) => {
                    e.preventDefault();                                                                                          // Previne comportamento padrão
                    window.toggleReadingMode(!window.modoLeituraAtivo, window.activeLivro, window.activeCapitulo);               // Chama a função que agora está no módulo 'versoes_modoleitura.js'
                });
            }
            console.log(`[Principal] ${codigoVersao.toUpperCase()} inicializada.`);                                              // Loga sucesso
        } catch (erro) {
            console.error(`[Principal] Erro init ${codigoVersao.toUpperCase()}:`, erro);                                         // Loga erro
            window.defineTituloPagina(codigoVersao);                                                                             // Tenta definir o título mesmo em erro
            alert(`Erro ao inicializar ${codigoVersao.toUpperCase()}.`);                                                         // Alerta usuário
        }
    }
    
    // Este bloco cria a função global para definir o título da página
    window.defineTituloPagina = function(codigoVersao) {
        const elementoTituloPrincipal = document.getElementById('titulo-principal-versao');                                      // Elemento do título principal
        const elementoSubtituloExtenso = document.getElementById('subtitulo-versao-extenso');                                    // Elemento do subtítulo
        if (elementoTituloPrincipal) elementoTituloPrincipal.textContent = `Bíblia Sagrada ${codigoVersao.toUpperCase()}`;       // Define título
        if (elementoSubtituloExtenso) {
            if (window.NOME_VERSAO_COMPLETA_BIBLIA) elementoSubtituloExtenso.textContent = window.NOME_VERSAO_COMPLETA_BIBLIA;   // Define subtítulo
            else elementoSubtituloExtenso.textContent = '';                                                                      // Limpa subtítulo se não houver nome
        }
    }

    // Este bloco cria a função que inicializa a página e eventos do seletor
    function initializePage() {
        const seletor = document.getElementById('seletor-versao-principal');                                                     // Busca o seletor de versões
        let opcoesValidas = ['arc', 'ara', 'nvi', 'acf', 'ntlh', 'kjv', 'naa', 'original'];                                      // Opções padrão
        let versaoPadrao = 'arc';                                                                                                // Versão padrão
        if (seletor && seletor.options.length > 0) {
            opcoesValidas = Array.from(seletor.options).map(opcao => opcao.value);                                               // Atualiza opções válidas
            versaoPadrao = seletor.value || opcoesValidas[0];                                                                    // Atualiza versão padrão
        }
        
        // Este bloco usa a função de preferência se existir
        let versaoInicial = obterParametroUrl('versao') || (typeof window.obterPreferencia === 'function' ? window.obterPreferencia('versaoBiblicaSelecionada', 'arc') : localStorage.getItem('versaoBiblicaSelecionada') || 'arc');
        if (!opcoesValidas.includes(versaoInicial.toLowerCase())) versaoInicial = opcoesValidas[0];                              // Garante versão válida
        if (seletor) seletor.value = versaoInicial;                                                                              // Define valor do seletor
        if (window.salvarPreferencia) window.salvarPreferencia('versaoBiblicaSelecionada', versaoInicial);                       // Salva a preferência usando a função do módulo de cache, se existir
        else localStorage.setItem('versaoBiblicaSelecionada', versaoInicial);                                                    // Salva no localStorage

        inicializarVersao(versaoInicial);                                                                                        // Inicializa a versão selecionada

        // Este bloco configura o seletor existe das versões
        if (seletor) {
            seletor.addEventListener('change', (e) => {                                                                          // Evento ao mudar a versão
                if (window.salvarPreferencia) window.salvarPreferencia('versaoBiblicaSelecionada', e.target.value);              // Salva preferência se função existir
                else localStorage.setItem('versaoBiblicaSelecionada', e.target.value);                                           // Salva nova preferência
                window.location.search = `?versao=${e.target.value}`;                                                            // Atualiza a URL para recarregar a versão
            });
        }
        // Este bloco busca a lista de versões
        const listaVersoes = document.getElementById('versoes-list');
        if (listaVersoes && seletor && opcoesValidas.length > 0) {
            listaVersoes.innerHTML = '';                                                                                         // Limpa lista
            const opcoesTexto = Object.fromEntries(Array.from(seletor.options).map(opcao => [opcao.value, opcao.textContent]));  // Mapeia textos
            opcoesValidas.forEach(versao => {
                const itemLista = document.createElement('li');                                                                  // Cria item da lista
                const link = document.createElement('a');                                                                        // Cria link
                link.href = `?versao=${versao}`;                                                                                 // Define href
                link.textContent = opcoesTexto[versao] || versao.toUpperCase();                                                  // Define texto
                itemLista.appendChild(link);
                listaVersoes.appendChild(itemLista);
            });
        }
    }

    document.addEventListener('DOMContentLoaded', initializePage);                                                               // inicia a pagina quando o DOM e carregado

})();