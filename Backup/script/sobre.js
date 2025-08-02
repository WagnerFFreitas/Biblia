/**
 * sobre.js
 * Este módulo gerencia a seção "Sobre" do aplicativo da Bíblia.
 * Responsável por exibir e ocultar informações sobre o projeto,
 * com animações de transição e gestão do estado da interface.
 */

/**
 * Função auxiliar para recriar a marca d'água
 */
function recriarMarcaDagua() {
    const content = document.querySelector('.conteudo');
    if (content) {
        let marcadagua = content.querySelector('.marcadagua');
        if (!marcadagua) {
            marcadagua = document.createElement('div');
            marcadagua.classList.add('marcadagua');
            const img = document.createElement('img');
            img.src = '../img/biblia.png'; // Verifique este caminho
            img.alt = "Marca d'água da Bíblia";
            img.classList.add('marcadagua-image');
            img.onload = () => console.log("Imagem da marca d'água carregada com sucesso");
            img.onerror = () => console.error("Erro ao carregar a imagem da marca d'água. Verifique o caminho: ../img/biblia.png");
            marcadagua.appendChild(img);
            content.appendChild(marcadagua);
        }
    }
}

/**
 * Carrega e exibe o conteúdo da seção "Sobre"
 * - Limpa o conteúdo existente
 * - Cria elementos necessários
 * - Aplica animações de fade
 * - Gerencia o estado da navegação
 */
function loadSobre() {
    const content = document.querySelector('.conteudo');
    
    // Preserva explicitamente a marca d'água antes de qualquer remoção
    const marcadagua = content.querySelector('.marcadagua');
    if (marcadagua) {
        marcadagua.style.display = 'block'; // Garante visibilidade
    } else {
        recriarMarcaDagua(); // Recria se não existir
    }

    // Remove elementos anteriores, preservando marca d'água e título
    Array.from(content.children).forEach(child => {
        if (child !== titulo && !child.classList.contains('marcadagua') && !child.classList.contains('sobre-content')) {
            child.remove();
        }
    });

    // Gerencia o título principal
    if (titulo && !content.querySelector('.sobre-content h2')) {
        titulo.textContent = ''; 
    }

    // Configura o container do conteúdo "Sobre"
    let sobreContent = content.querySelector('.sobre-content');
    if (!sobreContent) {
        sobreContent = document.createElement('div');
        sobreContent.classList.add('sobre-content');
        
        // Configurações de estilo para posicionamento e animação
        sobreContent.style.position = 'relative'; 
        sobreContent.style.zIndex = '2'; 
        sobreContent.style.opacity = '0'; // Início invisível para animação

        // Conteúdo HTML da seção Sobre
        sobreContent.innerHTML = `
            <h2>Sobre o Projeto Bíblia Sagrada</h2>
            <p>Este projeto tem como objetivo oferecer uma ferramenta online completa e acessível para leitura e estudo da Bíblia Sagrada.</p>
            <p>Versões disponíveis: Almeida Corrigida e Fiel (ACF), Almeida Revista e Atualizada (ARA), Almeida Revista e Corrigida (ARC), King James Version (KJV), Nova Almeida Atualizada (NAA), Nova Tradução na Linguagem de Hoje (NTLH), Nova Versão Internacional (NVI), Nova Versão Transformadora (NVT) e a versão Original em Hebraico e Grego, que ainda está em desenvolvimento.</p>
            <p>Funcionalidades incluem: Modo Leitura para facilitar a leitura contínua dos capítulos, Modo Slide ideal para apresentações em Datashow, opção Baixar com materiais para estudo bíblico e a seção Utilidade com links úteis, incluindo cursos gratuitos ou com valores acessíveis.</p>
            <p>Utilize o menu lateral para navegar pelos livros e os botões que aparecem para selecionar capítulos e versículos.</p>
            <p>O projeto está em desenvolvimento contínuo. Se tiver alguma sugestão, fique à vontade para enviar por e-mail através do endereço disponível na seção de contato.</p>
        `;
        content.appendChild(sobreContent);

        // Força reflow para garantir animação suave
        void sobreContent.offsetWidth;

        // Aplica animação de entrada
        sobreContent.style.transition = 'opacity 0.5s ease-in';
        sobreContent.style.opacity = '1';
    } else {
        // Garante visibilidade se já existir
        sobreContent.style.transition = 'opacity 0.5s ease-in';
        sobreContent.style.opacity = '1';
    }
    
    // Reseta o estado de navegação
    activeLivro = null;
    activeCapitulo = null;
    activeVersiculoButton = null;
}

/**
 * Oculta o conteúdo da seção "Sobre" com animação
 * - Aplica fade-out
 * - Remove elementos após a transição
 */
function hideSobre() {
    const content = document.querySelector('.conteudo');
    const sobreContent = content.querySelector('.sobre-content');
    
    if (sobreContent) {
        // Aplica animação de saída
        sobreContent.style.transition = 'opacity 0.3s ease-out';
        sobreContent.style.opacity = '0';
        
        // Remove elemento após animação
        setTimeout(() => {
            if (sobreContent && sobreContent.parentNode === content) {
                sobreContent.remove();
            }
        }, 300);
    }
}

/**
 * Restaura o estado inicial da interface como ao abrir o site.
 */
function restaurarEstadoInicial() {
    const content = document.querySelector('.conteudo');
    if (content) {
        // Remove todos os elementos filhos, exceto a marca d'água
        Array.from(content.children).forEach(child => {
            if (!child.classList.contains('marcadagua')) {
                child.remove();
            }
        });

        // Recria a marca d'água
        recriarMarcaDagua();
    }
    // Redefine todas as variáveis de estado globais para o estado inicial
    if (typeof window.activeLivro !== 'undefined') window.activeLivro = null;
    if (typeof window.activeCapitulo !== 'undefined') window.activeCapitulo = null;
    if (typeof window.activeVersiculoButton !== 'undefined') window.activeVersiculoButton = null;
    if (typeof window.modoLeituraAtivo !== 'undefined') window.modoLeituraAtivo = false;
    if (typeof window.ultimoLivroSelecionado !== 'undefined') window.ultimoLivroSelecionado = null;
    if (typeof window.ultimoCapituloSelecionado !== 'undefined') window.ultimoCapituloSelecionado = null;
    if (typeof window.ultimoVersiculoSelecionado !== 'undefined') window.ultimoVersiculoSelecionado = null;

    // Recria o título inicial como fallback
    const titulo = document.createElement('h2');
    titulo.id = 'titulo-principal-versao'; // Alinha com a estrutura esperada por versoes.js
    titulo.textContent = 'Bíblia Sagrada'; // Título inicial padrão
    content.appendChild(titulo);

    // Rechama a inicialização da versão atual para restaurar a interface completa
    if (typeof window.inicializarVersao === 'function') {
        const versaoAtual = document.getElementById('seletor-versao-principal')?.value || 'arc';
        window.inicializarVersao(versaoAtual).then(() => {
            // Após a inicialização, carrega o primeiro livro como padrão para recriar botões
            if (typeof window.loadBook === 'function') {
                window.loadBook('genesis'); // Carrega Gênesis como padrão
            } else if (typeof window.atualizaBotoesCapitulos === 'function') {
                window.atualizaBotoesCapitulos('genesis', 1); // Usa atualizaBotoesCapitulos como fallback
            }
        });
    }
}

// === EVENT LISTENERS ===

/**
 * Configura eventos para exibir/ocultar a seção "Sobre"
 */
const sobreLink = document.getElementById('sobre');
if (sobreLink) {
    // Evento de clique no link "Sobre"
    sobreLink.addEventListener('click', (event) => {
        event.preventDefault();
        loadSobre();
    });
} else {
    console.warn("Link 'Sobre' com ID 'sobre' não encontrado.");
}

// Configura eventos para ocultar "Sobre" ao interagir com o menu superior
const topNavItems = document.querySelectorAll('header nav > ul > li');
if (topNavItems.length > 0) {
    topNavItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            hideSobre();
        });
    });
} else {
    console.warn("Itens do menu superior não encontrados para adicionar listener de 'mouseenter'.");
}

// Configura eventos para ocultar "Sobre" ao passar o mouse no menu de livros
const menuLivrosItems = document.querySelectorAll('.menu-livros a'); // Ajuste o seletor conforme a estrutura do menu
if (menuLivrosItems.length > 0) {
    menuLivrosItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            hideSobre();
            // Opcional: carrega o livro ao passar o mouse, se desejar
            // if (typeof window.loadBook === 'function') {
            //     const livro = item.getAttribute('data-livro') || 'genesis'; // Ajuste o atributo
            //     window.loadBook(livro);
            // }
        });
    });
} else {
    console.warn("Itens do menu de livros não encontrados para adicionar listener de 'mouseenter'.");
}

// === MENU MÓVEL ===

/**
 * Configura o botão de menu para dispositivos móveis
 * Toggle da visibilidade do menu de livros
 */
const menuButton = document.querySelector('.menu-button');
if (menuButton) {
    menuButton.addEventListener('click', () => {
        const menuLivros = document.querySelector('.menu-livros');
        if (menuLivros) {
            menuLivros.classList.toggle('show');
        }
    });
}