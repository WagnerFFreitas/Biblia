// Este é o script carregado pelo seu index.html na raiz do projeto

// Lista das versões da Bíblia que serão exibidas na tela
var bibleVersions = []; // Usar 'let' ou 'const' é mais moderno que 'var'

// Adicionando versões padrões à lista
// A ordem aqui define a ordem inicial de exibição, se não houver busca.
// Para consistência com a lógica de clique, você pode querer reordenar aqui também.
bibleVersions.push({ titleAnime: 'Bíblia ACF', img: './img/acf.png' });
bibleVersions.push({ titleAnime: 'Bíblia ARA', img: './img/ara.png' });
bibleVersions.push({ titleAnime: 'Bíblia ARC', img: './img/arc.png' });
bibleVersions.push({ titleAnime: 'Bíblia KJV', img: './img/kjv.png' });
bibleVersions.push({ titleAnime: 'Bíblia NAA', img: './img/naa.png' });
bibleVersions.push({ titleAnime: 'Bíblia NTLH', img: './img/ntlh.png' });
bibleVersions.push({ titleAnime: 'Bíblia NVI', img: './img/nvi.png' });
bibleVersions.push({ titleAnime: 'Bíblia NVT', img: './img/nvt.png' });
bibleVersions.push({ titleAnime: 'Bíblia Original', img: './img/original.png' });
// Adicione mais versões aqui se necessário

// Input da barra de busca
const inputUserFilter = document.getElementById('inputUser');
if (inputUserFilter) {
    inputUserFilter.addEventListener('input', searchBar);
} else {
    console.warn("Elemento com id 'inputUser' não encontrado no index.html");
}

// Função que filtra as versões da Bíblia com base no texto digitado na barra de busca
function searchBar() {
    const list = document.getElementById('List');
    if (!list) {
        console.error("Elemento <ul id='List'> não encontrado no index.html");
        return;
    }
    list.innerHTML = '';

    const searchTerm = inputUserFilter ? inputUserFilter.value.toLowerCase() : '';
    const filteredVersions = [];

    for (let i = 0; i < bibleVersions.length; i++) {
        const versionNameLower = bibleVersions[i].titleAnime.toLowerCase();
        if (versionNameLower.includes(searchTerm)) {
            filteredVersions.push(bibleVersions[i]);
        }
    }

    if (filteredVersions.length > 0) {
        for (let i = 0; i < filteredVersions.length; i++) {
            list.appendChild(createElementAnime(filteredVersions[i]));
        }
    } else {
        list.innerHTML = '<p style="color: white; text-align: center; width: 100%; padding: 20px;">Nenhuma versão encontrada.</p>';
    }
}

// Cria o elemento HTML (li > img + h2) para cada Bíblia na lista
function createElementAnime(anime) {
    const listItem = document.createElement('li');
    const img = document.createElement('img');
    const name = document.createElement('h2');

    img.src = anime.img;
    img.alt = anime.titleAnime;
    name.innerHTML = anime.titleAnime;

    listItem.addEventListener('click', () => {
        let versaoCod = null;
        const titleLower = anime.titleAnime.toLowerCase();

        // Ordem ajustada para corresponder à estrutura de pastas e preferência lógica
        if (titleLower.includes('acf')) versaoCod = 'acf';
        else if (titleLower.includes('ara')) versaoCod = 'ara';
        else if (titleLower.includes('arc')) versaoCod = 'arc';
        else if (titleLower.includes('kjv')) versaoCod = 'kjv';
        else if (titleLower.includes('naa')) versaoCod = 'naa';
        else if (titleLower.includes('ntlh')) versaoCod = 'ntlh';
        else if (titleLower.includes('nvi')) versaoCod = 'nvi';
        else if (titleLower.includes('nvt')) versaoCod = 'nvt';
        else if (titleLower.includes('original')) versaoCod = 'original';
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

// --- Lógica dos Pop-ups (Adicionar Nova Versão e Boas-Vindas) ---

let uploadedImg = ''; // Armazena a imagem carregada (base64); usada ao salvar nova versão

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

// Exibe o pop-up de adição de nova versão da Bíblia
function openPopup() {
    document.body.classList.add('visible');
}

// Fecha o pop-up e reseta os campos para adicionar nova versão
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

// Fecha o pop-up de boas-vindas ao usuário
function closeWlc() {
    const welcomePopup = document.getElementById('popupWlc');
    if (welcomePopup) {
        welcomePopup.classList.remove('visibleWlc');
    } else {
        console.warn("Popup de boas-vindas 'popupWlc' não encontrado.");
    }
}

// Salva temporariamente uma nova versão da Bíblia na lista
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