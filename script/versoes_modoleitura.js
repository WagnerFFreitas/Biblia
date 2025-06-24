/*===================================================*/
/*        MÓDULO DE GERENCIAMENTO DO MODO LEITURA    */
/*===================================================*/
/* Este script controla:                             */
/* - O estado (ativo/inativo) do modo leitura.       */
/* - O carregamento e a exibição do conteúdo.        */
/* - A transição da interface ao entrar/sair do modo.*/
/*===================================================*/

(function() {
    'use strict';

    //-----------------------------------------------------
    // 1. VARIÁVEIS DE ESTADO DO MÓDULO
    //-----------------------------------------------------
    window.modoLeituraAtivo = false; 
    window.ultimoLivroSelecionado = null; 
    window.ultimoCapituloSelecionado = null; 
    window.ultimoVersiculoSelecionado = null; 

    //-----------------------------------------------------
    // 2. FUNÇÃO PRINCIPAL: CARREGAR CAPÍTULO
    //-----------------------------------------------------
    window.carregarCapituloModoLeitura = async function(livro, capitulo) {
        const areaConteudoLeitura = document.querySelector('section.conteudo');
        if (!areaConteudoLeitura) { 
            console.error('[Modo Leitura] A área de conteúdo principal não foi encontrada na página.');
            return; 
        }

        // Limpa qualquer texto de versículo antigo.
        areaConteudoLeitura.querySelectorAll('.texto-versiculo, .conteudo-versiculos, div.versiculos:not(.conteudo-versiculos)').forEach(el => el.remove());
        
        // No modo leitura, a barra de capítulos deve ser recriada para mostrar a posição atual.
        await window.atualizaBotoesCapitulos(livro, capitulo);

        let containerLeitura = areaConteudoLeitura.querySelector('.modo-leitura-conteudo');
        if (!containerLeitura) {
            containerLeitura = document.createElement('div');
            containerLeitura.className = 'modo-leitura-conteudo';
            const elementoReferencia = areaConteudoLeitura.querySelector('#dynamic-chapter-buttons-container') || areaConteudoLeitura.querySelector('h2');
            if (elementoReferencia) elementoReferencia.insertAdjacentElement('afterend', containerLeitura);
            else areaConteudoLeitura.appendChild(containerLeitura);
        }

        containerLeitura.innerHTML = '<div class="loading-message">Carregando capítulo...</div>';
        containerLeitura.style.display = 'block';

        try {
            if (!livro) {
                throw new Error("O nome do livro não pode ser nulo.");
            }
            
            const versoesQueUsamHtml = ['arc'];
            const versaoAtual = window.obterPreferencia && window.obterPreferencia('versaoBiblicaSelecionada', 'ara') || 'ara';
            const ehVersaoHtml = versoesQueUsamHtml.includes(versaoAtual.toLowerCase());
            
            const htmlBotoesNavegacao = await window.gerarHtmlNavegacao(livro, capitulo);

            let htmlParaExibir = '';
            let dadosCapitulo = window.obterCapítuloDoCache(livro, capitulo);

            if (ehVersaoHtml) {
                if (!dadosCapitulo) {
                    const caminho = `../versao/${versaoAtual.toLowerCase()}/${livro.toLowerCase()}/${capitulo}.html`;
                    const response = await fetch(caminho);
                    if (!response.ok) throw new Error(`Arquivo HTML não encontrado: ${caminho}`);
                    dadosCapitulo = await response.text();
                    window.cacheCapítulo(livro, capitulo, dadosCapitulo);
                }
                const doc = new DOMParser().parseFromString(dadosCapitulo, 'text/html');
                let htmlConstruido = '<div class="chapter-verses">';
                doc.querySelectorAll('div[id^="versiculo-"]').forEach(div => {
                    const match = div.id.match(/(\d+)$/);
                    if (match) {
                        const numero = match[1];
                        const titulo = div.querySelector('strong');
                        if (titulo) htmlConstruido += `<h3 class="verse-section-title">${titulo.textContent.trim()}</h3>`;
                        const clone = div.cloneNode(true);
                        if (clone.querySelector('strong')) clone.querySelector('strong').remove();
                        const texto = clone.textContent.trim();
                        if (texto) htmlConstruido += `<div class="verse-container"><sup class="verse-number">${numero}</sup><span class="verse-text">${texto}</span></div>`;
                    }
                });
                htmlConstruido += '</div>';
                htmlParaExibir = htmlConstruido;
            } else { // JSON
                if (!dadosCapitulo) {
                    const caminho = `../versao/${versaoAtual.toLowerCase()}/${livro.toLowerCase()}/${capitulo}.json`;
                    const response = await fetch(caminho);
                    if (!response.ok) throw new Error(`Arquivo JSON não encontrado: ${caminho}`);
                    dadosCapitulo = await response.json();
                    window.cacheCapítulo(livro, capitulo, dadosCapitulo);
                }
                let htmlVersiculos = '<div class="chapter-verses">';
                if (dadosCapitulo.titulo) htmlVersiculos += `<h3 class="chapter-main-title">${dadosCapitulo.titulo}</h3>`;
                const versiculos = Object.keys(dadosCapitulo.versiculos || {});
                for (let i = 1; i <= versiculos.length; i++) {
                    const chave = String(i);
                    if (dadosCapitulo.versiculos[chave]) {
                        if (dadosCapitulo.titulos && dadosCapitulo.titulos[chave]) htmlVersiculos += `<h3 class="verse-section-title">${dadosCapitulo.titulos[chave]}</h3>`;
                        htmlVersiculos += `<div class="verse-container"><sup class="verse-number">${i}</sup><span class="verse-text">${dadosCapitulo.versiculos[chave]}</span></div>`;
                    }
                }
                htmlVersiculos += '</div>';
                htmlParaExibir = htmlVersiculos;
            }

            containerLeitura.innerHTML = htmlBotoesNavegacao + htmlParaExibir;
            await window.configurarListenersNavegacao(containerLeitura, livro, capitulo);
            
            const tituloH2 = areaConteudoLeitura.querySelector('h2');
            if (tituloH2 && typeof window.getLivroDisplayName === 'function') {
                tituloH2.textContent = `${window.getLivroDisplayName(livro)} - CAPÍTULO ${capitulo}`;
                Object.assign(tituloH2.style, { color: '#f0ad4e', textAlign: 'center', marginBottom: '20px' });
            }
        } catch (erro) {
            console.error('[Modo Leitura] Erro:', erro);
            containerLeitura.innerHTML = `<div class="error-container" style="text-align:center; padding: 20px; color: red;">
                                              <p><b>Erro ao carregar o capítulo.</b></p>
                                              <p><small>${erro.message}</small></p>
                                          </div>`;
        }
    };

    //-----------------------------------------------------
    // 3. FUNÇÃO DE CONTROLE: ATIVAR/DESATIVAR O MODO
    //-----------------------------------------------------
    window.toggleReadingMode = async function(ativar, livro, capitulo) {
        window.modoLeituraAtivo = ativar;
        const botao = document.getElementById('modo-leitura');
        if (botao) { 
            botao.classList.toggle('active', ativar);
            botao.setAttribute('aria-pressed', String(ativar));
        }
        
        const areaConteudo = document.querySelector('section.conteudo');
        if (!areaConteudo) { 
            console.error("toggleReadingMode: section.conteudo não encontrada."); 
            return; 
        }
        
        const tituloH2 = areaConteudo.querySelector('h2');

        if (ativar) { // ENTRANDO NO MODO LEITURA
            document.body.classList.add('module-leitura');
            window.ultimoLivroSelecionado = window.activeLivro || livro;
            window.ultimoCapituloSelecionado = window.activeCapitulo || capitulo;
            window.ultimoVersiculoSelecionado = (window.activeVersiculoButton && window.activeVersiculoButton.dataset.versiculo) ? parseInt(window.activeVersiculoButton.dataset.versiculo) : 1;
            
            areaConteudo.querySelectorAll(
                '.texto-versiculo, .conteudo-versiculos, #dynamic-chapter-buttons-container, #dynamic-verse-buttons-container'
            ).forEach(el => el.remove());
            
            if (window.ultimoLivroSelecionado && window.ultimoCapituloSelecionado) {
                await window.carregarCapituloModoLeitura(window.ultimoLivroSelecionado, window.ultimoCapituloSelecionado);
            } else { 
                let containerLeitura = areaConteudo.querySelector('.modo-leitura-conteudo');
                if (!containerLeitura) { 
                    containerLeitura = document.createElement('div');
                    containerLeitura.className = 'modo-leitura-conteudo';
                    if (tituloH2) tituloH2.insertAdjacentElement('afterend', containerLeitura);
                    else areaConteudo.appendChild(containerLeitura);
                }
                containerLeitura.innerHTML = '<div class="reading-mode-message" style="text-align:center; padding: 20px;"><p>Por favor, selecione um livro e capítulo primeiro para usar o Modo Leitura.</p></div>';
                containerLeitura.style.display = 'block';
                if (tituloH2) tituloH2.textContent = "Modo Leitura";
            }
        } else { // SAINDO DO MODO LEITURA
            document.body.classList.remove('module-leitura');
            const containerLeitura = areaConteudo.querySelector('.modo-leitura-conteudo');
            if (containerLeitura) containerLeitura.remove();
            
            if (window.ultimoLivroSelecionado && window.ultimoCapituloSelecionado) {
                await window.atualizaBotoesCapitulos(window.ultimoLivroSelecionado, window.ultimoCapituloSelecionado);
                
                if (typeof window.toggleVersiculos === 'function') {
                    await window.toggleVersiculos(window.ultimoLivroSelecionado, window.ultimoCapituloSelecionado);
                }
                
                let versiculoParaCarregar = window.ultimoVersiculoSelecionado || 1;
                if (typeof window.loadSpecificVerse === 'function') {
                    await window.loadSpecificVerse(window.ultimoLivroSelecionado, window.ultimoCapituloSelecionado, versiculoParaCarregar);
                }

                if (tituloH2 && typeof window.getLivroDisplayName === 'function') {
                    tituloH2.textContent = `${window.getLivroDisplayName(window.ultimoLivroSelecionado)} - CAPÍTULO ${window.ultimoCapituloSelecionado} - VERSÍCULO ${versiculoParaCarregar}`;
                    Object.assign(tituloH2.style, { color: '', textAlign: '', marginBottom: '' });
                }
                window.activeLivro = window.ultimoLivroSelecionado;
                window.activeCapitulo = window.ultimoCapituloSelecionado;
            } else {
                const versao = window.obterPreferencia('versaoBiblicaSelecionada', 'ara');
                window.defineTituloPagina(versao);
                if (tituloH2) {
                    tituloH2.textContent = "Selecione um Livro";
                    Object.assign(tituloH2.style, { color: '', textAlign: '', marginBottom: '' });
                }
                areaConteudo.querySelectorAll('#dynamic-chapter-buttons-container').forEach(c => c.remove());
            }
        }
    };
    
    console.log('[versoes_modoleitura.js] Módulo carregado e pronto.');
})();