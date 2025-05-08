// --- Funcionalidade da Seção "SOBRE" ---

// Função para CARREGAR e EXIBIR o conteúdo da seção "Sobre".
function loadSobre() {
    const content = document.querySelector('.content');
    
    // Remove todos os elementos filhos da área principal, exceto a marca d'água
    Array.from(content.children).forEach(child => {
        if (child !== titulo && !child.classList.contains('watermark') && !child.classList.contains('sobre-content')) { // Mantém H2 se existir
            child.remove();
        }
    });

    // Limpa o título principal se ele existir e não for o "Sobre"
    if (titulo && !content.querySelector('.sobre-content h2')) {
        titulo.textContent = ''; 
    }

     // Cria o contêiner para o conteúdo "Sobre" se ele não existir
    let sobreContent = content.querySelector('.sobre-content');
    if (!sobreContent) {
        sobreContent = document.createElement('div');
        sobreContent.classList.add('sobre-content');
        sobreContent.style.position = 'relative'; 
        sobreContent.style.zIndex = '2'; 
        sobreContent.style.opacity = '0'; // Começa invisível para fade-in

        sobreContent.innerHTML = `
            <h2>Sobre o Projeto Bíblia Sagrada</h2>
            <p>Este projeto tem como objetivo oferecer uma ferramenta online completa e acessível para leitura e estudo da Bíblia Sagrada.</p>
            <p>Versão Atual: Almeida Revista e Atualizada (ARA). Outras versões, Harpa Cristã, Hinário Batista, Dicionário Bíblico e Concordância poderão ser adicionadas futuramente.</p>
            <p>Funcionalidades incluem a leitura dos textos, navegação por livros/capítulos/versículos e a opção de visualização em modo "Slide" para apresentações (Datashow).</p>
            <p>Utilize o menu lateral para navegar pelos livros e os botões que aparecem para selecionar capítulos e versículos.</p>
            <p>O projeto está em desenvolvimento contínuo.</p>
        `;
        content.appendChild(sobreContent); 

        // Força reflow para garantir que a transição funcione
        void sobreContent.offsetWidth; 

        // Aplica fade-in
        sobreContent.style.transition = 'opacity 0.5s ease-in';
        sobreContent.style.opacity = '1';
    } else {
         // Se já existe, garante que está visível (caso tenha sido escondido)
         sobreContent.style.transition = 'opacity 0.5s ease-in';
         sobreContent.style.opacity = '1';
    }
    
    // Limpa o estado ativo da navegação da Bíblia
    activeLivro = null;
    activeCapitulo = null;
    activeVersiculoButton = null;
    // Não reseta 'titulo' aqui, pois ele pode ser o H2 dentro do sobreContent
}

// Função para ESCONDER o conteúdo "Sobre" com fade-out.
function hideSobre() {
    const content = document.querySelector('.content');
    const sobreContent = content.querySelector('.sobre-content');
    if (sobreContent) {
        sobreContent.style.transition = 'opacity 0.3s ease-out'; // Transição de fade-out
        sobreContent.style.opacity = '0';
        // Remove o elemento do DOM após a transição
        setTimeout(() => {
            // Verifica novamente se ainda existe e pertence ao mesmo pai antes de remover
            if (sobreContent && sobreContent.parentNode === content) { 
                sobreContent.remove();
            }
        }, 300); // Tempo igual à duração da transição
    }
     // Poderia restaurar o título do livro/capítulo aqui se desejado,
     // mas vamos manter simples por enquanto.
}


// --- Event Listeners ---

// Adiciona evento de clique ao link "SOBRE" (assumindo que ele tem id="sobre")
const sobreLink = document.getElementById('sobre');
if (sobreLink) {
    sobreLink.addEventListener('click', (event) => {
        event.preventDefault(); 
        loadSobre(); // Chama a função para exibir o conteúdo "Sobre"
    });
} else {
    console.warn("Link 'Sobre' com ID 'sobre' não encontrado.");
}

// Adiciona evento para esconder "Sobre" ao passar o mouse no menu superior
// IMPORTANTE: Ajuste o seletor se a estrutura do seu menu for diferente
const topNavItems = document.querySelectorAll('header nav > ul > li'); 
if (topNavItems.length > 0) {
    topNavItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            hideSobre(); // Chama a função para esconder o "Sobre"
        });
    });
} else {
     console.warn("Itens do menu superior ('header nav > ul > li') não encontrados para adicionar listener de 'mouseenter'.");
}


// --- Menu Móvel ---
const menuButton = document.querySelector('.menu-button');
if (menuButton) {
    menuButton.addEventListener('click', () => {
        const menuLivros = document.querySelector('.menu-livros');
        if (menuLivros) {
            menuLivros.classList.toggle('show'); 
        }
    });
} 
// Não é um erro se o botão móvel não existir, pode ser intencional.
// else { console.warn("Botão de menu móvel ('.menu-button') não encontrado."); }


// --- FIM DO SCRIPT ara.js ---

// --- END OF PART 8/8 (REVISED) ---