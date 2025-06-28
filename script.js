/*===============================================================================*/
/*                   CONFIGURAÇÃO INICIAL E VARIÁVEIS GLOBAIS                    */
/*  Lista que guarda todas as versões da Bíblia disponíveis dentro de um array   */
/*===============================================================================*/

const versoesBiblia = [];                                                                   // Array que armazena todas as versões da Bíblia

// Este bloco adiciona as versões padrão da Bíblia com seus títulos e imagens
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

// Esta bloco cria a função para exibe todas as versões da Bíblia na tela
function exibirTodasVersoes() {
    const lista = document.getElementById('lista');                                         // Obtém o elemento <ul> com id 'lista' do HTML
    if (!lista) {
        console.error("Elemento <ul id='lista'> não encontrado no index.html");             // Se não encontrar a lista, mostra um erro no console
        return;                                                                             // Para a execução da função
    }
    lista.innerHTML = '';                                                                   // Limpa a lista atual para evitar duplicação
    for (let i = 0; i < versoesBiblia.length; i++) {
        lista.appendChild(criarelementodesenho(versoesBiblia[i]));                          // Adiciona o elemento visual de cada versão à lista
    }
}

/*===============================================================================*/
/*                    CRIAÇÃO E MANIPULAÇÃO DE ELEMENTOS HTML                    */
/*               Cria um item de lista para uma versão da Bíblia                 */
/*===============================================================================*/

// Este bloco cria a função para um item da lista para uma versão da Bíblia
function criarelementodesenho(desenho) { 
    const listaItem = document.createElement('li');                                         // Cria item da lista
    const img = document.createElement('img');                                              // Cria elemento de imagem
    const titulo = document.createElement('h2');                                            // Cria elemento de título
    img.src = desenho.img;                                                                  // Define o caminho da imagem
    img.alt = desenho.tituloDesenho;                                                        // Define texto alternativo (importante para acessibilidade)
    titulo.innerHTML = desenho.tituloDesenho;                                               // Define o texto do título
    listaItem.addEventListener('click', () => {
        let codigoVersao = null;                                                            // Código da versão
        
        // Este bloco converte o texto para minúsculas
        const tituloMinusculo = desenho.tituloDesenho.toLowerCase();
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
            
            // Este bloco cria URL de destino
            const urlDestino = `html/versoes.html?versao=${codigoVersao}`;
            console.log(`Redirecionando para: ${urlDestino}`);                              // Mostra no console
            window.location.href = urlDestino;                                              // Muda para a página
        } else {
            console.warn(`Não foi possível determinar o código da versão para: ${desenho.tituloDesenho}`); // Aviso se não encontrou o código
            alert("Não foi possível abrir esta versão. Código não identificado.");          // Alerta para o usuário
        }
    });

    listaItem.appendChild(img);                                                             // Adiciona imagem ao item
    listaItem.appendChild(titulo);                                                          // Adiciona título ao item
    return listaItem;                                                                       // Retorna o item completo
}

/*===============================================================================*/
/*                 GERENCIAMENTO DE POP-UPS E UPLOAD DE IMAGENS                  */
/*===============================================================================*/

let subirImg = '';                                                                          // Guarda a imagem escolhida temporariamente em base64

document.addEventListener('DOMContentLoaded', () => {
    const botaoArquivoReal = document.getElementById('arquivo-imagem');                     // Campo de arquivo
    const botaoPersonalizado = document.getElementById('novo-botao-imagem');                // Botão personalizado
    const previsualizacaoImagem = document.getElementById('previsualizacao-imagem');        // Área de preview
    if (botaoArquivoReal) {
        botaoArquivoReal.addEventListener('change', () => {                                 // Evento ao selecionar um arquivo
            if (botaoArquivoReal.files && botaoArquivoReal.files.length > 0) {
                const leitorArquivo = new FileReader();                                     // Lê o arquivo
                leitorArquivo.onloadend = () => {
                    subirImg = leitorArquivo.result;                                        // Guarda a imagem
                    if (previsualizacaoImagem) {
                        previsualizacaoImagem.src = subirImg;                               // Mostra a imagem
                        previsualizacaoImagem.style.display = 'flex';                       // Exibe a pré-visualização
                    }
                    if (botaoPersonalizado) {
                        botaoPersonalizado.style.display = 'none';                          // Esconde o botão personalizado
                    }
                }
                leitorArquivo.readAsDataURL(botaoArquivoReal.files[0]);                     // Lê a imagem como base64
            }
        });
    } else {
        console.warn("Elemento 'arquivo-imagem' não encontrado.");                          // Aviso se não encontrou o campo de arquivo
    }
    if (botaoPersonalizado) {
        botaoPersonalizado.addEventListener('click', () => {                                // Evento ao clicar no botão personalizado
            if (botaoArquivoReal) {
                botaoArquivoReal.click();                                                   // Abre seletor de arquivo
            }
        });
    } else {
        console.warn("Elemento 'novo-botao-imagem' não encontrado.");                       // Aviso se não encontrou o botão personalizado
    }

    // Este bloco busca os botões da interface
    const abreBotaoPopup = document.querySelector('.abrir-popup');                          // Botão abrir popup
    if (!abreBotaoPopup) console.warn("Botão '.abrir-popup' não encontrado.");              // Aviso se não encontrou o botão abrir popup
    const fechaBotaoPopup = document.querySelector('.popup-nova-versao .fechar-popup');     // Botão fechar popup
    if (!fechaBotaoPopup) console.warn("Botão '.fechar-popup' não encontrado.");            // Aviso se não encontrou o botão fechar popup
    const fechaBotaoBoasVindas = document.querySelector('.fechar-boas-vindas');             // Botão fechar boas-vindas
    if (!fechaBotaoBoasVindas) console.warn("Botão '.fechar-boas-vindas' não encontrado."); // Aviso se não encontrou o botão fechar boas-vindas
    const botaoSalvar = document.querySelector('.salvar-versao');                           // Botão salvar versão
    if (!botaoSalvar) console.warn("Botão '.salvar-versao' não encontrado.");               // Aviso se não encontrou o botão salvar versão
    exibirTodasVersoes();                                                                   // Mostra todas as versões da Bíblia
});

// Este bloco cria a função para exibir o popup de nova versão
function abrirPopup() {
    document.body.classList.add('visivel');                                                 // Adiciona classe para exibir popup
}

// Este bloco cria a função para fecha o popup de nova versão
function fecharPopup() {
    document.body.classList.remove('visivel');                                              // Remove classe para esconder popup
    const previsualizacaoImagem = document.getElementById('previsualizacao-imagem');        // Área de preview
    const botaoPersonalizado = document.getElementById('novo-botao-imagem');                // Botão personalizado
    const botaoArquivoReal = document.getElementById('arquivo-imagem');                     // Campo de arquivo
    const entradaTitulo = document.getElementById('novo-titulo-biblia');                    // Campo de título
    if (previsualizacaoImagem) {
        previsualizacaoImagem.src = '';                                                     // Limpa a imagem
        previsualizacaoImagem.style.display = 'none';                                       // Esconde o elemento
    }
    if (botaoPersonalizado) {
        botaoPersonalizado.style.display = 'block';                                         // Mostra o botão personalizado
    }
    if (botaoArquivoReal) {
        botaoArquivoReal.value = '';                                                        // Limpa o campo de arquivo
    }
    if (entradaTitulo) {
        entradaTitulo.value = '';                                                           // Limpa o campo de texto
    }
    subirImg = '';                                                                          // Limpa a variável da imagem
}

// Este bloco cria a função para fechar a janela Seja Bem-Vindo
function fecharSejaBemVindo() {                                                             // Fecha o popup de boas-vindas
    const popupBoasVindas = document.getElementById('popup-seja-bem-vindo');                // Obtém o popup de boas-vindas
    if (popupBoasVindas) {
        popupBoasVindas.classList.remove('ativo');                                          // Remove a classe que mostra o popup
    } else {
        console.warn("Popup de boas-vindas 'popup-seja-bem-vindo' não encontrado.");        // Aviso se não encontrou o popup
    }
}

// Este bloco cria a função para salva uma nova versão da Bíblia
function salvarVersao() {
    const entradaTitulo = document.getElementById('novo-titulo-biblia');                    // Campo de título
    const nomeDesenho = entradaTitulo ? entradaTitulo.value : null;                         // Nome da versão
    const imgDesenho = subirImg;                                                            // Imagem da versão
    if (!nomeDesenho || nomeDesenho.trim() === '') {
        alert('Por favor, insira um título para a versão.');                                // Alerta se não preencheu o título
        return;
    }
    if (!imgDesenho) {
        alert('Por favor, selecione uma imagem para a versão.');                            // Alerta se não selecionou imagem
        return;
    }

    // Este bloco executa as ações finais
    versoesBiblia.push({ titleAnime: nomeDesenho, img: imgDesenho });                       // Adiciona a nova versão ao array
    exibirTodasVersoes();                                                                   // Atualiza a tela
    fecharPopup();                                                                          // Fecha o popup
    alert('Versão adicionada com sucesso! (Nota: será perdida ao recarregar a página)');    // Alerta de sucesso
}