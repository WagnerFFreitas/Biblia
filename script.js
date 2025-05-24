/**
 * @fileoverview Script principal da aplicação Bíblia Online
 * Responsável por gerenciar a exibição e interação com as diferentes versões da Bíblia,
 * incluindo a busca, adição de novas versões e navegação entre elas.
 */

/** 
 * Array que armazena todas as versões da Bíblia disponíveis
 * Cada versão é um objeto com propriedades:
 * - titleAnime: nome/título da versão
 * - img: caminho para a imagem que representa a versão
 * @type {Array<{titleAnime: string, img: string}>}
 */
const bibleVersions = [];

/**
 * Inicialização das versões padrão da Bíblia
 * A ordem de adição define a ordem de exibição inicial na lista
 * Importante: manter a ordem consistente com a lógica de redirecionamento
 */

// ACF - Almeida Corrigida Fiel, tradução mais formal e tradicional
bibleVersions.push({ titleAnime: 'Bíblia ACF', img: './img/acf.png' });

// ARA - Almeida Revista e Atualizada, versão acadêmica e respeitada
bibleVersions.push({ titleAnime: 'Bíblia ARA', img: './img/ara.png' });

// ARC - Almeida Revista e Corrigida, versão clássica portuguesa
bibleVersions.push({ titleAnime: 'Bíblia ARC', img: './img/arc.png' });

// KJV - King James Version, versão clássica em inglês
bibleVersions.push({ titleAnime: 'Bíblia KJV', img: './img/kjv.png' });

// NAA - Nova Almeida Atualizada, versão moderna da Almeida
bibleVersions.push({ titleAnime: 'Bíblia NAA', img: './img/naa.png' });

// NTLH - Nova Tradução na Linguagem de Hoje, versão mais dinâmica
bibleVersions.push({ titleAnime: 'Bíblia NTLH', img: './img/ntlh.png' });

// NVI - Nova Versão Internacional, tradução contemporânea
bibleVersions.push({ titleAnime: 'Bíblia NVI', img: './img/nvi.png' });

// NVT - Nova Versão Transformadora, tradução atual e acessível
bibleVersions.push({ titleAnime: 'Bíblia NVT', img: './img/nvt.png' });

// Original - Textos nas línguas originais (hebraico e grego)
bibleVersions.push({ titleAnime: 'Bíblia Original', img: './img/original.png' });
// Adicione mais versões aqui se necessário

/**
 * Inicialização do campo de busca
 * Configura o event listener para filtrar versões conforme o usuário digita
 */
const inputUserFilter = document.getElementById('inputUser');
if (inputUserFilter) {
    inputUserFilter.addEventListener('input', searchBar);
} else {
    console.warn("Elemento com id 'inputUser' não encontrado no index.html");
}

/**
 * Função que filtra e exibe as versões da Bíblia baseado no texto de busca
 * Atualiza a lista em tempo real conforme o usuário digita
 */
function searchBar() {
    // Obtém a referência para a lista onde os resultados serão exibidos
    const list = document.getElementById('List');
    
    // Verifica se o elemento da lista existe no DOM
    if (!list) {
        console.error("Elemento <ul id='List'> não encontrado no index.html");
        return;
    }
    
    // Limpa o conteúdo atual da lista
    list.innerHTML = '';

    // Obtém o termo de busca e converte para minúsculas para comparação case-insensitive
    const searchTerm = inputUserFilter ? inputUserFilter.value.toLowerCase() : '';
    
    // Array para armazenar as versões que correspondem ao termo de busca
    const filteredVersions = [];

    // Itera sobre todas as versões da Bíblia disponíveis
    for (let i = 0; i < bibleVersions.length; i++) {
        // Converte o título da versão atual para minúsculas
        const versionNameLower = bibleVersions[i].titleAnime.toLowerCase();
        // Verifica se o título contém o termo de busca
        if (versionNameLower.includes(searchTerm)) {
            // Adiciona a versão encontrada ao array filtrado
            filteredVersions.push(bibleVersions[i]);
        }
    }

    // Verifica se foram encontradas versões correspondentes
    if (filteredVersions.length > 0) {
        // Itera sobre as versões filtradas e adiciona à lista
        for (let i = 0; i < filteredVersions.length; i++) {
            list.appendChild(createElementAnime(filteredVersions[i]));
        }
    } else {
        // Exibe mensagem quando nenhuma versão é encontrada
        list.innerHTML = '<p style="color: white; text-align: center; width: 100%; padding: 20px;">Nenhuma versão encontrada.</p>';
    }
}

/**
 * Cria um elemento de lista para uma versão da Bíblia
 * @param {Object} anime - Objeto contendo informações da versão
 * @param {string} anime.titleAnime - Título da versão
 * @param {string} anime.img - Caminho da imagem da versão
 * @returns {HTMLElement} Elemento li contendo imagem e título da versão
 */
function createElementAnime(anime) {
    // Cria o elemento de lista que vai conter a versão
    const listItem = document.createElement('li');
    // Cria o elemento de imagem para o ícone da versão
    const img = document.createElement('img');
    // Cria o elemento de título para o nome da versão
    const name = document.createElement('h2');

    // Define o caminho da imagem
    img.src = anime.img;
    // Define o texto alternativo da imagem
    img.alt = anime.titleAnime;
    // Define o texto do título
    name.innerHTML = anime.titleAnime;

    // Adiciona evento de clique no item da lista
    listItem.addEventListener('click', () => {
        // Variável para armazenar o código da versão
        let versaoCod = null;
        // Converte o título para minúsculas para comparação
        const titleLower = anime.titleAnime.toLowerCase();

        // Identifica qual versão foi clicada e define seu código
        if (titleLower.includes('acf')) versaoCod = 'acf';          // Almeida Corrigida Fiel
        else if (titleLower.includes('ara')) versaoCod = 'ara';     // Almeida Revista e Atualizada
        else if (titleLower.includes('arc')) versaoCod = 'arc';     // Almeida Revista e Corrigida
        else if (titleLower.includes('kjv')) versaoCod = 'kjv';     // King James Version
        else if (titleLower.includes('naa')) versaoCod = 'naa';     // Nova Almeida Atualizada
        else if (titleLower.includes('ntlh')) versaoCod = 'ntlh';   // Nova Tradução na Linguagem de Hoje
        else if (titleLower.includes('nvi')) versaoCod = 'nvi';     // Nova Versão Internacional
        else if (titleLower.includes('nvt')) versaoCod = 'nvt';     // Nova Versão Transformadora
        else if (titleLower.includes('original')) versaoCod = 'original'; // Textos Originais
        // Adicione outras versões aqui se necessário, mantendo a ordem desejada

        if (versaoCod) {
            const urlDestino = `html/versoes.html?version=${versaoCod}`;
            console.log(`Redirecionando para: ${urlDestino}`);
            window.location.href = urlDestino;
        } else {
            console.warn(`Não foi possível determinar o código da versão para: ${anime.titleAnime}`);
            alert("Não foi possível abrir esta versão. Código não identificado.");
        }
    });

    listItem.appendChild(img);
    listItem.appendChild(name);
    return listItem;
}

/**
 * =================================================================
 * GERENCIAMENTO DE POPUPS E UPLOAD DE IMAGENS
 * =================================================================
 */

/**
 * Armazena temporariamente a imagem carregada em formato base64
 * Utilizada ao salvar uma nova versão da Bíblia
 * @type {string}
 */
let uploadedImg = '';

/**
 * Inicialização do documento
 * Configura todos os event listeners e elementos interativos da página
 */
document.addEventListener('DOMContentLoaded', () => {
    const realFileBtn = document.getElementById('realFile');
    const customBtn = document.getElementById('newAnimeImg');
    const imgPreviewEl = document.getElementById('imgPreview');

    if (realFileBtn) {
        realFileBtn.addEventListener('change', () => {
            if (realFileBtn.files && realFileBtn.files.length > 0) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    uploadedImg = reader.result;
                    if (imgPreviewEl) {
                        imgPreviewEl.src = uploadedImg;
                        imgPreviewEl.style.display = 'flex';
                    }
                    if (customBtn) {
                        customBtn.style.display = 'none';
                    }
                }
                reader.readAsDataURL(realFileBtn.files[0]);
            }
        });
    } else {
        console.warn("Elemento 'realFile' não encontrado.");
    }

    if (customBtn) {
        customBtn.addEventListener('click', () => {
            if (realFileBtn) {
                realFileBtn.click();
            }
        });
    } else {
        console.warn("Elemento 'newAnimeImg' não encontrado.");
    }

    const openPopupButton = document.querySelector('.openPopup');
    if (!openPopupButton) console.warn("Botão '.openPopup' não encontrado.");

    const closePopupButton = document.querySelector('.popup .closeStyle');
    if (!closePopupButton) console.warn("Botão '.closeStyle' dentro de '.popup' não encontrado.");

    const closeWlcButton = document.querySelector('.closeWlc');
    if (!closeWlcButton) console.warn("Botão '.closeWlc' não encontrado.");

    const saveButton = document.querySelector('.saveStyle');
    if (!saveButton) console.warn("Botão '.saveStyle' não encontrado.");

    searchBar(); // Chama para popular a lista inicialmente
});

/**
 * Exibe o popup para adicionar uma nova versão da Bíblia
 * Adiciona classe CSS que torna o popup visível
 */
function openPopup() {
    document.body.classList.add('visible');
}

/**
 * Fecha o popup de adição de nova versão e limpa todos os campos
 * Reseta a imagem, o campo de título e remove a classe de visibilidade
 */
function closePopup() {
    document.body.classList.remove('visible');
    const imgPreviewEl = document.getElementById('imgPreview');
    const customBtn = document.getElementById('newAnimeImg');
    const realFileBtn = document.getElementById('realFile');
    const titleInput = document.getElementById('newAnimeTitle');

    if (imgPreviewEl) {
        imgPreviewEl.src = '';
        imgPreviewEl.style.display = 'none';
    }
    if (customBtn) {
        customBtn.style.display = 'block';
    }
    if (realFileBtn) {
        realFileBtn.value = '';
    }
    if (titleInput) {
        titleInput.value = '';
    }
    uploadedImg = '';
}

/**
 * Fecha o popup de boas-vindas
 * Remove a classe que torna o popup de boas-vindas visível
 */
function closeWlc() {
    const welcomePopup = document.getElementById('popupWlc');
    if (welcomePopup) {
        welcomePopup.classList.remove('visibleWlc');
    } else {
        console.warn("Popup de boas-vindas 'popupWlc' não encontrado.");
    }
}

/**
 * Salva uma nova versão da Bíblia na lista
 * Valida os campos necessários e adiciona a nova versão ao array bibleVersions
 * @throws {Error} Se o título ou imagem não forem fornecidos
 */
function saveAnime() {
    const animeNameInput = document.getElementById('newAnimeTitle');
    const animeName = animeNameInput ? animeNameInput.value : null;
    const animeImg = uploadedImg;

    if (!animeName || animeName.trim() === '') {
        alert('Por favor, insira um título para a versão.');
        return;
    }
    if (!animeImg) {
        alert('Por favor, selecione uma imagem para a versão.');
        return;
    }

    bibleVersions.push({ titleAnime: animeName, img: animeImg });
    searchBar();
    closePopup();
    alert('Versão adicionada com sucesso! (Nota: será perdida ao recarregar a página)');
}