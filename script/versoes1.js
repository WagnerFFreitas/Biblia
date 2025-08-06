/*===============================================================================*/
/*                     SCRIPT PRINCIPAL DE VERSÕES BÍBLICAS                      */
/*===============================================================================*/
/*  Este script controla:                                                        */
/*                       - Carregamento das versões da Bíblia                    */
/*                       - Navegação entre capítulos                             */
/*                       - Interação do usuário com a Bíblia                     */
/*                       - Busca otimizada e NAVEGÁVEL sem travar o navegador    */
/*===============================================================================*/

(function () {
    'use strict';

    function obterParametroUrl(parametro) {
        const parametrosUrl = new URLSearchParams(window.location.search);
        return parametrosUrl.get(parametro);
    }

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

    window.NOME_VERSAO_COMPLETA_BIBLIA = 'Versão King James';

    window.modoLeituraAtivo = false;
    window.ultimoLivroSelecionado = null;
    window.ultimoCapituloSelecionado = null;
    window.ultimoVersiculoSelecionado = null;

    // =======================================================================
    // FUNÇÃO "PONTE" PARA NAVEGAÇÃO - VERSÃO CORRIGIDA
    // =======================================================================
    window.navegarParaVersiculo = async function(livro, cap, vers) {
        console.log(`[Navegação] Solicitado navegar para: ${livro} ${cap}:${vers}`);

        if (typeof window.atualizaBotoesCapitulos !== 'function' || typeof window.toggleVersiculos !== 'function') {
            alert("Erro: Funções de navegação da página principal não encontradas.");
            return;
        }
        
        // Garante que o modo leitura está desativado
        if (window.modoLeituraAtivo) {
            await window.toggleReadingMode(false);
        }

        // 1. Exibe os botões do capítulo correto. A função já marca o capítulo como ativo.
        await window.atualizaBotoesCapitulos(livro, cap);

        // 2. Exibe os botões dos versículos para aquele capítulo.
        await window.toggleVersiculos(livro, cap);

        // 3. Aguarda o DOM ser atualizado e então executa a lógica final.
        setTimeout(() => {
            const containerCapitulos = document.querySelector('#dynamic-chapter-buttons-container');
            const containerVersiculos = document.querySelector('.conteudo-versiculos');

            if (containerCapitulos) {
                // **A CORREÇÃO ESTÁ AQUI**
                // Garante que o botão do capítulo correto esteja marcado, removendo de outros.
                containerCapitulos.querySelectorAll('button').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.capitulo == cap);
                });
            }

            if (!containerVersiculos) {
                console.error("Container de versículos não encontrado após o toggle.");
                return;
            }

            const botaoVersiculo = containerVersiculos.querySelector(`button[data-versiculo="${vers}"]`);
            if (botaoVersiculo && typeof botaoVersiculo.click === 'function') {
                console.log(`[Navegação] Clicando no botão do versículo ${vers}.`);
                botaoVersiculo.click(); // Isso vai carregar o texto e marcar o botão do versículo como ativo.
            } else {
                console.error(`[Navegação] Botão para o versículo ${vers} não foi encontrado.`);
            }
        }, 150); // Aumentei um pouco o tempo de espera para garantir que tudo seja renderizado.
    };


    async function inicializarVersao(codigoVersao) {
        console.log(`[Principal] Inicializando ${codigoVersao.toUpperCase()}`);
        document.body.className = '';
        document.body.classList.add(['arc'].includes(codigoVersao.toLowerCase()) ? 'versao-html-ativa' : 'versao-json-ativa');
        try {
            await carregaScriptAssincrono('../script/versoes_cache.js', 'script-versoes-cache');
            await carregaScriptAssincrono('../script/versoes_navegacao.js', 'script-versoes-navegacao');
            await carregaScriptAssincrono('../script/versoes_capitulos.js', 'script-versoes-capitulos');
            await carregaScriptAssincrono('../script/versoes_versiculos.js', 'script-versoes-versiculos');
            await carregaScriptAssincrono('../script/versoes_interface.js', 'script-versoes-interface');
            await carregaScriptAssincrono('../script/versoes_navegacao_modoleitura.js', 'script-versoes-navegacao-modoleitura');
            await carregaScriptAssincrono('../script/versoes_modoleitura.js', 'script-versoes-modoleitura');
            await carregaScriptAssincrono('../script/versoes_realizabusca.js', 'script-versoes-realizabusca');
            await carregaScriptAssincrono(`../script/${codigoVersao.toLowerCase()}.js`, 'script-versao-biblica');

            window.defineTituloPagina(codigoVersao);

            await carregaScriptAssincrono('../script/slide_biblia_dados.js', 'script-slide-dados');
            await carregaScriptAssincrono('../script/slide_biblia_utils.js', 'script-slide-utils');
            await carregaScriptAssincrono('../script/slide_biblia_interface.js', 'script-slide-interface');
            await carregaScriptAssincrono('../script/slide_biblia_janela.js', 'script-slide-janela');
            await carregaScriptAssincrono('../script/slide_biblia_coordenador.js', 'script-slide-coordenador');

            if (typeof window.inicializarDropdowns === 'function') window.inicializarDropdowns();
            if (typeof window.inicializarSobre === 'function') window.inicializarSobre();
            if (typeof window.inicializarSlide === 'function') window.inicializarSlide();

            const botaoModoLeitura = document.getElementById('modo-leitura');
            if (botaoModoLeitura) {
                const novoBotao = botaoModoLeitura.cloneNode(true);
                botaoModoLeitura.parentNode.replaceChild(novoBotao, botaoModoLeitura);
                novoBotao.addEventListener('click', (e) => {
                    e.preventDefault();
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

    window.defineTituloPagina = function (codigoVersao) {
        const elementoTituloPrincipal = document.getElementById('titulo-principal-versao');
        const elementoSubtituloExtenso = document.getElementById('subtitulo-versao-extenso');
        if (elementoTituloPrincipal) elementoTituloPrincipal.textContent = `Bíblia Sagrada ${codigoVersao.toUpperCase()}`;
        if (elementoSubtituloExtenso) elementoSubtituloExtenso.textContent = window.NOME_VERSAO_COMPLETA_BIBLIA || '';
    };

    function initializePage() {
        const seletor = document.getElementById('seletor-versao-principal');
        let opcoesValidas = ['arc', 'ara', 'nvi', 'acf', 'ntlh', 'kjv', 'naa', 'original'];
        let versaoPadrao = 'arc';

        if (seletor && seletor.options.length > 0) {
            opcoesValidas = Array.from(seletor.options).map(opcao => opcao.value);
            versaoPadrao = seletor.value || opcoesValidas[0];
        }

        let versaoInicial = obterParametroUrl('versao') ||
            (typeof window.obterPreferencia === 'function' ? window.obterPreferencia('versaoBiblicaSelecionada', 'arc') : localStorage.getItem('versaoBiblicaSelecionada') || 'arc');

        if (!opcoesValidas.includes(versaoInicial.toLowerCase())) versaoInicial = opcoesValidas[0];
        if (seletor) seletor.value = versaoInicial;
        if (window.salvarPreferencia) window.salvarPreferencia('versaoBiblicaSelecionada', versaoInicial);
        else localStorage.setItem('versaoBiblicaSelecionada', versaoInicial);

        inicializarVersao(versaoInicial);

        function getLivroDisplayName(livro) {
            const nomes = {
                genesis: "Gênesis", exodo: "Êxodo", levitico: "Levítico", numeros: "Números", deuteronomio: "Deuteronômio",
                josue: "Josué", juizes: "Juízes", rute: "Rute", "1samuel": "1º Samuel", "2samuel": "2º Samuel",
                "1reis": "1º Reis", "2reis": "2º Reis", "1cronicas": "1º Crônicas", "2cronicas": "2º Crônicas",
                esdras: "Esdras", neemias: "Neemias", ester: "Ester", jo: "Jó", salmos: "Salmos", proverbios: "Provérbios",
                eclesiastes: "Eclesiastes", cantares: "Cantares de Salomão", isaias: "Isaías", jeremias: "Jeremias",
                lamentacoes: "Lamentações de Jeremias", ezequiel: "Ezequiel", daniel: "Daniel", oseias: "Oseias", joel: "Joel",
                amos: "Amós", obadias: "Obadias", jonas: "Jonas", miqueias: "Miqueias", naum: "Naum", habacuque: "Habacuque",
                sofonias: "Sofonias", ageu: "Ageu", zacarias: "Zacarias", malaquias: "Malaquias", mateus: "Mateus", marcos: "Marcos",
                lucas: "Lucas", joao: "João", atos: "Atos dos Apóstolos", romanos: "Romanos", "1corintios": "1º Coríntios",
                "2corintios": "2º Coríntios", galatas: "Gálatas", efesios: "Efésios", filipenses: "Filipenses", colossenses: "Colossenses",
                "1tessalonicenses": "1º Tessalonicenses", "2tessalonicenses": "2º Tessalonicenses", "1timoteo": "1º Timóteo",
                "2timoteo": "2º Timóteo", tito: "Tito", filemom: "Filemom", hebreus: "Hebreus", tiago: "Tiago", "1pedro": "1º Pedro",
                "2pedro": "2º Pedro", "1joao": "1º João", "2joao": "2º João", "3joao": "3º João", judas: "Judas", apocalipse: "Apocalipse"
            };
            return nomes[livro] || livro;
        }
        
        async function realizarBusca(termo) {
            if (!termo) return;

            const overlayAntigo = document.getElementById('search-overlay');
            if (overlayAntigo) overlayAntigo.remove();

            const overlay = document.createElement('div');
            overlay.id = 'search-overlay';
            
            const shadow = overlay.attachShadow({ mode: 'open' });

            shadow.innerHTML = `<style>
                :host {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background-color: #1c1c1c; 
                    z-index: 10000; color: #fff;
                    overflow-y: auto; padding: 20px;
                    box-sizing: border-box;
                }
            </style>
            <link rel="stylesheet" href="../css/biblia_realizabusca.css">
            <div id="marcadagua"></div>
            <script src="../script/marcadagua.js"><\/script>
            <div id="search-content">
                <h2 style="color: yellow; text-align: center;">Resultados da Busca</h2>
                <div id="resultados-busca-container"><p>Buscando...</p></div>
            </div>`;
            
            document.body.appendChild(overlay);
            document.body.style.overflow = 'hidden';

            if (typeof window.realizarBuscaAvancada === 'function') {
                const resultados = await window.realizarBuscaAvancada(termo);
                exibirResultados(resultados, overlay, getLivroDisplayName);
            } else {
                const container = overlay.shadowRoot.querySelector('#resultados-busca-container');
                container.innerHTML = '<p>Funcionalidade de busca não carregada.</p>';
            }
        }
        
        function exibirResultados(resultados, overlay, getLivroDisplayNameFunc) {
            const shadow = overlay.shadowRoot;
            const container = shadow.querySelector('#resultados-busca-container');
            container.innerHTML = '';
        
            const botaoFechar = document.createElement('button');
            botaoFechar.textContent = 'Fechar Busca';
            botaoFechar.style.cssText = 'position: fixed; top: 20px; right: 30px; background-color: #f44336; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; z-index: 10;';
            
            botaoFechar.onclick = () => {
                document.body.style.overflow = '';
                overlay.remove();
            };
            
            shadow.appendChild(botaoFechar);

            if (resultados.length === 0) {
                container.innerHTML = '<p>Nenhum resultado encontrado.</p>';
            } else {
                resultados.forEach(r => {
                    const div = document.createElement('div');
                    div.className = 'resultado-item'; 
                    div.innerHTML = `<strong><a href="#" data-livro="${r.livro}" data-cap="${r.cap}" data-vers="${r.vers}">${getLivroDisplayNameFunc(r.livro)} ${r.cap}:${r.vers}</a></strong><span>${r.texto}</span>`;
                    
                    const link = div.querySelector('a');
                    link.style.color = 'inherit';
                    link.style.textDecoration = 'underline';
                    link.style.cursor = 'pointer';

                    link.addEventListener('click', (e) => {
                        e.preventDefault(); 
                        const livro = e.target.dataset.livro;
                        const cap = e.target.dataset.cap;
                        const vers = e.target.dataset.vers;

                        if (typeof window.navegarParaVersiculo === 'function') {
                            window.navegarParaVersiculo(livro, cap, vers);
                        }
                        botaoFechar.click();
                    });
                    container.appendChild(div);
                });
            }
        }

        const botaoBuscar = document.querySelector('.barraPesquisa button');
        const inputBusca = document.querySelector('.barraPesquisa input');
        if (botaoBuscar && inputBusca) {
            botaoBuscar.addEventListener('click', () => {
                const termo = inputBusca.value.trim();
                realizarBusca(termo);
            });

            inputBusca.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const termo = inputBusca.value.trim();
                    realizarBusca(termo);
                }
            });
        }

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