// Configuração inicial
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const resultadosContainer = document.getElementById('resultados-container');
    const categoriaBtns = document.querySelectorAll('.categoria-btn');
    const versaoSelect = document.getElementById('versao-select');
    const testamentoSelect = document.getElementById('testamento-select');
    const livroSelect = document.getElementById('livro-select');

    // Carregar a categoria inicial (Palavras Populares)
    carregarCategoria('populares');

    // Event listeners
    categoriaBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoriaBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            carregarCategoria(btn.getAttribute('data-categoria'));
        });
    });

    searchBtn.addEventListener('click', () => realizarBusca());
    searchInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') realizarBusca();
    });

    // Funções principais
    async function carregarCategoria(categoria) {
        try {
            const dados = await fetch(`../concordancia/${categoria}.json`);
            if (!dados.ok) throw new Error('Arquivo não encontrado');
            const conteudo = await dados.json();
            renderizarResultados(conteudo);
        } catch (erro) {
            console.error('Erro ao carregar categoria:', erro);
            mostrarErro('Não foi possível carregar os dados da categoria.');
        }
    }

/*    function renderizarResultados(dados) {
        resultadosContainer.innerHTML = '';
        
        // Verificar se é a seção de palavras populares
        if (dados.palavra === "Palavras mais buscadas") {
            renderizarPalavrasPopulares(dados);
            return;
        }

        // Renderização normal para palavras específicas
        const secao = criarSecaoPalavra(dados);
        dados.versiculos.forEach(livro => {
            const grupoLivro = criarGrupoLivro(livro, dados.palavra);
            secao.appendChild(grupoLivro);
        });
        resultadosContainer.appendChild(secao);
    }*/

    function renderizarPalavrasPopulares(dados) {
        const secaoPopulares = document.createElement('div');
        secaoPopulares.className = 'palavra-section';
        
        // Cabeçalho da seção
        const cabecalhoPopulares = document.createElement('div');
        cabecalhoPopulares.className = 'palavra-header';
        cabecalhoPopulares.innerHTML = `<span>${dados.palavra}</span>`;
        secaoPopulares.appendChild(cabecalhoPopulares);

        // Renderizar cada palavra popular
        dados.versiculos.forEach(palavraItem => {
            const secaoPalavra = document.createElement('div');
            secaoPalavra.className = 'palavra-section';
            
            // Cabeçalho da palavra
            const cabecalhoPalavra = document.createElement('div');
            cabecalhoPalavra.className = 'palavra-header';
            cabecalhoPalavra.innerHTML = `
                <span>${palavraItem.palavra}</span>
                <span class="contador">${palavraItem.ocorrencias} ocorrências</span>
            `;
            secaoPalavra.appendChild(cabecalhoPalavra);

            // Renderizar referências
            palavraItem.referencias.forEach(ref => {
                const grupoLivro = document.createElement('div');
                grupoLivro.className = 'livro-grupo';
                
                const cabecalhoLivro = document.createElement('div');
                cabecalhoLivro.className = 'livro-header';
                cabecalhoLivro.textContent = ref.livro;
                grupoLivro.appendChild(cabecalhoLivro);

                ref.versiculos.forEach(versiculo => {
                    const ocorrencia = document.createElement('div');
                    ocorrencia.className = 'ocorrencia';
                    ocorrencia.innerHTML = `
                        <div class="referencia">${versiculo.referencia}</div>
                        <div class="texto">${destacarPalavra(versiculo.texto, palavraItem.palavra)}</div>
                    `;
                    grupoLivro.appendChild(ocorrencia);
                });

                secaoPalavra.appendChild(grupoLivro);
            });

            secaoPopulares.appendChild(secaoPalavra);
        });

        resultadosContainer.appendChild(secaoPopulares);
    }

    function criarSecaoPalavra(dados) {
        const secao = document.createElement('div');
        secao.className = 'palavra-section';

        const cabecalho = document.createElement('div');
        cabecalho.className = 'palavra-header';
        cabecalho.innerHTML = `
            <span>${dados.palavra}</span>
            <span class="contador">${dados.ocorrencias} ocorrências</span>
        `;
        secao.appendChild(cabecalho);

        return secao;
    }

    function criarGrupoLivro(livro, palavraChave) {
        const grupo = document.createElement('div');
        grupo.className = 'livro-grupo';
        
        const cabecalho = document.createElement('div');
        cabecalho.className = 'livro-header';
        cabecalho.textContent = livro.livro;
        grupo.appendChild(cabecalho);

        livro.referencias.forEach(ref => {
            const ocorrencia = document.createElement('div');
            ocorrencia.className = 'ocorrencia';
            ocorrencia.innerHTML = `
                <div class="referencia">${ref.referencia}</div>
                <div class="texto">${destacarPalavra(ref.texto, palavraChave)}</div>
            `;
            grupo.appendChild(ocorrencia);
        });

        return grupo;
    }

    function realizarBusca() {
        const termo = searchInput.value.toLowerCase().trim();
        if (!termo) return;

        // Criar seção de resultados
        const secaoResultados = document.createElement('div');
        secaoResultados.className = 'palavra-section';
        
        const cabecalho = document.createElement('div');
        cabecalho.className = 'palavra-header';
        cabecalho.innerHTML = `<span>Resultados para: "${termo}"</span>`;
        secaoResultados.appendChild(cabecalho);

        // Limpar e adicionar nova seção
        resultadosContainer.innerHTML = '';
        resultadosContainer.appendChild(secaoResultados);

        // Buscar em todas as categorias
        buscarEmTodasCategorias(termo);
    }

    async function buscarEmTodasCategorias(termo) {
        const categorias = Array.from(categoriaBtns)
            .map(btn => btn.getAttribute('data-categoria'))
            .filter(cat => cat); // Remove valores nulos/undefined

        for (const categoria of categorias) {
            try {
                const dados = await fetch(`../concordancia/${categoria}.json`);
                if (dados.ok) {
                    const conteudo = await dados.json();
                    
                    // Se for palavras populares, buscar em cada palavra
                    if (conteudo.palavra === "Palavras mais buscadas") {
                        conteudo.versiculos.forEach(palavraItem => {
                            filtrarEExibirResultadosPalavra(palavraItem, termo);
                        });
                    } else {
                        filtrarEExibirResultadosPalavra(conteudo, termo);
                    }
                }
            } catch (erro) {
                console.error(`Erro ao buscar em ${categoria}:`, erro);
            }
        }
    }

    function filtrarEExibirResultadosPalavra(dados, termo) {
        let versiculosEncontrados = [];

        // Para palavras populares, procurar nas referências
        if (dados.referencias) {
            dados.referencias.forEach(ref => {
                ref.versiculos.forEach(versiculo => {
                    if (versiculo.texto.toLowerCase().includes(termo.toLowerCase())) {
                        versiculosEncontrados.push({
                            livro: ref.livro,
                            versiculo: versiculo,
                            palavra: dados.palavra
                        });
                    }
                });
            });
        }
        // Para palavras normais, procurar nos versículos
        else if (dados.versiculos) {
            dados.versiculos.forEach(livro => {
                livro.referencias.forEach(ref => {
                    if (ref.texto.toLowerCase().includes(termo.toLowerCase())) {
                        versiculosEncontrados.push({
                            livro: livro.livro,
                            versiculo: ref,
                            palavra: dados.palavra
                        });
                    }
                });
            });
        }

        if (versiculosEncontrados.length > 0) {
            exibirResultadosBusca(versiculosEncontrados, termo);
        }
    }

    function exibirResultadosBusca(resultados, termo) {
        // Agrupar resultados por livro
        const livrosAgrupados = resultados.reduce((grupos, item) => {
            if (!grupos[item.livro]) {
                grupos[item.livro] = [];
            }
            grupos[item.livro].push(item);
            return grupos;
        }, {});

        // Criar elementos para cada livro
        Object.entries(livrosAgrupados).forEach(([livro, itens]) => {
            const grupoLivro = document.createElement('div');
            grupoLivro.className = 'livro-grupo';
            
            const cabecalhoLivro = document.createElement('div');
            cabecalhoLivro.className = 'livro-header';
            cabecalhoLivro.textContent = livro;
            grupoLivro.appendChild(cabecalhoLivro);

            itens.forEach(item => {
                const ocorrencia = document.createElement('div');
                ocorrencia.className = 'ocorrencia';
                const versiculo = item.versiculo;
                ocorrencia.innerHTML = `
                    <div class="referencia">${versiculo.referencia}</div>
                    <div class="texto">${destacarPalavra(versiculo.texto, termo)}</div>
                `;
                grupoLivro.appendChild(ocorrencia);
            });

            resultadosContainer.appendChild(grupoLivro);
        });
    }

    function destacarPalavra(texto, palavra) {
        const regex = new RegExp(`(${palavra})`, 'gi');
        return texto.replace(regex, '<span class="highlight">$1</span>');
    }

    function mostrarErro(mensagem) {
        resultadosContainer.innerHTML = `
            <div class="erro-mensagem">
                <p style="color: #fff; text-align: center;">${mensagem}</p>
            </div>
        `;
    }

    // Event listeners para filtros
    [versaoSelect, testamentoSelect, livroSelect].forEach(select => {
        select.addEventListener('change', () => {
            const filtros = {
                versao: versaoSelect.value,
                testamento: testamentoSelect.value,
                livro: livroSelect.value
            };
            aplicarFiltros(filtros);
        });
    });

    function aplicarFiltros(filtros) {
        // Por enquanto, apenas mostra os filtros selecionados
        console.log('Filtros aplicados:', filtros);
        // Aqui você implementaria a lógica real de filtragem
    }
});