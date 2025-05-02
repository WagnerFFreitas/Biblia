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
    //const response = await fetch(`${livro}/${capitulo}.html`);
    const response = await fetch(`../version/arc/${livro}/${capitulo}.html`);
    const html = await response.text();
        
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const versiculoContent = tempDiv.querySelector(`#versiculo-${versiculo}`);
    const content = document.querySelector('.content');

    // O trecho abaixo remove qualquer texto de versículo que tiver sendo exibido
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
        "obadias": {
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
            1: 14,
            2: 13,
            3: 19
        },
        "habacuque": {
            1: 17,
            2: 20,
            3: 19
        },
        "sofonias": {
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
        // Novo Testamento
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
        "1_timoteo": {
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
            1: 15
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
    return versiculosPorCapitulo[livro]?.[capitulo] || 0;
};

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

function capitalizeLivro(livro) {
    return livro.charAt(0).toUpperCase() + livro.slice(1).toLowerCase();
}

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
                    padding: 1.25rem; /* 20px */
                    background-color: #181818;
                    color: white;
                    position: relative;
                    margin: 0; /* Remove margens padrão */
                    /* margin-top: -2.5rem; */ /* Removido pois flexbox centraliza */
                    /* margin-left: 0; */ /* Removido pois flexbox centraliza */
                    overflow: hidden; /* Impede barras de rolagem */
                    display: flex;
                    flex-direction: column;
                    justify-content: center; /* Centraliza verticalmente */
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
                    margin-bottom: 1.25rem; /* 20px */
                    font-size: clamp(4rem, 8vw, 6rem); /* Tamanho de fonte responsivo */
                    width: 90%; /* Limita a largura para melhor leitura */
                    text-align: center; /* Centraliza o texto do versículo */
                    flex-grow: 1; /* Permite que o container cresça para preencher espaço */
                    overflow-y: auto; /* Adiciona scroll se o texto for muito grande */
                }

                /* O bloco abaixo configura o titulo (Livro, Capitulo Nº e versiculo nº ) */
                #titulo {
                    font-size: clamp(1.5rem, 3vw, 2.5rem); /* Tamanho de fonte responsivo */
                    margin-bottom: 1.25rem; /* 20px */
                    text-align: center;
                    color: #f1c40f; /* Amarelo dourado */
                    width: 100%; /* Ocupa toda a largura */
                    padding-top: 1rem; /* Espaço no topo */
                }

                /* O bloco abaixo configura o estilo dos textos dos versiculos */
                .versiculo-texto {
                    /* text-align: justify; */ /* Justificado pode criar espaços estranhos */
                    text-align: center; /* Centralizado geralmente funciona melhor para slides */
                    /* font-size: clamp(3rem, 4vw, 8rem); */ /* Movido para #versiculo-container */
                    font-size: clamp(2.5rem, 5vw, 6rem); /* Tamanho de fonte responsivo para o texto */
                    max-width: 100%; /* Garante que não ultrapasse o container */
                    overflow-wrap: break-word; /* Quebra palavras longas */
                    line-height: 1.4; /* Melhora a legibilidade */
                }

                /* O bloco abaixo configura o estilo do titulo dos versiculos (se houver <strong>) */
                #versiculo-container strong {
                    color: #5df565; /* Verde claro */
                    font-size: clamp(2rem, 3.5vw, 4.5rem); /* Tamanho de fonte responsivo */
                    margin-top: 0.63rem; /* 10px */
                    display: block; /* Garante que fique em linha separada */
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
                    position: absolute; /* Posicionamento absoluto relativo ao body */
                    bottom: 2rem; /* Distância da base */
                    left: 50%; /* Começa no meio */
                    transform: translateX(-50%); /* Centraliza horizontalmente */
                    display: flex;
                    gap: 5rem; /* Espaço maior entre os botões */
                    z-index: 1; /* Garante que fiquem sobre a marca d'água */
                    width: auto; /* Largura baseada no conteúdo */
                    padding: 0 1rem; /* Espaçamento lateral para telas menores */
                    box-sizing: border-box;
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
            <div id="titulo">${livroAtual.toUpperCase()} - CAPÍTULO ${capituloAtual} - VERSÍCULO ${versiculoAtual}</div>

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
                    // Constrói o caminho do arquivo baseado na estrutura fornecida
                    // Assume que as pastas dos livros estão em MINÚSCULAS
                    const caminhoArquivo = \`/version/\${versaoBiblia}/\${livroAtual}/\${capitulo}.html\`;

                    // Log para depuração: mostra qual arquivo está tentando carregar
                    console.log(\`Tentando carregar capítulo: \${caminhoArquivo}\`);

                    // Usa a API Fetch para buscar o arquivo
                    fetch(caminhoArquivo)
                        .then(response => {
                            // Verifica se a requisição foi bem-sucedida (status 200-299)
                            if (!response.ok) {
                                // Se não encontrou (404) ou outro erro, lança um erro
                                throw new Error(\`Erro HTTP: \${response.status} ao buscar \${caminhoArquivo}\`);
                            }
                            // Se ok, retorna o conteúdo do arquivo como texto
                            return response.text();
                        })
                        .then(text => {
                            // Armazena o conteúdo do capítulo na variável global
                            capituloConteudo = text;
                            // Chama a função para carregar o versículo desejado
                            carregarVersiculo(versiculoAtual);
                        })
                        .catch(error => {
                            // Se ocorrer qualquer erro no fetch ou processamento
                            console.error('Erro detalhado ao carregar o capítulo:', error);
                            // Exibe uma mensagem de erro clara para o usuário
                            const container = document.getElementById('versiculo-container');
                            container.innerHTML = \`<div class="versiculo-texto" style="color: red; font-size: 1.5rem;">Erro ao carregar capítulo (\${livroAtual.toUpperCase()} \${capitulo}).<br>Verifique se o arquivo existe em:<br>\${error.message.includes('buscar') ? error.message.split('buscar ')[1] : caminhoArquivo}<br>(Verifique também o console do navegador - F12)</div>\`;
                            document.getElementById('titulo').innerText = "ERRO AO CARREGAR CAPÍTULO";
                        });
                }

                // Função para extrair e exibir um versículo específico do conteúdo do capítulo carregado
                function carregarVersiculo(versiculo) {
                    // Verifica se temos conteúdo do capítulo carregado
                    if (!capituloConteudo) {
                        console.error("Conteúdo do capítulo ainda não carregado.");
                        document.getElementById('versiculo-container').innerHTML = '<div class="versiculo-texto" style="color: orange;">Aguardando carregamento do capítulo...</div>';
                        return; // Sai da função se não houver conteúdo
                    }

                    // Cria um parser DOM para analisar o HTML do capítulo
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(capituloConteudo, 'text/html');

                    // Tenta encontrar o elemento do versículo pelo ID (ex: id="versiculo-1")
                    const versiculoElemento = doc.querySelector('#versiculo-' + versiculo);

                    const versiculoContainer = document.getElementById('versiculo-container');
                    const tituloElement = document.getElementById('titulo');

                    // Verifica se o elemento do versículo foi encontrado
                    if (versiculoElemento) {
                        // Atualiza o container com o HTML interno do versículo
                        // Use innerHTML para manter formatação como <br>, <strong>, etc.
                        versiculoContainer.innerHTML = \`<div class="versiculo-texto">\${versiculoElemento.innerHTML}</div>\`;
                        // Atualiza o título da janela
                        tituloElement.innerText = \`\${livroAtual.toUpperCase()} - CAPÍTULO \${capituloAtual} - VERSÍCULO \${versiculo}\`;
                    } else {
                        // Se o versículo específico não for encontrado no HTML carregado
                        console.warn(\`Versículo \${versiculo} não encontrado no capítulo \${capituloAtual} do livro \${livroAtual}. Verifique o ID no HTML.\`);
                        versiculoContainer.innerHTML = \`<div class="versiculo-texto" style="color: orange;">Versículo \${versiculo} não encontrado neste capítulo.</div>\`;
                        // Mantém o título indicando o versículo que foi tentado carregar
                        tituloElement.innerText = \`\${livroAtual.toUpperCase()} - CAPÍTULO \${capituloAtual} - VERSÍCULO \${versiculo} (Não encontrado)\`;
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
                         // Tenta resetar para um estado seguro
                         capituloAtual = 1;
                         versiculoAtual = 1;
                         carregarCapitulo(capituloAtual);
                         return;
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
                            document.getElementById('titulo').innerText = \`\${livroAtual.toUpperCase()} - CAPÍTULO \${capituloAtual} - VERSÍCULO \${versiculoAtual}\`;
                            // Carrega o conteúdo do novo capítulo
                            carregarCapitulo(capituloAtual);
                        } else {
                            // Se não há mais capítulos, chegou ao fim do livro
                            // Volta para o último versículo do último capítulo
                            capituloAtual--;
                            versiculoAtual = versiculosPorCapitulo[capituloAtual - 1];
                            alert('Fim do livro.'); // Informa o usuário
                            // Opcional: Desabilitar botão "próximo"
                             document.getElementById('proximo-botao').disabled = true;
                             document.getElementById('voltar-botao').disabled = false; // Garante que voltar esteja habilitado
                        }
                    } else {
                        // Se ainda está dentro do mesmo capítulo, apenas carrega o próximo versículo
                        carregarVersiculo(versiculoAtual);
                         // Garante que botões estão habilitados
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
                         // Tenta resetar para um estado seguro
                         capituloAtual = 1;
                         versiculoAtual = 1;
                         carregarCapitulo(capituloAtual);
                         return;
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
                            document.getElementById('titulo').innerText = \`\${livroAtual.toUpperCase()} - CAPÍTULO \${capituloAtual} - VERSÍCULO \${versiculoAtual}\`;
                            // Carrega o conteúdo do capítulo anterior
                            carregarCapitulo(capituloAtual);
                        } else {
                            // Se não, chegou ao início do livro (capítulo 0 ou menor)
                            // Volta para o primeiro versículo do primeiro capítulo
                            capituloAtual = 1;
                            versiculoAtual = 1;
                            alert('Início do livro.'); // Informa o usuário
                            // Opcional: Desabilitar botão "voltar"
                            document.getElementById('voltar-botao').disabled = true;
                            document.getElementById('proximo-botao').disabled = false; // Garante que próximo esteja habilitado
                            // Recarrega o primeiro versículo (o capítulo 1 já deve estar carregado ou será carregado)
                            carregarVersiculo(versiculoAtual); // Ou chama carregarCapitulo(1) se preferir
                        }
                    } else {
                        // Se ainda está no mesmo capítulo, apenas carrega o versículo anterior
                        carregarVersiculo(versiculoAtual);
                         // Garante que botões estão habilitados
                         document.getElementById('proximo-botao').disabled = false;
                         document.getElementById('voltar-botao').disabled = false;
                    }
                }

                // Adiciona os ouvintes de evento aos botões
                document.getElementById('proximo-botao').addEventListener('click', proximoVersiculo);
                document.getElementById('voltar-botao').addEventListener('click', voltarVersiculo);

                // --- INICIALIZAÇÃO ---
                // Verifica se a configuração de versículos foi carregada corretamente
                if (versiculosPorCapitulo.length > 0) {
                    // Se sim, carrega o capítulo inicial passado como parâmetro
                    carregarCapitulo(capituloAtual);
                    // Verifica se está no primeiro versículo do primeiro capítulo para desabilitar 'voltar'
                    if (capituloAtual === 1 && versiculoAtual === 1) {
                        document.getElementById('voltar-botao').disabled = true;
                    }
                } else {
                    // Se a configuração não foi encontrada para o livro/versão
                    console.error(\`Configuração de contagem de versículos não encontrada para \${versaoBiblia.toUpperCase()} - \${livroAtual.toUpperCase()}\`);
                    const container = document.getElementById('versiculo-container');
                    container.innerHTML = '<div class="versiculo-texto" style="color: red; font-size: 1.5rem;">Erro Crítico: Configuração de capítulos/versículos ausente para este livro. Incapaz de carregar conteúdo.</div>';
                    document.getElementById('titulo').innerText = "ERRO DE CONFIGURAÇÃO";
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




// O bloco abaixo adiciona o evento de clique ao link "Slide" na janela principal
document.querySelector('header nav ul li:first-child a').addEventListener('click', (event) => {
    event.preventDefault();
    abrirJanelaSlide(activeLivro, activeCapitulo, activeVersiculoButton ? activeVersiculoButton.textContent.trim() : 1);
});

// O bloco abaixo adiciona o evento de clique ao link "Slide" na janela principal
document.querySelector('header nav ul li:first-child a').addEventListener('click', (event) => {
    event.preventDefault();
    abrirJanelaSlide(activeLivro, activeCapitulo, activeVersiculoButton ? activeVersiculoButton.textContent.trim() : 1);
});

// O bloco abaixo cria a lista para cada item na barra de menu superior com o estilo Dropdown

// O trecho abaixo cria a lista de download da opção BAIXAR 
const downloads = [
    { texto: 'A Bíblia Católica', link: '../baixar/A_Biblia_Catolica.pdf' },
    { texto: 'A Bíblia Sagrada NVT', link: '../baixar/A_Biblia_Sagrada_NVT.pdf' },
    { texto: 'A Bíblia Viva', link: '../baixar/A_Biblia_Viva.pdf' },
    { texto: 'A vida completa de Jesus<br>Pr. Juanribe<br>Pagliarin', link: '../baixar/A_vida_completa_de_Jesus_Pr_Juanribe_Pagliarin.pdf' },
    { texto: 'Bíblia de Genebra<br>(só estudo)', link: '../baixar/Biblia_Genebra_so_estudo.pdf' },
    { texto: 'Bíblia em ordem<br>cronológica NVI', link: '../baixar/Biblia_em_ordem_cronologica_NVI.pdf' },
    { texto: 'Bíblia explicada', link: '../baixar/Biblia_explicada.pdf' },
    { texto: 'Bíblia KJA', link: '../baixar/Biblia_KJA.pdf' },
    { texto: 'Bíblia<br>Palavra-Chave', link: '../baixar/Biblia_palavra_chave.pdf' },
    { texto: 'Bíblia Thompson<br>Temas em Cadeia', link: '../baixar/Biblia_Thompson_temas_em_cadeia.pdf' }
];

// O trecho abaixo cria a lista das Versões Biblica que foram selecionadas 
const versoes = [
    { texto: 'Versão 1', link: '#' },
    { texto: 'Versão 2', link: '#' },
];

// O trecho abaixo cria a lista da opção Dicionario e Concordancia Bibliaca
const dicionario = [
    { texto: 'Dicionário 1', link: '#' },
    { texto: 'Dicionário 2', link: '#' },
];

// O trecho abaixo cria a lista com a Harpa Cristã e Cantor Cristão
const harpaHinario = [
    { texto: 'Hinário 1', link: '#' },
    { texto: 'Hinário 2', link: '#' },
];

// O trecho abaixo cria a lista de links de Utilidades 
const utilidades = [
    { texto: 'IA Ajudar a estudar a biblia', link: 'https://bible.ai/pt' },
    { texto: 'Posso conhecer a Deus', link: 'https://caniknowgod.com/' },
    { texto: 'Dicionário e Comentário<br> de toda a Bíblia', link: 'https://www.apologeta.com.br' },
    { texto: 'BíbliaOn', link: 'https://www.bibliaon.com/' },
    { texto: 'Cursos', link: '../html/cursos.html' } // Adicionando o link para cursos
];

// Função para popular as listas
function populateList(listId, items) {
    const listElement = document.getElementById(listId);
    items.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.link;
        a.innerHTML = item.texto;
        a.target = '_blank';
        li.appendChild(a);
        listElement.appendChild(li);
    });
}

// Populando as listas
populateList('Baixar', downloads);
populateList('versoes-list', versoes);
populateList('dicionario-list', dicionario);
populateList('harpa-hinario-list', harpaHinario);
populateList('utilidades-list', utilidades);

// Funções para mostrar e esconder as listas
function showList(listId) {
    const listElement = document.getElementById(listId);
    listElement.style.display = 'block';
}

// Esta função oculta um elemento da lista com o ID especificado, definindo seu estilo de exibição como 'none'.
function hideList(listId) {
    const listElement = document.getElementById(listId);
    listElement.style.display = 'none';
}

// Eventos de mouse para cada dropdown
document.querySelectorAll('.dropdown').forEach(dropdown => {
    const listId = dropdown.querySelector('.dropdown-content').id;
    dropdown.addEventListener('mouseenter', () => showList(listId));
    dropdown.addEventListener('mouseleave', () => {
        setTimeout(() => {
            if (!dropdown.matches(':hover') && !document.getElementById(listId).matches(':hover')) {
                hideList(listId);
            }
        }, 200);
    });
    document.getElementById(listId).addEventListener('mouseenter', () => showList(listId));
    document.getElementById(listId).addEventListener('mouseleave', () => {
        setTimeout(() => {
            if (!dropdown.matches(':hover') && !document.getElementById(listId).matches(':hover')) {
                hideList(listId);
            }
        }, 200);
    });
});
//O bloco abaixo configura a exibição do texto da opção "SOBRE"
function loadSobre() {
    const content = document.querySelector('.content');
    // O trecho remova todos os elementos filhos da área principal, exceto a marca d'água
    Array.from(content.children).forEach(child => {
        if (!child.classList.contains('watermark')) {
            child.remove();
        }
    });

    // O trecho abaixo verifique se o conteúdo "Sobre" já foi adicionado
    let sobreContent = document.querySelector('.sobre-content');
    if (!sobreContent) {
        // Crie o conteúdo "Sobre"
        sobreContent = document.createElement('div');
        sobreContent.classList.add('sobre-content');
        sobreContent.style.position = 'relative'; // Esta linha garante que o texto esteja acima da marca d'água
        sobreContent.style.zIndex = '2'; // Esta certifica-se que o texto apareça acima
        sobreContent.innerHTML = `
            <h2>Sobre</h2>
            <p>O projeto "Bíblia Sagrada" tem como objetivo oferecer uma ferramenta online completa e acessível para leitura e estudo da Bíblia Sagrada, além de conteúdos complementares como Harpa Cristã, Hinário Batista, Dicionário Bíblico e Concordância.</p>
            <p>Estão disponíveis diferentes versões da Bíblia, incluindo a Almeida Revista e Atualizada (ARA), Almeida Atualizada (AA), Almeida Corrigida e Fiel (ACF), e outras.</p>
            <p>O projeto está em desenvolvimento; somente a Biblia ARC esta disponivel; a opção SLIDE para a exibição dos versículos em um Datashow. Existe também a opção para BAIXAR alguns conteúdos para estudo teológico e por último a opção UTILIDADES com alguns tópicos, incluído uma lista de sites com cursos variados, sendo a grande maioria gratuitos, contudo estão sendo organizados.</p>
        `;
        content.appendChild(sobreContent); // Esta linha adiciona o texto da opção "Sobre"
    }
}

document.getElementById('sobre').addEventListener('click', (event) => {
    event.preventDefault();
    loadSobre();
});