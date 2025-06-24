/**
 * MÓDULO DE GERENCIAMENTO DE VERSÍCULOS
 * Responsável por:
 * - Carregar versículos individuais
 * - Criar botões de navegação entre versículos
 * - Gerenciar o destaque do versículo ativo
 */
export class VersiculosManager {
    constructor() {
        this.versiculoAtivo = null;
    }

    /**
     * Carrega um versículo específico
     * @param {string} livro - Nome do livro bíblico
     * @param {number} capitulo - Número do capítulo
     * @param {number} versiculo - Número do versículo
     */
    async carregarVersiculo(livro, capitulo, versiculo) {
        const areaConteudo = document.querySelector('section.conteudo');
        if (!areaConteudo) return;

        try {
            const versao = localStorage.getItem('versaoBiblicaSelecionada') || 'ara';
            const url = `../versao/${versao}/${livro}/${capitulo}.json`;
            const resposta = await fetch(url);
            const dados = await resposta.json();

            // Atualiza o título
            const titulo = areaConteudo.querySelector('h2');
            if (titulo) {
                titulo.textContent = `${this._getNomeLivro(livro)} ${capitulo}:${versiculo}`;
            }

            // Exibe o versículo
            const container = areaConteudo.querySelector('.conteudo-versiculos') || 
                              this._criarContainerVersiculos(areaConteudo);
            
            container.innerHTML = `
                <div class="versiculo-ativo">
                    <sup>${versiculo}</sup>
                    <span>${dados.versiculos[versiculo]}</span>
                </div>
            `;

            this.versiculoAtivo = versiculo;
            this._atualizarBotoesVersiculos(container, versiculo);

        } catch (erro) {
            console.error('Erro ao carregar versículo:', erro);
        }
    }

    /**
     * Cria os botões de versículos para um capítulo
     * @param {string} livro - Nome do livro
     * @param {number} capitulo - Número do capítulo
     * @param {number} totalVersiculos - Quantidade total de versículos
     */
    criarBotoesVersiculos(livro, capitulo, totalVersiculos) {
        const container = document.createElement('div');
        container.className = 'conteudo-versiculos';

        for (let i = 1; i <= totalVersiculos; i++) {
            const botao = document.createElement('button');
            botao.className = 'botao-versiculo';
            botao.dataset.versiculo = i;
            botao.textContent = i;

            botao.addEventListener('click', () => {
                this.carregarVersiculo(livro, capitulo, i);
            });

            container.appendChild(botao);
        }

        return container;
    }

    // Métodos privados
    _criarContainerVersiculos(areaConteudo) {
        const container = document.createElement('div');
        container.className = 'conteudo-versiculos';
        areaConteudo.appendChild(container);
        return container;
    }

    _atualizarBotoesVersiculos(container, versiculoAtivo) {
        container.querySelectorAll('.botao-versiculo').forEach(botao => {
            botao.classList.toggle('active', 
                parseInt(botao.dataset.versiculo) === versiculoAtivo
            );
        });
    }

    _getNomeLivro(livro) {
        // Mapeamento de nomes completos (pode ser movido para um JSON externo)
        const nomes = {
            genesis: "Gênesis",
            exodo: "Êxodo",
            // ... outros livros
        };
        return nomes[livro] || livro;
    }
}

// Exporta uma instância global
export const versiculosManager = new VersiculosManager();