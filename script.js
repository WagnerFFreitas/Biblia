// O bloco abaixo define o objeto "livros" que armazena informações sobre os livros da Bíblia
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
        titulo.textContent = '';

        // O trecho abaixo remove todos os botões de capítulos e versículos
        const allBookContents = content.querySelectorAll('.book-content');
        allBookContents.forEach(content => content.remove());

        // O trecho abaixo limpa o livro ativo
        activeLivro = null;
        activeCapitulo = null;
        return;
    }

    // O trecho abaixo limpa o conteúdo anterior, exceto a marca d'água
    const elementsToRemove = content.querySelectorAll('h2, .capitulos-container, .versiculo-texto, .book-content');
    elementsToRemove.forEach(element => element.remove());

    // O trecho abaixo adiciona o título do livro e os botões de capítulos
    titulo = document.createElement('h2');
    titulo.textContent = `${livro.toUpperCase()}`;
    content.appendChild(titulo);

    const capitulosContainer = document.createElement('div');
    capitulosContainer.classList.add('capitulos-container');
    capitulosContainer.appendChild(createCapitulosButtons(livro));

    content.appendChild(capitulosContainer);

    // O trecho abaixo define o livro ativo como o livro atual
    activeLivro = livro;
    activeCapitulo = null;
}

// O bloco abaixo adiciona eventos de clique aos links dos livros
document.querySelectorAll('.menu-livros a').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const livro = link.dataset.livro;
        loadBook(livro);
    });
});

// O bloco abaixo cria a função para configurar os botões de versículos
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

// O bloco abaixo cria a função para alternar o texto do versículo
function toggleVersiculoText(livro, capitulo, versiculo, button) {
    if (activeVersiculoButton === button) {
        // O trecho abaixo verifica se o botão clicado for o mesmo, caso sim, remover o texto
        const existingVersiculo = document.querySelector('.versiculo-texto');
        if (existingVersiculo) {
            existingVersiculo.remove();
        }
        activeVersiculoButton = null;
    } else {
        // O trecho abaixo verifica se e outro botão, caso sim, carregar o novo versículo
        loadVersiculo(livro, capitulo, versiculo);
        activeVersiculoButton = button;
    }
}

// O bloco abaixo cria a função para obter o número de versículos em um capítulo específico
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

// O bloco abaixo carrega a imagem da Bíblia assim que a página abre
window.onload = () => {
    const content = document.querySelector('.content');
    const watermarkContainer = document.createElement('div');
    watermarkContainer.classList.add('watermark');
    
    const img = document.createElement('img');
    img.src = 'biblia.png';
    img.alt = "Marca d'água da Bíblia";
    img.classList.add('watermark-image');
    
    watermarkContainer.appendChild(img);
    content.appendChild(watermarkContainer);
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
                /* O bloco abaixo cria o estilo do corpo da pagina do SLIDE */
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

                /* O bloco abaixo cria o estilo para os botões */
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

                /* O bloco abaixo cria o estilos para os botões ao passar o mouse */
                button:hover { 
                    background-color: black;
                    color: white;
                }

                /* O bloco abaixo cria o estilos para o container do versículo */
                #versiculo-container { 
                    display: flex;
                    justify-content: center;
                    margin-bottom: 0.63rem;
                    font-size: clamp(4rem, 8vw, 6rem);
                }

                /* O bloco abaixo configura o titulo (Livro, Capitulo Nº e versiculo nº ) */
                #titulo { 
                    font-size: 3vw;
                    margin-bottom: 1.25rem; 
                    text-align: center;
                    color: #f1c40f;
                }
                
                /* O bloco abaixo configura o estilo dos textos dos versiculos */
                .versiculo-texto { 
                    /*text-align: justify;*/
                    text-align: center;
                    /*font-size: clamp(3rem, 4vw, 8rem);*/
                    font-size: 5vw;
                    max-width: 100vw;
                    overflow-wrap: break-word;
                }

                /* O bloco abaixo configura o estilo do titulo dos versiculos */
                #versiculo-container strong { 
                    color: #5df565;
                    font-size: 3.5vw;
                    margin-top: 0.63rem;
                    display: block;
                }
                
                /* O bloco abaixo coloca a imagem de fundo em marca d'água */
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

                /* O bloco abaixo configura o estilos para o container dos botões */
                #botao-container {
                    position: absolute;
                    bottom: 2rem;
                    left: 2.5rem;
                    display: flex;
                    gap: 0.63rem;
                }

                /* O bloco abaixo configura o estilos para os botões "voltar" e "próximo" */
                #voltar-botao,
                #proximo-botao {
                    background-color: white;
                    border: none;
                    padding: 0.5rem 1.5rem;
                    font-size: 1.5rem;
                    font-weight: 900;
                    font-style: italic;
                    position: relative;
                    display: inline-block;
                    text-align: center;
                    transition: background-color 0.3s ease, color 0.3s ease;
                }

                /* O bloco abaixo cria o estilos para os botões "voltar" e "próximo" ao passar o mouse */
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
                    border-width: 45px;
                    transition: border-color 0.3s ease; 
                }

                /* O bloco abaixo configura o estilos para a seta do botão "voltar" */
                #voltar-botao::before {
                    left: -85px;
                    border-color: transparent white transparent transparent;
                }

                /* O bloco abaixo configura o estilos para a seta do botão "próximo" */
                #proximo-botao::after {
                    right: -75px;
                    border-color: transparent transparent transparent white;
                }

                /* O bloco abaixo cria o estilos para a seta "voltar" ao passar o mouse */
                #voltar-botao:hover::before {
                    border-color: transparent black transparent transparent;
                }

                /* O bloco abaixo cria o estilos para a seta "próximo" ao passar o mouse */
                #proximo-botao:hover::after {
                    border-color: transparent transparent transparent black;
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

// O bloco abaixo adiciona o evento de clique ao link "Slide" na janela principal
document.querySelector('header nav ul li:first-child a').addEventListener('click', (event) => {
    event.preventDefault();
    abrirJanelaSlide(activeLivro, activeCapitulo, activeVersiculoButton ? activeVersiculoButton.textContent.trim() : 1);
});
