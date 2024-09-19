
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


// Variável global para o elemento h2, livro ativo e botão de versículo ativo
let titulo = null;
let activeVersiculoButton = null;
let activeLivro = null;
let activeCapitulo = null; // Nova variável para rastrear o capítulo ativo

// Função para criar os botões de capítulos
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

// Função para carregar o conteúdo de um versículo específico
async function loadVersiculo(livro, capitulo, versiculo) {
    const response = await fetch(`${livro}/${capitulo}.html`);
    const html = await response.text();
        
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const versiculoContent = tempDiv.querySelector(`#versiculo-${versiculo}`);
    const content = document.querySelector('.content');

    // Remove qualquer texto de versículo existente
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

// Função para exibir/ocultar os versículos
function toggleVersiculos(livro, capitulo) {
    const content = document.querySelector('.content');
    
    // Procura por elementos de versículos ou capítulos existentes
    const existingVersiculos = content.querySelector(`.versiculos-${livro}-${capitulo}`);
    const allVersiculos = content.querySelectorAll('.book-content');

    // Se os versículos já estiverem visíveis, removê-los ao clicar novamente
    if (existingVersiculos) {
        existingVersiculos.remove();
        
        // Remove o texto do versículo se os versículos forem recolhidos
        const existingVersiculo = content.querySelector('.versiculo-texto');
        if (existingVersiculo) {
            existingVersiculo.remove();
        }
    } else {
        // Remove qualquer exibição anterior de capítulos e versículos
        allVersiculos.forEach(versiculo => versiculo.remove());

        // Remove o texto do versículo quando um novo capítulo é clicado
        const existingVersiculo = content.querySelector('.versiculo-texto');
        if (existingVersiculo) {
            existingVersiculo.remove();
        }

        // Adiciona os versículos do novo capítulo
        const bookContent = document.createElement('div');
        bookContent.classList.add('book-content', `versiculos-${livro}-${capitulo}`);
        titulo.textContent = `${livro.toUpperCase()} - CAPÍTULO ${capitulo}`;
        bookContent.appendChild(createVersiculosButtons(livro, capitulo));
        content.appendChild(bookContent);
        
        // Atualiza o capítulo ativo
        activeCapitulo = capitulo;
    }
}

// Função para carregar o livro
function loadBook(livro) {
    const content = document.querySelector('.content');

    // Verifica se o livro clicado é o mesmo que está ativo
    if (activeLivro === livro) {
        // Se for o mesmo livro, remove apenas os capítulos e versículos, mantendo a marca d'água
        const capitulosContainer = content.querySelector('.capitulos-container');
        const versiculoTexto = content.querySelector('.versiculo-texto');
        if (capitulosContainer) {
            capitulosContainer.remove();
        }
        if (versiculoTexto) {
            versiculoTexto.remove();
        }
        titulo.textContent = ''; // Limpa o título do livro

        // Remove todos os botões de capítulos e versículos
        const allBookContents = content.querySelectorAll('.book-content');
        allBookContents.forEach(content => content.remove());

        // Limpa o livro ativo
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

// Função para criar os botões de versículos
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
    const watermarkContainer = document.createElement('div'); // Cria um novo elemento 'div'
    watermarkContainer.classList.add('watermark'); // Adiciona a classe 'watermark' ao 'div'
    
    const img = document.createElement('img'); // Cria um novo elemento de imagem
    img.src = 'biblia.png'; // Define o caminho da imagem (certifique-se de que está correto)
    img.alt = "Marca d'água da Bíblia"; // Adiciona um texto alternativo
    img.classList.add('watermark-image'); // Adiciona uma classe para estilizar a imagem
    
    watermarkContainer.appendChild(img); // Insere a imagem dentro do container 'watermark'
    content.appendChild(watermarkContainer); // Adiciona o container 'watermark' à página
};
//----------------

function abrirJanelaSlide(livroAtual, capituloAtual, versiculoAtual) {
    if (window.janelaSlide && !window.janelaSlide.closed) {
        window.janelaSlide.focus();
        return;
    }

    // Obtém a largura e altura da tela
    const largura = window.screen.availWidth;
    const altura = window.screen.availHeight;

    window.janelaSlide = window.open('', 'JanelaSlide', `width=${largura},height=${altura}`);

    window.janelaSlide.document.open();
    window.janelaSlide.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Janela Slide</title>
            <style>
                body { 
                    font-family: sans-serif; 
                    padding: 20px;
                    background-color: black; 
                    color: white; 
                    position: relative; 
                    margin-top: -40px;*/
                    margin-left: 80px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column; /* Direção da coluna */
                    justify-content: center; /* Centraliza verticalmente */
                    align-items: center; /* Centraliza horizontalmente */
                    height: 100vh; /* Altura total da janela */
                    font-style: italic;
                    font-weight: bold;
                }
                button { 
                    padding: 10px 20px; 
                    font-size: 16px; 
                    background-color: #444; 
                    color: white; 
                    border: none; 
                    cursor: pointer; 
                }
                button:hover { 
                    background-color: #666; 
                }
                #versiculo-container { 
                    display: flex;
                    justify-content: center; /* Centraliza o container */
                    margin-bottom: 10px;
                    font-size: 100px; /* Tamanho do texto do versículo */
                    line-height: 1;  
                }
                #titulo { 
                    font-size: 45px;
                    margin-bottom: 20px; 
                    text-align: center;
                }
                .versiculo-texto { 
                    text-align: center; /* Alinha o texto do versículo à esquerda */
                    font-size: 100px;
                }
                #versiculo-container strong { 
                    color: #5df565;
                    font-size: 50px;
                    margin-top: 10px;
                    display: block; /* Faz com que o strong ocupe toda a largura do container */
                }
                #watermark {
                    position: fixed;
                    top: -500px; 
                    left: 0;
                    width: 100%;
                    height: 170%;
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
                    position: absolute; /* Para posicionar em relação ao body */
                    bottom: 60px; /* Distância do fundo */
                    left: 20px; /* Distância da esquerda */
                    display: flex; /* Para colocar os botões lado a lado */
                    gap: 10px; /* Espaçamento entre os botões */
                }
            </style>
        </head>
        <body>
            <div id="watermark"></div>
            <div id="titulo">${livroAtual.toUpperCase()} - CAPÍTULO ${capituloAtual} - VERSÍCULO ${versiculoAtual}</div>
            <div id="versiculo-container"><div class="versiculo-texto">Carregando...</div></div>
            <div id="botao-container">
                <button id="voltar-botao">Voltar</button>
                <button id="proximo-botao">Próximo</button>
            </div>
            <script>
                let capituloAtual = ${capituloAtual}; // Recebe o capítulo atual
                let versiculoAtual = ${versiculoAtual}; // Recebe o versículo atual
                const versiculosPorCapitulo = [31, 25, 24, 26, 32, 22, 24, 22, 21, 32, 24, 20, 18, 31, 21, 30, 27, 32, 25, 18, 34, 31, 20, 67, 18]; // Exemplo para Gênesis
                const livroAtual = '${livroAtual}'; // Recebe o livro atual
                let capituloConteudo = ''; // Armazenará o conteúdo HTML do capítulo carregado

                function carregarCapitulo(capitulo) {
                    fetch(livroAtual + '/' + capitulo + '.html')
                        .then(response => response.text())
                        .then(text => {
                            capituloConteudo = text; // Armazena o conteúdo do capítulo
                            carregarVersiculo(versiculoAtual); // Exibe o versículo atual
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
                        document.getElementById('versiculo-container').innerHTML = \`<div class="versiculo-texto">\${versiculoElemento.innerHTML}</div>\`;
                        document.getElementById('titulo').innerText = \`\${livroAtual.toUpperCase()} - CAPÍTULO \${capituloAtual} - VERSÍCULO \${versiculo}\`; // Atualiza o título
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
                            carregarCapitulo(capituloAtual); // Avança para o próximo capítulo
                        } else {
                            document.getElementById('versiculo-container').innerHTML = '<div class="versiculo-texto">Fim do livro.</div>';
                        }
                    } else {
                        carregarVersiculo(versiculoAtual); // Avança para o próximo versículo
                    }
                }

                function voltarVersiculo() {
                    versiculoAtual--;

                    if (versiculoAtual < 1) {
                        versiculoAtual = versiculosPorCapitulo[capituloAtual - 1]; // Volta para o último versículo do capítulo
                    }
                    carregarVersiculo(versiculoAtual); // Carrega o versículo anterior
                }

                document.getElementById('proximo-botao').addEventListener('click', proximoVersiculo);
                document.getElementById('voltar-botao').addEventListener('click', voltarVersiculo);

                carregarCapitulo(capituloAtual); // Carrega o capítulo inicial
            </script>
        </body>
        </html>
    `);
    window.janelaSlide.document.close();
}

// Adiciona o evento de clique ao link "Slide" na janela principal
document.querySelector('header nav ul li:first-child a').addEventListener('click', (event) => {
    event.preventDefault();
    abrirJanelaSlide(activeLivro, activeCapitulo, activeVersiculoButton ? activeVersiculoButton.textContent.trim() : 1);
});

//-----



/* o vericulo não fica no centro da janela 19/09/24 18:52
function abrirJanelaSlide(livroAtual, capituloAtual, versiculoAtual) {
    if (window.janelaSlide && !window.janelaSlide.closed) {
        window.janelaSlide.focus();
        return;
    }

    // Obtém a largura e altura da tela
    const largura = window.screen.availWidth;
    const altura = window.screen.availHeight;

    window.janelaSlide = window.open('', 'JanelaSlide', `width=${largura},height=${altura}`);

    window.janelaSlide.document.open();
    window.janelaSlide.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Janela Slide</title>
            <style>
                body { 
                    font-family: sans-serif; 
                    padding: 20px;
                    background-color: black; 
                    color: white; 
                    position: relative; 
                    margin-top: -180px;
                    margin-left: 80px;
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
                    padding: 10px 20px; 
                    font-size: 16px; 
                    background-color: #444; 
                    color: white; 
                    border: none; 
                    cursor: pointer; 
                }
                button:hover { 
                    background-color: #666; 
                }
                #versiculo-container { 
                    flex-wrap: wrap;
                    line-height: 1;  
                    margin-top: -5px;
                    justify-content: center;                    
                    font-size: 100px;
                    display: flex;
                    margin-bottom: 10px;
                    
                    
                }
                #titulo { 
                    
                    font-size: 45px;
                    margin-bottom: 20px; 
                    text-align: center;
                }
                #versiculo-container strong { 
                    color: #5df565;
                    font-size: 50px;
                    margin-top: 10px;
                    margin-left: 450px;
                    text-align: center;
                    display: block;
                    
                }
                #watermark {
                    position: fixed;
                    top: -500px; 
                    left: 0;
                    width: 100%;
                    height: 170%;
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
                    bottom: 60px;
                    left: 20px;
                    display: flex; 
                    gap: 10px;
                }
            </style>
        </head>
        <body>
            <div id="watermark"></div>
            <div id="titulo">${livroAtual.toUpperCase()} - CAPÍTULO ${capituloAtual} - VERSÍCULO ${versiculoAtual}</div>
            <div id="versiculo-container">Carregando...</div>
            <div id="botao-container">
                <button id="voltar-botao">Voltar</button>
                <button id="proximo-botao">Próximo</button>
            </div>
            <script>
                let capituloAtual = ${capituloAtual}; // Recebe o capítulo atual
                let versiculoAtual = ${versiculoAtual}; // Recebe o versículo atual
                const versiculosPorCapitulo = [31, 25, 24, 26, 32, 22, 24, 22, 21, 32, 24, 20, 18, 31, 21, 30, 27, 32, 25, 18, 34, 31, 20, 67, 18]; // Exemplo para Gênesis
                const livroAtual = '${livroAtual}'; // Recebe o livro atual
                let capituloConteudo = ''; // Armazenará o conteúdo HTML do capítulo carregado

                function carregarCapitulo(capitulo) {
                    fetch(livroAtual + '/' + capitulo + '.html')
                        .then(response => response.text())
                        .then(text => {
                            capituloConteudo = text; // Armazena o conteúdo do capítulo
                            carregarVersiculo(versiculoAtual); // Exibe o versículo atual
                        })
                        .catch(error => {
                            console.error('Erro ao carregar o capítulo:', error);
                            document.getElementById('versiculo-container').innerHTML = 'Erro ao carregar capítulo';
                        });
                }

                function carregarVersiculo(versiculo) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(capituloConteudo, 'text/html');
                    const versiculoElemento = doc.querySelector('#versiculo-' + versiculo);

                    console.log(versiculoElemento); // Verifique se o elemento está sendo encontrado

                    if (versiculoElemento) {
                        document.getElementById('versiculo-container').innerHTML = versiculoElemento.innerHTML;
                        document.getElementById('titulo').innerText = \`\${livroAtual.toUpperCase()} - CAPÍTULO \${capituloAtual} - VERSÍCULO \${versiculo}\`; // Atualiza o título
                    } else {
                        document.getElementById('versiculo-container').innerHTML = 'Versículo não encontrado.';
                    }
                }

                function proximoVersiculo() {
                    versiculoAtual++;

                    if (versiculoAtual > versiculosPorCapitulo[capituloAtual - 1]) {
                        versiculoAtual = 1;
                        capituloAtual++;
                        if (capituloAtual <= versiculosPorCapitulo.length) {
                            carregarCapitulo(capituloAtual); // Avança para o próximo capítulo
                        } else {
                            document.getElementById('versiculo-container').innerHTML = 'Fim do livro.';
                        }
                    } else {
                        carregarVersiculo(versiculoAtual); // Avança para o próximo versículo
                    }
                }

                function voltarVersiculo() {
                    versiculoAtual--;

                    if (versiculoAtual < 1) {
                        versiculoAtual = versiculosPorCapitulo[capituloAtual - 1]; // Volta para o último versículo do capítulo
                    }
                    carregarVersiculo(versiculoAtual); // Carrega o versículo anterior
                }

                document.getElementById('proximo-botao').addEventListener('click', proximoVersiculo);
                document.getElementById('voltar-botao').addEventListener('click', voltarVersiculo);

                carregarCapitulo(capituloAtual); // Carrega o capítulo inicial
            </script>
        </body>
        </html>
    `);
    window.janelaSlide.document.close();
}

// Adiciona o evento de clique ao link "Slide" na janela principal
document.querySelector('header nav ul li:first-child a').addEventListener('click', (event) => {
    event.preventDefault();
    abrirJanelaSlide(activeLivro, activeCapitulo, activeVersiculoButton ? activeVersiculoButton.textContent.trim() : 1);
});
*/


//-------------------
/* Este bloco cria a janela SLIDE para ser usada em DATASHOW
// Ela exibe o versiculo que esta sendo exibido na janela principal,
// Foi criado os botões PROXIMO e VOLTAR para se movimentar entre os versiculo do capitulo atual
function abrirJanelaSlide(livroAtual, capituloAtual, versiculoAtual) {
    if (window.janelaSlide && !window.janelaSlide.closed) {
        window.janelaSlide.focus();
        return;
    }

    // Obtém a largura e altura da tela
    const largura = window.screen.availWidth;
    const altura = window.screen.availHeight;

    window.janelaSlide = window.open('', 'JanelaSlide', `width=${largura},height=${altura}`);

    window.janelaSlide.document.open();
    window.janelaSlide.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Janela Slide</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    padding: 20px; 
                    background-color: black; 
                    color: white; 
                    position: relative; 
                    margin: 0;
                    overflow: hidden;
                }
                button { 
                    padding: 10px 20px; 
                    font-size: 16px; 
                    margin-right: 10px; 
                    background-color: #444; 
                    color: white; 
                    border: none; 
                    cursor: pointer; 
                }
                button:hover { 
                    background-color: #666; 
                }
                #versiculo-container { 
                    margin-bottom: 20px; 
                    font-size: 2em;
                    line-height: 1.5;
                    color: white;
                }
                #titulo { 
                    font-weight: bold; 
                    font-size: 2em;
                    margin-bottom: 20px; 
                    text-align: center;
                }
                #versiculo-container strong { 
                    color: #5df565;
                    font-weight: bold;
                    font-style: italic;
                    margin-left: 135px;
                    font-size: 45px;
                    margin-top: 20px;
                    position: relative;
                    z-index: 1;
                    text-align: center;
                }
                #watermark {
                    position: fixed;
                    top: -500px; 
                    left: 0;
                    width: 100%;
                    height: 170%;
                    background-image: url('biblia.png'); 
                    opacity: 0.3;
                    z-index: 10;
                    pointer-events: none;
                    overflow: hidden;
                    background-size: cover;
                    background-repeat: no-repeat;
                    background-position: center;
                }
            </style>
        </head>
        <body>
            <div id="watermark"></div>
            <div id="titulo">${livroAtual.toUpperCase()} - CAPÍTULO ${capituloAtual} - VERSÍCULO ${versiculoAtual}</div>
            <div id="versiculo-container">Carregando...</div>
            <button id="voltar-botao">Voltar</button>
            <button id="proximo-botao">Próximo</button>
            <script>
                let capituloAtual = ${capituloAtual}; // Recebe o capítulo atual
                let versiculoAtual = ${versiculoAtual}; // Recebe o versículo atual
                const versiculosPorCapitulo = [31, 25, 24, 26, 32, 22, 24, 22, 21, 32, 24, 20, 18, 31, 21, 30, 27, 32, 25, 18, 34, 31, 20, 67, 18]; // Exemplo para Gênesis
                const livroAtual = '${livroAtual}'; // Recebe o livro atual
                let capituloConteudo = ''; // Armazenará o conteúdo HTML do capítulo carregado

                function carregarCapitulo(capitulo) {
                    fetch(livroAtual + '/' + capitulo + '.html')
                        .then(response => response.text())
                        .then(text => {
                            capituloConteudo = text; // Armazena o conteúdo do capítulo
                            carregarVersiculo(versiculoAtual); // Exibe o versículo atual
                        })
                        .catch(error => {
                            console.error('Erro ao carregar o capítulo:', error);
                            document.getElementById('versiculo-container').innerHTML = 'Erro ao carregar capítulo';
                        });
                }

                function carregarVersiculo(versiculo) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(capituloConteudo, 'text/html');
                    const versiculoElemento = doc.querySelector('#versiculo-' + versiculo);

                    console.log(versiculoElemento); // Verifique se o elemento está sendo encontrado

                    if (versiculoElemento) {
                        document.getElementById('versiculo-container').innerHTML = versiculoElemento.innerHTML;
                        document.getElementById('titulo').innerText = \`\${livroAtual.toUpperCase()} - CAPÍTULO \${capituloAtual} - VERSÍCULO \${versiculo}\`; // Atualiza o título
                    } else {
                        document.getElementById('versiculo-container').innerHTML = 'Versículo não encontrado.';
                    }
                }

                function proximoVersiculo() {
                    versiculoAtual++;

                    if (versiculoAtual > versiculosPorCapitulo[capituloAtual - 1]) {
                        versiculoAtual = 1;
                        capituloAtual++;
                        if (capituloAtual <= versiculosPorCapitulo.length) {
                            carregarCapitulo(capituloAtual); // Avança para o próximo capítulo
                        } else {
                            document.getElementById('versiculo-container').innerHTML = 'Fim do livro.';
                        }
                    } else {
                        carregarVersiculo(versiculoAtual); // Avança para o próximo versículo
                    }
                }

                function voltarVersiculo() {
                    versiculoAtual--;

                    if (versiculoAtual < 1) {
                        versiculoAtual = versiculosPorCapitulo[capituloAtual - 1]; // Volta para o último versículo do capítulo
                    }
                    carregarVersiculo(versiculoAtual); // Carrega o versículo anterior
                }

                document.getElementById('proximo-botao').addEventListener('click', proximoVersiculo);
                document.getElementById('voltar-botao').addEventListener('click', voltarVersiculo);

                carregarCapitulo(capituloAtual); // Carrega o capítulo inicial
            </script>
        </body>
        </html>
    `);
    window.janelaSlide.document.close();
}

// Adiciona o evento de clique ao link "Slide" na janela principal
document.querySelector('header nav ul li:first-child a').addEventListener('click', (event) => {
    event.preventDefault();
    abrirJanelaSlide(activeLivro, activeCapitulo, activeVersiculoButton ? activeVersiculoButton.textContent.trim() : 1);
});
*/

//------------

/* so falta o texto do versiculo
// Função para abrir a janela Slide com o versículo atual
function abrirJanelaSlide(livroAtual, capituloAtual, versiculoAtual) {
    if (window.janelaSlide && !window.janelaSlide.closed) {
        window.janelaSlide.focus();
        return;
    }

    // Obtém a largura e altura da tela
    const largura = window.screen.availWidth;
    const altura = window.screen.availHeight;

    window.janelaSlide = window.open('', 'JanelaSlide', `width=${largura},height=${altura}`);

    window.janelaSlide.document.open();
    window.janelaSlide.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Janela Slide</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    padding: 20px; 
                    background-color: black; 
                    color: white; 
                    position: relative; 
                    margin: 0; /* Remove margens padrão 
                    overflow: hidden; /* Impede rolagem 
                }
                button { 
                    padding: 10px 20px; 
                    font-size: 16px; 
                    margin-right: 10px; 
                    background-color: #444; 
                    color: white; 
                    border: none; 
                    cursor: pointer; 
                }
                button:hover { 
                    background-color: #666; 
                }
                #versiculo-container { 
                    margin-bottom: 20px; 
                }

                #titulo { 
                    font-weight: bold; 
                    font-size: 2em; /* Aumenta o tamanho do título 
                    margin-bottom: 20px; 
                    text-align: center; /* Centraliza o título 
                }
                
                .versiculos div { 
                    font-size: 1.5em; /* Aumenta o tamanho do texto dos versículos 
                    line-height: 1.5; /* Melhora a legibilidade 
                    margin: 10px 0; /* Espaçamento entre versículos 
                }
                strong { 
                    font-size: 2em; /* Aumenta o tamanho do texto forte */
                    color: yellow; /* Muda a cor do texto forte, se desejado 
                }
                button { 
                    padding: 15px 30px; 
                    font-size: 1.2em; 
                    margin: 10px; 
                    background-color: #444; 
                    color: white; 
                    border: none; 
                    border-radius: 5px; /* Arredonda os cantos dos botões
                    cursor: pointer; 
                    transition: background-color 0.3s; /* Efeito de transição 
                }
                button:hover { 
                    background-color: #666; /* Muda a cor ao passar o mouse 
                }

                .content {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 60px 0;
                    text-align: center;
                    font-size: calc(6em + 2vw); /* Ajuste para um tamanho maior 
                }

                .content p {
                                    margin: 0;
                                    padding: 0;
                                }

                .content strong {
                    font-weight: bold;
                    color: #5df565;
                    font-size: 80px; /* Aumenta o tamanho do texto forte 
                }

                #watermark {
                    position: fixed;
                    top: -500px; 
                    left: 0;
                    width: 100%;
                    height: 170%;
                    background-image: url('biblia.png'); 
                    opacity: 0.3;
                    z-index: 10;
                    pointer-events: none;
                    overflow: hidden;
                    background-size: cover;
                    background-repeat: no-repeat;
                    background-position: center;
                }
            </style>
        </head>
        <body>
            <div id="watermark"></div>
            <div id="titulo">${livroAtual.toUpperCase()} - CAPÍTULO ${capituloAtual} - VERSÍCULO ${versiculoAtual}</div>
            <div id="versiculo-container">Carregando...</div>
            <button id="voltar-botao">Voltar</button>
            <button id="proximo-botao">Próximo</button>
            <script>
                let capituloAtual = ${capituloAtual}; // Recebe o capítulo atual
                let versiculoAtual = ${versiculoAtual}; // Recebe o versículo atual
                const versiculosPorCapitulo = [31, 25, 24, 26, 32, 22, 24, 22, 21, 32, 24, 20, 18, 31, 21, 30, 27, 32, 25, 18, 34, 31, 20, 67, 18]; // Exemplo para Gênesis
                const livroAtual = '${livroAtual}'; // Recebe o livro atual
                let capituloConteudo = ''; // Armazenará o conteúdo HTML do capítulo carregado

                function carregarCapitulo(capitulo) {
                    fetch(livroAtual + '/' + capitulo + '.html')
                        .then(response => response.text())
                        .then(text => {
                            capituloConteudo = text; // Armazena o conteúdo do capítulo
                            carregarVersiculo(versiculoAtual); // Exibe o versículo atual
                        })
                        .catch(error => {
                            console.error('Erro ao carregar o capítulo:', error);
                            document.getElementById('versiculo-container').innerHTML = 'Erro ao carregar capítulo';
                        });
                }

                function carregarVersiculo(versiculo) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(capituloConteudo, 'text/html');
                    const versiculoElemento = doc.querySelector('#versiculo-' + versiculo);

                    if (versiculoElemento) {
                        document.getElementById('versiculo-container').innerHTML = versiculoElemento.innerHTML;
                        document.getElementById('titulo').innerText = \`\${livroAtual.toUpperCase()} - CAPÍTULO \${capituloAtual} - VERSÍCULO \${versiculo}\`; // Atualiza o título
                    } else {
                        document.getElementById('versiculo-container').innerHTML = 'Versículo não encontrado.';
                    }
                }

                function proximoVersiculo() {
                    versiculoAtual++;

                    if (versiculoAtual > versiculosPorCapitulo[capituloAtual - 1]) {
                        versiculoAtual = 1;
                        capituloAtual++;
                        if (capituloAtual <= versiculosPorCapitulo.length) {
                            carregarCapitulo(capituloAtual); // Avança para o próximo capítulo
                        } else {
                            document.getElementById('versiculo-container').innerHTML = 'Fim do livro.';
                        }
                    } else {
                        carregarVersiculo(versiculoAtual); // Avança para o próximo versículo
                    }
                }

                function voltarVersiculo() {
                    versiculoAtual--;

                    if (versiculoAtual < 1) {
                        versiculoAtual = versiculosPorCapitulo[capituloAtual - 1]; // Volta para o último versículo do capítulo
                    }
                    carregarVersiculo(versiculoAtual); // Carrega o versículo anterior
                }

                document.getElementById('proximo-botao').addEventListener('click', proximoVersiculo);
                document.getElementById('voltar-botao').addEventListener('click', voltarVersiculo);

                carregarCapitulo(capituloAtual); // Carrega o capítulo inicial
            </script>
        </body>
        </html>
    `);
    window.janelaSlide.document.close();
}

// Adiciona o evento de clique ao link "Slide" na janela principal
document.querySelector('header nav ul li:first-child a').addEventListener('click', (event) => {
    event.preventDefault();
    abrirJanelaSlide(activeLivro, activeCapitulo, activeVersiculoButton ? activeVersiculoButton.textContent.trim() : 1);
});


*/

//----
/* foi incluido titulo 
// Função para abrir a janela Slide com o versículo atual
function abrirJanelaSlide(livroAtual, capituloAtual, versiculoAtual) {
    if (window.janelaSlide && !window.janelaSlide.closed) {
        window.janelaSlide.focus();
        return;
    }

    window.janelaSlide = window.open('', 'JanelaSlide', 'width=500,height=600');

    window.janelaSlide.document.open();
    window.janelaSlide.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Janela Slide</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                button { padding: 10px 20px; font-size: 16px; margin-right: 10px; }
                #versiculo-container { margin-bottom: 20px; }
                #titulo { font-weight: bold; margin-bottom: 10px; }
            </style>
        </head>
        <body>
            <div id="titulo">${livroAtual.toUpperCase()} - CAPÍTULO ${capituloAtual} - VERSÍCULO ${versiculoAtual}</div>
            <div id="versiculo-container">Carregando...</div>
            <button id="voltar-botao">Voltar</button>
            <button id="proximo-botao">Próximo</button>
            <script>
                let capituloAtual = ${capituloAtual}; // Recebe o capítulo atual
                let versiculoAtual = ${versiculoAtual}; // Recebe o versículo atual
                const versiculosPorCapitulo = [31, 25, 24, 26, 32, 22, 24, 22, 21, 32, 24, 20, 18, 31, 21, 30, 27, 32, 25, 18, 34, 31, 20, 67, 18]; // Exemplo para Gênesis
                const livroAtual = '${livroAtual}'; // Recebe o livro atual
                let capituloConteudo = ''; // Armazenará o conteúdo HTML do capítulo carregado

                function carregarCapitulo(capitulo) {
                    fetch(livroAtual + '/' + capitulo + '.html')
                        .then(response => response.text())
                        .then(text => {
                            capituloConteudo = text; // Armazena o conteúdo do capítulo
                            carregarVersiculo(versiculoAtual); // Exibe o versículo atual
                        })
                        .catch(error => {
                            console.error('Erro ao carregar o capítulo:', error);
                            document.getElementById('versiculo-container').innerHTML = 'Erro ao carregar capítulo';
                        });
                }

                function carregarVersiculo(versiculo) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(capituloConteudo, 'text/html');
                    const versiculoElemento = doc.querySelector('#versiculo-' + versiculo);

                    if (versiculoElemento) {
                        document.getElementById('versiculo-container').innerHTML = versiculoElemento.innerHTML;
                        document.getElementById('titulo').innerText = \`\${livroAtual.toUpperCase()} - CAPÍTULO \${capituloAtual} - VERSÍCULO \${versiculo}\`; // Atualiza o título
                    } else {
                        document.getElementById('versiculo-container').innerHTML = 'Versículo não encontrado.';
                    }
                }

                function proximoVersiculo() {
                    versiculoAtual++;

                    if (versiculoAtual > versiculosPorCapitulo[capituloAtual - 1]) {
                        versiculoAtual = 1;
                        capituloAtual++;
                        if (capituloAtual <= versiculosPorCapitulo.length) {
                            carregarCapitulo(capituloAtual); // Avança para o próximo capítulo
                        } else {
                            document.getElementById('versiculo-container').innerHTML = 'Fim do livro.';
                        }
                    } else {
                        carregarVersiculo(versiculoAtual); // Avança para o próximo versículo
                    }
                }

                function voltarVersiculo() {
                    versiculoAtual--;

                    if (versiculoAtual < 1) {
                        versiculoAtual = versiculosPorCapitulo[capituloAtual - 1]; // Volta para o último versículo do capítulo
                    }
                    carregarVersiculo(versiculoAtual); // Carrega o versículo anterior
                }

                document.getElementById('proximo-botao').addEventListener('click', proximoVersiculo);
                document.getElementById('voltar-botao').addEventListener('click', voltarVersiculo);

                carregarCapitulo(capituloAtual); // Carrega o capítulo inicial
            </script>
        </body>
        </html>
    `);
    window.janelaSlide.document.close();
}

// Adiciona o evento de clique ao link "Slide" na janela principal
document.querySelector('header nav ul li:first-child a').addEventListener('click', (event) => {
    event.preventDefault();
    abrirJanelaSlide(activeLivro, activeCapitulo, activeVersiculoButton ? activeVersiculoButton.textContent.trim() : 1);
});*/

//------

/* criado o botao voltar
// Função para abrir a janela Slide com o versículo atual
function abrirJanelaSlide(livroAtual, capituloAtual, versiculoAtual) {
    if (window.janelaSlide && !window.janelaSlide.closed) {
        window.janelaSlide.focus();
        return;
    }

    window.janelaSlide = window.open('', 'JanelaSlide', 'width=500,height=600');

    window.janelaSlide.document.open();
    window.janelaSlide.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Janela Slide</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                button { padding: 10px 20px; font-size: 16px; margin-right: 10px; }
                #versiculo-container { margin-bottom: 20px; }
            </style>
        </head>
        <body>
            <div id="versiculo-container">Carregando...</div>
            <button id="voltar-botao">Voltar</button>
            <button id="proximo-botao">Próximo</button>
            <script>
                let capituloAtual = ${capituloAtual}; // Recebe o capítulo atual
                let versiculoAtual = ${versiculoAtual}; // Recebe o versículo atual
                const versiculosPorCapitulo = [31, 25, 24, 26, 32, 22, 24, 22, 21, 32, 24, 20, 18, 31, 21, 30, 27, 32, 25, 18, 34, 31, 20, 67, 18]; // Exemplo para Gênesis
                const livroAtual = '${livroAtual}'; // Recebe o livro atual
                let capituloConteudo = ''; // Armazenará o conteúdo HTML do capítulo carregado

                function carregarCapitulo(capitulo) {
                    fetch(livroAtual + '/' + capitulo + '.html')
                        .then(response => response.text())
                        .then(text => {
                            capituloConteudo = text; // Armazena o conteúdo do capítulo
                            carregarVersiculo(versiculoAtual); // Exibe o versículo atual
                        })
                        .catch(error => {
                            console.error('Erro ao carregar o capítulo:', error);
                            document.getElementById('versiculo-container').innerHTML = 'Erro ao carregar capítulo';
                        });
                }

                function carregarVersiculo(versiculo) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(capituloConteudo, 'text/html');
                    const versiculoElemento = doc.querySelector('#versiculo-' + versiculo);

                    if (versiculoElemento) {
                        document.getElementById('versiculo-container').innerHTML = versiculoElemento.innerHTML;
                    } else {
                        document.getElementById('versiculo-container').innerHTML = 'Versículo não encontrado.';
                    }
                }

                function proximoVersiculo() {
                    versiculoAtual++;

                    if (versiculoAtual > versiculosPorCapitulo[capituloAtual - 1]) {
                        versiculoAtual = 1;
                        capituloAtual++;
                        if (capituloAtual <= versiculosPorCapitulo.length) {
                            carregarCapitulo(capituloAtual); // Avança para o próximo capítulo
                        } else {
                            document.getElementById('versiculo-container').innerHTML = 'Fim do livro.';
                        }
                    } else {
                        carregarVersiculo(versiculoAtual); // Avança para o próximo versículo
                    }
                }

                function voltarVersiculo() {
                    versiculoAtual--;

                    if (versiculoAtual < 1) {
                        versiculoAtual = versiculosPorCapitulo[capituloAtual - 1]; // Volta para o último versículo do capítulo
                    }
                    carregarVersiculo(versiculoAtual); // Carrega o versículo anterior
                }

                document.getElementById('proximo-botao').addEventListener('click', proximoVersiculo);
                document.getElementById('voltar-botao').addEventListener('click', voltarVersiculo);

                carregarCapitulo(capituloAtual); // Carrega o capítulo inicial
            </script>
        </body>
        </html>
    `);
    window.janelaSlide.document.close();
}

// Adiciona o evento de clique ao link "Slide" na janela principal
document.querySelector('header nav ul li:first-child a').addEventListener('click', (event) => {
    event.preventDefault();
    abrirJanelaSlide(activeLivro, activeCapitulo, activeVersiculoButton ? activeVersiculoButton.textContent.trim() : 1);
});
*/

//----
/*
// Função para abrir a janela Slide com o versículo atual
function abrirJanelaSlide(livroAtual, capituloAtual, versiculoAtual) {
    if (window.janelaSlide && !window.janelaSlide.closed) {
        window.janelaSlide.focus();
        return;
    }

    window.janelaSlide = window.open('', 'JanelaSlide', 'width=500,height=600');

    window.janelaSlide.document.open();
    window.janelaSlide.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Janela Slide</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                button { padding: 10px 20px; font-size: 16px; }
                #versiculo-container { margin-bottom: 20px; }
            </style>
        </head>
        <body>
            <div id="versiculo-container">Carregando...</div>
            <button id="proximo-botao">Próximo</button>
            <script>
                let capituloAtual = ${capituloAtual}; // Recebe o capítulo atual
                let versiculoAtual = ${versiculoAtual}; // Recebe o versículo atual
                const versiculosPorCapitulo = [31, 25, 24, 26, 32, 22, 24, 22, 21, 32, 24, 20, 18, 31, 21, 30, 27, 32, 25, 18, 34, 31, 20, 67, 18]; // Exemplo para Gênesis
                const livroAtual = '${livroAtual}'; // Recebe o livro atual
                let capituloConteudo = ''; // Armazenará o conteúdo HTML do capítulo carregado

                function carregarCapitulo(capitulo) {
                    fetch(livroAtual + '/' + capitulo + '.html')
                        .then(response => response.text())
                        .then(text => {
                            capituloConteudo = text; // Armazena o conteúdo do capítulo
                            carregarVersiculo(versiculoAtual); // Exibe o versículo atual
                        })
                        .catch(error => {
                            console.error('Erro ao carregar o capítulo:', error);
                            document.getElementById('versiculo-container').innerHTML = 'Erro ao carregar capítulo';
                        });
                }

                function carregarVersiculo(versiculo) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(capituloConteudo, 'text/html');
                    const versiculoElemento = doc.querySelector('#versiculo-' + versiculo);

                    if (versiculoElemento) {
                        document.getElementById('versiculo-container').innerHTML = versiculoElemento.innerHTML;
                    } else {
                        document.getElementById('versiculo-container').innerHTML = 'Versículo não encontrado.';
                    }
                }

                function proximoVersiculo() {
                    versiculoAtual++;

                    if (versiculoAtual > versiculosPorCapitulo[capituloAtual - 1]) {
                        versiculoAtual = 1;
                        capituloAtual++;
                        if (capituloAtual <= versiculosPorCapitulo.length) {
                            carregarCapitulo(capituloAtual); // Avança para o próximo capítulo
                        } else {
                            document.getElementById('versiculo-container').innerHTML = 'Fim do livro.';
                        }
                    } else {
                        carregarVersiculo(versiculoAtual); // Avança para o próximo versículo
                    }
                }

                document.getElementById('proximo-botao').addEventListener('click', proximoVersiculo);

                carregarCapitulo(capituloAtual); // Carrega o capítulo inicial
            </script>
        </body>
        </html>
    `);
    window.janelaSlide.document.close();
}

// Adiciona o evento de clique ao link "Slide" na janela principal
document.querySelector('header nav ul li:first-child a').addEventListener('click', (event) => {
    event.preventDefault();
    abrirJanelaSlide(activeLivro, activeCapitulo, activeVersiculoButton ? activeVersiculoButton.textContent.trim() : 1);
});*/

//------
/* Funcionou todos os versiculos do livro de genesis so não exibiu o que esta sendo exibido na janela principal 18/09/24 18:27
function abrirJanelaSlide() {
    if (window.janelaSlide && !window.janelaSlide.closed) {
        window.janelaSlide.focus();
        return;
    }

    window.janelaSlide = window.open('', 'JanelaSlide', 'width=500,height=600');

    window.janelaSlide.document.open();
    window.janelaSlide.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Janela Slide</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                button { padding: 10px 20px; font-size: 16px; }
                #versiculo-container { margin-bottom: 20px; }
            </style>
        </head>
        <body>
            <div id="versiculo-container">Carregando...</div>
            <button id="proximo-botao">Próximo</button>
            <script>
                let capituloAtual = 1; // Inicia com o primeiro capítulo
                let versiculoAtual = 1; // Inicia com o primeiro versículo
                const versiculosPorCapitulo = [31, 25, 24, 26, 32, 22, 24, 22, 21, 32, 24, 20, 18, 31, 21, 30, 27, 32, 25, 18, 34, 31, 20, 67, 18]; // Exemplo para Gênesis
                const livroAtual = 'genesis'; // Altere para o nome do livro desejado
                let capituloConteudo = ''; // Armazenará o conteúdo HTML do capítulo carregado

                function carregarCapitulo(capitulo) {
                    fetch(livroAtual + '/' + capitulo + '.html')
                        .then(response => response.text())
                        .then(text => {
                            capituloConteudo = text; // Armazena o conteúdo do capítulo
                            versiculoAtual = 1; // Reseta o versículo ao carregar um novo capítulo
                            carregarVersiculo(versiculoAtual); // Exibe o primeiro versículo
                        })
                        .catch(error => {
                            console.error('Erro ao carregar o capítulo:', error);
                            document.getElementById('versiculo-container').innerHTML = 'Erro ao carregar capítulo';
                        });
                }

                function carregarVersiculo(versiculo) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(capituloConteudo, 'text/html');
                    const versiculoElemento = doc.querySelector('#versiculo-' + versiculo);

                    if (versiculoElemento) {
                        document.getElementById('versiculo-container').innerHTML = versiculoElemento.innerHTML;
                    } else {
                        document.getElementById('versiculo-container').innerHTML = 'Versículo não encontrado.';
                    }
                }

                function proximoVersiculo() {
                    versiculoAtual++;

                    if (versiculoAtual > versiculosPorCapitulo[capituloAtual - 1]) {
                        versiculoAtual = 1;
                        capituloAtual++;
                        if (capituloAtual <= versiculosPorCapitulo.length) {
                            carregarCapitulo(capituloAtual); // Avança para o próximo capítulo
                        } else {
                            document.getElementById('versiculo-container').innerHTML = 'Fim do livro.';
                        }
                    } else {
                        carregarVersiculo(versiculoAtual); // Avança para o próximo versículo
                    }
                }

                document.getElementById('proximo-botao').addEventListener('click', proximoVersiculo);

                carregarCapitulo(capituloAtual); // Carrega o primeiro capítulo
            </script>
        </body>
        </html>
    `);
    window.janelaSlide.document.close();
}

// Adiciona o evento de clique ao link "Slide" na janela principal
document.querySelector('header nav ul li:first-child a').addEventListener('click', (event) => {
    event.preventDefault();
    abrirJanelaSlide();
});*/
