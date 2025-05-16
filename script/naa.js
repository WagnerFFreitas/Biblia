// --- START OF FILE script/naa.js ---

window.BIBLE_VERSION = 'naa';
console.log(`[${window.BIBLE_VERSION}.js] Script carregado. Definindo funções específicas para NAA.`);

// --- Dados Específicos de Contagem de Versículos (NAA) ---
window.getSpecificVerseCount = function(livro, capitulo) {
    const versiculosPorCapitulo = {
        "genesis": { 1: 31, 2: 25, 3: 24, 4: 26, 5: 32, 6: 22, 7: 24, 8: 22, 9: 29, 10: 32, 11: 32, 12: 20, 13: 18, 14: 24, 15: 21, 16: 16, 17: 27, 18: 33, 19: 38, 20: 18, 21: 34, 22: 24, 23: 20, 24: 67, 25: 34, 26: 35, 27: 46, 28: 22, 29: 35, 30: 43, 31: 55, 32: 32, 33: 20, 34: 31, 35: 29, 36: 43, 37: 36, 38: 30, 39: 23, 40: 23, 41: 57, 42: 38, 43: 34, 44: 34, 45: 28, 46: 34, 47: 31, 48: 22, 49: 33, 50: 26 },
        "exodo": { 1: 22, 2: 25, 3: 22, 4: 31, 5: 23, 6: 30, 7: 25, 8: 32, 9: 35, 10: 29, 11: 10, 12: 37, 13: 22, 14: 31, 15: 27, 16: 36, 17: 16, 18: 27, 19: 29, 20: 26, 21: 36, 22: 31, 23: 33, 24: 18 },
        "levitico": { 1: 17, 2: 16, 3: 17, 4: 35, 5: 19, 6: 30, 7: 38, 8: 36, 9: 24, 10: 20, 11: 47, 12: 8, 13: 59, 14: 57, 15: 33, 16: 34, 17: 16, 18: 30, 19: 37, 20: 27, 21: 24, 22: 33, 23: 44, 24: 23, 25: 55, 26: 46, 27: 34 },
        "numeros": { 1: 54, 2: 34, 3: 51, 4: 42, 5: 31, 6: 27, 7: 89, 8: 26, 9: 23, 10: 36, 11: 35, 12: 16, 13: 33, 14: 45, 15: 41, 16: 50, 17: 13, 18: 32, 19: 22, 20: 29, 21: 35, 22: 41, 23: 30, 24: 25, 25: 18, 26: 65, 27: 23, 28: 31, 29: 40, 30: 16, 31: 54, 32: 42, 33: 56, 34: 29, 35: 15, 36: 13 },
        "deuteronomio": { 1: 46, 2: 37, 3: 29, 4: 49, 5: 33, 6: 25, 7: 26, 8: 20, 9: 29, 10: 22, 11: 32, 12: 31, 13: 18, 14: 29, 15: 23, 16: 22, 17: 20, 18: 22, 19: 21, 20: 20, 21: 23, 22: 30, 23: 25, 24: 22, 25: 19, 26: 19, 27: 26, 28: 68, 29: 8, 30: 20, 31: 30, 32: 49, 33: 29, 34: 12 },
        "josue": { 1: 18, 2: 24, 3: 17, 4: 24, 5: 15, 6: 27, 7: 26, 8: 35, 9: 27, 10: 43, 11: 23, 12: 24, 13: 33, 14: 15, 15: 63, 16: 10, 17: 18, 18: 28, 19: 51, 20: 9, 21: 45, 22: 34, 23: 16, 24: 33 },
        "juizes": { 1: 36, 2: 23, 3: 31, 4: 24, 5: 31, 6: 40, 7: 25, 8: 32, 9: 57, 10: 18, 11: 40, 12: 15, 13: 25, 14: 20, 15: 20, 16: 31, 17: 13, 18: 31, 19: 30, 20: 48, 21: 25 },
        "rute": { 1: 22, 2: 23, 3: 18, 4: 22 },
        "1samuel": { 1: 28, 2: 36, 3: 21, 4: 22, 5: 12, 6: 21, 7: 17, 8: 22, 9: 27, 10: 27, 11: 15, 12: 25, 13: 23, 14: 52, 15: 35, 16: 23, 17: 58, 18: 30, 19: 24, 20: 42, 21: 15, 22: 23, 23: 29, 24: 22, 25: 44, 26: 25, 27: 12, 28: 25, 29: 11, 30: 31, 31: 13 },
        "2samuel": { 1: 27, 2: 32, 3: 39, 4: 12, 5: 25, 6: 23, 7: 29, 8: 18, 9: 13, 10: 19, 11: 27, 12: 31, 13: 39, 14: 33, 15: 37, 16: 23, 17: 27, 18: 17, 19: 43, 20: 26, 21: 22, 22: 51, 23: 39, 24: 25 },
        "1reis": { 1: 53, 2: 46, 3: 28, 4: 34, 5: 18, 6: 38, 7: 51, 8: 66, 9: 28, 10: 29, 11: 43, 12: 31, 13: 34, 14: 31, 15: 34, 16: 34, 17: 24, 18: 46, 19: 21, 20: 43, 21: 29, 22: 53 },
        "2reis": { 1: 18, 2: 25, 3: 27, 4: 44, 5: 27, 6: 33, 7: 20, 8: 29, 9: 37, 10: 36, 11: 21, 12: 21, 13: 25, 14: 29, 15: 30, 16: 20, 17: 41, 18: 37, 19: 37, 20: 21, 21: 26, 22: 20, 23: 37, 24: 20, 25: 30 },
        "1cronicas": { 1: 54, 2: 55, 3: 24, 4: 43, 5: 26, 6: 81, 7: 40, 8: 40, 9: 44, 10: 14, 11: 47, 12: 40, 13: 14, 14: 17, 15: 29, 16: 43, 17: 27, 18: 17, 19: 19, 20: 8, 21: 30, 22: 19, 23: 32, 24: 31, 25: 31, 26: 32, 27: 34, 28: 21, 29: 30 },
        "2cronicas": { 1: 18, 2: 17, 3: 17, 4: 22, 5: 14, 6: 42, 7: 22, 8: 18, 9: 31, 10: 19, 11: 23, 12: 16, 13: 22, 14: 14, 15: 19, 16: 14, 17: 19, 18: 34, 19: 11, 20: 37, 21: 20, 22: 12, 23: 32, 24: 27, 25: 28, 26: 23, 27: 9, 28: 27, 29: 36, 30: 27, 31: 21, 32: 33, 33: 25, 34: 33, 35: 27, 36: 23 },
        "esdras": { 1: 11, 2: 70, 3: 13, 4: 24, 5: 17, 6: 22, 7: 28, 8: 36, 9: 15, 10: 44 },
        "neemias": { 1: 11, 2: 20, 3: 32, 4: 23, 5: 19, 6: 19, 7: 73, 8: 18, 9: 38, 10: 39, 11: 36, 12: 47, 13: 31 },
        "ester": { 1: 22, 2: 23, 3: 15, 4: 17, 5: 14, 6: 14, 7: 10, 8: 17, 9: 32, 10: 3 },
        "jo": { 1: 22, 2: 13, 3: 26, 4: 21, 5: 27, 6: 21, 7: 21, 8: 22, 9: 35, 10: 22, 11: 20, 12: 25, 13: 27, 14: 22, 15: 35, 16: 22, 17: 16, 18: 21, 19: 29, 20: 30, 21: 34, 22: 30, 23: 17, 24: 25, 25: 6, 26: 14, 27: 23, 28: 28, 29: 25, 30: 31, 31: 40, 32: 22, 33: 33, 34: 37, 35: 16, 36: 33, 37: 24, 38: 41, 39: 30, 40: 24, 41: 34, 42: 17 },
        "cantares": { 1: 17, 2: 17, 3: 11, 4: 16, 5: 16, 6: 13, 7: 13, 8: 14 },
        "isaias": { 1: 31, 2: 22, 3: 26, 4: 6, 5: 30, 6: 13, 7: 25, 8: 22, 9: 21, 10: 34, 11: 16, 12: 6, 13: 22, 14: 32, 15: 9, 16: 14, 17: 14, 18: 7, 19: 25, 20: 6, 21: 17, 22: 25, 23: 18, 24: 23, 25: 12, 26: 21, 27: 13, 28: 29, 29: 24, 30: 33, 31: 9, 32: 20, 33: 24, 34: 17, 35: 10, 36: 22, 37: 38, 38: 22, 39: 8, 40: 31, 41: 29, 42: 25, 43: 28, 44: 28, 45: 25, 46: 13, 47: 15, 48: 22, 49: 26, 50: 11, 51: 23, 52: 15, 53: 12, 54: 17, 55: 13, 56: 12, 57: 21, 58: 14, 59: 21, 60: 22, 61: 11, 62: 12, 63: 19, 64: 12, 65: 25, 66: 24 },
        "jeremias": { 1: 19, 2: 37, 3: 25, 4: 31, 5: 31, 6: 30, 7: 34, 8: 22, 9: 26, 10: 25, 11: 23, 12: 17, 13: 27, 14: 29, 15: 21, 16: 21, 17: 27, 18: 23, 19: 15, 20: 18, 21: 14, 22: 30, 23: 40, 24: 10, 25: 38, 26: 20, 27: 21, 28: 17, 29: 32, 30: 24, 31: 40, 32: 44, 33: 26, 34: 22, 35: 19, 36: 32, 37: 20, 38: 28, 39: 18, 40: 16, 41: 18, 42: 22, 43: 13, 44: 30, 45: 5, 46: 28, 47: 7, 48: 47, 49: 39, 50: 46, 51: 64, 52: 34 },
        "lamentacoes": { 1: 22, 2: 22, 3: 66, 4: 22, 5: 22 },
        "ezequiel": { 1: 28, 2: 10, 3: 27, 4: 17, 5: 17, 6: 14, 7: 27, 8: 18, 9: 11, 10: 22, 11: 26, 12: 28, 13: 23, 14: 23, 15: 8, 16: 63, 17: 24, 18: 32, 19: 14, 20: 49, 21: 32, 22: 31, 23: 49, 24: 27, 25: 17, 26: 21, 27: 36, 28: 26, 29: 15, 30: 26, 31: 17, 32: 32, 33: 33, 34: 31, 35: 17, 36: 38, 37: 28, 38: 23, 39: 29, 40: 49, 41: 26, 42: 20, 43: 27, 44: 31, 45: 25, 46: 20, 47: 23, 48: 35 },
        "daniel": { 1: 21, 2: 49, 3: 30, 4: 37, 5: 31, 6: 28, 7: 28, 8: 27, 9: 27, 10: 21, 11: 45, 12: 13 },
        "oseias": { 1: 11, 2: 23, 3: 5, 4: 19, 5: 15, 6: 11, 7: 16, 8: 14, 9: 17, 10: 15, 11: 12, 12: 14, 13: 16, 14: 9 },
        "joel": { 1: 20, 2: 32, 3: 21 },
        "amos": { 1: 15, 2: 16, 3: 15, 4: 13, 5: 27, 6: 14, 7: 17, 8: 14, 9: 15 },
        "obadias": { 1: 21 },
        "jonas": { 1: 17, 2: 10, 3: 10, 4: 11 },
        "miqueias": { 1: 16, 2: 13, 3: 12, 4: 13, 5: 15, 6: 16, 7: 20 },
        "naum": { 1: 14, 2: 13, 3: 19 },
        "habacuque": { 1: 17, 2: 20, 3: 19 },
        "sofonias": { 1: 18, 2: 15, 3: 20 },
        "ageu": { 1: 15, 2: 23 },
        "zacarias": { 1: 21, 2: 13, 3: 10, 4: 14, 5: 11, 6: 15, 7: 14, 8: 23, 9: 17, 10: 12, 11: 17, 12: 13, 13: 9, 14: 21 },
        "malaquias": { 1: 14, 2: 17, 3: 24, 4: 6 },
        "mateus": { 1: 25, 2: 23, 3: 17, 4: 25, 5: 48, 6: 34, 7: 29, 8: 34, 9: 38, 10: 42, 11: 30, 12: 50, 13: 53, 14: 36, 15: 39, 16: 28, 17: 27, 18: 35, 19: 30, 20: 34, 21: 46, 22: 46, 23: 39, 24: 51, 25: 46, 26: 75, 27: 66, 28: 20 },
        "marcos": { 1: 45, 2: 28, 3: 35, 4: 41, 5: 43, 6: 56, 7: 37, 8: 38, 9: 50, 10: 52, 11: 33, 12: 44, 13: 37, 14: 72, 15: 47, 16: 20 },
        "lucas": { 1: 80, 2: 52, 3: 38, 4: 44, 5: 39, 6: 49, 7: 50, 8: 56, 9: 62, 10: 42, 11: 54, 12: 59, 13: 35, 14: 35, 15: 32, 16: 31, 17: 37, 18: 43, 19: 48, 20: 47, 21: 38, 22: 71, 23: 56, 24: 53 },
        "joao": { 1: 51, 2: 25, 3: 36, 4: 54, 5: 47, 6: 71, 7: 53, 8: 59, 9: 41, 10: 42, 11: 57, 12: 50, 13: 38, 14: 31, 15: 27, 16: 33 },
        "atos": { 1: 26, 2: 47, 3: 26, 4: 37, 5: 42, 6: 15, 7: 60, 8: 40, 9: 31, 10: 48, 11: 30, 12: 25, 13: 52, 14: 28, 15: 41, 16: 40, 17: 34, 18: 28, 19: 41, 20: 38, 21: 40, 22: 30, 23: 35, 24: 27, 25: 27, 26: 32, 27: 44, 28: 31 },
        "romanos": { 1: 32, 2: 29, 3: 31, 4: 25, 5: 21, 6: 23, 7: 25, 8: 39, 9: 33, 10: 21, 11: 36, 12: 21, 13: 14, 14: 23, 15: 33, 16: 27 },
        "1corintios": { 1: 31, 2: 16, 3: 23, 4: 21, 5: 13, 6: 20, 7: 40, 8: 13, 9: 27, 10: 33, 11: 34, 12: 31, 13: 13, 14: 40, 15: 58, 16: 24 },
        "2corintios": { 1: 24, 2: 17, 3: 18, 4: 18, 5: 21, 6: 18, 7: 16, 8: 24, 9: 15, 10: 18, 11: 33, 12: 21 },
        "galatas": { 1: 24, 2: 21, 3: 29, 4: 31, 5: 26, 6: 18 },
        "efesios": { 1: 23, 2: 22, 3: 21, 4: 32, 5: 33, 6: 24 },
        "filipenses": { 1: 30, 2: 30, 3: 21, 4: 23 },
        "colossenses": { 1: 29, 2: 23, 3: 25, 4: 18 },
        "1tessalonicenses": { 1: 10, 2: 20, 3: 13, 4: 18, 5: 28 },
        "2tessalonicenses": { 1: 12, 2: 17, 3: 18 },
        "1timoteo": { 1: 20, 2: 15, 3: 16, 4: 16, 5: 25, 6: 21 },
        "2timoteo": { 1: 18, 2: 26, 3: 17 },
        "tito": { 1: 16, 2: 15, 3: 15 },
        "filemom": { 1: 25 },
        "hebreus": { 1: 14, 2: 18, 3: 19, 4: 16, 5: 14, 6: 20, 7: 28, 8: 13, 9: 28, 10: 39, 11: 40, 12: 29, 13: 25 },
        "tiago": { 1: 27, 2: 26, 3: 18, 4: 17, 5: 20 },
        "1pedro": { 1: 25, 2: 25, 3: 22, 4: 19, 5: 14 },
        "2pedro": { 1: 21, 2: 22, 3: 18 },
        "1joao": { 1: 10, 2: 29, 3: 24, 4: 21, 5: 21 },
        "2joao": { 1: 13 },
        "3joao": { 1: 14 },
        "judas": { 1: 25 },
        "apocalipse": { 1: 20, 2: 29, 3: 22, 4: 11, 5: 14, 6: 17, 7: 17, 8: 13, 9: 21, 10: 11, 11: 19, 12: 17, 13: 18, 14: 20, 15: 8, 16: 21, 17: 18, 18: 24, 19: 21, 20: 15, 21: 27, 22: 21 }
    };

    const contagem = versiculosPorCapitulo[livro]?.[capitulo];
    if (typeof contagem === 'undefined') {
        console.warn(`[NAA] Contagem não encontrada para ${livro} ${capitulo}`);
        return 0;
    }
    return contagem;
};

// --- Função Específica para Carregar Versículo (NAA - JSON) ---
window.loadSpecificVerse = async function(livro, capitulo, versiculo) {
    console.log(`[NAA] Carregando: ${livro} ${capitulo}:${versiculo}`);
    const content = document.querySelector('.content');
    
    if (!content) {
        console.error("[NAA] Elemento .content não encontrado.");
        return;
    }

    const existingVersiculoDiv = content.querySelector('.versiculo-texto');
    if (existingVersiculoDiv) {
        existingVersiculoDiv.remove();
    }

    const versiculoElementDiv = document.createElement('div');
    versiculoElementDiv.className = 'versiculo versiculo-texto';
    
    if (document.body.classList.contains('module-leitura')) {
        versiculoElementDiv.classList.add('modo-leitura');
    }

    try {
        const response = await fetch(`../version/naa/${livro}/${capitulo}.json`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} - Não foi possível carregar o arquivo JSON da NAA para ${livro} ${capitulo}`);
        }

        const data = await response.json();

        // Verifica se o campo 'versiculos' existe e se o versículo específico é uma string.
        if (!data.versiculos || typeof data.versiculos[versiculo] === 'undefined') {
            throw new Error(`Texto do versículo ${versiculo} não encontrado no campo 'versiculos' do JSON.`);
        }
        if (typeof data.versiculos[versiculo] !== 'string') {
            throw new Error(`O conteúdo do versículo ${versiculo} (em 'versiculos.${versiculo}') não é uma string, conforme esperado.`);
        }

        const versiculoTexto = data.versiculos[versiculo];

        // Adiciona título se existir no campo 'titulos' (opcional) e não for vazio.
        if (data.titulos && data.titulos[versiculo] && typeof data.titulos[versiculo] === 'string' && data.titulos[versiculo].trim() !== '') {
            const tituloElement = document.createElement('h3');
            tituloElement.className = 'titulo-versiculo-interno';
            tituloElement.textContent = data.titulos[versiculo];
            versiculoElementDiv.appendChild(tituloElement);
        }

        // Adiciona texto do versículo.
        const textoElement = document.createElement('p');
        textoElement.id = `versiculo-${versiculo}`;
        textoElement.textContent = versiculoTexto;
        versiculoElementDiv.appendChild(textoElement);

    } catch (error) {
        console.error(`[NAA] Erro ao carregar versículo ${livro} ${capitulo}:${versiculo}:`, error);
        const errorElement = document.createElement('p');
        errorElement.textContent = `ERRO NAA: ${error.message}`;
        errorElement.style.color = "red";
        versiculoElementDiv.appendChild(errorElement);
    }

    content.appendChild(versiculoElementDiv);

    // Atualiza título principal com identificação da versão
    if (window.titulo) {
        window.titulo.textContent = `${livro.toUpperCase()} - CAPÍTULO ${capitulo} - VERSÍCULO ${versiculo} (NAA)`;
    }
};

// --- Função para Obter Título do Capítulo (NAA - JSON) ---
window.getSpecificChapterTitle = async function(livro, capitulo, versiculo) {
    console.log(`[NAA] Obtendo título para: ${livro} ${capitulo}:${versiculo}`);
    
    try {
        const response = await fetch(`../version/naa/${livro}/${capitulo}.json`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} - Arquivo NAA não encontrado para ${livro} ${capitulo}`);
        }

        const data = await response.json();
        
        // O título é buscado em data.titulos[versiculo].
        // Verifica se data.titulos existe, se o versiculo tem uma entrada, e se é uma string não vazia.
        if (data.titulos && typeof data.titulos[versiculo] === 'string') {
            const tituloDoVersiculo = data.titulos[versiculo].trim();
            if (tituloDoVersiculo !== '') {
                return tituloDoVersiculo;
            }
        }
        // Se não houver título para este versículo ou for uma string vazia, retorna null.
        return null;
        
    } catch (error) {
        console.error(`[NAA] Erro ao obter título para ${livro} ${capitulo}:${versiculo}:`, error);
        return null;
    }
};

window.isReadingModeEnabled = false;

// --- FIM DO SCRIPT naa.js ---