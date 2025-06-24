/*===================================================*/
/*        SCRIPT PRINCIPAL DE VERSÕES BÍBLICAS       */
/*===================================================*/
/* Este script controla:                             */
/* - Carregamento das versões da Bíblia              */
/* - Navegação entre capítulos                       */
/* - Modo de leitura contínua                        */
/* - Interação do usuário com a Bíblia               */
/*===================================================*/

/*===================================================*/
/*     CONFIGURAÇÃO INICIAL E VARIÁVEIS GLOBAIS      */
/*===================================================*/

// Este bloco abaixo cria a função auto-executável que encapsula o código para evitar poluição
(function() { 
    'use strict';                                     // Ativa o modo estrito para prevenir erros comuns de programação
    const listaLivrosBiblia = [                       // Este bloco lista dos livros da Bíblia
        'genesis',
        'exodo',
        'levitico',
        'numeros',
        'deuteronomio',
        'josue',
        'juizes',
        'rute', 
        '1samuel',
        '2samuel',
        '1reis',
        '2reis',
        '1cronicas',
        '2cronicas',
        'esdras',
        'neemias',
        'ester',
        'jo',
        'salmos',
        'proverbios',
        'eclesiastes',
        'cantares',
        'isaias',
        'jeremias',
        'lamentacoes',
        'ezequiel',
        'daniel',
        'oseias',
        'joel',
        'amos',
        'obadias',
        'jonas',
        'miqueias',
        'naum',
        'habacuque',
        'sofonias',
        'ageu',
        'zacarias',
        'malaquias',
        'mateus',
        'marcos',
        'lucas',
        'joao',
        'atos',
        'romanos',
        '1corintios',
        '2corintios',
        'galatas',
        'efesios',
        'filipenses',
        'colossenses',
        '1tessalonicenses',
        '2tessalonicenses',
        '1timoteo',
        '2timoteo', 
        'tito',
        'filemom',
        'hebreus',
        'tiago',
        '1pedro',
        '2pedro',
        '1joao',
        '2joao',
        '3joao',
        'judas',
        'apocalipse'
    ];

    const cacheNumeroCapitulos = {};                                        // Objeto para armazenar o número de capítulos de cada livro em cache

   // Este bloco cria a função que retorna o valor de um parâmetro da URL, ex: 'versoes.html?versao=ara' → obterParametroUrl('versao') retorna 'ara'.
    function obterParametroUrl(parametro) {
        const parametrosUrl = new URLSearchParams(window.location.search);  // Cria um objeto para manipular os parâmetros da URL
        return parametrosUrl.get(parametro);                                    // Retorna o valor do parâmetro especificado
    }

    // Este bloco carrega um script JS de forma assíncrona conforme a versão escolhida, retornando uma promessa.
    function carregaScriptAssincrono(origem, id) {
        return new Promise((resolve, reject) => {
            const scriptAntigo = document.getElementById(id); // Remove qualquer script anterior com o mesmo ID, se existir
            if (scriptAntigo) scriptAntigo.remove();          // Remove o script anterior, se encontrado

            // Este bloco cria um novo elemento <script> para carregar os arquivos
            const novoScript = document.createElement('script');
            novoScript.src = origem;                          // Define o caminho do arquivo a ser carregado
            novoScript.id = id;                               // Define o ID do script
            novoScript.async = false;                         // Garante que o script seja carregado na ordem correta
            novoScript.onload = () => resolve();              // Executa quando o script é carregado com sucesso
            novoScript.onerror = (evento) => {                // Executa em caso de erro no carregamento
                console.error(`Falha ao carregar: ${origem}`, evento);
                reject(new Error(`Falha ${origem}`));
            };
            document.body.appendChild(novoScript);            // Adiciona o script ao final do <body>
        });
    }

    // Este bloco atualiza o título da página com a versão da Bíblia, ex: "Bíblia Sagrada ARA".
    function defineTituloPagina(codigoVersao) {
        const elementoTituloPrincipal = document.getElementById('titulo-principal-versao');                                        // Seleciona o elemento <h1> do título principal
        const elementoSubtituloExtenso = document.getElementById('subtitulo-versao-extenso');                                  // Seleciona o elemento do subtítulo
        if (elementoTituloPrincipal) elementoTituloPrincipal.textContent = `Bíblia Sagrada ${codigoVersao.toUpperCase()}`;                      // Atualiza o título com a versão
        if (elementoSubtituloExtenso) {
            if (window.NOME_VERSAO_COMPLETA_BIBLIA) elementoSubtituloExtenso.textContent = window.NOME_VERSAO_COMPLETA_BIBLIA; // Define o nome completo da versão, se disponível
            else elementoSubtituloExtenso.textContent = '';                                                                    // Limpa o subtítulo se não houver nome completo
        }
    }

    // Este bloco verifica se um capítulo existe, ex: Gênesis 1; retorna true ou false.
    async function capituloExistentes(livro, capitulo) {
        try {
            const versaoAtual = localStorage.getItem('versaoBiblicaSelecionada') || 'ara';          // Obtém a versão da Bíblia ou usa 'ara' como padrão
            const versoesQueUsamHtml = ['arc'];                                                     // Lista de versões que usam arquivos HTML
            const ehVersaoHtml = versoesQueUsamHtml.includes(versaoAtual.toLowerCase());            // Verifica se a versão atual usa HTML
            const caminho = ehVersaoHtml ?                                                          // Monta o caminho do arquivo com base no tipo (HTML ou JSON)
                `../versao/${versaoAtual.toLowerCase()}/${livro.toLowerCase()}/${capitulo}.html` :
                `../versao/${versaoAtual.toLowerCase()}/${livro.toLowerCase()}/${capitulo}.json`;

            const resposta = await fetch(caminho, { method: 'HEAD' });                              // Verifica se o arquivo existe sem baixar seu conteúdo
            return resposta.ok;                                                                     // Retorna true se o arquivo existe, false caso contrário
        } catch (error) {
            console.error(`Erro ao verificar capítulo ${livro} ${capitulo}:`, error);
            return false;                                                                           // Retorna false se ocorrer um erro
        }
    }

    // Este bloco conta o número de capítulos de um livro, usando cache para otimizar.
    async function obterContagemCapitulosLivro(livro) {
        const chaveLivro = livro.toLowerCase();                                                       // Normaliza o nome do livro para minúsculas
        if (cacheNumeroCapitulos[chaveLivro]) return cacheNumeroCapitulos[chaveLivro];                  // Retorna o número de capítulos do cache, se disponível
        if (window.livros && window.livros[chaveLivro] && window.livros[chaveLivro].capitulos) {        // Verifica se o número de capítulos está disponível em window.livros
            cacheNumeroCapitulos[chaveLivro] = window.livros[chaveLivro].capitulos;                     // Armazena no cache
            return window.livros[chaveLivro].capitulos;                                               // Retorna o número de capítulos
        }
 
        console.warn(`[Capítulos] Contagem para ${livro} não encontrada em 'window.livros'. Tentando descobrir...`);
        let maximoCapitulo = 0;                                                                     // Inicializa o contador de capítulos

        // ESte bloco tenta encontrar o último capítulo existente
        for (let capitulo = 1; capitulo <= 150; capitulo++) {
            if (await capituloExistentes(chaveLivro, capitulo)) maximoCapitulo = capitulo;                      // Atualiza o máximo se o capítulo existe
            else break;                                                                             // Para a busca se o capítulo não existe
        }

        cacheNumeroCapitulos[chaveLivro] = maximoCapitulo;                                            // Armazena o resultado no cache
        return maximoCapitulo;                                                                      // Retorna o número de capítulos
    }
    
    // =========================================================================================
    // == CORREÇÃO: As duas funções abaixo foram alteradas para 'window.nomeFuncao' para      ==
    // == torná-las globais e acessíveis pelo módulo 'versoes_navegacao_modoleitura.js'.       ==
    // =========================================================================================
    
    // Este bloco encontra o próximo livro e capítulo, ex: Gênesis 50 → Êxodo 1.
    window.obterProximoLivroECapitulo = async function(livroAtual, capituloAtual) {
        const indiceLivroAtual = listaLivrosBiblia.indexOf(livroAtual.toLowerCase());               // Encontra o índice do livro atual
        if (indiceLivroAtual === -1) return null;                                                   // Retorna null se o livro não for encontrado
        const numCapitulosLivro = await obterContagemCapitulosLivro(livroAtual);
        if (capituloAtual < numCapitulosLivro) {
             return { livro: livroAtual, capitulo: capituloAtual + 1 };
        }
        if (indiceLivroAtual < listaLivrosBiblia.length - 1)                                        // Verifica se não é o último livro
            return { livro: listaLivrosBiblia[indiceLivroAtual + 1], capitulo: 1 };                 // Retorna o próximo livro com capítulo 1
        return null;                                                                                // Retorna null se for o último livro
    };

    // Este bloco encontra o livro e capítulo anterior, ex: Êxodo 1 → Gênesis 50.
    window.obterLivroCapituloAnterior = async function(livroAtual, capituloAtual) {
        if (capituloAtual > 1) {
            return { livro: livroAtual, capitulo: capituloAtual - 1 };
        }
        const indiceLivroAtual = listaLivrosBiblia.indexOf(livroAtual.toLowerCase());               // Encontra o índice do livro atual na lista de livros
        if (indiceLivroAtual <= 0) return null;                                                     // Retorna null se for o primeiro livro (não há anterior)
        const livroAnterior = listaLivrosBiblia[indiceLivroAtual - 1];                              // Obtém o nome do livro anterior na lista
        const ultimoCapituloLivroAnterior = await obterContagemCapitulosLivro(livroAnterior);       // Obtém o número do último capítulo do livro anterior
        return { livro: livroAnterior, capitulo: ultimoCapituloLivroAnterior };                     // Retorna um objeto com o livro anterior e seu último capítulo
    };


    // Este bloco inicia os eventos e variáveis do modo de leitura.
    window.modoLeituraAtivo = false;                                                                // Controla se o modo leitura está ativo
    window.ultimoLivroSelecionado = null;                                                           // Último livro selecionado
    window.ultimoCapituloSelecionado = null;                                                        // Último capítulo selecionado
    window.ultimoVersiculoSelecionado = null;                                                       // Último versículo selecionado

    // Este bloco cria a função para carregar um capítulo no modo leitura contínuo.
    window.carregarCapituloModoLeitura = async function(livro, capitulo) {                          // Função que carrega e exibe um capítulo no modo leitura contínuo
        const areaConteudoLeitura = document.querySelector('section.conteudo');                     // Seleciona a área de conteúdo principal onde o capítulo será exibido
        if (!areaConteudoLeitura) { 
            console.error('[Modo Leitura] section.conteudo não encontrado.');                       // Exibe erro se a área de conteúdo não for encontrada
            return; 
        }

        // Este bloco remove conteúdos anteriores, como versículos ou contêineres
        areaConteudoLeitura.querySelectorAll('.texto-versiculo, .conteudo-versiculos, div.versiculos:not(.conteudo-versiculos)').forEach(el => el.remove());
        await atualizaBotoesCapitulos(livro, capitulo, true);                                       // Atualiza os botões de capítulos

        // Este bloco cria ou encontra o contêiner para o modo de leitura
        let containerLeitura = areaConteudoLeitura.querySelector('.modo-leitura-conteudo');
        if (!containerLeitura) {
            containerLeitura = document.createElement('div');                                       // Cria o container
            containerLeitura.className = 'modo-leitura-conteudo';                                   // Define a classe CSS

            const elementoReferencia = areaConteudoLeitura.querySelector('#dynamic-chapter-buttons-container') 
                || areaConteudoLeitura.querySelector('h2');                                         // Busca referência

            if (elementoReferencia) {
                elementoReferencia.insertAdjacentElement('afterend', containerLeitura);             // Insere após referência
            } else {
                areaConteudoLeitura.appendChild(containerLeitura);                                  // Insere no final
            }
        }

        // Este bloco exibe uma mensagem de carregamento enquanto o conteúdo é obtido 
        containerLeitura.innerHTML = '<div class="loading-message">Carregando capítulo...</div>';
        containerLeitura.style.display = 'block';                                                   // Torna o contêiner visível

        try {
            const versaoAtual = localStorage.getItem('versaoBiblicaSelecionada') || 'ara';
            const capituloNum = parseInt(capitulo);
            const versoesQueUsamHtml = ['arc'];
            const ehVersaoHtml = versoesQueUsamHtml.includes(versaoAtual.toLowerCase());
            console.log(`[Modo Leitura] Carregando: ${livro.toUpperCase()} ${capituloNum} (HTML: ${ehVersaoHtml})`);

            let htmlParaExibir = '';

            // Passo 1: Gerar o HTML dos botões de navegação.
            const htmlBotoesNavegacao = await window.gerarHtmlNavegacao(livro, capituloNum);

            // Passo 2: Carregar o conteúdo do capítulo.
            if (ehVersaoHtml) {
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
                    htmlConstruido += doc.body.innerHTML;
                } else throw new Error('Arquivo HTML vazio ou sem div.versiculos.');
                htmlConstruido += '</div>'; 
                htmlParaExibir = htmlConstruido;
            } else {
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

            // Passo 3: Inserir todo o conteúdo no DOM.
            containerLeitura.innerHTML = htmlBotoesNavegacao + htmlParaExibir;

            // Passo 4: Adicionar os eventos de clique aos botões que agora existem.
            await window.configurarListenersNavegacao(containerLeitura, livro, capituloNum);
            
            const tituloH2 = areaConteudoLeitura.querySelector('h2');
            if(tituloH2 && typeof window.getLivroDisplayName === 'function') {
                tituloH2.textContent = `${window.getLivroDisplayName(livro)} - CAPÍTULO ${capituloNum}`;
                Object.assign(tituloH2.style, { color: '#f0ad4e', textAlign: 'center', marginBottom: '20px' });
            }
        } catch (erro) {
            console.error('[Modo Leitura] Erro:', erro);
            const versao = localStorage.getItem('versaoBiblicaSelecionada') || 'ara';
            const ehVersaoHtml = ['arc'].includes(versao.toLowerCase());
            const caminho = ehVersaoHtml ? `../versao/${versao.toLowerCase()}/${livro.toLowerCase()}/${capitulo}.html` : `../versao/${versao.toLowerCase()}/${livro.toLowerCase()}/${capitulo}.json`;
            containerLeitura.innerHTML = `<div class="error-container" style="padding:20px;border:1px solid #d9534f;background-color:#f2dede;color:#a94442;border-radius:4px;"><p style="font-weight:bold;">⚠️ Erro capítulo ${capitulo} de ${livro.toUpperCase()}</p><p>Detalhes: ${erro.message}</p><p>Tentativa: ${caminho}</p><p>Tente:</p><ul><li>Verificar se o arquivo existe.</li><li>Navegar para outro capítulo.</li><li>Recarregar.</li></ul><div><button onclick="history.back()">Voltar</button><button onclick="location.reload()">Recarregar</button></div></div>`;
        }
    };

    /*===================================================*/
    /*     FUNÇÃO QUE ATIVA OU DESATIVA O MODO DE        */
    /*                LEITURA                           */
    /*===================================================*/
    /* Controla a exibição do conteúdo no modo contínuo  */
    /*===================================================*/
    window.toggleReadingMode = async function(ativar, livro, capitulo) {
        window.modoLeituraAtivo = ativar;                 // Define se o modo de leitura está ativo
        const botao = document.getElementById('modo-leitura');  // Seleciona o botão de modo de leitura
        if (botao) { 
            botao.classList.toggle('active', ativar);           // Adiciona ou remove a classe 'active'
            botao.setAttribute('aria-pressed', String(ativar)); // Atualiza o atributo ARIA
        }
        
        const areaConteudoAlternar = document.querySelector('section.conteudo');
                                                              // Seleciona a área de conteúdo
        if (!areaConteudoAlternar) { 
            console.error("toggleReadingMode: section.conteudo não encontrada."); 
            return; 
        }
        let containerLeitura = areaConteudoAlternar.querySelector('.modo-leitura-conteudo');
                                                              // Seleciona o contêiner do modo de leitura
        const tituloH2 = areaConteudoAlternar.querySelector('h2');
                                                              // Seleciona o título <h2>

        if (ativar) { // ENTRANDO NO MODO LEITURA
            document.body.classList.add('module-leitura');    // Adiciona a classe de modo de leitura ao <body>
            window.ultimoLivroSelecionado = window.activeLivro || livro;
                                                              // Salva o último livro ativo
            window.ultimoCapituloSelecionado = window.activeCapitulo || capitulo;
                                                              // Salva o último capítulo ativo
            window.ultimoVersiculoSelecionado = (window.activeVersiculoButton && window.activeVersiculoButton.dataset.versiculo) ? parseInt(window.activeVersiculoButton.dataset.versiculo) : 1;
                                                              // Salva o último versículo ativo
            
            /* Remove conteúdos que não pertencem ao modo de leitura */
            areaConteudoAlternar.querySelectorAll('.texto-versiculo, .conteudo-versiculos, div.capitulos:not(.conteudo-versiculos):not(.book-content):not(#dynamic-chapter-buttons-container)').forEach(el => el.remove());
            
            if (window.ultimoLivroSelecionado && window.ultimoCapituloSelecionado) {
                await window.carregarCapituloModoLeitura(window.ultimoLivroSelecionado, window.ultimoCapituloSelecionado);
                                                              // Carrega o capítulo no modo de leitura
            } else { 
                if (!containerLeitura) { 
                    containerLeitura = document.createElement('div');
                                                              // Cria um novo contêiner
                    containerLeitura.className = 'modo-leitura-conteudo';
                                                              // Define a classe
                    const elementoReferencia = areaConteudoAlternar.querySelector('#dynamic-chapter-buttons-container') || tituloH2;
                    if (elementoReferencia) elementoReferencia.insertAdjacentElement('afterend', containerLeitura); else areaConteudoAlternar.appendChild(containerLeitura);
                                                              // Insere o contêiner
                }
                containerLeitura.innerHTML = '<p style="text-align:center; padding:20px;">Selecione um livro e capítulo.</p>';
                                                              // Exibe mensagem inicial
                containerLeitura.style.display = 'block';     // Torna o contêiner visível
                if(tituloH2) tituloH2.textContent = "Modo Leitura";
                                                              // Define o título
            }
        } else { // SAINDO DO MODO LEITURA
            console.log("[ToggleMode] Saindo. Estado salvo:", window.ultimoLivroSelecionado, window.ultimoCapituloSelecionado, window.ultimoVersiculoSelecionado);
            document.body.classList.remove('module-leitura');  // Remove a classe de modo de leitura
            if (containerLeitura) { 
                containerLeitura.remove();                     // Remove o contêiner do modo de leitura
                containerLeitura = null; 
            }
            
            areaConteudoAlternar.querySelectorAll('.texto-versiculo, .conteudo-versiculos').forEach(el => el.remove());
                                                              // Remove conteúdos de versículos

            if (window.ultimoLivroSelecionado && window.ultimoCapituloSelecionado) {
                await atualizaBotoesCapitulos(window.ultimoLivroSelecionado, window.ultimoCapituloSelecionado, false);
                                                              // Atualiza os botões de capítulos
                // Only call toggleVersiculos if it hasn't been handled by atualizaBotoesCapitulos
                if (typeof window.toggleVersiculos === 'function') await window.toggleVersiculos(window.ultimoLivroSelecionado, window.ultimoCapituloSelecionado);
                                                              // Carrega os versículos
                
                let versiculoParaCarregar = window.ultimoVersiculoSelecionado || 1;// Define o versículo a ser carregado
                if (typeof window.loadSpecificVerse === 'function') await window.loadSpecificVerse(window.ultimoLivroSelecionado, window.ultimoCapituloSelecionado, versiculoParaCarregar);
                                                              // Carrega o versículo
                else console.error("toggleReadingMode: loadSpecificVerse não encontrada.");

                const novoContainerBotoesVersiculos = areaConteudoAlternar.querySelector('.conteudo-versiculos');
                                                              // Seleciona o contêiner de botões de versículos
                if (novoContainerBotoesVersiculos) {
                    const todosBotoesVersiculos = novoContainerBotoesVersiculos.querySelectorAll('button.botao-versiculo');
                                                              // Seleciona todos os botões de versículos
                    todosBotoesVersiculos.forEach(b => b.classList.remove('active'));
                                                              // Remove a classe 'active' de todos
                    const botaoParaAtivar = Array.from(todosBotoesVersiculos).find(b => parseInt(b.dataset.versiculo) === versiculoParaCarregar) || (todosBotoesVersiculos.length > 0 && versiculoParaCarregar === 1 ? todosBotoesVersiculos[0] : null);
                                                              // Encontra o botão a ser ativado
                    if (botaoParaAtivar) { 
                        botaoParaAtivar.classList.add('active');// Ativa o botão
                        window.activeVersiculoButton = botaoParaAtivar;
                                                              // Define o botão ativo
                    }
                }

                if (tituloH2 && typeof window.getLivroDisplayName === 'function') {
                    tituloH2.textContent = `${window.getLivroDisplayName(window.ultimoLivroSelecionado)} - CAPÍTULO ${window.ultimoCapituloSelecionado} - VERSÍCULO ${versiculoParaCarregar}`;
                                                              // Atualiza o título
                    Object.assign(tituloH2.style, { color: '', textAlign: '', marginBottom: '' });
                                                              // Remove os estilos
                }
                window.activeLivro = window.ultimoLivroSelecionado;  // Define o livro ativo
                window.activeCapitulo = window.ultimoCapituloSelecionado;
                                                              // Define o capítulo ativo
            } else {
                console.log("[ToggleMode] Saindo, sem estado ativo salvo.");
                defineTituloPagina(localStorage.getItem('versaoBiblicaSelecionada') || 'ara');
                                                              // Define o título padrão
                if(tituloH2) {
                    tituloH2.textContent = "Selecione um Livro";
                                                              // Define o título inicial
                    Object.assign(tituloH2.style, { color: '', textAlign: '', marginBottom: '' });
                                                              // Remove os estilos
                }
                areaConteudoAlternar.querySelectorAll('#dynamic-chapter-buttons-container').forEach(c => c.remove());
                                                              // Remove os botões de capítulos
            }
        }
    };

    /*===================================================*/
    /*     FUNÇÃO QUE LIDA COM NAVEGAÇÃO POR TECLAS       */
    /*===================================================*/
    /* A lógica foi movida para o módulo                 */
    /* 'versoes_navegacao_modoleitura.js'                */
    /*===================================================*/

    /*===================================================*/
    /*     FUNÇÃO QUE INICIALIZA A VERSÃO DA BÍBLIA       */
    /*===================================================*/
    /* Carrega scripts e configura eventos              */
    /*===================================================*/
    async function inicializarVersao(codigoVersao) {
        console.log(`[Principal] Inicializando ${codigoVersao.toUpperCase()}`);
                                                              // Log da inicialização
        document.body.className = '';                         // Limpa as classes do <body>
        document.body.classList.add(['arc'].includes(codigoVersao.toLowerCase()) ? 'versao-html-ativa' : 'versao-json-ativa');
                                                              // Adiciona a classe apropriada
        try {
            await carregaScriptAssincrono(`../script/${codigoVersao.toLowerCase()}.js`, 'script-versao-biblica');
                                                              // Carrega o script da versão
            defineTituloPagina(codigoVersao);                          // Atualiza o título da página
            await carregaScriptAssincrono(`../script/slide.js`, 'script-slide');
                                                              // Carrega o script de slides
            if (typeof window.inicializarDropdowns === 'function') window.inicializarDropdowns();
                                                              // Inicializa dropdowns, se disponível
            if (typeof window.inicializarSobre === 'function') window.inicializarSobre();
                                                              // Inicializa a seção "Sobre", se disponível
            if (typeof window.inicializarSlide === 'function') window.inicializarSlide();
                                                              // Inicializa slides, se disponível
            
            const botaoModoLeitura = document.getElementById('modo-leitura');
                                                              // Seleciona o botão de modo de leitura
            if (botaoModoLeitura) {
                const novoBotao = botaoModoLeitura.cloneNode(true);
                                                              // Clona o botão para evitar listeners duplicados
                botaoModoLeitura.parentNode.replaceChild(novoBotao, botaoModoLeitura);
                                                              // Substitui o botão antigo
                novoBotao.addEventListener('click', (e) => {     // Adiciona o evento de clique
                    e.preventDefault(); 
                    window.toggleReadingMode(!window.modoLeituraAtivo, window.activeLivro, window.activeCapitulo);
                                                              // Alterna o modo de leitura
                });
            }
            // O listener de navegação por teclado agora é adicionado pelo seu próprio módulo
            console.log(`[Principal] ${codigoVersao.toUpperCase()} inicializada.`);
        } catch (erro) {
            console.error(`[Principal] Erro init ${codigoVersao.toUpperCase()}:`, erro);
                                                              // Exibe erro no console
            defineTituloPagina(codigoVersao);                          // Define o título mesmo em caso de erro
            alert(`Erro ao inicializar ${codigoVersao.toUpperCase()}.`);
                                                              // Exibe um alerta ao usuário
        }
    }

    /*===================================================*/
    /*     FUNÇÃO QUE INICIALIZA A PÁGINA                */
    /*===================================================*/
    /* Configura a versão inicial e eventos do seletor   */
    /*===================================================*/
    function initializePage() {
        const seletor = document.getElementById('seletor-versao-principal');
                                                              // Seleciona o elemento de seleção de versão
        let opcoesValidas = ['arc', 'ara', 'nvi', 'acf', 'ntlh', 'kjv', 'naa', 'original'];
                                                              // Lista de versões válidas
        let versaoPadrao = 'arc';                             // Define a versão padrão
        if (seletor && seletor.options.length > 0) {
            opcoesValidas = Array.from(seletor.options).map(opcao => opcao.value);
                                                              // Obtém as opções do seletor
            versaoPadrao = seletor.value || opcoesValidas[0]; // Define a versão padrão com base no seletor
        }
        let versaoInicial = obterParametroUrl('versao') || localStorage.getItem('versaoBiblicaSelecionada') || versaoPadrao;
                                                              // Define a versão inicial
        if (!opcoesValidas.includes(versaoInicial.toLowerCase())) versaoInicial = opcoesValidas[0];
                                                              // Usa a primeira opção válida, se necessário
        if (seletor) seletor.value = versaoInicial;           // Define o valor do seletor
        localStorage.setItem('versaoBiblicaSelecionada', versaoInicial);
                                                              // Salva a versão no localStorage
        inicializarVersao(versaoInicial);                     // Inicializa a versão
        if (seletor) {
            seletor.addEventListener('change', (e) => {       // Adiciona evento de mudança no seletor
                localStorage.setItem('versaoBiblicaSelecionada', e.target.value);
                                                              // Salva a nova versão
                window.location.search = `?versao=${e.target.value}`;
                                                              // Recarrega a página com a nova versão
            });
        }
        const listaVersoes = document.getElementById('versoes-list');
                                                              // Seleciona a lista de versões
        if (listaVersoes && seletor && opcoesValidas.length > 0) {
            listaVersoes.innerHTML = '';                      // Limpa a lista
            const opcoesTexto = Object.fromEntries(Array.from(seletor.options).map(opcao => [opcao.value, opcao.textContent]));
                                                              // Mapeia os textos das opções
            opcoesValidas.forEach(versao => {                 // Para cada versão válida
                const itemLista = document.createElement('li'); // Cria um item de lista
                const link = document.createElement('a');      // Cria um link
                link.href = `?versao=${versao}`;              // Define o link da versão
                link.textContent = opcoesTexto[versao] || versao.toUpperCase();
                                                              // Define o texto do link
                itemLista.appendChild(link);                  // Adiciona o link ao item
                listaVersoes.appendChild(itemLista);          // Adiciona o item à lista
            });
        }
    }
    document.addEventListener('DOMContentLoaded', initializePage);
                                                              // Executa a inicialização quando a página carrega

    /*===================================================*/
    /*         CRIAÇÃO E MANIPULAÇÃO DE ELEMENTOS        */
    /*                   HTML                           */
    /*===================================================*/
    /* O bloco abaixo cria e atualiza os botões de capítulos na tela                */
    /* Esta função é chamada quando um livro é selecionado                         */
    async function atualizaBotoesCapitulos(livro, capituloAtual, isReadingMode) {
        const areaConteudo = document.querySelector('section.conteudo');
                                                              // Seleciona a área de conteúdo
        if (!areaConteudo) { 
            console.error("atualizaBotoesCapitulos: section.conteudo não encontrada."); 
            return; 
        }

        /* Remove todos os contêineres de botões de capítulos existentes */
        const containersBotoesCapitulosExistentes = areaConteudo.querySelectorAll('div.capitulos:not(.conteudo-versiculos), #dynamic-chapter-buttons-container');
        containersBotoesCapitulosExistentes.forEach(container => container.remove());

        let containerCapitulos = document.createElement('div');
                                                              // Cria um novo contêiner para os botões
        containerCapitulos.className = 'capitulos';           // Define a classe
        containerCapitulos.id = 'dynamic-chapter-buttons-container';
                                                              // Define o ID
        
        const tituloH2 = areaConteudo.querySelector('h2');    // Seleciona o título <h2>
        if (tituloH2) tituloH2.insertAdjacentElement('afterend', containerCapitulos);
                                                              // Insere o contêiner após o título
        else areaConteudo.insertBefore(containerCapitulos, areaConteudo.firstChild);
                                                              // Insere no início se não houver título
        
        const totalCapitulos = await obterContagemCapitulosLivro(livro);
                                                              // Obtém o número total de capítulos
        if (totalCapitulos === 0) {
            containerCapitulos.innerHTML = `<p class="error-message">Não foi possível carregar os capítulos para ${livro}.</p>`;
                                                              // Exibe mensagem de erro
            return;
        }
        
        for (let i = 1; i <= totalCapitulos; i++) {
            const botao = document.createElement('button');   // Cria um botão
            botao.textContent = i;                            // Define o texto do botão
            botao.dataset.capitulo = i;                       // Define o número do capítulo
            botao.dataset.livro = livro;                      // Define o livro
            botao.classList.add('botao-capitulo-dinamico');   // Adiciona a classe do botão
            if (i === parseInt(capituloAtual)) botao.classList.add('active');
                                                              // Destaca o capítulo atual
            
            botao.addEventListener('click', async function() {
                                                              // Adiciona evento de clique
                const capituloClicado = parseInt(this.dataset.capitulo);
                                                              // Obtém o capítulo clicado
                const livroClicado = this.dataset.livro;      // Obtém o livro clicado
                window.activeLivro = livroClicado;            // Define o livro ativo
                window.activeCapitulo = capituloClicado;      // Define o capítulo ativo
                
                if (window.modoLeituraAtivo) await window.carregarCapituloModoLeitura(livroClicado, capituloClicado);
                                                              // Carrega no modo de leitura
                else {
                    if (typeof window.toggleVersiculos === 'function') await window.toggleVersiculos(livroClicado, capituloClicado);
                                                              // Carrega os versículos
                    else console.error("Função toggleVersiculos não encontrada.");
                }
                
                containerCapitulos.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                                                              // Remove a classe 'active' de outros botões
                this.classList.add('active');                 // Adiciona a classe 'active' ao botão clicado
                
                if (typeof window.getLivroDisplayName === 'function') { 
                    const tituloH2Atual = areaConteudo.querySelector('h2');
                                                              // Seleciona o título <h2>
                    if (tituloH2Atual) {
                        let textoTitulo = `${window.getLivroDisplayName(livroClicado)} - CAPÍTULO ${capituloClicado}`;
                                                              // Define o texto do título
                        if (!window.modoLeituraAtivo && window.activeVersiculoButton && window.activeVersiculoButton.dataset.versiculo) {
                            textoTitulo += ` - VERSÍCULO ${window.activeVersiculoButton.dataset.versiculo}`;
                                                              // Adiciona o versículo ao título
                        }
                        tituloH2Atual.textContent = textoTitulo;   // Atualiza o título
                    }
                }
            });
            containerCapitulos.appendChild(botao);            // Adiciona o botão ao contêiner
        }
        console.log(`[Capítulos] Criados ${totalCapitulos} botões dinâmicos para ${livro} em #${containerCapitulos.id}`);
                                                              // Log da criação dos botões
    }

    /*===================================================*/
    /*     DEFINE O NOME COMPLETO DA VERSÃO DA BÍBLIA     */
    /*===================================================*/
    window.NOME_VERSAO_COMPLETA_BIBLIA = 'Versão King James';
                                                              // Define o nome completo da versão
})();