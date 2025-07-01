/*===============================================================================*/
/*                    MÓDULO DE GERENCIAMENTO DA SEÇÃO "SOBRE"                   */
/*===============================================================================*/
/*  Este script é responsável por:                                               */
/*                       - Exibir e ocultar a página de informações do projeto   */
/*                       - Aplicar animações de transição (fade in/out)          */
/*                       - Gerenciar o estado da interface ao interagir com a seção*/
/*                       - Controlar a exibição do menu em dispositivos móveis   */
/*===============================================================================*/

// Este bloco define e cria a função que carrega e exibe o conteúdo da seção "Sobre".
function loadSobre() {
    const content = document.querySelector('.conteudo');                             // Busca na página o elemento principal onde todo o conteúdo é exibido.

    // Este bloco remove elementos antigos da tela, mas preserva o título e a marca d'água.
    Array.from(content.children).forEach(child => {                                  // Percorre cada elemento filho direto da área de conteúdo.
        if (child !== titulo && !child.classList.contains('watermark') && !child.classList.contains('sobre-content')) { // Verifica se o elemento não é um dos que devem ser preservados.
            child.remove();                                                          // Remove o elemento da página para limpar a interface.
        }
    });

    // Este bloco gerencia o título principal, limpando-o se necessário.
    if (titulo && !content.querySelector('.sobre-content h2')) {                     // Verifica se o título principal existe e se não há um título "Sobre" já na tela.
        titulo.textContent = '';                                                     // Limpa o texto do título principal para dar espaço ao título da seção "Sobre".
    }

    // Este bloco configura o container que guardará o conteúdo da seção "Sobre".
    let sobreContent = content.querySelector('.sobre-content');                      // Tenta encontrar um container "Sobre" que já exista na página.
    if (!sobreContent) {                                                             // Se o container não for encontrado, este bloco o cria.
        sobreContent = document.createElement('div');                                // Cria um novo elemento <div> na memória.
        sobreContent.classList.add('sobre-content');                                 // Adiciona a classe CSS 'sobre-content' ao novo elemento.
        
        // Este bloco aplica estilos CSS iniciais para posicionamento e para preparar a animação.
        sobreContent.style.position = 'relative';                                    // Define o posicionamento para controle de camadas (z-index).
        sobreContent.style.zIndex = '2';                                             // Garante que o conteúdo fique acima da marca d'água.
        sobreContent.style.opacity = '0';                                            // Inicia o elemento como invisível para a animação de "fade in".

        // Este bloco define todo o conteúdo HTML que será exibido na seção "Sobre".
        sobreContent.innerHTML = `
            <h2>Sobre o Projeto Bíblia Sagrada</h2>
            <p>Este projeto tem como objetivo oferecer uma ferramenta online completa e acessível para leitura e estudo da Bíblia Sagrada.</p>
            <p>Versões disponíveis: Almeida Corrigida e Fiel (ACF), Almeida Revista e Atualizada (ARA), Almeida Revista e Corrigida (ARC), King James Version (KJV), Nova Almeida Atualizada (NAA), Nova Tradução na Linguagem de Hoje (NTLH), Nova Versão Internacional (NVI), Nova Versão Transformadora (NVT) e a versão Original em Hebraico e Grego, que ainda está em desenvolvimento.</p>
            <p>Funcionalidades incluem: Modo Leitura para facilitar a leitura contínua dos capítulos, Modo Slide ideal para apresentações em Datashow, opção Baixar com materiais para estudo bíblico e a seção Utilidade com links úteis, incluindo cursos gratuitos ou com valores acessíveis.</p>
            <p>Utilize o menu lateral para navegar pelos livros e os botões que aparecem para selecionar capítulos e versículos.</p>
            <p>O projeto está em desenvolvimento contínuo. Se tiver alguma sugestão, fique à vontade para enviar por e-mail através do endereço disponível na seção de contato.</p>
        `;                                                                           // Insere o bloco de texto HTML dentro do container.
        
        content.appendChild(sobreContent);                                           // Adiciona o container recém-criado à página.
        void sobreContent.offsetWidth;                                               // Forçar o navegador a recalcular o layout, garantindo que a animação comece corretamente.

        sobreContent.style.transition = 'opacity 0.5s ease-in';                      // Define a duração e o tipo da animação de opacidade.
        sobreContent.style.opacity = '1';                                            // Altera a opacidade para 1, fazendo o elemento aparecer suavemente.
    } else {

        sobreContent.style.transition = 'opacity 0.5s ease-in';                      // Define a animação para o reaparecimento.
        sobreContent.style.opacity = '1';                                            // Altera a opacidade para 1 para torná-lo visível.
    }

    activeLivro = null;                                                              // Limpa a variável de livro ativo.
    activeCapitulo = null;                                                           // Limpa a variável de capítulo ativo.
    activeVersiculoButton = null;                                                    // Limpa a variável de versículo ativo.
}

// Este bloco define a função que oculta o conteúdo da seção "Sobre" com uma animação.
function hideSobre() {                                                                         // Define a função que oculta a seção "Sobre".
    const content = document.querySelector('.conteudo');                                       // Busca o container principal da página.
    const sobreContent = content.querySelector('.sobre-content');                              // Busca o container específico da seção "Sobre".
    
    if (sobreContent) {                                                                        // Verifica se o container "Sobre" realmente existe na página.
        // Este bloco aplica a animação de saída (fade out).
        sobreContent.style.transition = 'opacity 0.3s ease-out';                               // Define a duração e o tipo da animação de desaparecimento.
        sobreContent.style.opacity = '0';                                                      // Altera a opacidade para 0, fazendo o elemento desaparecer suavemente.
        
        // Este bloco aguarda o fim da animação para remover o elemento da página.
        setTimeout(() => {                                                                     // Agenda uma ação para ser executada após um tempo (300ms).
            if (sobreContent && sobreContent.parentNode === content) {                         // Verifica novamente se o elemento ainda existe antes de removê-lo.
                sobreContent.remove();                                                         // Remove o elemento da página de forma definitiva.
            }
        }, 300);                                                                               // Define o tempo de espera para 300 milissegundos.
    }
}

// Este bloco configura os "ouvintes" de eventos para os elementos da interface.
const sobreLink = document.getElementById('sobre');                                            // Busca o link "Sobre" no menu principal pelo seu ID.
if (sobreLink) {                                                                               // Verifica se o link foi encontrado.
    
    // Este bloco adiciona um evento de clique que exibe a seção "Sobre".
    sobreLink.addEventListener('click', (event) => {                                           // Adiciona o "ouvinte" para o evento de clique.
        event.preventDefault();                                                                // Impede o comportamento padrão do link (que seria navegar para '#').
        loadSobre();                                                                           // Chama a função para carregar e exibir a seção "Sobre".
    });
} else {                                                                                       // Se o link "Sobre" não for encontrado...
    console.warn("Link 'Sobre' com ID 'sobre' não encontrado.");                               // Exibe um aviso no console para depuração.
}

// Este bloco configura eventos para ocultar a seção "Sobre" ao interagir com outros itens do menu.
const topNavItems = document.querySelectorAll('header nav > ul > li');                         // Busca todos os itens principais do menu de navegação.
if (topNavItems.length > 0) {                                                                  // Verifica se algum item de menu foi encontrado.
    topNavItems.forEach(item => {                                                              // Percorre cada item de menu encontrado.
        item.addEventListener('mouseenter', () => {                                            // Adiciona um evento que dispara quando o mouse entra na área do item.
            hideSobre();                                                                       // Chama a função para ocultar a seção "Sobre".
        });
    });
} else {                                                                                       // Se nenhum item do menu for encontrado...
    console.warn("Itens do menu superior não encontrados para adicionar listener.");           // Exibe um aviso no console.
}

// Este bloco configura o botão de menu para dispositivos móveis (hamburger menu).
const menuButton = document.querySelector('.menu-button');                                     // Busca o botão do menu móvel pela sua classe CSS.
if (menuButton) {                                                                              // Verifica se o botão do menu móvel foi encontrado.
    menuButton.addEventListener('click', () => {                                               // Adiciona um evento que dispara quando o botão é clicado.
        const menuLivros = document.querySelector('.menu-livros');                             // Busca o menu lateral de livros.
        if (menuLivros) {                                                                      // Se o menu de livros existir...
            menuLivros.classList.toggle('show');                                               // Adiciona a classe 'show' se não existir, e a remove se já existir.
        }
    });
}