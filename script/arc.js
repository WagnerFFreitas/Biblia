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
                    background-color: #181818;
                    color: white;
                    position: relative;
                    margin: 0;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    min-height: 100vh;
                    font-style: italic; /* Note: Applied globally, buttons will override */
                    font-weight: bold; /* Note: Applied globally, buttons will override */
                    box-sizing: border-box;
                }

                /* Estilos genéricos de botão removidos ou incorporados abaixo */

                /* O bloco abaixo cria o estilos para o container do versículo */
                #versiculo-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-top: 1.5rem;
                    margin-bottom: 1.25rem;
                    font-size: clamp(4rem, 8vw, 6rem);
                    width: 95%;
                    text-align: center;
                    flex-grow: 1; /* Permite que o container cresça */
                    overflow-y: auto;
                    padding: 0 1rem;
                    box-sizing: border-box;
                    font-style: normal; /* Override body italic */
                    font-weight: normal; /* Override body bold */
                    position: relative; /* Para posicionar o título */
                    height: 100%;
                }

                 /* O bloco abaixo configura o titulo (Estilo Imagem 1) */
                 #titulo {
                     background-color: rgba(0, 0, 0, 0.6); /* Preto com 60% de opacidade */
                     color: #f1c40f;
                     width: 100%;
                     text-align: center;
                     padding: 0.75rem 0;
                     /*font-size: clamp(1.8rem, 3.5vw, 2.8rem);*/
                     font-size: clamp(1.2rem, 3vw, 2rem);
                     font-weight: bold;
                     font-style: normal; /* Garante não ser itálico */
                     font-family: Arial, sans-serif;
                     text-transform: uppercase;
                     margin: 0;
                     box-sizing: border-box;
                     flex-shrink: 0;
                 }

                /* O bloco abaixo configura o estilo dos textos dos versiculos */
                .versiculo-texto {
                    text-align: center;
                    font-size: clamp(2rem, 2.95vw, 5rem);
                    max-width: 100%;
                    overflow-wrap: break-word;
                    line-height: 1.2;
                    font-weight: normal; /* Default weight */
                    font-style: italic; /* Default style */
                    font-family: "Arial Black", Gadget, sans-serif;
                }

                /* O bloco abaixo configura o estilo do titulo dos versiculos (se houver <strong>) */
                #versiculo-container strong {
                    color: #5df565;
                    /*font-size: clamp(2rem, 3.5vw, 4.5rem);*/
                    font-size: clamp(2rem, 2.5vw, 5rem);
                    margin-top: 0.63rem;
                    display: block;
                    font-weight: bold; /* Strong should be bold */
                    font-style: italic; /* Ensure strong isn't italic by default */
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    text-align: center;
                    width: 100%;
                    z-index: 1; /* Ensure it appears above the watermark */
                }

                /* O bloco abaixo coloca a imagem de fundo em marca d'água */
                #watermark {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: url('../img/biblia.png');
                    opacity: 0.15;
                    z-index: -1;
                    pointer-events: none;
                    overflow: hidden;
                    /*background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;*/
                    background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
                }

                /* === FOOTER/BOTÃO CONTAINER ESTILO IMAGEM === */
                #botao-container {
                    width: 100%; /* Ocupa toda a largura */
                    /*background-color: black; /* Fundo preto como na imagem */
                    background-color: rgba(0, 0, 0, 0.6); /* Preto com 60% de opacidade */
                    display: flex;
                    justify-content: center; /* Centraliza os botões */
                    align-items: center; /* Alinha verticalmente */
                    gap: 1rem; /* Espaço entre os botões (ajuste conforme necessário) */
                    /*padding: 1rem 0; /* Espaçamento vertical dentro da barra preta */
                    padding: 0.5rem 1.2rem;
                    box-sizing: border-box;
                    flex-shrink: 0; /* Impede que o container encolha */
                    z-index: 1; /* Garante que fique sobre a marca d'água */
                }

                /* === ESTILOS DOS BOTÕES VOLTAR/PRÓXIMO ESTILO IMAGEM === */
                #voltar-botao,
                #proximo-botao {
                    border: none;
                    padding: 0.6rem 1.5rem; /* Padding interno */
                    font-size: clamp(0.9rem, 1.2vw, 1.2rem); /* Tamanho da fonte */
                    font-weight: bold; /* Negrito */
                    font-style: normal; /* Sem itálico */
                    border-radius: 6px; /* Cantos arredondados */
                    cursor: pointer;
                    transition: background-color 0.2s ease, color 0.2s ease, opacity 0.2s ease;
                    display: inline-flex; /* Para alinhar texto/ícone se necessário */
                    align-items: center;
                    justify-content: center;
                    min-width: 120px; /* Largura mínima */
                    text-align: center;
                }

                /* Cor do botão VOLTAR (Amarelo como na imagem 'Anterior') */
                #voltar-botao {
                    background-color: #f1c40f; /* Amarelo vibrante */
                    color: black; /* Texto preto */
                }

                /* Cor do botão PRÓXIMO (Cinza como na imagem 'Próximo') */
                #proximo-botao {
                    background-color: #d4ac0d; /* Cinza escuro */
                    color: #000; /* Texto cinza claro */
                }

                /* Efeito HOVER (pode ajustar como preferir) */
                #voltar-botao:not(:disabled):hover {
                     background-color: #d4ac0d; /* Amarelo um pouco mais escuro */
                     color: white;
                }

                 #proximo-botao:not(:disabled):hover {
                     background-color: #d4ac0d; /* Cinza mais escuro */
                     color: white; /* Texto branco no hover */
                 }

                /* Estilo para botões DESABILITADOS (parecido com o botão 'Próximo' da imagem) */
                #voltar-botao:disabled,
                #proximo-botao:disabled {
                    background-color: #616161; /* Cinza escuro */
                    color: #000; /* Texto cinza claro */
                    cursor: not-allowed;
                    opacity: 0.7; /* Levemente mais transparente */
                }

                /* REMOVIDO - Estilos das setas grandes ::before/::after */
                /* #voltar-botao::before, #proximo-botao::after { ... } */
                /* #voltar-botao::before { ... } */
                /* #proximo-botao::after { ... } */
                /* #voltar-botao:hover::before { ... } */
                /* #proximo-botao:hover::after { ... } */

            </style>
        </head>
        <body>
            <!-- Div para a marca d'água -->
            <div id="watermark"></div>

            <!-- Título -->
            <div id="titulo">${livroAtual.toUpperCase()} ${capituloAtual}:${versiculoAtual}</div>

            <!-- Container do Versículo -->
            <div id="versiculo-container">
                <div class="versiculo-texto">Carregando...</div>
            </div>

            <!-- Container para os botões (AGORA COM ESTILO DA IMAGEM) -->
            <div id="botao-container">
                <!-- Botões com texto e símbolos como na imagem -->
                <button id="voltar-botao">‹ Anterior</button> <!-- Texto como na imagem -->
                <button id="proximo-botao">Próximo ›</button> <!-- Texto como na imagem -->
            </div>

            <!-- Script (permanece o mesmo) -->
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
    arc: { // Versão ARC - Cânon Protestante (66 Livros)
        // Antigo Testamento (39 Livros)
        genesis: [31, 25, 24, 26, 32, 22, 24, 22, 29, 32, 32, 20, 18, 24, 21, 16, 27, 33, 38, 18, 34, 24, 20, 67, 34, 35, 46, 22, 35, 43, 55, 32, 20, 31, 29, 43, 36, 30, 23, 23, 57, 38, 34, 34, 28, 34, 31, 22, 33, 26],
        exodo: [22, 25, 22, 31, 23, 30, 25, 32, 35, 29, 10, 51, 22, 31, 27, 36, 16, 27, 25, 26, 36, 31, 33, 18, 40, 37, 21, 43, 46, 38, 18, 35, 23, 35, 35, 38, 29, 31, 43, 38],
        levitico: [17, 16, 17, 35, 19, 30, 38, 36, 24, 20, 47, 8, 59, 57, 33, 34, 16, 30, 37, 27, 24, 33, 44, 23, 55, 46, 34],
        numeros: [54, 34, 51, 49, 31, 27, 89, 26, 23, 36, 35, 16, 33, 45, 41, 50, 13, 32, 22, 29, 35, 41, 30, 25, 18, 65, 23, 31, 40, 16, 54, 42, 56, 29, 34, 13],
        deuteronomio: [46, 37, 29, 49, 33, 25, 26, 20, 29, 22, 32, 32, 18, 29, 23, 22, 20, 22, 21, 20, 23, 30, 25, 22, 19, 19, 26, 68, 29, 20, 30, 52, 29, 12],
        josue: [18, 24, 17, 24, 15, 27, 26, 35, 27, 43, 23, 24, 33, 15, 63, 10, 18, 28, 51, 9, 45, 34, 16, 33],
        juizes: [36, 23, 31, 24, 31, 40, 25, 35, 57, 18, 40, 15, 25, 20, 20, 31, 13, 31, 30, 48, 25],
        rute: [22, 23, 18, 22],
        '1samuel': [28, 36, 21, 22, 12, 21, 17, 22, 27, 27, 15, 25, 23, 52, 35, 23, 58, 30, 24, 42, 15, 23, 29, 22, 44, 25, 12, 25, 11, 31, 13],
        '2samuel': [27, 32, 39, 12, 25, 23, 29, 18, 13, 19, 27, 31, 39, 33, 37, 23, 29, 33, 43, 26, 22, 51, 39, 25],
        '1reis': [53, 46, 28, 34, 18, 38, 51, 66, 28, 29, 43, 33, 34, 31, 20, 34, 24, 46, 21, 43, 29, 53],
        '2reis': [18, 25, 27, 44, 27, 33, 20, 29, 37, 36, 21, 21, 25, 29, 38, 20, 41, 37, 37, 21, 26, 20, 37, 20, 30],
        '1cronicas': [54, 55, 24, 43, 26, 81, 40, 40, 44, 14, 47, 40, 14, 17, 29, 43, 27, 17, 19, 8, 30, 19, 32, 31, 31, 32, 34, 21, 30],
        '2cronicas': [17, 18, 17, 22, 14, 42, 22, 18, 31, 19, 23, 16, 22, 15, 19, 14, 19, 34, 11, 37, 20, 12, 21, 27, 28, 23, 9, 27, 36, 27, 21, 33, 25, 33, 27, 23],
        esdras: [11, 70, 13, 24, 17, 22, 28, 36, 15, 44],
        neemias: [11, 20, 32, 23, 19, 19, 73, 18, 38, 39, 36, 47, 31],
        ester: [22, 23, 15, 17, 14, 14, 10, 17, 32, 3],
        jo: [22, 13, 26, 21, 27, 30, 21, 22, 35, 22, 20, 25, 28, 22, 35, 22, 16, 21, 29, 29, 34, 30, 17, 25, 6, 14, 23, 28, 25, 31, 40, 22, 33, 37, 16, 33, 24, 41, 30, 24, 34, 17],
        salmos: [6, 12, 8, 8, 12, 10, 17, 9, 20, 18, 7, 8, 6, 7, 5, 11, 15, 50, 14, 9, 13, 31, 6, 10, 22, 12, 14, 9, 11, 12, 24, 11, 22, 22, 28, 12, 40, 22, 13, 17, 13, 11, 5, 26, 17, 11, 9, 14, 20, 23, 19, 9, 6, 7, 23, 13, 11, 11, 17, 12, 8, 12, 11, 10, 13, 20, 7, 35, 36, 5, 8, 12, 18, 5, 6, 35, 11, 8, 8, 14, 20, 22, 19, 7, 8, 12, 7, 11, 10, 8, 11, 9, 13, 13, 20, 72, 13, 19, 17, 26, 175, 8, 8, 28, 22, 8, 18, 12, 13, 17, 7, 12, 8, 9, 4, 8, 5, 6, 5, 6, 8, 9, 12, 11, 3, 10, 13, 11, 8, 16, 24, 10, 21, 55, 23, 48, 35, 10, 12, 14, 12, 9, 9, 15, 20, 45, 18, 17, 31, 6, 10, 5, 7, 6, 6], // 150 Salmos
        proverbios: [33, 22, 35, 27, 23, 35, 27, 36, 18, 32, 31, 28, 25, 35, 33, 33, 28, 24, 29, 30, 31, 29, 35, 34, 28, 28, 27, 28, 27, 33, 31],
        eclesiastes: [18, 26, 22, 16, 20, 12, 29, 17, 18, 20, 10, 14],
        canticos: [17, 17, 11, 16, 16, 13, 13, 14], // ou Cantares de Salomão
        isaias: [31, 22, 26, 6, 30, 13, 25, 22, 21, 34, 16, 6, 22, 32, 9, 14, 14, 7, 25, 6, 17, 25, 18, 23, 12, 21, 13, 29, 24, 33, 9, 20, 24, 17, 10, 22, 38, 22, 8, 31, 29, 25, 28, 28, 25, 13, 15, 22, 26, 11, 23, 15, 12, 17, 13, 12, 21, 14, 21, 22, 11, 12, 19, 25, 24],
        jeremias: [19, 37, 25, 31, 31, 30, 34, 22, 26, 25, 23, 17, 27, 22, 21, 21, 27, 23, 15, 18, 14, 30, 40, 10, 38, 24, 22, 17, 32, 24, 40, 44, 26, 22, 19, 32, 21, 28, 18, 16, 18, 22, 13, 30, 5, 28, 7, 47, 39, 46, 64, 34],
        lamentacoes: [22, 22, 66, 22, 22],
        ezequiel: [28, 10, 27, 17, 17, 14, 27, 18, 11, 22, 25, 28, 23, 23, 8, 63, 24, 32, 14, 49, 32, 31, 49, 27, 17, 21, 36, 26, 21, 26, 18, 32, 33, 31, 15, 38, 28, 23, 29, 49, 26, 20, 27, 31, 25, 24, 23, 35],
        daniel: [21, 49, 30, 37, 31, 28, 28, 27, 27, 21, 45, 13],
        oseias: [11, 23, 5, 19, 15, 11, 16, 14, 17, 15, 12, 14, 16, 9],
        joel: [20, 32, 21],
        amos: [15, 16, 15, 13, 27, 14, 17, 14, 15],
        obadias: [21],
        jonas: [17, 10, 10, 11],
        miqueias: [16, 13, 12, 13, 15, 16, 20],
        naum: [15, 13, 19],
        habacuque: [17, 20, 19],
        sofonias: [18, 15, 20],
        ageu: [15, 23],
        zacarias: [21, 13, 10, 14, 11, 15, 14, 23, 17, 12, 17, 14, 9, 21],
        malaquias: [14, 17, 18, 6], // ARC geralmente tem 4 capítulos em Malaquias

        // Novo Testamento (27 Livros)
        mateus: [25, 23, 17, 25, 48, 34, 29, 34, 38, 42, 30, 50, 58, 36, 39, 28, 27, 35, 30, 34, 46, 46, 39, 51, 46, 75, 66, 20],
        marcos: [45, 28, 35, 41, 43, 56, 37, 38, 50, 52, 33, 44, 37, 72, 47, 20],
        lucas: [80, 52, 38, 44, 39, 49, 50, 56, 62, 42, 54, 59, 35, 35, 32, 31, 37, 43, 48, 47, 38, 71, 56, 53],
        joao: [51, 25, 36, 54, 47, 71, 53, 59, 41, 42, 57, 50, 38, 31, 27, 33, 26, 40, 42, 31, 25],
        atos: [26, 47, 26, 37, 42, 15, 60, 40, 43, 48, 30, 25, 52, 28, 41, 40, 34, 28, 41, 38, 40, 30, 35, 27, 27, 32, 44, 31],
        romanos: [32, 29, 31, 25, 21, 23, 25, 39, 33, 21, 36, 21, 14, 23, 33, 27],
        '1corintios': [31, 16, 23, 21, 13, 20, 40, 13, 27, 33, 34, 31, 13, 40, 58, 24],
        '2corintios': [24, 17, 18, 18, 21, 18, 16, 24, 15, 18, 33, 21, 14],
        galatas: [24, 21, 29, 31, 26, 18],
        efesios: [23, 22, 21, 32, 33, 24],
        filipenses: [30, 30, 21, 23],
        colossenses: [29, 23, 25, 18],
        '1tessalonicenses': [10, 20, 13, 18, 28],
        '2tessalonicenses': [12, 17, 18],
        '1timoteo': [20, 15, 16, 16, 25, 21],
        '2timoteo': [18, 26, 17, 22],
        tito: [16, 15, 15],
        filemom: [25],
        hebreus: [14, 18, 19, 16, 14, 20, 28, 13, 28, 39, 40, 29, 25],
        tiago: [27, 26, 18, 17, 20],
        '1pedro': [25, 25, 22, 19, 14],
        '2pedro': [21, 22, 18],
        '1joao': [10, 29, 24, 21, 21],
        '2joao': [13],
        '3joao': [14], // Algumas contagens dão 15, conferir na ARC específica
        judas: [25],
        apocalipse: [20, 29, 22, 11, 14, 17, 17, 13, 21, 11, 19, 17, 18, 20, 8, 21, 18, 24, 21, 15, 27, 21]
    },
    ara: { // Versão ARA (exemplo com JSON, ajuste se necessário)
        // Se ARA usa JSON, a lógica de carregamento/parse seria diferente
        // genesis: [31, 25, ...], // Exemplo se ARA também usar array
        // Adicione os livros da versão ARA aqui...
    }
    // Adicione outras versões aqui...
};

                // Obtém o array de contagem para o livro e versão atuais
                let versiculosPorCapitulo = (contagemVersiculos[versaoBiblia] && contagemVersiculos[versaoBiblia][livroAtual]) ? contagemVersiculos[versaoBiblia][livroAtual] : [];

                // Função para carregar o conteúdo HTML de um capítulo específico
                function carregarCapitulo(capitulo) {
                    const caminhoArquivo = \`../version/\${versaoBiblia}/\${livroAtual}/\${capitulo}.html\`;
                    console.log(\`[LOG] Tentando carregar capítulo via fetch (Absoluto): \${caminhoArquivo}\`);
                    fetch(caminhoArquivo)
                        .then(response => {
                            console.log(\`[LOG] Fetch status para \${caminhoArquivo}: \${response.status}\`);
                            if (!response.ok) {
                                throw new Error(\`Erro HTTP: \${response.status} ao buscar \${caminhoArquivo}\`);
                            }
                            return response.text();
                        })
                        .then(text => {
                             console.log(\`[LOG] Capítulo \${capitulo} carregado. Tamanho: \${text.length} caracteres.\`);
                            capituloConteudo = text;
                            carregarVersiculo(versiculoAtual);
                        })
                        .catch(error => {
                             console.error('[LOG] Erro no fetch ou .then:', error);
                             const container = document.getElementById('versiculo-container');
                             container.innerHTML = \`<div class="versiculo-texto" style="color: red; font-size: 1.5rem;">Erro ao carregar capítulo. Verifique o Console (F12).</div>\`;
                             document.getElementById('titulo').innerText = "ERRO AO CARREGAR CAPÍTULO";
                        });
                }

                // Função para extrair e exibir um versículo específico
                function carregarVersiculo(versiculo) {
                    console.log(\`[LOG] Iniciando carregarVersiculo para versículo: \${versiculo}\`);
                    if (!capituloConteudo) {
                         console.warn("[LOG] Conteúdo do capítulo vazio ao tentar carregar versículo.");
                         document.getElementById('versiculo-container').innerHTML = '<div class="versiculo-texto" style="color: orange;">Aguardando carregamento do capítulo...</div>';
                         return;
                    }

                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(capituloConteudo, 'text/html');
                        console.log(\`[LOG] HTML do capítulo parseado. Buscando #versiculo-\${versiculo}\`);
                        const versiculoElemento = doc.querySelector('#versiculo-' + versiculo);
                        console.log(\`[LOG] Elemento encontrado para #versiculo-\${versiculo}:\`, versiculoElemento);

                        const versiculoContainer = document.getElementById('versiculo-container');
                        const tituloElement = document.getElementById('titulo');

                        if (versiculoElemento) {
                             console.log(\`[LOG] Versículo \${versiculo} encontrado.\`);
                            versiculoContainer.innerHTML = \`<div class="versiculo-texto">\${versiculoElemento.innerHTML}</div>\`;
                            tituloElement.innerText = \`\${livroAtual.toUpperCase()} \${capituloAtual}:\${versiculo}\`;
                            // Habilitar botões (caso estivessem desabilitados por erro anterior)
                            document.getElementById('voltar-botao').disabled = (capituloAtual === 1 && versiculoAtual === 1);
                            // Verificar se está no último versículo do último capítulo para desabilitar próximo
                             const ultimoCapitulo = versiculosPorCapitulo.length;
                             const ultimoVersiculo = versiculosPorCapitulo[ultimoCapitulo - 1];
                             document.getElementById('proximo-botao').disabled = (capituloAtual === ultimoCapitulo && versiculoAtual === ultimoVersiculo);

                        } else {
                            console.warn(\`[LOG] Versículo \${versiculo} NÃO encontrado no HTML parseado!\`);
                            versiculoContainer.innerHTML = \`<div class="versiculo-texto" style="color: orange;">Versículo \${versiculo} não encontrado neste capítulo.</div>\`;
                            tituloElement.innerText = \`\${livroAtual.toUpperCase()} \${capituloAtual}:\${versiculo} (Não encontrado)\`;
                        }
                    } catch (parseError) {
                        console.error('[LOG] Erro ao parsear o HTML do capítulo:', parseError);
                        const versiculoContainer = document.getElementById('versiculo-container');
                        versiculoContainer.innerHTML = \`<div class="versiculo-texto" style="color: red; font-size: 1.5rem;">Erro ao processar o HTML do capítulo. Verifique o console (F12).</div>\`;
                         document.getElementById('titulo').innerText = "ERRO AO PROCESSAR CAPÍTULO";
                    }
                }

                // Função para avançar para o próximo versículo ou capítulo
                function proximoVersiculo() {
                    if (!versiculosPorCapitulo || versiculosPorCapitulo.length === 0) {
                        console.error("Configuração de versículos por capítulo ausente ou inválida.");
                        alert("Erro: Não foi possível determinar o número de versículos para este livro."); return;
                    }
                    if(capituloAtual < 1 || capituloAtual > versiculosPorCapitulo.length) {
                         console.error(\`Capítulo atual (\${capituloAtual}) fora dos limites [1-\${versiculosPorCapitulo.length}].\`);
                         alert("Erro: Estado inválido do capítulo."); return;
                    }

                    const ultimoVersiculoCapAtual = versiculosPorCapitulo[capituloAtual - 1];
                    const ultimoCapituloLivro = versiculosPorCapitulo.length;

                    // Verifica se já está no último versículo do último capítulo
                    if (capituloAtual === ultimoCapituloLivro && versiculoAtual === ultimoVersiculoCapAtual) {
                        console.log("Já está no fim do livro.");
                        // alert('Fim do livro.'); // Opcional: manter o alerta
                        document.getElementById('proximo-botao').disabled = true; // Garante que o botão fique desabilitado
                        return; // Não faz mais nada
                    }

                    versiculoAtual++;

                    if (versiculoAtual > ultimoVersiculoCapAtual) {
                        // Avança para o próximo capítulo
                        capituloAtual++;
                        versiculoAtual = 1; // Reseta para o primeiro versículo do novo capítulo
                        document.getElementById('versiculo-container').innerHTML = '<div class="versiculo-texto">Carregando capítulo...</div>';
                        document.getElementById('titulo').innerText = \`\${livroAtual.toUpperCase()} \${capituloAtual}:...\`; // Título temporário
                        carregarCapitulo(capituloAtual);
                    } else {
                        // Apenas carrega o próximo versículo no mesmo capítulo
                        carregarVersiculo(versiculoAtual);
                    }

                    // Habilita/desabilita botões após a lógica
                    document.getElementById('voltar-botao').disabled = false; // Sempre habilita ao avançar
                    document.getElementById('proximo-botao').disabled = (capituloAtual === ultimoCapituloLivro && versiculoAtual === versiculosPorCapitulo[ultimoCapituloLivro - 1]);

                }

                // Função para retroceder para o versículo ou capítulo anterior
                function voltarVersiculo() {
                     if (!versiculosPorCapitulo || versiculosPorCapitulo.length === 0) {
                        console.error("Configuração de versículos por capítulo ausente ou inválida.");
                        alert("Erro: Não foi possível determinar o número de versículos para este livro."); return;
                    }
                     if(capituloAtual < 1 || capituloAtual > versiculosPorCapitulo.length) {
                         console.error(\`Capítulo atual (\${capituloAtual}) fora dos limites [1-\${versiculosPorCapitulo.length}].\`);
                          alert("Erro: Estado inválido do capítulo."); return;
                    }

                     // Verifica se já está no primeiro versículo do primeiro capítulo
                     if (capituloAtual === 1 && versiculoAtual === 1) {
                         console.log("Já está no início do livro.");
                         // alert('Início do livro.'); // Opcional: manter o alerta
                         document.getElementById('voltar-botao').disabled = true; // Garante que o botão fique desabilitado
                         return; // Não faz mais nada
                     }

                    versiculoAtual--;

                    if (versiculoAtual < 1) {
                        // Retrocede para o capítulo anterior
                        capituloAtual--;
                        // Define o versículo para o último do capítulo anterior
                        versiculoAtual = versiculosPorCapitulo[capituloAtual - 1];
                        document.getElementById('versiculo-container').innerHTML = '<div class="versiculo-texto">Carregando capítulo...</div>';
                        document.getElementById('titulo').innerText = \`\${livroAtual.toUpperCase()} \${capituloAtual}:...\`; // Título temporário
                        carregarCapitulo(capituloAtual);
                    } else {
                        // Apenas carrega o versículo anterior no mesmo capítulo
                        carregarVersiculo(versiculoAtual);
                    }

                     // Habilita/desabilita botões após a lógica
                     document.getElementById('proximo-botao').disabled = false; // Sempre habilita ao voltar
                     document.getElementById('voltar-botao').disabled = (capituloAtual === 1 && versiculoAtual === 1);
                }

                // Adiciona os ouvintes de evento aos botões
                document.getElementById('proximo-botao').addEventListener('click', proximoVersiculo);
                document.getElementById('voltar-botao').addEventListener('click', voltarVersiculo);

                // --- INICIALIZAÇÃO ---
                console.log('[LOG] Iniciando script da janela slide.');
                if (versiculosPorCapitulo.length > 0) {
                     console.log(\`[LOG] Configuração encontrada para \${livroAtual}. Carregando capítulo \${capituloAtual}...\`);
                    carregarCapitulo(capituloAtual); // Carrega o capítulo inicial
                    // A lógica de habilitar/desabilitar botões será feita DENTRO de carregarVersiculo
                } else {
                    console.error(\`[LOG] Configuração de contagem de versículos não encontrada para \${versaoBiblia.toUpperCase()} - \${livroAtual.toUpperCase()}\`);
                    const container = document.getElementById('versiculo-container');
                    container.innerHTML = '<div class="versiculo-texto" style="color: red; font-size: 1.5rem;">Erro Crítico: Configuração de capítulos/versículos ausente para este livro. Incapaz de carregar conteúdo.</div>';
                    document.getElementById('titulo').innerText = "ERRO DE CONFIGURAÇÃO";
                    document.getElementById('voltar-botao').disabled = true;
                    document.getElementById('proximo-botao').disabled = true;
                }

            </script>
        </body>
        </html>
    `);

    // Fecha o documento da nova janela
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