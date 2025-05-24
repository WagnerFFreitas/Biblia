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
     * @param {string} livro Nome do livro
     * @param {number} capitulo Número do capítulo
     * @returns {Promise<boolean>} True se o capítulo existe
     */
    async function chapterExists(livro, capitulo) {
        try {
            const versaoAtual = localStorage.getItem('versaoBiblicaSelecionada') || 'ara';
            const jsonPath = `../version/${versaoAtual.toLowerCase()}/${livro.toLowerCase()}/${capitulo}.json`;
            const response = await fetch(jsonPath, { method: 'HEAD' });
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
        // Verificar cache primeiro
        if (chapterCountCache[livro.toLowerCase()]) {
            return chapterCountCache[livro.toLowerCase()];
        }
        
        // Primeiro tentar obter do sistema existente
        if (typeof window.getChapterCountForBook === 'function') {
            const count = window.getChapterCountForBook(livro);
            if (count > 0) {
                chapterCountCache[livro.toLowerCase()] = count;
                return count;
            }
        }
        
        if (window.livrosInfo && window.livrosInfo[livro.toLowerCase()]) {
            const count = window.livrosInfo[livro.toLowerCase()].chapters;
            if (count > 0) {
                chapterCountCache[livro.toLowerCase()] = count;
                return count;
            }
        }

        // Se não conseguir do sistema, descobrir verificando quais capítulos existem
        console.log(`[Capítulos] Descobrindo número de capítulos para ${livro}...`);
        let maxChapter = 1;
        
        // Verificar até 150 capítulos (máximo possível)
        for (let cap = 1; cap <= 150; cap++) {
            const exists = await chapterExists(livro, cap);
            if (exists) {
                maxChapter = cap;
            } else {
                // Se não existe, paramos aqui
                break;
            }
        }
        
        console.log(`[Capítulos] ${livro} tem ${maxChapter} capítulos`);
        chapterCountCache[livro.toLowerCase()] = maxChapter;
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

        // Primeiro, verificar se o próximo capítulo existe no livro atual
        const nextChapterInSameBook = currentChapter + 1;
        const nextChapterExists = await chapterExists(currentBook, nextChapterInSameBook);
        
        if (nextChapterExists) {
            console.log(`[Navegação] Próximo: ${currentBook} ${nextChapterInSameBook} (mesmo livro)`);
            return { livro: currentBook, capitulo: nextChapterInSameBook };
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
            
            // Encontrar o último capítulo do livro anterior
            const lastChapter = await getBookChapterCount(previousBook);

            console.log(`[Navegação] Anterior: ${previousBook} ${lastChapter} (livro anterior)`);
            return { livro: previousBook, capitulo: lastChapter };
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

        // Procurar por container de capítulos existente
        let capitulosContainer = contentArea.querySelector('.capitulos');
        if (!capitulosContainer) {
            // Criar container se não existir
            capitulosContainer = document.createElement('div');
            capitulosContainer.className = 'capitulos';
            
            const titleH2 = contentArea.querySelector('h2');
            if (titleH2) {
                titleH2.insertAdjacentElement('afterend', capitulosContainer);
            } else {
                contentArea.insertBefore(capitulosContainer, contentArea.firstChild);
            }
        }

        // Obter número de capítulos do livro
        const totalCapitulos = await getBookChapterCount(livro);
        
        // Limpar botões existentes
        capitulosContainer.innerHTML = '';
        
        // Criar novos botões
        for (let i = 1; i <= totalCapitulos; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.dataset.capitulo = i;
            
            // Marcar capítulo atual como ativo, independentemente do modo de leitura
            if (i === parseInt(capituloAtual)) {
                button.classList.add('active');
            }
            
            // Adicionar event listener
            button.addEventListener('click', function() {
                const capitulo = parseInt(this.dataset.capitulo);
                window.activeLivro = livro;
                window.activeCapitulo = capitulo;
                
                if (window.isReadingModeEnabled) {
                    window.loadChapterInReadingMode(livro, capitulo);
                } else {
                    // Carregar no modo normal
                    if (typeof window.toggleVersiculos === 'function') {
                        window.toggleVersiculos(livro, capitulo);
                    }
                }
                
                // Atualizar botões ativos (tanto no modo leitura quanto fora dele)
                const buttons = capitulosContainer.querySelectorAll('button');
                buttons.forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                
                // Atualizar título
                if (typeof window.getLivroDisplayName === 'function') {
                    const titleH2 = contentArea.querySelector('h2');
                    if (titleH2) {
                        titleH2.textContent = `${window.getLivroDisplayName(livro)} - CAPÍTULO ${capitulo}`;
                    }
                }
            });
            
            capitulosContainer.appendChild(button);
        }
        
        console.log(`[Capítulos] Criados ${totalCapitulos} botões para ${livro}`);
    }

    // === FUNÇÕES DO MODO DE LEITURA ===
    // Controla se o modo de leitura está ativo
    window.isReadingModeEnabled = false;
    // Armazena os versículos expandidos antes de entrar no modo de leitura
    window.expandedVerses = new Set();

    /**
     * Carrega um capítulo no modo de leitura
     * @param {string} livro Nome do livro
     * @param {number} capitulo Número do capítulo
     */
    window.loadChapterInReadingMode = async function(livro, capitulo) {
        const contentArea = document.querySelector('section.content');
        if (!contentArea) { 
            console.error('section.content não encontrado.'); 
            return; 
        }

        // Remover elementos do modo normal
        const normalVerseTextDisplayImmediate = contentArea.querySelector('.versiculo-texto'); 
        const verseButtonsDisplayImmediate = contentArea.querySelector('.versiculos');
        if (normalVerseTextDisplayImmediate) normalVerseTextDisplayImmediate.remove();
        if (verseButtonsDisplayImmediate) verseButtonsDisplayImmediate.remove();

        // Atualizar botões de capítulos para o livro atual (com modo de leitura ativo)
        await updateChapterButtons(livro, capitulo, true);

        let readingContainer = contentArea.querySelector('.reading-mode-content');
        if (!readingContainer) {
            readingContainer = document.createElement('div');
            readingContainer.className = 'reading-mode-content';
            const chaptersContainer = contentArea.querySelector('.capitulos');
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
            let numVersiculos = 0;
            if (typeof window.getSpecificVerseCount === 'function') {
                numVersiculos = window.getSpecificVerseCount(livro, capituloNum);
            }

            // Caminho do arquivo JSON
            const jsonPath = `../version/${versaoAtual.toLowerCase()}/${livro.toLowerCase()}/${capituloNum}.json`;
            console.log(`[Modo Leitura] Carregando: ${livro.toUpperCase()} ${capituloNum}`);

            const response = await fetch(jsonPath);
            if (!response.ok) {
                throw new Error(`Erro ao carregar capítulo ${capituloNum} (${response.status})`);
            }
            
            const data = await response.json();
            const effectiveNumVersiculos = numVersiculos > 0 ? numVersiculos : (data.versiculos ? Object.keys(data.versiculos).length : 0);

            if (effectiveNumVersiculos === 0 && (!data.versiculos || Object.keys(data.versiculos).length === 0)) {
                throw new Error('Nenhum versículo encontrado neste capítulo.');
            }

            // Obter próximo e anterior livro/capítulo
            const nextBookChapter = await getNextBookAndChapter(livro, capituloNum);
            const prevBookChapter = await getPreviousBookAndChapter(livro, capituloNum);

            let navButtonsHtml = '<div class="reading-mode-navigation">'; 
            
            // Botão Capítulo Anterior
            if (prevBookChapter) {
                navButtonsHtml += `<button id="prev-chapter-reading-mode" data-livro="${prevBookChapter.livro}" data-capitulo="${prevBookChapter.capitulo}">Cap. Anterior</button>`;
            } else {
                navButtonsHtml += `<button id="prev-chapter-reading-mode" disabled>Cap. Anterior</button>`;
            }

            // Botão Capítulo Próximo
            if (nextBookChapter) {
                navButtonsHtml += `<button id="next-chapter-reading-mode" data-livro="${nextBookChapter.livro}" data-capitulo="${nextBookChapter.capitulo}">Cap. Próximo</button>`;
            } else {
                navButtonsHtml += `<button id="next-chapter-reading-mode" disabled>Cap. Próximo</button>`;
            }
            
            navButtonsHtml += '</div>';

            let htmlVerses = '<div class="chapter-verses">';
            
            // Adicionar título do capítulo se disponível
            if (data.titulo) {
                htmlVerses += `<h3 class="chapter-title">${data.titulo}</h3>`;
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
            
            readingContainer.innerHTML = navButtonsHtml + htmlVerses; 

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
            readingContainer.innerHTML = `
                <div class="error-container">
                    <p>⚠️ Erro: ${error.message}</p>
                    <p>O capítulo solicitado não está disponível.</p>
                    <p style="margin-top: 15px;">Por favor, tente:</p>
                    <ul style="list-style: disc; padding-left: 20px; margin: 10px 0;">
                        <li>Verificar se o capítulo existe para este livro</li>
                        <li>Navegar para outro capítulo</li>
                        <li>Recarregar a página</li>
                    </ul>
                    <div style="margin-top: 20px;">
                        <button onclick="history.back()">Voltar</button>
                        <button onclick="location.reload()">Recarregar</button>
                    </div>
                </div>
            `;
        }
    };

    /**
     * Alterna entre modo de leitura normal e contínuo
     * @param {boolean} enable Se deve ativar o modo leitura
     * @param {string} livro Nome do livro
     * @param {number} capitulo Número do capítulo
     */
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
        const verseButtonsDisplay = contentArea.querySelector('.versiculos'); 
        let readingModeDisplay = contentArea.querySelector('.reading-mode-content');
        const titleH2 = contentArea.querySelector('h2');

        if (enable) { 
            // Salvar o estado atual antes de entrar no modo de leitura
            if (window.activeLivro && window.activeCapitulo) {
                window.lastActiveLivro = window.activeLivro;
                window.lastActiveCapitulo = window.activeCapitulo;
            } else if (livro && capitulo) {
                window.lastActiveLivro = livro;
                window.lastActiveCapitulo = capitulo;
            }
            
            // Salvar os versículos expandidos
            window.expandedVerses.clear();
            const verseButtons = contentArea.querySelectorAll('.versiculos button.active');
            verseButtons.forEach(button => {
                const verseNumber = button.dataset.versiculo;
                if (verseNumber) {
                    window.expandedVerses.add(parseInt(verseNumber));
                }
            });
            
            // Remover elementos em vez de apenas ocultar
            if (normalVerseTextDisplay) normalVerseTextDisplay.remove();
            if (verseButtonsDisplay) verseButtonsDisplay.remove();
            
            if (livro && capitulo) {
                await window.loadChapterInReadingMode(livro, capitulo); 
            } else { 
                if (!readingModeDisplay) {
                    readingModeDisplay = document.createElement('div');
                    readingModeDisplay.className = 'reading-mode-content';
                    const chaptersContainer = contentArea.querySelector('.capitulos');
                    if (chaptersContainer) chaptersContainer.insertAdjacentElement('afterend', readingModeDisplay);
                    else if (titleH2) titleH2.insertAdjacentElement('afterend', readingModeDisplay);
                    else contentArea.appendChild(readingModeDisplay);
                }
                readingModeDisplay.innerHTML = '<p style="text-align:center; padding:20px;">Selecione um livro e capítulo.</p>';
                readingModeDisplay.style.display = 'block';
                if(titleH2) titleH2.textContent = "Modo Leitura";
            }
        } else { 
            // Remover completamente o conteúdo do modo leitura
            if (readingModeDisplay) readingModeDisplay.remove();
            
            // Restaurar o estado anterior
            if (window.lastActiveLivro && window.lastActiveCapitulo) {
                // Limpar elementos existentes
                const elementsToRemove = contentArea.querySelectorAll('.capitulos, .versiculos-content, .versiculo-texto');
                elementsToRemove.forEach(el => el.remove());
                
                // Recriar os botões de capítulos
                await updateChapterButtons(window.lastActiveLivro, window.lastActiveCapitulo, false);
                
                // Carregar os versículos do capítulo anterior
                if (typeof window.toggleVersiculos === 'function') {
                    await window.toggleVersiculos(window.lastActiveLivro, window.lastActiveCapitulo);
                }
                
                // Restaurar os versículos expandidos
                if (window.expandedVerses.size > 0) {
                    const verseButtons = contentArea.querySelectorAll('.versiculos button');
                    verseButtons.forEach(button => {
                        const verseNumber = parseInt(button.dataset.versiculo);
                        if (window.expandedVerses.has(verseNumber)) {
                            button.classList.add('active');
                            // Simular clique para expandir o versículo
                            button.click();
                        }
                    });
                }
                
                // Atualizar título
                if (typeof window.getLivroDisplayName === 'function' && titleH2) {
                    titleH2.textContent = `${window.getLivroDisplayName(window.lastActiveLivro)} - CAPÍTULO ${window.lastActiveCapitulo}`;
                }
                
                // Restaurar o estado ativo
                window.activeLivro = window.lastActiveLivro;
                window.activeCapitulo = window.lastActiveCapitulo;
            } else {
                const versaoAtual = localStorage.getItem('versaoBiblicaSelecionada') || 'ara';
                setPageTitle(versaoAtual);
                if(titleH2) titleH2.textContent = "Selecione um Livro";
            }
        }
    };

    // === NAVEGAÇÃO POR TECLADO ===
    /**
     * Gerencia navegação usando setas do teclado
     * @param {KeyboardEvent} event Evento do teclado
     */
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
    /**
     * Inicializa uma versão específica da Bíblia
     * Carrega scripts necessários e configura a interface
     * @param {string} versaoCod Código da versão a ser inicializada
     */
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
                modoLeituraBtn.addEventListener('click', function(event) {
                    event.preventDefault();
                    if (window.activeLivro && window.activeCapitulo) { 
                        window.toggleReadingMode(!window.isReadingModeEnabled, window.activeLivro, window.activeCapitulo);
                    } else {
                        window.toggleReadingMode(!window.isReadingModeEnabled, null, null);
                    }
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

    /**
     * Inicializa a página principal
     * Configura seletores de versão e carrega versão inicial
     */
    function initializePage() {
        console.log("[Principal] DOMContentLoaded.");
        const seletorVersao = document.getElementById('seletor-versao-principal');
        let versaoPadraoSelect = 'arc'; 
        let opcoesValidas = ['arc', 'ara', 'nvi', 'acf', 'ntlh', 'kjv', 'naa', 'original']; 
        
        if (seletorVersao && seletorVersao.options.length > 0) {
            opcoesValidas = Array.from(seletorVersao.options).map(opt => opt.value);
            versaoPadraoSelect = seletorVersao.value || opcoesValidas[0];
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
                window.location.search = `?version=${novaVersao}`;
            });
        }
        
        const versoesDropdownList = document.getElementById('versoes-list');
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
                    a.href = `?version=${versao}`;
                    a.textContent = opcoesTexto[versao] || versao.toUpperCase();
                    li.appendChild(a);
                    versoesDropdownList.appendChild(li);
                });
            }
        }
    }

    // === EVENT LISTENERS ===
    // Inicia o processo quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', initializePage);

})();