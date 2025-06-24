/*===================================================*/
/*        SCRIPT PRINCIPAL DE VERSÕES BÍBLICAS       */
/*===================================================*/
/* Este script controla:                             */
/* - Carregamento das versões da Bíblia              */
/* - Navegação entre capítulos                       */
/* - Modo de leitura contínua                        */
/* - Interação do usuário com a Bíblia               */
/*===================================================*/

(function() { 
    'use strict';

    // Função para obter parâmetro da URL
    function obterParametroUrl(parametro) {
        const parametrosUrl = new URLSearchParams(window.location.search);
        return parametrosUrl.get(parametro);
    }

    // Função para carregar scripts JS de forma assíncrona
    function carregaScriptAssincrono(origem, id) {
        return new Promise((resolve, reject) => {
            const scriptAntigo = document.getElementById(id);
            if (scriptAntigo) scriptAntigo.remove();
            const novoScript = document.createElement('script');
            novoScript.src = origem;
            novoScript.id = id;
            novoScript.async = false;
            novoScript.onload = () => resolve();
            novoScript.onerror = (evento) => {
                console.error(`Falha ao carregar: ${origem}`, evento);
                reject(new Error(`Falha ${origem}`));
            };
            document.body.appendChild(novoScript);
        });
    }

    // Define o nome completo da versão (pode ser sobrescrito pelo script da versão)
    window.NOME_VERSAO_COMPLETA_BIBLIA = 'Versão King James';

    //=========================================================
    // As funções do MODO LEITURA foram movidas para 'versoes_modoleitura.js'
    //=========================================================
    
    // Inicializa o estado global das variáveis. O módulo do modo leitura irá gerenciá-las.
    window.modoLeituraAtivo = false;
    window.ultimoLivroSelecionado = null;
    window.ultimoCapituloSelecionado = null;
    window.ultimoVersiculoSelecionado = null;

    // Inicializa a versão da Bíblia e carrega todos os módulos necessários
    async function inicializarVersao(codigoVersao) {
        console.log(`[Principal] Inicializando ${codigoVersao.toUpperCase()}`);
        document.body.className = '';
        document.body.classList.add(['arc'].includes(codigoVersao.toLowerCase()) ? 'versao-html-ativa' : 'versao-json-ativa');
        try {
            // Carrega os módulos em ordem de dependência
            await carregaScriptAssincrono('../script/versoes_cache.js', 'script-versoes-cache');
            await carregaScriptAssincrono('../script/versoes_navegacao.js', 'script-versoes-navegacao'); // Contém a lógica de dados da Bíblia
            await carregaScriptAssincrono('../script/versoes_capitulos.js', 'script-versoes-capitulos'); // Contém atualizaBotoesCapitulos
            await carregaScriptAssincrono('../script/versoes_versiculos.js', 'script-versoes-versiculos'); // Contém toggleVersiculos, etc.
            await carregaScriptAssincrono('../script/versoes_interface.js', 'script-versoes-interface');
            await carregaScriptAssincrono('../script/versoes_navegacao_modoleitura.js', 'script-versoes-navegacao-modoleitura');
            
            // **CORREÇÃO: Carrega o novo módulo do modo leitura**
            await carregaScriptAssincrono('../script/versoes_modoleitura.js', 'script-versoes-modoleitura');

            // Carrega o script da versão específica
            await carregaScriptAssincrono(`../script/${codigoVersao.toLowerCase()}.js`, 'script-versao-biblica');
            
            // Define o título da página (agora que o nome da versão está disponível)
            window.defineTituloPagina(codigoVersao);

            // Carrega scripts adicionais
            await carregaScriptAssincrono(`../script/slide.js`, 'script-slide');
            if (typeof window.inicializarDropdowns === 'function') window.inicializarDropdowns();
            if (typeof window.inicializarSobre === 'function') window.inicializarSobre();
            if (typeof window.inicializarSlide === 'function') window.inicializarSlide();
            
            // Configura o botão do Modo Leitura
            const botaoModoLeitura = document.getElementById('modo-leitura');
            if (botaoModoLeitura) {
                const novoBotao = botaoModoLeitura.cloneNode(true);
                botaoModoLeitura.parentNode.replaceChild(novoBotao, botaoModoLeitura);
                novoBotao.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Chama a função que agora está no módulo 'versoes_modoleitura.js'
                    window.toggleReadingMode(!window.modoLeituraAtivo, window.activeLivro, window.activeCapitulo);
                });
            }
            console.log(`[Principal] ${codigoVersao.toUpperCase()} inicializada.`);
        } catch (erro) {
            console.error(`[Principal] Erro init ${codigoVersao.toUpperCase()}:`, erro);
            window.defineTituloPagina(codigoVersao);
            alert(`Erro ao inicializar ${codigoVersao.toUpperCase()}.`);
        }
    }
    
    // Função global para definir o título da página
    window.defineTituloPagina = function(codigoVersao) {
        const elementoTituloPrincipal = document.getElementById('titulo-principal-versao');
        const elementoSubtituloExtenso = document.getElementById('subtitulo-versao-extenso');
        if (elementoTituloPrincipal) elementoTituloPrincipal.textContent = `Bíblia Sagrada ${codigoVersao.toUpperCase()}`;
        if (elementoSubtituloExtenso) {
            if (window.NOME_VERSAO_COMPLETA_BIBLIA) elementoSubtituloExtenso.textContent = window.NOME_VERSAO_COMPLETA_BIBLIA;
            else elementoSubtituloExtenso.textContent = '';
        }
    }

    // Inicializa a página e eventos do seletor
    function initializePage() {
        const seletor = document.getElementById('seletor-versao-principal');
        let opcoesValidas = ['arc', 'ara', 'nvi', 'acf', 'ntlh', 'kjv', 'naa', 'original'];
        let versaoPadrao = 'arc';
        if (seletor && seletor.options.length > 0) {
            opcoesValidas = Array.from(seletor.options).map(opcao => opcao.value);
            versaoPadrao = seletor.value || opcoesValidas[0];
        }
        
        // Usa a função de preferência se existir
        let versaoInicial = obterParametroUrl('versao') || (typeof window.obterPreferencia === 'function' ? window.obterPreferencia('versaoBiblicaSelecionada', 'arc') : localStorage.getItem('versaoBiblicaSelecionada') || 'arc');

        if (!opcoesValidas.includes(versaoInicial.toLowerCase())) versaoInicial = opcoesValidas[0];
        if (seletor) seletor.value = versaoInicial;
        
        // Salva a preferência usando a função do módulo de cache, se existir
        if (window.salvarPreferencia) window.salvarPreferencia('versaoBiblicaSelecionada', versaoInicial); 
        else localStorage.setItem('versaoBiblicaSelecionada', versaoInicial);
        
        inicializarVersao(versaoInicial);
        
        if (seletor) {
            seletor.addEventListener('change', (e) => {
                if (window.salvarPreferencia) window.salvarPreferencia('versaoBiblicaSelecionada', e.target.value); 
                else localStorage.setItem('versaoBiblicaSelecionada', e.target.value);
                window.location.search = `?versao=${e.target.value}`;
            });
        }
        
        const listaVersoes = document.getElementById('versoes-list');
        if (listaVersoes && seletor && opcoesValidas.length > 0) {
            listaVersoes.innerHTML = '';
            const opcoesTexto = Object.fromEntries(Array.from(seletor.options).map(opcao => [opcao.value, opcao.textContent]));
            opcoesValidas.forEach(versao => {
                const itemLista = document.createElement('li');
                const link = document.createElement('a');
                link.href = `?versao=${versao}`;
                link.textContent = opcoesTexto[versao] || versao.toUpperCase();
                itemLista.appendChild(link);
                listaVersoes.appendChild(itemLista);
            });
        }
    }
    document.addEventListener('DOMContentLoaded', initializePage);

})();