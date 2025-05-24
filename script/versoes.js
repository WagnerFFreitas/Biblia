// --- START OF FILE versoes.js ---

/**
 * versoes.js
 * Este é o módulo principal responsável por gerenciar todas as versões bíblicas disponíveis.
 * Ele lida com o carregamento dinâmico de versões, navegação entre capítulos,
 * modo de leitura e interações do usuário.
 * 
 * Funcionalidades principais:
 * - Gerenciamento de diferentes versões da Bíblia (ARA, ACF, NVI, etc.)
 * - Controle do modo de leitura
 * - Navegação entre capítulos
 * - Sistema de cache para melhor performance
 * - Gestão de estado da interface do usuário
 */

(function() {
    'use strict';

    // === CONSTANTES E CONFIGURAÇÕES ===
    /**
     * Ordem oficial dos livros da Bíblia, usada para navegação
     * e organização do conteúdo
     */
    const BIBLE_BOOKS_ORDER = [
        'genesis', 'exodo', 'levitico', 'numeros', 'deuteronomio', 'josue', 'juizes', 'rute',
        '1samuel', '2samuel', '1reis', '2reis', '1cronicas', '2cronicas', 'esdras', 'neemias',
        'ester', 'jo', 'salmos', 'proverbios', 'eclesiastes', 'cantares', 'isaias', 'jeremias',
        'lamentacoes', 'ezequiel', 'daniel', 'oseias', 'joel', 'amos', 'obadias', 'jonas',
        'miqueias', 'naum', 'habacuque', 'sofonias', 'ageu', 'zacarias', 'malaquias',
        'mateus', 'marcos', 'lucas', 'joao', 'atos', 'romanos', '1corintios', '2corintios',
        'galatas', 'efesios', 'filipenses', 'colossenses', '1tessalonicenses', '2tessalonicenses',
        '1timoteo', '2timoteo', 'tito', 'filemom', 'hebreus', 'tiago', '1pedro', '2pedro',
        '1joao', '2joao', '3joao', 'judas', 'apocalipse'
    ];

    /**
     * Cache para armazenar o número de capítulos por livro
     * Melhora a performance evitando requisições repetidas
     */
    const chapterCountCache = {};

    // === FUNÇÕES UTILITÁRIAS ===
    /**
     * Obtém parâmetros da URL
     * @param {string} param Nome do parâmetro a ser buscado
     * @returns {string|null} Valor do parâmetro ou null se não encontrado
     */
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    /**
     * Carrega um script JavaScript de forma assíncrona
     * @param {string} src Caminho do script a ser carregado
     * @param {string} id ID único para o elemento script
     * @returns {Promise} Promise que resolve quando o script é carregado
     */
    function loadScriptAsync(src, id) {
        return new Promise((resolve, reject) => {
            const oldScript = document.getElementById(id);
            if (oldScript) oldScript.remove(); 
            const script = document.createElement('script');
            script.src = src;
            script.id = id;
            script.async = false; 
            script.onload = () => resolve();
            script.onerror = (event) => {
                console.error(`Falha ao carregar: ${src}`, event);
                reject(new Error(`Falha ${src}`));
            };
            document.body.appendChild(script); 
        });
    }

    /**
     * Atualiza os títulos da página com a versão atual da Bíblia
     * @param {string} versaoCod Código da versão (ara, acf, nvi, etc)
     */
    function setPageTitle(versaoCod) {
        const h1PrincipalEl = document.getElementById('titulo-principal-versao');
        const subtituloExtensoEl = document.getElementById('subtitulo-versao-extenso');

        if (h1PrincipalEl) {
            h1PrincipalEl.textContent = `Bíblia Sagrada ${versaoCod.toUpperCase()}`;
        } else {
            console.warn("Elemento #titulo-principal-versao não encontrado.");
        }

        if (subtituloExtensoEl) {
            if (window.BIBLE_VERSION_FULL_NAME) {
                subtituloExtensoEl.textContent = window.BIBLE_VERSION_FULL_NAME;
            } else {
                subtituloExtensoEl.textContent = '';
                console.warn(`window.BIBLE_VERSION_FULL_NAME não definido para a versão ${versaoCod}. Subtítulo não será exibido.`);
            }
        } else {
            console.warn("Elemento #subtitulo-versao-extenso não encontrado.");
        }
    }

    // === FUNÇÕES DE VERIFICAÇÃO DE CAPÍTULOS ===
    /**
     * Verifica se um capítulo específico existe na versão atual
     * ATENÇÃO: Esta função ainda assume JSON para `chapterExists`. Se versões HTML não tiverem JSON, precisará de ajuste.
     * No entanto, `getBookChapterCount` agora usa `getSpecificVerseCount` como fallback, que é mais confiável.
     * @param {string} livro Nome do livro
     * @param {number} capitulo Número do capítulo
     * @returns {Promise<boolean>} True se o capítulo existe
     */
    async function chapterExists(livro, capitulo) {
        try {
            const versaoAtual = localStorage.getItem('versaoBiblicaSelecionada') || 'ara';
            // Define quais versões usam HTML. Adicione outras aqui se necessário.
            const versoesQueUsamHtml = ['arc']; 
            const isHtmlVersion = versoesQueUsamHtml.includes(versaoAtual.toLowerCase());
            
            let path;
            if (isHtmlVersion) {
                path = `../version/${versaoAtual.toLowerCase()}/${livro.toLowerCase()}/${capitulo}.html`;
            } else {
                path = `../version/${versaoAtual.toLowerCase()}/${livro.toLowerCase()}/${capitulo}.json`;
            }
            
            const response = await fetch(path, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            console.error(`Erro ao verificar capítulo ${livro} ${capitulo}:`, error);
            return false;
        }
    }

    /**
     * Obtém o número total de capítulos de um livro
     * Usa sistema de cache para melhor performance
     * @param {string} livro Nome do livro
     * @returns {Promise<number>} Número total de capítulos
     */
    async function getBookChapterCount(livro) {
        const livroKey = livro.toLowerCase();
        if (chapterCountCache[livroKey]) {
            return chapterCountCache[livroKey];
        }
        
        // Tenta obter do objeto 'livros' em biblia-navegacao.js
        if (window.livros && window.livros[livroKey] && window.livros[livroKey].capitulos) {
            const count = window.livros[livroKey].capitulos;
             chapterCountCache[livroKey] = count;
            return count;
        }
        
        // Fallback: Descobrir verificando quais capítulos existem (HEAD request)
        // Isso pode ser menos eficiente, mas é um último recurso.
        console.warn(`[Capítulos] Número de capítulos para ${livro} não encontrado em 'window.livros'. Tentando descobrir...`);
        let maxChapter = 0;
        // Verificar até 150 capítulos (máximo bíblico)
        for (let cap = 1; cap <= 150; cap++) {
            if (await chapterExists(livroKey, cap)) {
                maxChapter = cap;
            } else {
                // Se não existe ou o anterior não existia (e maxChapter ainda é 0), paramos.
                // Se o primeiro capítulo não existir, maxChapter será 0.
                if (cap > 1 && maxChapter === 0) maxChapter = cap -1; //Se o cap 1 nao existe mas os outros sim
                break; 
            }
        }
        
        if (maxChapter === 0) {
            console.error(`[Capítulos] Não foi possível determinar o número de capítulos para ${livroKey}. Verifique os arquivos.`);
        } else {
            console.log(`[Capítulos] ${livroKey} tem ${maxChapter} capítulos (descoberto via HEAD).`);
        }
        chapterCountCache[livroKey] = maxChapter;
        return maxChapter;
    }

    // === FUNÇÕES DE NAVEGAÇÃO ===
    /**
     * Determina o próximo capítulo/livro na sequência
     * @param {string} currentBook Livro atual
     * @param {number} currentChapter Capítulo atual
     * @returns {Promise<{livro: string, capitulo: number}|null>} Próximo capítulo ou null se fim
     */
    async function getNextBookAndChapter(currentBook, currentChapter) {
        const currentBookIndex = BIBLE_BOOKS_ORDER.indexOf(currentBook.toLowerCase());
        if (currentBookIndex === -1) {
            console.warn(`Livro ${currentBook} não encontrado na ordem dos livros`);
            return null;
        }

        const totalCapitulosLivroAtual = await getBookChapterCount(currentBook);

        if (currentChapter < totalCapitulosLivroAtual) {
            console.log(`[Navegação] Próximo: ${currentBook} ${currentChapter + 1} (mesmo livro)`);
            return { livro: currentBook, capitulo: currentChapter + 1 };
        }

        // Se não há próximo capítulo no livro atual, ir para o próximo livro
        if (currentBookIndex < BIBLE_BOOKS_ORDER.length - 1) {
            const nextBook = BIBLE_BOOKS_ORDER[currentBookIndex + 1];
            console.log(`[Navegação] Próximo: ${nextBook} 1 (próximo livro)`);
            return { livro: nextBook, capitulo: 1 };
        }

        // Se é o último livro e último capítulo
        console.log(`[Navegação] Fim da Bíblia alcançado`);
        return null;
    }

    /**
     * Determina o capítulo/livro anterior na sequência
     * @param {string} currentBook Livro atual
     * @param {number} currentChapter Capítulo atual
     * @returns {Promise<{livro: string, capitulo: number}|null>} Capítulo anterior ou null se início
     */
    async function getPreviousBookAndChapter(currentBook, currentChapter) {
        const currentBookIndex = BIBLE_BOOKS_ORDER.indexOf(currentBook.toLowerCase());
        if (currentBookIndex === -1) {
            console.warn(`Livro ${currentBook} não encontrado na ordem dos livros`);
            return null;
        }

        // Se há capítulo anterior no livro atual
        if (currentChapter > 1) {
            console.log(`[Navegação] Anterior: ${currentBook} ${currentChapter - 1} (mesmo livro)`);
            return { livro: currentBook, capitulo: currentChapter - 1 };
        }

        // Se não há capítulo anterior, ir para o livro anterior
        if (currentBookIndex > 0) {
            const previousBook = BIBLE_BOOKS_ORDER[currentBookIndex - 1];
            const lastChapterOfPreviousBook = await getBookChapterCount(previousBook);

            console.log(`[Navegação] Anterior: ${previousBook} ${lastChapterOfPreviousBook} (livro anterior)`);
            return { livro: previousBook, capitulo: lastChapterOfPreviousBook };
        }

        // Se é o primeiro livro e primeiro capítulo
        console.log(`[Navegação] Início da Bíblia alcançado`);
        return null;
    }

    // === FUNÇÕES DE INTERFACE ===
    /**
     * Atualiza os botões de navegação entre capítulos
     * @param {string} livro Livro atual
     * @param {number} capituloAtual Capítulo atual
     * @param {boolean} isReadingMode Se está no modo leitura
     */
    async function updateChapterButtons(livro, capituloAtual, isReadingMode) {
        const contentArea = document.querySelector('section.content');
        if (!contentArea) return;

        let capitulosContainer = contentArea.querySelector('div.capitulos:not(.versiculos-content):not(.book-content)'); // Container principal dos botões de capítulos
        if (!capitulosContainer) {
            capitulosContainer = document.createElement('div');
            capitulosContainer.className = 'capitulos'; // Classe genérica para os botões de capítulos
            
            const titleH2 = contentArea.querySelector('h2');
            if (titleH2) {
                titleH2.insertAdjacentElement('afterend', capitulosContainer);
            } else {
                contentArea.insertBefore(capitulosContainer, contentArea.firstChild);
            }
        }
        capitulosContainer.innerHTML = ''; // Limpar botões existentes
        
        const totalCapitulos = await getBookChapterCount(livro);
        if (totalCapitulos === 0) {
             capitulosContainer.innerHTML = `<p class="error-message">Não foi possível carregar os capítulos para ${livro}.</p>`;
             return;
        }
        
        for (let i = 1; i <= totalCapitulos; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.dataset.capitulo = i;
            button.dataset.livro = livro; // Adicionar livro ao dataset para consistência
             button.classList.add('botao-capitulo-dinamico'); // Classe para diferenciar dos botões de biblia-navegacao
            
            if (i === parseInt(capituloAtual)) {
                button.classList.add('active');
            }
            
            button.addEventListener('click', async function() {
                const capituloClicado = parseInt(this.dataset.capitulo);
                const livroClicado = this.dataset.livro;

                window.activeLivro = livroClicado; // Definido em biblia-navegacao.js
                window.activeCapitulo = capituloClicado; // Definido em biblia-navegacao.js
                
                if (window.isReadingModeEnabled) { // window.isReadingModeEnabled definido neste arquivo
                    await window.loadChapterInReadingMode(livroClicado, capituloClicado);
                } else {
                    if (typeof window.toggleVersiculos === 'function') { // window.toggleVersiculos de biblia-navegacao.js
                        window.toggleVersiculos(livroClicado, capituloClicado);
                    } else {
                        console.error("Função toggleVersiculos não encontrada.");
                    }
                }
                
                // Atualizar botões ativos
                const buttons = capitulosContainer.querySelectorAll('button');
                buttons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                if (typeof window.getLivroDisplayName === 'function') { // window.getLivroDisplayName de biblia-navegacao.js
                    const titleH2 = contentArea.querySelector('h2');
                    if (titleH2) {
                        titleH2.textContent = `${window.getLivroDisplayName(livroClicado)} - CAPÍTULO ${capituloClicado}`;
                    }
                }
            });
            capitulosContainer.appendChild(button);
        }
        console.log(`[Capítulos] Criados ${totalCapitulos} botões dinâmicos para ${livro}`);
    }


    // === FUNÇÕES DO MODO DE LEITURA ===
    window.isReadingModeEnabled = false;
    window.expandedVerses = new Set(); // Armazena os versículos expandidos antes de entrar no modo de leitura

    window.loadChapterInReadingMode = async function(livro, capitulo) {
        const contentArea = document.querySelector('section.content');
        if (!contentArea) { 
            console.error('[Modo Leitura] section.content não encontrado.'); 
            return; 
        }

        // Remover elementos do modo normal que podem ter sido deixados para trás
        const normalVerseTextDisplayImmediate = contentArea.querySelector('.versiculo-texto'); 
        const verseButtonsDisplayImmediate = contentArea.querySelector('.versiculos-content'); 
        const looseVerseButtons = contentArea.querySelector('div.versiculos:not(.versiculos-content)');
        if (normalVerseTextDisplayImmediate) normalVerseTextDisplayImmediate.remove();
        if (verseButtonsDisplayImmediate) verseButtonsDisplayImmediate.remove();
        if (looseVerseButtons) looseVerseButtons.remove();

        await updateChapterButtons(livro, capitulo, true);

        let readingContainer = contentArea.querySelector('.reading-mode-content');
        if (!readingContainer) {
            readingContainer = document.createElement('div');
            readingContainer.className = 'reading-mode-content';
            const chaptersContainer = contentArea.querySelector('div.capitulos:not(.versiculos-content):not(.book-content)');
            const titleH2 = contentArea.querySelector('h2');
            if (chaptersContainer) {
                chaptersContainer.insertAdjacentElement('afterend', readingContainer);
            } else if (titleH2) {
                titleH2.insertAdjacentElement('afterend', readingContainer);
            } else {
                contentArea.appendChild(readingContainer); 
            }
        }
        readingContainer.innerHTML = '<div class="loading-message">Carregando capítulo...</div>';
        readingContainer.style.display = 'block';

        try {
            const versaoAtual = localStorage.getItem('versaoBiblicaSelecionada') || 'ara';
            const capituloNum = parseInt(capitulo);

            const versoesQueUsamHtml = ['arc']; 
            const isHtmlVersion = versoesQueUsamHtml.includes(versaoAtual.toLowerCase());

            console.log(`[Modo Leitura] Carregando: ${livro.toUpperCase()} ${capituloNum} (Versão: ${versaoAtual}, HTML: ${isHtmlVersion})`);

            let htmlParaExibir = '';
            
            const nextBookChapter = await getNextBookAndChapter(livro, capituloNum);
            const prevBookChapter = await getPreviousBookAndChapter(livro, capituloNum);

            let navButtonsHtml = '<div class="reading-mode-navigation">'; 
            if (prevBookChapter) {
                navButtonsHtml += `<button id="prev-chapter-reading-mode" data-livro="${prevBookChapter.livro}" data-capitulo="${prevBookChapter.capitulo}">Cap. Anterior</button>`;
            } else {
                navButtonsHtml += `<button id="prev-chapter-reading-mode" disabled>Cap. Anterior</button>`;
            }
            if (nextBookChapter) {
                navButtonsHtml += `<button id="next-chapter-reading-mode" data-livro="${nextBookChapter.livro}" data-capitulo="${nextBookChapter.capitulo}">Cap. Próximo</button>`;
            } else {
                navButtonsHtml += `<button id="next-chapter-reading-mode" disabled>Cap. Próximo</button>`;
            }
            navButtonsHtml += '</div>';

            if (isHtmlVersion) {
                const chapterHtmlPath = `../version/${versaoAtual.toLowerCase()}/${livro.toLowerCase()}/${capituloNum}.html`;
                const response = await fetch(chapterHtmlPath);
                if (!response.ok) {
                    throw new Error(`Erro ao carregar capítulo HTML ${capituloNum} (${response.status}) de ${chapterHtmlPath}`);
                }
                const htmlString = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlString, 'text/html');
                
                const versiculosContainerNoArquivo = doc.querySelector('div.versiculos');
                if (versiculosContainerNoArquivo) {
                    htmlParaExibir = versiculosContainerNoArquivo.innerHTML;
                } else {
                    const bodyContent = doc.body ? doc.body.innerHTML : '';
                    if (bodyContent.trim() === '') {
                         throw new Error('Arquivo HTML do capítulo está vazio ou não contém a estrutura esperada (div.versiculos).');
                    }
                    console.warn(`[Modo Leitura HTML] Contêiner 'div.versiculos' não encontrado em ${chapterHtmlPath}. Usando body.innerHTML como fallback.`);
                    htmlParaExibir = bodyContent;
                }
            } else {
                const jsonPath = `../version/${versaoAtual.toLowerCase()}/${livro.toLowerCase()}/${capituloNum}.json`;
                const response = await fetch(jsonPath);
                if (!response.ok) {
                    throw new Error(`Erro ao carregar capítulo JSON ${capituloNum} (${response.status}) de ${jsonPath}`);
                }
                const data = await response.json();
                
                let numVersiculos = 0;
                if (typeof window.getSpecificVerseCount === 'function') { 
                    numVersiculos = window.getSpecificVerseCount(livro, capituloNum);
                }
                const effectiveNumVersiculos = numVersiculos > 0 ? numVersiculos : (data.versiculos ? Object.keys(data.versiculos).length : 0);

                if (effectiveNumVersiculos === 0 && (!data.versiculos || Object.keys(data.versiculos).length === 0)) {
                    throw new Error('Nenhum versículo encontrado neste capítulo (JSON).');
                }

                let htmlVerses = '<div class="chapter-verses">';
                if (data.titulo) { 
                    htmlVerses += `<h3 class="chapter-main-title">${data.titulo}</h3>`;
                }
                for (let i = 1; i <= effectiveNumVersiculos; i++) {
                    const verseKey = String(i);
                    if (data.versiculos && data.versiculos[verseKey]) {
                        if (data.titulos && data.titulos[verseKey]) { 
                            htmlVerses += `<h3 class="verse-section-title">${data.titulos[verseKey]}</h3>`;
                        }
                        htmlVerses += `<div class="verse-container"><sup class="verse-number">${i}</sup><span class="verse-text">${data.versiculos[verseKey]}</span></div>`;
                    }
                }
                htmlVerses += '</div>';
                htmlParaExibir = htmlVerses;
            }
            
            readingContainer.innerHTML = navButtonsHtml + htmlParaExibir; 

            const prevBtn = readingContainer.querySelector('#prev-chapter-reading-mode');
            if (prevBtn && !prevBtn.disabled) {
                prevBtn.addEventListener('click', async () => {
                    const prevLivro = prevBtn.dataset.livro;
                    const prevCapitulo = parseInt(prevBtn.dataset.capitulo);
                    window.activeLivro = prevLivro; 
                    window.activeCapitulo = prevCapitulo;
                    await window.loadChapterInReadingMode(prevLivro, prevCapitulo);
                    if (typeof window.getLivroDisplayName === 'function') { 
                        const titleH2 = contentArea.querySelector('h2');
                        if (titleH2) {
                            titleH2.textContent = `${window.getLivroDisplayName(prevLivro)} - CAPÍTULO ${prevCapitulo}`;
                        }
                    }
                });
            }
            
            const nextBtn = readingContainer.querySelector('#next-chapter-reading-mode');
            if (nextBtn && !nextBtn.disabled) {
                nextBtn.addEventListener('click', async () => {
                    const nextLivro = nextBtn.dataset.livro;
                    const nextCapitulo = parseInt(nextBtn.dataset.capitulo);
                    window.activeLivro = nextLivro;
                    window.activeCapitulo = nextCapitulo;
                    await window.loadChapterInReadingMode(nextLivro, nextCapitulo);
                    if (typeof window.getLivroDisplayName === 'function') {
                        const titleH2 = contentArea.querySelector('h2');
                        if (titleH2) {
                            titleH2.textContent = `${window.getLivroDisplayName(nextLivro)} - CAPÍTULO ${nextCapitulo}`;
                        }
                    }
                });
            }
            
            const titleH2 = contentArea.querySelector('h2');
            if(titleH2) {
                titleH2.textContent = `${window.getLivroDisplayName(livro)} - CAPÍTULO ${capituloNum}`;
                titleH2.style.color = '#f0ad4e'; 
                titleH2.style.textAlign = 'center';
                titleH2.style.marginBottom = '20px';
            }
            
        } catch (error) {
            console.error('[Modo Leitura] Erro:', error);
            const versaoAtual = localStorage.getItem('versaoBiblicaSelecionada') || 'ara';
            const isHtml = ['arc'].includes(versaoAtual.toLowerCase());
            const attemptedPath = isHtml ? 
                `../version/${versaoAtual.toLowerCase()}/${livro.toLowerCase()}/${capitulo}.html` :
                `../version/${versaoAtual.toLowerCase()}/${livro.toLowerCase()}/${capitulo}.json`;

            readingContainer.innerHTML = `
                <div class="error-container" style="padding: 20px; border: 1px solid #d9534f; background-color: #f2dede; color: #a94442; border-radius: 4px;">
                    <p style="font-weight: bold;">⚠️ Erro ao carregar capítulo ${capitulo} de ${livro.toUpperCase()}</p>
                    <p style="font-size: 0.9em; margin-top: 5px;">Detalhes: ${error.message}</p>
                    <p style="font-size: 0.8em; color: #777; margin-top: 5px;">Tentativa de acesso: ${attemptedPath}</p>
                    <p style="margin-top: 15px;">Por favor, tente:</p>
                    <ul style="list-style: disc; padding-left: 20px; margin: 10px 0; font-size: 0.9em;">
                        <li>Verificar se o arquivo do capítulo existe para esta versão e formato.</li>
                        <li>Navegar para outro capítulo.</li>
                        <li>Recarregar a página.</li>
                    </ul>
                    <div style="margin-top: 20px;">
                        <button onclick="history.back()" style="padding: 8px 12px; margin-right: 10px; cursor: pointer;">Voltar</button>
                        <button onclick="location.reload()" style="padding: 8px 12px; cursor: pointer;">Recarregar</button>
                    </div>
                </div>
            `;
        }
    };

    window.toggleReadingMode = async function(enable, livro, capitulo) {
        window.isReadingModeEnabled = enable;
        const btn = document.getElementById('modo-leitura');
        if (btn) { 
            btn.classList.toggle('active', enable); 
            btn.setAttribute('aria-pressed', String(enable)); 
        }
        
        const contentArea = document.querySelector('section.content');
        if (!contentArea) return;

        const normalVerseTextDisplay = contentArea.querySelector('.versiculo-texto'); 
        const verseButtonsDisplay = contentArea.querySelector('.versiculos-content');
        const looseVerseButtons = contentArea.querySelector('div.versiculos:not(.versiculos-content)');
        let readingModeDisplay = contentArea.querySelector('.reading-mode-content');
        const titleH2 = contentArea.querySelector('h2');

        if (enable) { 
            if (window.activeLivro && window.activeCapitulo) {
                window.lastActiveLivro = window.activeLivro;
                window.lastActiveCapitulo = window.activeCapitulo;
            } else if (livro && capitulo) {
                window.lastActiveLivro = livro;
                window.lastActiveCapitulo = capitulo;
            }
            
            window.expandedVerses.clear();
            const verseButtons = contentArea.querySelectorAll('.versiculos-content button.active'); // Mudado para .versiculos-content
            verseButtons.forEach(button => {
                const verseNumber = button.dataset.versiculo;
                if (verseNumber) {
                    window.expandedVerses.add(parseInt(verseNumber));
                }
            });
            
            if (normalVerseTextDisplay) normalVerseTextDisplay.remove();
            if (verseButtonsDisplay) verseButtonsDisplay.remove();
            if (looseVerseButtons) looseVerseButtons.remove();
            
            const livroParaCarregar = livro || window.lastActiveLivro;
            const capituloParaCarregar = capitulo || window.lastActiveCapitulo;

            if (livroParaCarregar && capituloParaCarregar) {
                await window.loadChapterInReadingMode(livroParaCarregar, capituloParaCarregar); 
            } else { 
                if (!readingModeDisplay) {
                    readingModeDisplay = document.createElement('div');
                    readingModeDisplay.className = 'reading-mode-content';
                    const chaptersContainer = contentArea.querySelector('div.capitulos:not(.versiculos-content):not(.book-content)');
                    if (chaptersContainer) chaptersContainer.insertAdjacentElement('afterend', readingModeDisplay);
                    else if (titleH2) titleH2.insertAdjacentElement('afterend', readingModeDisplay);
                    else contentArea.appendChild(readingModeDisplay);
                }
                readingModeDisplay.innerHTML = '<p style="text-align:center; padding:20px;">Selecione um livro e capítulo.</p>';
                readingModeDisplay.style.display = 'block';
                if(titleH2) titleH2.textContent = "Modo Leitura";
            }
            document.body.classList.add('module-leitura'); // Adiciona classe ao body
        } else { 
            document.body.classList.remove('module-leitura'); // Remove classe do body
            if (readingModeDisplay) readingModeDisplay.remove();
            
            if (window.lastActiveLivro && window.lastActiveCapitulo) {
                const elementsToRemove = contentArea.querySelectorAll('div.capitulos:not(.versiculos-content):not(.book-content), .versiculos-content, .versiculo-texto, .reading-mode-content');
                elementsToRemove.forEach(el => el.remove());
                
                await updateChapterButtons(window.lastActiveLivro, window.lastActiveCapitulo, false);
                
                if (typeof window.toggleVersiculos === 'function') {
                    // toggleVersiculos recria a área de botões de versículos
                    await window.toggleVersiculos(window.lastActiveLivro, window.lastActiveCapitulo);
                }
                
                if (window.expandedVerses.size > 0 && typeof window.loadSpecificVerse === 'function') {
                    // Após toggleVersiculos ter recriado os botões
                    const verseButtonsContainer = contentArea.querySelector('.versiculos-content');
                    if (verseButtonsContainer) {
                        const verseButtons = verseButtonsContainer.querySelectorAll('button');
                         // Carrega apenas o primeiro versículo expandido ou o primeiro do capítulo se nenhum foi expandido
                        let verseToLoad = 1; 
                        if (window.expandedVerses.size > 0) {
                             verseToLoad = Math.min(...Array.from(window.expandedVerses));
                        }

                        const buttonToClick = Array.from(verseButtons).find(b => parseInt(b.dataset.versiculo) === verseToLoad);
                        if(buttonToClick) {
                            window.loadSpecificVerse(window.lastActiveLivro, window.lastActiveCapitulo, verseToLoad);
                            buttonToClick.classList.add('active');
                            window.activeVersiculoButton = buttonToClick; // Seta o botão ativo em biblia-navegacao
                        } else if (verseButtons.length > 0) {
                            // Fallback para o primeiro versículo se o salvo não for encontrado
                            window.loadSpecificVerse(window.lastActiveLivro, window.lastActiveCapitulo, 1);
                            verseButtons[0].classList.add('active');
                            window.activeVersiculoButton = verseButtons[0];
                        }
                    }
                } else if (typeof window.loadSpecificVerse === 'function' && window.activeCapitulo) {
                    // Se não há versículos salvos, carrega o primeiro do capítulo atual
                     const verseButtonsContainer = contentArea.querySelector('.versiculos-content');
                     if(verseButtonsContainer && verseButtonsContainer.firstChild) {
                         window.loadSpecificVerse(window.lastActiveLivro, window.lastActiveCapitulo, 1);
                         const firstVerseButton = verseButtonsContainer.querySelector('button');
                         if(firstVerseButton) {
                            firstVerseButton.classList.add('active');
                            window.activeVersiculoButton = firstVerseButton;
                         }
                     }
                }

                if (typeof window.getLivroDisplayName === 'function' && titleH2) {
                    let titleText = `${window.getLivroDisplayName(window.lastActiveLivro)} - CAPÍTULO ${window.lastActiveCapitulo}`;
                    if(window.activeVersiculoButton && window.expandedVerses.has(parseInt(window.activeVersiculoButton.dataset.versiculo))) {
                         titleText += ` - VERSÍCULO ${window.activeVersiculoButton.dataset.versiculo}`;
                    }
                    titleH2.textContent = titleText;
                }
                
                window.activeLivro = window.lastActiveLivro;
                window.activeCapitulo = window.lastActiveCapitulo;
            } else {
                const versaoAtual = localStorage.getItem('versaoBiblicaSelecionada') || 'ara';
                setPageTitle(versaoAtual);
                if(titleH2) {
                     titleH2.textContent = "Selecione um Livro";
                     titleH2.style.color = ''; // Reseta estilos do modo leitura
                     titleH2.style.textAlign = '';
                     titleH2.style.marginBottom = '';
                }
                const elementsToRemove = contentArea.querySelectorAll('div.capitulos:not(.versiculos-content):not(.book-content), .versiculos-content, .versiculo-texto, .reading-mode-content');
                elementsToRemove.forEach(el => el.remove());
            }
        }
    };

    // === NAVEGAÇÃO POR TECLADO ===
    function handleKeyNavigation(event) {
        if (!window.isReadingModeEnabled) {
            return;
        }
        if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.isContentEditable)) {
            return;
        }
        const prevBtn = document.getElementById('prev-chapter-reading-mode');
        const nextBtn = document.getElementById('next-chapter-reading-mode');
        if (event.key === "ArrowLeft") {
            if (prevBtn && !prevBtn.disabled) {
                event.preventDefault();
                prevBtn.click();
            }
        } else if (event.key === "ArrowRight") {
            if (nextBtn && !nextBtn.disabled) {
                event.preventDefault();
                nextBtn.click();
            }
        }
    }

    // === INICIALIZAÇÃO ===
    async function inicializarVersao(versaoCod) {
        console.log(`[Principal] Inicializando ${versaoCod.toUpperCase()}`);
        document.body.className = ''; 
        const versoesHtml = ['arc']; 
        document.body.classList.add(versoesHtml.includes(versaoCod.toLowerCase()) ? 'versao-html-ativa' : 'versao-json-ativa');

        try {
            const basePath = '../script'; 
            await loadScriptAsync(`${basePath}/${versaoCod.toLowerCase()}.js`, 'script-versao-biblica');
            setPageTitle(versaoCod);
            await loadScriptAsync(`${basePath}/slide.js`, 'script-slide');
            if (typeof window.inicializarDropdowns === 'function') window.inicializarDropdowns();
            if (typeof window.inicializarSobre === 'function') window.inicializarSobre();
            if (typeof window.inicializarSlide === 'function') window.inicializarSlide();
            
            const modoLeituraBtn = document.getElementById('modo-leitura');
            if (modoLeituraBtn) {
                 // Remover listener antigo para evitar múltiplos handlers
                const newBtn = modoLeituraBtn.cloneNode(true);
                modoLeituraBtn.parentNode.replaceChild(newBtn, modoLeituraBtn);
                newBtn.addEventListener('click', function(event) {
                    event.preventDefault();
                    window.toggleReadingMode(!window.isReadingModeEnabled, window.activeLivro, window.activeCapitulo);
                });
            }
            
            document.removeEventListener('keydown', handleKeyNavigation);
            document.addEventListener('keydown', handleKeyNavigation);
            console.log(`[Principal] ${versaoCod.toUpperCase()} inicializada.`);
        } catch (error) {
            console.error(`[Principal] Erro init ${versaoCod.toUpperCase()}:`, error);
            setPageTitle(versaoCod); 
            alert(`Erro ao inicializar a versão ${versaoCod.toUpperCase()}. Algumas funcionalidades podem não estar disponíveis.`);
        }
    }

    function initializePage() {
        console.log("[Principal] DOMContentLoaded.");
        const seletorVersao = document.getElementById('seletor-versao-principal');
        let versaoPadraoSelect = 'arc'; 
        let opcoesValidas = ['arc', 'ara', 'nvi', 'acf', 'ntlh', 'kjv', 'naa', 'original']; 
        
        if (seletorVersao && seletorVersao.options.length > 0) {
            opcoesValidas = Array.from(seletorVersao.options).map(opt => opt.value);
            versaoPadraoSelect = seletorVersao.value || opcoesValidas[0];
        } else {
            console.warn("Seletor de versão principal não encontrado ou sem opções. Usando valores padrão.");
        }
        
        const versaoSalva = localStorage.getItem('versaoBiblicaSelecionada');
        let versaoInicial = getQueryParam('version') || versaoSalva || versaoPadraoSelect;

        if (!opcoesValidas.includes(versaoInicial.toLowerCase())) {
            console.warn(`Versão inicial inválida ou não encontrada nas opções: ${versaoInicial}. Usando padrão: ${opcoesValidas[0]}`);
            versaoInicial = opcoesValidas[0];
        }

        if (seletorVersao) seletorVersao.value = versaoInicial;
        localStorage.setItem('versaoBiblicaSelecionada', versaoInicial);
        
        inicializarVersao(versaoInicial);

        if (seletorVersao) {
            seletorVersao.addEventListener('change', (event) => {
                const novaVersao = event.target.value;
                localStorage.setItem('versaoBiblicaSelecionada', novaVersao);
                // Simplesmente recarrega a página com o novo parâmetro de versão
                window.location.search = `?version=${novaVersao}`;
            });
        }
        
        const versoesDropdownList = document.getElementById('versoes-list'); // Supondo que você tenha este elemento
        if (versoesDropdownList) { 
            if (seletorVersao && opcoesValidas.length > 0) {
                versoesDropdownList.innerHTML = '';
                const opcoesTexto = {};
                Array.from(seletorVersao.options).forEach(opt => { 
                    opcoesTexto[opt.value] = opt.textContent; 
                });

                opcoesValidas.forEach(versao => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = `?version=${versao}`; // Link para recarregar com nova versão
                    a.textContent = opcoesTexto[versao] || versao.toUpperCase();
                    li.appendChild(a);
                    versoesDropdownList.appendChild(li);
                });
            }
        }
    }

    document.addEventListener('DOMContentLoaded', initializePage);

})();
// --- FIM DO SCRIPT versoes.js ---