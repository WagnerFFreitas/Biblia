/*===============================================================================*/
/*                   CONFIGURAÇÃO INICIAL E VARIÁVEIS GLOBAIS                    */
/*  Lista que guarda todas as versões da Bíblia disponíveis dentro de um array   */
/*===============================================================================*/
const bibleVersions = [];

/* Adiciona as versões padrão da Bíblia com seus títulos e imagens */
bibleVersions.push({ titleAnime: 'Bíblia ACF', img: './img/acf.png' });
bibleVersions.push({ titleAnime: 'Bíblia ARA', img: './img/ara.png' });
bibleVersions.push({ titleAnime: 'Bíblia ARC', img: './img/arc.png' }); 
bibleVersions.push({ titleAnime: 'Bíblia KJV', img: './img/kjv.png' }); 
bibleVersions.push({ titleAnime: 'Bíblia NAA', img: './img/naa.png' });
bibleVersions.push({ titleAnime: 'Bíblia NTLH', img: './img/ntlh.png' });
bibleVersions.push({ titleAnime: 'Bíblia NVI', img: './img/nvi.png' });
bibleVersions.push({ titleAnime: 'Bíblia NVT', img: './img/nvt.png' }); 
bibleVersions.push({ titleAnime: 'Bíblia Original', img: './img/original.png' });

/*===============================================================================*/
/*                  INICIALIZAÇÃO E CONFIGURAÇÃO DE EVENTOS                      */
/* Esta função é responsável por mostrar todas as versões da Bíblia na tela.     */
/* Ela pega os dados da nossa lista `bibleVersions` e cria os elementos visuais. */
/*===============================================================================*/

function exibirTodasVersoes() {
    /* O bloco abaixo encontra a lista onde todas as versões serão mostradas (CAPAS)*/
    const list = document.getElementById('lista');
    if (!list) {
        console.error("Elemento <ul id='lista'> não encontrado no index.html");
        return;
    }
    /* A linha abaixo limpa a lista atual para evitar duplicação */
    list.innerHTML = '';
    
    /* O bloco abaixo adiciona cada versão da Bíblia à lista */
    for (let i = 0; i < bibleVersions.length; i++) {
        list.appendChild(createElementAnime(bibleVersions[i]));
    }
}

/*===============================================================================*/
/*                    CRIAÇÃO E MANIPULAÇÃO DE ELEMENTOS HTML                    */
/*               Cria um item de lista para uma versão da Bíblia                 */
/*===============================================================================*/

function createElementAnime(anime) {
    const listItem = document.createElement('li');          // Cria item da lista
    const img = document.createElement('img');              // Cria elemento de imagem
    const name = document.createElement('h2');              // Cria elemento de título
    img.src = anime.img;                                    // Define imagem
    img.alt = anime.titleAnime;                             // Define texto alternativo
    name.innerHTML = anime.titleAnime;                      // Define título
    
    /* O bloco abaixo adiciona ação ao clicar na versão */
    listItem.addEventListener('click', () => {
        let versaoCod = null;                               // Código da versão
        const titleLower = anime.titleAnime.toLowerCase();  // Título em minúsculas

        /* O bloco abaixo identifica qual versão foi clicada */
        if (titleLower.includes('acf')) versaoCod = 'acf';
        else if (titleLower.includes('ara')) versaoCod = 'ara';
        else if (titleLower.includes('arc')) versaoCod = 'arc';
        else if (titleLower.includes('kjv')) versaoCod = 'kjv';
        else if (titleLower.includes('naa')) versaoCod = 'naa';
        else if (titleLower.includes('ntlh')) versaoCod = 'ntlh';
        else if (titleLower.includes('nvi')) versaoCod = 'nvi';
        else if (titleLower.includes('nvt')) versaoCod = 'nvt';
        else if (titleLower.includes('original')) versaoCod = 'original';

        if (versaoCod) {
            const urlDestino = `html/versoes.html?version=${versaoCod}`;    // Cria URL de destino
            console.log(`Redirecionando para: ${urlDestino}`);              // Mostra no console
            window.location.href = urlDestino;                              // Muda para a página
        } else {
            console.warn(`Não foi possível determinar o código da versão para: ${anime.titleAnime}`);
            alert("Não foi possível abrir esta versão. Código não identificado.");
        }
    });

    listItem.appendChild(img);   // Adiciona imagem ao item
    listItem.appendChild(name);  // Adiciona título ao item
    return listItem;             // Retorna o item completo
}

/*===============================================================================*/
/*                 GERENCIAMENTO DE POP-UPS E UPLOAD DE IMAGENS                  */
/*===============================================================================*/

/* A linha abaixo guarda a imagem escolhida temporariamente */
let uploadedImg = '';

/* O bloco abaixo configura a página quando ela carrega */
document.addEventListener('DOMContentLoaded', () => {
    /* Encontra os elementos para upload de imagem */
    const realFileBtn = document.getElementById('arquivo-imagem');          // Campo de arquivo
    const customBtn = document.getElementById('novo-botao-imagem');         // Botão personalizado
    const imgPreviewEl = document.getElementById('previsualizacao-imagem'); // Área de preview

    /* O bloco abaixo configura o que acontece ao escolher uma imagem */
    if (realFileBtn) {
        realFileBtn.addEventListener('change', () => {
            if (realFileBtn.files && realFileBtn.files.length > 0) {
                const reader = new FileReader();                            // Lê o arquivo
                reader.onloadend = () => {
                    uploadedImg = reader.result;                            // Guarda a imagem
                    if (imgPreviewEl) {
                        imgPreviewEl.src = uploadedImg;                     // Mostra a imagem
                        imgPreviewEl.style.display = 'flex';
                    }
                    if (customBtn) {
                        customBtn.style.display = 'none';                   // Esconde o botão
                    }
                }
                reader.readAsDataURL(realFileBtn.files[0]);                 // Lê a imagem
            }
        });
    } else {
        console.warn("Elemento 'arquivo-imagem' não encontrado.");
    }

    /* O bloco abaixo Configura o botão de escolher imagem */
    if (customBtn) {
        customBtn.addEventListener('click', () => {
            if (realFileBtn) {
                realFileBtn.click();                                        // Abre seletor de arquivo
            }
        });
    } else {
        console.warn("Elemento 'novo-botao-imagem' não encontrado.");
    }

    /* O bloco abaixo encontra os botões de controle */
    const openPopupButton = document.querySelector('.abrir-popup');                       // Botão abrir
    if (!openPopupButton) console.warn("Botão '.abrir-popup' não encontrado.");

    const closePopupButton = document.querySelector('.popup-nova-versao .fechar-popup');  // Botão fechar
    if (!closePopupButton) console.warn("Botão '.fechar-popup' não encontrado.");

    const closeWlcButton = document.querySelector('.fechar-boas-vindas');                 // Botão fechar boas-vindas
    if (!closeWlcButton) console.warn("Botão '.fechar-boas-vindas' não encontrado.");

    const saveButton = document.querySelector('.salvar-versao');                          // Botão salvar
    if (!saveButton) console.warn("Botão '.salvar-versao' não encontrado.");

    /*A linha abaixo Mostra todas as versões da Bíblia */
    exibirTodasVersoes();
});

/* A função abaixo abre o PUP-UP para adicionar nova versão */
function abrirPopup() {
    document.body.classList.add('visivel');
}

/* A função abaixo fecha a janela e limpa os campos */
function fecharPopup() {
    document.body.classList.remove('visivel');
    const imgPreviewEl = document.getElementById('previsualizacao-imagem');
    const customBtn = document.getElementById('novo-botao-imagem');
    const realFileBtn = document.getElementById('arquivo-imagem');
    const titleInput = document.getElementById('novo-titulo-biblia');
    
    /* O bloco abaixo limpa e reseta cada campo para o seu estado inicial os Limpa todos os campos */
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

/* Fecha a janela de boas-vindas */
function fecharSejaBemVindo() {
    const welcomePopup = document.getElementById('popup-seja-bem-vindo');
    if (welcomePopup) {
        welcomePopup.classList.remove('ativo');
    } else {
        console.warn("Popup de boas-vindas 'popup-seja-bem-vindo' não encontrado.");
    }
}

/* Salva uma nova versão da Bíblia */
function salvarVersao() {
    const animeNameInput = document.getElementById('novo-titulo-biblia');
    const animeName = animeNameInput ? animeNameInput.value : null;
    const animeImg = uploadedImg;
    
    /* Verifica se todos os campos foram preenchidos */
    if (!animeName || animeName.trim() === '') {
        alert('Por favor, insira um título para a versão.');
        return;
    }
    if (!animeImg) {
        alert('Por favor, selecione uma imagem para a versão.');
        return;
    }
    
    /* Adiciona a nova versão e atualiza a tela */
    bibleVersions.push({ titleAnime: animeName, img: animeImg });
    exibirTodasVersoes();
    fecharPopup();
    alert('Versão adicionada com sucesso! (Nota: será perdida ao recarregar a página)');
}