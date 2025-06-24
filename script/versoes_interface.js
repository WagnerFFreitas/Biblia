/**
 * MÓDULO DE INTERFACE DO USUÁRIO
 * Centraliza toda manipulação da interface
 */
export class InterfaceManager {
    constructor() {
        this.seletorVersao = document.getElementById('seletor-versao-principal');
        this.botaoModoLeitura = document.getElementById('modo-leitura');
    }

    /**
     * Configura os eventos da interface
     */
    configurarEventos() {
        // Evento do seletor de versão
        this.seletorVersao?.addEventListener('change', (e) => {
            localStorage.setItem('versaoBiblicaSelecionada', e.target.value);
            window.location.search = `?versao=${e.target.value}`;
        });

        // Evento do modo leitura
        this.botaoModoLeitura?.addEventListener('click', (e) => {
            e.preventDefault();
            window.toggleReadingMode(!window.modoLeituraAtivo, window.activeLivro, window.activeCapitulo);
        });

        // Eventos dos livros (menu lateral)
        document.querySelectorAll('.menu-livros a').forEach(livro => {
            livro.addEventListener('click', this._handleLivroClick);
        });
    }

    /**
     * Atualiza o título da página com a versão selecionada
     * @param {string} codigoVersao - Código da versão (ex: 'ARA')
     */
    atualizarTitulo(codigoVersao) {
        const titulo = document.getElementById('titulo-principal-versao');
        const subtitulo = document.getElementById('subtitulo-versao-extenso');
        
        if (titulo) titulo.textContent = `Bíblia Sagrada ${codigoVersao}`;
        if (subtitulo) subtitulo.textContent = window.NOME_VERSAO_COMPLETA_BIBLIA || '';
    }

    /**
     * Cria a lista de versões no dropdown
     * @param {Array} versoes - Lista de versões disponíveis
     */
    criarListaVersoes(versoes) {
        const lista = document.getElementById('versoes-list');
        if (!lista) return;

        lista.innerHTML = versoes.map(versao => `
            <li><a href="?versao=${versao.value}">${versao.text}</a></li>
        `).join('');
    }

    // Métodos privados
    _handleLivroClick(e) {
        e.preventDefault();
        const livro = e.target.dataset.livro;
        // Lógica para carregar o livro (implementada em outro módulo)
        window.carregarLivro(livro);
    }
}

// Exporta uma instância global
export const interfaceManager = new InterfaceManager();