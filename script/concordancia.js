// concordancia.js
document.addEventListener('DOMContentLoaded', () => {
    const searchInputGlobal = document.querySelector('.search-input');
    const searchBtnGlobal = document.querySelector('.search-btn');
    const resultadosContainer = document.getElementById('resultados-container');
    const categoriaBtns = document.querySelectorAll('.categoria-btn');
    const letraBtns = document.querySelectorAll('.letra-btn');

    const filtroPalavraInput = document.getElementById('filtro-palavra-input');
    const testamentoSelect = document.getElementById('testamento-select');
    const livroSelect = document.getElementById('livro-select');

    let dadosCompletosDaFonteAtual = []; // Guarda os dados brutos da letra/categoria/busca global atual
    let dadosFiltradosParaExibicao = []; // Guarda os dados após todos os filtros serem aplicados
    let tituloAtualResultados = "";
    let termoDeBuscaAtivo = ""; // Para saber o que destacar

    const bibliaConfig = {
        ordemLivros: [
            "Gênesis", "Êxodo", "Levítico", "Números", "Deuteronômio", "Josué", "Juízes", "Rute",
            "1 Samuel", "2 Samuel", "1 Reis", "2 Reis", "1 Crônicas", "2 Crônicas", "Esdras", "Neemias", "Ester", "Jó",
            "Salmos", "Provérbios", "Eclesiastes", "Cantares", "Isaías", "Jeremias", "Lamentações", "Ezequiel", "Daniel",
            "Oséias", "Joel", "Amós", "Obadias", "Jonas", "Miquéias", "Naum", "Habacuque", "Sofonias", "Ageu", "Zacarias", "Malaquias",
            "Mateus", "Marcos", "Lucas", "João", "Atos", "Romanos", "1 Coríntios", "2 Coríntios", "Gálatas", "Efésios",
            "Filipenses", "Colossenses", "1 Tessalonicenses", "2 Tessalonicenses", "1 Timóteo", "2 Timóteo", "Tito", "Filemom",
            "Hebreus", "Tiago", "1 Pedro", "2 Pedro", "1 João", "2 João", "3 João", "Judas", "Apocalipse"
        ],
        detalhesLivros: {
            "Gênesis": { testamento: "Antigo Testamento" }, "Êxodo": { testamento: "Antigo Testamento" },
            "Levítico": { testamento: "Antigo Testamento" }, "Números": { testamento: "Antigo Testamento" },
            "Deuteronômio": { testamento: "Antigo Testamento" }, "Josué": { testamento: "Antigo Testamento" },
            "Juízes": { testamento: "Antigo Testamento" }, "Rute": { testamento: "Antigo Testamento" },
            "1 Samuel": { testamento: "Antigo Testamento" }, "2 Samuel": { testamento: "Antigo Testamento" },
            "1 Reis": { testamento: "Antigo Testamento" }, "2 Reis": { testamento: "Antigo Testamento" },
            "1 Crônicas": { testamento: "Antigo Testamento" }, "2 Crônicas": { testamento: "Antigo Testamento" },
            "Esdras": { testamento: "Antigo Testamento" }, "Neemias": { testamento: "Antigo Testamento" },
            "Ester": { testamento: "Antigo Testamento" }, "Jó": { testamento: "Antigo Testamento" },
            "Salmos": { testamento: "Antigo Testamento" }, "Provérbios": { testamento: "Antigo Testamento" },
            "Eclesiastes": { testamento: "Antigo Testamento" }, "Cantares": { testamento: "Antigo Testamento" },
            "Isaías": { testamento: "Antigo Testamento" }, "Jeremias": { testamento: "Antigo Testamento" },
            "Lamentações": { testamento: "Antigo Testamento" }, "Ezequiel": { testamento: "Antigo Testamento" },
            "Daniel": { testamento: "Antigo Testamento" }, "Oséias": { testamento: "Antigo Testamento" },
            "Joel": { testamento: "Antigo Testamento" }, "Amós": { testamento: "Antigo Testamento" },
            "Obadias": { testamento: "Antigo Testamento" }, "Jonas": { testamento: "Antigo Testamento" },
            "Miquéias": { testamento: "Antigo Testamento" }, "Naum": { testamento: "Antigo Testamento" },
            "Habacuque": { testamento: "Antigo Testamento" }, "Sofonias": { testamento: "Antigo Testamento" },
            "Ageu": { testamento: "Antigo Testamento" }, "Zacarias": { testamento: "Antigo Testamento" },
            "Malaquias": { testamento: "Antigo Testamento" },
            "Mateus": { testamento: "Novo Testamento" }, "Marcos": { testamento: "Novo Testamento" },
            "Lucas": { testamento: "Novo Testamento" }, "João": { testamento: "Novo Testamento" },
            "Atos": { testamento: "Novo Testamento" }, "Romanos": { testamento: "Novo Testamento" },
            "1 Coríntios": { testamento: "Novo Testamento" }, "2 Coríntios": { testamento: "Novo Testamento" },
            "Gálatas": { testamento: "Novo Testamento" }, "Efésios": { testamento: "Novo Testamento" },
            "Filipenses": { testamento: "Novo Testamento" }, "Colossenses": { testamento: "Novo Testamento" },
            "1 Tessalonicenses": { testamento: "Novo Testamento" }, "2 Tessalonicenses": { testamento: "Novo Testamento" },
            "1 Timóteo": { testamento: "Novo Testamento" }, "2 Timóteo": { testamento: "Novo Testamento" },
            "Tito": { testamento: "Novo Testamento" }, "Filemom": { testamento: "Novo Testamento" },
            "Hebreus": { testamento: "Novo Testamento" }, "Tiago": { testamento: "Novo Testamento" },
            "1 Pedro": { testamento: "Novo Testamento" }, "2 Pedro": { testamento: "Novo Testamento" },
            "1 João": { testamento: "Novo Testamento" }, "2 João": { testamento: "Novo Testamento" },
            "3 João": { testamento: "Novo Testamento" }, "Judas": { testamento: "Novo Testamento" },
            "Apocalipse": { testamento: "Novo Testamento" }
        },
        getNomesLivrosOrdenados: function() { return this.ordemLivros; },
        getNomesLivrosPorTestamento: function(testamentoFiltro) {
            if (testamentoFiltro === "todos") return this.getNomesLivrosOrdenados();
            return this.getNomesLivrosOrdenados().filter(livro => {
                const detalhes = this.detalhesLivros[livro];
                return detalhes && detalhes.testamento === testamentoFiltro;
            });
        },
        getTestamentoDoLivro: function(nomeLivroReferencia) {
            const nomeLivroNormalizado = this.normalizarNomeLivro(nomeLivroReferencia);
            const detalhes = this.detalhesLivros[nomeLivroNormalizado];
            return detalhes ? detalhes.testamento : null;
        },
        normalizarNomeLivro: function(nome) { 
            if (!nome) return null;
            if (nome.toLowerCase().startsWith("cântico dos cânticos")) return "Cantares";
            return nome;
        }
    };

    function extrairNomeLivroDaReferencia(referencia) {
        if (!referencia) return "Desconhecido";
        const match = referencia.match(/^(\d\s*)?[A-Za-záàâãéèêíïóôõöúçñ]+/);
        const nomeExtraido = match ? match[0].trim() : "Desconhecido";
        return bibliaConfig.normalizarNomeLivro(nomeExtraido);
    }

    function destacarPalavra(texto, palavraParaDestacar) {
        if (!texto || !palavraParaDestacar || palavraParaDestacar.trim() === "") return texto;
        const palavraEscapada = palavraParaDestacar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${palavraEscapada})`, 'gi');
        return texto.replace(regex, '<span class="highlight">$1</span>');
    }

    function mostrarErro(mensagem) {
        // Limpa apenas as seções de palavras e erros anteriores, mantém o cabeçalho geral se houver.
        let cabecalhoGeralExistente = resultadosContainer.querySelector('.palavra-header[style*="background-color: rgb(28, 28, 28)"]'); // Identifica o cabeçalho geral
        
        resultadosContainer.querySelectorAll('.palavra-section, .erro-mensagem').forEach(el => el.remove());

        if (!cabecalhoGeralExistente && tituloAtualResultados) { // Se o título foi definido mas o cabeçalho não está lá (ex: primeira carga com erro)
            cabecalhoGeralExistente = document.createElement('div');
            cabecalhoGeralExistente.className = 'palavra-header';
            Object.assign(cabecalhoGeralExistente.style, { backgroundColor: '#1c1c1c', fontSize: '1.7em', marginBottom: '25px', padding: '15px 20px', justifyContent: 'center' });
            cabecalhoGeralExistente.textContent = tituloAtualResultados;
            resultadosContainer.prepend(cabecalhoGeralExistente); // Adiciona no início
        }
        
        const erroDiv = document.createElement('div');
        erroDiv.className = 'erro-mensagem';
        erroDiv.innerHTML = `<p>${mensagem}</p>`;
        resultadosContainer.appendChild(erroDiv);
    }
    
    async function carregarDadosBase(url, titulo, termoPrincipalParaDestaque) {
        resultadosContainer.innerHTML = `<p style="color: #fff; text-align: center; font-size: 1.2em; padding:20px;">Carregando ${titulo.toLowerCase()}...</p>`;
        termoDeBuscaAtivo = termoPrincipalParaDestaque || ""; // Define o termo para destaque
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Arquivo não encontrado: ${url} (${response.status})`);
            const dadosJson = await response.json();
            let listaDePalavras;
            const chavePrimaria = url.split('/').pop().split('.')[0]; 

            if (Array.isArray(dadosJson)) listaDePalavras = dadosJson;
            else if (dadosJson && typeof dadosJson === 'object') {
                listaDePalavras = dadosJson[chavePrimaria] || dadosJson.palavras || dadosJson.items || dadosJson.data || dadosJson.versiculos;
                if (!Array.isArray(listaDePalavras)) {
                    const chaves = Object.keys(dadosJson);
                    if (chaves.length === 1 && Array.isArray(dadosJson[chaves[0]])) listaDePalavras = dadosJson[chaves[0]];
                    else if (dadosJson.palavra && dadosJson.concordancias) listaDePalavras = [dadosJson];
                }
            }
            if (!Array.isArray(listaDePalavras)) throw new Error(`Formato inesperado em ${url}.`);
            
            dadosCompletosDaFonteAtual = listaDePalavras.map(pItem => ({
                ...pItem,
                ocorrencias: typeof pItem.ocorrencias === 'number' ? pItem.ocorrencias : (pItem.concordancias ? pItem.concordancias.length : 0)
            }));

            tituloAtualResultados = titulo;
            processarEExibirResultados(); 
        } catch (erro) {
            console.error(`Erro ao carregar ${url}:`, erro);
            dadosCompletosDaFonteAtual = [];
            tituloAtualResultados = titulo; // Mantém o título para a mensagem de erro
            mostrarErro(`Não foi possível carregar "${titulo}". ${erro.message}`);
        }
    }

    function carregarPalavrasPorLetra(letra) {
        // Ao carregar por letra, não há um "termo de busca ativo" global, o destaque será a palavra do item
        carregarDadosBase(`../concordancia/${letra.toLowerCase()}.json`, `Palavras Iniciadas com a Letra "${letra}"`, null);
    }
    function carregarCategoria(categoriaNome) {
        carregarDadosBase(`../concordancia/${categoriaNome.toLowerCase()}.json`, `Categoria: ${categoriaNome}`, null);
    }

    function renderizarResultadosFiltrados(listaParaRenderizar, tituloDaSecao) {
        resultadosContainer.innerHTML = ''; 
        if (tituloDaSecao) {
            const cabecalhoGeral = document.createElement('div');
            cabecalhoGeral.className = 'palavra-header'; 
            Object.assign(cabecalhoGeral.style, { backgroundColor: '#1c1c1c', fontSize: '1.7em', marginBottom: '25px', padding: '15px 20px', justifyContent: 'center' });
            cabecalhoGeral.textContent = tituloDaSecao;
            resultadosContainer.appendChild(cabecalhoGeral);
        }

        if (!listaParaRenderizar || listaParaRenderizar.length === 0) {
            mostrarErro(tituloDaSecao ? `Nenhuma palavra encontrada para "${tituloDaSecao}" com os filtros atuais.` : "Nenhuma palavra encontrada com os filtros atuais.");
            return;
        }

        listaParaRenderizar.forEach(palavraItem => {
            const secaoPalavra = document.createElement('div');
            secaoPalavra.className = 'palavra-section';
            const cabecalhoPalavra = document.createElement('div');
            cabecalhoPalavra.className = 'palavra-header';
            cabecalhoPalavra.innerHTML = `<span>${palavraItem.palavra}</span><span class="contador">${palavraItem.ocorrencias || 0} ocorrências</span>`; // Usa o contador original
            secaoPalavra.appendChild(cabecalhoPalavra);

            const infoAdicionalContainer = document.createElement('div');
            infoAdicionalContainer.className = 'palavra-info-adicional';
            let temInfoAdicional = false;
            if (palavraItem.fonte) { infoAdicionalContainer.innerHTML += `<div class="palavra-fonte-info"><strong>Fonte:</strong> ${palavraItem.fonte}</div>`; temInfoAdicional = true; }
            if (palavraItem["veja tambem"] && palavraItem["veja tambem"].length > 0) { infoAdicionalContainer.innerHTML += `<div class="palavra-veja-tambem-info"><strong>Veja também:</strong> ${palavraItem["veja tambem"].join(', ')}</div>`; temInfoAdicional = true; }
            
            // 'palavraItem.concordancias' aqui são as concordâncias JÁ FILTRADAS por Testamento/Livro
            if (temInfoAdicional && palavraItem.concordancias && palavraItem.concordancias.length > 0) {
                secaoPalavra.appendChild(infoAdicionalContainer);
            }
            
            if (palavraItem.concordancias && palavraItem.concordancias.length > 0) {
                const concordanciasAgrupadas = palavraItem.concordancias.reduce((acc, con) => {
                    const nomeLivro = extrairNomeLivroDaReferencia(con.referencia);
                    if (!acc[nomeLivro]) acc[nomeLivro] = [];
                    acc[nomeLivro].push(con);
                    return acc;
                }, {});
                Object.entries(concordanciasAgrupadas).forEach(([nomeLivro, concordanciasDoLivro]) => {
                    const grupoLivro = document.createElement('div');
                    grupoLivro.className = 'livro-grupo';
                    const cabecalhoLivro = document.createElement('div');
                    cabecalhoLivro.className = 'livro-header';
                    cabecalhoLivro.textContent = nomeLivro;
                    grupoLivro.appendChild(cabecalhoLivro);
                    concordanciasDoLivro.forEach(con => {
                        const ocorrenciaDiv = document.createElement('div');
                        ocorrenciaDiv.className = 'ocorrencia';
                        // Se termoDeBuscaAtivo está definido (veio de uma busca), usa ele para destacar. Senão, usa a palavra do item.
                        const palavraParaRealce = termoDeBuscaAtivo || palavraItem.palavra;
                        ocorrenciaDiv.innerHTML = `<div class="referencia">${con.referencia}</div><div class="texto">${destacarPalavra(con.texto, palavraParaRealce)}</div>`;
                        grupoLivro.appendChild(ocorrenciaDiv);
                    });
                    secaoPalavra.appendChild(grupoLivro);
                });
            } else if (palavraItem.palavra) { 
                 const p = document.createElement('p');
                 p.textContent = "Nenhuma ocorrência encontrada com os filtros atuais para esta palavra.";
                 Object.assign(p.style, { padding: "10px 20px", fontStyle: "italic", color: "#aaa", textAlign: "center" });
                 secaoPalavra.appendChild(p);
            }
            resultadosContainer.appendChild(secaoPalavra);
        });
    }

    function popularLivrosDropdown() {
        const testamentoSelecionado = testamentoSelect.value;
        const livrosFiltrados = bibliaConfig.getNomesLivrosPorTestamento(testamentoSelecionado);
        livroSelect.innerHTML = '<option value="todos">Todos os livros</option>';
        livrosFiltrados.forEach(nomeLivro => {
            const option = document.createElement('option');
            option.value = nomeLivro;
            option.textContent = nomeLivro;
            livroSelect.appendChild(option);
        });
    }

    function processarEExibirResultados() {
        const termoFiltroPalavraLocal = filtroPalavraInput.value.toLowerCase().trim();
        const testamentoFiltro = testamentoSelect.value;
        const livroFiltro = livroSelect.value;

        if (!dadosCompletosDaFonteAtual) {
            renderizarResultadosFiltrados([], tituloAtualResultados || "Nenhum dado carregado.");
            return;
        }
        
        let palavrasProcessadas = dadosCompletosDaFonteAtual;

        // 1. Se o filtro de palavra local está ativo, refina `palavrasProcessadas`
        //    Este filtro atua SOBRE a lista já carregada (seja de letra, categoria ou busca global)
        if (termoFiltroPalavraLocal) {
            palavrasProcessadas = palavrasProcessadas.filter(palavraItem => 
                palavraItem.palavra.toLowerCase().includes(termoFiltroPalavraLocal)
            );
        }

        // 2. Para cada palavra restante, filtrar SUAS CONCORDÂNCIAS por Testamento e Livro
        dadosFiltradosParaExibicao = palavrasProcessadas.map(palavraItemOriginal => {
            const palavraItemFiltrada = { 
                ...palavraItemOriginal, // Mantém 'ocorrencias' original
                concordancias: [...(palavraItemOriginal.concordancias || [])] // Cria cópia das concordâncias para filtrar
            };
            
            if (testamentoFiltro !== "todos" || livroFiltro !== "todos") {
                palavraItemFiltrada.concordancias = palavraItemFiltrada.concordancias.filter(con => {
                    const nomeLivroConcordancia = extrairNomeLivroDaReferencia(con.referencia);
                    if (!nomeLivroConcordancia || nomeLivroConcordancia === "Desconhecido") return false; 
                    const testamentoDaConcordancia = bibliaConfig.getTestamentoDoLivro(nomeLivroConcordancia);
                    if (testamentoFiltro !== "todos" && testamentoDaConcordancia !== testamentoFiltro) return false;
                    if (livroFiltro !== "todos" && nomeLivroConcordancia !== livroFiltro) return false;
                    return true;
                });
            }
            return palavraItemFiltrada;
        });
        renderizarResultadosFiltrados(dadosFiltradosParaExibicao, tituloAtualResultados);
    }
    
    function contemPalavraInteira(texto, palavra) {
        if (!texto || !palavra) return false;
        const palavraEscapada = palavra.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${palavraEscapada}\\b`, 'i'); 
        return regex.test(texto);
    }

    async function realizarBuscaGlobalPeloInputPrincipal() {
        const termoOriginal = searchInputGlobal.value.trim(); 
        if (!termoOriginal) {
            mostrarErro("Digite um termo para a busca global.");
            dadosCompletosDaFonteAtual = []; 
            tituloAtualResultados = "";
            filtroPalavraInput.value = ""; testamentoSelect.value = "todos"; popularLivrosDropdown(); livroSelect.value = "todos";
            processarEExibirResultados(); 
            return;
        }
        termoDeBuscaAtivo = termoOriginal; // Define o termo para destaque
        const termoLower = termoOriginal.toLowerCase();

        letraBtns.forEach(b => b.classList.remove('active'));
        categoriaBtns.forEach(b => b.classList.remove('active'));
        filtroPalavraInput.value = ""; testamentoSelect.value = "todos"; popularLivrosDropdown(); livroSelect.value = "todos";
        
        resultadosContainer.innerHTML = `<p style="color: #fff; text-align: center; padding:20px; font-size:1.2em;">Buscando por "${termoOriginal}"...</p>`;
        tituloAtualResultados = `Resultados da Busca por: "${termoOriginal}"`;

        const letras = "abcdefghijklmnopqrstuvwxyz".split('');
        const nomesCategorias = Array.from(categoriaBtns).map(btn => btn.getAttribute('data-categoria')?.toLowerCase()).filter(cat => cat);
        const fontesParaBuscar = [...new Set([...letras, ...nomesCategorias])]; 
        
        let resultadosDaBusca = [];

        for (const nomeFonte of fontesParaBuscar) {
            try {
                const response = await fetch(`../concordancia/${nomeFonte}.json`);
                if (response.ok) {
                    const dadosFonte = await response.json();
                    let listaDePalavrasNaFonte = dadosFonte[nomeFonte] || (Array.isArray(dadosFonte) ? dadosFonte : []);
                    if (!Array.isArray(listaDePalavrasNaFonte) && typeof dadosFonte === 'object') {
                        const chaves = Object.keys(dadosFonte);
                        if (chaves.length === 1 && Array.isArray(dadosFonte[chaves[0]])) listaDePalavrasNaFonte = dadosFonte[chaves[0]];
                    }
                    
                    listaDePalavrasNaFonte.forEach(palavraJson => { 
                        let palavraPrincipalCorresponde = (palavraJson.palavra.toLowerCase() === termoLower);
                        let fonteCorresponde = (palavraJson.fonte && contemPalavraInteira(palavraJson.fonte, termoOriginal));
                        let vejaTambemCorresponde = (palavraJson["veja tambem"] && Array.isArray(palavraJson["veja tambem"]) &&
                                             palavraJson["veja tambem"].some(vt => vt.toLowerCase() === termoLower || contemPalavraInteira(vt, termoOriginal)));
                        let concordanciasQueContemTermo = [];
                        if (palavraJson.concordancias && Array.isArray(palavraJson.concordancias)) {
                            palavraJson.concordancias.forEach(con => {
                                if ((con.referencia && contemPalavraInteira(con.referencia, termoOriginal)) ||
                                    (con.texto && contemPalavraInteira(con.texto, termoOriginal))) {
                                    concordanciasQueContemTermo.push(con);
                                }
                            });
                        }
                        
                        if (palavraPrincipalCorresponde || fonteCorresponde || vejaTambemCorresponde || concordanciasQueContemTermo.length > 0) {
                            let entradaExistente = resultadosDaBusca.find(r => r.palavra === palavraJson.palavra);
                            if (!entradaExistente) {
                                entradaExistente = {
                                    ...palavraJson, 
                                    ocorrencias: typeof palavraJson.ocorrencias === 'number' ? palavraJson.ocorrencias : (palavraJson.concordancias ? palavraJson.concordancias.length : 0),
                                    concordancias: (palavraPrincipalCorresponde || fonteCorresponde || vejaTambemCorresponde) ? 
                                                   (palavraJson.concordancias || []) : 
                                                   concordanciasQueContemTermo 
                                };
                                resultadosDaBusca.push(entradaExistente);
                            } else {
                                if (concordanciasQueContemTermo.length > 0) {
                                    concordanciasQueContemTermo.forEach(novaCon => {
                                        if (!entradaExistente.concordancias.find(ec => ec.referencia === novaCon.referencia && ec.texto === novaCon.texto)) {
                                            entradaExistente.concordancias.push(novaCon);
                                        }
                                    });
                                }
                                // Se a palavra principal bateu agora, mas antes só concordâncias, atualiza para todas as concordâncias
                                if ((palavraPrincipalCorresponde || fonteCorresponde || vejaTambemCorresponde) && !(entradaExistente.concordancias === (palavraJson.concordancias || []))) {
                                     entradaExistente.concordancias = palavraJson.concordancias || [];
                                }
                            }
                        }
                    });
                }
            } catch (erro) { /* Silencia erros de arquivos não encontrados */ }
        }

        dadosCompletosDaFonteAtual = resultadosDaBusca;

        if (dadosCompletosDaFonteAtual.length === 0) {
            // Mantém o cabeçalho da busca e mostra o erro
            const cabecalhoExistente = resultadosContainer.querySelector('.palavra-header[style*="background-color: rgb(28, 28, 28)"]');
            resultadosContainer.innerHTML = ''; // Limpa tudo
            if (cabecalhoExistente) resultadosContainer.appendChild(cabecalhoExistente); // Readiciona só o cabeçalho geral
            mostrarErro(`Nenhum resultado encontrado para "${termoOriginal}".`); 
        } else {
            processarEExibirResultados(); 
        }
    }
    
    // Esta função agora é para a busca local, disparada pelo filtroPalavraInput
    async function buscarApenasPalavrasPrincipais(termoOriginal) {
        const termo = termoOriginal.toLowerCase().trim();
        termoDeBuscaAtivo = termoOriginal; // Define o termo para destaque

        if (!termo) { // Se o campo de filtro de palavra for limpo
            // Tenta restaurar a visualização anterior (letra/categoria) ou busca global se foi a última
            const letraAtiva = Array.from(letraBtns).find(b => b.classList.contains('active'));
            const categoriaAtiva = Array.from(categoriaBtns).find(b => b.classList.contains('active'));
            if (letraAtiva) carregarPalavrasPorLetra(letraAtiva.getAttribute('data-letra'));
            else if (categoriaAtiva) carregarCategoria(categoriaAtiva.getAttribute('data-categoria'));
            else if (searchInputGlobal.value.trim()) realizarBuscaGlobalPeloInputPrincipal(); // Se havia uma busca global, refaz
            else { // Senão, limpa
                dadosCompletosDaFonteAtual = [];
                tituloAtualResultados = "";
                processarEExibirResultados(); // Isso vai mostrar "nenhum dado" ou a mensagem inicial
            }
            return;
        }
        
        // Se há termo, faz a busca por palavra principal
        letraBtns.forEach(b => b.classList.remove('active'));
        categoriaBtns.forEach(b => b.classList.remove('active'));
        resultadosContainer.innerHTML = `<p style="color: #fff; text-align: center; padding:20px; font-size:1.2em;">Buscando por palavras: "${termoOriginal}"...</p>`;
        tituloAtualResultados = `Palavras correspondentes a: "${termoOriginal}"`;

        const letras = "abcdefghijklmnopqrstuvwxyz".split('');
        const nomesCategorias = Array.from(categoriaBtns).map(btn => btn.getAttribute('data-categoria')?.toLowerCase()).filter(cat => cat);
        const fontesParaBuscar = [...new Set([...letras, ...nomesCategorias])];
        let palavrasEncontradas = [];

        for (const nomeFonte of fontesParaBuscar) {
            try {
                const response = await fetch(`../concordancia/${nomeFonte}.json`);
                if (response.ok) {
                    const dadosFonte = await response.json();
                    let listaDePalavrasNaFonte = dadosFonte[nomeFonte] || (Array.isArray(dadosFonte) ? dadosFonte : []);
                    if (!Array.isArray(listaDePalavrasNaFonte) && typeof dadosFonte === 'object') {
                        const chaves = Object.keys(dadosFonte);
                        if (chaves.length === 1 && Array.isArray(dadosFonte[chaves[0]])) listaDePalavrasNaFonte = dadosFonte[chaves[0]];
                    }
                    listaDePalavrasNaFonte.forEach(palavraJson => {
                        if (palavraJson.palavra.toLowerCase().includes(termo)) { // Ou .startsWith(termo) ou === termo
                            if (!palavrasEncontradas.some(p => p.palavra === palavraJson.palavra)) {
                                palavrasEncontradas.push({
                                    ...palavraJson,
                                    ocorrencias: typeof palavraJson.ocorrencias === 'number' ? palavraJson.ocorrencias : (palavraJson.concordancias ? palavraJson.concordancias.length : 0)
                                });
                            }
                        }
                    });
                }
            } catch (erro) { /* Silencia */ }
        }
        dadosCompletosDaFonteAtual = palavrasEncontradas;
        if (dadosCompletosDaFonteAtual.length === 0) {
            const cabecalhoExistente = resultadosContainer.querySelector('.palavra-header[style*="background-color: rgb(28, 28, 28)"]');
            resultadosContainer.innerHTML = '';
            if (cabecalhoExistente) resultadosContainer.appendChild(cabecalhoExistente);
            mostrarErro(`Nenhuma palavra encontrada para "${termoOriginal}".`);
        } else {
            processarEExibirResultados();
        }
    }


    function estadoInicial() {
        popularLivrosDropdown(); 
        let ativoEncontrado = false;
        letraBtns.forEach(btn => { if (btn.classList.contains('active')) { btn.click(); ativoEncontrado = true; } });
        if (ativoEncontrado) return;
        categoriaBtns.forEach(btn => { if (btn.classList.contains('active')) { btn.click(); ativoEncontrado = true; } });
        if (ativoEncontrado) return;
        if (!ativoEncontrado) {
            resultadosContainer.innerHTML = '<p style="color: #fff; text-align: center; font-size: 1.2em; margin-top: 30px; padding:20px;">Selecione uma letra ou categoria, ou faça uma busca.</p>';
        }
    }

    letraBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            letraBtns.forEach(b => b.classList.remove('active'));
            categoriaBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filtroPalavraInput.value = ""; testamentoSelect.value = "todos"; popularLivrosDropdown(); livroSelect.value = "todos";
            carregarPalavrasPorLetra(btn.getAttribute('data-letra'));
        });
    });
    categoriaBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoriaBtns.forEach(b => b.classList.remove('active'));
            letraBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filtroPalavraInput.value = ""; testamentoSelect.value = "todos"; popularLivrosDropdown(); livroSelect.value = "todos";
            carregarCategoria(btn.getAttribute('data-categoria'));
        });
    });

    searchBtnGlobal.addEventListener('click', realizarBuscaGlobalPeloInputPrincipal);
    searchInputGlobal.addEventListener('keypress', e => { if (e.key === 'Enter') realizarBuscaGlobalPeloInputPrincipal(); });
    
    let debounceFiltroPalavraTimeout;
    filtroPalavraInput.addEventListener('input', () => {
        clearTimeout(debounceFiltroPalavraTimeout);
        const termo = filtroPalavraInput.value.trim();
        if (termo.length >= 2 || termo.length === 0 ) { // Busca com 2+ chars ou quando limpa
            debounceFiltroPalavraTimeout = setTimeout(() => {
                buscarApenasPalavrasPrincipais(termo); // Esta é a função para o filtro de palavra local
            }, 500); 
        } else if (termo.length < 2 && dadosCompletosDaFonteAtual.length > 0 && termoDeBuscaAtivo === termo ) {
            // Se apagou para menos de 2 e havia uma busca ativa por palavra, limpa
            // Não faz nada aqui, espera o debounce limpar ou o usuário digitar mais
        }
    });

    testamentoSelect.addEventListener('change', () => { popularLivrosDropdown(); processarEExibirResultados(); });
    livroSelect.addEventListener('change', processarEExibirResultados);

    estadoInicial();
});