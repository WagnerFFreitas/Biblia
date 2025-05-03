

falta rodape

// O bloco abaixo cria a janela de SLIDE para o data-show
function abrirJanelaSlide(livroAtual, capituloAtual, versiculoAtual) {

    // O trecho abaixo verifica se a janela já está aberta e não está fechada
    if (window.janelaSlide && !window.janelaSlide.closed) {
        window.janelaSlide.focus();
        return;
    }

    // O trecho abaixo obtém a largura e altura da tela do usuário
    const largura = window.screen.availWidth;
    const altura = window.screen.availHeight;

    // O trecho abaixo abre uma nova janela com as dimensões especificadas
    window.janelaSlide = window.open('', 'JanelaSlide', `width=${largura},height=${altura}`);

    // Abre o documento da nova janela para escrita
    window.janelaSlide.document.open();

    // Escreve todo o conteúdo HTML, CSS e JS na nova janela
    window.janelaSlide.document.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <title>Janela Slide</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                /* O bloco abaixo cria o estilo do corpo da pagina do SLIDE */
                body {
                    font-family: sans-serif;
                    /* padding: 1.25rem; */ /* Removido para permitir título de largura total */
                    background-color: #181818;
                    color: white;
                    position: relative;
                    margin: 0; /* Remove margens padrão */
                    overflow: hidden; /* Impede barras de rolagem */
                    display: flex;
                    flex-direction: column;
                    /* justify-content: center; */ /* Removido para o título ficar no topo */
                    align-items: center; /* Centraliza horizontalmente */
                    min-height: 100vh; /* Garante altura mínima total */
                    font-style: italic;
                    font-weight: bold;
                    box-sizing: border-box; /* Inclui padding no tamanho total */
                }

                /* O bloco abaixo cria o estilo para os botões genéricos (se houver) */
                button {
                    padding: 0.63rem 1.25rem; /* 10px 20px */
                    font-size: clamp(1rem, 2vw + 0.5rem, 1.5rem); /* Tamanho de fonte responsivo */
                    background-color: white;
                    color: black;
                    border: none;
                    cursor: pointer;
                    position: relative;
                    transition: background-color 0.3s ease, color 0.3s ease; /* Transição suave */
                }

                /* O bloco abaixo configura o efeito ao passar o mouse, mudando a cor dos botões */
                button:hover {
                    background-color: black;
                    color: white;
                }

                /* O bloco abaixo cria o estilos para o container do versículo */
                #versiculo-container {
                    display: flex;
                    justify-content: center;
                    align-items: center; /* Centraliza texto verticalmente se houver múltiplas linhas */
                    margin-top: 1.5rem; /* Adiciona espaço ABAIXO do título */
                    margin-bottom: 1.25rem; /* 20px - Espaço acima dos botões */
                    font-size: clamp(4rem, 8vw, 6rem); /* Tamanho de fonte responsivo */
                    width: 90%; /* Limita a largura para melhor leitura */
                    text-align: center; /* Centraliza o texto do versículo */
                    flex-grow: 1; /* Permite que o container cresça para preencher espaço */
                    overflow-y: auto; /* Adiciona scroll se o texto for muito grande */
                    padding: 0 1rem; /* Adiciona padding lateral interno */
                    box-sizing: border-box;
                }

                 /* O bloco abaixo configura o titulo (Estilo Imagem 1) */
                 #titulo {
                     background-color: black;     /* Barra de fundo preta */
                     color: #f1c40f;             /* Cor amarela/dourada */
                     width: 100%;                /* Ocupa toda a largura */
                     text-align: center;         /* Texto centralizado */
                     padding: 0.75rem 0;         /* Espaçamento vertical interno */
                     font-size: clamp(1.8rem, 3.5vw, 2.8rem); /* Tamanho da fonte */
                     font-weight: bold;          /* Negrito */
                     font-style: normal;         /* Garante que NÃO seja itálico */
                     font-family: Arial, sans-serif; /* Fonte comum não serifada */
                     text-transform: uppercase;  /* Garante caixa alta */
                     margin: 0;                  /* Remove margens externas */
                     box-sizing: border-box;     /* Padding não aumenta largura total */
                     flex-shrink: 0;             /* Impede que o título encolha */
                 }


                /* O bloco abaixo configura o estilo dos textos dos versiculos */
                .versiculo-texto {
                    text-align: center; /* Centralizado geralmente funciona melhor para slides */
                    font-size: clamp(2.5rem, 5vw, 6rem); /* Tamanho de fonte responsivo para o texto */
                    max-width: 100%; /* Garante que não ultrapasse o container */
                    overflow-wrap: break-word; /* Quebra palavras longas */
                    line-height: 1.4; /* Melhora a legibilidade */
                    font-weight: normal; /* Ajuste se quiser versículo bold ou normal */
                    font-style: normal; /* Ajuste se quiser versículo itálico ou normal */
                }

                /* O bloco abaixo configura o estilo do titulo dos versiculos (se houver <strong>) */
                #versiculo-container strong {
                    color: #5df565; /* Verde claro */
                    font-size: clamp(2rem, 3.5vw, 4.5rem); /* Tamanho de fonte responsivo */
                    margin-top: 0.63rem; /* 10px */
                    display: block; /* Garante que fique em linha separada */
                    font-weight: bold; /* Garante que strong seja bold */
                }

                /* O bloco abaixo coloca a imagem de fundo em marca d'água */
                #watermark {
                    position: fixed; /* Fixo na tela */
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: url('../img/biblia.png'); /* Ajuste o caminho se necessário */
                    opacity: 0.15; /* Mais sutil */
                    z-index: -1; /* Coloca atrás de todo o conteúdo */
                    pointer-events: none; /* Não interfere com cliques */
                    overflow: hidden;
                    background-size: contain; /* Garante que a imagem caiba sem cortar */
                    background-repeat: no-repeat;
                    background-position: center;
                }

                /* O bloco abaixo configura o estilos para o container dos botões */
                #botao-container {
                    /* position: absolute; */ /* Removido para fluxo normal abaixo do versículo */
                    /* bottom: 2rem; */
                    /* left: 50%; */
                    /* transform: translateX(-50%); */
                    width: 100%; /* Ocupa a largura */
                    display: flex;
                    justify-content: center; /* Centraliza os botões */
                    gap: 5rem; /* Espaço maior entre os botões */
                    z-index: 1; /* Garante que fiquem sobre a marca d'água */
                    padding: 1rem 0 2rem 0; /* Espaçamento acima e abaixo dos botões */
                    box-sizing: border-box;
                    flex-shrink: 0; /* Impede que o container encolha */
                }

                /* O bloco abaixo configura o estilos para os botões "voltar" e "próximo" */
                #voltar-botao,
                #proximo-botao {
                    background-color: white;
                    border: none;
                    padding: 0.75rem 2rem; /* Mais preenchimento */
                    font-size: clamp(1rem, 1.5vw, 1.5rem); /* Tamanho responsivo */
                    font-weight: 900;
                    font-style: italic;
                    position: relative; /* Necessário para os ::before/::after */
                    display: inline-block;
                    text-align: center;
                    transition: background-color 0.3s ease, color 0.3s ease;
                    width: 180px; /* Largura fixa para melhor alinhamento */
                    box-sizing: border-box; /* Padding incluído na largura */
                    color: black; /* Cor inicial do texto */
                    flex-shrink: 0; /* Impede que os botões encolham */
                }

                /* O bloco abaixo configura o efeito ao passar o mouse, mudando a cor dos botões "voltar" e "próximo" */
                #voltar-botao:hover,
                #proximo-botao:hover {
                    background-color: black;
                    color: white;
                }

                /* O bloco abaixo cria e configura as pontas da setas */
                #voltar-botao::before,
                #proximo-botao::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 0;
                    height: 0;
                    border-style: solid;
                    border-width: 28px; /* Tamanho da seta (ajuste conforme necessário) */
                    transition: border-color 0.3s ease;
                }

                /* O bloco abaixo configura o estilos para a seta do botão "voltar" */
                #voltar-botao::before {
                    left: -56px; /* Distância da seta (igual a border-width * 2) */
                    border-color: transparent white transparent transparent; /* Seta aponta para a esquerda */
                }

                /* O bloco abaixo configura o estilos para a seta do botão "próximo" */
                #proximo-botao::after {
                    right: -56px; /* Distância da seta (igual a border-width * 2) */
                    border-color: transparent transparent transparent white; /* Seta aponta para a direita */
                }

                /* O bloco abaixo configura o efeito ao passar o mouse, mudando a cor da seta "voltar" */
                #voltar-botao:hover::before {
                    border-color: transparent black transparent transparent;
                }

                /* O bloco abaixo configura o efeito ao passar o mouse, mudando a cor da seta "próximo" */
                #proximo-botao:hover::after {
                    border-color: transparent transparent transparent black;
                }
            </style>
        </head>
        <body>
            <!-- Div para a marca d'água -->
            <div id="watermark"></div>

            <!-- Título exibindo Livro, Capítulo e Versículo -->
            <!-- FORMATO DO TÍTULO ALTERADO AQUI -->
            <div id="titulo">${livroAtual.toUpperCase()} ${capituloAtual}:${versiculoAtual}</div>

            <!-- Container onde o texto do versículo será carregado -->
            <div id="versiculo-container">
                <div class="versiculo-texto">Carregando...</div>
            </div>

            <!-- Container para os botões de navegação -->
            <div id="botao-container">
                <button id="voltar-botao">VOLTAR</button>
                <button id="proximo-botao">PRÓXIMO</button>
            </div>

            <!-- Script para carregar e navegar pelos versículos -->
            <script>
                // Variáveis globais para o estado atual
                let capituloAtual = ${capituloAtual};
                let versiculoAtual = ${versiculoAtual};
                const livroAtual = '${livroAtual}'; // Ex: 'genesis' (esperado em minúsculas)
                const versaoBiblia = 'arc'; // Defina a versão desejada ('arc', 'ara', etc.)

                // Variável para armazenar o conteúdo HTML do capítulo carregado
                let capituloConteudo = '';

                // IMPORTANTE: Objeto/Array para armazenar a contagem de versículos por capítulo.
                // Substitua isso pela sua fonte de dados real!
                const contagemVersiculos = {
                    arc: { // Versão ARC
                        genesis: [31, 25, 24, 26, 32, 22, 24, 22, 29, 32, 32, 20, 18, 24, 21, 16, 27, 33, 38, 18, 34, 24, 20, 67, 34, 35, 46, 22, 35, 43, 55, 32, 20, 31, 29, 43, 36, 30, 23, 23, 57, 38, 34, 34, 28, 34, 31, 22, 33, 26],
                        exodo: [22, 25, 22, 31, 23, 30, 25, 32, 35, 29, 10, 51, 22, 31, 27, 36, 16, 27, 25, 26, 36, 31, 33, 18, 40, 37, 21, 43, 46, 38, 18, 35, 23, 35, 35, 38, 29, 31, 43, 38],
                        // Adicione outros livros da versão ARC aqui...
                    },
                    ara: { // Versão ARA (exemplo com JSON, ajuste se necessário)
                        // Se ARA usa JSON, a lógica de carregamento/parse seria diferente
                        // genesis: [31, 25, ...], // Exemplo se ARA também usar array
                        // Adicione outros livros da versão ARA aqui...
                    }
                    // Adicione outras versões aqui...
                };

                // Obtém o array de contagem para o livro e versão atuais
                let versiculosPorCapitulo = (contagemVersiculos[versaoBiblia] && contagemVersiculos[versaoBiblia][livroAtual]) ? contagemVersiculos[versaoBiblia][livroAtual] : [];

                // Função para carregar o conteúdo HTML de um capítulo específico
                function carregarCapitulo(capitulo) {
                    // Usa caminho absoluto a partir da raiz do servidor
                    const caminhoArquivo = \`/version/\${versaoBiblia}/\${livroAtual}/\${capitulo}.html\`;

                    // Log para depuração: mostra qual arquivo está tentando carregar
                    console.log(\`[LOG] Tentando carregar capítulo via fetch (Absoluto): \${caminhoArquivo}\`); // Log 1

                    // Usa a API Fetch para buscar o arquivo
                    fetch(caminhoArquivo)
                        .then(response => {
                            // Verifica se a requisição foi bem-sucedida (status 200-299)
                            console.log(\`[LOG] Fetch status para \${caminhoArquivo}: \${response.status}\`); // Log 2
                            if (!response.ok) {
                                // Se não encontrou (404) ou outro erro, lança um erro
                                throw new Error(\`Erro HTTP: \${response.status} ao buscar \${caminhoArquivo}\`);
                            }
                            // Se ok, retorna o conteúdo do arquivo como texto
                            return response.text();
                        })
                        .then(text => {
                            // Armazena o conteúdo do capítulo na variável global
                             console.log(\`[LOG] Capítulo \${capitulo} carregado. Tamanho: \${text.length} caracteres.\`); // Log 3
                            capituloConteudo = text;
                            // Chama a função para carregar o versículo desejado
                            carregarVersiculo(versiculoAtual);
                        })
                        .catch(error => {
                             // Se ocorrer qualquer erro no fetch ou processamento
                             console.error('[LOG] Erro no fetch ou .then:', error); // Log 4 (Erro)
                             // Exibe uma mensagem de erro clara para o usuário
                             const container = document.getElementById('versiculo-container');
                             container.innerHTML = \`<div class="versiculo-texto" style="color: red; font-size: 1.5rem;">Erro ao carregar capítulo. Verifique o Console (F12).</div>\`;
                             document.getElementById('titulo').innerText = "ERRO AO CARREGAR CAPÍTULO"; // Atualiza título para erro
                        });
                }

                // Função para extrair e exibir um versículo específico do conteúdo do capítulo carregado
                function carregarVersiculo(versiculo) {
                    console.log(\`[LOG] Iniciando carregarVersiculo para versículo: \${versiculo}\`); // Log 5
                    // Verifica se temos conteúdo do capítulo carregado
                    if (!capituloConteudo) {
                         console.warn("[LOG] Conteúdo do capítulo vazio ao tentar carregar versículo."); // Log 6 (Aviso)
                         document.getElementById('versiculo-container').innerHTML = '<div class="versiculo-texto" style="color: orange;">Aguardando carregamento do capítulo...</div>';
                         return; // Sai da função se não houver conteúdo
                    }

                    try { // Adiciona try...catch para erros de parse
                        // Cria um parser DOM para analisar o HTML do capítulo
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(capituloConteudo, 'text/html');
                        console.log(\`[LOG] HTML do capítulo parseado. Buscando #versiculo-\${versiculo}\`); // Log 7

                        // Tenta encontrar o elemento do versículo pelo ID (ex: id="versiculo-1")
                        const versiculoElemento = doc.querySelector('#versiculo-' + versiculo);
                        console.log(\`[LOG] Elemento encontrado para #versiculo-\${versiculo}:\`, versiculoElemento); // Log 8

                        const versiculoContainer = document.getElementById('versiculo-container');
                        const tituloElement = document.getElementById('titulo');

                        // Verifica se o elemento do versículo foi encontrado
                        if (versiculoElemento) {
                             console.log(\`[LOG] Versículo \${versiculo} encontrado. Conteúdo:\`, versiculoElemento.innerHTML.substring(0,100) + '...'); // Log 9
                            // Atualiza o container com o HTML interno do versículo
                            versiculoContainer.innerHTML = \`<div class="versiculo-texto">\${versiculoElemento.innerHTML}</div>\`;
                            // Atualiza o título da janela - FORMATO ALTERADO AQUI
                            tituloElement.innerText = \`\${livroAtual.toUpperCase()} \${capituloAtual}:\${versiculo}\`;
                        } else {
                            // Se o versículo específico não for encontrado no HTML carregado
                            console.warn(\`[LOG] Versículo \${versiculo} NÃO encontrado no HTML parseado!\`); // Log 10 (Aviso)
                            versiculoContainer.innerHTML = \`<div class="versiculo-texto" style="color: orange;">Versículo \${versiculo} não encontrado neste capítulo.</div>\`;
                            // Mantém o título indicando o versículo que foi tentado carregar - FORMATO ALTERADO AQUI
                            tituloElement.innerText = \`\${livroAtual.toUpperCase()} \${capituloAtual}:\${versiculo} (Não encontrado)\`;
                        }
                    } catch (parseError) {
                        console.error('[LOG] Erro ao parsear o HTML do capítulo:', parseError); // Log 11 (Erro)
                        const versiculoContainer = document.getElementById('versiculo-container');
                        versiculoContainer.innerHTML = \`<div class="versiculo-texto" style="color: red; font-size: 1.5rem;">Erro ao processar o HTML do capítulo. Verifique o console (F12).</div>\`;
                         document.getElementById('titulo').innerText = "ERRO AO PROCESSAR CAPÍTULO"; // Atualiza título para erro
                    }
                }

                // Função para avançar para o próximo versículo ou capítulo
                function proximoVersiculo() {
                    // Verifica se a configuração de versículos existe para este livro/versão
                    if (!versiculosPorCapitulo || versiculosPorCapitulo.length === 0) {
                        console.error("Configuração de versículos por capítulo ausente ou inválida.");
                        alert("Erro: Não foi possível determinar o número de versículos para este livro. A navegação está desativada.");
                        return;
                    }
                     // Verifica se o capítulo atual é válido dentro da configuração
                    if(capituloAtual < 1 || capituloAtual > versiculosPorCapitulo.length) {
                         console.error(\`Capítulo atual (\${capituloAtual}) fora dos limites da configuração [1-\${versiculosPorCapitulo.length}].\`);
                         alert("Erro: Estado inválido do capítulo. Recarregando.");
                         capituloAtual = 1; versiculoAtual = 1; carregarCapitulo(capituloAtual); return;
                    }

                    // Incrementa o número do versículo
                    versiculoAtual++;

                    // Verifica se ultrapassou o último versículo do capítulo atual
                    if (versiculoAtual > versiculosPorCapitulo[capituloAtual - 1]) {
                        // Se sim, avança para o próximo capítulo
                        capituloAtual++;
                        // Verifica se ainda existe um próximo capítulo neste livro
                        if (capituloAtual <= versiculosPorCapitulo.length) {
                            // Se existe, reseta para o versículo 1 do novo capítulo
                            versiculoAtual = 1;
                            // Coloca "Carregando..." temporariamente enquanto busca o novo capítulo
                            document.getElementById('versiculo-container').innerHTML = '<div class="versiculo-texto">Carregando capítulo...</div>';
                            // Atualiza o título - FORMATO ALTERADO AQUI
                            document.getElementById('titulo').innerText = \`\${livroAtual.toUpperCase()} \${capituloAtual}:\${versiculoAtual}\`;
                            // Carrega o conteúdo do novo capítulo
                            carregarCapitulo(capituloAtual);
                        } else {
                            // Se não há mais capítulos, chegou ao fim do livro
                            capituloAtual--; // Volta para o último capítulo válido
                            versiculoAtual = versiculosPorCapitulo[capituloAtual - 1]; // Volta para o último versículo
                            alert('Fim do livro.'); // Informa o usuário
                            document.getElementById('proximo-botao').disabled = true;
                            document.getElementById('voltar-botao').disabled = false;
                        }
                    } else {
                        // Se ainda está dentro do mesmo capítulo, apenas carrega o próximo versículo
                        carregarVersiculo(versiculoAtual);
                        document.getElementById('proximo-botao').disabled = false;
                        document.getElementById('voltar-botao').disabled = false;
                    }
                }

                // Função para retroceder para o versículo ou capítulo anterior
                function voltarVersiculo() {
                     // Verifica se a configuração de versículos existe para este livro/versão
                    if (!versiculosPorCapitulo || versiculosPorCapitulo.length === 0) {
                        console.error("Configuração de versículos por capítulo ausente ou inválida.");
                        alert("Erro: Não foi possível determinar o número de versículos para este livro. A navegação está desativada.");
                        return;
                    }
                     // Verifica se o capítulo atual é válido dentro da configuração
                    if(capituloAtual < 1 || capituloAtual > versiculosPorCapitulo.length) {
                         console.error(\`Capítulo atual (\${capituloAtual}) fora dos limites da configuração [1-\${versiculosPorCapitulo.length}].\`);
                         alert("Erro: Estado inválido do capítulo. Recarregando.");
                         capituloAtual = 1; versiculoAtual = 1; carregarCapitulo(capituloAtual); return;
                    }

                    // Decrementa o número do versículo
                    versiculoAtual--;

                    // Verifica se ficou menor que 1 (ou seja, precisa ir para o capítulo anterior)
                    if (versiculoAtual < 1) {
                        // Se sim, retrocede para o capítulo anterior
                        capituloAtual--;
                        // Verifica se ainda está dentro dos limites do livro (capítulo >= 1)
                        if (capituloAtual >= 1) {
                            // Se sim, define o versículo para o último do capítulo anterior
                            versiculoAtual = versiculosPorCapitulo[capituloAtual - 1];
                            // Coloca "Carregando..." temporariamente
                            document.getElementById('versiculo-container').innerHTML = '<div class="versiculo-texto">Carregando capítulo...</div>';
                             // Atualiza o título - FORMATO ALTERADO AQUI
                            document.getElementById('titulo').innerText = \`\${livroAtual.toUpperCase()} \${capituloAtual}:\${versiculoAtual}\`;
                            // Carrega o conteúdo do capítulo anterior
                            carregarCapitulo(capituloAtual);
                        } else {
                            // Se não, chegou ao início do livro (capítulo 0 ou menor)
                            capituloAtual = 1; // Volta para o primeiro capítulo
                            versiculoAtual = 1; // Volta para o primeiro versículo
                            alert('Início do livro.'); // Informa o usuário
                            document.getElementById('voltar-botao').disabled = true;
                            document.getElementById('proximo-botao').disabled = false;
                            // Recarrega o primeiro versículo (o capítulo 1 já deve estar carregado ou será carregado)
                            carregarVersiculo(versiculoAtual);
                        }
                    } else {
                        // Se ainda está no mesmo capítulo, apenas carrega o versículo anterior
                        carregarVersiculo(versiculoAtual);
                        document.getElementById('proximo-botao').disabled = false;
                        document.getElementById('voltar-botao').disabled = false;
                    }
                }

                // Adiciona os ouvintes de evento aos botões
                document.getElementById('proximo-botao').addEventListener('click', proximoVersiculo);
                document.getElementById('voltar-botao').addEventListener('click', voltarVersiculo);

                // --- INICIALIZAÇÃO ---
                console.log('[LOG] Iniciando script da janela slide.'); // Log de início
                // Verifica se a configuração de versículos foi carregada corretamente
                if (versiculosPorCapitulo.length > 0) {
                     console.log(\`[LOG] Configuração encontrada para \${livroAtual}. Carregando capítulo \${capituloAtual}...\`);
                    // Se sim, carrega o capítulo inicial passado como parâmetro
                    carregarCapitulo(capituloAtual);
                    // Verifica se está no primeiro versículo do primeiro capítulo para desabilitar 'voltar'
                    if (capituloAtual === 1 && versiculoAtual === 1) {
                        document.getElementById('voltar-botao').disabled = true;
                    }
                } else {
                    // Se a configuração não foi encontrada para o livro/versão
                    console.error(\`[LOG] Configuração de contagem de versículos não encontrada para \${versaoBiblia.toUpperCase()} - \${livroAtual.toUpperCase()}\`);
                    const container = document.getElementById('versiculo-container');
                    container.innerHTML = '<div class="versiculo-texto" style="color: red; font-size: 1.5rem;">Erro Crítico: Configuração de capítulos/versículos ausente para este livro. Incapaz de carregar conteúdo.</div>';
                    document.getElementById('titulo').innerText = "ERRO DE CONFIGURAÇÃO"; // Atualiza título para erro
                    // Desabilita botões pois não há como navegar
                    document.getElementById('voltar-botao').disabled = true;
                    document.getElementById('proximo-botao').disabled = true;
                }

            </script>
        </body>
        </html>
    `);

    // Fecha o documento da nova janela, fazendo o navegador renderizar o conteúdo
    window.janelaSlide.document.close();
}


*************************


function abrirJanelaSlide(livroAtual, capituloAtual, versiculoAtual) {
    // Corrige a capitalização do livro para bater com o objeto BIBLIA
    const livroCorrigido = capitalizeLivro(livroAtual);

    if (window.janelaSlide && !window.janelaSlide.closed) {
        window.janelaSlide.focus();
        return;
    }

    const largura = window.screen.availWidth;
    const altura = window.screen.availHeight;
    const features = `width=${largura},height=${altura},menubar=no,toolbar=no,location=no,resizable=yes,scrollbars=yes`;

    window.janelaSlide = window.open('', 'JanelaSlide', features);

    if (!window.janelaSlide) {
        alert("A abertura da janela de slide foi bloqueada pelo navegador. Por favor, permita pop-ups para este site.");
        return;
    }

    // Objeto BIBLIA dentro do HTML da janela!
    const BIBLIA = {
        Genesis: [31, 25, 24, 26, 32, 22, 24, 22, 29, 32, 32, 20, 18, 24, 21, 16, 27, 33, 38, 18, 34, 24, 20, 67, 34, 35, 46, 22, 35, 43, 55, 32, 20, 31, 29, 43, 36, 30, 23, 23, 57, 38, 34, 34, 28, 34, 31, 22, 33, 26],
        Exodus: [22, 25, 22, 31, 23, 30, 25, 32, 35, 29, 10, 51, 22, 31, 27, 36, 16, 27, 25, 26, 36, 31, 33, 18, 40, 37, 21, 43, 46, 38, 18, 35, 23, 35, 35, 38, 29, 31, 43, 38]
        // ...adicione mais livros
    };
    const LIVROS = Object.keys(BIBLIA);

    const slideHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Slide Bíblico - ${livroCorrigido} ${capituloAtual}:${versiculoAtual}</title>
<style>
    body { font-family: Arial Black, Arial, sans-serif; background: #121212; color: #fff; margin:0; padding:0; display:flex; flex-direction:column; min-height:100vh; }
    #header { padding: 15px 0; font-size: 2.5vmax; color: #f1c40f; text-transform: uppercase; background: rgba(0,0,0,0.7); width:100%; font-weight: bold;  text-align: center; /* Adicione esta linha para centralizar o texto */}
    #content { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; width:100%; overflow-y:auto; }
    .verse-content { display:none; width:100%; max-width:90%; margin:auto; text-align:center; }
    .verse-content.active { display:block; }
    .verse-title { font-size:2.0vmax; color:#f1c40f;margin-top: -10px; /* Ajuste para mover para cima ou para baixo */ margin-bottom:30px; font-weight:bold; text-transform:uppercase; letter-spacing:1px; }
    .verse-title:empty { display:none; margin-bottom:0; }
    .verse-text { font-size:2.8vmax; line-height:1.6; font-style:italic; margin-top:auto; margin-bottom:auto; padding-bottom:30px; }
    #navigation { padding:15px 0; background:rgba(0,0,0,0.7); width:100%; display:flex; justify-content:center; gap:20px; }
    .nav-button { padding:12px 25px; font-size:1.2rem; background:#f1c40f; color:#000; border:none; border-radius:5px; cursor:pointer; font-weight:bold; margin:0 10px; }
    .nav-button:disabled { background:#555; color:#999; cursor:not-allowed; opacity:0.7; }
    .nav-button:hover:not(:disabled) { background:#d4ac0d; }
</style>
</head>
<body>
<div id="header">${livroCorrigido.toUpperCase()} ${capituloAtual}:${versiculoAtual}</div>
<div id="content"><div style="padding:20px;">Carregando...</div></div>
<div id="navigation">
    <button class="nav-button" id="prev-btn">‹ Anterior</button>
    <button class="nav-button" id="next-btn">Próximo ›</button>
</div>
<script>
const BIBLIA = ${JSON.stringify(BIBLIA)};
const LIVROS = ${JSON.stringify(LIVROS)};
const config = {
    livro: '${livroCorrigido}',
    capitulo: ${capituloAtual},
    versiculo: ${versiculoAtual},
    versiculosNodes: [],
    totalVersiculos: 0
};
const elements = {
    header: document.getElementById('header'),
    content: document.getElementById('content'),
    prevBtn: document.getElementById('prev-btn'),
    nextBtn: document.getElementById('next-btn')
};

async function loadChapter() {
    setLoadingState(true);
    try {
        const response = await fetch(\`../version/arc/\${config.livro}/\${config.capitulo}.html\`);
        if (!response.ok) throw new Error(\`Capítulo \${config.capitulo} do livro '\${config.livro}' não encontrado (status: \${response.status})\`);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        config.versiculosNodes = Array.from(doc.querySelectorAll('[id^="versiculo-"]'));
        config.totalVersiculos = config.versiculosNodes.length;
        if (config.totalVersiculos === 0) {
            elements.content.innerHTML = '<div class="verse-content active" style="margin-top:auto;margin-bottom:auto;">Capítulo vazio ou não encontrado.</div>';
            config.versiculo = 1;
        } else {
            if (config.versiculo < 1) config.versiculo = 1;
            if (config.versiculo > config.totalVersiculos) config.versiculo = config.totalVersiculos;
            renderVerses();
            showCurrentVerse();
        }
    } catch (error) {
        elements.content.innerHTML = \`
            <div class="verse-content active" style="color: #e74c3c; margin-top:auto; margin-bottom:auto; font-size:1.5rem;">
                <strong>Erro ao carregar:</strong><br>
                \${error.message}<br><br>
                Tentando carregar: Livro: \${config.livro}, Capítulo: \${config.capitulo}
            </div>
        \`;
        elements.prevBtn.disabled = true;
        elements.nextBtn.disabled = true;
    } finally {
        setLoadingState(false);
        updateNavigationButtons();
        updateHeader();
    }
}

function setLoadingState(isLoading) {
    if (isLoading) {
        elements.content.innerHTML = '<div class="verse-content active" style="margin-top:auto;margin-bottom:auto;">Carregando...</div>';
        elements.prevBtn.disabled = true;
        elements.nextBtn.disabled = true;
    }
}

function renderVerses() {
    elements.content.innerHTML = '';
    config.versiculosNodes.forEach((verseNode, index) => {
        const verseNumber = index + 1;
        const verseIdClass = \`verse-num-\${verseNumber}\`;
        const strongElement = verseNode.querySelector('strong');
        let titleHTML = '';
        let textHTML = '';
        const tempDiv = verseNode.cloneNode(true);
        if (strongElement) {
            titleHTML = strongElement.outerHTML;
            const strongInTemp = tempDiv.querySelector('strong');
            if (strongInTemp) strongInTemp.parentNode.removeChild(strongInTemp);
        }
        textHTML = tempDiv.innerHTML.trim();
        const titleElement = document.createElement('div');
        titleElement.className = \`verse-title verse-content \${verseIdClass}\`;
        titleElement.innerHTML = titleHTML;
        elements.content.appendChild(titleElement);
        const textElement = document.createElement('div');
        textElement.className = \`verse-text verse-content \${verseIdClass}\`;
        textElement.innerHTML = textHTML;
        elements.content.appendChild(textElement);
    });
}

function showCurrentVerse() {
    const currentVerseClass = \`verse-num-\${config.versiculo}\`;
    document.querySelectorAll('.verse-content').forEach(v => v.classList.remove('active'));
    const currentElements = document.querySelectorAll('.' + currentVerseClass);
    if (currentElements.length > 0) {
        currentElements.forEach(el => el.classList.add('active'));
    }
    updateHeader();
    updateNavigationButtons();
}

function avancar() {
    const livroIndex = LIVROS.indexOf(config.livro);
    const capitulosLivro = BIBLIA[config.livro];
    if (!capitulosLivro) return;
    const totalCapitulos = capitulosLivro.length;
    const totalVersiculosCapitulo = capitulosLivro[config.capitulo - 1];
    if (config.versiculo < totalVersiculosCapitulo) {
        config.versiculo++;
        showCurrentVerse();
    } else if (config.capitulo < totalCapitulos) {
        config.capitulo++;
        config.versiculo = 1;
        loadChapter();
    } else if (livroIndex < LIVROS.length - 1) {
        config.livro = LIVROS[livroIndex + 1];
        config.capitulo = 1;
        config.versiculo = 1;
        loadChapter();
    }
}

function voltar() {
    const livroIndex = LIVROS.indexOf(config.livro);
    const capitulosLivro = BIBLIA[config.livro];
    if (!capitulosLivro) return;
    if (config.versiculo > 1) {
        config.versiculo--;
        showCurrentVerse();
    } else if (config.capitulo > 1) {
        config.capitulo--;
        config.versiculo = BIBLIA[config.livro][config.capitulo - 1];
        loadChapter();
    } else if (livroIndex > 0) {
        config.livro = LIVROS[livroIndex - 1];
        config.capitulo = BIBLIA[config.livro].length;
        config.versiculo = BIBLIA[config.livro][config.capitulo - 1];
        loadChapter();
    }
}

function updateNavigationButtons() {
    const livroIndex = LIVROS.indexOf(config.livro);
    const capitulosLivro = BIBLIA[config.livro];
    if (!capitulosLivro) {
        elements.prevBtn.disabled = true;
        elements.nextBtn.disabled = true;
        return;
    }
    const totalCapitulos = capitulosLivro.length;
    const totalVersiculosCapitulo = capitulosLivro[config.capitulo - 1];
    elements.prevBtn.disabled = (livroIndex === 0 && config.capitulo === 1 && config.versiculo === 1);
    elements.nextBtn.disabled = (livroIndex === LIVROS.length - 1 && config.capitulo === totalCapitulos && config.versiculo === totalVersiculosCapitulo);
}

function updateHeader() {
    elements.header.textContent = \`\${config.livro.toUpperCase()} \${config.capitulo}:\${config.versiculo}\`;
    document.title = \`Slide Bíblico - \${config.livro} \${config.capitulo}:\${config.versiculo}\`;
}

elements.nextBtn.onclick = avancar;
elements.prevBtn.onclick = voltar;
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight') avancar();
    if (e.key === 'ArrowLeft') voltar();
});

loadChapter();
</script>
</body>
</html>
`;

    window.janelaSlide.document.open();
    window.janelaSlide.document.write(slideHTML);
    window.janelaSlide.document.close();
}

























function abrirJanelaSlide(livroAtual, capituloAtual, versiculoAtual) {
    // Corrige a capitalização do livro para bater com o objeto BIBLIA
    const livroCorrigido = capitalizeLivro(livroAtual);

    if (window.janelaSlide && !window.janelaSlide.closed) {
        window.janelaSlide.focus();
        return;
    }

    const largura = window.screen.availWidth;
    const altura = window.screen.availHeight;
    const features = `width=${largura},height=${altura},menubar=no,toolbar=no,location=no,resizable=yes,scrollbars=yes`;

    window.janelaSlide = window.open('', 'JanelaSlide', features);

    if (!window.janelaSlide) {
        alert("A abertura da janela de slide foi bloqueada pelo navegador. Por favor, permita pop-ups para este site.");
        return;
    }

    // Objeto BIBLIA dentro do HTML da janela!
    const BIBLIA = {
        Genesis: [31, 25, 24, 26, 32, 22, 24, 22, 29, 32, 32, 20, 18, 24, 21, 16, 27, 33, 38, 18, 34, 24, 20, 67, 34, 35, 46, 22, 35, 43, 55, 32, 20, 31, 29, 43, 36, 30, 23, 23, 57, 38, 34, 34, 28, 34, 31, 22, 33, 26],
        Exodus: [22, 25, 22, 31, 23, 30, 25, 32, 35, 29, 10, 51, 22, 31, 27, 36, 16, 27, 25, 26, 36, 31, 33, 18, 40, 37, 21, 43, 46, 38, 18, 35, 23, 35, 35, 38, 29, 31, 43, 38]
        // ...adicione mais livros
    };
    const LIVROS = Object.keys(BIBLIA);

    const slideHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Slide Bíblico - ${livroCorrigido} ${capituloAtual}:${versiculoAtual}</title>
<style>
    body { font-family: Arial Black, Arial, sans-serif; background: #121212; color: #fff; margin:0; padding:0; display:flex; flex-direction:column; min-height:100vh; }
    #header { padding: 15px 0; font-size: 2.5vmax; color: #f1c40f; text-transform: uppercase; background: rgba(0,0,0,0.7); width:100%; font-weight: bold; }
    #content { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; width:100%; overflow-y:auto; }
    .verse-content { display:none; width:100%; max-width:90%; margin:auto; text-align:center; }
    .verse-content.active { display:block; }
    .verse-title { font-size:2.0vmax; color:#f1c40f; margin-bottom:30px; font-weight:bold; text-transform:uppercase; letter-spacing:1px; }
    .verse-title:empty { display:none; margin-bottom:0; }
    .verse-text { font-size:2.8vmax; line-height:1.6; font-style:italic; margin-top:auto; margin-bottom:auto; padding-bottom:30px; }
    #navigation { padding:15px 0; background:rgba(0,0,0,0.7); width:100%; display:flex; justify-content:center; gap:20px; }
    .nav-button { padding:12px 25px; font-size:1.2rem; background:#f1c40f; color:#000; border:none; border-radius:5px; cursor:pointer; font-weight:bold; margin:0 10px; }
    .nav-button:disabled { background:#555; color:#999; cursor:not-allowed; opacity:0.7; }
    .nav-button:hover:not(:disabled) { background:#d4ac0d; }
</style>
</head>
<body>
<div id="header">${livroCorrigido.toUpperCase()} ${capituloAtual}:${versiculoAtual}</div>
<div id="content"><div style="padding:20px;">Carregando...</div></div>
<div id="navigation">
    <button class="nav-button" id="prev-btn">‹ Anterior</button>
    <button class="nav-button" id="next-btn">Próximo ›</button>
</div>
<script>
const BIBLIA = ${JSON.stringify(BIBLIA)};
const LIVROS = ${JSON.stringify(LIVROS)};
const config = {
    livro: '${livroCorrigido}',
    capitulo: ${capituloAtual},
    versiculo: ${versiculoAtual},
    versiculosNodes: [],
    totalVersiculos: 0
};
const elements = {
    header: document.getElementById('header'),
    content: document.getElementById('content'),
    prevBtn: document.getElementById('prev-btn'),
    nextBtn: document.getElementById('next-btn')
};

async function loadChapter() {
    setLoadingState(true);
    try {
        const response = await fetch(\`../version/arc/\${config.livro}/\${config.capitulo}.html\`);
        if (!response.ok) throw new Error(\`Capítulo \${config.capitulo} do livro '\${config.livro}' não encontrado (status: \${response.status})\`);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        config.versiculosNodes = Array.from(doc.querySelectorAll('[id^="versiculo-"]'));
        config.totalVersiculos = config.versiculosNodes.length;
        if (config.totalVersiculos === 0) {
            elements.content.innerHTML = '<div class="verse-content active" style="margin-top:auto;margin-bottom:auto;">Capítulo vazio ou não encontrado.</div>';
            config.versiculo = 1;
        } else {
            if (config.versiculo < 1) config.versiculo = 1;
            if (config.versiculo > config.totalVersiculos) config.versiculo = config.totalVersiculos;
            renderVerses();
            showCurrentVerse();
        }
    } catch (error) {
        elements.content.innerHTML = \`
            <div class="verse-content active" style="color: #e74c3c; margin-top:auto; margin-bottom:auto; font-size:1.5rem;">
                <strong>Erro ao carregar:</strong><br>
                \${error.message}<br><br>
                Tentando carregar: Livro: \${config.livro}, Capítulo: \${config.capitulo}
            </div>
        \`;
        elements.prevBtn.disabled = true;
        elements.nextBtn.disabled = true;
    } finally {
        setLoadingState(false);
        updateNavigationButtons();
        updateHeader();
    }
}

function setLoadingState(isLoading) {
    if (isLoading) {
        elements.content.innerHTML = '<div class="verse-content active" style="margin-top:auto;margin-bottom:auto;">Carregando...</div>';
        elements.prevBtn.disabled = true;
        elements.nextBtn.disabled = true;
    }
}

function renderVerses() {
    elements.content.innerHTML = '';
    config.versiculosNodes.forEach((verseNode, index) => {
        const verseNumber = index + 1;
        const verseIdClass = \`verse-num-\${verseNumber}\`;
        const strongElement = verseNode.querySelector('strong');
        let titleHTML = '';
        let textHTML = '';
        const tempDiv = verseNode.cloneNode(true);
        if (strongElement) {
            titleHTML = strongElement.outerHTML;
            const strongInTemp = tempDiv.querySelector('strong');
            if (strongInTemp) strongInTemp.parentNode.removeChild(strongInTemp);
        }
        textHTML = tempDiv.innerHTML.trim();
        const titleElement = document.createElement('div');
        titleElement.className = \`verse-title verse-content \${verseIdClass}\`;
        titleElement.innerHTML = titleHTML;
        elements.content.appendChild(titleElement);
        const textElement = document.createElement('div');
        textElement.className = \`verse-text verse-content \${verseIdClass}\`;
        textElement.innerHTML = textHTML;
        elements.content.appendChild(textElement);
    });
}

function showCurrentVerse() {
    const currentVerseClass = \`verse-num-\${config.versiculo}\`;
    document.querySelectorAll('.verse-content').forEach(v => v.classList.remove('active'));
    const currentElements = document.querySelectorAll('.' + currentVerseClass);
    if (currentElements.length > 0) {
        currentElements.forEach(el => el.classList.add('active'));
    }
    updateHeader();
    updateNavigationButtons();
}

function avancar() {
    const livroIndex = LIVROS.indexOf(config.livro);
    const capitulosLivro = BIBLIA[config.livro];
    if (!capitulosLivro) return;
    const totalCapitulos = capitulosLivro.length;
    const totalVersiculosCapitulo = capitulosLivro[config.capitulo - 1];
    if (config.versiculo < totalVersiculosCapitulo) {
        config.versiculo++;
        showCurrentVerse();
    } else if (config.capitulo < totalCapitulos) {
        config.capitulo++;
        config.versiculo = 1;
        loadChapter();
    } else if (livroIndex < LIVROS.length - 1) {
        config.livro = LIVROS[livroIndex + 1];
        config.capitulo = 1;
        config.versiculo = 1;
        loadChapter();
    }
}

function voltar() {
    const livroIndex = LIVROS.indexOf(config.livro);
    const capitulosLivro = BIBLIA[config.livro];
    if (!capitulosLivro) return;
    if (config.versiculo > 1) {
        config.versiculo--;
        showCurrentVerse();
    } else if (config.capitulo > 1) {
        config.capitulo--;
        config.versiculo = BIBLIA[config.livro][config.capitulo - 1];
        loadChapter();
    } else if (livroIndex > 0) {
        config.livro = LIVROS[livroIndex - 1];
        config.capitulo = BIBLIA[config.livro].length;
        config.versiculo = BIBLIA[config.livro][config.capitulo - 1];
        loadChapter();
    }
}

function updateNavigationButtons() {
    const livroIndex = LIVROS.indexOf(config.livro);
    const capitulosLivro = BIBLIA[config.livro];
    if (!capitulosLivro) {
        elements.prevBtn.disabled = true;
        elements.nextBtn.disabled = true;
        return;
    }
    const totalCapitulos = capitulosLivro.length;
    const totalVersiculosCapitulo = capitulosLivro[config.capitulo - 1];
    elements.prevBtn.disabled = (livroIndex === 0 && config.capitulo === 1 && config.versiculo === 1);
    elements.nextBtn.disabled = (livroIndex === LIVROS.length - 1 && config.capitulo === totalCapitulos && config.versiculo === totalVersiculosCapitulo);
}

function updateHeader() {
    elements.header.textContent = \`\${config.livro.toUpperCase()} \${config.capitulo}:\${config.versiculo}\`;
    document.title = \`Slide Bíblico - \${config.livro} \${config.capitulo}:\${config.versiculo}\`;
}

elements.nextBtn.onclick = avancar;
elements.prevBtn.onclick = voltar;
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight') avancar();
    if (e.key === 'ArrowLeft') voltar();
});

loadChapter();
</script>
</body>
</html>
`;

    window.janelaSlide.document.open();
    window.janelaSlide.document.write(slideHTML);
    window.janelaSlide.document.close();
}





// O bloco abaixo cria a janela de SLIDE para o data-show
function abrirJanelaSlide(livroAtual, capituloAtual, versiculoAtual) {
    // Verifica se a janela já existe e está aberta
    if (window.janelaSlide && !window.janelaSlide.closed) {
        window.janelaSlide.focus();
        return;
    }

    // Configurações da janela
    const largura = window.screen.availWidth;
    const altura = window.screen.availHeight;
    const features = `width=${largura},height=${altura},menubar=no,toolbar=no,location=no,resizable=yes,scrollbars=yes`;

    // Abre a nova janela
    window.janelaSlide = window.open('', 'JanelaSlide', features);

    // Conteúdo HTML da janela Slide
    const slideHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Slide Bíblico - ${livroAtual} ${capituloAtual}:${versiculoAtual}</title>
    <style>
        body {
            font-family: 'Arial Black', 'Arial Bold', Gadget, sans-serif;
            background-color: #121212;
            color: #ffffff;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            text-align: center;
            overflow: hidden;
            font-style: italic;
        }
        #watermark {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('../img/biblia.png');
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            opacity: 0.15;
            z-index: -1;
        }
        #header {
            padding: 15px 0;
            font-size: 2.5vmax;
            color: #f1c40f;
            text-transform: uppercase;
            background-color: rgba(0,0,0,0.7);
            width: 100%;
        }
        #content {
            flex: 1;
            display: flex;
            flex-direction: column;
            /*justify-content: center;*/
            align-items: center;
            padding: 20px;
            font-size: 2.6vmax;
            line-height: 1.5;
            max-width: 100%;
            margin: 0 auto;
            /*margin-bottom: -13px; */
            padding-bottom: 60px;   /* Adiciona espaço abaixo do texto */
            box-sizing: border-box
            
            justify-content: flex-start; /* Alinha conteúdo no topo */
            padding-top: 1rem; /* Reduz espaço acima do texto */
            min-height: auto; /* Remove altura mínima fixa */
            margin-top: 1rem; /* Compensa espaço residual */
        }
        /*#navigation {
            /*padding: 15px 0;
            padding: 15px 0 30px 0;
            background-color: rgba(0,0,0,0.7);
            width: 100%;
        }*/

        #navigation {
        position: fixed; /* Fixa os botões na tela */
        bottom: 0; /* Cola na base da viewport */
        left: 0;
        right: 0;
        padding: 15px 0;
        background-color: rgba(0,0,0,0.7);
        width: 100%;
        z-index: 1000; /* Garante que fique acima do conteúdo */
        display: flex;
        justify-content: center; /* Centraliza os botões */
        gap: 20px; /* Espaço entre os botões */
}

        .nav-button {
            padding: 12px 25px;
            font-size: 1.2rem;
            background-color: #f1c40f;
            color: #000;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s;
            font-weight: bold;
            margin: 0 10px;
        }
        .verse {
            display: none;
            width: 100%;
        }
        .verse.active {
            display: block;
            animation: fadeIn 0.5s ease-in-out;
        }
        .verse strong {
            font-weight: normal;
            font-size: 1.5em;
        }
        .verse > div:first-child {
            font-size: 0.7em;
            color: #f1c40f;
            margin-bottom: 15px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-style: italic;
            
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>
    <div id="watermark"></div>
    <div id="header">${livroAtual.toUpperCase()} ${capituloAtual}:${versiculoAtual}</div>
    <div id="content"></div>
    <div id="navigation">
        <button class="nav-button" id="prev-btn">‹ Anterior</button>
        <button class="nav-button" id="next-btn">Próximo ›</button>
    </div>

    <script>
        // Configurações iniciais
        const config = {
            livro: '${livroAtual}',
            capitulo: ${capituloAtual},
            versiculo: ${versiculoAtual},
            versiculos: [],
            totalVersiculos: 0
        };

        // Elementos DOM
        const elements = {
            header: document.getElementById('header'),
            content: document.getElementById('content'),
            prevBtn: document.getElementById('prev-btn'),
            nextBtn: document.getElementById('next-btn')
        };

        // Carrega o capítulo
        async function loadChapter() {
            try {
                elements.content.innerHTML = '<div style="padding: 20px; text-align: center;">Carregando...</div>';
                
                const response = await fetch('../version/arc/' + config.livro + '/' + config.capitulo + '.html');
                
                if (!response.ok) {
                    throw new Error('Capítulo não encontrado');
                }
                
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // Extrai todos os versículos
                config.versiculos = Array.from(doc.querySelectorAll('[id^="versiculo-"]'));
                config.totalVersiculos = config.versiculos.length;
                
                if (config.totalVersiculos === 0) {
                    throw new Error('Nenhum versículo encontrado neste capítulo');
                }
                
                // Renderiza os versículos
                renderVerses();
                
                // Ajusta o versículo atual se necessário
                if (config.versiculo > config.totalVersiculos) {
                    config.versiculo = config.totalVersiculos;
                }
                
                showCurrentVerse();
                
            } catch (error) {
                console.error('Erro:', error);
                elements.content.innerHTML = \`
                    <div style="color: #e74c3c; padding: 20px; text-align: center;">
                        Erro ao carregar: \${error.message}<br><br>
                        Livro: \${config.livro}<br>
                        Capítulo: \${config.capitulo}<br>
                        Versículo: \${config.versiculo}
                    </div>
                \`;
            }
        }

        // Renderiza todos os versículos no DOM (inicialmente ocultos)
        function renderVerses() {
            elements.content.innerHTML = '';
            config.versiculos.forEach((verse, index) => {
                const verseElement = document.createElement('div');
                verseElement.className = 'verse';
                verseElement.id = 'verse-' + (index + 1);
                
                // Extrai o conteúdo da tag <strong> se existir
                const strongElement = verse.querySelector('strong');
                let verseContent = verse.innerHTML;
                
                if (strongElement) {
                    // Cria uma estrutura com o strong acima e o restante abaixo
                    verseContent = \`
                        <div>\${strongElement.outerHTML}</div>
                        <div>\${verse.innerHTML.replace(strongElement.outerHTML, '')}</div>
                    \`;
                }
                
                verseElement.innerHTML = verseContent;
                elements.content.appendChild(verseElement);
            });
        }

        // Mostra o versículo atual
        function showCurrentVerse() {
            // Oculta todos os versículos
            document.querySelectorAll('.verse').forEach(v => v.classList.remove('active'));
            
            // Mostra o versículo atual
            const currentVerse = document.getElementById('verse-' + config.versiculo);
            if (currentVerse) {
                currentVerse.classList.add('active');
                elements.header.textContent = \`\${config.livro.toUpperCase()} \${config.capitulo}:\${config.versiculo}\`;
            }
            
            // Atualiza estado dos botões
            elements.prevBtn.disabled = config.capitulo === 1 && config.versiculo === 1;
            elements.nextBtn.disabled = false;
        }

        // Navega para o próximo versículo
        function nextVerse() {
            if (config.versiculo < config.totalVersiculos) {
                config.versiculo++;
                showCurrentVerse();
            } else {
                nextChapter();
            }
        }

        // Navega para o capítulo seguinte
        async function nextChapter() {
            config.capitulo++;
            config.versiculo = 1;
            await loadChapter();
        }

        // Navega para o versículo anterior
        function prevVerse() {
            if (config.versiculo > 1) {
                config.versiculo--;
                showCurrentVerse();
            } else {
                prevChapter();
            }
        }

        // Navega para o capítulo anterior
        async function prevChapter() {
            if (config.capitulo > 1) {
                config.capitulo--;
                config.versiculo = 1;
                await loadChapter();
            }
        }

        // Event Listeners
        elements.nextBtn.addEventListener('click', nextVerse);
        elements.prevBtn.addEventListener('click', prevVerse);

        // Navegação por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') nextVerse();
            if (e.key === 'ArrowLeft') prevVerse();
        });

        // Inicialização
        loadChapter();
    </script>
</body>
</html>
    `;

    // Escreve o conteúdo na janela
    window.janelaSlide.document.open();
    window.janelaSlide.document.write(slideHTML);
    window.janelaSlide.document.close();

    // Foca na janela
    window.janelaSlide.focus();
}

********************************
// O bloco abaixo cria a janela de SLIDE para o data-show
function abrirJanelaSlide(livroAtual, capituloAtual, versiculoAtual) {
    // Verifica se a janela já existe e está aberta
    if (window.janelaSlide && !window.janelaSlide.closed) {
        window.janelaSlide.focus(); // Se já estiver aberta, apenas foca nela
        // Opcional: Atualizar o conteúdo da janela existente se necessário
        // window.janelaSlide.location.reload(); // Ou chamar uma função dentro da janela para atualizar
        return;
    }

    // Configurações da janela (tela cheia disponível)
    const largura = window.screen.availWidth;
    const altura = window.screen.availHeight;
    const features = `width=${largura},height=${altura},menubar=no,toolbar=no,location=no,resizable=yes,scrollbars=yes`;

    // Abre a nova janela (ou reutiliza a referência se fechada)
    window.janelaSlide = window.open('', 'JanelaSlide', features);

    // Verifica se a janela foi bloqueada pelo navegador
    if (!window.janelaSlide) {
        alert("A abertura da janela de slide foi bloqueada pelo navegador. Por favor, permita pop-ups para este site.");
        return;
    }

    // Conteúdo HTML da janela Slide
    const slideHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Slide Bíblico - ${livroAtual} ${capituloAtual}:${versiculoAtual}</title>
    <style>
        /* Reset básico e Estilos Globais */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        html, body {
            height: 100%; /* Garante que html e body ocupem toda a altura */
            overflow: hidden; /* Previne barras de rolagem no body */
        }
        body {
            font-family: 'Arial Black', 'Arial Bold', Gadget, sans-serif;
            background-color: #121212;
            color: #ffffff;
            display: flex; /* Usa flexbox para layout geral */
            flex-direction: column; /* Empilha header, content, navigation */
            min-height: 100vh; /* Garante que o body ocupe toda a altura da viewport */
            text-align: center;
        }

        /* Marca d'água */
        #watermark {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('../img/biblia.png'); /* Verifique se este caminho está correto */
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            opacity: 0.15;
            z-index: -1; /* Fica atrás de todo o conteúdo */
        }

        /* Cabeçalho */
        #header {
            padding: 15px 0;
            font-size: 2.5vmax; /* Tamanho responsivo */
            color: #f1c40f;
            text-transform: uppercase;
            background-color: rgba(0,0,0,0.7);
            width: 100%;
            flex-shrink: 0; /* Não permite que o header encolha */
            z-index: 10; /* Garante que fique acima da marca d'água */
        }

        /* Área de Conteúdo Principal */
        #content {
            flex: 1; /* Ocupa todo o espaço vertical restante */
            display: flex;
            flex-direction: column; /* Empilha título e texto */
            align-items: center; /* Centraliza horizontalmente */
            justify-content: flex-start; /* Alinha o título no topo */
            padding: 20px;
            width: 100%;
            overflow-y: auto; /* Permite rolagem se o conteúdo for muito grande */
            z-index: 5; /* Acima da marca d'água */
        }

        /* Classe base para elementos de versículo (título e texto) */
        .verse-content {
            display: none; /* Oculto por padrão */
            width: 100%;
            max-width: 90%; /* Limita largura para melhor leitura */
            margin-left: auto;
            margin-right: auto;
            text-align: center;
        }

        /* Classe para mostrar o par de versículo ativo */
        .verse-content.active {
            display: block; /* Torna visível */
            animation: fadeIn 0.5s ease-in-out;
        }

        /* Estilo para o título do versículo (conteúdo do <strong>) */
        .verse-title {
            font-size: 2.0vmax; /* Tamanho um pouco menor que o texto */
            color: #f1c40f;
            margin-bottom: 30px; /* Aumenta espaço abaixo do título */
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-style: normal; /* Título geralmente não itálico */
            flex-shrink: 0; /* Não encolhe */
        }
         /* Oculta a div do título se ela estiver vazia (sem <strong>) */
        .verse-title:empty {
            display: none;
            margin-bottom: 0;
        }

        /* Estilo para o texto principal do versículo */
        .verse-text {
            font-size: 2.8vmax; /* Tamanho principal do texto - Ajuste conforme necessário */
            line-height: 1.6; /* Melhora legibilidade */
            font-style: italic;
            /* Centralização Vertical Dinâmica: */
            margin-top: auto;    /* Empurra para baixo */
            margin-bottom: auto; /* Empurra para cima */
            padding-bottom: 30px; /* Espaço extra abaixo antes da navegação */
            flex-grow: 0; /* Não estica */
            flex-shrink: 0; /* Não encolhe */
        }

        /* Animação de Fade-in */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Navegação Inferior */
        #navigation {
            padding: 15px 0;
            background-color: rgba(0,0,0,0.7);
            width: 100%;
            flex-shrink: 0; /* Não permite que a navegação encolha */
            z-index: 1000; /* Garante que fique acima de tudo */
            display: flex;
            justify-content: center;
            gap: 20px; /* Espaço entre os botões */
        }

        /* Botões de Navegação */
        .nav-button {
            padding: 12px 25px;
            font-size: 1.2rem;
            background-color: #f1c40f;
            color: #000;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s, opacity 0.3s;
            font-weight: bold;
            margin: 0 10px;
            font-family: 'Arial', sans-serif; /* Fonte mais padrão para botões */
            font-style: normal; /* Remove itálico dos botões */
        }
        .nav-button:hover:not(:disabled) {
            background-color: #d4ac0d; /* Cor um pouco mais escura no hover */
        }
        .nav-button:disabled {
            background-color: #555; /* Cinza para desabilitado */
            color: #999;
            cursor: not-allowed;
            opacity: 0.7;
        }
    </style>
</head>
<body>
    <div id="watermark"></div>
    <div id="header">${livroAtual.toUpperCase()} ${capituloAtual}:${versiculoAtual}</div>
    <div id="content">
        <!-- Versículos serão carregados aqui pelo JavaScript -->
        <div style="padding: 20px; text-align: center;">Carregando...</div>
    </div>
    <div id="navigation">
        <button class="nav-button" id="prev-btn" title="Versículo/Capítulo Anterior (Seta Esquerda)">‹ Anterior</button>
        <button class="nav-button" id="next-btn" title="Próximo Versículo/Capítulo (Seta Direita)">Próximo ›</button>
    </div>

    <script>
        // --- Configuração Inicial ---
        const config = {
            livro: '${livroAtual}',
            capitulo: ${capituloAtual},
            versiculo: ${versiculoAtual},
            versiculosNodes: [], // Armazena os nós DOM originais dos versículos
            totalVersiculos: 0 // Total de versículos no capítulo atual
        };

        // --- Referências aos Elementos DOM ---
        const elements = {
            header: document.getElementById('header'),
            content: document.getElementById('content'),
            prevBtn: document.getElementById('prev-btn'),
            nextBtn: document.getElementById('next-btn'),
            body: document.body // Referência ao body para forçar reflow se necessário
        };

        // --- Funções Principais ---

        // Carrega os versículos do capítulo especificado
        async function loadChapter() {
            console.log(\`Carregando: \${config.livro} \${config.capitulo}\`);
            setLoadingState(true); // Mostra estado de carregamento

            try {
                // IMPORTANTE: Ajuste o caminho se necessário. Este caminho é relativo
                // à localização do ARQUIVO HTML PRINCIPAL que chama abrirJanelaSlide.
                const response = await fetch(\`../version/arc/\${config.livro}/\${config.capitulo}.html\`);

                if (!response.ok) {
                    throw new Error(\`Capítulo \${config.capitulo} do livro '\${config.livro}' não encontrado (status: \${response.status})\`);
                }

                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // Extrai todos os elementos que representam versículos (ajuste o seletor se necessário)
                config.versiculosNodes = Array.from(doc.querySelectorAll('[id^="versiculo-"]'));
                config.totalVersiculos = config.versiculosNodes.length;

                console.log(\`Encontrados \${config.totalVersiculos} versículos.\`);

                if (config.totalVersiculos === 0) {
                    // Considerar se isso é um erro ou apenas um capítulo vazio
                     console.warn('Nenhum versículo encontrado neste capítulo.');
                    // Poderia exibir uma mensagem "Capítulo sem versículos."
                    elements.content.innerHTML = '<div class="verse-content active" style="margin-top: auto; margin-bottom:auto;">Capítulo vazio ou não encontrado.</div>';
                    config.versiculo = 1; // Reset para caso navegue para cá
                } else {
                     // Ajusta o versículo atual se ele for inválido para o capítulo carregado
                    if (config.versiculo < 1) config.versiculo = 1;
                    if (config.versiculo > config.totalVersiculos) config.versiculo = config.totalVersiculos;

                    renderVerses(); // Cria os elementos HTML para os versículos
                    showCurrentVerse(); // Mostra o versículo correto
                }

            } catch (error) {
                console.error('Erro ao carregar capítulo:', error);
                elements.content.innerHTML = \`
                    <div class="verse-content active" style="color: #e74c3c; margin-top: auto; margin-bottom: auto; font-style: normal; font-size: 1.5rem;">
                        <strong>Erro ao carregar:</strong><br>
                        \${error.message}<br><br>
                        Tentando carregar: Livro: \${config.livro}, Capítulo: \${config.capitulo}
                    </div>
                \`;
                 // Desabilita botões em caso de erro grave
                 elements.prevBtn.disabled = true;
                 elements.nextBtn.disabled = true;
            } finally {
                setLoadingState(false); // Esconde estado de carregamento
                updateNavigationButtons(); // Atualiza estado dos botões após carregar
            }
        }

        // Define o estado visual de carregamento
        function setLoadingState(isLoading) {
            if (isLoading) {
                elements.content.innerHTML = '<div class="verse-content active" style="margin-top: auto; margin-bottom: auto; font-style: normal;">Carregando...</div>';
                elements.prevBtn.disabled = true;
                elements.nextBtn.disabled = true;
            }
             // Não limpa o conteúdo aqui no 'false', pois loadChapter/renderVerses farão isso.
        }

        // Renderiza os elementos HTML para todos os versículos (inicialmente ocultos)
        function renderVerses() {
            elements.content.innerHTML = ''; // Limpa conteúdo anterior
            config.versiculosNodes.forEach((verseNode, index) => {
                const verseNumber = index + 1;
                const verseIdClass = \`verse-num-\${verseNumber}\`; // Classe para identificar o par

                const strongElement = verseNode.querySelector('strong');
                let titleHTML = '';
                let textHTML = '';

                 // Clona o nó para manipular sem afetar o original em config.versiculosNodes
                 const tempDiv = verseNode.cloneNode(true);

                if (strongElement) {
                    // Pega o HTML do strong original para o título
                    titleHTML = strongElement.outerHTML;
                    // Remove o strong do nó clonado para obter o texto restante
                    const strongInTemp = tempDiv.querySelector('strong');
                    if (strongInTemp) {
                         strongInTemp.parentNode.removeChild(strongInTemp);
                    }
                }
                 // O texto restante é o innerHTML do nó clonado (sem o strong)
                 textHTML = tempDiv.innerHTML.trim();

                // Cria elemento para o TÍTULO (conteúdo do strong)
                const titleElement = document.createElement('div');
                titleElement.className = \`verse-title verse-content \${verseIdClass}\`; // Classes: estilo, controle visibilidade, identificador
                titleElement.innerHTML = titleHTML;
                elements.content.appendChild(titleElement);

                // Cria elemento para o TEXTO principal do versículo
                const textElement = document.createElement('div');
                textElement.className = \`verse-text verse-content \${verseIdClass}\`; // Classes: estilo, controle visibilidade, identificador
                textElement.innerHTML = textHTML;
                elements.content.appendChild(textElement);
            });
        }

        // Mostra o versículo atual e esconde os outros
        function showCurrentVerse() {
            const currentVerseClass = \`verse-num-\${config.versiculo}\`;
            console.log(\`Mostrando versículo: \${config.versiculo} (classe: \${currentVerseClass})\`);

            // 1. Oculta TODOS os elementos de versículo (remove .active)
            document.querySelectorAll('.verse-content').forEach(v => {
                v.classList.remove('active');
            });

            // 2. Mostra APENAS os elementos do versículo ATUAL (adiciona .active)
            const currentElements = document.querySelectorAll('.' + currentVerseClass);
            if (currentElements.length > 0) {
                currentElements.forEach(el => el.classList.add('active'));
                 // Força reflow para garantir reinício da animação
                 elements.content.offsetHeight;
            } else {
                 console.warn(\`Elementos para o versículo \${config.versiculo} não encontrados.\`);
                 // Pode ser que o capítulo esteja vazio ou houve erro no renderVerses
                 if (config.totalVersiculos === 0) {
                     elements.content.innerHTML = '<div class="verse-content active" style="margin-top: auto; margin-bottom:auto;">Capítulo vazio ou não encontrado.</div>';
                 }
            }

            // 3. Atualiza o cabeçalho e o título da janela
            const headerText = \`\${config.livro.toUpperCase()} \${config.capitulo}:\${config.versiculo}\`;
            elements.header.textContent = headerText;
            document.title = \`Slide Bíblico - \${headerText}\`;

             // 4. Atualiza botões (feito em updateNavigationButtons chamado após showCurrentVerse ou em finally)
             // updateNavigationButtons(); // Chamado após operações assíncronas ou de navegação
        }

         // Atualiza o estado (habilitado/desabilitado) dos botões de navegação
        function updateNavigationButtons() {
            // Botão Anterior: Desabilitado se for o primeiro versículo do primeiro capítulo (assumindo que o primeiro livro não tem capítulo 0)
            // TODO: Precisaria de uma lista de livros para saber qual é o primeiro livro. Por enquanto, só verifica cap 1, ver 1.
            elements.prevBtn.disabled = (config.capitulo <= 1 && config.versiculo <= 1);

            // Botão Próximo: Desabilitado se for o último versículo do capítulo ATUAL.
            // A lógica para ir ao próximo capítulo cuidará de reabilitá-lo.
            // Também desabilita se o total de versículos for 0 (capítulo vazio/erro).
            elements.nextBtn.disabled = (config.totalVersiculos === 0 || config.versiculo >= config.totalVersiculos);

            // Log de estado dos botões para debug
            // console.log(\`Botões atualizados: Prev: \${elements.prevBtn.disabled}, Next: \${elements.nextBtn.disabled}\`);
        }

        // --- Funções de Navegação ---

        function nextVerse() {
            if (config.versiculo < config.totalVersiculos) {
                config.versiculo++;
                showCurrentVerse();
                updateNavigationButtons(); // Atualiza botões após mudar versículo
            } else {
                // Se está no último versículo, tenta ir para o próximo capítulo
                nextChapter();
            }
        }

        async function nextChapter() {
            console.log("Tentando ir para o próximo capítulo...");
            config.capitulo++;
            config.versiculo = 1; // Começa no primeiro versículo do novo capítulo
            await loadChapter(); // Carrega o novo capítulo (que chamará showCurrentVerse e updateNavigationButtons)
        }

        function prevVerse() {
            if (config.versiculo > 1) {
                config.versiculo--;
                showCurrentVerse();
                updateNavigationButtons(); // Atualiza botões após mudar versículo
            } else {
                // Se está no primeiro versículo, tenta ir para o capítulo anterior
                prevChapter();
            }
        }

        async function prevChapter() {
            if (config.capitulo > 1) {
                console.log("Tentando ir para o capítulo anterior...");
                config.capitulo--;
                config.versiculo = 1; // Vai para o primeiro versículo do capítulo anterior
                // Idealmente, aqui carregaríamos o capítulo e DEPOIS definiríamos
                // config.versiculo para o ÚLTIMO versículo, mas isso requer saber
                // o total de versículos ANTES de chamar showCurrentVerse.
                // Vamos manter a simplicidade indo para o versículo 1 por enquanto.
                await loadChapter(); // Carrega o capítulo anterior
            } else {
                console.log("Já está no primeiro capítulo.");
                // O botão 'prev' já deve estar desabilitado pela updateNavigationButtons
            }
        }

        // --- Event Listeners ---
        elements.nextBtn.addEventListener('click', nextVerse);
        elements.prevBtn.addEventListener('click', prevVerse);

        // Navegação por teclado (Setas Esquerda/Direita)
        document.addEventListener('keydown', (e) => {
            // Ignora eventos se um input/textarea estiver focado (não temos aqui, mas é boa prática)
            // if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
            //     return;
            // }

            if (e.key === 'ArrowRight' || e.key === 'PageDown') {
                // Só avança se o botão não estiver desabilitado
                if (!elements.nextBtn.disabled) {
                    nextVerse();
                }
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                 // Só volta se o botão não estiver desabilitado
                if (!elements.prevBtn.disabled) {
                    prevVerse();
                }
            } else if (e.key === 'Escape') {
                // Fecha a janela com a tecla Esc
                 window.close();
             }
        });

         // Listener para fechar a janela se a janela principal for fechada (opcional)
         // window.addEventListener('beforeunload', () => {
         //    // Código para fechar esta janela slide, se necessário
         // });


        // --- Inicialização ---
        loadChapter(); // Carrega o capítulo inicial quando o script roda

    </script>
</body>
</html>
    `;

    // Escreve o conteúdo na janela
    // Usar document.write é comum aqui, mas pode ter implicações se chamado após o fechamento do fluxo inicial.
    // Abrir, escrever e fechar o documento da janela é a abordagem padrão para popups criados assim.
    window.janelaSlide.document.open();
    window.janelaSlide.document.write(slideHTML);
    window.janelaSlide.document.close(); // Essencial para finalizar o carregamento do DOM da nova janela

    // Foca na janela recém-criada ou atualizada
    window.janelaSlide.focus();
}

// Exemplo de como chamar a função (coloque isso no seu HTML principal, dentro de um script ou evento)
// Certifique-se de que os valores de livro, capítulo e versículo são válidos
// document.getElementById('botao-abrir-slide').addEventListener('click', () => {
//     abrirJanelaSlide('Genesis', 1, 1); // Exemplo: Abrir Gênesis 1:1
// });









*******************************


// O bloco abaixo cria a janela de SLIDE para o data-show
function abrirJanelaSlide(livroAtual, capituloAtual, versiculoAtual) {
    // Verifica se a janela já existe e está aberta
    if (window.janelaSlide && !window.janelaSlide.closed) {
        window.janelaSlide.focus(); // Se já estiver aberta, apenas foca nela
        // Opcional: Atualizar o conteúdo da janela existente se necessário
        // window.janelaSlide.location.reload(); // Ou chamar uma função dentro da janela para atualizar
        return;
    }

    // Configurações da janela (tela cheia disponível)
    const largura = window.screen.availWidth;
    const altura = window.screen.availHeight;
    const features = `width=${largura},height=${altura},menubar=no,toolbar=no,location=no,resizable=yes,scrollbars=yes`;

    // Abre a nova janela (ou reutiliza a referência se fechada)
    window.janelaSlide = window.open('', 'JanelaSlide', features);

    // Verifica se a janela foi bloqueada pelo navegador
    if (!window.janelaSlide) {
        alert("A abertura da janela de slide foi bloqueada pelo navegador. Por favor, permita pop-ups para este site.");
        return;
    }

    // Conteúdo HTML da janela Slide
    const slideHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Slide Bíblico - ${livroAtual} ${capituloAtual}:${versiculoAtual}</title>
    <style>
        /* Reset básico e Estilos Globais */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        html, body {
            height: 100%; /* Garante que html e body ocupem toda a altura */
            overflow: hidden; /* Previne barras de rolagem no body */
        }
        body {
            font-family: 'Arial Black', 'Arial Bold', Gadget, sans-serif;
            background-color: #121212;
            color: #ffffff;
            display: flex; /* Usa flexbox para layout geral */
            flex-direction: column; /* Empilha header, content, navigation */
            min-height: 100vh; /* Garante que o body ocupe toda a altura da viewport */
            text-align: center;
        }

        /* Marca d'água */
        #watermark {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('../img/biblia.png'); /* Verifique se este caminho está correto */
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            opacity: 0.15;
            z-index: -1; /* Fica atrás de todo o conteúdo */
        }

        /* Cabeçalho */
        #header {
            padding: 15px 0;
            font-size: 2.5vmax; /* Tamanho responsivo */
            color: #f1c40f;
            text-transform: uppercase;
            background-color: rgba(0,0,0,0.7);
            width: 100%;
            flex-shrink: 0; /* Não permite que o header encolha */
            z-index: 10; /* Garante que fique acima da marca d'água */
        }

        /* Área de Conteúdo Principal */
        #content {
            flex: 1; /* Ocupa todo o espaço vertical restante */
            display: flex;
            flex-direction: column; /* Empilha título e texto */
            align-items: center; /* Centraliza horizontalmente */
            justify-content: flex-start; /* Alinha o título no topo */
            padding: 20px;
            width: 100%;
            overflow-y: auto; /* Permite rolagem se o conteúdo for muito grande */
            z-index: 5; /* Acima da marca d'água */
        }

        /* Classe base para elementos de versículo (título e texto) */
        .verse-content {
            display: none; /* Oculto por padrão */
            width: 100%;
            max-width: 90%; /* Limita largura para melhor leitura */
            margin-left: auto;
            margin-right: auto;
            text-align: center;
        }

        /* Classe para mostrar o par de versículo ativo */
        .verse-content.active {
            display: block; /* Torna visível */
            animation: fadeIn 0.5s ease-in-out;
        }

        /* Estilo para o título do versículo (conteúdo do <strong>) */
        .verse-title {
            font-size: 2.0vmax; /* Tamanho um pouco menor que o texto */
            color: #f1c40f;
            margin-bottom: 30px; /* Aumenta espaço abaixo do título */
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-style: normal; /* Título geralmente não itálico */
            flex-shrink: 0; /* Não encolhe */
        }
         /* Oculta a div do título se ela estiver vazia (sem <strong>) */
        .verse-title:empty {
            display: none;
            margin-bottom: 0;
        }

        /* Estilo para o texto principal do versículo */
        .verse-text {
            font-size: 2.8vmax; /* Tamanho principal do texto - Ajuste conforme necessário */
            line-height: 1.6; /* Melhora legibilidade */
            font-style: italic;
            /* Centralização Vertical Dinâmica: */
            margin-top: auto;    /* Empurra para baixo */
            margin-bottom: auto; /* Empurra para cima */
            padding-bottom: 30px; /* Espaço extra abaixo antes da navegação */
            flex-grow: 0; /* Não estica */
            flex-shrink: 0; /* Não encolhe */
        }

        /* Animação de Fade-in */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Navegação Inferior */
        #navigation {
            padding: 15px 0;
            background-color: rgba(0,0,0,0.7);
            width: 100%;
            flex-shrink: 0; /* Não permite que a navegação encolha */
            z-index: 1000; /* Garante que fique acima de tudo */
            display: flex;
            justify-content: center;
            gap: 20px; /* Espaço entre os botões */
        }

        /* Botões de Navegação */
        .nav-button {
            padding: 12px 25px;
            font-size: 1.2rem;
            background-color: #f1c40f;
            color: #000;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s, opacity 0.3s;
            font-weight: bold;
            margin: 0 10px;
            font-family: 'Arial', sans-serif; /* Fonte mais padrão para botões */
            font-style: normal; /* Remove itálico dos botões */
        }
        .nav-button:hover:not(:disabled) {
            background-color: #d4ac0d; /* Cor um pouco mais escura no hover */
        }
        .nav-button:disabled {
            background-color: #555; /* Cinza para desabilitado */
            color: #999;
            cursor: not-allowed;
            opacity: 0.7;
        }
    </style>
</head>
<body>
    <div id="watermark"></div>
    <div id="header">${livroAtual.toUpperCase()} ${capituloAtual}:${versiculoAtual}</div>
    <div id="content">
        <!-- Versículos serão carregados aqui pelo JavaScript -->
        <div style="padding: 20px; text-align: center;">Carregando...</div>
    </div>
    <div id="navigation">
        <button class="nav-button" id="prev-btn" title="Versículo/Capítulo Anterior (Seta Esquerda)">‹ Anterior</button>
        <button class="nav-button" id="next-btn" title="Próximo Versículo/Capítulo (Seta Direita)">Próximo ›</button>
    </div>

    <script>
        // --- Configuração Inicial ---
        const config = {
            livro: '${livroAtual}',
            capitulo: ${capituloAtual},
            versiculo: ${versiculoAtual},
            versiculosNodes: [], // Armazena os nós DOM originais dos versículos
            totalVersiculos: 0 // Total de versículos no capítulo atual
        };

        // --- Referências aos Elementos DOM ---
        const elements = {
            header: document.getElementById('header'),
            content: document.getElementById('content'),
            prevBtn: document.getElementById('prev-btn'),
            nextBtn: document.getElementById('next-btn'),
            body: document.body // Referência ao body para forçar reflow se necessário
        };

        // --- Funções Principais ---

        // Carrega os versículos do capítulo especificado
        async function loadChapter() {
            console.log(\`Carregando: \${config.livro} \${config.capitulo}\`);
            setLoadingState(true); // Mostra estado de carregamento

            try {
                // IMPORTANTE: Ajuste o caminho se necessário. Este caminho é relativo
                // à localização do ARQUIVO HTML PRINCIPAL que chama abrirJanelaSlide.
                const response = await fetch(\`../version/arc/\${config.livro}/\${config.capitulo}.html\`);

                if (!response.ok) {
                    throw new Error(\`Capítulo \${config.capitulo} do livro '\${config.livro}' não encontrado (status: \${response.status})\`);
                }

                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // Extrai todos os elementos que representam versículos (ajuste o seletor se necessário)
                config.versiculosNodes = Array.from(doc.querySelectorAll('[id^="versiculo-"]'));
                config.totalVersiculos = config.versiculosNodes.length;

                console.log(\`Encontrados \${config.totalVersiculos} versículos.\`);

                if (config.totalVersiculos === 0) {
                    // Considerar se isso é um erro ou apenas um capítulo vazio
                     console.warn('Nenhum versículo encontrado neste capítulo.');
                    // Poderia exibir uma mensagem "Capítulo sem versículos."
                    elements.content.innerHTML = '<div class="verse-content active" style="margin-top: auto; margin-bottom:auto;">Capítulo vazio ou não encontrado.</div>';
                    config.versiculo = 1; // Reset para caso navegue para cá
                } else {
                     // Ajusta o versículo atual se ele for inválido para o capítulo carregado
                    if (config.versiculo < 1) config.versiculo = 1;
                    if (config.versiculo > config.totalVersiculos) config.versiculo = config.totalVersiculos;

                    renderVerses(); // Cria os elementos HTML para os versículos
                    showCurrentVerse(); // Mostra o versículo correto
                }

            } catch (error) {
                console.error('Erro ao carregar capítulo:', error);
                elements.content.innerHTML = \`
                    <div class="verse-content active" style="color: #e74c3c; margin-top: auto; margin-bottom: auto; font-style: normal; font-size: 1.5rem;">
                        <strong>Erro ao carregar:</strong><br>
                        \${error.message}<br><br>
                        Tentando carregar: Livro: \${config.livro}, Capítulo: \${config.capitulo}
                    </div>
                \`;
                 // Desabilita botões em caso de erro grave
                 elements.prevBtn.disabled = true;
                 elements.nextBtn.disabled = true;
            } finally {
                setLoadingState(false); // Esconde estado de carregamento
                updateNavigationButtons(); // Atualiza estado dos botões após carregar
            }
        }

        // Define o estado visual de carregamento
        function setLoadingState(isLoading) {
            if (isLoading) {
                elements.content.innerHTML = '<div class="verse-content active" style="margin-top: auto; margin-bottom: auto; font-style: normal;">Carregando...</div>';
                elements.prevBtn.disabled = true;
                elements.nextBtn.disabled = true;
            }
             // Não limpa o conteúdo aqui no 'false', pois loadChapter/renderVerses farão isso.
        }

        // Renderiza os elementos HTML para todos os versículos (inicialmente ocultos)
        function renderVerses() {
            elements.content.innerHTML = ''; // Limpa conteúdo anterior
            config.versiculosNodes.forEach((verseNode, index) => {
                const verseNumber = index + 1;
                const verseIdClass = \`verse-num-\${verseNumber}\`; // Classe para identificar o par

                const strongElement = verseNode.querySelector('strong');
                let titleHTML = '';
                let textHTML = '';

                 // Clona o nó para manipular sem afetar o original em config.versiculosNodes
                 const tempDiv = verseNode.cloneNode(true);

                if (strongElement) {
                    // Pega o HTML do strong original para o título
                    titleHTML = strongElement.outerHTML;
                    // Remove o strong do nó clonado para obter o texto restante
                    const strongInTemp = tempDiv.querySelector('strong');
                    if (strongInTemp) {
                         strongInTemp.parentNode.removeChild(strongInTemp);
                    }
                }
                 // O texto restante é o innerHTML do nó clonado (sem o strong)
                 textHTML = tempDiv.innerHTML.trim();

                // Cria elemento para o TÍTULO (conteúdo do strong)
                const titleElement = document.createElement('div');
                titleElement.className = \`verse-title verse-content \${verseIdClass}\`; // Classes: estilo, controle visibilidade, identificador
                titleElement.innerHTML = titleHTML;
                elements.content.appendChild(titleElement);

                // Cria elemento para o TEXTO principal do versículo
                const textElement = document.createElement('div');
                textElement.className = \`verse-text verse-content \${verseIdClass}\`; // Classes: estilo, controle visibilidade, identificador
                textElement.innerHTML = textHTML;
                elements.content.appendChild(textElement);
            });
        }

        // Mostra o versículo atual e esconde os outros
        function showCurrentVerse() {
            const currentVerseClass = \`verse-num-\${config.versiculo}\`;
            console.log(\`Mostrando versículo: \${config.versiculo} (classe: \${currentVerseClass})\`);

            // 1. Oculta TODOS os elementos de versículo (remove .active)
            document.querySelectorAll('.verse-content').forEach(v => {
                v.classList.remove('active');
            });

            // 2. Mostra APENAS os elementos do versículo ATUAL (adiciona .active)
            const currentElements = document.querySelectorAll('.' + currentVerseClass);
            if (currentElements.length > 0) {
                currentElements.forEach(el => el.classList.add('active'));
                 // Força reflow para garantir reinício da animação
                 elements.content.offsetHeight;
            } else {
                 console.warn(\`Elementos para o versículo \${config.versiculo} não encontrados.\`);
                 // Pode ser que o capítulo esteja vazio ou houve erro no renderVerses
                 if (config.totalVersiculos === 0) {
                     elements.content.innerHTML = '<div class="verse-content active" style="margin-top: auto; margin-bottom:auto;">Capítulo vazio ou não encontrado.</div>';
                 }
            }

            // 3. Atualiza o cabeçalho e o título da janela
            const headerText = \`\${config.livro.toUpperCase()} \${config.capitulo}:\${config.versiculo}\`;
            elements.header.textContent = headerText;
            document.title = \`Slide Bíblico - \${headerText}\`;

             // 4. Atualiza botões (feito em updateNavigationButtons chamado após showCurrentVerse ou em finally)
             // updateNavigationButtons(); // Chamado após operações assíncronas ou de navegação
        }

         // Atualiza o estado (habilitado/desabilitado) dos botões de navegação
        function updateNavigationButtons() {
            // Botão Anterior: Desabilitado se for o primeiro versículo do primeiro capítulo (assumindo que o primeiro livro não tem capítulo 0)
            // TODO: Precisaria de uma lista de livros para saber qual é o primeiro livro. Por enquanto, só verifica cap 1, ver 1.
            elements.prevBtn.disabled = (config.capitulo <= 1 && config.versiculo <= 1);

            // Botão Próximo: Desabilitado se for o último versículo do capítulo ATUAL.
            // A lógica para ir ao próximo capítulo cuidará de reabilitá-lo.
            // Também desabilita se o total de versículos for 0 (capítulo vazio/erro).
            elements.nextBtn.disabled = (config.totalVersiculos === 0 || config.versiculo >= config.totalVersiculos);

            // Log de estado dos botões para debug
            // console.log(\`Botões atualizados: Prev: \${elements.prevBtn.disabled}, Next: \${elements.nextBtn.disabled}\`);
        }

        // --- Funções de Navegação ---

        function nextVerse() {
            if (config.versiculo < config.totalVersiculos) {
                config.versiculo++;
                showCurrentVerse();
                updateNavigationButtons(); // Atualiza botões após mudar versículo
            } else {
                // Se está no último versículo, tenta ir para o próximo capítulo
                nextChapter();
            }
        }

        async function nextChapter() {
            console.log("Tentando ir para o próximo capítulo...");
            config.capitulo++;
            config.versiculo = 1; // Começa no primeiro versículo do novo capítulo
            await loadChapter(); // Carrega o novo capítulo (que chamará showCurrentVerse e updateNavigationButtons)
        }

        function prevVerse() {
            if (config.versiculo > 1) {
                config.versiculo--;
                showCurrentVerse();
                updateNavigationButtons(); // Atualiza botões após mudar versículo
            } else {
                // Se está no primeiro versículo, tenta ir para o capítulo anterior
                prevChapter();
            }
        }

        async function prevChapter() {
            if (config.capitulo > 1) {
                console.log("Tentando ir para o capítulo anterior...");
                config.capitulo--;
                config.versiculo = 1; // Vai para o primeiro versículo do capítulo anterior
                // Idealmente, aqui carregaríamos o capítulo e DEPOIS definiríamos
                // config.versiculo para o ÚLTIMO versículo, mas isso requer saber
                // o total de versículos ANTES de chamar showCurrentVerse.
                // Vamos manter a simplicidade indo para o versículo 1 por enquanto.
                await loadChapter(); // Carrega o capítulo anterior
            } else {
                console.log("Já está no primeiro capítulo.");
                // O botão 'prev' já deve estar desabilitado pela updateNavigationButtons
            }
        }

        // --- Event Listeners ---
        elements.nextBtn.addEventListener('click', nextVerse);
        elements.prevBtn.addEventListener('click', prevVerse);

        // Navegação por teclado (Setas Esquerda/Direita)
        document.addEventListener('keydown', (e) => {
            // Ignora eventos se um input/textarea estiver focado (não temos aqui, mas é boa prática)
            // if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
            //     return;
            // }

            if (e.key === 'ArrowRight' || e.key === 'PageDown') {
                // Só avança se o botão não estiver desabilitado
                if (!elements.nextBtn.disabled) {
                    nextVerse();
                }
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                 // Só volta se o botão não estiver desabilitado
                if (!elements.prevBtn.disabled) {
                    prevVerse();
                }
            } else if (e.key === 'Escape') {
                // Fecha a janela com a tecla Esc
                 window.close();
             }
        });

         // Listener para fechar a janela se a janela principal for fechada (opcional)
         // window.addEventListener('beforeunload', () => {
         //    // Código para fechar esta janela slide, se necessário
         // });


        // --- Inicialização ---
        loadChapter(); // Carrega o capítulo inicial quando o script roda

    </script>
</body>
</html>
    `;

    // Escreve o conteúdo na janela
    // Usar document.write é comum aqui, mas pode ter implicações se chamado após o fechamento do fluxo inicial.
    // Abrir, escrever e fechar o documento da janela é a abordagem padrão para popups criados assim.
    window.janelaSlide.document.open();
    window.janelaSlide.document.write(slideHTML);
    window.janelaSlide.document.close(); // Essencial para finalizar o carregamento do DOM da nova janela

    // Foca na janela recém-criada ou atualizada
    window.janelaSlide.focus();
}

// Exemplo de como chamar a função (coloque isso no seu HTML principal, dentro de um script ou evento)
// Certifique-se de que os valores de livro, capítulo e versículo são válidos
// document.getElementById('botao-abrir-slide').addEventListener('click', () => {
//     abrirJanelaSlide('Genesis', 1, 1); // Exemplo: Abrir Gênesis 1:1
// });




***************************

// O bloco abaixo cria a janela de SLIDE para o data-show
function abrirJanelaSlide(livroAtual, capituloAtual, versiculoAtual) {
    if (window.janelaSlide && !window.janelaSlide.closed) {
        window.janelaSlide.focus();
        return;
    }

    const largura = window.screen.availWidth;
    const altura = window.screen.availHeight;
    const features = `width=${largura},height=${altura},menubar=no,toolbar=no,location=no,resizable=yes,scrollbars=yes`;

    window.janelaSlide = window.open('', 'JanelaSlide', features);

    const slideHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Slide Bíblico - ${livroAtual} ${capituloAtual}:${versiculoAtual}</title>
    <style>
        body {
            font-family: 'Arial Black', 'Arial Bold', Gadget, sans-serif;
            background-color: #121212;
            color: #ffffff;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            text-align: center;
            overflow: hidden;
            font-style: italic;
        }
        #watermark {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('../img/biblia.png');
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            opacity: 0.15;
            z-index: -1;
        }
        #header {
            padding: clamp(15px, 4vw, 25px) 0;
            font-size: clamp(1.8rem, 5vw, 3rem);
            color: #f1c40f;
            text-transform: uppercase;
            background-color: rgba(0,0,0,0.7);
            width: 100%;
            letter-spacing: 1.5px;
            line-height: 1.3;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            margin-bottom: 0.5rem;
        }
        #content {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: clamp(20px, 5vw, 50px);
            font-size: clamp(1.6rem, 3.2vw, 2.8rem);
            line-height: 1.7;
            max-width: 92%;
            margin: 0 auto;
            padding-bottom: 30px;
            box-sizing: border-box;
            min-height: auto;
            justify-content: flex-start;
        }
        #navigation {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 25px 0 15px 0;
            background-color: rgba(0,0,0,0.7);
            width: 100%;
            z-index: 1000;
            display: flex;
            justify-content: center;
            gap: clamp(10px, 2vw, 20px);
        }
        .nav-button {
            padding: clamp(10px, 2vw, 15px) clamp(20px, 4vw, 30px);
            font-size: clamp(1.1rem, 2.2vw, 1.4rem);
            background-color: #f1c40f;
            color: #000;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s;
            font-weight: bold;
            letter-spacing: 1px;
        }
        .verse {
            display: none;
            width: 100%;
            max-width: 1200px;
            padding: 0 20px;
        }
        .verse.active {
            display: block;
            animation: fadeIn 0.5s ease-in-out;
        }
        .verse strong {
            font-weight: bold !important;
            color: #f1c40f;
            font-style: normal;
        }
        .verse > div:first-child {
            font-size: clamp(1rem, 2.2vw, 1.4rem);
            color: #f1c40f;
            margin-bottom: 2.5rem;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-style: italic;
        }
        .fim-livro {
            color: #f1c40f !important;
            margin-top: 20px;
            font-size: clamp(1rem, 2vw, 1.2rem) !important;
            padding: 15px;
            border-top: 1px solid #f1c40f55;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
            #content {
                max-width: 95%;
                padding: 15px 10px;
                font-size: clamp(1.4rem, 4vw, 2.2rem);
            }
        }
    </style>
</head>
<body>
    <div id="watermark"></div>
    <div id="header">${livroAtual.toUpperCase()} ${capituloAtual}:${versiculoAtual}</div>
    <div id="content"></div>
    <div id="navigation">
        <button class="nav-button" id="prev-btn">‹ Anterior</button>
        <button class="nav-button" id="next-btn">Próximo ›</button>
    </div>

    <script>
        const config = {
            livro: '${livroAtual}',
            capitulo: ${capituloAtual},
            versiculo: ${versiculoAtual},
            versiculos: [],
            totalVersiculos: 0,
            ultimoCapitulo: false
        };

        const elements = {
            header: document.getElementById('header'),
            content: document.getElementById('content'),
            prevBtn: document.getElementById('prev-btn'),
            nextBtn: document.getElementById('next-btn')
        };

        async function checkNextChapter() {
            try {
                const response = await fetch('../version/arc/' + config.livro + '/' + (config.capitulo + 1) + '.html');
                return response.ok;
            } catch {
                return false;
            }
        }

        async function loadChapter() {
            try {
                elements.content.innerHTML = '<div style="padding: 20px;">Carregando...</div>';
                
                const response = await fetch('../version/arc/' + config.livro + '/' + config.capitulo + '.html');
                if (!response.ok) throw new Error('Capítulo não encontrado');
                
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                config.versiculos = Array.from(doc.querySelectorAll('[id^="versiculo-"]'));
                config.totalVersiculos = config.versiculos.length;
                
                config.ultimoCapitulo = !(await checkNextChapter());
                
                renderVerses();
                if (config.versiculo > config.totalVersiculos) config.versiculo = config.totalVersiculos;
                showCurrentVerse();
                
            } catch (error) {
                elements.content.innerHTML = \`
                    <div style="color: #e74c3c; padding: 20px;">
                        \${error.message}<br><br>
                        Livro: \${config.livro}<br>
                        Capítulo: \${config.capitulo}
                    </div>
                \`;
                config.ultimoCapitulo = true;
                updateButtons();
            }
        }

        function renderVerses() {
            elements.content.innerHTML = '';
            config.versiculos.forEach((verse, index) => {
                const verseElement = document.createElement('div');
                verseElement.className = 'verse';
                verseElement.id = 'verse-' + (index + 1);
                
                const strongElement = verse.querySelector('strong');
                let verseContent = verse.innerHTML;
                
                if (strongElement) {
                    verseContent = \`
                        <div>\${strongElement.outerHTML}</div>
                        <div>\${verse.innerHTML.replace(strongElement.outerHTML, '')}</div>
                    \`;
                }
                
                verseElement.innerHTML = verseContent;
                elements.content.appendChild(verseElement);
            });
        }

        function showCurrentVerse() {
            document.querySelectorAll('.verse').forEach(v => v.classList.remove('active'));
            const currentVerse = document.getElementById('verse-' + config.versiculo);
            if (currentVerse) {
                currentVerse.classList.add('active');
                elements.header.textContent = \`\${config.livro.toUpperCase()} \${config.capitulo}:\${config.versiculo}\`;
            }
            updateButtons();
        }

        function updateButtons() {
            elements.prevBtn.disabled = config.capitulo === 1 && config.versiculo === 1;
            elements.nextBtn.disabled = config.ultimoCapitulo && config.versiculo === config.totalVersiculos;
        }

        function nextVerse() {
            if (config.versiculo < config.totalVersiculos) {
                config.versiculo++;
                showCurrentVerse();
            } else {
                if (!config.ultimoCapitulo) {
                    nextChapter();
                } else {
                    elements.content.innerHTML += \`
                        <div class="fim-livro">
                            Fim do livro de \${config.livro}
                        </div>
                    \`;
                    elements.nextBtn.disabled = true;
                }
            }
        }

        async function nextChapter() {
            try {
                const hasNextChapter = await checkNextChapter();
                if (!hasNextChapter) throw new Error('Último capítulo deste livro');
                
                config.capitulo++;
                config.versiculo = 1;
                await loadChapter();
                
            } catch (error) {
                elements.content.innerHTML = \`
                    <div class="fim-livro">
                        \${error.message}<br>
                        Você chegou ao final do livro de \${config.livro}
                    </div>
                \`;
                config.ultimoCapitulo = true;
                updateButtons();
            }
        }

        function prevVerse() {
            if (config.versiculo > 1) {
                config.versiculo--;
                showCurrentVerse();
            } else {
                prevChapter();
            }
        }

        async function prevChapter() {
            if (config.capitulo > 1) {
                config.capitulo--;
                config.versiculo = 1;
                await loadChapter();
            }
        }

        elements.nextBtn.addEventListener('click', nextVerse);
        elements.prevBtn.addEventListener('click', prevVerse);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') nextVerse();
            if (e.key === 'ArrowLeft') prevVerse();
        });

        loadChapter();
    </script>
</body>
</html>
    `;

    window.janelaSlide.document.open();
    window.janelaSlide.document.write(slideHTML);
    window.janelaSlide.document.close();
    window.janelaSlide.focus();
}