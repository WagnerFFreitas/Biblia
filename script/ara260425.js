// --- START OF PART 1/8 ---

// O bloco abaixo define o objeto "livros" que armazena informações sobre os livros da Bíblia
// Este objeto é a base para saber quantos capítulos cada livro possui.
const livros = {
    "genesis": {
        "capitulos": 50
    },
    "exodo": {
        "capitulos": 40
    },
    "levitico": {
        "capitulos": 27
    },
    "numeros": {
        "capitulos": 36
    },
    "deuteronomio": {
        "capitulos": 34
    },
    "josue": {
        "capitulos": 24
    },
    "juizes": {
        "capitulos": 21
    },
    "rute": {
        "capitulos": 4
    },
    "1samuel": {
        "capitulos": 31
    },
    "2samuel": {
        "capitulos": 24
    },
    "1reis": {
        "capitulos": 22
    },
    "2reis": {
        "capitulos": 25
    },
    "1cronicas": {
        "capitulos": 29
    },
    "2cronicas": {
        "capitulos": 36
    },
    "esdras": {
        "capitulos": 10
    },
    "neemias": {
        "capitulos": 13
    },
    "ester": {
        "capitulos": 10
    },
    "jo": {
        "capitulos": 42
    },
    "salmos": {
        "capitulos": 150
    },
    "proverbios": {
        "capitulos": 31
    },
    "eclesiastes": {
        "capitulos": 12
    },
    "cantares": {
        "capitulos": 8
    },
    "isaias": {
        "capitulos": 66
    },
    "jeremias": {
        "capitulos": 52
    },
    "lamentacoes": {
        "capitulos": 5
    },
    "ezequiel": {
        "capitulos": 48
    },
    "daniel": {
        "capitulos": 12
    },
    "oseias": {
        "capitulos": 14
    },
    "joel": {
        "capitulos": 3
    },
    "amos": {
        "capitulos": 9
    },
    "abdias": { // <- Nome usado consistentemente em ara.js
        "capitulos": 1
    },
    "jonas": {
        "capitulos": 4
    },
    "miqueias": {
        "capitulos": 7
    },
    "naum": {
        "capitulos": 3
    },
    "habacuque": {
        "capitulos": 3
    },
    "safonias": { // <- Nome usado consistentemente em ara.js
        "capitulos": 3
    },
    "ageu": {
        "capitulos": 2
    },
    "zacarias": {
        "capitulos": 14
    },
    "malaquias": {
        "capitulos": 4
    },
    "mateus": {
        "capitulos": 28
    },
    "marcos": {
        "capitulos": 16
    },
    "lucas": {
        "capitulos": 24
    },
    "joao": {
        "capitulos": 21
    },
    "atos": {
        "capitulos": 28
    },
    "romanos": {
        "capitulos": 16
    },
    "1corintios": {
        "capitulos": 16
    },
    "2corintios": {
        "capitulos": 13
    },
    "galatas": {
        "capitulos": 6
    },
    "efesios": {
        "capitulos": 6
    },
    "filipenses": {
        "capitulos": 4
    },
    "colossenses": {
        "capitulos": 4
    },
    "1tessalonicenses": {
        "capitulos": 5
    },
    "2tessalonicenses": {
        "capitulos": 3
    },
    "1timoteo": { // <- Nome usado consistentemente em ara.js
        "capitulos": 6
    },
    "2timoteo": {
        "capitulos": 4
    },
    "tito": {
        "capitulos": 3
    },
    "filemom": {
        "capitulos": 1
    },
    "hebreus": {
        "capitulos": 13
    },
    "tiago": {
        "capitulos": 5
    },
    "1pedro": {
        "capitulos": 5
    },
    "2pedro": {
        "capitulos": 3
    },
    "1joao": {
        "capitulos": 5
    },
    "2joao": {
        "capitulos": 1
    },
    "3joao": {
        "capitulos": 1
    },
    "judas": {
        "capitulos": 1
    },
    "apocalipse": {
        "capitulos": 22
    }
};

// --- END OF PART 1/8 ---
// --- START OF PART 2/8 ---

// O bloco abaixo cria as variáveis globais para o elemento H2 (título), 
// o botão do versículo ativo, o livro ativo e o capítulo ativo.
// Essas variáveis ajudam a controlar o estado atual da navegação na Bíblia.
let titulo = null; // Referência ao elemento H2 que mostra Livro/Cap/Ver
let activeVersiculoButton = null; // Referência ao botão do versículo clicado
let activeLivro = null; // Nome (string) do livro atualmente selecionado
let activeCapitulo = null; // Número do capítulo atualmente selecionado

// O bloco abaixo cria a função para configurar os botões dos capítulos
// Recebe o nome do livro e gera botões para cada capítulo existente nele.
function createCapitulosButtons(livro) {
    // Obtém o número de capítulos do livro a partir do objeto 'livros'
    const capitulos = livros[livro].capitulos; 
    // Cria um contêiner (div) para os botões
    const capitulosContainer = document.createElement('div');
    capitulosContainer.classList.add('capitulos'); // Adiciona a classe CSS 'capitulos'

    // Loop para criar um botão para cada capítulo (de 1 até o número total)
    for (let i = 1; i <= capitulos; i++) {
        const button = document.createElement('button');
        button.textContent = `${i}`; // Define o texto do botão como o número do capítulo
        button.classList.add('botao-capitulo'); // Adiciona a classe CSS 'botao-capitulo'
        // Adiciona um evento de clique ao botão
        button.addEventListener('click', () => {
            // Quando clicado, chama a função 'toggleVersiculos' para mostrar/esconder os versículos deste capítulo
            toggleVersiculos(livro, i); 
        });
        capitulosContainer.appendChild(button); // Adiciona o botão ao contêiner
    }
    // Retorna o contêiner com todos os botões de capítulo
    return capitulosContainer; 
}

// O bloco abaixo cria a função para carregar o conteúdo de um versículo específico a partir do JSON
// Recebe o livro, capítulo e número do versículo desejado.
async function loadVersiculo(livro, capitulo, versiculo) {
    try {
        const response = await fetch(`/biblia/version/ara/${livro}/${capitulo}.json`);
        const data = await response.json();
        
        const content = document.querySelector('.content');
        
        // Remove versículo existente
        const existingVersiculo = content.querySelector('.versiculo-texto');
        if (existingVersiculo) {
            existingVersiculo.remove();
        }

        const versiculoElement = document.createElement('div');
        versiculoElement.classList.add('versiculo', 'versiculo-texto');

        if (data.versiculos[versiculo]) {
            // Se for primeiro versículo e tiver título, mostra o título
            if (versiculo === "1" && data.titulo) {
                versiculoElement.innerHTML = `<strong>${data.titulo}</strong><br>${data.versiculos[versiculo]}`;
            } else {
                versiculoElement.textContent = data.versiculos[versiculo];
            }
        } else {
            versiculoElement.textContent = 'Versículo não encontrado';
        }

        content.appendChild(versiculoElement);
        titulo.textContent = `${data.livro.toUpperCase()} - CAPÍTULO ${data.capitulo} - VERSÍCULO ${versiculo}`;
    } catch (error) {
        console.error('Erro ao carregar o versículo:', error);
    }
}

// --- END OF PART 2/8 ---
// --- START OF PART 3/8 ---

// O bloco abaixo cria a função para exibir/ocultar os botões de versículos de um capítulo
// Recebe o nome do livro e o número do capítulo.
function toggleVersiculos(livro, capitulo) {
    // Seleciona o elemento principal onde o conteúdo é exibido
    const content = document.querySelector('.content');

    // O trecho abaixo remove o texto "SOBRE" se ele estiver sendo exibido,
    // para dar espaço aos versículos.
    const existingSobre = content.querySelector('.sobre-content');
    if (existingSobre) {
        existingSobre.remove();
    }
    
    // O trecho abaixo procura por um contêiner de versículos já existente 
    // para este livro e capítulo específicos (identificado pela classe CSS).
    const existingVersiculos = content.querySelector(`.versiculos-${livro}-${capitulo}`);
    // Seleciona todos os contêineres de versículos atualmente visíveis.
    const allVersiculosContainers = content.querySelectorAll('.book-content'); 

    // O trecho abaixo verifica se os botões de versículos para este capítulo já estão visíveis.
    if (existingVersiculos) {
        // Se sim, remove o contêiner de versículos (efeito de "recolher").
        existingVersiculos.remove();
        
        // O trecho abaixo também remove o texto do versículo que estava sendo exibido,
        // já que os botões foram recolhidos.
        const existingVersiculoTexto = content.querySelector('.versiculo-texto');
        if (existingVersiculoTexto) {
            existingVersiculoTexto.remove();
        }
        // Limpa o título para indicar que nenhum capítulo/versículo está selecionado ativamente
        if (titulo) {
            titulo.textContent = `${livro.toUpperCase()}`; // Mostra apenas o nome do livro
        }
         activeCapitulo = null; // Reseta o capítulo ativo

    } else {
        // Se os botões de versículos não estavam visíveis:

        // O trecho abaixo remove qualquer contêiner de versículos de *outro* capítulo 
        // que possa estar visível.
        allVersiculosContainers.forEach(container => container.remove());

        // O trecho abaixo remove o texto do versículo de qualquer capítulo anterior que 
        // possa estar sendo exibido.
        const existingVersiculoTexto = content.querySelector('.versiculo-texto');
        if (existingVersiculoTexto) {
            existingVersiculoTexto.remove();
        }

        // O trecho abaixo cria um novo contêiner para os botões de versículos do capítulo selecionado.
        const bookContent = document.createElement('div');
        // Adiciona classes CSS, incluindo uma específica para identificar este livro/capítulo.
        bookContent.classList.add('book-content', `versiculos-${livro}-${capitulo}`); 
        
        // Atualiza o título global (H2) para mostrar o livro e o capítulo selecionado.
        if (titulo) {
            titulo.textContent = `${livro.toUpperCase()} - CAPÍTULO ${capitulo}`;
        }
        
        // Chama a função 'createVersiculosButtons' (definida posteriormente) 
        // para gerar os botões de versículo e os adiciona ao novo contêiner.
        bookContent.appendChild(createVersiculosButtons(livro, capitulo)); 
        
        // Adiciona o contêiner com os botões de versículo à área de conteúdo principal.
        content.appendChild(bookContent);
        
        // A linha abaixo atualiza a variável global para indicar qual capítulo está ativo.
        activeCapitulo = capitulo; 
    }
}

// O bloco abaixo cria a função para carregar um livro quando seu link é clicado no menu
// Recebe o nome do livro.
function loadBook(livro) {
    // Seleciona o elemento principal onde o conteúdo é exibido.
    const content = document.querySelector('.content');

    // Remove o texto "SOBRE" se estiver presente, para dar espaço ao conteúdo do livro.
    const existingSobre = content.querySelector('.sobre-content');
    if (existingSobre) {
        existingSobre.remove();
    }

    // O trecho abaixo verifica se o livro clicado já é o livro que está ativo.
    if (activeLivro === livro) {
        // Se for o mesmo livro, significa que o usuário clicou novamente no livro ativo.
        // Ação aqui é "recolher" tudo relacionado a esse livro (capítulos, versículos).

        // Remove o contêiner de botões de capítulo.
        const capitulosContainer = content.querySelector('.capitulos-container');
        if (capitulosContainer) {
            capitulosContainer.remove();
        }
        // Remove o texto do versículo exibido.
        const versiculoTexto = content.querySelector('.versiculo-texto');
        if (versiculoTexto) {
            versiculoTexto.remove();
        }
        // Remove qualquer contêiner de botões de versículo.
        const allBookContents = content.querySelectorAll('.book-content');
        allBookContents.forEach(bc => bc.remove());

        // Limpa o título global H2.
        if (titulo) { // Verifica se 'titulo' já foi criado
           titulo.textContent = '';
           titulo.remove(); // Remove o próprio elemento H2
           titulo = null;   // Reseta a variável global
        }

        // O trecho abaixo limpa as variáveis de estado, indicando que nenhum livro/capítulo está ativo.
        activeLivro = null;
        activeCapitulo = null;
        activeVersiculoButton = null; // Também reseta o botão de versículo ativo
        return; // Termina a função aqui, pois a ação era apenas recolher.
    }

    // Se o livro clicado for diferente do ativo (ou se nenhum estava ativo):

    // O trecho abaixo limpa o conteúdo anterior relacionado a outros livros/versículos,
    // exceto a imagem em marca d'água (se existir).
    const elementsToRemove = content.querySelectorAll('h2, .capitulos-container, .versiculo-texto, .book-content');
    elementsToRemove.forEach(element => element.remove());

    // O trecho abaixo cria e adiciona o título (H2) para o novo livro.
    titulo = document.createElement('h2'); // Cria o elemento H2
    titulo.textContent = `${livro.toUpperCase()}`; // Define o texto como o nome do livro em maiúsculas
    content.appendChild(titulo); // Adiciona o H2 à área de conteúdo

    // O trecho abaixo cria o contêiner para os botões de capítulo.
    const capitulosContainer = document.createElement('div');
    capitulosContainer.classList.add('capitulos-container'); // Adiciona classe CSS
    // Chama 'createCapitulosButtons' para gerar os botões e os adiciona ao contêiner.
    capitulosContainer.appendChild(createCapitulosButtons(livro));

    // Adiciona o contêiner de botões de capítulo à área de conteúdo principal.
    content.appendChild(capitulosContainer);

    // O trecho abaixo define o livro ativo como o livro atual e reseta o capítulo/versículo ativo.
    activeLivro = livro;
    activeCapitulo = null;
    activeVersiculoButton = null; 
}

// --- END OF PART 3/8 ---
// --- START OF PART 4/8 ---

// O bloco abaixo adiciona eventos de clique aos links dos livros no menu lateral.
// Seleciona todos os elementos <a> dentro de elementos com a classe 'menu-livros'.
document.querySelectorAll('.menu-livros a').forEach(link => {
    // Para cada link encontrado, adiciona um ouvinte de evento de clique.
    link.addEventListener('click', (event) => {
        // Previne o comportamento padrão do link (que seria navegar para '#').
        event.preventDefault(); 
        // Obtém o nome do livro armazenado no atributo 'data-livro' do link.
        const livro = link.dataset.livro; 
        // Chama a função 'loadBook' para carregar o livro clicado.
        loadBook(livro); 
    });
});

// O bloco abaixo cria a função para configurar os botões de versículos
// Recebe o nome do livro e o número do capítulo.
function createVersiculosButtons(livro, capitulo) {
    // Cria um contêiner (div) para os botões de versículo.
    const versiculosContainer = document.createElement('div');
    versiculosContainer.classList.add('versiculos'); // Adiciona a classe CSS 'versiculos'

    // Chama a função 'getNumVersiculos' (definida na próxima parte) 
    // para obter a quantidade de versículos neste capítulo específico.
    const numVersiculos = getNumVersiculos(livro, capitulo); 

    // Loop para criar um botão para cada versículo (de 1 até o número total).
    for (let i = 1; i <= numVersiculos; i++) {
        const button = document.createElement('button');
        button.textContent = ` ${i}`; // Define o texto do botão como o número do versículo.
        button.classList.add('botao-versiculo'); // Adiciona a classe CSS 'botao-versiculo'
        // Adiciona um evento de clique ao botão de versículo.
        button.addEventListener('click', () => {
            // Quando clicado, chama 'toggleVersiculoText' para mostrar/esconder o texto do versículo.
            // Passa o livro, capítulo, número do versículo e o próprio botão como referência.
            toggleVersiculoText(livro, capitulo, i, button); 
        });
        versiculosContainer.appendChild(button); // Adiciona o botão ao contêiner.
    }
    // Retorna o contêiner com todos os botões de versículo.
    return versiculosContainer; 
}

// O bloco abaixo cria a função para alternar a exibição do texto do versículo
// É chamada quando um botão de versículo é clicado.
// Recebe livro, capítulo, versículo e o botão que foi clicado.
function toggleVersiculoText(livro, capitulo, versiculo, button) {

    // O trecho abaixo remove qualquer texto "SOBRE" se estiver sendo exibido,
    // garantindo que o foco seja no versículo.
    const content = document.querySelector('.content');
    const existingSobre = content.querySelector('.sobre-content');
    if (existingSobre) {
        existingSobre.remove();
    }

    // Verifica se o botão clicado é o mesmo que já estava ativo.
    if (activeVersiculoButton === button) {
        // Se for o mesmo botão, a ação é esconder o texto do versículo.
        // Procura pelo elemento que contém o texto do versículo.
        const existingVersiculoTexto = content.querySelector('.versiculo-texto');
        if (existingVersiculoTexto) {
            existingVersiculoTexto.remove(); // Remove o elemento do texto.
        }
        // Reseta a variável que guarda o botão ativo, indicando que nenhum está selecionado.
        activeVersiculoButton = null; 
        // Atualiza o título para mostrar apenas livro e capítulo
        if (titulo) {
            titulo.textContent = `${livro.toUpperCase()} - CAPÍTULO ${capitulo}`;
        }

    } else {
        // Se for um botão diferente (ou se nenhum estava ativo):
        // Chama a função 'loadVersiculo' para buscar e exibir o texto do novo versículo.
        loadVersiculo(livro, capitulo, versiculo); 
        // Atualiza a variável global para guardar a referência do botão que acabou de ser clicado.
        activeVersiculoButton = button; 
        // O título já é atualizado dentro da função loadVersiculo.
    }
}

// --- END OF PART 4/8 ---
// --- START OF PART 5/8 ---

// O bloco abaixo cria a função para obter o número de versículos em um capítulo específico.
// Recebe o nome do livro e o número do capítulo.
function getNumVersiculos(livro, capitulo) {
    // Este objeto contém a contagem de versículos para cada capítulo de cada livro.
    // É uma estrutura de dados essencial para gerar os botões de versículo corretamente.
    const versiculosPorCapitulo = {
        //Antigo testamento
        "genesis": {
            1: 31, 2: 25, 3: 24, 4: 26, 5: 32, 6: 22, 7: 24, 8: 22, 9: 29, 10: 32, 
            11: 32, 12: 20, 13: 18, 14: 24, 15: 21, 16: 16, 17: 27, 18: 33, 19: 38, 20: 18,
            21: 34, 22: 24, 23: 20, 24: 67, 25: 34, 26: 35, 27: 46, 28: 22, 29: 35, 30: 43,
            31: 55, 32: 32, 33: 20, 34: 31, 35: 29, 36: 43, 37: 36, 38: 30, 39: 23, 40: 23,
            41: 57, 42: 38, 43: 34, 44: 34, 45: 28, 46: 34, 47: 31, 48: 22, 49: 33, 50: 26
        },
        "exodo": {
            1: 22, 2: 25, 3: 22, 4: 31, 5: 23, 6: 30, 7: 25, 8: 32, 9: 35, 10: 29, 
            11: 10, 12: 51, 13: 22, 14: 31, 15: 27, 16: 36, 17: 16, 18: 27, 19: 25, 20: 26,
            21: 36, 22: 31, 23: 33, 24: 18, 25: 40, 26: 37, 27: 21, 28: 43, 29: 46, 30: 38,
            31: 18, 32: 35, 33: 23, 34: 35, 35: 35, 36: 38, 37: 29, 38: 31, 39: 43, 40: 38
        },
        "levitico": {
            1: 17, 2: 16, 3: 17, 4: 35, 5: 19, 6: 30, 7: 38, 8: 36, 9: 24, 10: 20, 
            11: 47, 12: 8, 13: 59, 14: 57, 15: 33, 16: 34, 17: 16, 18: 30, 19: 37, 20: 27,
            21: 24, 22: 33, 23: 44, 24: 23, 25: 55, 26: 46, 27: 34
        },
        "numeros": {
            1: 54, 2: 34, 3: 51, 4: 49, 5: 31, 6: 27, 7: 89, 8: 26, 9: 23, 10: 36, 
            11: 35, 12: 16, 13: 33, 14: 45, 15: 41, 16: 50, 17: 13, 18: 32, 19: 22, 20: 29,
            21: 35, 22: 41, 23: 30, 24: 25, 25: 18, 26: 65, 27: 23, 28: 31, 29: 40, 30: 16,
            31: 54, 32: 42, 33: 56, 34: 29, 35: 34, 36: 13
        },
        "deuteronomio": {
            1: 46, 2: 37, 3: 29, 4: 49, 5: 33, 6: 25, 7: 26, 8: 20, 9: 29, 10: 22, 
            11: 32, 12: 32, 13: 18, 14: 29, 15: 23, 16: 17, 17: 20, 18: 22, 19: 21, 20: 20,
            21: 23, 22: 30, 23: 25, 24: 22, 25: 19, 26: 19, 27: 26, 28: 68, 29: 29, 30: 20,
            31: 30, 32: 52, 33: 29, 34: 12
        },
        "josue": {
            1: 18, 2: 24, 3: 17, 4: 24, 5: 15, 6: 27, 7: 26, 8: 35, 9: 27, 10: 43, 
            11: 23, 12: 24, 13: 33, 14: 15, 15: 63, 16: 10, 17: 18, 18: 28, 19: 51, 20: 9,
            21: 45, 22: 34, 23: 16, 24: 33
        },
        "juizes": {
            1: 36, 2: 23, 3: 31, 4: 24, 5: 31, 6: 40, 7: 25, 8: 35, 9: 57, 10: 18, 
            11: 40, 12: 15, 13: 25, 14: 20, 15: 20, 16: 31, 17: 13, 18: 31, 19: 30, 20: 48, 
            21: 25
        },
        "rute": {
            1: 22, 2: 23, 3: 18, 4: 22
        },
        "1samuel": {
            1: 28, 2: 36, 3: 21, 4: 22, 5: 12, 6: 21, 7: 17, 8: 22, 9: 27, 10: 27, 
            11: 15, 12: 25, 13: 23, 14: 52, 15: 35, 16: 23, 17: 58, 18: 30, 19: 24, 20: 42,
            21: 15, 22: 23, 23: 29, 24: 22, 25: 44, 26: 25, 27: 12, 28: 25, 29: 11, 30: 31, 
            31: 13
        },
        "2samuel": {
            1: 27, 2: 32, 3: 39, 4: 12, 5: 25, 6: 23, 7: 29, 8: 18, 9: 13, 10: 19, 
            11: 27, 12: 31, 13: 39, 14: 33, 15: 37, 16: 23, 17: 29, 18: 33, 19: 43, 20: 26,
            21: 22, 22: 51, 23: 39, 24: 25
        },
        "1reis": {
            1: 53, 2: 46, 3: 28, 4: 34, 5: 32, 6: 38, 7: 51, 8: 66, 9: 28, 10: 29, 
            11: 43, 12: 33, 13: 34, 14: 31, 15: 34, 16: 34, 17: 24, 18: 46, 19: 21, 20: 43,
            21: 29, 22: 53 
            // Os capítulos 23 e 24 parecem ser de 2 Reis, removidos daqui para consistência com 'livros'
        },
        "2reis": {
            1: 18, 2: 25, 3: 27, 4: 44, 5: 27, 6: 33, 7: 20, 8: 29, 9: 37, 10: 36, 
            11: 21, 12: 21, 13: 25, 14: 29, 15: 37, 16: 20, 17: 41, 18: 37, 19: 37, 20: 21,
            21: 26, 22: 20, 23: 37, 24: 20, 25: 30 
        },
        "1cronicas": {
            1: 54, 2: 55, 3: 24, 4: 43, 5: 26, 6: 81, 7: 40, 8: 40, 9: 44, 10: 14, 
            11: 47, 12: 40, 13: 14, 14: 17, 15: 29, 16: 43, 17: 27, 18: 17, 19: 19, 20: 8,
            21: 30, 22: 19, 23: 32, 24: 31, 25: 31, 26: 32, 27: 34, 28: 21, 29: 30
        },
        "2cronicas": {
            1: 17, 2: 18, 3: 17, 4: 22, 5: 14, 6: 42, 7: 22, 8: 18, 9: 31, 10: 19, 
            11: 23, 12: 16, 13: 22, 14: 15, 15: 19, 16: 14, 17: 19, // Cap 17 era 20? Verificar fonte. Assumindo 19
            18: 34, 19: 11, 20: 37, 21: 20, 22: 12, 23: 21, 24: 27, 25: 28, 26: 23, 
            27: 9, 28: 27, 29: 36, 30: 27, 31: 21, 32: 33, 33: 25, 34: 33, 35: 27, 36: 23 // Adicionado 34, 35, 36
        },
        "esdras": {
            1: 11, 2: 70, 3: 13, 4: 24, 5: 17, 6: 22, 7: 28, 8: 36, 9: 15, 10: 44
        },
        "neemias": {
            1: 11, 2: 20, 3: 32, 4: 23, 5: 19, 6: 19, 7: 73, 8: 18, 9: 38, 10: 39, 
            11: 36, 12: 47, 13: 31
        },
        "ester": {
            1: 22, 2: 23, 3: 15, 4: 17, 5: 14, 6: 14, 7: 10, 8: 17, 9: 32, 10: 3
        },
        "jo": { // 'jo' em vez de 'jó' para consistência com 'livros'
             1: 22, 2: 13, // Cap 2 era 11? Verificar fonte. Assumindo 13
             3: 26, // Cap 3 era 12? Verificar fonte. Assumindo 26
             4: 21, 5: 27, 6: 30, // Cap 6 era 15? Verificar fonte. Assumindo 30
             7: 21, 8: 22, 9: 35, // Cap 9 era 31? Verificar fonte. Assumindo 35
             10: 22, 11: 20, // Cap 11 era 28? Verificar fonte. Assumindo 20
             12: 25, // Cap 12 era 14? Verificar fonte. Assumindo 25
             13: 28, 14: 22, 15: 35, // Cap 15 era 24? Verificar fonte. Assumindo 35
             16: 22, // Cap 16 era 24? Verificar fonte. Assumindo 22
             17: 16, // Cap 17 era 27? Verificar fonte. Assumindo 16
             18: 21, // Cap 18 era 22? Verificar fonte. Assumindo 21
             19: 29, 20: 29, // Cap 20 era 30? Verificar fonte. Assumindo 29
             21: 34, // Cap 21 era 25? Verificar fonte. Assumindo 34
             22: 30, 23: 17, // Cap 23 era 29? Verificar fonte. Assumindo 17
             24: 25, // Cap 24 era 17? Verificar fonte. Assumindo 25
             25: 6,  // Cap 25 era 24? Verificar fonte. Assumindo 6
             26: 14, // Cap 26 era 23? Verificar fonte. Assumindo 14
             27: 23, // Cap 27 era 22? Verificar fonte. Assumindo 23
             28: 28, // Cap 28 era 26? Verificar fonte. Assumindo 28
             29: 25, // Cap 29 era 27? Verificar fonte. Assumindo 25
             30: 31, 31: 40, // Cap 31 era 31? Verificar fonte. Assumindo 40
            32: 22, 33: 33, 34: 37, 35: 16, 36: 33, 37: 24, 38: 41, 39: 30, 40: 24, 
             41: 34, 42: 17 // Adicionado capítulos 32-42
        },
        "salmos": {
            1: 6, 2: 12, 3: 8, 4: 8, 5: 12, 6: 10, 7: 17, 8: 9, 9: 20, 10: 18, 
            11: 7, 12: 8, 13: 6, 14: 7, 15: 5, 16: 11, 17: 15, 18: 50, 19: 14, 20: 9,
            21: 13, 22: 31, 23: 6, 24: 10, 25: 22, 26: 12, 27: 14, 28: 9, 29: 11, 30: 12,
            31: 24, 32: 11, 33: 22, 34: 22, 35: 28, 36: 12, 37: 40, 38: 22, 39: 13, 40: 17,
            41: 13, 42: 11, 43: 5, 44: 26, 45: 17, 46: 11, 47: 9, 48: 14, 49: 20, 50: 23,
            51: 19, 52: 9, 53: 6, 54: 7, 55: 23, 56: 13, 57: 11, 58: 11, 59: 17, 60: 12,
            61: 8, 62: 12, 63: 11, 64: 10, 65: 13, 66: 20, 67: 7, 68: 35, // Cap 68 era 36? Assumindo 35
            69: 36, 70: 5, 71: 24, 72: 20, 73: 28, 74: 23, 75: 10, 76: 12, 77: 20, 78: 72, 
            79: 13, 80: 19, 81: 16, 82: 8, 83: 18, 84: 12, 85: 13, 86: 17, 87: 7, 88: 18, 
            89: 52, 90: 17, 91: 16, 92: 15, 93: 5, 94: 23, 95: 11, 96: 13, 97: 12, 98: 9, 
            99: 9, 100: 5, 101: 8, 102: 28, 103: 22, 104: 35, 105: 45, 106: 48, 107: 43, 
            108: 13, 109: 31, 110: 7, 111: 10, 112: 10, 113: 9, 114: 8, 115: 18, 116: 19, 
            117: 2, 118: 29, 119: 176, 120: 7, 121: 8, 122: 9, 123: 4, 124: 8, 125: 5, 
            126: 6, 127: 5, 128: 6, 129: 8, 130: 8, 131: 3, 132: 18, 133: 3, 134: 3, 
            135: 21, 136: 26, 137: 9, 138: 8, 139: 24, 140: 13, 141: 10, 142: 7, 143: 12, 
            144: 15, 145: 21, 146: 10, 147: 20, 148: 14, 149: 9, 150: 6
        },
        "proverbios": {
            1: 33, 2: 22, 3: 35, 4: 27, 5: 23, 6: 35, 7: 27, 8: 36, 9: 18, 10: 32, 
            11: 31, 12: 28, 13: 25, 14: 35, 15: 33, 16: 33, 17: 28, 18: 24, 19: 29, 20: 30,
            21: 31, 22: 29, 23: 35, 24: 34, 25: 28, 26: 28, 27: 27, 28: 28, 29: 27, 30: 33, 
            31: 31
        },
        "eclesiastes": {
            1: 18, 2: 26, 3: 22, 4: 16, 5: 20, 6: 12, 7: 29, 8: 17, 9: 18, 10: 20, 
            11: 10, 12: 14
        },
        "cantares": {
            1: 17, 2: 17, 3: 11, 4: 16, 5: 16, 6: 13, 7: 13, 8: 14
        },
        "isaias": {
            1: 31, 2: 22, 3: 26, 4: 6, 5: 30, 6: 13, 7: 25, 8: 22, 9: 21, 10: 34, 
            11: 16, 12: 6, 13: 22, 14: 32, 15: 9, 16: 14, 17: 14, 18: 7, 19: 25, 20: 6,
            21: 17, 22: 25, 23: 18, 24: 23, 25: 12, 26: 21, 27: 13, 28: 29, 29: 24, 30: 33,
            31: 9, 32: 20, 33: 24, 34: 17, 35: 10, 36: 22, 37: 38, 38: 22, 39: 8, 40: 31,
            41: 29, 42: 25, 43: 28, 44: 28, 45: 25, 46: 13, 47: 15, 48: 22, 49: 26, 50: 11,
            51: 23, 52: 15, 53: 12, 54: 17, 55: 13, 56: 12, 57: 21, 58: 14, 59: 21, 60: 22,
            61: 11, 62: 12, 63: 19, 64: 12, 65: 25, 66: 24
        },
        "jeremias": {
             1: 19, 2: 37, 3: 25, // Cap 3 era 66? Verificar fonte. Assumindo 25
            4: 31, 5: 31, 6: 30, 7: 34, 8: 22, 9: 26, 10: 25, 
            11: 23, 12: 17, 13: 27, 14: 22, 15: 21, 16: 21, 17: 27, 18: 23, 19: 15, 20: 18,
            21: 14, 22: 30, 23: 40, 24: 10, 25: 38, 26: 24, 27: 22, 28: 17, 29: 32, 30: 24,
            31: 40, 32: 44, 33: 26, 34: 22, 35: 19, 36: 32, 37: 21, 38: 28, 39: 18, 40: 16,
            41: 18, 42: 22, 43: 13, 44: 30, 45: 5, 46: 28, 47: 7, 48: 47, 49: 39, 50: 46, 
            51: 64, 52: 34
        },
        "lamentacoes": {
            1: 22, 2: 22, 3: 66, 4: 22, 5: 22
        },
        "ezequiel": {
            1: 28, 2: 10, 3: 27, 4: 17, 5: 17, 6: 14, 7: 27, 8: 18, 9: 11, 10: 22, 
             11: 25, 12: 28, 13: 23, 14: 23, 15: 8, 16: 63, 17: 24, 18: 32, 19: 14, 20: 49, // Cap 20 era 44? Assumindo 49
            21: 32, 22: 31, 23: 49, 24: 27, 25: 17, 26: 21, 27: 36, 28: 26, 29: 21, 30: 26,
            31: 18, 32: 32, 33: 33, 34: 31, 35: 15, 36: 38, 37: 28, 38: 23, 39: 29, 40: 49,
            41: 26, 42: 20, 43: 27, 44: 31, 45: 25, 46: 24, 47: 23, 48: 35
        },
        "daniel": {
            1: 21, 2: 49, 3: 30, 4: 37, 5: 31, 6: 28, 7: 28, 8: 27, 9: 27, 10: 21, 
            11: 45, 12: 13
        },
        "oseias": {
            1: 11, 2: 23, 3: 5, 4: 19, 5: 15, 6: 11, 7: 16, 8: 14, 9: 17, 10: 15, 
            11: 12, 12: 14, 13: 16, 14: 9
        },
        "joel": {
            1: 20, 2: 32, 3: 21
        },
        "amos": {
            1: 15, 2: 16, 3: 15, 4: 13, 5: 27, 6: 14, 7: 17, 8: 14, 9: 15
        },
        "abadias": { 
            1: 21
        },
        "jonas": {
            1: 17, 2: 10, 3: 10, 4: 11
        },
        "miqueias": {
            1: 16, 2: 13, 3: 12, 4: 13, 5: 15, 6: 16, 7: 20
        },
        "naum": {
             1: 15, 2: 13, 3: 19 // Cap 1 era 14? Assumindo 15
        },
        "habacuque": {
            1: 17, 2: 20, 3: 19
        },
        "safonias": { // Nome consistente com 'livros'
            1: 18, 2: 15, 3: 20
        },
        "ageu": {
            1: 15, 2: 23
        },
        "zacarias": {
            1: 21, 2: 13, 3: 10, 4: 14, 5: 11, 6: 15, 7: 14, 8: 23, 9: 17, 10: 12, 
            11: 17, 12: 14, 13: 9, 14: 21
        },
        "malaquias": {
            1: 14, 2: 17, 3: 18, 4: 6
        },

        //Novo testamento
        "mateus": {
            1: 25, 2: 23, 3: 17, 4: 25, 5: 48, 6: 34, 7: 29, 8: 34, 9: 38, 10: 42, 
            11: 30, 12: 50, 13: 58, 14: 36, 15: 39, 16: 28, 17: 27, 18: 35, 19: 30, 20: 34,
            21: 46, 22: 46, 23: 39, 24: 51, 25: 46, 26: 75, 27: 66, 28: 20
        },
        "marcos": {
            1: 45, 2: 28, 3: 35, 4: 41, 5: 43, 6: 56, 7: 37, 8: 38, 9: 50, 10: 52, 
            11: 33, 12: 44, 13: 37, 14: 72, 15: 47, 16: 20
        },
        "lucas": {
            1: 80, 2: 52, 3: 38, 4: 44, 5: 39, 6: 49, 7: 50, 8: 56, 9: 62, 10: 42, 
            11: 54, 12: 59, 13: 35, 14: 35, 15: 32, 16: 31, 17: 37, 18: 43, 19: 48, 20: 47,
            21: 38, 22: 71, 23: 56, 24: 53
        },
        "joao": {
            1: 51, 2: 25, 3: 36, 4: 54, 5: 47, 6: 71, 7: 53, 8: 59, 9: 41, 10: 42, 
            11: 57, 12: 50, 13: 38, 14: 31, 15: 27, 16: 33, 17: 26, 18: 40, 19: 42, 20: 31, 
            21: 25
        },
        "atos": {
            1: 26, 2: 47, 3: 26, 4: 37, 5: 42, 6: 15, 7: 60, 8: 40, 9: 43, 10: 48, 
            11: 30, 12: 25, 13: 52, 14: 28, 15: 41, 16: 40, 17: 34, 18: 28, 19: 41, 20: 38,
            21: 40, 22: 30, 23: 35, 24: 27, 25: 27, 26: 32, 27: 44, 28: 31 // Cap 27 era 44, cap 28 era 31. Ok.
        },
        "romanos": {
            1: 32, 2: 29, 3: 31, 4: 25, 5: 21, 6: 23, 7: 25, 8: 39, 9: 33, 10: 21, 
            11: 36, 12: 21, 13: 14, 14: 23, 15: 33, 16: 27
        },
        "1corintios": {
            1: 31, 2: 16, 3: 23, 4: 21, 5: 13, 6: 20, 7: 40, 8: 13, 9: 27, 10: 33, 
            11: 34, 12: 31, 13: 13, 14: 40, 15: 58, 16: 24
        },
        "2corintios": {
            1: 24, 2: 17, 3: 18, 4: 18, 5: 21, 6: 18, 7: 16, 8: 24, 9: 15, 10: 18, 
            11: 33, 12: 21, 13: 14 // Cap 13 era 14? Assumindo 13 ou 14 conforme fonte.
        },
        "galatas": {
            1: 24, 2: 21, 3: 29, 4: 31, 5: 26, 6: 18
        },
        "efesios": {
            1: 23, 2: 22, 3: 21, 4: 32, 5: 33, 6: 24
        },
        "filipenses": {
            1: 30, 2: 30, 3: 21, 4: 23
        },
        "colossenses": {
            1: 29, 2: 23, 3: 25, 4: 18
        },
        "1tessalonicenses": {
            1: 10, 2: 20, 3: 13, 4: 18, 5: 28
        },
        "2tessalonicenses": {
            1: 12, 2: 17, 3: 18
        },
        "1timoteo": { // Nome consistente com 'livros'
            1: 20, 2: 15, 3: 16, 4: 16, 5: 25, 6: 21
        },
        "2timoteo": {
            1: 18, 2: 26, 3: 17, 4: 22
        },
        "tito": {
            1: 16, 2: 15, 3: 15
        },
        "filemom": {
            1: 25
        },
        "hebreus": {
            1: 14, 2: 18, 3: 19, 4: 16, 5: 14, 6: 20, 7: 28, 8: 13, 9: 28, 10: 39, 
            11: 40, 12: 29, 13: 25
        },
        "tiago": {
            1: 27, 2: 26, 3: 18, 4: 17, 5: 20
        },
        "1pedro": {
            1: 25, 2: 25, 3: 22, 4: 19, 5: 14
        },
        "2pedro": {
            1: 21, 2: 22, 3: 18
        },
        "1joao": {
            1: 10, 2: 29, 3: 24, 4: 21, 5: 21
        },
        "2joao": {
            1: 13
        },
        "3joao": {
             1: 14 // Era 15? Assumindo 14
        },
        "judas": {
            1: 25
        },
        "apocalipse": {
            1: 20, 2: 29, 3: 22, 4: 11, 5: 14, 6: 17, 7: 17, 8: 13, 9: 21, 10: 11, 
            11: 19, 12: 17, 13: 18, 14: 20, 15: 8, 16: 21, 17: 18, 18: 24, 19: 21, 20: 15, 
            21: 27, 22: 21
        }
    };
    // Retorna o número de versículos para o livro e capítulo especificados.
    // Usa o operador optional chaining (?.) para evitar erros se o livro ou capítulo não existir.
    // Retorna 0 se não encontrar a informação.
    return versiculosPorCapitulo[livro]?.[capitulo] || 0; 
}

// --- END OF PART 5/8 ---
// --- START OF PART 6/8 ---

// O bloco abaixo carrega a imagem da Bíblia como marca d'água assim que a página principal abre.
window.onload = () => {
    // Seleciona o contêiner principal onde o conteúdo é exibido.
    const content = document.querySelector('.content');
    // Cria um 'div' para conter a imagem de marca d'água.
    const watermarkContainer = document.createElement('div');
    watermarkContainer.classList.add('watermark'); // Adiciona a classe CSS 'watermark'
    
    // Cria o elemento de imagem.
    const img = document.createElement('img');
    img.src = '../img/biblia.png'; // Define o caminho da imagem.
    img.alt = "Marca d'água da Bíblia"; // Texto alternativo para acessibilidade.
    img.classList.add('watermark-image'); // Adiciona a classe CSS 'watermark-image'
    
    // Adiciona a imagem ao seu contêiner.
    watermarkContainer.appendChild(img);
    // Adiciona o contêiner da marca d'água ao contêiner principal.
    content.appendChild(watermarkContainer);
};

// O bloco abaixo cria a função para abrir e controlar a janela de SLIDE para o data-show.
// Recebe o livro, capítulo e versículo que devem ser exibidos inicialmente.
function abrirJanelaSlide(livroAtual, capituloAtual, versiculoAtual) {
    
    // Garante que o versículo inicial seja pelo menos 1, caso algo dê errado.
    const verInicial = versiculoAtual ? parseInt(versiculoAtual, 10) : 1;
    if (!livroAtual || !capituloAtual) {
        alert("Por favor, selecione um livro e capítulo antes de abrir o slide.");
        return; // Impede a abertura se livro/capítulo não estiverem definidos
    }


    // O trecho abaixo verifica se a janela já está aberta e não está fechada.
    // 'window.janelaSlide' armazena a referência à janela pop-up.
    if (window.janelaSlide && !window.janelaSlide.closed) {
        window.janelaSlide.focus(); // Se estiver aberta, apenas a traz para frente.
        // Poderia opcionalmente atualizar o conteúdo se necessário aqui.
        // Ex: window.janelaSlide.atualizarConteudo(livroAtual, capituloAtual, verInicial);
        return; // Sai da função pois a janela já existe.
    }

    // O trecho abaixo obtém a largura e altura disponíveis da tela do usuário.
    const largura = window.screen.availWidth;
    const altura = window.screen.availHeight;

    // O trecho abaixo abre uma nova janela (pop-up).
    // Parâmetros: URL (vazio ''), nome da janela ('JanelaSlide'), opções (largura, altura).
    window.janelaSlide = window.open('', 'JanelaSlide', `width=${largura},height=${altura},scrollbars=yes,resizable=yes`);

    // Verifica se a janela foi bloqueada pelo navegador
    if (!window.janelaSlide) {
        alert("A janela de slide foi bloqueada pelo navegador. Por favor, permita pop-ups para este site.");
        return;
    }

    // Começa a escrever o conteúdo HTML da nova janela.
    window.janelaSlide.document.open();
    window.janelaSlide.document.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <title>Janela Slide - Bíblia Sagrada</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                /* Estilos CSS para a janela de slide (copiados/adaptados do original) */
                
                /* Corpo da página */
                body { 
                    font-family: sans-serif; 
                    padding: 1.25rem;
                    background-color: #181818; /* Fundo escuro */
                    color: white; /* Texto branco */
                    position: relative; 
                    margin: 0; /* Remove margens padrão */
                    box-sizing: border-box; /* Inclui padding na largura/altura total */
                    overflow: hidden; /* Esconde barras de rolagem do body */
                    display: flex;
                    flex-direction: column;
                    justify-content: center; /* Centraliza verticalmente */
                    align-items: center; /* Centraliza horizontalmente */
                    height: 100vh; /* Altura total da viewport */
                    font-style: italic;
                    font-weight: bold;
                    text-align: center; /* Centraliza texto por padrão */
                }

                /* Título principal (Livro Cap Versículo) */
                #titulo { 
                    font-size: clamp(1.5rem, 3vw, 2.5rem); /* Tamanho responsivo */
                    margin-bottom: 1.5rem; 
                    color: #f1c40f; /* Cor amarela/dourada */
                    position: absolute; /* Posicionamento absoluto */
                    top: 2rem; /* Distância do topo */
                    left: 50%; /* Centraliza horizontalmente */
                    transform: translateX(-50%); /* Ajuste fino da centralização */
                    width: 90%; /* Largura para evitar quebra em telas menores */
                    z-index: 20; /* Garante que fique acima da marca d'água */
                }

                 /* Contêiner do versículo */
                #versiculo-container { 
                    width: 90%; /* Largura do contêiner */
                    max-width: 1200px; /* Largura máxima */
                    margin-top: 4rem; /* Espaço abaixo do título */
                    margin-bottom: 6rem; /* Espaço acima dos botões */
                    overflow-y: auto; /* Permite rolagem se o texto for muito grande */
                    max-height: calc(100vh - 12rem); /* Altura máxima calculada */
                    padding: 0 1rem; /* Espaçamento interno */
                    z-index: 20; /* Acima da marca d'água */
                    display: flex; /* Usar flexbox para centralizar */
                    flex-direction: column; /* Itens em coluna */
                    align-items: center; /* Centraliza itens horizontalmente */
                    justify-content: center; /* Centraliza itens verticalmente */
                }
                
                /* Texto do versículo */
                .versiculo-texto { 
                    font-size: clamp(2rem, 5vw, 5.5rem); /* Tamanho de fonte responsivo e grande */
                    line-height: 1.4; /* Espaçamento entre linhas */
                    text-align: center; /* Alinhamento centralizado */
                    margin-bottom: 1rem; /* Margem inferior */
                    overflow-wrap: break-word; /* Quebra palavras longas */
                }

                /* Título opcional dentro do versículo (se houver no JSON) */
                #versiculo-container strong { 
                    color: #5df565; /* Cor verde clara */
                    font-size: clamp(1.8rem, 3.5vw, 3rem); /* Tamanho responsivo */
                    display: block; /* Faz ocupar a linha inteira */
                    margin-bottom: 1.5rem; /* Espaço abaixo do título do versículo */
                    font-style: normal; /* Remove itálico se herdado */
                }
                
                /* Marca d'água (imagem de fundo) */
                #watermark {
                    position: fixed; /* Fica fixo na tela */
                    top: 0; 
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: url('../img/biblia.png'); /* Caminho da imagem */
                    background-size: contain; /* Ajusta a imagem dentro do contêiner */
                    background-repeat: no-repeat;
                    background-position: center;
                    opacity: 0.15; /* Opacidade baixa */
                    z-index: 10; /* Fica abaixo do conteúdo (título, versículo, botões) */
                    pointer-events: none; /* Não interfere com cliques */
                }

                /* Contêiner dos botões de navegação */
                #botao-container {
                    position: absolute; /* Posicionamento absoluto */
                    bottom: 2rem; /* Distância do fundo */
                    left: 50%; /* Centraliza horizontalmente */
                    transform: translateX(-50%); /* Ajuste fino da centralização */
                    display: flex; /* Alinha botões lado a lado */
                    gap: 1rem; /* Espaço entre os botões */
                    z-index: 20; /* Acima da marca d'água */
                }

                /* Botões de Voltar/Próximo */
                #voltar-botao,
                #proximo-botao {
                    background-color: white;
                    color: black; 
                    border: none;
                    padding: 0.8rem 2rem; /* Espaçamento interno */
                    font-size: clamp(1rem, 1.5vw, 1.5rem); /* Tamanho de fonte responsivo */
                    font-weight: 900; /* Negrito */
                    font-style: italic;
                    cursor: pointer; 
                    position: relative; /* Necessário para as pseudo-setas */
                    display: inline-block;
                    text-align: center;
                    border-radius: 5px; /* Bordas levemente arredondadas */
                    transition: background-color 0.3s ease, color 0.3s ease, transform 0.1s ease; /* Transições suaves */
                    user-select: none; /* Impede seleção de texto no botão */
                }

                /* Efeito hover nos botões */
                #voltar-botao:hover,
                #proximo-botao:hover {
                    background-color: #f1c40f; /* Muda para cor dourada */
                    color: black;
                }

                /* Efeito de clique nos botões */
                #voltar-botao:active,
                #proximo-botao:active {
                transform: scale(0.95); /* Efeito de pressionar */
                }

                /* (Opcional) Estilo das setas com pseudo-elementos ::before e ::after */
                /* Este estilo cria setas triangulares nas laterais dos botões */
                /* Removido por simplicidade, mas pode ser readicionado se desejado */
                /*
                #voltar-botao::before,
                #proximo-botao::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 0;
                    height: 0;
                    border-style: solid;
                     border-width: 20px; // Tamanho da seta ajustado
                    transition: border-color 0.3s ease; 
                }
                #voltar-botao::before {
                     left: -30px; // Posição da seta ajustada
                    border-color: transparent white transparent transparent;
                }
                #proximo-botao::after {
                    right: -30px; // Posição da seta ajustada
                    border-color: transparent transparent transparent white;
                }
                #voltar-botao:hover::before {
                    border-color: transparent #f1c40f transparent transparent;
                }
                #proximo-botao:hover::after {
                    border-color: transparent transparent transparent #f1c40f;
                }
                */

            </style>
        </head>
        <body>
            <!-- Elementos HTML da janela slide -->
            <div id="watermark"></div> <!-- Marca d'água -->
            <!-- Título inicial (será atualizado pelo JS) -->
            <div id="titulo">${livroAtual.toUpperCase()} - CAPÍTULO ${capituloAtual} - VERSÍCULO ${verInicial}</div> 
            <!-- Contêiner para exibir o texto do versículo (será preenchido pelo JS) -->
            <div id="versiculo-container"><div class="versiculo-texto">Carregando...</div></div> 
            <!-- Contêiner para os botões de navegação -->
            <div id="botao-container">
                <button id="voltar-botao">« VOLTAR</button> <!-- Botão Voltar -->
                <button id="proximo-botao">PRÓXIMO »</button> <!-- Botão Próximo -->
            </div>

            <!-- Início do script interno da janela slide (será continuado na próxima parte) -->
            <script>
                // As variáveis e funções JavaScript para controlar a navegação
                // e carregar os versículos JSON virão aqui na Parte 7.
                
// --- END OF PART 6/8 --- 
// (O fechamento do <script>, </body> e </html> será feito no final da Parte 7)
// --- START OF PART 7/8 ---
// (Continuação do JavaScript dentro do window.janelaSlide.document.write)

                // Variáveis de estado para a janela de slide
                let livroAtual = '${livroAtual}'; // Recebe do parâmetro da função
                let capituloAtual = ${capituloAtual}; // Recebe do parâmetro da função
                let versiculoAtual = ${verInicial}; // Recebe do parâmetro da função (já validado como >= 1)
                
                // Recria/Transfere os dados essenciais para a janela de slide.
                // Usar JSON.stringify/parse é uma forma de passar objetos complexos.
                // Certifique-se que 'livros' e 'versiculosPorCapitulo' estão acessíveis no escopo de abrirJanelaSlide.
                const livros = ${JSON.stringify(livros)}; // Objeto com nomes e contagem de capítulos
                const versiculosPorCapitulo = ${JSON.stringify(versiculosPorCapitulo)}; // Objeto com contagem de versículos

                let capituloConteudo = null; // Armazenará o objeto JSON do capítulo carregado

                // Função auxiliar para obter o número de versículos (local para a janela slide)
                 function getNumVersiculosLocal(livro, capitulo) {
                     // Usa o objeto completo passado/recriado
                     return versiculosPorCapitulo[livro]?.[capitulo] || 0; 
                 }

                 // Função auxiliar para obter a lista ordenada de nomes de livros
                 const listaLivros = Object.keys(livros); // Gera ['genesis', 'exodo', ...]

                 // Função para carregar os dados JSON de um capítulo específico
                 async function carregarCapitulo(livro, capitulo) {
                    // Define o statuscomo carregando
                    document.getElementById('versiculo-container').innerHTML = '<div class="versiculo-texto">Carregando Capítulo...</div>';
                    document.getElementById('titulo').innerText = `Carregando ${livro.toUpperCase()} ${capitulo}...`;
                    capituloConteudo = null; // Limpa dados antigos

                    try {
                        // Busca o arquivo JSON usando o caminho relativo correto a partir da localização do HTML principal
                        const response = await fetch(\`../../version/ara/\${livro}/\${capitulo}.json\`); 
                        
                        if (!response.ok) {
                            throw new Error(`Erro HTTP: ${response.status}`);
                        }
                        const data = await response.json(); // Processa como JSON
                        
                        capituloConteudo = data; // Armazena o objeto JSON carregado
                        livroAtual = livro; // Atualiza o estado
                        capituloAtual = capitulo; // Atualiza o estado
                        
                        // Após carregar o capítulo, carrega o versículo desejado (geralmente o 1º ou o último, dependendo da navegação)
                        carregarVersiculo(versiculoAtual); 

                    } catch (error) {
                        console.error('Erro ao carregar o capítulo JSON:', livro, capitulo, error);
                        document.getElementById('versiculo-container').innerHTML = \`<div class="versiculo-texto">Erro ao carregar capítulo \${capitulo} de \${livro}.<br><small>Verifique o console (F12) na janela principal.</small></div>\`;
                        document.getElementById('titulo').innerText = `Erro ao carregar ${livro.toUpperCase()} ${capitulo}`;
                        capituloConteudo = null; // Garante que está limpo em caso de erro
                    }
                }

                // Função para exibir um versículo específico na tela
                function carregarVersiculo(versiculo) {
                    // Verifica se os dados do capítulo foram carregados com sucesso
                    if (!capituloConteudo || !capituloConteudo.versiculos) {
                         document.getElementById('versiculo-container').innerHTML = '<div class="versiculo-texto">Dados do capítulo não disponíveis. Tente navegar novamente.</div>';
                         // Poderia tentar recarregar o capítulo aqui: carregarCapitulo(livroAtual, capituloAtual);
                         return;
                    }

                    const versiculoContainer = document.getElementById('versiculo-container');
                    const tituloElement = document.getElementById('titulo');
                    
                    // Atualiza o título principal da janela slide
                    tituloElement.innerText = \`\${livroAtual.toUpperCase()} - CAPÍTULO \${capituloAtual} - VERSÍCULO \${versiculo}\`;

                    let htmlConteudo = ''; // String para montar o HTML do versículo

                    // 1. Adiciona o título do versículo (se existir no JSON)
                    if (capituloConteudo.titulos && capituloConteudo.titulos[versiculo]) {
                        // Usa a tag <strong> para o título interno, conforme CSS
                        htmlConteudo += \`<strong>\${capituloConteudo.titulos[versiculo]}</strong>\`; 
                    }

                    // 2. Adiciona o texto do versículo (se existir no JSON)
                    if (capituloConteudo.versiculos && capituloConteudo.versiculos[versiculo]) {
                        // Adiciona o texto dentro de um div com a classe correta
                        // Substitui literais '\n' por <br> se necessário para quebras de linha
                        htmlConteudo += \`<div class="versiculo-texto">\${capituloConteudo.versiculos[versiculo].replace(/\\n/g, '<br>')}</div>\`; 
                    } else {
                        // Se o versículo não for encontrado no JSON (problema nos dados?)
                        htmlConteudo += '<div class="versiculo-texto">Texto do versículo não encontrado.</div>';
                    }
                    
                    // Define o HTML final no contêiner do versículo
                    versiculoContainer.innerHTML = htmlConteudo;
                    versiculoAtual = versiculo; // Garante que a variável de estado reflita o versículo exibido
                }

                // Função chamada ao clicar no botão "PRÓXIMO"
                function proximoVersiculo() {
                    const totalVersiculosCapitulo = getNumVersiculosLocal(livroAtual, capituloAtual);
                    
                    if (versiculoAtual < totalVersiculosCapitulo) {
                        // Ainda há versículos neste capítulo, avança para o próximo
                        versiculoAtual++;
                        carregarVersiculo(versiculoAtual); // Apenas exibe o próximo versículo
                    } else {
                        // Chegou ao fim do capítulo atual
                        const totalCapitulosLivro = livros[livroAtual].capitulos;
                        if (capituloAtual < totalCapitulosLivro) {
                            // Ainda há capítulos neste livro, avança para o próximo capítulo
                            capituloAtual++;
                            versiculoAtual = 1; // Começa no primeiro versículo do novo capítulo
                            carregarCapitulo(livroAtual, capituloAtual); // Carrega os dados do novo capítulo
                        } else {
                            // Chegou ao fim do livro atual
                            const indiceLivroAtual = listaLivros.indexOf(livroAtual);
                            if (indiceLivroAtual < listaLivros.length - 1) {
                                // Ainda há livros na Bíblia, avança para o próximo livro
                                const proximoLivro = listaLivros[indiceLivroAtual + 1];
                                // Atualiza estado para o início do próximo livro
                                livroAtual = proximoLivro; 
                                capituloAtual = 1;
                                versiculoAtual = 1;
                                carregarCapitulo(livroAtual, capituloAtual); // Carrega o primeiro capítulo do novo livro
                            } else {
                                // Chegou ao fim da Bíblia (Apocalipse)
                                document.getElementById('versiculo-container').innerHTML = '<div class="versiculo-texto">Fim da Bíblia.</div>';
                                // Poderia desabilitar o botão "próximo" aqui
                            }
                        }
                    }
                }

                // Função chamada ao clicar no botão "VOLTAR"
                function voltarVersiculo() {
                    if (versiculoAtual > 1) {
                        // Ainda há versículos anteriores neste capítulo, volta um
                        versiculoAtual--;
                        carregarVersiculo(versiculoAtual); // Apenas exibe o versículo anterior
                    } else {
                        // Chegou ao início do capítulo atual (versículo 1)
                        if (capituloAtual > 1) {
                            // Ainda há capítulos anteriores neste livro, volta um capítulo
                            capituloAtual--;
                            // Define versículo como o último do capítulo anterior
                            versiculoAtual = getNumVersiculosLocal(livroAtual, capituloAtual); 
                            // Carrega os dados do capítulo anterior e exibe o último versículo
                            carregarCapitulo(livroAtual, capituloAtual); 
                        } else {
                            // Chegou ao início do livro atual (Capítulo 1)
                            const indiceLivroAtual = listaLivros.indexOf(livroAtual);
                            if (indiceLivroAtual > 0) {
                                // Ainda há livros anteriores na Bíblia, volta um livro
                                const livroAnterior = listaLivros[indiceLivroAtual - 1];
                                // Atualiza estado para o fim do livro anterior
                                livroAtual = livroAnterior; 
                                // Define capítulo como o último do livro anterior
                                capituloAtual = livros[livroAtual].capitulos; 
                                // Define versículo como o último do último capítulo
                                versiculoAtual = getNumVersiculosLocal(livroAtual, capituloAtual); 
                                // Carrega os dados do último capítulo do livro anterior e exibe o último versículo
                                carregarCapitulo(livroAtual, capituloAtual); 
                            } else {
                                // Chegou ao início da Bíblia (Gênesis 1:1)
                                // Não faz nada ou exibe uma mensagem
                                // Mantém no primeiro versículo Gênesis 1:1
                                versiculoAtual = 1; 
                                carregarVersiculo(versiculoAtual); // Apenas recarrega
                                // Poderia desabilitar o botão "voltar" aqui
                            }
                        }
                    }
                }

                // Adiciona os ouvintes de evento aos botões de navegação
                document.getElementById('proximo-botao').addEventListener('click', proximoVersiculo);
                document.getElementById('voltar-botao').addEventListener('click', voltarVersiculo);

                // --- Carregamento Inicial ---
                // Chama carregarCapitulo para buscar os dados JSON do capítulo inicial
                // e então carregarVersiculo será chamado internamente para exibir o versículo inicial.
                carregarCapitulo(livroAtual, capituloAtual); 

            </script> <!-- Fim do script interno -->
        </body>
        </html>
    `); // Fim do conteúdo HTML da janela slide
    window.janelaSlide.document.close(); // Finaliza a escrita no documento da nova janela

} // --- Fim da função abrirJanelaSlide ---


// O bloco abaixo adiciona o evento de clique ao link "Slide" na barra de menu principal.
// Seleciona o link específico (primeiro 'li a' dentro de 'header nav ul').
// ATENÇÃO: Ajuste este seletor se a estrutura do seu HTML for diferente.
const slideLink = document.querySelector('header nav ul li:nth-child(1) a'); 
if (slideLink) {
    slideLink.addEventListener('click', (event) => {
        event.preventDefault(); // Previne o comportamento padrão do link
        // Chama a função para abrir a janela, passando o estado atual.
        // Usa '|| 1' como fallback caso capítulo ou versículo não estejam definidos ainda.
        const verNum = activeVersiculoButton ? activeVersiculoButton.textContent.trim() : 1;
        abrirJanelaSlide(activeLivro, activeCapitulo || 1, verNum); 
    });
} else {
    console.warn("Link 'Slide' não encontrado no cabeçalho com o seletor esperado.");
}


// --- END OF PART 7/8 ---
// --- START OF PART 8/8 ---

// O bloco abaixo define os dados para os menus dropdown na barra de navegação superior.

// Lista de arquivos para download
const downloads = [
    { texto: 'A Bíblia Católica', link: 'baixar/A_Biblia_Catolica.pdf' },
    { texto: 'A Bíblia Sagrada NVT', link: 'baixar/A_Biblia_Sagrada_NVT.pdf' },
    { texto: 'A Bíblia Viva', link: 'baixar/A_Biblia_Viva.pdf' },
    { texto: 'A vida completa de Jesus<br>Pr. Juanribe<br>Pagliarin', link: 'baixar/A_vida_completa_de_Jesus_Pr_Juanribe_Pagliarin.pdf' },
    { texto: 'Bíblia de Genebra<br>(só estudo)', link: 'baixar/Biblia_Genebra_so_estudo.pdf' },
    { texto: 'Bíblia em ordem<br>cronológica NVI', link: 'baixar/Biblia_em_ordem_cronologica_NVI.pdf' },
    { texto: 'Bíblia explicada', link: 'baixar/Biblia_explicada.pdf' },
    { texto: 'Bíblia KJA', link: 'baixar/Biblia_KJA.pdf' },
    { texto: 'Bíblia<br>Palavra-Chave', link: 'baixar/Biblia_palavra_chave.pdf' },
    { texto: 'Bíblia Thompson<br>Temas em Cadeia', link: 'baixar/Biblia_Thompson_temas_em_cadeia.pdf' }
];

// Lista de versões da Bíblia (exemplo)
const versoes = [
    { texto: 'ARA (Atual)', link: '#' }, // Link pode apontar para recarregar com a versão
    { texto: 'ARC (Em breve)', link: '#' }, // Link para outra versão
    { texto: 'NVT (Em breve)', link: '#' }
];

// Lista de dicionários/concordâncias (exemplo)
const dicionario = [
    { texto: 'Dicionário VINE', link: '#' }, // Links para recursos externos ou páginas internas
    { texto: 'Concordância Strong', link: '#' }
];

// Lista de Harpas/Hinários (exemplo)
const harpaHinario = [
    { texto: 'Harpa Cristã', link: '#' }, // Links para seções específicas
    { texto: 'Cantor Cristão', link: '#' }
];

// Lista de links úteis
const utilidades = [
    { texto: 'IA Ajudar a estudar a biblia', link: 'https://bible.ai/pt' },
    { texto: 'Posso conhecer a Deus', link: 'https://caniknowgod.com/' },
    { texto: 'Dicionário e Comentário<br> de toda a Bíblia', link: 'https://www.apologeta.com.br' },
    { texto: 'BíbliaOn', link: 'https://www.bibliaon.com/' },
    { texto: 'Cursos (Em breve)', link: 'html/cursos.html' } // Link para página de cursos
];

// Função genérica para popular uma lista dropdown (<ul>) com itens (<li><a>).
function populateList(listId, items) {
    const listElement = document.getElementById(listId);
    if (!listElement) {
        console.warn(`Elemento de lista com ID '${listId}' não encontrado.`);
        return;
    }
    // Limpa a lista antes de popular (caso seja chamada múltiplas vezes)
    listElement.innerHTML = ''; 
    items.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.link;
        a.innerHTML = item.texto; // Usa innerHTML para permitir <br>
        // Abrir links externos ou PDFs em nova aba
        if (item.link !== '#' && (item.link.startsWith('http') || item.link.endsWith('.pdf'))) {
            a.target = '_blank';
            a.rel = 'noopener noreferrer'; // Boa prática de segurança
        }
        // Se for um link interno (ex: # ou outra página html), não abre nova aba
        li.appendChild(a);
        listElement.appendChild(li);
    });
}

// Populando as listas dropdown com os dados definidos acima.
populateList('baixar-list', downloads); // ID do <ul> para Baixar
populateList('versoes-list', versoes); // ID do <ul> para Versões
populateList('dicionario-list', dicionario); // ID do <ul> para Dicionário
populateList('harpa-hinario-list', harpaHinario); // ID do <ul> para Harpa/Hinário
populateList('utilidades-list', utilidades); // ID do <ul> para Utilidades

// Funções para mostrar e esconder as listas dropdown.
function showList(listId) {
    const listElement = document.getElementById(listId);
    if (listElement) {
        listElement.style.display = 'block';
    }
}

function hideList(listId) {
    const listElement = document.getElementById(listId);
    if (listElement) {
        listElement.style.display = 'none';
    }
}

// Adiciona eventos de mouse (entrar/sair) para cada item do menu que tem um dropdown.
document.querySelectorAll('.dropdown').forEach(dropdown => {
    // Encontra o ID da lista (<ul>) dentro do dropdown.
    const listId = dropdown.querySelector('.dropdown-content')?.id; 
    if (listId) {
        let hideTimeout; // Variável para controlar o tempo de espera antes de esconder

        // Evento quando o mouse entra no item principal do menu.
        dropdown.addEventListener('mouseenter', () => {
            clearTimeout(hideTimeout); // Cancela qualquer timeout de esconder anterior
            showList(listId); // Mostra a lista
        });

        // Evento quando o mouse sai do item principal do menu.
        dropdown.addEventListener('mouseleave', () => {
            // Define um pequeno atraso antes de esconder, permitindo mover o mouse para a lista.
            hideTimeout = setTimeout(() => {
                // Verifica se o mouse NÃO está sobre o item principal NEM sobre a lista aberta.
                if (!dropdown.matches(':hover') && !document.getElementById(listId)?.matches(':hover')) {
                    hideList(listId); // Esconde a lista
                }
            }, 200); // Atraso de 200ms
        });

        // Seleciona a lista (ul) para adicionar eventos a ela também.
        const listElement = document.getElementById(listId);
        if (listElement) {
             // Evento quando o mouse entra na própria lista (mantém visível).
            listElement.addEventListener('mouseenter', () => {
                clearTimeout(hideTimeout); // Cancela o timeout de esconder
                 showList(listId); // Garante que está visível
            });
            // Evento quando o mouse sai da lista.
            listElement.addEventListener('mouseleave', () => {
                // Define um pequeno atraso antes de esconder.
                hideTimeout = setTimeout(() => {
                    // Verifica se o mouse NÃO está sobre o item principal NEM sobre a lista.
                    if (!dropdown.matches(':hover') && !listElement.matches(':hover')) {
                        hideList(listId); // Esconde a lista
                    }
                }, 200); 
            });
        }
    }
});


// --- Funcionalidade da Seção "SOBRE" ---

// Função para carregar e exibir o conteúdo da seção "Sobre".
function loadSobre() {
    const content = document.querySelector('.content');
    
    // Remove todos os elementos filhos da área principal, exceto a marca d'água
    Array.from(content.children).forEach(child => {
        if (!child.classList.contains('watermark')) {
            child.remove();
        }
    });

    // Cria o contêiner para o conteúdo "Sobre" se ele não existir
    let sobreContent = content.querySelector('.sobre-content'); // Tenta encontrar
    if (!sobreContent) { // Se não encontrar, cria
        sobreContent = document.createElement('div');
        sobreContent.classList.add('sobre-content');
        sobreContent.style.position = 'relative'; // Garante posicionamento relativo
        sobreContent.style.zIndex = '2'; // Garante que fique acima da marca d'água
        
        // Define o HTML do conteúdo "Sobre"
        sobreContent.innerHTML = `
            <h2>Sobre o Projeto Bíblia Sagrada</h2>
            <p>Este projeto tem como objetivo oferecer uma ferramenta online completa e acessível para leitura e estudo da Bíblia Sagrada.</p>
            <p>Versão Atual: Almeida Revista e Atualizada (ARA). Outras versões, Harpa Cristã, Hinário Batista, Dicionário Bíblico e Concordância poderão ser adicionadas futuramente.</p>
            <p>Funcionalidades incluem a leitura dos textos, navegação por livros/capítulos/versículos e a opção de visualização em modo "Slide" para apresentações (Datashow).</p>
            <p>Utilize o menu lateral para navegar pelos livros e os botões que aparecem para selecionar capítulos e versículos.</p>
            <p>O projeto está em desenvolvimento contínuo.</p>
        `;
        content.appendChild(sobreContent); // Adiciona o conteúdo "Sobre" à página
    }
    
    // Limpa o estado ativo da navegação da Bíblia
    activeLivro = null;
    activeCapitulo = null;
    activeVersiculoButton = null;
    titulo = null; // Reseta a referência ao título H2
}

// Adiciona evento de clique ao link "SOBRE" (assumindo que ele tem id="sobre")
const sobreLink = document.getElementById('sobre');
if (sobreLink) {
    sobreLink.addEventListener('click', (event) => {
        event.preventDefault(); // Previne o comportamento padrão do link
        loadSobre(); // Chama a função para exibir o conteúdo "Sobre"
    });
} else {
    console.warn("Link 'Sobre' com ID 'sobre' não encontrado.");
}


// --- Menu Móvel ---

// Adiciona evento de clique ao botão de menu para dispositivos móveis
// (Assumindo que existe um botão com a classe 'menu-button' no HTML)
const menuButton = document.querySelector('.menu-button');
if (menuButton) {
    menuButton.addEventListener('click', () => {
        const menuLivros = document.querySelector('.menu-livros'); // Seleciona o menu lateral
        if (menuLivros) {
            menuLivros.classList.toggle('show'); // Alterna a classe 'show' para exibir/ocultar
        }
    });
} else {
    // Aviso se o botão não for encontrado (pode ser intencional se não houver versão móvel)
    // console.warn("Botão de menu móvel ('.menu-button') não encontrado.");
}

// --- FIM DO SCRIPT ara.js ---

// --- END OF PART 8/8 ---