// Está funcionando todos os botões e as opções do menu dos livros 06/09/24 12:24
// Objeto que contém os livros e capítulos


const livros = {
    "genesis": {
        "capitulos": 50
    },
    "exodo": {
        "capitulos": 40
    },
    "levitico": {
        "capitulos": 27
    },
    "numeros": {
        "capitulos": 36
    },
    "deuteronomio": {
        "capitulos": 34
    },
    "josue": {
        "capitulos": 24
    },
    "juizes": {
        "capitulos": 21
    },
    "rute": {
        "capitulos": 4
    },
    "1samuel": {
        "capitulos": 31
    },
    "2samuel": {
        "capitulos": 24
    },
    "1reis": {
        "capitulos": 22
    },
    "2reis": {
        "capitulos": 25
    },
    "1cronicas": {
        "capitulos": 29
    },
    "2cronicas": {
        "capitulos": 36
    },
    "esdras": {
        "capitulos": 10
    },
    "neemia": {
        "capitulos": 13
    },
    "ester": {
        "capitulos": 10
    },
    "jovem": {
        "capitulos": 42
    },
    "salmos": {
        "capitulos": 150
    },
    "provérbios": {
        "capitulos": 31
    },
    "eclesiastes": {
        "capitulos": 12
    },
    "cantares": {
        "capitulos": 8
    },
    "isaías": {
        "capitulos": 66
    },
    "jeremias": {
        "capitulos": 52
    },
    "lamentações": {
        "capitulos": 5
    },
    "ezequiel": {
        "capitulos": 48
    },
    "daniel": {
        "capitulos": 12
    },
    "oséias": {
        "capitulos": 14
    },
    "joel": {
        "capitulos": 3
    },
    "amós": {
        "capitulos": 9
    },
    "abdias": {
        "capitulos": 1
    },
    "jonas": {
        "capitulos": 4
    },
    "miqueias": {
        "capitulos": 7
    },
    "naum": {
        "capitulos": 3
    },
    "habacuque": {
        "capitulos": 3
    },
    "safonias": {
        "capitulos": 3
    },
    "ageu": {
        "capitulos": 2
    },
    "zacarias": {
        "capitulos": 14
    },
    "malaquias": {
        "capitulos": 4
    },
    "mateus": {
        "capitulos": 28
    },
    "marcos": {
        "capitulos": 16
    },
    "lucas": {
        "capitulos": 24
    },
    "joão": {
        "capitulos": 21
    },
    "atos": {
        "capitulos": 28
    },
    "romanos": {
        "capitulos": 16
    },
    "1corintios": {
        "capitulos": 16
    },
    "2corintios": {
        "capitulos": 13
    },
    "gálatas": {
        "capitulos": 6
    },
    "efésios": {
        "capitulos": 6
    },
    "filipenses": {
        "capitulos": 4
    },
    "colossenses": {
        "capitulos": 4
    },
    "1tessalonicenses": {
        "capitulos": 5
    },
    "2tessalonicenses": {
        "capitulos": 3
    },
    "1timóteo": {
        "capitulos": 6
    },
    "2timóteo": {
        "capitulos": 4
    },
    "tito": {
        "capitulos": 3
    },
    "filemom": {
        "capitulos": 1
    },
    "hebreus": {
        "capitulos": 13
    },
    "tiago": {
        "capitulos": 5
    },
    "1pedro": {
        "capitulos": 5
    },
    "2pedro": {
        "capitulos": 3
    },
    "1joão": {
        "capitulos": 5
    },
    "2joão": {
        "capitulos": 1
    },
    "3joão": {
        "capitulos": 1
    },
    "jude": {
        "capitulos": 1
    },
    "apocalipse": {
        "capitulos": 22
    }
};

// O bloco abaixo cria as variáveis globais para o elemento H2, livro ativo e botões de versículos ativo
let titulo = null;
let activeVersiculoButton = null;
let activeLivro = null;
let activeCapitulo = null;

// O bloco abaixo cria a função para configurar os botões dos capítulos
function createCapitulosButtons(livro) {
    const capitulos = livros[livro].capitulos;
    const capitulosContainer = document.createElement('div');
    capitulosContainer.classList.add('capitulos');

    for (let i = 1; i <= capitulos; i++) {
        const button = document.createElement('button');
        button.textContent = `${i}`;
        button.classList.add('botao-capitulo');
        button.addEventListener('click', () => {
            toggleVersiculos(livro, i);
        });
        capitulosContainer.appendChild(button);
    }
    return capitulosContainer;
}

// O bloco abaixo cria a função para carregar o conteúdo de um versículo específico
async function loadVersiculo(livro, capitulo, versiculo) {
    const response = await fetch(`${livro}/${capitulo}.html`);
    const html = await response.text();
        
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const versiculoContent = tempDiv.querySelector(`#versiculo-${versiculo}`);
    const content = document.querySelector('.content');

    // O trecho abaixo remove qualquer texto de versículo existente
    const existingVersiculo = content.querySelector('.versiculo-texto');
    if (existingVersiculo) {
        existingVersiculo.remove();
    }

    const versiculoElement = document.createElement('div');
    versiculoElement.classList.add('versiculo', 'versiculo-texto');
    if (versiculoContent) {
        versiculoElement.appendChild(versiculoContent);
    } else {
        versiculoElement.textContent = 'Versículo não encontrado.';
    }

    content.appendChild(versiculoElement);
    titulo.textContent = `${livro.toUpperCase()} - CAPÍTULO ${capitulo} - VERSÍCULO ${versiculo}`;
}

// O bloco abaixo cria a função para exibir/ocultar os versículos
function toggleVersiculos(livro, capitulo) {
    const content = document.querySelector('.content');
    
    // O trecho abaixo procura por elementos dos versículos ou capítulos existentes
    const existingVersiculos = content.querySelector(`.versiculos-${livro}-${capitulo}`);
    const allVersiculos = content.querySelectorAll('.book-content');

    // O trecho abaixo verifica se os versículos já estiverem visíveis, removê-los ao clicar novamente
    if (existingVersiculos) {
        existingVersiculos.remove();
        
        // O trecho abaixo remove o texto do versículo se os versículos forem recolhidos
        const existingVersiculo = content.querySelector('.versiculo-texto');
        if (existingVersiculo) {
            existingVersiculo.remove();
        }
    } else {
        // O trecho abaixo remove qualquer exibição anterior de capítulos e versículos
        allVersiculos.forEach(versiculo => versiculo.remove());

        // O trecho abaixo remove o texto do versículo quando um novo capítulo é clicado
        const existingVersiculo = content.querySelector('.versiculo-texto');
        if (existingVersiculo) {
            existingVersiculo.remove();
        }

        // O trecho abaixo adiciona os versículos do novo capítulo
        const bookContent = document.createElement('div');
        bookContent.classList.add('book-content', `versiculos-${livro}-${capitulo}`);
        titulo.textContent = `${livro.toUpperCase()} - CAPÍTULO ${capitulo}`;
        bookContent.appendChild(createVersiculosButtons(livro, capitulo));
        content.appendChild(bookContent);
        
        // A linha abaixo atualiza o capítulo ativo
        activeCapitulo = capitulo;
    }
}

// O bloco abaixo cria a função para carregar o livro
function loadBook(livro) {
    const content = document.querySelector('.content');

    // O trecho abaixo verifica se o livro clicado é o mesmo que está ativo
    if (activeLivro === livro) {
        // O trecho abaixo verifica se e o mesmo livro, remove apenas os capítulos e versículos, mantendo a marca d'água
        const capitulosContainer = content.querySelector('.capitulos-container');
        const versiculoTexto = content.querySelector('.versiculo-texto');
        if (capitulosContainer) {
            capitulosContainer.remove();
        }
        if (versiculoTexto) {
            versiculoTexto.remove();
        }
        titulo.textContent = ''; // Limpa o título do livro

        // O trecho abaixo remove todos os botões de capítulos e versículos
        const allBookContents = content.querySelectorAll('.book-content');
        allBookContents.forEach(content => content.remove());

        // O trecho abaixo limpa o livro ativo
        activeLivro = null;
        activeCapitulo = null;
        return;
    }

    // Limpa o conteúdo anterior, exceto a marca d'água
    const elementsToRemove = content.querySelectorAll('h2, .capitulos-container, .versiculo-texto, .book-content');
    elementsToRemove.forEach(element => element.remove());

    // Adiciona o título do livro e os botões de capítulos
    titulo = document.createElement('h2');
    titulo.textContent = `${livro.toUpperCase()}`;
    content.appendChild(titulo);

    const capitulosContainer = document.createElement('div');
    capitulosContainer.classList.add('capitulos-container');
    capitulosContainer.appendChild(createCapitulosButtons(livro));

    content.appendChild(capitulosContainer);

    // Define o livro ativo como o livro atual
    activeLivro = livro;
    activeCapitulo = null; // Reseta o capítulo ativo quando o livro muda
}

// Adiciona eventos de clique aos links dos livros
document.querySelectorAll('.menu-livros a').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const livro = link.dataset.livro;
        loadBook(livro);
    });
});

// Função para configurar os botões de versículos
function createVersiculosButtons(livro, capitulo) {
    const versiculosContainer = document.createElement('div');
    versiculosContainer.classList.add('versiculos');

    const numVersiculos = getNumVersiculos(livro, capitulo);
    for (let i = 1; i <= numVersiculos; i++) {
        const button = document.createElement('button');
        button.textContent = ` ${i}`;
        button.classList.add('botao-versiculo');
        button.addEventListener('click', () => {
            toggleVersiculoText(livro, capitulo, i, button);
        });
        versiculosContainer.appendChild(button);
    }
    return versiculosContainer;
}

// Função para alternar o texto do versículo
function toggleVersiculoText(livro, capitulo, versiculo, button) {
    if (activeVersiculoButton === button) {
        // Se o botão clicado for o mesmo, remover o texto
        const existingVersiculo = document.querySelector('.versiculo-texto');
        if (existingVersiculo) {
            existingVersiculo.remove();
        }
        activeVersiculoButton = null;
    } else {
        // Se for outro botão, carregar o novo versículo
        loadVersiculo(livro, capitulo, versiculo);
        activeVersiculoButton = button;
    }
}

// Função para obter o número de versículos em um capítulo específico
function getNumVersiculos(livro, capitulo) {
    const versiculosPorCapitulo = {
        "genesis": {
            1: 31,
            2: 25,
            3: 24,
            4: 26,
            5: 32,
            6: 22,
            7: 24,
            8: 22,
            9: 29,
            10: 32,
            11: 32,
            12: 20,
            13: 18,
            14: 24,
            15: 21,
            16: 16,
            17: 27,
            18: 33,
            19: 38,
            20: 18,
            21: 34,
            22: 24,
            23: 20,
            24: 67,
            25: 34,
            26: 35,
            27: 46,
            28: 22,
            29: 35,
            30: 43,
            31: 55,
            32: 32,
            33: 20,
            34: 31,
            35: 29,
            36: 43,
            37: 36,
            38: 30,
            39: 23,
            40: 23,
            41: 57,
            42: 38,
            43: 34,
            44: 34,
            45: 28,
            46: 34,
            47: 31,
            48: 22,
            49: 33,
            50: 26
        },                                                                                           
        // Adicione outros livros conforme necessário
    };
    return versiculosPorCapitulo[livro]?.[capitulo] || 0;
};

// Carrega a imagem da Bíblia assim que a página abre
window.onload = () => {
    const content = document.querySelector('.content'); // Seleciona o elemento com a classe '.content'
    const watermarkContainer = document.createElement('div'); // configura um novo elemento 'div'
    watermarkContainer.classList.add('watermark'); // Adiciona a classe 'watermark' ao 'div'
    
    const img = document.createElement('img'); // configura um novo elemento de imagem
    img.src = 'biblia.png'; // Define o caminho da imagem (certifique-se de que está correto)
    img.alt = "Marca d'água da Bíblia"; // Adiciona um texto alternativo
    img.classList.add('watermark-image'); // Adiciona uma classe para estilizar a imagem
    
    watermarkContainer.appendChild(img); // Insere a imagem dentro do container 'watermark'
    content.appendChild(watermarkContainer); // Adiciona o container 'watermark' à página
};

// O bloco abaixo cria a janela de SLIDE para o data-show
function abrirJanelaSlide(livroAtual, capituloAtual, versiculoAtual) {
    if (window.janelaSlide && !window.janelaSlide.closed) {
        window.janelaSlide.focus();
        return;
    }

    const largura = window.screen.availWidth;
    const altura = window.screen.availHeight;

    window.janelaSlide = window.open('', 'JanelaSlide', `width=${largura},height=${altura}`);

    window.janelaSlide.document.open();
    window.janelaSlide.document.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <title>Janela Slide</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { 
                    font-family: sans-serif; 
                    padding: 1.25rem;
                    background-color: #181818;
                    color: white; 
                    position: relative; 
                    margin-top: -2.5rem;
                    margin-left: 0;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    font-style: italic;
                    font-weight: bold;
                }
                button { 
                    padding: 0.63rem 1.25rem; 
                    font-size: clamp(1rem, 2vw + 0.5rem, 1.5rem);
                    background-color: white;
                    color: black; 
                    border: none; 
                    cursor: pointer; 
                    position: relative;
                    transition: background-color 0.3s ease, color 0.3s ease; /* Transição suave */
                }
                button:hover { 
                    background-color: black;
                    color: white;
                }
                #versiculo-container { 
                    display: flex;
                    justify-content: center;
                    margin-bottom: 0.63rem;
                    font-size: clamp(4rem, 8vw, 6rem);
                }

                /* Este bloco configura o titulo (Livro, Capitulo Nº e versiculo nº ) */
                #titulo { 
                    font-size: clamp(2rem, 6vw, 3rem);
                    margin-bottom: 1.25rem; 
                    text-align: center;
                    color: #f1c40f;
                }
                
                /* Este bloco configura o estilo dos textos dos versiculos */
                .versiculo-texto { 
                    text-align: center;
                    font-size: clamp(4rem, 5vw, 7rem);
                    max-width: 100vw;
                    overflow-wrap: break-word;
                }

                /* Este bloco configura o estilo do titulo dos versiculos */
                #versiculo-container strong { 
                    color: #5df565;
                    font-size: clamp(2rem, 4vw, 3rem);
                    margin-top: 0.63rem;
                    display: block;
                }
                
                /* Este bloco coloca a imagem de fundo em marca d'água */
                #watermark {
                    position: fixed;
                    top: 0; 
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: url('biblia.png'); 
                    opacity: 0.3;
                    z-index: 10;
                    pointer-events: none;
                    overflow: hidden;
                    background-size: cover;
                    background-repeat: no-repeat;
                    background-position: center;
                }

                #botao-container {
                    position: absolute;
                    bottom: 2rem;
                    left: 2.5rem;
                    display: flex;
                    gap: 0.63rem;
                }

                #voltar-botao,
                #proximo-botao {
                    background-color: white;
                    border: none;
                    padding: 0.5rem 1.5rem;
                    font-size: 1.5rem;
                    font-weight: bold;
                    position: relative;
                    display: inline-block;
                    text-align: center;
                    transition: background-color 0.3s ease, color 0.3s ease;
                }

                #voltar-botao:hover,
                #proximo-botao:hover {
                    background-color: black;
                    color: white;
                }

                /* Este bloc configura as pontas da setas */
                #voltar-botao::before,
                #proximo-botao::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 0;
                    height: 0;
                    border-style: solid;
                    border-width: 45px;
                    transition: border-color 0.3s ease; 
                }

                #voltar-botao::before {
                    left: -85px;
                    border-color: transparent white transparent transparent;
                }

                #proximo-botao::after {
                    right: -75px;
                    border-color: transparent transparent transparent white;
                    
                }
                /* Efeito hover nas setas */
                #voltar-botao:hover::before {
                    border-color: transparent black transparent transparent; /* Muda a cor da seta ao passar o mouse */
                }

                #proximo-botao:hover::after {
                    border-color: transparent transparent transparent black; /* Muda a cor da seta ao passar o mouse */
                }
                
                /* Para resolução 1366x768 */
                @media (max-width: 1366px) {
                    #titulo {
                        font-size: 3rem;
                    }

                    .versiculo-texto {
                        font-size: 3.8rem;
                    }

                    #botao-container {
                        bottom: 1.5rem;
                        left: 1rem;
                    }

                    #voltar-botao,
                    #proximo-botao {
                        padding: 0.4rem 1rem;
                        font-size: 1.5rem;
                    }

                    #versiculo-container {
                        font-size: clamp(3rem, 6vw, 5rem);
                    }
                }

                /* Para resolução 1920x1080 */
                @media (min-width: 1367px) {
                    #titulo {
                        font-size: clamp(4rem, 3vw + 1rem, 5rem);
                    }

                    .versiculo-texto {
                        font-size: clamp(5rem, 3vw + 1rem, 6rem);
                    }

                    button {
                        padding: 20px 40px;
                        font-size: 3rem;
                    }
                }

                /* Para dispositivos móveis (telas menores que 768px) */
                @media (max-width: 768px) {
                    #titulo {
                        font-size: clamp(2rem, 5vw, 3rem);
                    }

                    .versiculo-texto {
                        font-size: clamp(3rem, 5vw, 4rem);
                    }

                    #botao-container {
                        flex-direction: column; /* Altera para coluna em telas pequenas */
                        bottom: 1rem;
                        left: 0;
                    }

                    button {
                        padding: 15px 30px; /* Ajuste de padding para botões */
                        font-size: 2rem; /* Ajuste de tamanho de fonte para botões */
                    }
                }

                /* Estilos para dispositivos móveis */
                @media (max-width: 360px) {
                    body {
                        background-color: lightblue;
                    }

                    .versiculo-texto {
                        font-size: clamp(2rem, 5vw, 3rem);
                    }

                    button {
                        font-size: 1.5rem;
                    }
                }

                @media (min-width: 361px) and (max-width: 375px) and (max-height: 667px) {
                    body {
                        background-color: lightgreen;
                    }

                    .versiculo-texto {
                        font-size: clamp(3rem, 5vw, 4rem);
                    }

                    button {
                        font-size: 2rem;
                    }
                }

                @media (max-width: 360px) and (max-height: 720px) {
                    body {
                        background-color: lightcoral;
                    }

                    .versiculo-texto {
                        font-size: clamp(2rem, 5vw, 3rem);
                    }

                    button {
                        font-size: 1.5rem;
                    }
                }

                @media (min-width: 375px) and (max-width: 375px) and (max-height: 812px) {
                    body {
                        background-color: lightgoldenrodyellow;
                    }

                    .versiculo-texto {
                        font-size: clamp(3rem, 5vw, 4rem);
                    }

                    button {
                        font-size: 2rem;
                    }
                }

                @media (min-width: 411px) and (max-width: 411px) and (max-height: 731px) {
                    body {
                        background-color: lightpink;
                    }

                    .versiculo-texto {
                        font-size: clamp(3rem, 5vw, 4rem);
                    }

                    button {
                        font-size: 2rem;
                    }
                }

                /* Estilos para tablets */
                @media (min-width: 768px) and (max-width: 768px) and (max-height: 1024px) {
                    body {
                        background-color: lightseagreen;
                    }

                    .versiculo-texto {
                        font-size: clamp(4rem, 5vw, 5rem);
                    }

                    button {
                        font-size: 2.5rem;
                    }
                }

                /* Estilos para portáteis */
                @media (min-width: 1366px) and (max-width: 1366px) and (max-height: 768px) {
                    body {
                        background-color: lightsalmon;
                    }

                    .versiculo-texto {
                        font-size: clamp(5rem, 3vw + 1rem, 6rem);
                    }

                    button {
                        font-size: 2.5rem;
                    }
                }

                /* Estilos para desktops de alta resolução */
                @media (min-width: 1920px) {
                    body {
                        background-color: lightgray;
                    }

                    .versiculo-texto {
                        font-size: clamp(5rem, 3vw + 1rem, 6rem);
                    }

                    button {
                        font-size: 3rem;
                    }
                }
            </style>
        </head>
        <body>
            <div id="watermark"></div>
            <div id="titulo">${livroAtual.toUpperCase()} - CAPÍTULO ${capituloAtual} - VERSÍCULO ${versiculoAtual}</div>
            <div id="versiculo-container"><div class="versiculo-texto">Carregando...</div></div>
            <div id="botao-container">
                <button id="voltar-botao">VOLTAR</button>
                <button id="proximo-botao">PRÓXIMO</button>
            </div>
            <script>
                let capituloAtual = ${capituloAtual};
                let versiculoAtual = ${versiculoAtual};
                const versiculosPorCapitulo = [31, 25, 24, 26, 32, 22, 24, 22, 21, 32, 24, 20, 18, 31, 21, 30, 27, 32, 25, 18, 34, 31, 20, 67, 18];
                const livroAtual = '${livroAtual}';
                let capituloConteudo = '';

                function carregarCapitulo(capitulo) {
                    fetch(livroAtual + '/' + capitulo + '.html')
                        .then(response => response.text())
                        .then(text => {
                            capituloConteudo = text;
                            carregarVersiculo(versiculoAtual);
                        })
                        .catch(error => {
                            console.error('Erro ao carregar o capítulo:', error);
                            document.getElementById('versiculo-container').innerHTML = '<div class="versiculo-texto">Erro ao carregar capítulo</div>';
                        });
                }

                function carregarVersiculo(versiculo) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(capituloConteudo, 'text/html');
                    const versiculoElemento = doc.querySelector('#versiculo-' + versiculo);

                    if (versiculoElemento) {
                        const versiculoContainer = document.getElementById('versiculo-container');
                        // Preserva as quebras de linha
                        versiculoContainer.innerHTML = \`<div class="versiculo-texto">\${versiculoElemento.innerHTML.replace(/\\n/g, '<br>')}</div>\`;
                        document.getElementById('titulo').innerText = \`\${livroAtual.toUpperCase()} - CAPÍTULO \${capituloAtual} - VERSÍCULO \${versiculo}\`;
                    } else {
                        document.getElementById('versiculo-container').innerHTML = '<div class="versiculo-texto">Versículo não encontrado.</div>';
                    }
                }

                function proximoVersiculo() {
                    versiculoAtual++;
                    if (versiculoAtual > versiculosPorCapitulo[capituloAtual - 1]) {
                        versiculoAtual = 1;
                        capituloAtual++;
                        if (capituloAtual <= versiculosPorCapitulo.length) {
                            carregarCapitulo(capituloAtual);
                        } else {
                            document.getElementById('versiculo-container').innerHTML = '<div class="versiculo-texto">Fim do livro.</div>';
                        }
                    } else {
                        carregarVersiculo(versiculoAtual);
                    }
                }

                function voltarVersiculo() {
                    versiculoAtual--;
                    if (versiculoAtual < 1) {
                        versiculoAtual = versiculosPorCapitulo[capituloAtual - 1];
                    }
                    carregarVersiculo(versiculoAtual);
                }

                document.getElementById('proximo-botao').addEventListener('click', proximoVersiculo);
                document.getElementById('voltar-botao').addEventListener('click', voltarVersiculo);

                carregarCapitulo(capituloAtual);
            </script>
        </body>
        </html>
    `);
    window.janelaSlide.document.close();
}

// O trecho abaixo adiciona o evento de clique ao link "Slide" na janela principal
document.querySelector('header nav ul li:first-child a').addEventListener('click', (event) => {
    event.preventDefault();
    abrirJanelaSlide(activeLivro, activeCapitulo, activeVersiculoButton ? activeVersiculoButton.textContent.trim() : 1);
});
