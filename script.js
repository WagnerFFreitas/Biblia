

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

// Variável global para o elemento h2
let titulo = null;

// Função para criar os botões de capítulos
function createCapitulosButtons(livro) {
    const capitulos = livros[livro].capitulos;
    const capitulosContainer = document.createElement('div');
    capitulosContainer.classList.add('capitulos');

    for (let i = 1; i <= capitulos; i++) {
        const button = document.createElement('button');
        button.textContent = `${i}`;
        button.classList.add('botao-capitulo'); // Aplica a classe de estilo
        button.addEventListener('click', () => {
            toggleCapitulos(livro, i);
        });
        capitulosContainer.appendChild(button);
    }
    return capitulosContainer;
}

// Função para carregar o conteúdo de um versículo específico
async function loadVersiculo(livro, capitulo, versiculo) {
    const content = document.querySelector('.content');

    // Verifica se o versículo já foi carregado
    const existingVersiculo = content.querySelector(`.versiculo[data-livro="${livro}"][data-capitulo="${capitulo}"][data-versiculo="${versiculo}"]`);
    if (existingVersiculo) {
        existingVersiculo.remove(); // Remove o versículo existente
        return; // Sai da função para evitar a exibição novamente
    }

    const response = await fetch(`${livro}/${capitulo}.html`);
    const html = await response.text();
        
    // Cria um elemento temporário para carregar o HTML e filtrar o versículo desejado
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Seleciona o versículo específico
    const versiculoContent = tempDiv.querySelector(`#versiculo-${versiculo}`);

    // Cria um novo elemento div para conter o conteúdo do livro
    const bookContent = document.createElement('div');
    bookContent.classList.add('book-content'); 

    // Cria um novo elemento para exibir o versículo
    const versiculoElement = document.createElement('div');
    versiculoElement.classList.add('versiculo');
    versiculoElement.classList.add('versiculo-texto'); // Adiciona a nova classe
    versiculoElement.dataset.livro = livro;
    versiculoElement.dataset.capitulo = capitulo;
    versiculoElement.dataset.versiculo = versiculo;

    if (versiculoContent) {
        versiculoElement.appendChild(versiculoContent);
    } else {
        versiculoElement.textContent = 'Versículo não encontrado.';
    }
    bookContent.appendChild(versiculoElement);

    // Adiciona o novo elemento bookContent ao content
    content.appendChild(bookContent);

    // Atualiza o título
    titulo.textContent = `${livro.toUpperCase()} - CAPÍTULO ${capitulo} - VERSÍCULO ${versiculo}`;
}

// Função para exibir os versículos
function showVersiculos(livro, capitulo) {
    const content = document.querySelector('.content');
    
    // Verifica se já existe um contêiner de versículos para o capítulo
    const existingVersiculos = content.querySelector(`.versiculos[data-livro="${livro}"][data-capitulo="${capitulo}"]`);
    if (existingVersiculos) {
        existingVersiculos.remove(); // Remove os botões de versículos se já estiverem sendo exibidos
        return;
    }

    // Cria um novo elemento div para conter o conteúdo do livro
    const bookContent = document.createElement('div');
    bookContent.classList.add('book-content'); 

    // Limpa o conteúdo de bookContent
    bookContent.innerHTML = '';

    // Adiciona o título ao novo elemento bookContent
    titulo.textContent = `${livro.toUpperCase()} - CAPÍTULO ${capitulo}`;

    // Adiciona os botões de versículos ao novo elemento bookContent
    const versiculosButtons = createVersiculosButtons(livro, capitulo);
    versiculosButtons.dataset.livro = livro;
    versiculosButtons.dataset.capitulo = capitulo;
    bookContent.appendChild(versiculosButtons);

    // Adiciona o novo elemento bookContent ao content
    content.appendChild(bookContent);
}

// Função para carregar o livro
function loadBook(livro) { 
    const content = document.querySelector('.content');
    // Cria um novo elemento div para conter o conteúdo do livro
    const bookContent = document.createElement('div');
    bookContent.classList.add('book-content'); 

    // Limpa o conteúdo de bookContent
    bookContent.innerHTML = '';

    // Adiciona o título ao novo elemento bookContent
    titulo = document.createElement('h2'); // Cria o elemento h2
    titulo.textContent = `${livro.toUpperCase()}`;
    bookContent.appendChild(titulo); // Adiciona o h2 ao bookContent

    // Cria um elemento div para os botões de capítulos
    const capitulosContainer = document.createElement('div');
    capitulosContainer.classList.add('capitulos-container');
    capitulosContainer.appendChild(createCapitulosButtons(livro));

    // Adiciona os elementos div ao content
    bookContent.appendChild(capitulosContainer);
    content.appendChild(bookContent);
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
        button.textContent = `${i}`;
        button.classList.add('botao-versiculo'); // Aplica a classe de estilo
        button.addEventListener('click', () => {
            loadVersiculo(livro, capitulo, i);
        });
        versiculosContainer.appendChild(button);
    }

    versiculosContainer.dataset.livro = livro;
    versiculosContainer.dataset.capitulo = capitulo;

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

// Função para alternar a exibição dos capítulos e versículos
function toggleCapitulos(livro, capitulo) {
    const content = document.querySelector('.content');

    // Verifica se o capítulo já foi carregado
    const existingCapitulo = content.querySelector(`.versiculos[data-livro="${livro}"][data-capitulo="${capitulo}"]`);
    if (existingCapitulo) {
        existingCapitulo.remove(); // Remove o capítulo existente e seus versículos
        return; // Sai da função para evitar a exibição novamente
    }

    // Carrega e exibe os versículos do capítulo
    showVersiculos(livro, capitulo);
}

// Carrega a imagem da Bíblia assim que a página abre
window.onload = () => {
    const watermarkContainer = document.querySelector('.watermark');
    const img = document.createElement('img');
    img.src = 'biblia.png'; // Verifique se o caminho da imagem está correto!
    img.alt = "Marca d'água da Bíblia";
    img.classList.add('watermark-image'); // Adiciona a classe para estilizar
    watermarkContainer.appendChild(img); 
};











/* este esta aqui como exemplo. esse carrega a imagem, mas duplica os botões e texto
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

// Variável global para o elemento h2
let titulo = null;

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
    // Cria um novo elemento div para conter o conteúdo do livro
    const bookContent = document.createElement('div');
    bookContent.classList.add('book-content'); 

    // Cria um novo elemento para exibir o versículo
    const versiculoElement = document.createElement('div');
    versiculoElement.classList.add('versiculo');
    versiculoElement.classList.add('versiculo-texto'); // Adiciona a nova classe
    if (versiculoContent) {
        versiculoElement.appendChild(versiculoContent);
    } else {
        versiculoElement.textContent = 'Versículo não encontrado.';
    }
    bookContent.appendChild(versiculoElement);

    // Adiciona o novo elemento bookContent ao content
    content.appendChild(bookContent);

    // Atualiza o título
    titulo.textContent = `${livro.toUpperCase()} - CAPÍTULO ${capitulo} - VERSÍCULO ${versiculo}`;
}

// Função para exibir os versículos
function showVersiculos(livro, capitulo) {
    const content = document.querySelector('.content');
    // Cria um novo elemento div para conter o conteúdo do livro
    const bookContent = document.createElement('div');
    bookContent.classList.add('book-content'); 

    // Limpa o conteúdo de bookContent
    bookContent.innerHTML = '';

    // Adiciona o título ao novo elemento bookContent
    titulo.textContent = `${livro.toUpperCase()} - CAPÍTULO ${capitulo}`;

    // Adiciona os botões de versículos ao novo elemento bookContent
    bookContent.appendChild(createVersiculosButtons(livro, capitulo));

    // Adiciona o novo elemento bookContent ao content
    content.appendChild(bookContent);
}

// Função para carregar o livro
function loadBook(livro) { 
    const content = document.querySelector('.content');
    // Cria um novo elemento div para conter o conteúdo do livro
    const bookContent = document.createElement('div');
    bookContent.classList.add('book-content'); 

    // Limpa o conteúdo de bookContent
    bookContent.innerHTML = '';

    // Adiciona o título ao novo elemento bookContent
    titulo = document.createElement('h2'); // Cria o elemento h2
    titulo.textContent = `${livro.toUpperCase()}`;
    bookContent.appendChild(titulo); // Adiciona o h2 ao bookContent

    // Cria um elemento div para os botões de capítulos
    const capitulosContainer = document.createElement('div');
    capitulosContainer.classList.add('capitulos-container');
    capitulosContainer.appendChild(createCapitulosButtons(livro));

    // Adiciona os elementos div ao content
    bookContent.appendChild(capitulosContainer);
    content.appendChild(bookContent);
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
        // button.textContent = `Vers. ${i}`;
        button.textContent = ` ${i}`;
        button.classList.add('botao-versiculo'); // Aplica a classe de estilo
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

// Carrega a imagem da Bíblia assim que a página abre
window.onload = () => {
    const watermarkContainer = document.querySelector('.watermark');
    const img = document.createElement('img');
    img.src = 'biblia.png'; // Verifique se o caminho da imagem está correto!
    img.alt = "Marca d'água da Bíblia";
    img.classList.add('watermark-image'); // Adiciona a classe para estilizar
    watermarkContainer.appendChild(img); 
};*/



// os botoes estão funcionando e a opção do livro 020924 1728
/*const livros = {
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

let titulo = null;
let activeChapterButton = null; // Variável para rastrear o capítulo ativo
let activeBookLink = null; // Variável para rastrear o livro ativo

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
            toggleVersiculos(livro, i, capitulosContainer, button);
        });
        capitulosContainer.appendChild(button);
    }
    return capitulosContainer;
}

// Função para alternar a exibição dos versículos
function toggleVersiculos(livro, capitulo, capitulosContainer, button) {
    let existingVersiculos = capitulosContainer.nextElementSibling;

    // Se o mesmo botão de capítulo for clicado novamente, remova os botões dos versículos e o texto do versículo
    if (activeChapterButton === button) {
        if (existingVersiculos && existingVersiculos.classList.contains('versiculos')) {
            existingVersiculos.remove();
        }

        const existingVersiculoContent = document.querySelector('.versiculo');
        if (existingVersiculoContent) {
            existingVersiculoContent.remove();
        }

        activeChapterButton = null; // Reseta o capítulo ativo
    } else {
        // Se um novo botão de capítulo for clicado, exiba os versículos correspondentes
        if (existingVersiculos && existingVersiculos.classList.contains('versiculos')) {
            existingVersiculos.remove();
        }

        const existingVersiculoContent = document.querySelector('.versiculo');
        if (existingVersiculoContent) {
            existingVersiculoContent.remove();
        }

        const versiculosContainer = createVersiculosButtons(livro, capitulo);
        capitulosContainer.after(versiculosContainer);
        activeChapterButton = button; // Define o capítulo ativo
    }
}

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
            loadVersiculo(livro, capitulo, i);
        });
        versiculosContainer.appendChild(button);
    }
    return versiculosContainer;
}

// Função para carregar o conteúdo de um versículo específico
async function loadVersiculo(livro, capitulo, versiculo) {
    const response = await fetch(`${livro}/${capitulo}.html`);
    const html = await response.text();

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const versiculoContent = tempDiv.querySelector(`#versiculo-${versiculo}`);
    const content = document.querySelector('.content');

    // Verifica se o versículo já está sendo exibido e o substitui
    const existingVersiculo = content.querySelector('.versiculo');
    if (existingVersiculo) {
        existingVersiculo.remove();
    }

    const versiculoElement = document.createElement('div');
    versiculoElement.classList.add('versiculo');
    versiculoElement.classList.add('versiculo-texto');

    if (versiculoContent) {
        versiculoElement.appendChild(versiculoContent);
    } else {
        versiculoElement.textContent = 'Versículo não encontrado.';
    }

    content.appendChild(versiculoElement);

    titulo.textContent = `${livro.toUpperCase()} - CAPÍTULO ${capitulo} - VERSÍCULO ${versiculo}`;
}

// Função para carregar o livro
function loadBook(livro, linkElement) {
    const content = document.querySelector('.content');

    // Se o mesmo livro for clicado novamente, recolha a exibição dos capítulos
    if (activeBookLink === linkElement) {
        while (content.firstChild) {
            content.removeChild(content.firstChild);
        }
        activeBookLink = null; // Reseta o livro ativo
        activeChapterButton = null; // Reseta o capítulo ativo
    } else {
        // Remove o conteúdo existente antes de carregar novo livro
        while (content.firstChild) {
            content.removeChild(content.firstChild);
        }

        const bookContent = document.createElement('div');
        bookContent.classList.add('book-content');

        titulo = document.createElement('h2');
        titulo.textContent = `${livro.toUpperCase()}`;
        bookContent.appendChild(titulo);

        const capitulosContainer = createCapitulosButtons(livro);
        bookContent.appendChild(capitulosContainer);

        content.appendChild(bookContent);

        activeBookLink = linkElement; // Define o livro ativo
        activeChapterButton = null; // Reseta o capítulo ativo
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

// Adiciona eventos de clique aos links dos livros
const livrosLinks = document.querySelectorAll('.menu-livros a');
livrosLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const livro = link.dataset.livro;
        loadBook(livro, link);
    });
});

// Carrega a imagem da Bíblia assim que a página abre
window.onload = () => {
    const watermarkContainer = document.querySelector('.watermark');
    const img = document.createElement('img');
    img.src = 'biblia.png';
    img.alt = "Marca d'água da Bíblia";
    img.classList.add('watermark-image');
    watermarkContainer.appendChild(img); 
};
*/


/*/ aqui so ficou faltando a opção de recolher os livros ao clicar de novo e a imagem de fundo
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

let titulo = null;
let activeChapterButton = null; // Variável para rastrear o capítulo ativo

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
            toggleVersiculos(livro, i, capitulosContainer, button);
        });
        capitulosContainer.appendChild(button);
    }
    return capitulosContainer;
}

// Função para alternar a exibição dos versículos
function toggleVersiculos(livro, capitulo, capitulosContainer, button) {
    let existingVersiculos = capitulosContainer.nextElementSibling;

    // Se o mesmo botão for clicado novamente, remova os botões dos versículos e o texto do versículo
    if (activeChapterButton === button) {
        if (existingVersiculos && existingVersiculos.classList.contains('versiculos')) {
            existingVersiculos.remove();
        }

        const existingVersiculoContent = document.querySelector('.versiculo');
        if (existingVersiculoContent) {
            existingVersiculoContent.remove();
        }

        activeChapterButton = null; // Reseta o capítulo ativo
    } else {
        // Se um novo botão de capítulo for clicado, exiba os versículos correspondentes
        if (existingVersiculos && existingVersiculos.classList.contains('versiculos')) {
            existingVersiculos.remove();
        }

        const existingVersiculoContent = document.querySelector('.versiculo');
        if (existingVersiculoContent) {
            existingVersiculoContent.remove();
        }

        const versiculosContainer = createVersiculosButtons(livro, capitulo);
        capitulosContainer.after(versiculosContainer);
        activeChapterButton = button; // Define o capítulo ativo
    }
}

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
            loadVersiculo(livro, capitulo, i);
        });
        versiculosContainer.appendChild(button);
    }
    return versiculosContainer;
}

// Função para carregar o conteúdo de um versículo específico
async function loadVersiculo(livro, capitulo, versiculo) {
    const response = await fetch(`${livro}/${capitulo}.html`);
    const html = await response.text();

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const versiculoContent = tempDiv.querySelector(`#versiculo-${versiculo}`);
    const content = document.querySelector('.content');

    // Verifica se o versículo já está sendo exibido e o substitui
    const existingVersiculo = content.querySelector('.versiculo');
    if (existingVersiculo) {
        existingVersiculo.remove();
    }

    const versiculoElement = document.createElement('div');
    versiculoElement.classList.add('versiculo');
    versiculoElement.classList.add('versiculo-texto');

    if (versiculoContent) {
        versiculoElement.appendChild(versiculoContent);
    } else {
        versiculoElement.textContent = 'Versículo não encontrado.';
    }

    content.appendChild(versiculoElement);

    titulo.textContent = `${livro.toUpperCase()} - CAPÍTULO ${capitulo} - VERSÍCULO ${versiculo}`;
}

// Função para carregar o livro
function loadBook(livro) {
    const content = document.querySelector('.content');

    // Remove o conteúdo existente antes de carregar novo livro
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }

    const bookContent = document.createElement('div');
    bookContent.classList.add('book-content');

    titulo = document.createElement('h2');
    titulo.textContent = `${livro.toUpperCase()}`;
    bookContent.appendChild(titulo);

    const capitulosContainer = createCapitulosButtons(livro);
    bookContent.appendChild(capitulosContainer);

    content.appendChild(bookContent);
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

// Adiciona eventos de clique aos links dos livros
const livrosLinks = document.querySelectorAll('.menu-livros a');
livrosLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const livro = link.dataset.livro;
        loadBook(livro);
    });
});

// Carrega a imagem da Bíblia assim que a página abre
window.onload = () => {
    const watermarkContainer = document.querySelector('.watermark');
    const img = document.createElement('img');
    img.src = 'biblia.png';
    img.alt = "Marca d'água da Bíblia";
    img.classList.add('watermark-image');
    watermarkContainer.appendChild(img); 
};
*/



// recolhe os botões do versiculo ao clicar a segunda vez 020924 1620
/*const livros = {
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

let titulo = null;

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
            showVersiculos(livro, i, capitulosContainer);
        });
        capitulosContainer.appendChild(button);
    }
    return capitulosContainer;
}

// Função para exibir os versículos
function showVersiculos(livro, capitulo, capitulosContainer) {
    let existingVersiculos = capitulosContainer.nextElementSibling;

    // Remove os botões de versículos se já existirem
    if (existingVersiculos && existingVersiculos.classList.contains('versiculos')) {
        existingVersiculos.remove();
        return;
    }

    // Remove o conteúdo do versículo se os botões de versículos forem removidos
    const existingVersiculoContent = document.querySelector('.versiculo');
    if (existingVersiculoContent) {
        existingVersiculoContent.remove();
    }

    // Cria e exibe os botões dos versículos
    const versiculosContainer = createVersiculosButtons(livro, capitulo);
    capitulosContainer.after(versiculosContainer);
}

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
            loadVersiculo(livro, capitulo, i);
        });
        versiculosContainer.appendChild(button);
    }
    return versiculosContainer;
}

// Função para carregar o conteúdo de um versículo específico
async function loadVersiculo(livro, capitulo, versiculo) {
    const response = await fetch(`${livro}/${capitulo}.html`);
    const html = await response.text();

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const versiculoContent = tempDiv.querySelector(`#versiculo-${versiculo}`);
    const content = document.querySelector('.content');

    // Verifica se o versículo já está sendo exibido e o substitui
    const existingVersiculo = content.querySelector('.versiculo');
    if (existingVersiculo) {
        existingVersiculo.remove();
    }

    const versiculoElement = document.createElement('div');
    versiculoElement.classList.add('versiculo');
    versiculoElement.classList.add('versiculo-texto');

    if (versiculoContent) {
        versiculoElement.appendChild(versiculoContent);
    } else {
        versiculoElement.textContent = 'Versículo não encontrado.';
    }

    content.appendChild(versiculoElement);

    titulo.textContent = `${livro.toUpperCase()} - CAPÍTULO ${capitulo} - VERSÍCULO ${versiculo}`;
}

// Função para carregar o livro
function loadBook(livro) {
    const content = document.querySelector('.content');

    // Remove o conteúdo existente antes de carregar novo livro
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }

    const bookContent = document.createElement('div');
    bookContent.classList.add('book-content');

    titulo = document.createElement('h2');
    titulo.textContent = `${livro.toUpperCase()}`;
    bookContent.appendChild(titulo);

    const capitulosContainer = createCapitulosButtons(livro);
    bookContent.appendChild(capitulosContainer);

    content.appendChild(bookContent);
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

// Adiciona eventos de clique aos links dos livros
const livrosLinks = document.querySelectorAll('.menu-livros a');
livrosLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const livro = link.dataset.livro;
        loadBook(livro);
    });
});

// Carrega a imagem da Bíblia assim que a página abre
window.onload = () => {
    const watermarkContainer = document.querySelector('.watermark');
    const img = document.createElement('img');
    img.src = 'biblia.png';
    img.alt = "Marca d'água da Bíblia";
    img.classList.add('watermark-image');
    watermarkContainer.appendChild(img); 
};
*/

// ao clicar a segunda vez a exibição some 020924 1616
/*const livros = {
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

let titulo = null;

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
            showVersiculos(livro, i, capitulosContainer);
        });
        capitulosContainer.appendChild(button);
    }
    return capitulosContainer;
}

// Função para exibir os versículos
function showVersiculos(livro, capitulo, capitulosContainer) {
    let existingVersiculos = capitulosContainer.nextElementSibling;

    // Remove os botões de versículos se já existirem
    if (existingVersiculos && existingVersiculos.classList.contains('versiculos')) {
        existingVersiculos.remove();
        return;
    }

    // Cria e exibe os botões dos versículos
    const versiculosContainer = createVersiculosButtons(livro, capitulo);
    capitulosContainer.after(versiculosContainer);
}

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
            loadVersiculo(livro, capitulo, i);
        });
        versiculosContainer.appendChild(button);
    }
    return versiculosContainer;
}

// Função para carregar o conteúdo de um versículo específico
async function loadVersiculo(livro, capitulo, versiculo) {
    const response = await fetch(`${livro}/${capitulo}.html`);
    const html = await response.text();

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const versiculoContent = tempDiv.querySelector(`#versiculo-${versiculo}`);
    const content = document.querySelector('.content');

    // Verifica se o versículo já está sendo exibido
    const existingVersiculo = content.querySelector('.versiculo');
    if (existingVersiculo) {
        existingVersiculo.remove();
        return;
    }

    const versiculoElement = document.createElement('div');
    versiculoElement.classList.add('versiculo');
    versiculoElement.classList.add('versiculo-texto');

    if (versiculoContent) {
        versiculoElement.appendChild(versiculoContent);
    } else {
        versiculoElement.textContent = 'Versículo não encontrado.';
    }

    content.appendChild(versiculoElement);

    titulo.textContent = `${livro.toUpperCase()} - CAPÍTULO ${capitulo} - VERSÍCULO ${versiculo}`;
}

// Função para carregar o livro
function loadBook(livro) {
    const content = document.querySelector('.content');

    // Remove o conteúdo existente antes de carregar novo livro
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }

    const bookContent = document.createElement('div');
    bookContent.classList.add('book-content');

    titulo = document.createElement('h2');
    titulo.textContent = `${livro.toUpperCase()}`;
    bookContent.appendChild(titulo);

    const capitulosContainer = createCapitulosButtons(livro);
    bookContent.appendChild(capitulosContainer);

    content.appendChild(bookContent);
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

// Adiciona eventos de clique aos links dos livros
const livrosLinks = document.querySelectorAll('.menu-livros a');
livrosLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const livro = link.dataset.livro;
        loadBook(livro);
    });
});

// Carrega a imagem da Bíblia assim que a página abre
window.onload = () => {
    const watermarkContainer = document.querySelector('.watermark');
    const img = document.createElement('img');
    img.src = 'biblia.png';
    img.alt = "Marca d'água da Bíblia";
    img.classList.add('watermark-image');
    watermarkContainer.appendChild(img); 
};*/




// esta duplicando ao clicar a segunda vez na opção
// Armazena os capítulos e versículos de cada livro da Bíblia
/*const livros = {
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

// Variável global para o elemento h2
let titulo = null;

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
    // Cria um novo elemento div para conter o conteúdo do livro
    const bookContent = document.createElement('div');
    bookContent.classList.add('book-content'); 

    // Cria um novo elemento para exibir o versículo
    const versiculoElement = document.createElement('div');
    versiculoElement.classList.add('versiculo');
    versiculoElement.classList.add('versiculo-texto'); // Adiciona a nova classe
    if (versiculoContent) {
        versiculoElement.appendChild(versiculoContent);
    } else {
        versiculoElement.textContent = 'Versículo não encontrado.';
    }
    bookContent.appendChild(versiculoElement);

    // Adiciona o novo elemento bookContent ao content
    content.appendChild(bookContent);

    // Atualiza o título
    titulo.textContent = `${livro.toUpperCase()} - CAPÍTULO ${capitulo} - VERSÍCULO ${versiculo}`;
}

// Função para exibir os versículos
function showVersiculos(livro, capitulo) {
    const content = document.querySelector('.content');
    // Cria um novo elemento div para conter o conteúdo do livro
    const bookContent = document.createElement('div');
    bookContent.classList.add('book-content'); 

    // Limpa o conteúdo de bookContent
    bookContent.innerHTML = '';

    // Adiciona o título ao novo elemento bookContent
    titulo.textContent = `${livro.toUpperCase()} - CAPÍTULO ${capitulo}`;

    // Adiciona os botões de versículos ao novo elemento bookContent
    bookContent.appendChild(createVersiculosButtons(livro, capitulo));

    // Adiciona o novo elemento bookContent ao content
    content.appendChild(bookContent);
}

// Função para carregar o livro
function loadBook(livro) { 
    const content = document.querySelector('.content');
    // Cria um novo elemento div para conter o conteúdo do livro
    const bookContent = document.createElement('div');
    bookContent.classList.add('book-content'); 

    // Limpa o conteúdo de bookContent
    bookContent.innerHTML = '';

    // Adiciona o título ao novo elemento bookContent
    titulo = document.createElement('h2'); // Cria o elemento h2
    titulo.textContent = `${livro.toUpperCase()}`;
    bookContent.appendChild(titulo); // Adiciona o h2 ao bookContent

    // Cria um elemento div para os botões de capítulos
    const capitulosContainer = document.createElement('div');
    capitulosContainer.classList.add('capitulos-container');
    capitulosContainer.appendChild(createCapitulosButtons(livro));

    // Adiciona os elementos div ao content
    bookContent.appendChild(capitulosContainer);
    content.appendChild(bookContent);
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
        // button.textContent = `Vers. ${i}`;
        button.textContent = ` ${i}`;
        button.classList.add('botao-versiculo'); // Aplica a classe de estilo
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

// Carrega a imagem da Bíblia assim que a página abre
window.onload = () => {
    const watermarkContainer = document.querySelector('.watermark');
    const img = document.createElement('img');
    img.src = 'biblia.png'; // Verifique se o caminho da imagem está correto!
    img.alt = "Marca d'água da Bíblia";
    img.classList.add('watermark-image'); // Adiciona a classe para estilizar
    watermarkContainer.appendChild(img); 
};
*/





/*/ esse duplica os botões dos versiculo mas a imagem permanece 310824 1830
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
    // Cria um novo elemento div para conter o conteúdo do livro
    const bookContent = document.createElement('div');
    bookContent.classList.add('book-content'); 
    bookContent.innerHTML = `<h2>${livro.toUpperCase()} - CAPÍTULO ${capitulo} - VERSÍCULO ${versiculo}</h2>`;

    // Adiciona os botões de versículos ao novo elemento bookContent
    bookContent.appendChild(createVersiculosButtons(livro, capitulo));

    // Adiciona o novo elemento bookContent ao content
    content.appendChild(bookContent);
    
    // Cria um novo elemento para exibir o versículo
    const versiculoElement = document.createElement('div');
    versiculoElement.classList.add('versiculo');
    versiculoElement.classList.add('versiculo-texto'); // Adiciona a nova classe
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
    // Cria um novo elemento div para conter o conteúdo do livro
    const bookContent = document.createElement('div');
    bookContent.classList.add('book-content'); 
    bookContent.innerHTML = `<h2>${livro.toUpperCase()} - CAPÍTULO ${capitulo}</h2>`;

    // Adiciona os botões de versículos ao novo elemento bookContent
    bookContent.appendChild(createVersiculosButtons(livro, capitulo));

    // Adiciona o novo elemento bookContent ao content
    content.appendChild(bookContent);
}

// Função para carregar o livro
function loadBook(livro) {
    const content = document.querySelector('.content');
    // Cria um novo elemento div para conter o conteúdo do livro
    const bookContent = document.createElement('div');
    bookContent.classList.add('book-content'); 
    bookContent.innerHTML = `<h2>${livro.toUpperCase()}</h2>`;

    // Cria um elemento div para os botões de capítulos
    const capitulosContainer = document.createElement('div');
    capitulosContainer.classList.add('capitulos-container');
    capitulosContainer.appendChild(createCapitulosButtons(livro));

    // Adiciona os elementos div ao content
    bookContent.appendChild(capitulosContainer);
    content.appendChild(bookContent);
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
        // button.textContent = `Vers. ${i}`;
        button.textContent = ` ${i}`;
        button.classList.add('botao-versiculo'); // Aplica a classe de estilo
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

// Carrega a imagem da Bíblia assim que a página abre
window.onload = () => {
    const watermarkContainer = document.querySelector('.watermark');
    const img = document.createElement('img');
    img.src = 'biblia.png'; // Verifique se o caminho da imagem está correto!
    img.alt = "Marca d'água da Bíblia";
    img.classList.add('watermark-image'); // Adiciona a classe para estilizar
    watermarkContainer.appendChild(img); 
};
*/



// Armazena os capítulos e versículos de cada livro da Bíblia
/*const livros = {
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
    // Cria um novo elemento div para conter o conteúdo do livro
    const bookContent = document.createElement('div');
    bookContent.classList.add('book-content'); 
    bookContent.innerHTML = `<h2>${livro.toUpperCase()} - CAPÍTULO ${capitulo} - VERSÍCULO ${versiculo}</h2>`;

    // Adiciona os botões ao novo elemento bookContent
    bookContent.appendChild(createCapitulosButtons(livro));
    bookContent.appendChild(createVersiculosButtons(livro, capitulo));

    // Adiciona o novo elemento bookContent ao content
    content.appendChild(bookContent);
    
    // Cria um novo elemento para exibir o versículo
    const versiculoElement = document.createElement('div');
    versiculoElement.classList.add('versiculo');
    versiculoElement.classList.add('versiculo-texto'); // Adiciona a nova classe
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
    // Cria um novo elemento div para conter o conteúdo do livro
    const bookContent = document.createElement('div');
    bookContent.classList.add('book-content'); 
    bookContent.innerHTML = `<h2>${livro.toUpperCase()} - CAPÍTULO ${capitulo}</h2>`;

    // Adiciona os botões ao novo elemento bookContent
    bookContent.appendChild(createCapitulosButtons(livro));
    bookContent.appendChild(createVersiculosButtons(livro, capitulo));

    // Adiciona o novo elemento bookContent ao content
    content.appendChild(bookContent);
}

// Função para carregar o livro
function loadBook(livro) {
    const content = document.querySelector('.content');
    // Cria um novo elemento div para conter o conteúdo do livro
    const bookContent = document.createElement('div');
    bookContent.classList.add('book-content'); 
    bookContent.innerHTML = `<h2>${livro.toUpperCase()}</h2>`;

    // Adiciona os botões ao novo elemento bookContent
    bookContent.appendChild(createCapitulosButtons(livro));

    // Adiciona o novo elemento bookContent ao content
    content.appendChild(bookContent);
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
        // button.textContent = `Vers. ${i}`;
        button.textContent = ` ${i}`;
        button.classList.add('botao-versiculo'); // Aplica a classe de estilo
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

// Carrega a imagem da Bíblia assim que a página abre
window.onload = () => {
    const watermarkContainer = document.querySelector('.watermark');
    const img = document.createElement('img');
    img.src = 'biblia.png'; // Verifique se o caminho da imagem está correto!
    img.alt = "Marca d'água da Bíblia";
    img.classList.add('watermark-image'); // Adiciona a classe para estilizar
    watermarkContainer.appendChild(img); 
};*/




/* 310824 1819
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
    versiculoElement.classList.add('versiculo-texto'); // Adiciona a nova classe
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
        // button.textContent = `Vers. ${i}`;
        button.textContent = ` ${i}`;
        button.classList.add('botao-versiculo'); // Aplica a classe de estilo
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

/* ---- */

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