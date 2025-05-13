// Este é o script carregado pelo seu index.html na raiz do projeto

// Lista das versões da Bíblia que serão exibidas na tela
var bibleVersions = []; // Usar 'let' ou 'const' é mais moderno que 'var'

// Adicionando versões padrões à lista
bibleVersions.push({ titleAnime: 'Bíblia ARC', img: './img/arc.png' });
bibleVersions.push({ titleAnime: 'Bíblia ARA', img: './img/ara.png' });
bibleVersions.push({ titleAnime: 'Bíblia ACF', img: './img/acf.png' });
bibleVersions.push({ titleAnime: 'Bíblia NAA', img: './img/naa.png' });
bibleVersions.push({ titleAnime: 'Bíblia NVI', img: './img/nvi.png' });
bibleVersions.push({ titleAnime: 'Bíblia NTLH', img: './img/ntlh.png' });
bibleVersions.push({ titleAnime: 'Bíblia BKJ', img: './img/bkj.png' }); // BKJ ou KJV? Certifique-se da consistência
bibleVersions.push({ titleAnime: 'Bíblia Original', img: './img/original.png' });
// Adicione mais versões aqui se necessário

// Input da barra de busca
// Garanta que o elemento com id 'inputUser' existe no seu index.html
const inputUserFilter = document.getElementById('inputUser');
// Adiciona um listener para filtrar enquanto digita (opcional, mas melhora a experiência)
if (inputUserFilter) {
    inputUserFilter.addEventListener('input', searchBar); // Chama searchBar a cada tecla digitada
} else {
    console.warn("Elemento com id 'inputUser' não encontrado no index.html");
}

// Função que filtra as versões da Bíblia com base no texto digitado na barra de busca
function searchBar() {
    const list = document.getElementById('List'); // Garanta que <ul id='List'> existe no index.html
    if (!list) {
        console.error("Elemento <ul id='List'> não encontrado no index.html");
        return;
    }
    list.innerHTML = ''; // Limpa a lista atual antes de adicionar os itens filtrados

    const searchTerm = inputUserFilter ? inputUserFilter.value.toLowerCase() : ''; // Pega o termo de busca em minúsculas
    const filteredVersions = [];

    // Itera sobre a lista completa de versões da Bíblia
    for (let i = 0; i < bibleVersions.length; i++) {
        const versionNameLower = bibleVersions[i].titleAnime.toLowerCase(); // Pega o nome da versão em minúsculas
        // Verifica se o nome da versão inclui o termo de busca (case-insensitive)
        if (versionNameLower.includes(searchTerm)) {
            filteredVersions.push(bibleVersions[i]); // Adiciona à lista filtrada se corresponder
        }
    }

    // Adiciona as Bíblias filtradas na lista <ul> do HTML
    if (filteredVersions.length > 0) {
        for (let i = 0; i < filteredVersions.length; i++) {
            list.appendChild(createElementAnime(filteredVersions[i]));
        }
    } else {
        // Opcional: Mostrar uma mensagem se nenhuma versão for encontrada
        list.innerHTML = '<p style="color: white; text-align: center; width: 100%; padding: 20px;">Nenhuma versão encontrada.</p>';
    }
}

// Cria o elemento HTML (li > img + h2) para cada Bíblia na lista
function createElementAnime(anime) {
    const listItem = document.createElement('li');
    const img = document.createElement('img');
    const name = document.createElement('h2');

    img.src = anime.img; // Define o src da imagem
    img.alt = anime.titleAnime; // Adiciona texto alternativo para acessibilidade
    name.innerHTML = anime.titleAnime; // Define o texto do título

    // Adiciona listener de clique para redirecionar para a página da versão com parâmetro
    listItem.addEventListener('click', () => {
        let versaoCod = null; // Variável para armazenar o código da versão ('arc', 'ara', etc.)
        const titleLower = anime.titleAnime.toLowerCase(); // Converte o título para minúsculas para comparação

        // Mapeia o título para o código da versão
        if (titleLower.includes('arc')) versaoCod = 'arc';
        else if (titleLower.includes('ara')) versaoCod = 'ara';
        else if (titleLower.includes('acf')) versaoCod = 'acf';
        else if (titleLower.includes('naa')) versaoCod = 'naa';
        else if (titleLower.includes('nvi')) versaoCod = 'nvi';
        else if (titleLower.includes('ntlh')) versaoCod = 'ntlh';
        else if (titleLower.includes('bkj')) versaoCod = 'bkj';
        else if (titleLower.includes('original')) versaoCod = 'original';

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

    searchBar();
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
