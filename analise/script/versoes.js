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
    function getQueryParam(parametro) {
        const parametrosUrl = new URLSearchParams(window.location.search);
        return parametrosUrl.get(parametro);
    }

    function loadScriptAsync(origem, id) {
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

    function setPageTitle(codigoVersao) {
        const elementoTituloPrincipal = document.getElementById('titulo-principal-versao');
        const elementoSubtituloExtenso = document.getElementById('subtitulo-versao-extenso');
        if (elementoTituloPrincipal) elementoTituloPrincipal.textContent = `Bíblia Sagrada ${codigoVersao.toUpperCase()}`;
        if (elementoSubtituloExtenso) {
            if (window.NOME_VERSAO_COMPLETA_BIBLIA) elementoSubtituloExtenso.textContent = window.NOME_VERSAO_COMPLETA_BIBLIA;
            else elementoSubtituloExtenso.textContent = '';
        }
    }

    // === FUNÇÕES DE VERIFICAÇÃO DE CAPÍTULOS ===
    async function chapterExists(livro, capitulo) {
        try {
            const versaoAtual = localStorage.getItem('versaoBiblicaSelecionada') || 'ara';
            const versoesQueUsamHtml = ['arc']; 
            const isHtmlVersion = versoesQueUsamHtml.includes(versaoAtual.toLowerCase());
            const caminho = isHtmlVersion ? 
                `../versao/${versaoAtual.toLowerCase()}/${livro.toLowerCase()}/${capitulo}.html` :
                `../versao/${versaoAtual.toLowerCase()}/${livro.toLowerCase()}/${capitulo}.json`;
            const response = await fetch(caminho, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            console.error(`Erro ao verificar capítulo ${livro} ${capitulo}:`, error);
            return false;
        }
    }

    async function getBookChapterCount(livro) {
        const chaveLivro = livro.toLowerCase();
        if (chapterCountCache[chaveLivro]) return chapterCountCache[chaveLivro];
        if (window.livros && window.livros[chaveLivro] && window.livros[chaveLivro].capitulos) {
            chapterCountCache[chaveLivro] = window.livros[chaveLivro].capitulos;
            return window.livros[chaveLivro].capitulos;
        }
        console.warn(`[Capítulos] Contagem para ${livro} não encontrada em 'window.livros'. Tentando descobrir...`);
        let maxChapter = 0;
        for (let capitulo = 1; capitulo <= 150; capitulo++) {
            if (await chapterExists(chaveLivro, capitulo)) maxChapter = capitulo;
            else break;
        }
        if (maxChapter > 0) console.log(`[Capítulos] ${chaveLivro} tem ${maxChapter} capítulos (descoberto).`);
        else console.error(`[Capítulos] Não foi possível determinar contagem para ${chaveLivro}.`);
        chapterCountCache[chaveLivro] = maxChapter;
        return maxChapter;
    }

    // === FUNÇÕES DE NAVEGAÇÃO ===
    async function getNextBookAndChapter(livroAtual, capituloAtual) {
        const indiceLivroAtual = BIBLE_BOOKS_ORDER.indexOf(livroAtual.toLowerCase());
        if (indiceLivroAtual === -1) return null;
        const totalCapitulosLivroAtual = await getBookChapterCount(livroAtual);
        if (capituloAtual < totalCapitulosLivroAtual) return { livro: livroAtual, capitulo: capituloAtual + 1 };
        if (indiceLivroAtual < BIBLE_BOOKS_ORDER.length - 1) return { livro: BIBLE_BOOKS_ORDER[indiceLivroAtual + 1], capitulo: 1 };
        return null;
    }

    async function getPreviousBookAndChapter(livroAtual, capituloAtual) {
        const indiceLivroAtual = BIBLE_BOOKS_ORDER.indexOf(livroAtual.toLowerCase());
        if (indiceLivroAtual <= 0) return null;
        const livroAnterior = BIBLE_BOOKS_ORDER[indiceLivroAtual - 1];
        const ultimoCapituloLivroAnterior = await getBookChapterCount(livroAnterior);
        return { livro: livroAnterior, capitulo: ultimoCapituloLivroAnterior };
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

        let leituraContainer = contentArea.querySelector('.reading-mode-content');
        if (!leituraContainer) {
            leituraContainer = document.createElement('div');
            leituraContainer.className = 'reading-mode-content';
            const refElement = contentArea.querySelector('#dynamic-chapter-buttons-container') || contentArea.querySelector('h2'); // Usa o ID do container de capítulos
            if (refElement) refElement.insertAdjacentElement('afterend', leituraContainer);
            else contentArea.appendChild(leituraContainer);
        }
        leituraContainer.innerHTML = '<div class="loading-message">Carregando capítulo...</div>';
        leituraContainer.style.display = 'block';

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
            navButtonsHtml += prevBookChapter ? `<button id="modoLeitura-capitulo-anterior" data-livro="${prevBookChapter.livro}" data-capitulo="${prevBookChapter.capitulo}">Cap. Anterior</button>` : `<button id="modoLeitura-capitulo-anterior" disabled>Cap. Anterior</button>`;
            navButtonsHtml += nextBookChapter ? `<button id="modoLeitura-capitulo-proximo" data-livro="${nextBookChapter.livro}" data-capitulo="${nextBookChapter.capitulo}">Cap. Próximo</button>` : `<button id="modoLeitura-capitulo-proximo" disabled>Cap. Próximo</button>`;
            navButtonsHtml += '</div>';

            if (isHtmlVersion) {
                const caminho = `../versao/${versaoAtual.toLowerCase()}/${livro.toLowerCase()}/${capituloNum}.html`;
                const response = await fetch(caminho);
                if (!response.ok) throw new Error(`Erro HTML ${capituloNum} (${response.status}) de ${caminho}`);
                const htmlString = await response.text();
                const doc = new DOMParser().parseFromString(htmlString, 'text/html');
                const container = doc.querySelector('div.versiculos');
                let htmlConstruido = '<div class="chapter-verses">';
                if (container) {
                    container.querySelectorAll('div[id^="versiculo-"]').forEach(div => {
                        const correspondenciaNumero = div.id.match(/(\d+)$/);
                        if (correspondenciaNumero && correspondenciaNumero[1]) {
                            const numero = correspondenciaNumero[1];
                            const titulo = div.querySelector('strong');
                            if (titulo) htmlConstruido += `<h3 class="verse-section-title">${titulo.textContent.trim()}</h3>`;
                            const clone = div.cloneNode(true);
                            const tituloClone = clone.querySelector('strong');
                            if (tituloClone) tituloClone.remove();
                            const texto = clone.textContent.trim();
                            if (texto) htmlConstruido += `<div class="verse-container"><sup class="verse-number">${numero}</sup><span class="verse-text">${texto}</span></div>`;
                        }
                    });
                } else if (doc.body && doc.body.innerHTML.trim() !== '') {
                    console.warn(`[Modo Leitura HTML] div.versiculos não encontrado. Usando body.innerHTML.`);
                    htmlConstruido += doc.body.innerHTML; // Poderia tentar parsear isso também, mas por ora é fallback bruto
                } else throw new Error('Arquivo HTML vazio ou sem div.versiculos.');
                htmlConstruido += '</div>'; 
                htmlParaExibir = htmlConstruido;
            } else { // JSON
                const caminho = `../versao/${versaoAtual.toLowerCase()}/${livro.toLowerCase()}/${capituloNum}.json`;
                const response = await fetch(caminho);
                if (!response.ok) throw new Error(`Erro JSON ${capituloNum} (${response.status}) de ${caminho}`);
                const dados = await response.json();
                let contador = typeof window.getSpecificVerseCount === 'function' ? window.getSpecificVerseCount(livro, capituloNum) : 0;
                contador = contador > 0 ? contador : (dados.versiculos ? Object.keys(dados.versiculos).length : 0);
                if (contador === 0 && (!dados.versiculos || Object.keys(dados.versiculos).length === 0)) throw new Error('Nenhum versículo (JSON).');
                let htmlVersiculos = '<div class="chapter-verses">';
                if (dados.titulo) htmlVersiculos += `<h3 class="chapter-main-title">${dados.titulo}</h3>`;
                for (let i = 1; i <= contador; i++) {
                    const chave = String(i);
                    if (dados.versiculos && dados.versiculos[chave]) {
                        if (dados.titulos && dados.titulos[chave]) htmlVersiculos += `<h3 class="verse-section-title">${dados.titulos[chave]}</h3>`;
                        htmlVersiculos += `<div class="verse-container"><sup class="verse-number">${i}</sup><span class="verse-text">${dados.versiculos[chave]}</span></div>`;
                    }
                }
                htmlVersiculos += '</div>';
                htmlParaExibir = htmlVersiculos;
            }
            leituraContainer.innerHTML = navButtonsHtml + htmlParaExibir;
            const configurarBotaoNavegacao = (id, livroDestino, capituloDestino) => {
                const botao = leituraContainer.querySelector(`#${id}`);
                if (botao && !botao.disabled) {
                    botao.addEventListener('click', async () => {
                        window.activeLivro = livroDestino; 
                        window.activeCapitulo = capituloDestino;
                        await window.loadChapterInReadingMode(livroDestino, capituloDestino);
                        const tituloH2 = contentArea.querySelector('h2');
                        if (tituloH2 && typeof window.getLivroDisplayName === 'function') {
                            tituloH2.textContent = `${window.getLivroDisplayName(livroDestino)} - CAPÍTULO ${capituloDestino}`;
                        }
                    });
                }
            };
            if(prevBookChapter) configurarBotaoNavegacao('modoLeitura-capitulo-anterior', prevBookChapter.livro, prevBookChapter.capitulo);
            if(nextBookChapter) configurarBotaoNavegacao('modoLeitura-capitulo-proximo', nextBookChapter.livro, nextBookChapter.capitulo);
            
            const tituloH2 = contentArea.querySelector('h2');
            if(tituloH2 && typeof window.getLivroDisplayName === 'function') {
                tituloH2.textContent = `${window.getLivroDisplayName(livro)} - CAPÍTULO ${capituloNum}`;
                Object.assign(tituloH2.style, { color: '#f0ad4e', textAlign: 'center', marginBottom: '20px' });
            }
        } catch (erro) {
            console.error('[Modo Leitura] Erro:', erro);
            const versao = localStorage.getItem('versaoBiblicaSelecionada') || 'ara';
            const isHtml = ['arc'].includes(versao.toLowerCase());
            const caminho = isHtml ? `../versao/${versao.toLowerCase()}/${livro.toLowerCase()}/${capitulo}.html` : `../versao/${versao.toLowerCase()}/${livro.toLowerCase()}/${capitulo}.json`;
            leituraContainer.innerHTML = `<div class="error-container" style="padding:20px;border:1px solid #d9534f;background-color:#f2dede;color:#a94442;border-radius:4px;"><p style="font-weight:bold;">⚠️ Erro capítulo ${capitulo} de ${livro.toUpperCase()}</p><p>Detalhes: ${erro.message}</p><p>Tentativa: ${caminho}</p><p>Tente:</p><ul><li>Verificar se o arquivo existe.</li><li>Navegar para outro capítulo.</li><li>Recarregar.</li></ul><div><button onclick="history.back()">Voltar</button><button onclick="location.reload()">Recarregar</button></div></div>`;
        }
    };

    window.toggleReadingMode = async function(enable, livro, capitulo) {
        window.isReadingModeEnabled = enable;
        const btn = document.getElementById('modo-leitura');
        if (btn) { btn.classList.toggle('active', enable); btn.setAttribute('aria-pressed', String(enable)); }
        
        const contentArea = document.querySelector('section.content');
        if (!contentArea) { console.error("toggleReadingMode: section.content não encontrada."); return; }
        let leituraContainer = contentArea.querySelector('.reading-mode-content');
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
                if (!leituraContainer) { 
                    leituraContainer = document.createElement('div');
                    leituraContainer.className = 'reading-mode-content';
                    const ref = contentArea.querySelector('#dynamic-chapter-buttons-container') || titleH2;
                    if (ref) ref.insertAdjacentElement('afterend', leituraContainer); else contentArea.appendChild(leituraContainer);
                }
                leituraContainer.innerHTML = '<p style="text-align:center; padding:20px;">Selecione um livro e capítulo.</p>';
                leituraContainer.style.display = 'block';
                if(titleH2) titleH2.textContent = "Modo Leitura";
            }
        } else { // SAINDO DO MODO LEITURA
            console.log("[ToggleMode] Saindo. Estado salvo:", window.lastActiveLivro, window.lastActiveCapitulo, window.lastActiveVerse);
            document.body.classList.remove('module-leitura'); 
            if (leituraContainer) { leituraContainer.remove(); leituraContainer = null; }
            
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
                    if btnToActivate) { btnToActivate.classList.add('active'); window.activeVersiculoButton = btnToActivate; }
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
    function handleKeyNavigation(evento) {
        if (!window.isReadingModeEnabled || (document.activeElement && /INPUT|TEXTAREA|true/.test(document.activeElement.tagName + document.activeElement.isContentEditable))) return;
        const acoes = { "ArrowLeft": 'modoLeitura-capitulo-anterior', "ArrowRight": 'modoLeitura-capitulo-proximo' };
        const idBotao = acoes[evento.key];
        if (idBotao) {
            const botao = document.getElementById(idBotao);
            if (botao && !botao.disabled) { evento.preventDefault(); botao.click(); }
        }
    }

    // === INICIALIZAÇÃO ===
    async function inicializarVersao(codigoVersao) {
        console.log(`[Principal] Inicializando ${codigoVersao.toUpperCase()}`);
        document.body.className = ''; 
        document.body.classList.add(['arc'].includes(codigoVersao.toLowerCase()) ? 'versao-html-ativa' : 'versao-json-ativa');
        try {
            await loadScriptAsync(`../script/${codigoVersao.toLowerCase()}.js`, 'script-versao-biblica');
            setPageTitle(codigoVersao);
            await loadScriptAsync(`../script/slide.js`, 'script-slide'); 
            if (typeof window.inicializarDropdowns === 'function') window.inicializarDropdowns();
            if (typeof window.inicializarSobre === 'function') window.inicializarSobre();
            if (typeof window.inicializarSlide === 'function') window.inicializarSlide();
            
            const botaoModoLeitura = document.getElementById('modo-leitura');
            if (botaoModoLeitura) {
                const novoBotao = botaoModoLeitura.cloneNode(true); // Para remover listeners antigos
                botaoModoLeitura.parentNode.replaceChild(novoBotao, botaoModoLeitura);
                novoBotao.addEventListener('click', (e) => { 
                    e.preventDefault(); 
                    window.toggleReadingMode(!window.isReadingModeEnabled, window.activeLivro, window.activeCapitulo); 
                });
            }
            document.removeEventListener('keydown', handleKeyNavigation); // Garante que não haja duplicatas
            document.addEventListener('keydown', handleKeyNavigation);
            console.log(`[Principal] ${codigoVersao.toUpperCase()} inicializada.`);
        } catch (error) {
            console.error(`[Principal] Erro init ${codigoVersao.toUpperCase()}:`, error);
            setPageTitle(codigoVersao); 
            alert(`Erro ao inicializar ${codigoVersao.toUpperCase()}.`);
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