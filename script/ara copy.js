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
    "neemias": {
        "capitulos": 13
    },
    "ester": {
        "capitulos": 10
    },
    "jo": {
        "capitulos": 42
    },
    "salmos": {
        "capitulos": 150
    },
    "proverbios": {
        "capitulos": 31
    },
    "eclesiastes": {
        "capitulos": 12
    },
    "cantares": {
        "capitulos": 8
    },
    "isaias": {
        "capitulos": 66
    },
    "jeremias": {
        "capitulos": 52
    },
    "lamentacoes": {
        "capitulos": 5
    },
    "ezequiel": {
        "capitulos": 48
    },
    "daniel": {
        "capitulos": 12
    },
    "oseias": {
        "capitulos": 14
    },
    "joel": {
        "capitulos": 3
    },
    "amos": {
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
    "joao": {
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
    "galatas": {
        "capitulos": 6
    },
    "efesios": {
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
    "1timoteo": {
        "capitulos": 6
    },
    "2timoteo": {
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
    "1joao": {
        "capitulos": 5
    },
    "2joao": {
        "capitulos": 1
    },
    "3joao": {
        "capitulos": 1
    },
    "judas": {
        "capitulos": 1
    },
    "apocalipse": {
        "capitulos": 22
    }
};

// O bloco abaixo cria as variáveis globais para o elemento H2, livro e botões dos versículos ativo
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
    // Modificado para carregar arquivos JSON da pasta \biblia\version\ara\
    const response = await fetch(`../../version/ara/${livro}/${capitulo}.json`);
    const data = await response.json();
    
    const content = document.querySelector('.content');

    // O trecho abaixo remove qualquer texto de versículo que tiver sendo exibido
    const existingVersiculo = content.querySelector('.versiculo-texto');
    if (existingVersiculo) {
        existingVersiculo.remove();
    }

    const versiculoElement = document.createElement('div');
    versiculoElement.classList.add('versiculo', 'versiculo-texto');
    
    // Verifica se o versículo existe no objeto JSON
    if (data.versiculos && data.versiculos[versiculo]) {
        // Cria um elemento para exibir o texto do versículo
        const versiculoText = document.createElement('p');
        versiculoText.id = `versiculo-${versiculo}`;
        versiculoText.textContent = data.versiculos[versiculo];
        versiculoElement.appendChild(versiculoText);
        
        // Verifica se há um título para este versículo
        if (data.titulos && data.titulos[versiculo]) {
            const tituloElement = document.createElement('h3');
            tituloElement.textContent = data.titulos[versiculo];
            versiculoElement.insertBefore(tituloElement, versiculoText);
        }
    } else {
        versiculoElement.textContent = 'Versículo não encontrado.';
    }

    content.appendChild(versiculoElement);
    titulo.textContent = `${livro.toUpperCase()} - CAPÍTULO ${capitulo} - VERSÍCULO ${versiculo}`;
}

// O bloco abaixo cria a função para exibir/ocultar os versículos
function toggleVersiculos(livro, capitulo) {
    const content = document.querySelector('.content');

    
    // O trecho abaixo remove o texto "SOBRE" se estiver sendo exibido
    const existingSobre = content.querySelector('.sobre-content');
    if (existingSobre) {
        existingSobre.remove();
    }
    
    // O trecho abaixo procura por elementos dos versículos ou capítulos existentes
    const existingVersiculos = content.querySelector(`.versiculos-${livro}-${capitulo}`);
    const allVersiculos = content.querySelectorAll('.book-content');

    // O trecho abaixo verifica se os versículos já estiverem visíveis e remove ao clicar pela segunda vez
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

        // O trecho abaixo remove o texto do versículo quando um novo capítulo é selecionado
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

// Remove o texto "SOBRE" se estiver presente
const existingSobre = content.querySelector('.sobre-content');
if (existingSobre) {
    existingSobre.remove();
}

// O trecho abaixo verifica se o livro selecionado é o mesmo que está ativo
if (activeLivro === livro) {
    // O trecho abaixo verifica se e o mesmo livro, caso seja remove apenas os capítulos e versículos e mantem a imagem de fundo em marca d'água
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

// O trecho abaixo limpa o conteúdo anterior, exceto a imagem em marca d'água
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

    // O trecho abaixo remove qualquer texto "SOBRE" se estiver sendo exibido
    const content = document.querySelector('.content');
        const existingSobre = content.querySelector('.sobre-content');
        if (existingSobre) {
            existingSobre.remove();
        }

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
        //Antigo testamento
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
        "exodo": {
            1: 22,
            2: 25,
            3: 22,
            4: 31,
            5: 23,
            6: 30,
            7: 25,
            8: 32,
            9: 35,
            10: 29,
            11: 10,
            12: 51,
            13: 22,
            14: 31,
            15: 27,
            16: 36,
            17: 16,
            18: 27,
            19: 25,
            20: 26,
            21: 36,
            22: 31,
            23: 33,
            24: 18,
            25: 40,
            26: 37,
            27: 21,
            28: 43,
            29: 46,
            30: 38,
            31: 18,
            32: 35,
            33: 23,
            34: 35,
            35: 35,
            36: 38,
            37: 29,
            38: 31,
            39: 43,
            40: 38
        },
        "levitico": {
            1: 17,
            2: 16,
            3: 17,
            4: 35,
            5: 19,
            6: 30,
            7: 38,
            8: 36,
            9: 24,
            10: 20,
            11: 47,
            12: 8,
            13: 59,
            14: 57,
            15: 33,
            16: 34,
            17: 16,
            18: 30,
            19: 37,
            20: 27,
            21: 24,
            22: 33,
            23: 44,
            24: 23,
            25: 55,
            26: 46,
            27: 34
        },
        "numeros": {
            1: 54,
            2: 34,
            3: 51,
            4: 49,
            5: 31,
            6: 27,
            7: 89,
            8: 26,
            9: 23,
            10: 36,
            11: 35,
            12: 16,
            13: 33,
            14: 45,
            15: 41,
            16: 50,
            17: 13,
            18: 32,
            19: 22,
            20: 29,
            21: 35,
            22: 41,
            23: 30,
            24: 25,
            25: 18,
            26: 65,
            27: 23,
            28: 31,
            29: 40,
            30: 16,
            31: 54,
            32: 42,
            33: 56,
            34: 29,
            35: 34,
            36: 13
        },
        "deuteronomio": {
            1: 46,
            2: 37,
            3: 29,
            4: 49,
            5: 33,
            6: 25,
            7: 26,
            8: 20,
            9: 29,
            10: 22,
            11: 32,
            12: 32,
            13: 18,
            14: 29,
            15: 23,
            16: 17,
            17: 20,
            18: 22,
            19: 21,
            20: 20,
            21: 23,
            22: 30,
            23: 25,
            24: 22,
            25: 19,
            26: 19,
            27: 26,
            28: 68,
            29: 29,
            30: 20,
            31: 30,
            32: 52,
            33: 29,
            34: 12
        },
        "josue": {
            1: 18,
            2: 24,
            3: 17,
            4: 24,
            5: 15,
            6: 27,
            7: 26,
            8: 35,
            9: 27,
            10: 43,
            11: 23,
            12: 24,
            13: 33,
            14: 15,
            15: 63,
            16: 10,
            17: 18,
            18: 28,
            19: 51,
            20: 9,
            21: 45,
            22: 34,
            23: 16,
            24: 33
        },
        "juizes": {
            1: 36,
            2: 23,
            3: 31,
            4: 24,
            5: 31,
            6: 40,
            7: 25,
            8: 35,
            9: 57,
            10: 18,
            11: 40,
            12: 15,
            13: 25,
            14: 20,
            15: 20,
            16: 31,
            17: 13,
            18: 31,
            19: 30,
            20: 48,
            21: 25
        },
        "rute": {
            1: 22,
            2: 23,
            3: 18,
            4: 22
        },
        "1samuel": {
            1: 28,
            2: 36,
            3: 21,
            4: 22,
            5: 12,
            6: 21,
            7: 17,
            8: 22,
            9: 27,
            10: 27,
            11: 15,
            12: 25,
            13: 23,
            14: 52,
            15: 35,
            16: 23,
            17: 58,
            18: 30,
            19: 24,
            20: 42,
            21: 15,
            22: 23,
            23: 29,
            24: 22,
            25: 44,
            26: 25,
            27: 12,
            28: 25,
            29: 11,
            30: 31,
            31: 13
        },
        "2samuel": {
            1: 27,
            2: 32,
            3: 39,
            4: 12,
            5: 25,
            6: 23,
            7: 29,
            8: 18,
            9: 13,
            10: 19,
            11: 27,
            12: 31,
            13: 39,
            14: 33,
            15: 37,
            16: 23,
            17: 29,
            18: 33,
            19: 43,
            20: 26,
            21: 22,
            22: 51,
            23: 39,
            24: 25
        },
        "1reis": {
            1: 53,
            2: 46,
            3: 28,
            4: 34,
            5: 32,
            6: 38,
            7: 51,
            8: 66,
            9: 28,
            10: 29,
            11: 43,
            12: 33,
            13: 34,
            14: 31,
            15: 34,
            16: 34,
            17: 24,
            18: 46,
            19: 21,
            20: 43,
            21: 29,
            22: 53,
            23: 30,
            24: 20
        },
        "2reis": {
            1: 18,
            2: 25,
            3: 27,
            4: 44,
            5: 27,
            6: 33,
            7: 20,
            8: 29,
            9: 37,
            10: 36,
            11: 21,
            12: 21,
            13: 25,
            14: 29,
            15: 37,
            16: 20,
            17: 41,
            18: 37,
            19: 37,
            20: 21,
            21: 26,
            22: 20,
            23: 37,
            24: 20,
            25: 30
        },
        "1cronicas": {
            1: 54,
            2: 55,
            3: 24,
            4: 43,
            5: 26,
            6: 81,
            7: 40,
            8: 40,
            9: 44,
            10: 14,
            11: 47,
            12: 40,
            13: 14,
            14: 17,
            15: 29,
            16: 43,
            17: 27,
            18: 17,
            19: 19,
            20: 8,
            21: 30,
            22: 19,
            23: 32,
            24: 31,
            25: 31,
            26: 32,
            27: 34,
            28: 21,
            29: 30
        },
        "2cronicas": {
            1: 17,
            2: 18,
            3: 17,
            4: 22,
            5: 14,
            6: 42,
            7: 22,
            8: 18,
            9: 31,
            10: 19,
            11: 23,
            12: 16,
            13: 22,
            14: 15,
            15: 19,
            16: 14,
            17: 20,
            18: 34,
            19: 11,
            20: 37,
            21: 20,
            22: 12,
            23: 21,
            24: 27,
            25: 28,
            26: 23,
            27: 9,
            28: 27,
            29: 36,
            30: 27,
            31: 21,
            32: 33,
            33: 25
        },
        "esdras": {
            1: 11,
            2: 70,
            3: 13,
            4: 24,
            5: 17,
            6: 22,
            7: 28,
            8: 36,
            9: 15,
            10: 44
        },
        "neemias": {
            1: 11,
            2: 20,
            3: 32,
            4: 23,
            5: 19,
            6: 19,
            7: 73,
            8: 18,
            9: 38,
            10: 39,
            11: 36,
            12: 47,
            13: 31
        },
        "ester": {
            1: 22,
            2: 23,
            3: 15,
            4: 17,
            5: 14,
            6: 14,
            7: 10,
            8: 17,
            9: 32,
            10: 3
        },
        "jo": {
            1: 22,
            2: 11,
            3: 12,
            4: 21,
            5: 27,
            6: 15,
            7: 21,
            8: 22,
            9: 31,
            10: 22,
            11: 28,
            12: 14,
            13: 28,
            14: 22,
            15: 24,
            16: 24,
            17: 27,
            18: 22,
            19: 29,
            20: 30,
            21: 25,
            22: 30,
            23: 29,
            24: 17,
            25: 24,
            26: 23,
            27: 22,
            28: 26,
            29: 27,
            30: 31,
            31: 31
        },
        "salmos": {
            1: 6,
            2: 12,
            3: 8,
            4: 8,
            5: 12,
            6: 10,
            7: 17,
            8: 9,
            9: 20,
            10: 18,
            11: 7,
            12: 8,
            13: 6,
            14: 7,
            15: 5,
            16: 11,
            17: 15,
            18: 50,
            19: 14,
            20: 9,
            21: 13,
            22: 31,
            23: 6,
            24: 10,
            25: 22,
            26: 12,
            27: 14,
            28: 9,
            29: 11,
            30: 12,
            31: 24,
            32: 11,
            33: 22,
            34: 22,
            35: 28,
            36: 12,
            37: 40,
            38: 22,
            39: 13,
            40: 17,
            41: 13,
            42: 11,
            43: 5,
            44: 26,
            45: 17,
            46: 11,
            47: 9,
            48: 14,
            49: 20,
            50: 23,
            51: 19,
            52: 9,
            53: 6,
            54: 7,
            55: 23,
            56: 13,
            57: 11,
            58: 11,
            59: 17,
            60: 12,
            61: 8,
            62: 12,
            63: 11,
            64: 10,
            65: 13,
            66: 20,
            67: 7,
            68: 36,
            69: 36,
            70: 5,
            71: 24,
            72: 20,
            73: 28,
            74: 23,
            75: 10,
            76: 12,
            77: 20,
            78: 72,
            79: 13,
            80: 19,
            81: 16,
            82: 8,
            83: 18,
            84: 12,
            85: 13,
            86: 17,
            87: 7,
            88: 18,
            89: 52,
            90: 17,
            91: 16,
            92: 15,
            93: 5,
            94: 23,
            95: 11,
            96: 13,
            97: 12,
            98: 9,
            99: 9,
            100: 5,
            101: 8,
            102: 28,
            103: 22,
            104: 35,
            105: 45,
            106: 48,
            107: 43,
            108: 13,
            109: 31,
            110: 7,
            111: 10,
            112: 10,
            113: 9,
            114: 8,
            115: 18,
            116: 19,
            117: 2,
            118: 29,
            119: 176,
            120: 7,
            121: 8,
            122: 9,
            123: 4,
            124: 8,
            125: 5,
            126: 6,
            127: 5,
            128: 6,
            129: 8,
            130: 8,
            131: 3,
            132: 18,
            133: 3,
            134: 3,
            135: 21,
            136: 26,
            137: 9,
            138: 8,
            139: 24,
            140: 13,
            141: 10,
            142: 7,
            143: 12,
            144: 15,
            145: 21,
            146: 10,
            147: 20,
            148: 14,
            149: 9,
            150: 6
        },
        "proverbios": {
            1: 33,
            2: 22,
            3: 35,
            4: 27,
            5: 23,
            6: 35,
            7: 27,
            8: 36,
            9: 18,
            10: 32,
            11: 31,
            12: 28,
            13: 25,
            14: 35,
            15: 33,
            16: 33,
            17: 28,
            18: 24,
            19: 29,
            20: 30,
            21: 31,
            22: 29,
            23: 35,
            24: 34,
            25: 28,
            26: 28,
            27: 27,
            28: 28,
            29: 27,
            30: 33,
            31: 31
        },
        "eclesiastes": {
            1: 18,
            2: 26,
            3: 22,
            4: 16,
            5: 20,
            6: 12,
            7: 29,
            8: 17,
            9: 18,
            10: 20,
            11: 10,
            12: 14
        },
        "cantares": {
            1: 17,
            2: 17,
            3: 11,
            4: 16,
            5: 16,
            6: 13,
            7: 13,
            8: 14
        },
        "isaias": {
            1: 31,
            2: 22,
            3: 26,
            4: 6,
            5: 30,
            6: 13,
            7: 25,
            8: 22,
            9: 21,
            10: 34,
            11: 16,
            12: 6,
            13: 22,
            14: 32,
            15: 9,
            16: 14,
            17: 14,
            18: 7,
            19: 25,
            20: 6,
            21: 17,
            22: 25,
            23: 18,
            24: 23,
            25: 12,
            26: 21,
            27: 13,
            28: 29,
            29: 24,
            30: 33,
            31: 9,
            32: 20,
            33: 24,
            34: 17,
            35: 10,
            36: 22,
            37: 38,
            38: 22,
            39: 8,
            40: 31,
            41: 29,
            42: 25,
            43: 28,
            44: 28,
            45: 25,
            46: 13,
            47: 15,
            48: 22,
            49: 26,
            50: 11,
            51: 23,
            52: 15,
            53: 12,
            54: 17,
            55: 13,
            56: 12,
            57: 21,
            58: 14,
            59: 21,
            60: 22,
            61: 11,
            62: 12,
            63: 19,
            64: 12,
            65: 25,
            66: 24
        },
        "jeremias": {
            1: 19,
            2: 37,
            3: 66,
            4: 31,
            5: 31,
            6: 30,
            7: 34,
            8: 22,
            9: 26,
            10: 25,
            11: 23,
            12: 17,
            13: 27,
            14: 22,
            15: 21,
            16: 21,
            17: 27,
            18: 23,
            19: 15,
            20: 18,
            21: 14,
            22: 30,
            23: 40,
            24: 10,
            25: 38,
            26: 24,
            27: 22,
            28: 17,
            29: 32,
            30: 24,
            31: 40,
            32: 44,
            33: 26,
            34: 22,
            35: 19,
            36: 32,
            37: 21,
            38: 28,
            39: 18,
            40: 16,
            41: 18,
            42: 22,
            43: 13,
            44: 30,
            45: 5,
            46: 28,
            47: 7,
            48: 47,
            49: 39,
            50: 46,
            51: 64,
            52: 34
        },
        "lamentacoes": {
            1: 22,
            2: 22,
            3: 66,
            4: 22,
            5: 22
        },
        "ezequiel": {
            1: 28,
            2: 10,
            3: 27,
            4: 17,
            5: 17,
            6: 14,
            7: 27,
            8: 18,
            9: 11,
            10: 22,
            11: 25,
            12: 28,
            13: 23,
            14: 23,
            15: 8,
            16: 63,
            17: 24,
            18: 32,
            19: 14,
            20: 44,
            21: 32,
            22: 31,
            23: 49,
            24: 27,
            25: 17,
            26: 21,
            27: 36,
            28: 26,
            29: 21,
            30: 26,
            31: 18,
            32: 32,
            33: 33,
            34: 31,
            35: 15,
            36: 38,
            37: 28,
            38: 23,
            39: 29,
            40: 49,
            41: 26,
            42: 20,
            43: 27,
            44: 31,
            45: 25,
            46: 24,
            47: 23,
            48: 35
        },
        "daniel": {
            1: 21,
            2: 49,
            3: 30,
            4: 37,
            5: 31,
            6: 28,
            7: 28,
            8: 27,
            9: 27,
            10: 21,
            11: 45,
            12: 13
        },
        "oseias": {
            1: 11,
            2: 23,
            3: 5,
            4: 19,
            5: 15,
            6: 11,
            7: 16,
            8: 14,
            9: 17,
            10: 15,
            11: 12,
            12: 14,
            13: 16,
            14: 9
        },
        "joel": {
            1: 20,
            2: 32,
            3: 21
        },
        "amos": {
            1: 15,
            2: 16,
            3: 15,
            4: 13,
            5: 27,
            6: 14,
            7: 17,
            8: 14,
            9: 15
        },
        "abdias": {
            1: 21
        },
        "jonas": {
            1: 17,
            2: 10,
            3: 10,
            4: 11
        },
        "miqueias": {
            1: 16,
            2: 13,
            3: 12,
            4: 13,
            5: 15,
            6: 16,
            7: 20
        },
        "naum": {
            1: 15,
            2: 13,
            3: 19
        },
        "habacuque": {
            1: 17,
            2: 20,
            3: 19
        },
        "safonias": {
            1: 18,
            2: 15,
            3: 20
        },
        "ageu": {
            1: 15,
            2: 23
        },
        "zacarias": {
            1: 21,
            2: 13,
            3: 10,
            4: 14,
            5: 11,
            6: 15,
            7: 14,
            8: 23,
            9: 17,
            10: 12,
            11: 17,
            12: 14,
            13: 9,
            14: 21
        },
        "malaquias": {
            1: 14,
            2: 17,
            3: 18,
            4: 6
        },
        //Novo testamento
        "mateus": {
            1: 25,
            2: 23,
            3: 17,
            4: 25,
            5: 48,
            6: 34,
            7: 29,
            8: 34,
            9: 38,
            10: 42,
            11: 30,
            12: 50,
            13: 58,
            14: 36,
            15: 39,
            16: 28,
            17: 27,
            18: 35,
            19: 30,
            20: 34,
            21: 46,
            22: 46,
            23: 39,
            24: 51,
            25: 46,
            26: 75,
            27: 66,
            28: 20
        },
        "marcos": {
            1: 45,
            2: 28,
            3: 35,
            4: 41,
            5: 43,
            6: 56,
            7: 37,
            8: 38,
            9: 50,
            10: 52,
            11: 33,
            12: 44,
            13: 37,
            14: 72,
            15: 47,
            16: 20
        },
        "lucas": {
            1: 80,
            2: 52,
            3: 38,
            4: 44,
            5: 39,
            6: 49,
            7: 50,
            8: 56,
            9: 62,
            10: 42,
            11: 54,
            12: 59,
            13: 35,
            14: 35,
            15: 32,
            16: 31,
            17: 37,
            18: 43,
            19: 48,
            20: 47,
            21: 38,
            22: 71,
            23: 56,
            24: 53
        },
        "joao": {
            1: 51,
            2: 25,
            3: 36,
            4: 54,
            5: 47,
            6: 71,
            7: 53,
            8: 59,
            9: 41,
            10: 42,
            11: 57,
            12: 50,
            13: 38,
            14: 31,
            15: 27,
            16: 33,
            17: 26,
            18: 40,
            19: 42,
            20: 31,
            21: 25
        },
        "atos": {
            1: 26,
            2: 47,
            3: 26,
            4: 37,
            5: 42,
            6: 15,
            7: 60,
            8: 40,
            9: 43,
            10: 48,
            11: 30,
            12: 25,
            13: 52,
            14: 28,
            15: 41,
            16: 40,
            17: 34,
            18: 28,
            19: 41,
            20: 38,
            21: 40,
            22: 30,
            23: 35,
            24: 27,
            25: 27,
            26: 32,
            27: 44,
            28: 31
        },
        "romanos": {
            1: 32,
            2: 29,
            3: 31,
            4: 25,
            5: 21,
            6: 23,
            7: 25,
            8: 39,
            9: 33,
            10: 21,
            11: 36,
            12: 21,
            13: 14,
            14: 23,
            15: 33,
            16: 27
        },
        "1corintios": {
            1: 31,
            2: 16,
            3: 23,
            4: 21,
            5: 13,
            6: 20,
            7: 40,
            8: 13,
            9: 27,
            10: 33,
            11: 34,
            12: 31,
            13: 13,
            14: 40,
            15: 58,
            16: 24
        },
        "2corintios": {
            1: 24,
            2: 17,
            3: 18,
            4: 18,
            5: 21,
            6: 18,
            7: 16,
            8: 24,
            9: 15,
            10: 18,
            11: 33,
            12: 21,
            13: 14
        },
        "galatas": {
            1: 24,
            2: 21,
            3: 29,
            4: 31,
            5: 26,
            6: 18
        },
        "efesios": {
            1: 23,
            2: 22,
            3: 21,
            4: 32,
            5: 33,
            6: 24
        },
        "filipenses": {
            1: 30,
            2: 30,
            3: 21,
            4: 23
        },
        "colossenses": {
            1: 29,
            2: 23,
            3: 25,
            4: 18
        },
        "1tessalonicenses": {
            1: 10,
            2: 20,
            3: 13,
            4: 18,
            5: 28
        },
        "2tessalonicenses": {
            1: 12,
            2: 17,
            3: 18
        },
        "1timoteo": {
            1: 20,
            2: 15,
            3: 16,
            4: 16,
            5: 25,
            6: 21
        },
        "2timoteo": {
            1: 18,
            2: 26,
            3: 17,
            4: 22
        },
        "tito": {
            1: 16,
            2: 15,
            3: 15
        },
        "filemom": {
            1: 25
        },
        "hebreus": {
            1: 14,
            2: 18,
            3: 19,
            4: 16,
            5: 14,
            6: 20,
            7: 28,
            8: 13,
            9: 28,
            10: 39,
            11: 40,
            12: 29,
            13: 25
        },
        "tiago": {
            1: 27,
            2: 26,
            3: 18,
            4: 17,
            5: 20
        },
        "1pedro": {
            1: 25,
            2: 25,
            3: 22,
            4: 19,
            5: 14
        },
        "2pedro": {
            1: 21,
            2: 22,
            3: 18
        },
        "1joao": {
            1: 10,
            2: 29,
            3: 24,
            4: 21,
            5: 21
        },
        "2joao": {
            1: 13
        },
        "3joao": {
            1: 14
        },
        "judas": {
            1: 25
        },
        "apocalipse": {
            1: 20,
            2: 29,
            3: 22,
            4: 11,
            5: 14,
            6: 17,
            7: 17,
            8: 13,
            9: 21,
            10: 11,
            11: 19,
            12: 17,
            13: 18,
            14: 20,
            15: 8,
            16: 21,
            17: 18,
            18: 24,
            19: 21,
            20: 15,
            21: 27,
            22: 21
        }
    };
    return versiculosPorCapitulo[livro][capitulo] || 0;
}

// O bloco abaixo carrega a imagem da Bíblia assim que a página abre
window.onload = () => {
    const content = document.querySelector('.content');
    const watermarkContainer = document.createElement('div');
    watermarkContainer.classList.add('watermark');
    
    const img = document.createElement('img');
    img.src = '../img/biblia.png';
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
                body { 
                    font-family: sans-serif; 
                    background-color: #181818;
                    color: white; 
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    overflow: hidden;
                    font-style: italic;
                    font-weight: bold;
                    position: relative;
                }
                #titulo { font-size: 3vw; color: #f1c40f; margin-bottom: 1.25rem; text-align: center; z-index: 2; }
                #versiculo-container { font-size: 5vw; text-align: center; max-width: 90vw; overflow-wrap: break-word; z-index: 2; }
                #botao-container { position: absolute; bottom: 2rem; left: 2.5rem; display: flex; gap: 1rem; z-index: 2; }
                button {
                    background-color: white;
                    color: black;
                    border: none;
                    padding: 0.5rem 1.5rem;
                    font-size: 1.5rem;
                    font-weight: bold;
                    cursor: pointer;
                    position: relative;
                    transition: background-color 0.3s ease, color 0.3s ease;
                }
                button:hover {
                    background-color: black;
                    color: white;
                }
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
                #voltar-botao:hover::before {
                    border-color: transparent black transparent transparent;
                }
                #proximo-botao:hover::after {
                    border-color: transparent transparent transparent black;
                }
                #watermark {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: url('../img/biblia.png');
                    opacity: 0.3;
                    z-index: 1;
                    background-size: cover;
                    background-repeat: no-repeat;
                    background-position: center;
                    pointer-events: none;
                }
            </style>
        </head>
        <body>
            <div id="watermark"></div>
            <div id="titulo">Carregando...</div>
            <div id="versiculo-container">Aguarde...</div>
            <div id="botao-container">
                <button id="voltar-botao">VOLTAR</button>
                <button id="proximo-botao">PRÓXIMO</button>
            </div>

            <script>
                let livro = '${livroAtual}';
                let capitulo = ${capituloAtual};
                let versiculo = ${versiculoAtual};
                let totalVersiculos = 0;
                let dadosCapitulo = null;

                async function carregarCapitulo() {
                    try {
                        const response = await fetch('../../version/ara/' + livro + '/' + capitulo + '.json');
                        dadosCapitulo = await response.json();
                        totalVersiculos = Object.keys(dadosCapitulo.versiculos).length;
                        carregarVersiculo();
                    } catch (error) {
                        document.getElementById('versiculo-container').innerHTML = 'Erro ao carregar capítulo.';
                        console.error(error);
                    }
                }

                function carregarVersiculo() {
                    if (dadosCapitulo && dadosCapitulo.versiculos[versiculo]) {
                        const texto = dadosCapitulo.versiculos[versiculo];
                        const titulo = dadosCapitulo.titulos && dadosCapitulo.titulos[versiculo]
                            ? '<strong>' + dadosCapitulo.titulos[versiculo] + '</strong><br>'
                            : '';
                        document.getElementById('titulo').innerHTML = livro.toUpperCase() + ' - CAPÍTULO ' + capitulo + ' - VERSÍCULO ' + versiculo;
                        document.getElementById('versiculo-container').innerHTML = titulo + texto;
                    } else {
                        document.getElementById('versiculo-container').innerHTML = 'Versículo não encontrado.';
                    }
                }

                document.getElementById('proximo-botao').addEventListener('click', () => {
                    versiculo++;
                    if (versiculo > totalVersiculos) {
                        capitulo++;
                        versiculo = 1;
                        carregarCapitulo();
                    } else {
                        carregarVersiculo();
                    }
                });

                document.getElementById('voltar-botao').addEventListener('click', () => {
                    versiculo--;
                    if (versiculo < 1) {
                        if (capitulo > 1) {
                            capitulo--;
                            carregarCapitulo();
                            setTimeout(() => {
                                versiculo = Object.keys(dadosCapitulo.versiculos).length;
                                carregarVersiculo();
                            }, 500);
                        } else {
                            versiculo = 1;
                            carregarVersiculo();
                        }
                    } else {
                        carregarVersiculo();
                    }
                });

                carregarCapitulo();
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

// O bloco abaixo cria a lista para cada item na barra de menu superior com o estilo Dropdown
// O trecho abaixo cria a lista de download da opção BAIXAR 
// --- START OF PART 8/8 (REVISED) ---

// O bloco abaixo define os dados para os menus dropdown na barra de navegação superior.

// Lista de arquivos para download
const downloads = [
    { texto: 'A Bíblia Católica', link: 'baixar/A_Biblia_Catolica.pdf' },
    { texto: 'A Bíblia Sagrada NVT', link: 'baixar/A_Biblia_Sagrada_NVT.pdf' },
    { texto: 'A Bíblia Viva', link: 'baixar/A_Biblia_Viva.pdf' },
    { texto: 'A vida completa de Jesus<br>Pr. Juanribe<br>Pagliarin', link: 'baixar/A_vida_completa_de_Jesus_Pr_Juanribe_Pagliarin.pdf' },
    { texto: 'Bíblia de Genebra<br>(só estudo)', link: 'baixar/Biblia_Genebra_so_estudo.pdf' },
    { texto: 'Bíblia em ordem<br>cronológica NVI', link: 'baixar/Biblia_em_ordem_cronologica_NVI.pdf' },
    { texto: 'Bíblia explicada', link: 'baixar/Biblia_explicada.pdf' },
    { texto: 'Bíblia KJA', link: 'baixar/Biblia_KJA.pdf' },
    { texto: 'Bíblia<br>Palavra-Chave', link: 'baixar/Biblia_palavra_chave.pdf' },
    { texto: 'Bíblia Thompson<br>Temas em Cadeia', link: 'baixar/Biblia_Thompson_temas_em_cadeia.pdf' }
];

// Lista de versões da Bíblia (exemplo)
const versoes = [
    { texto: 'ARA (Atual)', link: '#' }, // Link pode apontar para recarregar com a versão
    { texto: 'ARC (Em breve)', link: '#' }, // Link para outra versão
    { texto: 'NVT (Em breve)', link: '#' }
];

// Lista de dicionários/concordâncias (exemplo)
const dicionario = [
    { texto: 'Dicionário VINE', link: '#' }, // Links para recursos externos ou páginas internas
    { texto: 'Concordância Strong', link: '#' }
];

// Lista de Harpas/Hinários (exemplo)
const harpaHinario = [
    { texto: 'Harpa Cristã', link: '#' }, // Links para seções específicas
    { texto: 'Cantor Cristão', link: '#' }
];

// Lista de links úteis
const utilidades = [
    { texto: 'IA Ajudar a estudar a biblia', link: 'https://bible.ai/pt' },
    { texto: 'Posso conhecer a Deus', link: 'https://caniknowgod.com/' },
    { texto: 'Dicionário e Comentário<br> de toda a Bíblia', link: 'https://www.apologeta.com.br' },
    { texto: 'BíbliaOn', link: 'https://www.bibliaon.com/' },
    // Ajuste o caminho se necessário, partindo do HTML principal
    { texto: 'Cursos (Em breve)', link: 'html/cursos.html' } 
];

// Função genérica para popular uma lista dropdown (<ul>) com itens (<li><a>).
function populateList(listId, items) {
    const listElement = document.getElementById(listId);
    if (!listElement) {
        console.warn(`Elemento de lista com ID '${listId}' não encontrado.`);
        return;
    }
    listElement.innerHTML = ''; // Limpa a lista antes de popular
    items.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.link;
        a.innerHTML = item.texto; // Usa innerHTML para permitir <br>
        if (item.link !== '#' && (item.link.startsWith('http') || item.link.endsWith('.pdf') || item.link.includes('/'))) {
             a.target = '_blank'; // Abrir links externos/PDFs/páginas em nova aba
             a.rel = 'noopener noreferrer';
        }
        li.appendChild(a);
        listElement.appendChild(li);
    });
}

// Populando as listas dropdown com os dados definidos acima.
// Certifique-se que os IDs ('Baixar', 'versoes-list', etc.) correspondem aos IDs dos <ul> no seu HTML.
populateList('baixar-list', downloads); // Assumindo ID 'baixar-list' para o <ul> de Baixar
populateList('versoes-list', versoes);
populateList('dicionario-list', dicionario);
populateList('harpa-hinario-list', harpaHinario);
populateList('utilidades-list', utilidades);

// Funções para mostrar e esconder as listas dropdown.
function showList(listId) {
    const listElement = document.getElementById(listId);
    if (listElement) {
        listElement.style.display = 'block';
    }
}

function hideList(listId) {
    const listElement = document.getElementById(listId);
    if (listElement) {
        listElement.style.display = 'none';
    }
}

// Adiciona eventos de mouse (entrar/sair) para cada item do menu que tem um dropdown.
document.querySelectorAll('.dropdown').forEach(dropdown => {
    const listContent = dropdown.querySelector('.dropdown-content');
    if (!listContent) return; // Pula se não encontrar o conteúdo do dropdown
    const listId = listContent.id; 

    if (listId) {
        let hideTimeout; 

        dropdown.addEventListener('mouseenter', () => {
            clearTimeout(hideTimeout); 
            showList(listId); 
        });

        dropdown.addEventListener('mouseleave', () => {
            hideTimeout = setTimeout(() => {
                const listElement = document.getElementById(listId); // Pega o elemento novamente
                if (!dropdown.matches(':hover') && (!listElement || !listElement.matches(':hover'))) {
                    hideList(listId); 
                }
            }, 200); 
        });

        // Adiciona listeners à própria lista dropdown
        const listElement = document.getElementById(listId);
        if (listElement) {
            listElement.addEventListener('mouseenter', () => {
                clearTimeout(hideTimeout);
                showList(listId); // Garante que está visível
            });
            listElement.addEventListener('mouseleave', () => {
                hideTimeout = setTimeout(() => {
                     if (!dropdown.matches(':hover') && !listElement.matches(':hover')) {
                        hideList(listId);
                    }
                }, 200); 
            });
        }
    }
});


// --- Funcionalidade da Seção "SOBRE" ---

// Função para CARREGAR e EXIBIR o conteúdo da seção "Sobre".
function loadSobre() {
    const content = document.querySelector('.content');
    
    // Remove todos os elementos filhos da área principal, exceto a marca d'água
    Array.from(content.children).forEach(child => {
        if (child !== titulo && !child.classList.contains('watermark') && !child.classList.contains('sobre-content')) { // Mantém H2 se existir
            child.remove();
        }
    });

    // Limpa o título principal se ele existir e não for o "Sobre"
    if (titulo && !content.querySelector('.sobre-content h2')) {
        titulo.textContent = ''; 
    }

     // Cria o contêiner para o conteúdo "Sobre" se ele não existir
    let sobreContent = content.querySelector('.sobre-content');
    if (!sobreContent) {
        sobreContent = document.createElement('div');
        sobreContent.classList.add('sobre-content');
        sobreContent.style.position = 'relative'; 
        sobreContent.style.zIndex = '2'; 
        sobreContent.style.opacity = '0'; // Começa invisível para fade-in

        sobreContent.innerHTML = `
            <h2>Sobre o Projeto Bíblia Sagrada</h2>
            <p>Este projeto tem como objetivo oferecer uma ferramenta online completa e acessível para leitura e estudo da Bíblia Sagrada.</p>
            <p>Versão Atual: Almeida Revista e Atualizada (ARA). Outras versões, Harpa Cristã, Hinário Batista, Dicionário Bíblico e Concordância poderão ser adicionadas futuramente.</p>
            <p>Funcionalidades incluem a leitura dos textos, navegação por livros/capítulos/versículos e a opção de visualização em modo "Slide" para apresentações (Datashow).</p>
            <p>Utilize o menu lateral para navegar pelos livros e os botões que aparecem para selecionar capítulos e versículos.</p>
            <p>O projeto está em desenvolvimento contínuo.</p>
        `;
        content.appendChild(sobreContent); 

        // Força reflow para garantir que a transição funcione
        void sobreContent.offsetWidth; 

        // Aplica fade-in
        sobreContent.style.transition = 'opacity 0.5s ease-in';
        sobreContent.style.opacity = '1';
    } else {
         // Se já existe, garante que está visível (caso tenha sido escondido)
         sobreContent.style.transition = 'opacity 0.5s ease-in';
         sobreContent.style.opacity = '1';
    }
    
    // Limpa o estado ativo da navegação da Bíblia
    activeLivro = null;
    activeCapitulo = null;
    activeVersiculoButton = null;
    // Não reseta 'titulo' aqui, pois ele pode ser o H2 dentro do sobreContent
}

// Função para ESCONDER o conteúdo "Sobre" com fade-out.
function hideSobre() {
    const content = document.querySelector('.content');
    const sobreContent = content.querySelector('.sobre-content');
    if (sobreContent) {
        sobreContent.style.transition = 'opacity 0.3s ease-out'; // Transição de fade-out
        sobreContent.style.opacity = '0';
        // Remove o elemento do DOM após a transição
        setTimeout(() => {
            // Verifica novamente se ainda existe e pertence ao mesmo pai antes de remover
            if (sobreContent && sobreContent.parentNode === content) { 
                sobreContent.remove();
            }
        }, 300); // Tempo igual à duração da transição
    }
     // Poderia restaurar o título do livro/capítulo aqui se desejado,
     // mas vamos manter simples por enquanto.
}


// --- Event Listeners ---

// Adiciona evento de clique ao link "SOBRE" (assumindo que ele tem id="sobre")
const sobreLink = document.getElementById('sobre');
if (sobreLink) {
    sobreLink.addEventListener('click', (event) => {
        event.preventDefault(); 
        loadSobre(); // Chama a função para exibir o conteúdo "Sobre"
    });
} else {
    console.warn("Link 'Sobre' com ID 'sobre' não encontrado.");
}

// Adiciona evento para esconder "Sobre" ao passar o mouse no menu superior
// IMPORTANTE: Ajuste o seletor se a estrutura do seu menu for diferente
const topNavItems = document.querySelectorAll('header nav > ul > li'); 
if (topNavItems.length > 0) {
    topNavItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            hideSobre(); // Chama a função para esconder o "Sobre"
        });
    });
} else {
     console.warn("Itens do menu superior ('header nav > ul > li') não encontrados para adicionar listener de 'mouseenter'.");
}


// --- Menu Móvel ---
const menuButton = document.querySelector('.menu-button');
if (menuButton) {
    menuButton.addEventListener('click', () => {
        const menuLivros = document.querySelector('.menu-livros');
        if (menuLivros) {
            menuLivros.classList.toggle('show'); 
        }
    });
} 
// Não é um erro se o botão móvel não existir, pode ser intencional.
// else { console.warn("Botão de menu móvel ('.menu-button') não encontrado."); }


// --- FIM DO SCRIPT ara.js ---

// --- END OF PART 8/8 (REVISED) ---