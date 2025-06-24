/*===============================================================================*/
/*                   CONFIGURAÇÃO INICIAL E VARIÁVEIS GLOBAIS                    */
/*  Lista que guarda todas as versões da Bíblia disponíveis dentro de um array   */
/*===============================================================================*/
// Criamos um array vazio que vai armazenar todas as versões da Bíblia
// Um array é como uma lista que pode guardar vários itens
const versoesBiblia = [];

/* Adiciona as versões padrão da Bíblia com seus títulos e imagens */
// O método push() adiciona um novo item ao final do array
// Cada item é um objeto com duas propriedades: tituloDesenho e img
versoesBiblia.push({ tituloDesenho: 'Bíblia ACF', img: './img/acf.png' });
versoesBiblia.push({ tituloDesenho: 'Bíblia ARA', img: './img/ara.png' });
versoesBiblia.push({ tituloDesenho: 'Bíblia ARC', img: './img/arc.png' }); 
versoesBiblia.push({ tituloDesenho: 'Bíblia KJV', img: './img/kjv.png' }); 
versoesBiblia.push({ tituloDesenho: 'Bíblia NAA', img: './img/naa.png' });
versoesBiblia.push({ tituloDesenho: 'Bíblia NTLH', img: './img/ntlh.png' });
versoesBiblia.push({ tituloDesenho: 'Bíblia NVI', img: './img/nvi.png' });
versoesBiblia.push({ tituloDesenho: 'Bíblia NVT', img: './img/nvt.png' }); 
versoesBiblia.push({ tituloDesenho: 'Bíblia Original', img: './img/original.png' });

/*===============================================================================*/
/*                  INICIALIZAÇÃO E CONFIGURAÇÃO DE EVENTOS                      */
/* Esta função é responsável por mostrar todas as versões da Bíblia na tela.     */
/* Ela pega os dados da nossa lista `versoesBiblia` e cria os elementos visuais. */
/*===============================================================================*/

function exibirTodasVersoes() {
    /* O bloco abaixo encontra a lista onde todas as versões serão mostradas (CAPAS)*/
    // getElementById busca um elemento na página pelo seu ID
    // Se não encontrar, retorna null
    const lista = document.getElementById('lista');
    if (!lista) {
        // Se não encontrar a lista, mostra um erro no console
        console.error("Elemento <ul id='lista'> não encontrado no index.html");
        return; // Para a execução da função
    }
    /* A linha abaixo limpa a lista atual para evitar duplicação */
    // innerHTML = '' remove todo o conteúdo dentro da lista
    lista.innerHTML = '';
    
    /* O bloco abaixo adiciona cada versão da Bíblia à lista */
    // for é um loop que repete o código para cada item do array
    // i começa em 0 e vai até o tamanho do array - 1
    for (let i = 0; i < versoesBiblia.length; i++) {
        // appendChild adiciona um novo elemento como filho da lista
        // criarelementodesenho cria o elemento visual para cada versão
        lista.appendChild(criarelementodesenho(versoesBiblia[i]));
    }
}

/*===============================================================================*/
/*                    CRIAÇÃO E MANIPULAÇÃO DE ELEMENTOS HTML                    */
/*               Cria um item de lista para uma versão da Bíblia                 */
/*===============================================================================*/

function criarelementodesenho(desenho) {
    // Cria os elementos HTML que vamos usar
    const listaItem = document.createElement('li');          // Cria item da lista
    const img = document.createElement('img');              // Cria elemento de imagem
    const titulo = document.createElement('h2');            // Cria elemento de título

    // Configura as propriedades dos elementos
    img.src = desenho.img;                                    // Define o caminho da imagem
    img.alt = desenho.tituloDesenho;                         // Define texto alternativo (importante para acessibilidade)
    titulo.innerHTML = desenho.tituloDesenho;                // Define o texto do título
    
    /* O bloco abaixo adiciona ação ao clicar na versão */
    // addEventListener adiciona um "ouvinte" de eventos
    // 'click' é o tipo de evento (quando o usuário clica)
    // () => { ... } é uma função que será executada quando o evento acontecer
    listaItem.addEventListener('click', () => {
        let codigoVersao = null;                               // Código da versão
        // toLowerCase() converte o texto para minúsculas
        const tituloMinusculo = desenho.tituloDesenho.toLowerCase();

        /* O bloco abaixo identifica qual versão foi clicada */
        // includes() verifica se uma string contém outra
        // if/else if são condições que verificam qual versão foi clicada
        if (tituloMinusculo.includes('acf')) codigoVersao = 'acf';
        else if (tituloMinusculo.includes('ara')) codigoVersao = 'ara';
        else if (tituloMinusculo.includes('arc')) codigoVersao = 'arc';
        else if (tituloMinusculo.includes('kjv')) codigoVersao = 'kjv';
        else if (tituloMinusculo.includes('naa')) codigoVersao = 'naa';
        else if (tituloMinusculo.includes('ntlh')) codigoVersao = 'ntlh';
        else if (tituloMinusculo.includes('nvi')) codigoVersao = 'nvi';
        else if (tituloMinusculo.includes('nvt')) codigoVersao = 'nvt';
        else if (tituloMinusculo.includes('original')) codigoVersao = 'original';

        if (codigoVersao) {
            // Template string (usando `) permite incluir variáveis dentro do texto
            const urlDestino = `html/versoes.html?versao=${codigoVersao}`;    // Cria URL de destino
            console.log(`Redirecionando para: ${urlDestino}`);              // Mostra no console
            window.location.href = urlDestino;                              // Muda para a página
        } else {
            // Se não encontrou o código da versão, mostra aviso
            console.warn(`Não foi possível determinar o código da versão para: ${desenho.tituloDesenho}`);
            alert("Não foi possível abrir esta versão. Código não identificado.");
        }
    });

    // Monta o elemento final
    listaItem.appendChild(img);   // Adiciona imagem ao item
    listaItem.appendChild(titulo);  // Adiciona título ao item
    return listaItem;             // Retorna o item completo
}

/*===============================================================================*/
/*                 GERENCIAMENTO DE POP-UPS E UPLOAD DE IMAGENS                  */
/*===============================================================================*/

/* A linha abaixo guarda a imagem escolhida temporariamente */
// Variável global que armazena a imagem em formato base64
let subirImg = '';

/* O bloco abaixo configura a página quando ela carrega */
// DOMContentLoaded é um evento que acontece quando a página termina de carregar
document.addEventListener('DOMContentLoaded', () => {
    /* Encontra os elementos para upload de imagem */
    // querySelector busca elementos usando seletores CSS
    const botaoArquivoReal = document.getElementById('arquivo-imagem');          // Campo de arquivo
    const botaoPersonalizado = document.getElementById('novo-botao-imagem');         // Botão personalizado
    const previsualizacaoImagem = document.getElementById('previsualizacao-imagem'); // Área de preview

    /* O bloco abaixo configura o que acontece ao escolher uma imagem */
    if (botaoArquivoReal) {
        // 'change' é o evento que acontece quando o usuário seleciona um arquivo
        botaoArquivoReal.addEventListener('change', () => {
            // Verifica se um arquivo foi selecionado
            if (botaoArquivoReal.files && botaoArquivoReal.files.length > 0) {
                // FileReader é uma classe que lê arquivos
                const leitorArquivo = new FileReader();                            // Lê o arquivo
                // onloadend é chamado quando a leitura termina
                leitorArquivo.onloadend = () => {
                    subirImg = leitorArquivo.result;                            // Guarda a imagem
                    if (previsualizacaoImagem) {
                        previsualizacaoImagem.src = subirImg;                     // Mostra a imagem
                        previsualizacaoImagem.style.display = 'flex';
                    }
                    if (botaoPersonalizado) {
                        botaoPersonalizado.style.display = 'none';                   // Esconde o botão
                    }
                }
                // readAsDataURL converte o arquivo para base64
                leitorArquivo.readAsDataURL(botaoArquivoReal.files[0]);                 // Lê a imagem
            }
        });
    } else {
        console.warn("Elemento 'arquivo-imagem' não encontrado.");
    }

    /* O bloco abaixo Configura o botão de escolher imagem */
    if (botaoPersonalizado) {
        // 'click' é o evento que acontece quando o usuário clica
        botaoPersonalizado.addEventListener('click', () => {
            if (botaoArquivoReal) {
                botaoArquivoReal.click();                                        // Abre seletor de arquivo
            }
        });
    } else {
        console.warn("Elemento 'novo-botao-imagem' não encontrado.");
    }

    /* O bloco abaixo encontra os botões de controle */
    // querySelector busca elementos usando seletores CSS
    const abreBotaoPopup = document.querySelector('.abrir-popup');                       // Botão abrir
    if (!abreBotaoPopup) console.warn("Botão '.abrir-popup' não encontrado.");

    const fechaBotaoPopup = document.querySelector('.popup-nova-versao .fechar-popup');  // Botão fechar
    if (!fechaBotaoPopup) console.warn("Botão '.fechar-popup' não encontrado.");

    const fechaBotaoBoasVindas = document.querySelector('.fechar-boas-vindas');                 // Botão fechar boas-vindas
    if (!fechaBotaoBoasVindas) console.warn("Botão '.fechar-boas-vindas' não encontrado.");

    const botaoSalvar = document.querySelector('.salvar-versao');                          // Botão salvar
    if (!botaoSalvar) console.warn("Botão '.salvar-versao' não encontrado.");

    /*A linha abaixo Mostra todas as versões da Bíblia */
    exibirTodasVersoes();
});

/* A função abaixo abre o PUP-UP para adicionar nova versão */
function abrirPopup() {
    // classList.add adiciona uma classe CSS ao elemento
    document.body.classList.add('visivel');
}

/* A função abaixo fecha a janela e limpa os campos */
function fecharPopup() {
    // classList.remove remove uma classe CSS do elemento
    document.body.classList.remove('visivel');
    // Busca os elementos que precisam ser limpos
    const previsualizacaoImagem = document.getElementById('previsualizacao-imagem');
    const botaoPersonalizado = document.getElementById('novo-botao-imagem');
    const botaoArquivoReal = document.getElementById('arquivo-imagem');
    const entradaTitulo = document.getElementById('novo-titulo-biblia');
    
    /* O bloco abaixo limpa e reseta cada campo para o seu estado inicial */
    if (previsualizacaoImagem) {
        previsualizacaoImagem.src = '';  // Limpa a imagem
        previsualizacaoImagem.style.display = 'none';  // Esconde o elemento
    }
    if (botaoPersonalizado) {
        botaoPersonalizado.style.display = 'block';  // Mostra o botão
    }
    if (botaoArquivoReal) {
        botaoArquivoReal.value = '';  // Limpa o campo de arquivo
    }
    if (entradaTitulo) {
        entradaTitulo.value = '';  // Limpa o campo de texto
    }
    subirImg = '';  // Limpa a variável que guarda a imagem
}

/* Fecha a janela de boas-vindas */
function fecharSejaBemVindo() {
    const popupBoasVindas = document.getElementById('popup-seja-bem-vindo');
    if (popupBoasVindas) {
        popupBoasVindas.classList.remove('ativo');  // Remove a classe que mostra o popup
    } else {
        console.warn("Popup de boas-vindas 'popup-seja-bem-vindo' não encontrado.");
    }
}

/* Salva uma nova versão da Bíblia */
function salvarVersao() {
    // Busca o campo de título
    const entradaTitulo = document.getElementById('novo-titulo-biblia');
    const nomeDesenho = entradaTitulo ? entradaTitulo.value : null;
    const imgDesenho = subirImg;
    
    /* Verifica se todos os campos foram preenchidos */
    // trim() remove espaços em branco do início e fim
    if (!nomeDesenho || nomeDesenho.trim() === '') {
        alert('Por favor, insira um título para a versão.');
        return;
    }
    if (!imgDesenho) {
        alert('Por favor, selecione uma imagem para a versão.');
        return;
    }
    
    /* Adiciona a nova versão e atualiza a tela */
    versoesBiblia.push({ titleAnime: nomeDesenho, img: imgDesenho });  // Adiciona ao array
    exibirTodasVersoes();  // Atualiza a tela
    fecharPopup();  // Fecha o popup
    alert('Versão adicionada com sucesso! (Nota: será perdida ao recarregar a página)');
}