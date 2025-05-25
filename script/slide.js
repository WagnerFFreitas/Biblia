console.log("[slide.js] Script iniciado.");

// Mapeamento para converter nomes de livros com acentos para sem acentos
const livroAcentuadosParaSemAcentos = {
    "Gênesis": "Genesis",
    "Êxodo": "Exodo",
    "Levítico": "Levitico",
    "Números": "Numeros",
    "Deuteronômio": "Deuteronomio",
    "Josué": "Josue",
    "Juízes": "Juizes",
    "Rute": "Rute",
    "1Samuel": "1Samuel",
    "2Samuel": "2Samuel",
    "1Reis": "1Reis",
    "2Reis": "2Reis",
    "1Crônicas": "1Cronica",
    "2Crônicas": "2Cronica",
    "Esdras": "Esdras",
    "Neemias": "Neemias",
    "Ester": "Ester",
    "Jó": "Jo",
    "Cantares": "Cantares",
    "Isaías": "Isaías",
    "Jeremias": "Jeremias",
    "Lamentações": "Lamentacoes",
    "Ezequiel": "Ezequiel",
    "Daniel": "Daniel",
    "Oséias": "Oseas",
    "Joel": "Joel",
    "Amós": "Amos",
    "Obadias": "Obadias",
    "Jonas": "Jonas",
    "Miquéias": "Miqueias",
    "Naum": "Naum",
    "Habacuque": "Habacuque",
    "Sofonias": "Sofonias",
    "Ageu": "Ageu",
    "Zacarias": "Zacarias",
    "Malaquias": "Malaquias",
    "Mateus": "Mateus",
    "Marcos": "Marcos",
    "Lucas": "Lucas",
    "João": "Joao",
    "Atos": "Atos",
    "Romanos": "Romanos",
    "1Coríntios": "1Corintios",
    "2Coríntios": "2Corintios",
    "Gálatas": "Galatas",
    "Efésios": "Efesios",
    "Filipenses": "Filipenses",
    "Colossenses": "Colossenses",
    "1Tessalonicenses": "1Tessalonicenses",
    "2Tessalonicenses": "2Tessalonicenses",
    "1Timóteo": "1Timoteo",
    "2Timóteo": "2Timoteo",
    "Tito": "Tito",
    "Filemom": "Filemom",
    "Hebreus": "Hebreus",
    "Tiago": "Tiago",
    "1Pedro": "1Pedro",
    "2Pedro": "2Pedro",
    "1João": "1Joao",
    "2João": "2Joao",
    "3João": "3Joao",
    "Judas": "Judas",
    "Apocalipse": "Apocalipse"
};

// Base única com todos os livros da Bíblia (usando nomes sem acentos para compatibilidade)
const baseLivros = {
    "Genesis": { 1: 31, 2: 25, 3: 24, 4: 26, 5: 32, 6: 22, 7: 24, 8: 22, 9: 29, 10: 32, 11: 32, 12: 20, 13: 18, 14: 24, 15: 21, 16: 16, 17: 27, 18: 33, 19: 38, 20: 18, 21: 34, 22: 24, 23: 20, 24: 67, 25: 34, 26: 35, 27: 46, 28: 22, 29: 35, 30: 43, 31: 55, 32: 32, 33: 20, 34: 31, 35: 29, 36: 43, 37: 36, 38: 30, 39: 23, 40: 23, 41: 57, 42: 38, 43: 34, 44: 34, 45: 28, 46: 34, 47: 31, 48: 22, 49: 33, 50: 26 },
    "Exodo": { 1: 22, 2: 25, 3: 22, 4: 31, 5: 23, 6: 30, 7: 25, 8: 32, 9: 35, 10: 29, 11: 10, 12: 37, 13: 22, 14: 31, 15: 27, 16: 36, 17: 16, 18: 27, 19: 29, 20: 26, 21: 36, 22: 31, 23: 33, 24: 18 },
    "Levitico": { 1: 17, 2: 16, 3: 17, 4: 35, 5: 19, 6: 30, 7: 38, 8: 36, 9: 24, 10: 20, 11: 47, 12: 8, 13: 59, 14: 57, 15: 33, 16: 34, 17: 16, 18: 30, 19: 37, 20: 27, 21: 24, 22: 33, 23: 44, 24: 23, 25: 55, 26: 46, 27: 34 },
    "Numeros": { 1: 54, 2: 34, 3: 51, 4: 42, 5: 31, 6: 27, 7: 89, 8: 26, 9: 23, 10: 36, 11: 35, 12: 16, 13: 33, 14: 45, 15: 41, 16: 50, 17: 13, 18: 32, 19: 22, 20: 29, 21: 35, 22: 41, 23: 30, 24: 25, 25: 18, 26: 65, 27: 23, 28: 31, 29: 40, 30: 16, 31: 54, 32: 42, 33: 56, 34: 29, 35: 15, 36: 13 },
    "Deuteronomio": { 1: 46, 2: 37, 3: 29, 4: 49, 5: 33, 6: 25, 7: 26, 8: 20, 9: 29, 10: 22, 11: 32, 12: 31, 13: 18, 14: 29, 15: 23, 16: 22, 17: 20, 18: 22, 19: 21, 20: 20, 21: 23, 22: 30, 23: 25, 24: 22, 25: 19, 26: 19, 27: 26, 28: 68, 29: 8, 30: 20, 31: 30, 32: 49, 33: 29, 34: 12 },
    "Josue": { 1: 18, 2: 24, 3: 17, 4: 24, 5: 15, 6: 27, 7: 26, 8: 35, 9: 27, 10: 43, 11: 23, 12: 24, 13: 33, 14: 15, 15: 63, 16: 10, 17: 18, 18: 28, 19: 51, 20: 9, 21: 45, 22: 34, 23: 16, 24: 33 },
    "Juizes": { 1: 36, 2: 23, 3: 31, 4: 24, 5: 31, 6: 40, 7: 25, 8: 32, 9: 57, 10: 18, 11: 40, 12: 15, 13: 25, 14: 20, 15: 20, 16: 31, 17: 13, 18: 31, 19: 30, 20: 48, 21: 25 },
    "Rute": { 1: 22, 2: 23, 3: 18, 4: 22 },
    "1Samuel": { 1: 28, 2: 36, 3: 21, 4: 22, 5: 12, 6: 21, 7: 17, 8: 22, 9: 27, 10: 27, 11: 15, 12: 25, 13: 23, 14: 52, 15: 35, 16: 23, 17: 58, 18: 30, 19: 24, 20: 42, 21: 15, 22: 23, 23: 29, 24: 22, 25: 44, 26: 25, 27: 12, 28: 25, 29: 11, 30: 31, 31: 13 },
    "2Samuel": { 1: 27, 2: 32, 3: 39, 4: 12, 5: 25, 6: 23, 7: 29, 8: 18, 9: 13, 10: 19, 11: 27, 12: 31, 13: 39, 14: 33, 15: 37, 16: 23, 17: 27, 18: 17, 19: 43, 20: 26, 21: 22, 22: 51, 23: 39, 24: 25 },
    "1Reis": { 1: 53, 2: 46, 3: 28, 4: 34, 5: 18, 6: 38, 7: 51, 8: 66, 9: 28, 10: 29, 11: 43, 12: 31, 13: 34, 14: 31, 15: 34, 16: 34, 17: 24, 18: 46, 19: 21, 20: 43, 21: 29, 22: 53 },
    "2Reis": { 1: 18, 2: 25, 3: 27, 4: 44, 5: 27, 6: 33, 7: 20, 8: 29, 9: 37, 10: 36, 11: 21, 12: 21, 13: 25, 14: 29, 15: 30, 16: 20, 17: 41, 18: 37, 19: 37, 20: 21, 21: 26, 22: 20, 23: 37, 24: 20, 25: 30 },
    "1Cronica": { 1: 54, 2: 55, 3: 24, 4: 43, 5: 26, 6: 81, 7: 40, 8: 40, 9: 44, 10: 14, 11: 47, 12: 40, 13: 14, 14: 17, 15: 29, 16: 43, 17: 27, 18: 17, 19: 19, 20: 8, 21: 30, 22: 19, 23: 32, 24: 31, 25: 31, 26: 32, 27: 34, 28: 21, 29: 30 },
    "2Cronica": { 1: 18, 2: 17, 3: 17, 4: 22, 5: 14, 6: 42, 7: 22, 8: 18, 9: 31, 10: 19, 11: 23, 12: 16, 13: 22, 14: 14, 15: 19, 16: 14, 17: 19, 18: 34, 19: 11, 20: 37, 21: 20, 22: 12, 23: 32, 24: 27, 25: 28, 26: 23, 27: 9, 28: 27, 29: 36, 30: 27, 31: 21, 32: 33, 33: 25, 34: 33, 35: 27, 36: 23 },
    "Esdras": { 1: 11, 2: 70, 3: 13, 4: 24, 5: 17, 6: 22, 7: 28, 8: 36, 9: 15, 10: 44 },
    "Neemias": { 1: 11, 2: 20, 3: 32, 4: 23, 5: 19, 6: 19, 7: 73, 8: 18, 9: 38, 10: 39, 11: 36, 12: 47, 13: 31 },
    "Ester": { 1: 22, 2: 23, 3: 15, 4: 17, 5: 14, 6: 14, 7: 10, 8: 17, 9: 32, 10: 3 },
    "Jo": { 1: 22, 2: 13, 3: 26, 4: 21, 5: 27, 6: 21, 7: 21, 8: 22, 9: 35, 10: 22, 11: 20, 12: 25, 13: 27, 14: 22, 15: 35, 16: 22, 17: 16, 18: 21, 19: 29, 20: 30, 21: 34, 22: 30, 23: 17, 24: 25, 25: 6, 26: 14, 27: 23, 28: 28, 29: 25, 30: 31, 31: 40, 32: 22, 33: 33, 34: 37, 35: 16, 36: 33, 37: 24, 38: 41, 39: 30, 40: 24, 41: 34, 42: 17 },
    "Cantares": { 1: 17, 2: 17, 3: 11, 4: 16, 5: 16, 6: 13, 7: 13, 8: 14 },
    "Isaías": { 1: 31, 2: 22, 3: 26, 4: 6, 5: 30, 6: 13, 7: 25, 8: 22, 9: 21, 10: 34, 11: 16, 12: 6, 13: 22, 14: 32, 15: 9, 16: 14, 17: 14, 18: 7, 19: 25, 20: 6, 21: 17, 22: 25, 23: 18, 24: 23, 25: 12, 26: 21, 27: 13, 28: 29, 29: 24, 30: 33, 31: 9, 32: 20, 33: 24, 34: 17, 35: 10, 36: 22, 37: 38, 38: 22, 39: 8, 40: 31, 41: 29, 42: 25, 43: 28, 44: 28, 45: 25, 46: 13, 47: 15, 48: 22, 49: 26, 50: 11, 51: 23, 52: 15, 53: 12, 54: 17, 55: 13, 56: 12, 57: 21, 58: 14, 59: 21, 60: 22, 61: 11, 62: 12, 63: 19, 64: 12, 65: 25, 66: 24 },
    "Jeremias": { 1: 19, 2: 37, 3: 25, 4: 31, 5: 31, 6: 30, 7: 34, 8: 22, 9: 26, 10: 25, 11: 23, 12: 17, 13: 27, 14: 29, 15: 21, 16: 21, 17: 27, 18: 23, 19: 15, 20: 18, 21: 14, 22: 30, 23: 40, 24: 10, 25: 38, 26: 20, 27: 21, 28: 17, 29: 32, 30: 24, 31: 40, 32: 44, 33: 26, 34: 22, 35: 19, 36: 32, 37: 20, 38: 28, 39: 18, 40: 16, 41: 18, 42: 22, 43: 13, 44: 30, 45: 5, 46: 28, 47: 7, 48: 47, 49: 39, 50: 46, 51: 64, 52: 34 },
    "Lamentacoes": { 1: 22, 2: 22, 3: 66, 4: 22, 5: 22 },
    "Ezequiel": { 1: 28, 2: 10, 3: 27, 4: 17, 5: 17, 6: 14, 7: 27, 8: 18, 9: 11, 10: 22, 11: 26, 12: 28, 13: 23, 14: 23, 15: 8, 16: 63, 17: 24, 18: 32, 19: 14, 20: 49, 21: 32, 22: 31, 23: 49, 24: 27, 25: 17, 26: 21, 27: 36, 28: 26, 29: 15, 30: 26, 31: 17, 32: 32, 33: 33, 34: 31, 35: 17, 36: 38, 37: 28, 38: 23, 39: 29, 40: 49, 41: 26, 42: 20, 43: 27, 44: 31, 45: 25, 46: 20, 47: 23, 48: 35 },
    "Daniel": { 1: 21, 2: 49, 3: 30, 4: 37, 5: 31, 6: 28, 7: 28, 8: 27, 9: 27, 10: 21, 11: 45, 12: 13 },
    "Oseas": { 1: 11, 2: 23, 3: 5, 4: 19, 5: 15, 6: 11, 7: 16, 8: 14, 9: 17, 10: 15, 11: 12, 12: 14, 13: 16, 14: 9 },
    "Joel": { 1: 20, 2: 32, 3: 21 },
    "Amos": { 1: 15, 2: 16, 3: 15, 4: 13, 5: 27, 6: 14, 7: 17, 8: 14, 9: 15 },
    "Obadias": { 1: 21 },
    "Jonas": { 1: 17, 2: 10, 3: 10, 4: 11 },
    "Miqueias": { 1: 16, 2: 13, 3: 12, 4: 13, 5: 15, 6: 16, 7: 20 },
    "Naum": { 1: 14, 2: 13, 3: 19 },
    "Habacuque": { 1: 17, 2: 20, 3: 19 },
    "Sofonias": { 1: 18, 2: 15, 3: 20 },
    "Ageu": { 1: 15, 2: 23 },
    "Zacarias": { 1: 21, 2: 13, 3: 10, 4: 14, 5: 11, 6: 15, 7: 14, 8: 23, 9: 17, 10: 12, 11: 17, 12: 13, 13: 9, 14: 21 },
    "Malaquias": { 1: 14, 2: 17, 3: 24, 4: 6 },
    "Mateus": { 1: 25, 2: 23, 3: 17, 4: 25, 5: 48, 6: 34, 7: 29, 8: 34, 9: 38, 10: 42, 11: 30, 12: 50, 13: 53, 14: 36, 15: 39, 16: 28, 17: 27, 18: 35, 19: 30, 20: 34, 21: 46, 22: 46, 23: 39, 24: 51, 25: 46, 26: 75, 27: 66, 28: 20 },
    "Marcos": { 1: 45, 2: 28, 3: 35, 4: 41, 5: 43, 6: 56, 7: 37, 8: 38, 9: 50, 10: 52, 11: 33, 12: 44, 13: 37, 14: 72, 15: 47, 16: 20 },
    "Lucas": { 1: 80, 2: 52, 3: 38, 4: 44, 5: 39, 6: 49, 7: 50, 8: 56, 9: 62, 10: 42, 11: 54, 12: 59, 13: 35, 14: 35, 15: 32, 16: 31, 17: 37, 18: 43, 19: 48, 20: 47, 21: 38, 22: 71, 23: 56, 24: 53 },
    "Joao": { 1: 51, 2: 25, 3: 36, 4: 54, 5: 47, 6: 71, 7: 53, 8: 59, 9: 41, 10: 42, 11: 57, 12: 50, 13: 38, 14: 31, 15: 27, 16: 33 },
    "Atos": { 1: 26, 2: 47, 3: 26, 4: 37, 5: 42, 6: 15, 7: 60, 8: 40, 9: 31, 10: 48, 11: 30, 12: 25, 13: 52, 14: 28, 15: 41, 16: 40, 17: 34, 18: 28, 19: 41, 20: 38, 21: 40, 22: 30, 23: 35, 24: 27, 25: 27, 26: 32, 27: 44, 28: 31 },
    "Romanos": { 1: 32, 2: 29, 3: 31, 4: 25, 5: 21, 6: 23, 7: 25, 8: 39, 9: 33, 10: 21, 11: 36, 12: 21, 13: 14, 14: 23, 15: 33, 16: 27 },
    "1Corintios": { 1: 31, 2: 16, 3: 23, 4: 21, 5: 13, 6: 20, 7: 40, 8: 13, 9: 27, 10: 33, 11: 34, 12: 31, 13: 13, 14: 40, 15: 58, 16: 24 },
    "2Corintios": { 1: 24, 2: 17, 3: 18, 4: 18, 5: 21, 6: 18, 7: 16, 8: 24, 9: 15, 10: 18, 11: 33, 12: 21 },
    "Galatas": { 1: 24, 2: 21, 3: 29, 4: 31, 5: 26, 6: 18 },
    "Efesios": { 1: 23, 2: 22, 3: 21, 4: 32, 5: 33, 6: 24 },
    "Filipenses": { 1: 30, 2: 30, 3: 21, 4: 23 },
    "Colossenses": { 1: 29, 2: 23, 3: 25, 4: 18 },
    "1Tessalonicenses": { 1: 10, 2: 20, 3: 13, 4: 18, 5: 28 },
    "2Tessalonicenses": { 1: 12, 2: 17, 3: 18 },
    "1Timoteo": { 1: 20, 2: 15, 3: 16, 4: 16, 5: 25, 6: 21 },
    "2Timoteo": { 1: 18, 2: 26, 3: 17 },
    "Tito": { 1: 16, 2: 15, 3: 15 },
    "Filemom": { 1: 25 },
    "Hebreus": { 1: 14, 2: 18, 3: 19, 4: 16, 5: 14, 6: 20, 7: 28, 8: 13, 9: 28, 10: 39, 11: 40, 12: 29, 13: 25 },
    "Tiago": { 1: 27, 2: 26, 3: 18, 4: 17, 5: 20 },
    "1Pedro": { 1: 25, 2: 25, 3: 22, 4: 19, 5: 14 },
    "2Pedro": { 1: 21, 2: 22, 3: 18 },
    "1Joao": { 1: 10, 2: 29, 3: 24, 4: 21, 5: 21 },
    "2Joao": { 1: 13 },
    "3Joao": { 1: 14 },
    "Judas": { 1: 25 },
    "Apocalipse": { 1: 20, 2: 29, 3: 22, 4: 11, 5: 14, 6: 17, 7: 17, 8: 13, 9: 21, 10: 11, 11: 19, 12: 17, 13: 18, 14: 20, 15: 8, 16: 21, 17: 18, 18: 24, 19: 21, 20: 15, 21: 27, 22: 21 }
};

// Versões bíblicas reutilizando a mesma base
const contagemVersiculosPorVersao = {
    acf: baseLivros,
    ara: baseLivros,
    nvi: baseLivros,
    kjv: baseLivros,
    arc: baseLivros,
    ntlh: baseLivros,
    naa: baseLivros,
    original: baseLivros
};

// Lista ordenada dos livros da Bíblia (usando nomes sem acentos para compatibilidade)
const livrosOrdem = [
    "Genesis", "Exodo", "Levitico", "Numeros", "Deuteronomio",
    "Josue", "Juizes", "Rute", "1Samuel", "2Samuel", "1Reis", "2Reis",
    "1Cronica", "2Cronica", "Esdras", "Neemias", "Ester", "Jo", "Cantares",
    "Isaías", "Jeremias", "Lamentacoes", "Ezequiel", "Daniel", "Oseas", "Joel",
    "Amos", "Obadias", "Jonas", "Miqueias", "Naum", "Habacuque", "Sofonias",
    "Ageu", "Zacarias", "Malaquias", "Mateus", "Marcos", "Lucas", "Joao", "Atos",
    "Romanos", "1Corintios", "2Corintios", "Galatas", "Efesios", "Filipenses",
    "Colossenses", "1Tessalonicenses", "2Tessalonicenses", "1Timoteo", "2Timoteo",
    "Tito", "Filemom", "Hebreus", "Tiago", "1Pedro", "2Pedro", "1Joao", "2Joao",
    "3Joao", "Judas", "Apocalipse"
];

// Função para normalizar o nome do livro (ignorar acentos e maiúsculas/minúsculas)
function normalizarNomeLivro(nome) {
    const semAcentos = Object.keys(livroAcentuadosParaSemAcentos).find(
        key => key.toLowerCase() === nome.toLowerCase()
    );
    if (semAcentos) {
        return livroAcentuadosParaSemAcentos[semAcentos];
    }
    return Object.keys(livroAcentuadosParaSemAcentos).find(
        key => livroAcentuadosParaSemAcentos[key].toLowerCase() === nome.toLowerCase()
    ) || nome;
}

// Função para obter o nome acentuado para exibição
function obterNomeAcentuado(nomeSemAcento) {
    return Object.keys(livroAcentuadosParaSemAcentos).find(
        key => livroAcentuadosParaSemAcentos[key] === nomeSemAcento
    ) || nomeSemAcento;
}

function inicializarSlide() {
    console.log("[slide.js] Configurando listener do link 'Slide'.");
    const linksHeader = document.querySelectorAll('header nav ul li a');
    let linkSlideEncontrado = null;
    linksHeader.forEach(link => {
        if (link.textContent.trim().toLowerCase() === 'slide') {
            linkSlideEncontrado = link;
        }
    });

    if (linkSlideEncontrado) {
        linkSlideEncontrado.addEventListener('click', (event) => {
            event.preventDefault();
            console.log("[slide.js] Link 'Slide' clicado.");

            const urlParams = new URLSearchParams(window.location.search);
            const versao = window.BIBLE_VERSION || urlParams.get('version') || 'arc';
            let livro = window.activeLivro || 'Genesis';
            const cap = window.activeCapitulo || 1;
            const versBtn = window.activeVersiculoButton;
            const versNum = versBtn ? (parseInt(versBtn.dataset.versiculo, 10) || parseInt(versBtn.textContent.trim(), 10) || 1) : 1;

            if (!livro || !cap) {
                alert("Por favor, selecione um livro e capítulo primeiro.");
                console.warn("[slide.js] Tentativa de abrir slide sem livro/capítulo ativo.");
                return;
            }

            // Normalizar o nome do livro
            livro = normalizarNomeLivro(livro);

            console.log(`[slide.js] Estado atual para slide: Versão=${versao}, Livro=${livro}, Cap=${cap}, VersNum=${versNum}`);
            abrirJanelaSlide(livro, cap, versNum, versao);
        });
    } else {
        console.warn("[slide.js] Link 'Slide' não encontrado no cabeçalho.");
    }
}

window.inicializarSlide = inicializarSlide; // Expose to global scope if called from HTML

document.addEventListener('DOMContentLoaded', () => {
    if (typeof inicializarSlide === 'function') {
        inicializarSlide();
    } else {
        console.error("[slide.js] inicializarSlide não está definida no DOMContentLoaded.");
    }
});

async function abrirJanelaSlide(livroAtual, capituloAtual, versiculoAtual, versaoAtual) {
    console.log(`[slide.js] Tentando abrir slide para: ${versaoAtual.toUpperCase()} ${livroAtual} ${capituloAtual}:${versiculoAtual}`);

    // Validação inicial
    if (!livroAtual || !capituloAtual || !versiculoAtual || !versaoAtual) {
        alert("Dados insuficientes para abrir o slide. Verifique a seleção.");
        console.warn("[slide.js] Tentativa de abrir slide com dados insuficientes:", { livroAtual, capituloAtual, versiculoAtual, versaoAtual });
        return;
    }

    // Normalizar o nome do livro
    livroAtual = normalizarNomeLivro(livroAtual);

    // Verificar se a janela já está aberta
    if (window.janelaSlide && !window.janelaSlide.closed) {
        window.janelaSlide.focus();
        console.log("[slide.js] Janela do slide já estava aberta. Focando.");
        return;
    }

    // Abrir a janela
    const largura = window.screen.availWidth;
    const altura = window.screen.availHeight;
    window.janelaSlide = window.open('', 'JanelaSlide', `width=${largura},height=${altura},menubar=no,toolbar=no,location=no,status=no`);

    if (!window.janelaSlide || window.janelaSlide.closed) {
        alert("Não foi possível abrir a janela do slide. Desative o bloqueador de pop-ups ou verifique as permissões do navegador.");
        console.error("[slide.js] Falha ao abrir a janela pop-up. Verifique bloqueadores ou permissões.");
        return;
    }

    console.log("[slide.js] Janela pop-up aberta com sucesso.");

    // Validar contagem de versículos
    const todaContagemDaVersao = contagemVersiculosPorVersao[versaoAtual];
    if (!todaContagemDaVersao || Object.keys(todaContagemDaVersao).length === 0) {
        console.error(`[slide.js] Contagem de versículos não encontrada para a versão ${versaoAtual.toUpperCase()}`);
        window.janelaSlide.close();
        alert(`Erro interno: Configuração de versículos ausente para a versão ${versaoAtual.toUpperCase()}.`);
        return;
    }

    // Verificar se o livro existe na contagem
    if (!todaContagemDaVersao[livroAtual]) {
        console.error(`[slide.js] Livro '${livroAtual}' não encontrado na contagem para a versão ${versaoAtual.toUpperCase()}`);
        window.janelaSlide.close();
        alert(`Erro interno: Livro '${livroAtual}' não encontrado na configuração para a versão ${versaoAtual.toUpperCase()}.`);
        return;
    }

    const todaContagemJSON = JSON.stringify(todaContagemDaVersao);
    const livrosOrdemJSON = JSON.stringify(livrosOrdem);

    const jsonVersions = ['ara', 'nvi', 'acf', 'ntlh', 'kjv', 'naa', 'original'];
    const isJsonVersion = jsonVersions.includes(versaoAtual);
    const extensaoArquivo = isJsonVersion ? 'json' : 'html';

    // Obter o nome acentuado para exibição
    const livroAcentuado = obterNomeAcentuado(livroAtual);

    // Escrever o HTML na janela
    window.janelaSlide.document.open();
    window.janelaSlide.document.write(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <title>Bíblia Slide - ${versaoAtual.toUpperCase()}</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/slide.css">
</head>
<body>
    <div id="watermark"></div>
    <div id="titulo">${livroAcentuado.toUpperCase()} ${capituloAtual}:${versiculoAtual}</div>
    <div id="versiculo-container"><div class="versiculo-texto">Carregando...</div></div>
    <div id="botao-container">
        <button id="voltar-botao">‹ Anterior</button>
        <button id="proximo-botao">Próximo ›</button>
    </div>

    <script>
        // Estado inicial
        let livroAtual = '${livroAtual}';
        let capituloAtual = ${capituloAtual};
        let versiculoAtual = ${versiculoAtual};
        const versaoBiblia = '${versaoAtual}';
        let dadosCapitulo = null;

        const todaContagemDataGlobal = JSON.parse('${todaContagemJSON}');
        const livrosOrdemGlobal = JSON.parse('${livrosOrdemJSON}');
        let versiculosPorCapituloArray = []; 

        const tituloElement = document.getElementById('titulo');
        const versiculoContainer = document.getElementById('versiculo-container');
        const btnVoltar = document.getElementById('voltar-botao');
        const btnProximo = document.getElementById('proximo-botao');

        const jsonFileVersions = ['ara', 'nvi', 'acf', 'ntlh', 'kjv', 'naa', 'original'];
        const isJsonFile = jsonFileVersions.includes(versaoBiblia);
        const fileExtension = isJsonFile ? 'json' : 'html';

        // Função para normalizar o nome do livro (ignorar acentos e maiúsculas/minúsculas)
        function normalizarNomeLivro(nome) {
            const semAcentos = ${JSON.stringify(livroAcentuadosParaSemAcentos)};
            const nomeLower = nome.toLowerCase();
            const keyAcentuada = Object.keys(semAcentos).find(key => key.toLowerCase() === nomeLower);
            if (keyAcentuada) return semAcentos[keyAcentuada];
            const keySemAcento = Object.keys(semAcentos).find(key => semAcentos[key].toLowerCase() === nomeLower);
            return keySemAcento ? semAcentos[keySemAcento] : nome;
        }

        // Função para obter o nome acentuado para exibição
        function obterNomeAcentuado(nomeSemAcento) {
            const semAcentos = ${JSON.stringify(livroAcentuadosParaSemAcentos)};
            return Object.keys(semAcentos).find(key => semAcentos[key] === nomeSemAcento) || nomeSemAcento;
        }

        // Atualizar contagem de capítulos para o livro atual
        function atualizarContagemCapitulosParaLivroAtual() {
            const contagemCapitulosObj = todaContagemDataGlobal[livroAtual];
            if (contagemCapitulosObj) {
                versiculosPorCapituloArray = Object.keys(contagemCapitulosObj)
                    .map(capNumStr => parseInt(capNumStr, 10))
                    .sort((a, b) => a - b)
                    .map(capNum => contagemCapitulosObj[capNum.toString()]);
            } else {
                console.error(\`Contagem não encontrada para \${livroAtual} (\${versaoBiblia}).\`);
                versiculosPorCapituloArray = [];
                tituloElement.innerText = "ERRO CONFIG";
                versiculoContainer.innerHTML = \`<div class="versiculo-texto" style="color:red;">Config de versículos ausente para '\${livroAtual}' (\${versaoBiblia}).</div>\`;
                btnVoltar.disabled = true; btnProximo.disabled = true;
            }
        }

        // Carregar capítulo
        async function carregarCapitulo(capituloNum) {
            const caminho = \`../version/\${versaoBiblia}/\${livroAtual}/\${capituloNum}.\${fileExtension}\`;
            console.log(\`Carregando capítulo: \${caminho}\`);
            const livroAcentuado = obterNomeAcentuado(livroAtual);
            tituloElement.innerText = \`\${livroAcentuado.toUpperCase()} \${capituloNum}:... (Carregando)\`;
            versiculoContainer.innerHTML = '<div class="versiculo-texto">Carregando capítulo...</div>';
            btnVoltar.disabled = true; btnProximo.disabled = true;

            try {
                const response = await fetch(caminho);
                if (!response.ok) throw new Error(\`HTTP \${response.status} em \${caminho}\`);
                dadosCapitulo = isJsonFile ? await response.json() : new DOMParser().parseFromString(await response.text(), 'text/html');
                console.log(\`Capítulo \${isJsonFile ? 'JSON' : 'HTML'} carregado.\`);
                carregarVersiculo(versiculoAtual);
            } catch (error) {
                console.error('Erro ao carregar capítulo:', error);
                tituloElement.innerText = \`ERRO \${livroAcentuado.toUpperCase()} \${capituloNum}\`;
                versiculoContainer.innerHTML = \`<div class="versiculo-texto" style="color:red;font-size:1.2rem;">Falha: \${caminho}. \${error.message}</div>\`;
            }
        }

        // Carregar versículo
        function carregarVersiculo(versiculoNum) {
            console.log(\`Carregando \${livroAtual} \${capituloAtual}:\${versiculoNum}\`);
            let conteudo = '', tituloSecao = '';
            const livroAcentuado = obterNomeAcentuado(livroAtual);

            if (!dadosCapitulo) {
                versiculoContainer.innerHTML = '<div class="versiculo-texto" style="color:orange;">Dados do capítulo não carregados.</div>';
                atualizarBotoes(); return;
            }

            if (isJsonFile) {
                if (dadosCapitulo.versiculos && dadosCapitulo.versiculos[versiculoNum]) {
                    conteudo = dadosCapitulo.versiculos[versiculoNum];
                    if (dadosCapitulo.titulos && dadosCapitulo.titulos[versiculoNum]) {
                        tituloSecao = '<strong class="section-title">' + dadosCapitulo.titulos[versiculoNum] + '</strong>';
                    }
                } else conteudo = 'Versículo não encontrado (JSON).';
            } else { // HTML
                const el = dadosCapitulo.querySelector('#versiculo-' + versiculoNum);
                if (el) {
                    const strongChild = Array.from(el.children).find(c => c.tagName === 'STRONG');
                    if (strongChild && el.textContent.trim().startsWith(strongChild.textContent.trim())) {
                        tituloSecao = '<strong class="section-title">' + strongChild.innerHTML + '</strong>';
                        let temp = document.createElement('div'); temp.innerHTML = el.innerHTML;
                        let firstStrong = temp.querySelector('strong');
                        if (firstStrong && temp.innerHTML.trim().startsWith(firstStrong.outerHTML.trim())) firstStrong.remove();
                        conteudo = temp.innerHTML.trim();
                    } else conteudo = el.innerHTML.trim();
                    if (!conteudo && el.textContent) conteudo = el.textContent.trim();
                } else conteudo = 'Versículo não encontrado (HTML).';
            }

            tituloElement.innerText = \`\${livroAcentuado.toUpperCase()} \${capituloAtual}:\${versiculoNum}\`;
            versiculoContainer.innerHTML = (tituloSecao || '') + '<div class="versiculo-texto">' + conteudo + '</div>';
            atualizarBotoes();
        }

        // Atualizar botões de navegação
        function atualizarBotoes() {
            if (!versiculosPorCapituloArray || versiculosPorCapituloArray.length === 0) {
                btnVoltar.disabled = true; btnProximo.disabled = true; return;
            }
            const totalCaps = versiculosPorCapituloArray.length;
            const ultimoVerCap = (capituloAtual > 0 && capituloAtual <= totalCaps) ? versiculosPorCapituloArray[capituloAtual - 1] : 1;
            const idxLivro = livrosOrdemGlobal.indexOf(livroAtual);

            btnVoltar.disabled = (capituloAtual === 1 && versiculoAtual === 1 && idxLivro === 0);
            btnProximo.disabled = (capituloAtual === totalCaps && versiculoAtual === ultimoVerCap && idxLivro === livrosOrdemGlobal.length - 1);
        }

        // Navegar para o próximo versículo
        function proximoVersiculo() {
            if (btnProximo.disabled) return;
            const ultimoVerCap = versiculosPorCapituloArray[capituloAtual - 1];
            versiculoAtual++;
            if (versiculoAtual > ultimoVerCap) { // Próximo capítulo
                capituloAtual++; versiculoAtual = 1;
                if (capituloAtual > versiculosPorCapituloArray.length) { // Próximo livro
                    const idxLivro = livrosOrdemGlobal.indexOf(livroAtual);
                    if (idxLivro < livrosOrdemGlobal.length - 1) {
                        livroAtual = livrosOrdemGlobal[idxLivro + 1];
                        atualizarContagemCapitulosParaLivroAtual();
                        capituloAtual = 1; versiculoAtual = 1;
                        carregarCapitulo(capituloAtual);
                    } else { // Fim da Bíblia
                        versiculoAtual = ultimoVerCap; capituloAtual = versiculosPorCapituloArray.length; 
                        atualizarBotoes(); return;
                    }
                } else carregarCapitulo(capituloAtual);
            } else carregarVersiculo(versiculoAtual);
        }

        // Navegar para o versículo anterior
        function voltarVersiculo() {
            if (btnVoltar.disabled) return;
            versiculoAtual--;
            if (versiculoAtual < 1) { // Capítulo anterior
                capituloAtual--;
                if (capituloAtual < 1) { // Livro anterior
                    const idxLivro = livrosOrdemGlobal.indexOf(livroAtual);
                    if (idxLivro > 0) {
                        livroAtual = livrosOrdemGlobal[idxLivro - 1];
                        atualizarContagemCapitulosParaLivroAtual();
                        capituloAtual = versiculosPorCapituloArray.length; // Último cap
                        versiculoAtual = versiculosPorCapituloArray[capituloAtual - 1]; // Último ver
                        carregarCapitulo(capituloAtual);
                    } else { // Início da Bíblia
                        capituloAtual = 1; versiculoAtual = 1;
                        if (livroAtual !== 'Genesis' || capituloAtual !== 1) carregarCapitulo(1);
                        else carregarVersiculo(1); // Refresh display
                        return;
                    }
                } else { // Mesmo livro, cap anterior
                    versiculoAtual = versiculosPorCapituloArray[capituloAtual - 1];
                    carregarCapitulo(capituloAtual);
                }
            } else carregarVersiculo(versiculoAtual);
        }

        // Configurar eventos
        btnVoltar.addEventListener('click', voltarVersiculo);
        btnProximo.addEventListener('click', proximoVersiculo);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'PageDown') proximoVersiculo();
            else if (e.key === 'ArrowLeft' || e.key === 'PageUp') voltarVersiculo();
            else if (e.key === 'Home' && versiculoAtual !== 1) { versiculoAtual = 1; carregarVersiculo(1); }
            else if (e.key === 'End' && versiculosPorCapituloArray.length >= capituloAtual) {
                const ultimoVer = versiculosPorCapituloArray[capituloAtual - 1];
                if (versiculoAtual !== ultimoVer) { versiculoAtual = ultimoVer; carregarVersiculo(ultimoVer); }
            }
        });

        // Inicialização
        atualizarContagemCapitulosParaLivroAtual();
        if (todaContagemDataGlobal[livroAtual] && versiculosPorCapituloArray.length > 0) {
            if (capituloAtual < 1 || capituloAtual > versiculosPorCapituloArray.length) {
                capituloAtual = 1; versiculoAtual = 1;
            } else if (versiculoAtual < 1 || versiculoAtual > versiculosPorCapituloArray[capituloAtual - 1]) {
                versiculoAtual = 1;
            }
            carregarCapitulo(capituloAtual);
        } else {
            const livroAcentuado = obterNomeAcentuado(livroAtual);
            if (todaContagemDataGlobal[livroAtual]) {
                tituloElement.innerText = "ERRO";
                versiculoContainer.innerHTML = '<div class="versiculo-texto" style="color:red;">Falha ao inicializar.</div>';
                btnVoltar.disabled = true; btnProximo.disabled = true;
            }
        }
    </script>
</body>
</html>
    `);
    window.janelaSlide.document.close();
    console.log("[slide.js] Conteúdo escrito na janela do slide (versão concisa).");
}