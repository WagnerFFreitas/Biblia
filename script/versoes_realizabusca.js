/*===============================================================================*/
/*                    FUNÇÃO DE BUSCA ULTRA-RÁPIDA EM MEMÓRIA                    */
/*===============================================================================*/
/*  Este script agora reporta o progresso da indexação para a interface.         */
/*===============================================================================*/

(function() {
    'use strict';
    
    const CACHE_VERSION = 'v7'; // Incrementado para garantir que o novo índice seja construído
    const MAX_RESULTS = 500;
    
    window.searchEngine = {
        invertedIndex: {},
        versiculos: [],
        versaoAtual: '',
        isReady: false
    };
    
    const livrosBiblicos = ['genesis', 'exodo', 'levitico', 'numeros', 'deuteronomio', 'josue', 'juizes', 'rute', '1samuel', '2samuel', '1reis', '2reis', '1cronicas', '2cronicas', 'esdras', 'neemias', 'ester', 'jo', 'salmos', 'proverbios', 'eclesiastes', 'cantares', 'isaias', 'jeremias', 'lamentacoes', 'ezequiel', 'daniel', 'oseias', 'joel', 'amos', 'obadias', 'jonas', 'miqueias', 'naum', 'habacuque', 'sofonias', 'ageu', 'zacarias', 'malaquias', 'mateus', 'marcos', 'lucas', 'joao', 'atos', 'romanos', '1corintios', '2corintios', 'galatas', 'efesios', 'filipenses', 'colossenses', '1tessalonicenses', '2tessalonicenses', '1timoteo', '2timoteo', 'tito', 'filemom', 'hebreus', 'tiago', '1pedro', '2pedro', '1joao', '2joao', '3joao', 'judas', 'apocalipse'];

    function normalizarTexto(texto) { return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^\w\s]/g, ''); }
    
    function extrairVersiculosDoHTML(htmlString, livro, cap) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const versiculos = [];
        const versiculoNodes = doc.querySelectorAll('div[id^="versiculo-"]');
        
        versiculoNodes.forEach(node => {
            const idMatch = node.id.match(/versiculo-(\d+)/);
            if (idMatch) {
                const vers = parseInt(idMatch[1]);
                let texto = '';
                const cloneNode = node.cloneNode(true);
                cloneNode.querySelectorAll('strong').forEach(strong => strong.remove());
                texto = cloneNode.textContent.trim();
                if (texto) {
                    versiculos.push({ livro: livro, cap: parseInt(cap), vers: vers, texto: texto });
                }
            }
        });
        return versiculos;
    }
    
    async function carregarEConstruirIndice() {
        if (window.searchEngine.isReady && window.searchEngine.versaoAtual === (localStorage.getItem('versaoBiblicaSelecionada') || 'acf')) { return; }
        window.searchEngine.isReady = false;
        console.log("[Busca] Iniciando construção/carregamento do índice...");
        const versao = localStorage.getItem('versaoBiblicaSelecionada') || 'acf';
        const cacheKey = `searchIndex_${versao}_${CACHE_VERSION}`;
        if (await carregarDeIndexedDB(cacheKey)) {
            console.log(`[Busca] Índice carregado do IndexedDB para ${versao}.`);
            window.searchEngine.isReady = true;
            if (typeof window.updateSearchIndexProgress === 'function') window.updateSearchIndexProgress(100, "Pronto!");
            return;
        }
        
        console.log(`[Busca] Construindo índice para ${versao}...`);
        const newInvertedIndex = {}, newVersiculos = [];
        let versiculoId = 0, livrosProcessados = 0;
        const totalLivros = livrosBiblicos.length;
        const isHtmlVersion = versao.toLowerCase() === 'arc';
        const fileExtension = isHtmlVersion ? 'html' : 'json';

        for (const livro of livrosBiblicos) {
            for (let cap = 1; cap <= 150; cap++) {
                try {
                    const res = await fetch(`../versao/${versao}/${livro}/${cap}.${fileExtension}`);
                    if (!res.ok) break;
                    let versiculosCapitulo = [];
                    if (isHtmlVersion) {
                        const htmlString = await res.text();
                        versiculosCapitulo = extrairVersiculosDoHTML(htmlString, livro, cap);
                    } else {
                        const data = await res.json();
                        for (const [vers, texto] of Object.entries(data.versiculos || {})) {
                            versiculosCapitulo.push({ livro: livro, cap: parseInt(cap), vers: parseInt(vers), texto: texto });
                        }
                    }
                    
                    versiculosCapitulo.forEach(versiculoObj => {
                        versiculoObj.id = versiculoId++;
                        newVersiculos.push(versiculoObj);
                        const palavras = normalizarTexto(versiculoObj.texto).split(/\s+/).filter(p => p.length > 1);
                        palavras.forEach(palavra => {
                            if (!newInvertedIndex[palavra]) newInvertedIndex[palavra] = [];
                            newInvertedIndex[palavra].push(versiculoObj);
                        });
                    });
                } catch (erro) { break; }
            }
            livrosProcessados++;
            const progresso = Math.round((livrosProcessados / totalLivros) * 100);
            if (typeof window.updateSearchIndexProgress === 'function') {
                const nomeLivroDisplay = livro.charAt(0).toUpperCase() + livro.slice(1);
                window.updateSearchIndexProgress(progresso, nomeLivroDisplay);
            }
        }
        window.searchEngine.invertedIndex = newInvertedIndex;
        window.searchEngine.versiculos = newVersiculos;
        window.searchEngine.versaoAtual = versao;
        await salvarEmIndexedDB(cacheKey, window.searchEngine);
        console.log(`[Busca] Índice construído e salvo.`);
        window.searchEngine.isReady = true;
        if (typeof window.updateSearchIndexProgress === 'function') window.updateSearchIndexProgress(100, "Pronto!");
    }
    
    async function carregarDeIndexedDB(chave) {
        return new Promise((resolve) => {
            const request = indexedDB.open('BibleSearchDB', 1);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                db.createObjectStore('searchIndexes', { keyPath: 'id' });
            };
            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(['searchIndexes'], 'readonly');
                const store = transaction.objectStore('searchIndexes');
                const getRequest = store.get(chave);
                getRequest.onsuccess = () => {
                    if (getRequest.result) {
                        window.searchEngine = getRequest.result.data;
                        window.searchEngine.versaoAtual = localStorage.getItem('versaoBiblicaSelecionada') || 'acf';
                        resolve(true);
                    } else { resolve(false); }
                };
                getRequest.onerror = () => resolve(false);
            };
            request.onerror = () => resolve(false);
        });
    }
    
    async function salvarEmIndexedDB(chave, dados) {
        return new Promise((resolve) => {
            const request = indexedDB.open('BibleSearchDB', 1);
            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(['searchIndexes'], 'readwrite');
                const store = transaction.objectStore('searchIndexes');
                store.put({ id: chave, data: dados });
                transaction.oncomplete = () => resolve(true);
                transaction.onerror = () => resolve(false);
            };
            request.onerror = () => resolve(false);
        });
    }
    
    window.realizarBuscaAvancada = async function(termo) {
        if (!termo) return [];
        const versaoSelecionada = localStorage.getItem('versaoBiblicaSelecionada') || 'acf';
        if (!window.searchEngine.isReady || window.searchEngine.versaoAtual !== versaoSelecionada) {
            await carregarEConstruirIndice();
        }
        const termoNorm = normalizarTexto(termo);
        const palavrasBusca = termoNorm.split(/\s+/).filter(p => p.length > 1);
        const resultados = combinarEstrategiasBusca(palavrasBusca, termoNorm);
        return resultados.slice(0, MAX_RESULTS);
    };

    function combinarEstrategiasBusca(palavrasBusca, termoOriginalNormalizado) {
        let resultadosFinais = new Map();
        if (palavrasBusca.length > 0) {
            let candidatos = new Map();
            palavrasBusca.forEach(palavra => {
                if (window.searchEngine.invertedIndex[palavra]) {
                    window.searchEngine.invertedIndex[palavra].forEach(ref => {
                        const key = `${ref.livro}-${ref.cap}-${ref.vers}`;
                        candidatos.set(key, (candidatos.get(key) || 0) + 1);
                        if (!resultadosFinais.has(key)) {
                            resultadosFinais.set(key, ref);
                        }
                    });
                }
            });
            const resultadosComTodasPalavras = Array.from(candidatos.entries())
                .filter(([key, count]) => count === palavrasBusca.length)
                .map(([key, count]) => resultadosFinais.get(key));
            const resultadosFinaisFiltrados = resultadosComTodasPalavras.filter(r => 
                normalizarTexto(r.texto).includes(termoOriginalNormalizado)
            );
            if (resultadosFinaisFiltrados.length === 0 && palavrasBusca.length > 1) {
                Array.from(candidatos.entries()).forEach(([key, count]) => {
                    const ref = resultadosFinais.get(key);
                    if (normalizarTexto(ref.texto).includes(termoOriginalNormalizado)) {
                        resultadosFinaisFiltrados.push(ref);
                    }
                });
            }
            return resultadosFinaisFiltrados;
        } else {
            return window.searchEngine.versiculos.filter(r => 
                normalizarTexto(r.texto).includes(termoOriginalNormalizado)
            );
        }
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => { carregarEConstruirIndice(); }, 1000); // Inicia a indexação 1s depois da página carregar
    });
})();