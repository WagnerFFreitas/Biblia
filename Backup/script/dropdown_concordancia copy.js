// script/dropdown_concordancia.js

const bibliaConfig = {
    livros: [
        // Antigo Testamento
        { id: 'gn', nome: 'Gênesis', testamento: 'Antigo Testamento' },
        { id: 'ex', nome: 'Êxodo', testamento: 'Antigo Testamento' },
        { id: 'lv', nome: 'Levítico', testamento: 'Antigo Testamento' },
        { id: 'nm', nome: 'Números', testamento: 'Antigo Testamento' },
        { id: 'dt', nome: 'Deuteronômio', testamento: 'Antigo Testamento' },
        { id: 'js', nome: 'Josué', testamento: 'Antigo Testamento' },
        { id: 'jz', nome: 'Juízes', testamento: 'Antigo Testamento' },
        { id: 'rt', nome: 'Rute', testamento: 'Antigo Testamento' },
        { id: '1sm', nome: '1 Samuel', testamento: 'Antigo Testamento' },
        { id: '2sm', nome: '2 Samuel', testamento: 'Antigo Testamento' },
        { id: '1rs', nome: '1 Reis', testamento: 'Antigo Testamento' },
        { id: '2rs', nome: '2 Reis', testamento: 'Antigo Testamento' },
        { id: '1cr', nome: '1 Crônicas', testamento: 'Antigo Testamento' },
        { id: '2cr', nome: '2 Crônicas', testamento: 'Antigo Testamento' },
        { id: 'ed', nome: 'Esdras', testamento: 'Antigo Testamento' },
        { id: 'ne', nome: 'Neemias', testamento: 'Antigo Testamento' },
        { id: 'et', nome: 'Ester', testamento: 'Antigo Testamento' },
        { id: 'jo', nome: 'Jó', testamento: 'Antigo Testamento' },
        { id: 'sl', nome: 'Salmos', testamento: 'Antigo Testamento' },
        { id: 'pv', nome: 'Provérbios', testamento: 'Antigo Testamento' },
        { id: 'ec', nome: 'Eclesiastes', testamento: 'Antigo Testamento' },
        { id: 'ct', nome: 'Cantares', testamento: 'Antigo Testamento' },
        { id: 'is', nome: 'Isaías', testamento: 'Antigo Testamento' },
        { id: 'jr', nome: 'Jeremias', testamento: 'Antigo Testamento' },
        { id: 'lm', nome: 'Lamentações', testamento: 'Antigo Testamento' },
        { id: 'ez', nome: 'Ezequiel', testamento: 'Antigo Testamento' },
        { id: 'dn', nome: 'Daniel', testamento: 'Antigo Testamento' },
        { id: 'os', nome: 'Oséias', testamento: 'Antigo Testamento' },
        { id: 'jl', nome: 'Joel', testamento: 'Antigo Testamento' },
        { id: 'am', nome: 'Amós', testamento: 'Antigo Testamento' },
        { id: 'ob', nome: 'Obadias', testamento: 'Antigo Testamento' },
        { id: 'jn', nome: 'Jonas', testamento: 'Antigo Testamento' },
        { id: 'mq', nome: 'Miquéias', testamento: 'Antigo Testamento' },
        { id: 'na', nome: 'Naum', testamento: 'Antigo Testamento' },
        { id: 'hc', nome: 'Habacuque', testamento: 'Antigo Testamento' },
        { id: 'sf', nome: 'Sofonias', testamento: 'Antigo Testamento' },
        { id: 'ag', nome: 'Ageu', testamento: 'Antigo Testamento' },
        { id: 'zc', nome: 'Zacarias', testamento: 'Antigo Testamento' },
        { id: 'ml', nome: 'Malaquias', testamento: 'Antigo Testamento' },

        // Novo Testamento
        { id: 'mt', nome: 'Mateus', testamento: 'Novo Testamento' },
        { id: 'mc', nome: 'Marcos', testamento: 'Novo Testamento' },
        { id: 'lc', nome: 'Lucas', testamento: 'Novo Testamento' },
        { id: 'joa', nome: 'João', testamento: 'Novo Testamento' },
        { id: 'at', nome: 'Atos', testamento: 'Novo Testamento' },
        { id: 'rm', nome: 'Romanos', testamento: 'Novo Testamento' },
        { id: '1co', nome: '1 Coríntios', testamento: 'Novo Testamento' },
        { id: '2co', nome: '2 Coríntios', testamento: 'Novo Testamento' },
        { id: 'gl', nome: 'Gálatas', testamento: 'Novo Testamento' },
        { id: 'ef', nome: 'Efésios', testamento: 'Novo Testamento' },
        { id: 'fp', nome: 'Filipenses', testamento: 'Novo Testamento' },
        { id: 'cl', nome: 'Colossenses', testamento: 'Novo Testamento' },
        { id: '1ts', nome: '1 Tessalonicenses', testamento: 'Novo Testamento' },
        { id: '2ts', nome: '2 Tessalonicenses', testamento: 'Novo Testamento' },
        { id: '1tm', nome: '1 Timóteo', testamento: 'Novo Testamento' },
        { id: '2tm', nome: '2 Timóteo', testamento: 'Novo Testamento' },
        { id: 'tt', nome: 'Tito', testamento: 'Novo Testamento' },
        { id: 'fm', nome: 'Filemom', testamento: 'Novo Testamento' },
        { id: 'hb', nome: 'Hebreus', testamento: 'Novo Testamento' },
        { id: 'tg', nome: 'Tiago', testamento: 'Novo Testamento' },
        { id: '1pe', nome: '1 Pedro', testamento: 'Novo Testamento' },
        { id: '2pe', nome: '2 Pedro', testamento: 'Novo Testamento' },
        { id: '1jo', nome: '1 João', testamento: 'Novo Testamento' },
        { id: '2jo', nome: '2 João', testamento: 'Novo Testamento' },
        { id: '3jo', nome: '3 João', testamento: 'Novo Testamento' },
        { id: 'jd', nome: 'Judas', testamento: 'Novo Testamento' },
        { id: 'ap', nome: 'Apocalipse', testamento: 'Novo Testamento' }
    ],
    getTestamentoDoLivro(nomeLivroOuId) {
        if (!nomeLivroOuId) return null;
        const nomeLower = String(nomeLivroOuId).trim().toLowerCase();
        const partes = nomeLower.split(' ');
        const nomeBase = partes[0];

        const livroEncontrado = this.livros.find(livro =>
            livro.nome.toLowerCase() === nomeBase ||
            livro.id.toLowerCase() === nomeBase
        );

        return livroEncontrado ? livroEncontrado.testamento : null;
    },
    getLivrosPorTestamento(testamento = 'todos') {
        if (testamento === 'todos') return [...this.livros];
        return this.livros.filter(livro => livro.testamento === testamento);
    },
    getOrdemLivros() {
        return this.livros.map(l => l.nome);
    },
    findLivroById(livroId) {
        return this.livros.find(l => l.id === livroId);
    }
};

// *** INÍCIO DA CORREÇÃO ***
// Cria um mapa para consulta rápida do testamento a partir do nome normalizado do livro.
const mapaLivros = bibliaConfig.livros.reduce((acc, livro) => {
    const nomeNormalizado = livro.nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    acc[nomeNormalizado] = livro.testamento;
    return acc;
}, {});
// *** FIM DA CORREÇÃO ***

export function getTestamentoDoLivroConfig(nomeLivro) {
    if (!nomeLivro) return null;
    // A chamada em concordancia.js já normaliza o nome do livro, então aqui só precisamos consultar.
    const normalizado = nomeLivro.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return mapaLivros[normalizado] || null;
}

export function getOrdemDosLivrosConfig() {
    return bibliaConfig.getOrdemLivros();
}

export function findLivroByIdConfig(livroId) {
    return bibliaConfig.findLivroById(livroId);
}

let onTestamentoChangeGlobalCallback = null;
let onLivroChangeGlobalCallback = null;

export function initConcordanciaDropdowns(cbTestamento, cbLivro) {
    onTestamentoChangeGlobalCallback = cbTestamento;
    onLivroChangeGlobalCallback = cbLivro;

    const testamentoSelectElement = document.getElementById('custom-testamento-select');
    const livroSelectElement = document.getElementById('custom-livro-select');

    if (testamentoSelectElement) {
        _makeCustomSelect(testamentoSelectElement, (detail) => {
            if (onTestamentoChangeGlobalCallback) {
                onTestamentoChangeGlobalCallback(detail.value);
            }
            if (livroSelectElement) {
                _populateLivrosDropdown(livroSelectElement, detail.value);
            }
        });
    }

    if (livroSelectElement) {
        _makeCustomSelect(livroSelectElement, (detail) => {
            if (onLivroChangeGlobalCallback) {
                onLivroChangeGlobalCallback(detail.value);
            }
        });

        let initialTestamentoValue = 'todos';
        if (testamentoSelectElement) {
            const display = testamentoSelectElement.querySelector('.select-selected');
            if (display && display.dataset.value) {
                initialTestamentoValue = display.dataset.value;
            }
        }

        _populateLivrosDropdown(livroSelectElement, initialTestamentoValue);
    }

    document.addEventListener("click", function (e) {
        if (!e.target.closest('.custom-select')) {
            _closeAllSelects(null);
        }
    });
}

function _makeCustomSelect(customSelectElement, onChangeCallback) {
    const selectSelectedDisplay = customSelectElement.querySelector(".select-selected");
    const itemsContainer = customSelectElement.querySelector(".select-items");

    if (!selectSelectedDisplay || !itemsContainer) return;

    selectSelectedDisplay.addEventListener("click", function (e) {
        e.stopPropagation();
        _closeAllSelects(this);
        itemsContainer.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
    });

    Array.from(itemsContainer.children).forEach(optionItem => {
        optionItem.addEventListener("click", function () {
            const valorAntigo = selectSelectedDisplay.dataset.value;
            const textoAntigo = selectSelectedDisplay.innerHTML;

            selectSelectedDisplay.innerHTML = this.innerHTML;
            selectSelectedDisplay.dataset.value = this.dataset.value || this.textContent;

            Array.from(itemsContainer.children).forEach(child => child.classList.remove("same-as-selected"));
            this.classList.add("same-as-selected");

            _closeAllSelects(null);

            if (onChangeCallback) {
                onChangeCallback({
                    value: this.dataset.value,
                    text: this.textContent
                });
            }
        });
    });
}

function _populateLivrosDropdown(customLivroSelectElement, testamentoFiltrado) {
    const itemsContainer = customLivroSelectElement.querySelector(".select-items");
    const selectedDisplay = customLivroSelectElement.querySelector(".select-selected");

    if (!itemsContainer || !selectedDisplay) return;

    itemsContainer.innerHTML = '';

    const TodosOption = document.createElement("div");
    TodosOption.textContent = "Todos os livros";
    TodosOption.dataset.value = "todos";
    itemsContainer.appendChild(TodosOption);

    const livrosParaExibir = bibliaConfig.getLivrosPorTestamento(testamentoFiltrado);
    livrosParaExibir.forEach(livro => {
        const opt = document.createElement("div");
        opt.textContent = livro.nome;
        opt.dataset.value = livro.id;
        itemsContainer.appendChild(opt);
    });

    const valorSelecionado = selectedDisplay.dataset.value;
    const livroExistente = livrosParaExibir.find(l => l.id === valorSelecionado);

    if (livroExistente) {
        selectedDisplay.innerHTML = livroExistente.nome;
        selectedDisplay.dataset.value = livroExistente.id;
    } else {
        selectedDisplay.innerHTML = "Todos os livros";
        selectedDisplay.dataset.value = "todos";
    }

    Array.from(itemsContainer.children).forEach(optionItem => {
        optionItem.addEventListener("click", function () {
            const valorAntigo = selectedDisplay.dataset.value;
            const textoAntigo = selectedDisplay.innerHTML;

            selectedDisplay.innerHTML = this.innerHTML;
            selectedDisplay.dataset.value = this.dataset.value || this.textContent;

            Array.from(itemsContainer.children).forEach(child => child.classList.remove("same-as-selected"));
            this.classList.add("same-as-selected");

            _closeAllSelects(null);

            if (valorAntigo !== this.dataset.value || textoAntigo !== this.textContent) {
                if (onLivroChangeGlobalCallback) {
                    onLivroChangeGlobalCallback(this.dataset.value);
                }
            }
        });
    });
}

function _closeAllSelects(exceptThisSelectedDisplay) {
    document.querySelectorAll(".custom-select .select-items").forEach(container => {
        container.classList.add("select-hide");
    });

    document.querySelectorAll(".custom-select .select-selected").forEach(display => {
        display.classList.remove("select-arrow-active");
    });
}

// Certifique-se de que estas funções estão sendo chamadas quando os dropdowns mudam

// Função para configurar os eventos dos dropdowns customizados
function configurarEventosDropdowns() {
    // Dropdown de Testamento
    const testamentoSelect = document.getElementById('custom-testamento-select');
    if (testamentoSelect) {
        const testamentoItems = testamentoSelect.querySelectorAll('.select-items div');
        testamentoItems.forEach(item => {
            item.addEventListener('click', function() {
                const valor = this.getAttribute('data-value');
                const selected = testamentoSelect.querySelector('.select-selected');
                
                // Atualizar o texto e valor selecionado
                selected.textContent = this.textContent;
                selected.setAttribute('data-value', valor);
                
                // Chamar a função de filtro da concordância
                if (typeof atualizarFiltroTestamento === 'function') {
                    atualizarFiltroTestamento(valor);
                }
                
                console.log(`[DROPDOWN] Testamento selecionado: ${valor}`);
            });
        });
    }

    // Dropdown de Livro
    const livroSelect = document.getElementById('custom-livro-select');
    if (livroSelect) {
        const livroItems = livroSelect.querySelectorAll('.select-items div');
        livroItems.forEach(item => {
            item.addEventListener('click', function() {
                const valor = this.getAttribute('data-value');
                const selected = livroSelect.querySelector('.select-selected');
                
                // Atualizar o texto e valor selecionado
                selected.textContent = this.textContent;
                selected.setAttribute('data-value', valor);
                
                // Chamar a função de filtro da concordância
                if (typeof atualizarFiltroLivro === 'function') {
                    atualizarFiltroLivro(valor);
                }
                
                console.log(`[DROPDOWN] Livro selecionado: ${valor}`);
            });
        });
    }
}

// Função para configurar o botão de busca
function configurarBuscaGlobal() {
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    
    if (searchBtn && searchInput) {
        // Evento do botão
        searchBtn.addEventListener('click', function() {
            const termo = searchInput.value.trim();
            if (termo && typeof executarBuscaGlobalConcordancia === 'function') {
                executarBuscaGlobalConcordancia(termo);
            }
        });
        
        // Evento do Enter no input
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const termo = this.value.trim();
                if (termo && typeof executarBuscaGlobalConcordancia === 'function') {
                    executarBuscaGlobalConcordancia(termo);
                }
            }
        });
    }
}

// Chame estas funções quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    configurarEventosDropdowns();
    configurarBuscaGlobal();
});

// Também chame quando trocar para a aba de concordância
function onConcordanciaTabActive() {
    // Aguardar um pouco para garantir que o HTML foi carregado
    setTimeout(() => {
        configurarEventosDropdowns();
        configurarBuscaGlobal();
        
        // Chamar a função de inicialização da concordância
        if (typeof onConcordanciaViewReady === 'function') {
            onConcordanciaViewReady();
        }
    }, 100);
}