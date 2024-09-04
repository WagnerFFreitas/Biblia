

// Está funcionando todos os botões e as opções do menu dos livros 04/09/24 16:53
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
    // Adicione outros livros conforme necessário
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
    const elementsToRemove = content.querySelectorAll('h2, .capitulos-container, .versiculo-texto');
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
            // Adicione outros capítulos conforme necessário
        },
        // Adicione outros livros conforme necessário
    };
    return versiculosPorCapitulo[livro]?.[capitulo] || 0;
}

// Carrega a imagem da Bíblia assim que a página abre
window.onload = () => {
    const content = document.querySelector('.content');
    const watermarkContainer = document.createElement('div');
    watermarkContainer.classList.add('watermark');
    const img = document.createElement('img');
    img.src = 'biblia.png'; // Verifique se o caminho da imagem está correto!
    img.alt = "Marca d'água da Bíblia";
    img.classList.add('watermark-image');
    watermarkContainer.appendChild(img);
    content.appendChild(watermarkContainer);
};


