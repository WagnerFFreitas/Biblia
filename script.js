


// Armazena os capítulos e versículos de cada livro da Bíblia
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

// Função para criar os botões de capítulos
function createCapitulosButtons(livro) {
    const capitulos = livros[livro].capitulos;
    const capitulosContainer = document.createElement('div');
    capitulosContainer.classList.add('capitulos');

    for (let i = 1; i <= capitulos; i++) {
        const button = document.createElement('button');
        // button.textContent = `Cap. ${i}`;
        button.textContent = `${i}`;
        button.classList.add('botao-capitulo'); // Aplica a classe de estilo
        button.addEventListener('click', () => {
            showVersiculos(livro, i);
        });
        capitulosContainer.appendChild(button);
    }
    return capitulosContainer;
}

// Função para carregar o conteúdo de um versículo específico
async function loadVersiculo(livro, capitulo, versiculo) {
    const response = await fetch(`${livro}/${capitulo}.html`);
    const html = await response.text();
    
    // Cria um elemento temporário para carregar o HTML e filtrar o versículo desejado
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Seleciona o versículo específico
    const versiculoContent = tempDiv.querySelector(`#versiculo-${versiculo}`);

    // Exibir apenas o conteúdo do versículo desejado
    const content = document.querySelector('.content');
    content.innerHTML = `<h2>${livro.toUpperCase()} - CAPÍTULO ${capitulo} - VERSÍCULO ${versiculo}</h2>`;
    content.appendChild(createCapitulosButtons(livro));
    content.appendChild(createVersiculosButtons(livro, capitulo));
    
    // Cria um novo elemento para exibir o versículo
    const versiculoElement = document.createElement('div');
    versiculoElement.classList.add('versiculo');
    if (versiculoContent) {
        versiculoElement.appendChild(versiculoContent);
    } else {
        versiculoElement.textContent = 'Versículo não encontrado.';
    }
    content.appendChild(versiculoElement);
}

// Função para exibir os versículos
function showVersiculos(livro, capitulo) {
    const content = document.querySelector('.content');
    content.innerHTML = `<h2>${livro.toUpperCase()} - CAPÍTULO ${capitulo}</h2>`;
    content.appendChild(createCapitulosButtons(livro));
    content.appendChild(createVersiculosButtons(livro, capitulo));
}

// Função para carregar o livro
function loadBook(livro) {
    const content = document.querySelector('.content');
    content.innerHTML = `<h2>${livro.toUpperCase()}</h2>`;
    content.appendChild(createCapitulosButtons(livro));
}

// Adiciona eventos de clique aos links dos livros
const livrosLinks = document.querySelectorAll('.menu-livros a');
livrosLinks.forEach(link => {
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

    // Ajuste: definir o número correto de versículos
    const numVersiculos = getNumVersiculos(livro, capitulo);

    for (let i = 1; i <= numVersiculos; i++) {
        const button = document.createElement('button');
        button.textContent = `Vers. ${i}`;
        button.addEventListener('click', () => {
            loadVersiculo(livro, capitulo, i);
        });
        versiculosContainer.appendChild(button);
    }
    return versiculosContainer;
}

// Função para obter o número de versículos em um capítulo específico
function getNumVersiculos(livro, capitulo) {
    // Dados fictícios: você precisará adaptar isso com o número real de versículos
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




// 260824 1714 Armazena os capítulos e versículos de cada livro da Bíblia
/* const livros = {
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

// Função para criar os botões de capítulos
function createCapitulosButtons(livro) {
    const capitulos = livros[livro].capitulos;
    const capitulosContainer = document.createElement('div');
    capitulosContainer.classList.add('capitulos');

    for (let i = 1; i <= capitulos; i++) {
        const button = document.createElement('button');
        button.textContent = `Cap. ${i}`;
        button.addEventListener('click', () => {
            showVersiculos(livro, i);
        });
        capitulosContainer.appendChild(button);
    }
    return capitulosContainer;
}

// Função para carregar o conteúdo de um versículo específico
async function loadVersiculo(livro, capitulo, versiculo) {
    const response = await fetch(`${livro}/${capitulo}.html`);
    const html = await response.text();
    
    // Cria um elemento temporário para carregar o HTML e filtrar o versículo desejado
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Seleciona o versículo específico
    const versiculoContent = tempDiv.querySelector(`#versiculo-${versiculo}`);

    // Exibir apenas o conteúdo do versículo desejado
    const content = document.querySelector('.content');
    content.innerHTML = `<h2>${livro.toUpperCase()} - CAPÍTULO ${capitulo} - VERSÍCULO ${versiculo}</h2>`;
    content.appendChild(createCapitulosButtons(livro));
    content.appendChild(createVersiculosButtons(livro, capitulo));
    
    // Cria um novo elemento para exibir o versículo
    const versiculoElement = document.createElement('div');
    versiculoElement.classList.add('versiculo');
    if (versiculoContent) {
        versiculoElement.appendChild(versiculoContent);
    } else {
        versiculoElement.textContent = 'Versículo não encontrado.';
    }
    content.appendChild(versiculoElement);
}

// Função para exibir os versículos
function showVersiculos(livro, capitulo) {
    const content = document.querySelector('.content');
    content.innerHTML = `<h2>${livro.toUpperCase()} - CAPÍTULO ${capitulo}</h2>`;
    content.appendChild(createCapitulosButtons(livro));
    content.appendChild(createVersiculosButtons(livro, capitulo));
}

// Função para carregar o livro
function loadBook(livro) {
    const content = document.querySelector('.content');
    content.innerHTML = `<h2>${livro.toUpperCase()}</h2>`;
    content.appendChild(createCapitulosButtons(livro));
}

// Adiciona eventos de clique aos links dos livros
const livrosLinks = document.querySelectorAll('.menu-livros a');
livrosLinks.forEach(link => {
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

    // Ajuste: definir o número correto de versículos
    const numVersiculos = getNumVersiculos(livro, capitulo);

    for (let i = 1; i <= numVersiculos; i++) {
        const button = document.createElement('button');
        button.textContent = `Vers. ${i}`;
        button.addEventListener('click', () => {
            loadVersiculo(livro, capitulo, i);
        });
        versiculosContainer.appendChild(button);
    }
    return versiculosContainer;
}

// Função para obter o número de versículos em um capítulo específico
function getNumVersiculos(livro, capitulo) {
    // Dados fictícios: você precisará adaptar isso com o número real de versículos
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
}*/