// --- START OF FILE script.js ---
// (Este é o script carregado pelo seu index.html na raiz do projeto)

// Lista das versões da Bíblia (padrão) - cada item com título e imagem
// Certifique-se que os caminhos em 'img' estão corretos em relação ao index.html (raiz)
var animeList = []; // Usar 'let' ou 'const' é mais moderno que 'var'

// Adicionando versões padrões à lista
// Verifique se estes nomes correspondem exatamente aos usados no mapeamento dentro de createElementAnime
animeList.push({ titleAnime: 'Bíblia ARC', img: './img/arc.png' });
animeList.push({ titleAnime: 'Bíblia ARA', img: './img/ara.png' });
animeList.push({ titleAnime: 'Bíblia ACF', img: './img/acf.png' });
animeList.push({ titleAnime: 'Bíblia NAA', img: './img/naa.png' });
animeList.push({ titleAnime: 'Bíblia NVI', img: './img/nvi.png' });
animeList.push({ titleAnime: 'Bíblia NTLH', img: './img/ntlh.png' });
animeList.push({ titleAnime: 'Bíblia BKJ', img: './img/bkj.png' }); // BKJ ou KJV? Certifique-se da consistência
animeList.push({ titleAnime: 'Bíblia Original', img: './img/original.png' });
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
    const filteredAnimes = [];

    // Itera sobre a lista completa de versões da Bíblia
    for (let i = 0; i < animeList.length; i++) {
        const animeNameLower = animeList[i].titleAnime.toLowerCase(); // Pega o nome da versão em minúsculas
        // Verifica se o nome da versão inclui o termo de busca (case-insensitive)
        if (animeNameLower.includes(searchTerm)) {
            filteredAnimes.push(animeList[i]); // Adiciona à lista filtrada se corresponder
        }
    }

    // Adiciona as Bíblias filtradas na lista <ul> do HTML
    if (filteredAnimes.length > 0) {
        for (let i = 0; i < filteredAnimes.length; i++) {
            list.appendChild(createElementAnime(filteredAnimes[i]));
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

    // ADICIONA LISTENER DE CLIQUE PARA REDIRECIONAR PARA A PÁGINA DA VERSÃO COM PARÂMETRO
    listItem.addEventListener('click', () => {
        let versaoCod = null; // Variável para armazenar o código da versão ('arc', 'ara', etc.)
        const titleLower = anime.titleAnime.toLowerCase(); // Converte o título para minúsculas para comparação

        // Mapeia o título para o código da versão (verifique se estas strings correspondem aos seus arquivos .js)
        if (titleLower.includes('arc')) versaoCod = 'arc';
        else if (titleLower.includes('ara')) versaoCod = 'ara';
        else if (titleLower.includes('acf')) versaoCod = 'acf';
        else if (titleLower.includes('naa')) versaoCod = 'naa';
        else if (titleLower.includes('nvi')) versaoCod = 'nvi';
        else if (titleLower.includes('ntlh')) versaoCod = 'ntlh';
        else if (titleLower.includes('bkj')) versaoCod = 'bkj'; // Verifique se o nome do arquivo JS é 'bkj.js'
        else if (titleLower.includes('original')) versaoCod = 'original';
        // Adicione mapeamentos 'else if' para outras versões que você adicionar

        // Se um código de versão foi encontrado no título
        if (versaoCod) {
            // Constrói a URL de destino para a página de leitura, passando a versão como parâmetro
            // Assumindo que a página de leitura está em 'html/versoes.html'
            const urlDestino = `html/versoes.html?version=${versaoCod}`;
            console.log(`Redirecionando para: ${urlDestino}`);
            window.location.href = urlDestino; // Redireciona o navegador para a URL construída
        } else {
            // Se não encontrar uma correspondência no título (ex: nome diferente em animeList)
            console.warn(`Não foi possível determinar o código da versão para: ${anime.titleAnime}`);
            alert("Não foi possível abrir esta versão. Código não identificado.");
        }
    });

    // Adiciona a imagem e o título ao item da lista (<li>)
    listItem.appendChild(img);
    listItem.appendChild(name);
    // Retorna o elemento <li> completo
    return listItem;
}

// --- Lógica dos Pop-ups (Adicionar Nova Versão e Boas-Vindas) ---

// Garante que os elementos do DOM existem antes de adicionar listeners
document.addEventListener('DOMContentLoaded', () => {
    const realFileBtn = document.getElementById('realFile');
    const customBtn = document.getElementById('newAnimeImg');
    const imgPreviewEl = document.getElementById('imgPreview');
    let uploadedImg = ''; // Variável para armazenar a imagem carregada em base64

    // Listener para o botão de upload de imagem "invisível"
    if (realFileBtn) {
        realFileBtn.addEventListener('change', () => {
            if (realFileBtn.files && realFileBtn.files.length > 0) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    uploadedImg = reader.result; // Salva a imagem como string base64
                    if (imgPreviewEl) {
                        imgPreviewEl.src = uploadedImg; // Mostra a prévia
                        imgPreviewEl.style.display = 'flex'; // Ou 'block'
                    }
                    if (customBtn) {
                        customBtn.style.display = 'none'; // Esconde o botão de placeholder
                    }
                }
                reader.readAsDataURL(realFileBtn.files[0]); // Lê o arquivo como base64
            }
        });
    } else {
        console.warn("Elemento 'realFile' não encontrado.");
    }

    // Listener para o botão de upload de imagem visível (que clica no botão invisível)
    if (customBtn) {
        customBtn.addEventListener('click', () => {
            if (realFileBtn) {
                realFileBtn.click(); // Simula o clique no input[type=file]
            }
        });
    } else {
        console.warn("Elemento 'newAnimeImg' não encontrado.");
    }

    // Adiciona listeners aos botões de abrir/fechar popups se eles existirem
    const openPopupButton = document.querySelector('.openPopup');
    if (openPopupButton) {
        // A função openPopup() está definida globalmente abaixo
    } else {
         console.warn("Botão '.openPopup' não encontrado.");
    }

    const closePopupButton = document.querySelector('.popup .closeStyle');
    if (closePopupButton) {
         // A função closePopup() está definida globalmente abaixo
    } else {
        console.warn("Botão '.closeStyle' dentro de '.popup' não encontrado.");
    }

    const closeWlcButton = document.querySelector('.closeWlc');
    if (closeWlcButton) {
        // A função closeWlc() está definida globalmente abaixo
    } else {
        console.warn("Botão '.closeWlc' não encontrado.");
    }

    const saveButton = document.querySelector('.saveStyle');
    if (saveButton) {
         // A função saveAnime() está definida globalmente abaixo
    } else {
        console.warn("Botão '.saveStyle' não encontrado.");
    }


    // Inicializa carregando toda a lista (sem filtro)
    searchBar(); // Chama searchBar quando o DOM está pronto

}); // Fim do DOMContentLoaded


// --- Funções Globais para Popups (precisam estar fora do DOMContentLoaded para serem chamadas pelo onclick) ---

// Mostra o pop-up para adicionar nova versão
function openPopup() {
    document.body.classList.add('visible'); // Adiciona classe ao body para mostrar overlay e popup
}

// Fecha o pop-up de adicionar versão e reseta os campos
function closePopup() {
    document.body.classList.remove('visible'); // Remove classe do body
    const imgPreviewEl = document.getElementById('imgPreview');
    const customBtn = document.getElementById('newAnimeImg');
    const realFileBtn = document.getElementById('realFile');
    const titleInput = document.getElementById('newAnimeTitle');

    // Reseta a prévia da imagem
    if (imgPreviewEl) {
        imgPreviewEl.src = '';
        imgPreviewEl.style.display = 'none';
    }
    // Mostra o botão de placeholder novamente
    if (customBtn) {
        customBtn.style.display = 'block'; // Ou 'flex' dependendo do seu CSS inicial
    }
    // Limpa o valor do input de arquivo (importante para permitir selecionar o mesmo arquivo novamente)
    if (realFileBtn) {
       realFileBtn.value = ''; // Limpa a seleção de arquivo
    }
    // Limpa o campo de título
    if (titleInput) {
       titleInput.value = '';
    }
    // Reseta a variável da imagem carregada
    uploadedImg = '';
}

// Fecha o pop-up de boas-vindas
function closeWlc() {
    const welcomePopup = document.getElementById('popupWlc');
    if (welcomePopup) {
        welcomePopup.classList.remove('visibleWlc'); // Remove a classe que o torna visível
    } else {
        console.warn("Popup de boas-vindas 'popupWlc' não encontrado.");
    }
}

// Salva uma nova versão de Bíblia na lista (ATENÇÃO: Salva apenas na memória, será perdido ao recarregar)
function saveAnime() {
    const animeNameInput = document.getElementById('newAnimeTitle');
    const animeName = animeNameInput ? animeNameInput.value : null;
    const animeImg = uploadedImg; // Pega a imagem carregada (em base64)

    if (!animeName || animeName.trim() === '') {
        alert('Por favor, insira um título para a versão.');
        return;
    }
    if (!animeImg) {
        alert('Por favor, selecione uma imagem para a versão.');
        return;
    }

    // Adiciona a nova versão à lista na memória
    animeList.push({ titleAnime: animeName, img: animeImg });
    searchBar(); // Atualiza a lista exibida na tela
    closePopup(); // Fecha e reseta o pop-up
    alert('Versão adicionada com sucesso! (Nota: será perdida ao recarregar a página)');
    // Para persistência, você precisaria usar localStorage ou um backend.
}

// --- FIM DO SCRIPT script.js ---