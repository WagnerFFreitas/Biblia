/*===================================================*/
/*           MÓDULO DE CACHE E PERSISTÊNCIA          */
/*===================================================*/
/* Responsável por:                                  */
/* - Gerenciar cache de capítulos e livros           */
/* - Armazenar preferências do usuário               */
/* - Otimizar chamadas de rede                       */
/*===================================================*/

(function() {
    'use strict';

    // Objeto para armazenar dados em cache
    const cache = {
        capitulos: {}, // Cache de capítulos já carregados
        preferencias: {} // Cache de preferências do usuário
    };

    // Chaves para localStorage
    const CHAVES_LOCAL_STORAGE = {
        VERSAO_BIBLICA: 'versaoBiblicaSelecionada',
        MODO_LEITURA: 'modoLeituraAtivo',
        ULTIMO_LIVRO: 'ultimoLivroSelecionado',
        ULTIMO_CAPITULO: 'ultimoCapituloSelecionado',
        ULTIMO_VERSICULO: 'ultimoVersiculoSelecionado'
    };

    // ===================================================
    // FUNÇÕES PARA CACHE DE CAPÍTULOS
    // ===================================================

    /**
     * Armazena um capítulo no cache.
     * @param {string} livro - Nome do livro (ex: 'genesis').
     * @param {number} capitulo - Número do capítulo.
     * @param {object} dados - Dados do capítulo (HTML ou JSON).
     */
    window.cacheCapítulo = function(livro, capitulo, dados) {
        const chave = `${livro.toLowerCase()}_${capitulo}`;
        cache.capitulos[chave] = dados;
    };

    /**
     * Obtém um capítulo do cache.
     * @param {string} livro - Nome do livro.
     * @param {number} capitulo - Número do capítulo.
     * @returns {object|null} Dados do capítulo ou null se não existir.
     */
    window.obterCapítuloDoCache = function(livro, capitulo) {
        const chave = `${livro.toLowerCase()}_${capitulo}`;
        return cache.capitulos[chave] || null;
    };

    /**
     * Limpa o cache de capítulos.
     */
    window.limparCacheCapítulos = function() {
        cache.capitulos = {};
    };

    // ===================================================
    // FUNÇÕES PARA PERSISTÊNCIA (LOCALSTORAGE)
    // ===================================================

    /**
     * Salva uma preferência do usuário no localStorage.
     * @param {string} chave - Chave da preferência.
     * @param {string|boolean|number} valor - Valor a ser armazenado.
     */
    window.salvarPreferencia = function(chave, valor) {
        try {
            localStorage.setItem(chave, JSON.stringify(valor));
            cache.preferencias[chave] = valor;
        } catch (erro) {
            console.error('Erro ao salvar no localStorage:', erro);
        }
    };

    /**
     * Obtém uma preferência do usuário.
     * @param {string} chave - Chave da preferência.
     * @param {any} valorPadrao - Valor padrão se a chave não existir.
     * @returns {any} Valor armazenado ou valor padrão.
     */
    window.obterPreferencia = function(chave, valorPadrao = null) {
        if (cache.preferencias[chave] !== undefined) {
            return cache.preferencias[chave];
        }
        try {
            const valor = localStorage.getItem(chave);
            if (valor === null) return valorPadrao;
            const valorParseado = JSON.parse(valor);
            cache.preferencias[chave] = valorParseado;
            return valorParseado;
        } catch (erro) {
            console.error('Erro ao ler do localStorage:', erro);
            return valorPadrao;
        }
    };

    /**
     * Carrega todas as preferências do usuário no cache.
     */
    window.carregarPreferencias = function() {
        Object.keys(CHAVES_LOCAL_STORAGE).forEach(chave => {
            const chaveStorage = CHAVES_LOCAL_STORAGE[chave];
            cache.preferencias[chaveStorage] = window.obterPreferencia(chaveStorage);
        });
    };

    // Carrega preferências ao inicializar
    window.carregarPreferencias();
})();