// --- START OF FILE versoes.js ---

/**
 * versoes.js
 * Este é o módulo principal responsável por gerenciar todas as versões bíblicas disponíveis.
 * Ele lida com o carregamento dinâmico de versões, navegação entre capítulos,
 * modo de leitura e interações do usuário.
 */

(function() {
    'use strict';

    // === CONSTANTES E CONFIGURAÇÕES ===
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
    const chapterCountCache = {};

    // === FUNÇÕES UTILITÁRIAS ===
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

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

    function setPageTitle(versaoCod) {
        const h1PrincipalEl = document.getElementById('titulo-principal-versao');
        const subtituloExtensoEl = document.getElementById('subtitulo-versao-extenso');
        if (h1PrincipalEl) h1PrincipalEl.textContent = `Bíblia Sagrada ${versaoCod.toUpperCase()}`;
        if (subtituloExtensoEl) {
            if (window.BIBLE_VERSION_FULL_NAME) subtituloExtensoEl.textContent = window.BIBLE_VERSION_FULL_NAME;
            else subtituloExtensoEl.textContent = '';
        }
    }

    // === FUNÇÕES DE VERIFICAÇÃO DE CAPÍTULOS ===
    async function chapterExists(livro, capitulo) {
        try {
            const versaoAtual = localStorage.getItem('versaoBiblicaSelecionada') || 'ara';
            const versoesQueUsamHtml = ['arc']; 
            const isHtmlVersion = versoesQueUsamHtml.includes(versaoAtual.toLowerCase());
            const path = isHtmlVersion ? 
                `../version/${versaoAtual.toLowerCase()}/${livro.toLowerCase()}/${capitulo}.html` :
                `../version/${versaoAtual.toLowerCase()}/${livro.toLowerCase()}/${capitulo}.json`;
            const response = await fetch(path, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            console.error(`Erro ao verificar capítulo ${livro} ${capitulo}:`, error);
            return false;
        }
    }

    async function getBookChapterCount(livro) {
        const livroKey = livro.toLowerCase();
        if (chapterCountCache[livroKey]) return chapterCountCache[livroKey];
        if (window.livros && window.livros[livroKey] && window.livros[livroKey].capitulos) {
            chapterCountCache[livroKey] = window.livros[livroKey].capitulos;
            return window.livros[livroKey].capitulos;
        }
        console.warn(`[Capítulos] Contagem para ${livro} não encontrada em 'window.livros'. Tentando descobrir...`);
        let maxChapter = 0;
        for (let cap = 1; cap <= 150; cap++) {
            if (await chapterExists(livroKey, cap)) maxChapter = cap;
            else { if (cap > 1 && maxChapter === 0) maxChapter = cap - 1; break; }
        }
        if (maxChapter > 0) console.log(`[Capítulos] ${livroKey} tem ${maxChapter} capítulos (descoberto).`);
        else console.error(`[Capítulos] Não foi possível determinar contagem para ${livroKey}.`);
        chapterCountCache[livroKey] = maxChapter;
        return maxChapter;
    }

    // === FUNÇÕES DE NAVEGAÇÃO ===
    async function getNextBookAndChapter(currentBook, currentChapter) {
        const currentBookIndex = BIBLE_BOOKS_ORDER.indexOf(currentBook.toLowerCase());
        if (currentBookIndex === -1) return null;
        const totalCapitulosLivroAtual = await getBookChapterCount(currentBook);
        if (currentChapter < totalCapitulosLivroAtual) return { livro: currentBook, capitulo: currentChapter + 1 };
        if (currentBookIndex < BIBLE_BOOKS_ORDER.length - 1) return { livro: BIBLE_BOOKS_ORDER[currentBookIndex + 1], capitulo: 1 };
        return null;
    }

    async function getPreviousBookAndChapter(currentBook, currentChapter) {
        const currentBookIndex = BIBLE_BOOKS_ORDER.indexOf(currentBook.toLowerCase());
        if (currentBookIndex === -1) return null;
        if (currentChapter > 1) return { livro: currentBook, capitulo: currentChapter - 1 };
        if (currentBookIndex > 0) {
            const previousBook = BIBLE_BOOKS_ORDER[currentBookIndex - 1];
            const lastChapterOfPreviousBook = await getBookChapterCount(previousBook);
            return { livro: previousBook, capitulo: lastChapterOfPreviousBook };
        }
        return null;
    }

    // === FUNÇÕES DE INTERFACE ===
    async function updateChapterButtons(livro, capituloAtual, isReadingMode) {
        const contentArea = document.querySelector('section.content');
        if (!contentArea) { console.error("updateChapterButtons: section.content não encontrada."); return; }

        // Remove all existing chapter button containers
        const existingChapterButtonContainers = contentArea.querySelectorAll('div.capitulos:not(.versiculos-content), #dynamic-chapter-buttons-container');
        existingChapterButtonContainers.forEach(container => container.remove());

        let capitulosContainer = document.createElement('div');
        capitulosContainer.className = 'capitulos';
        capitulosContainer.id = 'dynamic-chapter-buttons-container'; 
        
        const titleH2 = contentArea.querySelector('h2');
        if (titleH2) titleH2.insertAdjacentElement('afterend', capitulosContainer);
        else contentArea.insertBefore(capitulosContainer, contentArea.firstChild);
        
        const totalCapitulos = await getBookChapterCount(livro);
        if (totalCapitulos === 0) {
            capitulosContainer.innerHTML = `<p class="error-message">Não foi possível carregar os capítulos para ${livro}.</p>`;
            return;
        }
        
        for (let i = 1; i <= totalCapitulos; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.dataset.capitulo = i;
            button.dataset.livro = livro; 
            button.classList.add('botao-capitulo-dinamico'); 
            if (i === parseInt(capituloAtual)) button.classList.add('active');
            
            button.addEventListener('click', async function() {
                const capituloClicado = parseInt(this.dataset.capitulo);
                const livroClicado = this.dataset.livro;
                window.activeLivro = livroClicado; 
                window.activeCapitulo = capituloClicado; 
                
                if (window.isReadingModeEnabled) await window.loadChapterInReadingMode(livroClicado, capituloClicado);
                else {
                    if (typeof window.toggleVersiculos === 'function') await window.toggleVersiculos(livroClicado, capituloClicado);
                    else console.error("Função toggleVersiculos não encontrada.");
                }
                
                capitulosContainer.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                if (typeof window.getLivroDisplayName === 'function') { 
                    const currentTitleH2 = contentArea.querySelector('h2');
                    if (currentTitleH2) {
                        let titleText = `${window.getLivroDisplayName(livroClicado)} - CAPÍTULO ${capituloClicado}`;
                        if (!window.isReadingModeEnabled && window.activeVersiculoButton && window.activeVersiculoButton.dataset.versiculo) {
                            titleText += ` - VERSÍCULO ${window.activeVersiculoButton.dataset.versiculo}`;
                        }
                        currentTitleH2.textContent = titleText;
                    }
                }
            });
            capitulosContainer.appendChild(button);
        }
        console.log(`[Capítulos] Criados ${totalCapitulos} botões dinâmicos para ${livro} em #${capitulosContainer.id}`);
    }

    // === FUNÇÕES DO MODO DE LEITURA ===
    window.isReadingModeEnabled = false;
    window.lastActiveLivro = null; 
    window.lastActiveCapitulo = null;
    window.lastActiveVerse = null;

    window.loadChapterInReadingMode = async function(livro, capitulo) {
        const contentArea = document.querySelector('section.content');
        if (!contentArea) { console.error('[Modo Leitura] section.content não encontrado.'); return; }

        contentArea.querySelectorAll('.versiculo-texto, .versiculos-content, div.versiculos:not(.versiculos-content)').forEach(el => el.remove());
        await updateChapterButtons(livro, capitulo, true); // updateChapterButtons now cleans better

        let readingContainer = contentArea.querySelector('.reading-mode-content');
        if (!readingContainer) {
            readingContainer = document.createElement('div');
            readingContainer.className = 'reading-mode-content';
            const refElement = contentArea.querySelector('#dynamic-chapter-buttons-container') || contentArea.querySelector('h2'); // Usa o ID do container de capítulos
            if (refElement) refElement.insertAdjacentElement('afterend', readingContainer);
            else contentArea.appendChild(readingContainer);
        }
        readingContainer.innerHTML = '<div class="loading-message">Carregando capítulo...</div>';
        readingContainer.style.display = 'block';

        try {
            const versaoAtual = localStorage.getItem('versaoBiblicaSelecionada') || 'ara';
            const capituloNum = parseInt(capitulo);
            const versoesQueUsamHtml = ['arc']; 
            const isHtmlVersion = versoesQueUsamHtml.includes(versaoAtual.toLowerCase());
            console.log(`[Modo Leitura] Carregando: ${livro.toUpperCase()} ${capituloNum} (HTML: ${isHtmlVersion})`);

            let htmlParaExibir = '';
            const nextBookChapter = await getNextBookAndChapter(livro, capituloNum);
            const prevBookChapter = await getPreviousBookAndChapter(livro, capituloNum);
            let navButtonsHtml = '<div class="reading-mode-navigation">';
            navButtonsHtml += prevBookChapter ? `<button id="prev-chapter-reading-mode" data-livro="${prevBookChapter.livro}" data-capitulo="${prevBookChapter.capitulo}">Cap. Anterior</button>` : `<button id="prev-chapter-reading-mode" disabled>Cap. Anterior</button>`;
            navButtonsHtml += nextBookChapter ? `<button id="next-chapter-reading-mode" data-livro="${nextBookChapter.livro}" data-capitulo="${nextBookChapter.capitulo}">Cap. Próximo</button>` : `<button id="next-chapter-reading-mode" disabled>Cap. Próximo</button>`;
            navButtonsHtml += '</div>';

            if (isHtmlVersion) {
                const path = `../version/${versaoAtual.toLowerCase()}/${livro.toLowerCase()}/${capituloNum}.html`;
                const response = await fetch(path);
                if (!response.ok) throw new Error(`Erro HTML ${capituloNum} (${response.status}) de ${path}`);
                const htmlString = await response.text();
                const doc = new DOMParser().parseFromString(htmlString, 'text/html');
                const container = doc.querySelector('div.versiculos');
                let constructedHtml = '<div class="chapter-verses">';
                if (container) {
                    container.querySelectorAll('div[id^="versiculo-"]').forEach(div => {
                        const numMatch = div.id.match(/(\d+)$/);
                        if (numMatch && numMatch[1]) {
                            const num = numMatch[1];
                            const strong = div.querySelector('strong');
                            if (strong) constructedHtml += `<h3 class="verse-section-title">${strong.textContent.trim()}</h3>`;
                            const clone = div.cloneNode(true);
                            const strongClone = clone.querySelector('strong');
                            if (strongClone) strongClone.remove();
                            const text = clone.textContent.trim();
                            if (text) constructedHtml += `<div class="verse-container"><sup class="verse-number">${num}</sup><span class="verse-text">${text}</span></div>`;
                        }
                    });
                } else if (doc.body && doc.body.innerHTML.trim() !== '') {
                    console.warn(`[Modo Leitura HTML] div.versiculos não encontrado. Usando body.innerHTML.`);
                    constructedHtml += doc.body.innerHTML; // Poderia tentar parsear isso também, mas por ora é fallback bruto
                } else throw new Error('Arquivo HTML vazio ou sem div.versiculos.');
                constructedHtml += '</div>'; 
                htmlParaExibir = constructedHtml;
            } else { // JSON
                const path = `../version/${versaoAtual.toLowerCase()}/${livro.toLowerCase()}/${capituloNum}.json`;
                const response = await fetch(path);
                if (!response.ok) throw new Error(`Erro JSON ${capituloNum} (${response.status}) de ${path}`);
                const data = await response.json();
                let count = typeof window.getSpecificVerseCount === 'function' ? window.getSpecificVerseCount(livro, capituloNum) : 0;
                count = count > 0 ? count : (data.versiculos ? Object.keys(data.versiculos).length : 0);
                if (count === 0 && (!data.versiculos || Object.keys(data.versiculos).length === 0)) throw new Error('Nenhum versículo (JSON).');
                let versesHtml = '<div class="chapter-verses">';
                if (data.titulo) versesHtml += `<h3 class="chapter-main-title">${data.titulo}</h3>`;
                for (let i = 1; i <= count; i++) {
                    const key = String(i);
                    if (data.versiculos && data.versiculos[key]) {
                        if (data.titulos && data.titulos[key]) versesHtml += `<h3 class="verse-section-title">${data.titulos[key]}</h3>`;
                        versesHtml += `<div class="verse-container"><sup class="verse-number">${i}</sup><span class="verse-text">${data.versiculos[key]}</span></div>`;
                    }
                }
                versesHtml += '</div>';
                htmlParaExibir = versesHtml;
            }
            readingContainer.innerHTML = navButtonsHtml + htmlParaExibir;
            const attachNavListener = (id, targetLivro, targetCapitulo) => {
                const btn = readingContainer.querySelector(`#${id}`);
                if (btn && !btn.disabled) {
                    btn.addEventListener('click', async () => {
                        window.activeLivro = targetLivro; 
                        window.activeCapitulo = targetCapitulo;
                        await window.loadChapterInReadingMode(targetLivro, targetCapitulo);
                        const titleH2 = contentArea.querySelector('h2');
                        if (titleH2 && typeof window.getLivroDisplayName === 'function') {
                            titleH2.textContent = `${window.getLivroDisplayName(targetLivro)} - CAPÍTULO ${targetCapitulo}`;
                        }
                    });
                }
            };
            if(prevBookChapter) attachNavListener('prev-chapter-reading-mode', prevBookChapter.livro, prevBookChapter.capitulo);
            if(nextBookChapter) attachNavListener('next-chapter-reading-mode', nextBookChapter.livro, nextBookChapter.capitulo);
            
            const titleH2 = contentArea.querySelector('h2');
            if(titleH2 && typeof window.getLivroDisplayName === 'function') {
                titleH2.textContent = `${window.getLivroDisplayName(livro)} - CAPÍTULO ${capituloNum}`;
                Object.assign(titleH2.style, { color: '#f0ad4e', textAlign: 'center', marginBottom: '20px' });
            }
        } catch (error) {
            console.error('[Modo Leitura] Erro:', error);
            const versao = localStorage.getItem('versaoBiblicaSelecionada') || 'ara';
            const isHtml = ['arc'].includes(versao.toLowerCase());
            const path = isHtml ? `../version/${versao.toLowerCase()}/${livro.toLowerCase()}/${capitulo}.html` : `../version/${versao.toLowerCase()}/${livro.toLowerCase()}/${capitulo}.json`;
            readingContainer.innerHTML = `<div class="error-container" style="padding:20px;border:1px solid #d9534f;background-color:#f2dede;color:#a94442;border-radius:4px;"><p style="font-weight:bold;">⚠️ Erro capítulo ${capitulo} de ${livro.toUpperCase()}</p><p>Detalhes: ${error.message}</p><p>Tentativa: ${path}</p><p>Tente:</p><ul><li>Verificar se o arquivo existe.</li><li>Navegar para outro capítulo.</li><li>Recarregar.</li></ul><div><button onclick="history.back()">Voltar</button><button onclick="location.reload()">Recarregar</button></div></div>`;
        }
    };

    window.toggleReadingMode = async function(enable, livro, capitulo) {
        window.isReadingModeEnabled = enable;
        const btn = document.getElementById('modo-leitura');
        if (btn) { btn.classList.toggle('active', enable); btn.setAttribute('aria-pressed', String(enable)); }
        
        const contentArea = document.querySelector('section.content');
        if (!contentArea) { console.error("toggleReadingMode: section.content não encontrada."); return; }
        let readingModeDisplay = contentArea.querySelector('.reading-mode-content');
        const titleH2 = contentArea.querySelector('h2');

        if (enable) { // ENTRANDO NO MODO LEITURA
            document.body.classList.add('module-leitura');
            window.lastActiveLivro = window.activeLivro || livro;
            window.lastActiveCapitulo = window.activeCapitulo || capitulo;
            window.lastActiveVerse = (window.activeVersiculoButton && window.activeVersiculoButton.dataset.versiculo) ? parseInt(window.activeVersiculoButton.dataset.versiculo) : 1;
            
            contentArea.querySelectorAll('.versiculo-texto, .versiculos-content, div.capitulos:not(.versiculos-content):not(.book-content):not(#dynamic-chapter-buttons-container)').forEach(el => el.remove());
            
            if (window.lastActiveLivro && window.lastActiveCapitulo) {
                await window.loadChapterInReadingMode(window.lastActiveLivro, window.lastActiveCapitulo); 
            } else { 
                if (!readingModeDisplay) { 
                    readingModeDisplay = document.createElement('div');
                    readingModeDisplay.className = 'reading-mode-content';
                    const ref = contentArea.querySelector('#dynamic-chapter-buttons-container') || titleH2;
                    if (ref) ref.insertAdjacentElement('afterend', readingModeDisplay); else contentArea.appendChild(readingModeDisplay);
                }
                readingModeDisplay.innerHTML = '<p style="text-align:center; padding:20px;">Selecione um livro e capítulo.</p>';
                readingModeDisplay.style.display = 'block';
                if(titleH2) titleH2.textContent = "Modo Leitura";
            }
        } else { // SAINDO DO MODO LEITURA
            console.log("[ToggleMode] Saindo. Estado salvo:", window.lastActiveLivro, window.lastActiveCapitulo, window.lastActiveVerse);
            document.body.classList.remove('module-leitura'); 
            if (readingModeDisplay) { readingModeDisplay.remove(); readingModeDisplay = null; }
            
            contentArea.querySelectorAll('.versiculo-texto, .versiculos-content').forEach(el => el.remove());

            if (window.lastActiveLivro && window.lastActiveCapitulo) {
                await updateChapterButtons(window.lastActiveLivro, window.lastActiveCapitulo, false);
                // Only call toggleVersiculos if it hasn't been handled by updateChapterButtons
                if (typeof window.toggleVersiculos === 'function') await window.toggleVersiculos(window.lastActiveLivro, window.lastActiveCapitulo);
                
                let verseToLoad = window.lastActiveVerse || 1;
                if (typeof window.loadSpecificVerse === 'function') await window.loadSpecificVerse(window.lastActiveLivro, window.lastActiveCapitulo, verseToLoad);
                else console.error("toggleReadingMode: loadSpecificVerse não encontrada.");

                const newVerseButtonsContainer = contentArea.querySelector('.versiculos-content');
                if (newVerseButtonsContainer) {
                    const allVerseButtons = newVerseButtonsContainer.querySelectorAll('button.botao-versiculo');
                    allVerseButtons.forEach(b => b.classList.remove('active')); 
                    const btnToActivate = Array.from(allVerseButtons).find(b => parseInt(b.dataset.versiculo) === verseToLoad) || (allVerseButtons.length > 0 && verseToLoad === 1 ? allVerseButtons[0] : null);
                    if (btnToActivate) { btnToActivate.classList.add('active'); window.activeVersiculoButton = btnToActivate; }
                }

                if (titleH2 && typeof window.getLivroDisplayName === 'function') {
                    titleH2.textContent = `${window.getLivroDisplayName(window.lastActiveLivro)} - CAPÍTULO ${window.lastActiveCapitulo} - VERSÍCULO ${verseToLoad}`;
                    Object.assign(titleH2.style, { color: '', textAlign: '', marginBottom: '' });
                }
                window.activeLivro = window.lastActiveLivro;
                window.activeCapitulo = window.lastActiveCapitulo;
            } else {
                console.log("[ToggleMode] Saindo, sem estado ativo salvo.");
                setPageTitle(localStorage.getItem('versaoBiblicaSelecionada') || 'ara'); 
                if(titleH2) {
                    titleH2.textContent = "Selecione um Livro"; 
                    Object.assign(titleH2.style, { color: '', textAlign: '', marginBottom: '' });
                }
                contentArea.querySelectorAll('#dynamic-chapter-buttons-container').forEach(c => c.remove());
            }
        }
    };

    // === NAVEGAÇÃO POR TECLADO ===
    function handleKeyNavigation(event) {
        if (!window.isReadingModeEnabled || (document.activeElement && /INPUT|TEXTAREA|true/.test(document.activeElement.tagName + document.activeElement.isContentEditable))) return;
        const actions = { "ArrowLeft": 'prev-chapter-reading-mode', "ArrowRight": 'next-chapter-reading-mode' };
        const btnId = actions[event.key];
        if (btnId) {
            const btn = document.getElementById(btnId);
            if (btn && !btn.disabled) { event.preventDefault(); btn.click(); }
        }
    }

    // === INICIALIZAÇÃO ===
    async function inicializarVersao(versaoCod) {
        console.log(`[Principal] Inicializando ${versaoCod.toUpperCase()}`);
        document.body.className = ''; 
        document.body.classList.add(['arc'].includes(versaoCod.toLowerCase()) ? 'versao-html-ativa' : 'versao-json-ativa');
        try {
            await loadScriptAsync(`../script/${versaoCod.toLowerCase()}.js`, 'script-versao-biblica');
            setPageTitle(versaoCod);
            await loadScriptAsync(`../script/slide.js`, 'script-slide'); 
            if (typeof window.inicializarDropdowns === 'function') window.inicializarDropdowns();
            if (typeof window.inicializarSobre === 'function') window.inicializarSobre();
            if (typeof window.inicializarSlide === 'function') window.inicializarSlide();
            
            const modoLeituraBtn = document.getElementById('modo-leitura');
            if (modoLeituraBtn) {
                const newBtn = modoLeituraBtn.cloneNode(true); // Para remover listeners antigos
                modoLeituraBtn.parentNode.replaceChild(newBtn, modoLeituraBtn);
                newBtn.addEventListener('click', (e) => { 
                    e.preventDefault(); 
                    window.toggleReadingMode(!window.isReadingModeEnabled, window.activeLivro, window.activeCapitulo); 
                });
            }
            document.removeEventListener('keydown', handleKeyNavigation); // Garante que não haja duplicatas
            document.addEventListener('keydown', handleKeyNavigation);
            console.log(`[Principal] ${versaoCod.toUpperCase()} inicializada.`);
        } catch (error) {
            console.error(`[Principal] Erro init ${versaoCod.toUpperCase()}:`, error);
            setPageTitle(versaoCod); 
            alert(`Erro ao inicializar ${versaoCod.toUpperCase()}.`);
        }
    }

    function initializePage() {
        const seletor = document.getElementById('seletor-versao-principal');
        let opcoesValidas = ['arc', 'ara', 'nvi', 'acf', 'ntlh', 'kjv', 'naa', 'original']; 
        let versaoPadrao = 'arc'; // Defina sua versão padrão aqui
        if (seletor && seletor.options.length > 0) {
            opcoesValidas = Array.from(seletor.options).map(opt => opt.value);
            versaoPadrao = seletor.value || opcoesValidas[0];
        }
        let versaoInicial = getQueryParam('version') || localStorage.getItem('versaoBiblicaSelecionada') || versaoPadrao;
        if (!opcoesValidas.includes(versaoInicial.toLowerCase())) versaoInicial = opcoesValidas[0];
        if (seletor) seletor.value = versaoInicial;
        localStorage.setItem('versaoBiblicaSelecionada', versaoInicial);
        inicializarVersao(versaoInicial);
        if (seletor) {
            seletor.addEventListener('change', (e) => {
                localStorage.setItem('versaoBiblicaSelecionada', e.target.value);
                window.location.search = `?version=${e.target.value}`; // Recarrega com a nova versão
            });
        }
        const ddList = document.getElementById('versoes-list');
        if (ddList && seletor && opcoesValidas.length > 0) {
            ddList.innerHTML = '';
            const opcoesTexto = Object.fromEntries(Array.from(seletor.options).map(opt => [opt.value, opt.textContent]));
            opcoesValidas.forEach(v => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `?version=${v}`; a.textContent = opcoesTexto[v] || v.toUpperCase();
                li.appendChild(a); ddList.appendChild(li);
            });
        }
    }
    document.addEventListener('DOMContentLoaded', initializePage);

})();
// --- FIM DO SCRIPT versoes.js ---