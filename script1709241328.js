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

//------
// Função para abrir uma nova janela com o versículo selecionado
function openVersiculoWindow(livro, capitulo, versiculo) {
    if (versiculo < 1) {
        alert('Não há versículo anterior.');
        return;
    }

    const width = window.screen.width;
    const height = window.screen.height;
    const versiculoWindow = window.open('', 'Versículo', `width=${width},height=${height},left=0,top=0`);

    if (!versiculoWindow) {
        alert('Não foi possível abrir a nova janela. Verifique as configurações de pop-up do navegador.');
        return;
    }

    versiculoWindow.document.open();
    versiculoWindow.document.write(`
        <html>
        <head>
            <title>${livro.toUpperCase()} ${capitulo}:${versiculo}</title>
            <link rel="stylesheet" href="styles.css">
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    height: 100vh;
                    width: 100vw;
                    overflow: hidden;
                    color: white;
                    font-family: sans-serif;
                    background-color: #181818;
                    font-weight: bold;
                    font-style: italic;
                }
                .background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background-color: #181818;
                    z-index: -1;
                }
                .background::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: url('biblia.png'); /* Caminho relativo */
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    opacity: 0.3;
                    z-index: -1;
                }
                .content {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 60px 0;
                    text-align: center;
                    font-size: calc(6em + 2vw);
                    overflow-y: auto;
                    position: relative;
                    z-index: 1;
                }
                button {
                    margin: 10px;
                    padding: 10px 20px;
                    font-size: 16px;
                    cursor: pointer;
                }
            </style>
        </head>
        <body>
            <div class="background"></div>
            <div class="content" id="versiculo-content">Carregando...</div>
            <div style="text-align: center; margin-top: 20px;">
                <button onclick="window.opener.openVersiculoWindow('${livro}', ${capitulo}, ${versiculo + 1})">Próximo Versículo</button>
                <button onclick="window.opener.openVersiculoWindow('${livro}', ${capitulo}, ${versiculo - 1})">Versículo Anterior</button>
            </div>
            <script>
                function loadVersiculoContent() {
                    const url = './${livro}/${versiculo}.html'; // Ajuste para o caminho correto
                    console.log('Carregando versículo de:', url);

                    fetch(url)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Arquivo não encontrado.');
                            }
                            return response.text();
                        })
                        .then(data => {
                            document.getElementById('versiculo-content').innerHTML = data;
                        })
                        .catch(error => {
                            console.error(error);
                            document.getElementById('versiculo-content').innerHTML = 'Versículo não encontrado.';
                        });
                }
                window.onload = loadVersiculoContent;
            </script>
        </body>
        </html>
    `);
    versiculoWindow.document.close();
}

// Substitua por um evento específico para abrir o primeiro versículo
document.querySelector('header nav ul li:first-child a').addEventListener('click', (event) => {
    event.preventDefault();

    if (activeLivro && activeCapitulo) {
        // Abre a janela do versículo 1 do capítulo ativo
        openVersiculoWindow(activeLivro.toLowerCase(), activeCapitulo, 1);
    } else {
        alert("Selecione um livro e capítulo primeiro.");
    }
});

// Adicione um evento para cada botão de versículo, se aplicável
const versiculoButtons = document.querySelectorAll('.versiculo-button'); // Supondo que você tenha botões com essa classe

versiculoButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        const versiculo = parseInt(event.target.getAttribute('data-versiculo')); // Certifique-se de que você tenha um atributo data-versiculo
        openVersiculoWindow(activeLivro.toLowerCase(), activeCapitulo, versiculo);
    });
});
//-----
/*
// Função para abrir uma nova janela com o versículo selecionado
function openVersiculoWindow(livro, capitulo, versiculo) {
    // Cria uma nova janela que ocupa a tela inteira
    const width = window.screen.width;
    const height = window.screen.height;
    const versiculoWindow = window.open('', 'Versículo', `width=${width},height=${height},left=0,top=0`);

    // Verifica se a janela foi criada com sucesso
    if (!versiculoWindow) {
        alert('Não foi possível abrir a nova janela. Verifique as configurações de pop-up do navegador.');
        return;
    }

    // Define o conteúdo e o estilo da nova janela
    versiculoWindow.document.open();
    versiculoWindow.document.write(`
        <html>
        <head>
            <title>${livro.toUpperCase()} ${capitulo}:${versiculo}</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    height: 100vh;
                    width: 100vw;
                    overflow: hidden;
                    color: white;
                    font-family: sans-serif;
                    background-color: #181818;
                    font-weight: bold;
                    font-style: italic;
                }
                .background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background-color: #181818;
                    z-index: -1;
                }
                .background::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: url('biblia.png');
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    opacity: 0.3;
                    z-index: -1;
                }
                .content {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 60px 0;
                    text-align: center;
                    font-size: calc(6em + 2vw);
                    /*line-height: 1; /* Ajuste para reduzir o espaçamento entre linhas 
                    /*height: calc(100vh - 120px);
                    overflow-y: auto;
                    position: relative;
                    z-index: 1;
                }
                .content p {
                    margin: 0;
                    padding: 0;
                }
                .content strong {
                    font-weight: bold;
                    color: #5df565;
                    font-size: 60px;
                    font-style: italic;
                    font-family: sans-serif;
                    margin: 0;
                    padding: 0;
                }
                button {
                    margin: 10px;
                    padding: 10px 20px;
                    font-size: 16px;
                    cursor: pointer;
                }
            </style>
        </head>
        <body>
            <div class="background"></div>
            <div class="content" id="versiculo-content">Carregando...</div>
            <div style="text-align: center; margin-top: 20px;">
                <button onclick="window.opener.openVersiculoWindow('${livro}', ${capitulo}, ${parseInt(versiculo) + 1})">Próximo Versículo</button>
                <button onclick="window.opener.openVersiculoWindow('${livro}', ${capitulo}, ${parseInt(versiculo) - 1})">Versículo Anterior</button>
            </div>
            <script>
                // Função para carregar o conteúdo do versículo
                function loadVersiculoContent() {
                    // Obtém o conteúdo do versículo da página principal
                    const versiculoContent = window.opener.document.querySelector('#versiculo-' + ${versiculo}).innerHTML;
                    document.getElementById('versiculo-content').innerHTML = versiculoContent;
                }
                loadVersiculoContent();
            </script>
        </body>
        </html>
    `);
    versiculoWindow.document.close();
}

// Adiciona um evento de clique ao link "Slide" no menu superior
document.querySelector('header nav ul li:first-child a').addEventListener('click', (event) => {
    event.preventDefault();

    if (activeLivro && activeCapitulo) {
        // Abre a janela do versículo 1 do capítulo ativo
        openVersiculoWindow(activeLivro, activeCapitulo, 1);
    } else {
        // Se nenhum livro ou capítulo estiver ativo, exibe um alerta
        alert("Selecione um livro e capítulo primeiro.");
    }
});

*/

//------
/*
// Função para abrir uma nova janela com o versículo selecionado
function openVersiculoWindow(livro, capitulo, versiculo) {
    // Cria uma nova janela que ocupa a tela inteira
    const width = window.screen.width;
    const height = window.screen.height;
    const versiculoWindow = window.open('', 'Versículo', `width=${width},height=${height},left=0,top=0`);

    // Verifica se a janela foi criada com sucesso
    if (!versiculoWindow) {
        alert('Não foi possível abrir a nova janela. Verifique as configurações de pop-up do navegador.');
        return;
    }

    // Define o conteúdo e o estilo da nova janela
    versiculoWindow.document.open();
    versiculoWindow.document.write(`
        <html>
        <head>
            <title>${livro.toUpperCase()} ${capitulo}:${versiculo}</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    height: 100vh;
                    width: 100vw;
                    overflow: hidden;
                    color: white;
                    font-family: sans-serif;
                    background-color: #181818;
                    font-weight: bold;
                    font-style: italic;
                }
                .background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background-color: #181818;
                    z-index: -1;
                }
                .background::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: url('biblia.png');
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    opacity: 0.3;
                    z-index: -1;
                }
                .content {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 60px 0;
                    text-align: center;
                    /*font-size: calc(6em + 2vw);
                    font-size: 140px;
                    line-height: 1.4;
                    height: calc(100vh - 120px);
                    overflow-y: auto;
                    position: relative;
                    z-index: 1;
                }
                .content p {
                    margin: 0;
                    padding: 0;
                }
                .content strong {
                    font-weight: bold;
                    color: #5df565;
                    font-size: 60px;
                    font-style: italic;
                    font-family: sans-serif;
                    margin: 0;
                    padding: 0;
                }
                button {
                    margin: 10px;
                    padding: 10px 20px;
                    font-size: 16px;
                    cursor: pointer;
                }
            </style>
        </head>
        <body>
            <div class="background"></div>
            <div class="content" id="versiculo-content">Carregando...</div>
            <div style="text-align: center; margin-top: 20px;">
                <button onclick="window.opener.openVersiculoWindow('${livro}', ${capitulo}, ${parseInt(versiculo) + 1})">Próximo Versículo</button>
                <button onclick="window.opener.openVersiculoWindow('${livro}', ${capitulo}, ${parseInt(versiculo) - 1})">Versículo Anterior</button>
            </div>
            <script>
                // Função para carregar o conteúdo do versículo
                function loadVersiculoContent() {
                    // Obtém o conteúdo do versículo da página principal
                    const versiculoContent = window.opener.document.querySelector('#versiculo-' + ${versiculo}).innerHTML;
                    document.getElementById('versiculo-content').innerHTML = versiculoContent;
                }
                loadVersiculoContent();
            </script>
        </body>
        </html>
    `);
    versiculoWindow.document.close();
}

// Adiciona um evento de clique ao link "Slide" no menu superior
document.querySelector('header nav ul li:first-child a').addEventListener('click', (event) => {
    event.preventDefault();

    if (activeLivro && activeCapitulo) {
        // Abre a janela do versículo 1 do capítulo ativo
        openVersiculoWindow(activeLivro, activeCapitulo, 1);
    } else {
        // Se nenhum livro ou capítulo estiver ativo, exibe um alerta
        alert("Selecione um livro e capítulo primeiro.");
    }
});

*/

//---


/* a fonte esta com tamanho desejado, so esta demorando para carregar outros versiculo 17/09/24 10:17
// Função para abrir uma nova janela com o versículo selecionado
function openVersiculoWindow(livro, capitulo, versiculo) {
    // Cria uma nova janela que ocupa a tela inteira
    const width = window.screen.width;
    const height = window.screen.height;
    const versiculoWindow = window.open('', 'Versículo', `width=${width},height=${height},left=0,top=0`);

    // Verifica se a janela foi criada com sucesso
    if (!versiculoWindow) {
        alert('Não foi possível abrir a nova janela. Verifique as configurações de pop-up do navegador.');
        return;
    }

    // Define o conteúdo e o estilo da nova janela
    versiculoWindow.document.open();
    versiculoWindow.document.write(`
        <html>
        <head>
            <title>${livro.toUpperCase()} ${capitulo}:${versiculo}</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    height: 100vh;
                    width: 100vw;
                    overflow: hidden;
                    color: white;
                    font-family: sans-serif;
                    background-color: #181818;
                    font-weight: bold;
                    font-style: italic
                }
                .background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background-color: #181818;
                    z-index: -1;
                }
                .background::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: url('biblia.png');
                    background-size: cover;
                    background-position: center -700px;
                    background-repeat: no-repeat;
                    opacity: 0.3;
                    z-index: -1;
                }
                .content {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 60px 0;
                    text-align: center;
                    font-size: calc(6em + 2vw);
                    line-height: 1.4;
                    height: calc(100vh - 120px);
                    overflow-y: auto;
                    position: relative;
                    z-index: 1;
                }
                .content strong {
                    font-weight: bold;
                    color: #5df565;
                    font-size: 60px;
                    /----/
                    margin-bottom: 0
                    
                }
                button {
                    margin: 10px;
                    padding: 10px 20px;
                    font-size: 16px;
                    cursor: pointer;
                }
            </style>
        </head>
        <body>
            <div class="background"></div>
            <div class="content" id="versiculo-content">Carregando...</div>
            <div style="text-align: center; margin-top: 20px;">
                <button onclick="window.opener.openVersiculoWindow('${livro}', ${capitulo}, ${parseInt(versiculo) + 1})">Próximo Versículo</button>
                <button onclick="window.opener.openVersiculoWindow('${livro}', ${capitulo}, ${parseInt(versiculo) - 1})">Versículo Anterior</button>
            </div>
            <script>
                // Função para carregar o conteúdo do versículo
                function loadVersiculoContent() {
                    // Obtém o conteúdo do versículo da página principal
                    const versiculoContent = window.opener.document.querySelector('#versiculo-' + ${versiculo}).innerHTML;
                    document.getElementById('versiculo-content').innerHTML = versiculoContent;
                }
                loadVersiculoContent();
            </script>
        </body>
        </html>
    `);
    versiculoWindow.document.close();
}

// Adiciona um evento de clique ao link "Slide" no menu superior
document.querySelector('header nav ul li:first-child a').addEventListener('click', (event) => {
    event.preventDefault();

    if (activeLivro && activeCapitulo) {
        // Abre a janela do versículo 1 do capítulo ativo
        openVersiculoWindow(activeLivro, activeCapitulo, 1);
    } else {
        // Se nenhum livro ou capítulo estiver ativo, exibe um alerta
        alert("Selecione um livro e capítulo primeiro.");
    }
});
*/



//----
/* melhoria do estilo dos botoes e do texto na tela
// Função para abrir uma nova janela com o versículo selecionado
function openVersiculoWindow(livro, capitulo, versiculo) {
    // Cria uma nova janela que ocupa a tela inteira
    const width = window.screen.width;
    const height = window.screen.height;
    const versiculoWindow = window.open('', 'Versículo', `width=${width},height=${height},left=0,top=0`);

    // Verifica se a janela foi criada com sucesso
    if (!versiculoWindow) {
        alert('Não foi possível abrir a nova janela. Verifique as configurações de pop-up do navegador.');
        return;
    }

    // Define o conteúdo e o estilo da nova janela
    versiculoWindow.document.open();
    versiculoWindow.document.write(`
        <html>
        <head>
            <title>${livro.toUpperCase()} ${capitulo}:${versiculo}</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    height: 100vh;
                    width: 100vw;
                    background-color: #181818;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    color: white;
                    font-family: Arial, sans-serif;
                }

                .content {
                    text-align: center;
                    font-size: 28px;
                    line-height: 1.5;
                    margin: 20px;
                    max-width: 80%;
                    background-color: rgba(0, 0, 0, 0.7);
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
                }

                .buttons {
                    text-align: center;
                    margin-top: 20px;
                }

                button {
                    margin: 0 10px;
                    padding: 10px 20px;
                    font-size: 16px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }

                button:hover {
                    background-color: #45a049;
                }

                .background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background-image: url('biblia.png');
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    z-index: -1;
                    opacity: 0.2;
                }
            </style>
        </head>
        <body>
            <div class="background"></div>
            <div class="content">${document.querySelector(`#versiculo-${versiculo}`).textContent}</div>
            <div class="buttons">
                <button onclick="window.opener.openVersiculoWindow('${livro}', ${capitulo}, ${parseInt(versiculo) + 1})">Próximo Versículo</button>
                <button onclick="window.opener.openVersiculoWindow('${livro}', ${capitulo}, ${parseInt(versiculo) - 1})">Versículo Anterior</button>
            </div>
        </body>
        </html>
    `);
    versiculoWindow.document.close();
}

// Adiciona um evento de clique ao link "Slide" no menu superior
document.querySelector('header nav ul li:first-child a').addEventListener('click', (event) => {
    event.preventDefault();

    // Verifica se as variáveis activeLivro e activeCapitulo estão definidas
    if (typeof activeLivro !== 'undefined' && typeof activeCapitulo !== 'undefined') {
        // Abre a janela do versículo 1 do capítulo ativo
        openVersiculoWindow(activeLivro, activeCapitulo, 1);
    } else {
        // Exibe um alerta caso não haja um livro e capítulo ativos
        alert("Selecione um livro e capítulo primeiro.");
    }
});*/


//-----

/* a imagem de fundo esta ok, so falta os botoes e o texto 17/09/24 90:20
// Função para abrir uma nova janela com o versículo selecionado
function openVersiculoWindow(livro, capitulo, versiculo) {
    // Cria uma nova janela que ocupa a tela inteira
    const width = window.screen.width;
    const height = window.screen.height;
    const versiculoWindow = window.open('', 'Versículo', `width=${width},height=${height},left=0,top=0`);

    // Verifica se a janela foi criada com sucesso
    if (!versiculoWindow) {
        alert('Não foi possível abrir a nova janela. Verifique as configurações de pop-up do navegador.');
        return;
    }

    // Define o conteúdo e o estilo da nova janela
    versiculoWindow.document.open();
    versiculoWindow.document.write(`
        <html>
        <head>
            <title>${livro.toUpperCase()} ${capitulo}:${versiculo}</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    height: 100vh;
                    width: 100vw;
                    overflow: hidden;
                }
                /*.background {
                    position: absolute;
                    top: 0; /* Move o contêiner de fundo para cima 
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background-color: #181818; /* Cor de fundo 
                    background-image: url('biblia.png');
                    background-size: cover;
                    background-position: center -700px; /* Move apenas a imagem de fundo para cima 
                    background-repeat: no-repeat;
                    z-index: -1; /* Coloca a imagem de fundo atrás do conteúdo 
                    opacity: 0.3;
                    
                }*/

/*                .background {
                    position: absolute;
                    top: 0; /* Mantém o contêiner no lugar
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background-color: #181818; /* Cor de fundo 
                    z-index: -1; /* Coloca a imagem de fundo atrás do conteúdo 
                }

                .background::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: url('biblia.png');
                    background-size: cover;
                    background-position: center -700px; /* Move apenas a imagem de fundo para cima 
                    background-repeat: no-repeat;
                    opacity: 0.3; /* Aplica opacidade apenas à imagem 
                    z-index: -1;
                }    


                .content {
                    text-align: center;
                    font-size: 24px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                }
                button {
                    margin: 0 10px;
                    padding: 10px 20px;
                    font-size: 16px;
                }
            </style>
        </head>
        <body>
            <div class="background"></div>
            <div class="content">${document.querySelector(`#versiculo-${versiculo}`).textContent}</div>
            <div style="text-align: center; margin-top: 20px;">
                <button onclick="window.opener.openVersiculoWindow('${livro}', ${capitulo}, ${parseInt(versiculo) + 1})">Próximo Versículo</button>
                <button onclick="window.opener.openVersiculoWindow('${livro}', ${capitulo}, ${parseInt(versiculo) - 1})">Versículo Anterior</button>
            </div>
        </body>
        </html>
    `);
    versiculoWindow.document.close();
}

// Adiciona um evento de clique ao link "Slide" no menu superior
document.querySelector('header nav ul li:first-child a').addEventListener('click', (event) => {
    event.preventDefault();

    if (activeLivro && activeCapitulo) {
        // Abre a janela do versículo 1 do capítulo ativo
        openVersiculoWindow(activeLivro, activeCapitulo, 1);
    } else {
        // Se nenhum livro ou capítulo estiver ativo, exibe um alerta
        alert("Selecione um livro e capítulo primeiro.");
    }
});
*/

//------
/*
// 2ª tentativa sem marca d'agua
// Janela para slide
// Função para abrir uma nova janela com o versículo selecionado
function openVersiculoWindow(livro, capitulo, versiculo) {
    // Cria uma nova janela que ocupa a tela inteira
    const width = window.screen.width;
    const height = window.screen.height;
    const versiculoWindow = window.open('', 'Versículo', `width=${width},height=${height},left=0,top=0`);

    // Define o título da janela
    versiculoWindow.document.title = `${livro.toUpperCase()} ${capitulo}:${versiculo}`;

    // Insere o conteúdo do versículo na janela
    const content = versiculoWindow.document.createElement('div');
    content.textContent = document.querySelector(`#versiculo-${versiculo}`).textContent;
    content.style.textAlign = 'center';
    content.style.fontFamily = 'sans-serif';
    content.style.fontSize = '24px';
    versiculoWindow.document.body.appendChild(content);

    // Adiciona um botão para o próximo versículo
    const nextButton = versiculoWindow.document.createElement('button');
    nextButton.textContent = 'Próximo Versículo';
    nextButton.addEventListener('click', () => {
        const nextVersiculo = parseInt(versiculo) + 1;
        if (nextVersiculo <= getNumVersiculos(livro, capitulo)) {
            openVersiculoWindow(livro, capitulo, nextVersiculo);
        }
    });
    versiculoWindow.document.body.appendChild(nextButton);

    // Adiciona um botão para o versículo anterior
    const previousButton = versiculoWindow.document.createElement('button');
    previousButton.textContent = 'Versículo Anterior';
    previousButton.addEventListener('click', () => {
        const previousVersiculo = parseInt(versiculo) - 1;
        if (previousVersiculo > 0) {
            openVersiculoWindow(livro, capitulo, previousVersiculo);
        }
    });
    versiculoWindow.document.body.appendChild(previousButton);

    // Define a imagem de fundo da janela
    versiculoWindow.document.body.style.backgroundImage = 'url(biblia.png)';
    versiculoWindow.document.body.style.backgroundSize = 'cover';
}

// Adiciona um evento de clique ao link "Slide" no menu superior
document.querySelector('header nav ul li:first-child a').addEventListener('click', (event) => {
    event.preventDefault();

    if (activeLivro && activeCapitulo) {
        // Abre a janela do versículo 1 do capítulo ativo
        openVersiculoWindow(activeLivro, activeCapitulo, 1);
    } else {
        // Se nenhum livro ou capítulo estiver ativo, exibe um alerta
        alert("Selecione um livro e capítulo primeiro.");
    }
});
*/

//------
/*
// 16/09/24 11:55 1ª teste
// Janela para slide
// Função para abrir uma nova janela com o versículo selecionado
function openVersiculoWindow(livro, capitulo, versiculo) {
    // Cria uma nova janela
    const versiculoWindow = window.open('', 'Versículo', 'width=800,height=600');
    
    // Define o título da janela
    versiculoWindow.document.title = `${livro.toUpperCase()} ${capitulo}:${versiculo}`;

    // Insere o conteúdo do versículo na janela
    const content = versiculoWindow.document.createElement('div');
    content.textContent = document.querySelector(`#versiculo-${versiculo}`).textContent;
    content.style.textAlign = 'center';
    content.style.fontFamily = 'sans-serif';
    content.style.fontSize = '24px';
    versiculoWindow.document.body.appendChild(content);

    // Adiciona um botão para o próximo versículo
    const nextButton = versiculoWindow.document.createElement('button');
    nextButton.textContent = 'Próximo Versículo';
    nextButton.addEventListener('click', () => {
        const nextVersiculo = parseInt(versiculo) + 1;
        if (nextVersiculo <= getNumVersiculos(livro, capitulo)) {
            openVersiculoWindow(livro, capitulo, nextVersiculo);
        }
    });
    versiculoWindow.document.body.appendChild(nextButton);

    // Adiciona um botão para o versículo anterior
    const previousButton = versiculoWindow.document.createElement('button');
    previousButton.textContent = 'Versículo Anterior';
    previousButton.addEventListener('click', () => {
        const previousVersiculo = parseInt(versiculo) - 1;
        if (previousVersiculo > 0) {
            openVersiculoWindow(livro, capitulo, previousVersiculo);
        }
    });
    versiculoWindow.document.body.appendChild(previousButton);

    // Define a imagem de fundo da janela
    versiculoWindow.document.body.style.backgroundImage = 'url(biblia.png)';
    versiculoWindow.document.body.style.backgroundSize = 'cover';
}

// Adiciona um evento de clique ao link "Slide" no menu superior
document.querySelector('header nav ul li:first-child a').addEventListener('click', (event) => {
    event.preventDefault();

    if (activeLivro && activeCapitulo) {
        // Abre a janela do versículo 1 do capítulo ativo
        openVersiculoWindow(activeLivro, activeCapitulo, 1);
    } else {
        // Se nenhum livro ou capítulo estiver ativo, exibe um alerta
        alert("Selecione um livro e capítulo primeiro.");
    }
});
*/