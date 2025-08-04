/*===============================================================================*/
/*              SCRIPT PRINCIPAL DE NAVEGAÇÃO E INICIALIZAÇÃO (APP)              */
/*===============================================================================*/
/*    - Gerencia a navegação entre as seções: Concordância, Dicionário e Sobre.  */
/*    - Instancia e inicializa os módulos principais (DataManager, etc.).        */
/*    - Controla a visibilidade das seções e do menu alfabético.                 */
/*===============================================================================*/

class MainApp {
    // Este bloco e o Construtor da classe MainApp.
    constructor() {                                                                // Inicializa os componentes principais da aplicação, centralizando o controle.
        window.dataManager = new DataManager();                                    // Instancia o gerenciador de dados da concordância.
        window.concordanciaOptimized = new ConcordanciaOptimized();                // Instancia o controlador da interface da concordância.
        window.dicionario = new Dicionario();                                      // Instancia o controlador do dicionário.

        this.currentSection = 'concordancia';                                      // Define a seção inicial como 'concordancia'.
        this.initializeElements();                                                 // Mapeia os elementos do DOM.
        this.bindEvents();                                                         // Vincula os eventos de navegação.
        this.initializeApp();                                                      // Configura o estado inicial da aplicação.
    }

    //Este bloco mapeia os elementos do DOM para a propriedade 'elements' para fácil acesso.
    initializeElements() {
        this.elements = {
            menuPrincipal: document.getElementById('menu-principal'),              // Botão para o menu principal.
            concordanciaBtn: document.getElementById('concordancia'),              // Botão para a seção de Concordância.
            dicionarioBtn: document.getElementById('dicionario'),                  // Botão para a seção de Dicionário.
            sobreBtn: document.getElementById('sobre'),                            // Botão para a seção Sobre.
            mensagemInicial: document.getElementById('mensagem-inicial'),          // Container da mensagem inicial.
            secaoConcordancia: document.getElementById('secao-concordancia'),      // Elemento da seção de Concordância.
            secaoDicionario: document.getElementById('secao-dicionario'),          // Elemento da seção de Dicionário.
            secaoSobre: document.getElementById('secao-sobre'),                    // Elemento da seção Sobre.
            menuAlfabetico: document.querySelector('.menu-alfabetico'),            // Menu lateral com as letras do alfabeto.
            tituloMenu: document.querySelector('.titulo-menu'),
            menuOpcoes: document.querySelector('.menu-opcoes'),
            nav: document.querySelector('nav')
        };
    }

    // Este bloco vincula todos os eventos necessários para a navegação principal.
    bindEvents() {                                                                 // Adiciona evento de clique para o botão 'Concordância'.
        this.elements.concordanciaBtn.addEventListener('click', (e) => {
            e.preventDefault();                                                    // Previne a ação padrão do link.
            this.showSection('concordancia');                                      // Mostra a seção de concordância.
        });

        // Este bloco adiciona evento de clique para o botão 'Dicionário'.
        this.elements.dicionarioBtn.addEventListener('click', (e) => {
            e.preventDefault();                                                    // Previne a ação padrão do link.
            this.showSection('dicionario');                                        // Mostra a seção de dicionário.
        });

        // Este bloco adiciona evento de clique para o botão 'Sobre'.
        this.elements.sobreBtn.addEventListener('click', (e) => {
            e.preventDefault();                                                    // Previne a ação padrão do link.
            this.showSection('sobre');                                             // Mostra a seção sobre.
        });

        // Este bloco adiciona eventos de teclado para navegação rápida entre seções (Ctrl + 1, 2, 3).
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {                                                       // Verifica se a tecla Ctrl está pressionada.
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        this.showSection('concordancia');
                        break;
                    case '2':
                        e.preventDefault();
                        this.showSection('dicionario');
                        break;
                    case '3':
                        e.preventDefault();
                        this.showSection('sobre');
                        break;
                }
            }
        });
    }

    // Este bloco inicializa o estado da aplicação.
    initializeApp() {
        // this.showSection('concordancia'); // Removido para manter a mensagem inicial visível
        this.elements.menuAlfabetico.style.display = 'none'; // Oculta o menu alfabético inicialmente
        this.elements.tituloMenu.style.display = 'none';
        // this.elements.nav.style.justifyContent = 'center';  // Comentado, pois agora no CSS
        // this.elements.menuOpcoes.style.marginLeft = '0';    // Comentado, pois agora no CSS
        document.querySelector('#conteudo-principal').style.marginLeft = '0px';
        
        console.log('📖 Concordância e Dicionário Bíblico inicializado');                           // Log de sucesso.
        console.log('⌨️  Atalhos: Ctrl+1 (Concordância), Ctrl+2 (Dicionário), Ctrl+3 (Sobre)');    // Informa sobre os atalhos.
        
        this.monitorPerformance();                                                                 // Inicia o monitoramento de performance.
    }

    // Controla a visibilidade das seções da aplicação.
    showSection(sectionName) {                                                     // Remove a classe 'active' de todos os botões do menu.
        document.querySelectorAll('.menu-opcoes a').forEach(btn => {
            btn.classList.remove('active');
        });
    
        // Este bloco oculta todas as seções para garantir um estado limpo.
        this.elements.mensagemInicial.style.display = 'none';
        this.elements.secaoConcordancia.classList.remove('secao-ativa');
        this.elements.secaoConcordancia.classList.add('secao-inativa');
        this.elements.secaoDicionario.classList.remove('secao-ativa');
        this.elements.secaoDicionario.classList.add('secao-inativa');
        this.elements.secaoSobre.classList.remove('secao-ativa');
        this.elements.secaoSobre.classList.add('secao-inativa');
    
        // Este bloco exibe a seção correta com base no nome fornecido.
        switch (sectionName) {
            case 'concordancia':
                this.elements.secaoConcordancia.classList.remove('secao-inativa');
                this.elements.secaoConcordancia.classList.add('secao-ativa');
                this.elements.concordanciaBtn.classList.add('active');
                this.elements.menuAlfabetico.style.display = 'block';              // Exibe o menu alfabético.
                this.currentSection = 'concordancia';
                break;
    
            case 'dicionario':
                this.elements.secaoDicionario.classList.remove('secao-inativa');
                this.elements.secaoDicionario.classList.add('secao-ativa');
                this.elements.dicionarioBtn.classList.add('active');
                this.elements.menuAlfabetico.style.display = 'block';              // Exibe o menu alfabético.
                this.currentSection = 'dicionario';
                // Chama o método de inicialização do dicionário para resetar sua view.
                if (window.dicionario && typeof window.dicionario.init === 'function') {
                    window.dicionario.init();
                }
                break;
    
            case 'sobre':
                this.elements.secaoSobre.classList.remove('secao-inativa');
                this.elements.secaoSobre.classList.add('secao-ativa');
                this.elements.sobreBtn.classList.add('active');
                this.elements.menuAlfabetico.style.display = 'none';               // Oculta o menu alfabético.
                this.currentSection = 'sobre';
                break;
        }
    
        // Adicione após o switch:
        this.elements.tituloMenu.style.display = 'block';
        this.elements.nav.style.justifyContent = 'flex-start';
        this.elements.menuOpcoes.style.marginLeft = '20px';
        const conteudoPrincipal = document.querySelector('#conteudo-principal');
        if (sectionName === 'sobre') {
            conteudoPrincipal.style.marginLeft = '40px';  // Alterado para 40px para ajustar o texto para a direita
        } else {
            conteudoPrincipal.style.marginLeft = '140px';
        }
    
        this.updatePageTitle(sectionName);                                         // Atualiza o título da página.
    }

    // Este bloco atualiza o título da aba do navegador com base na seção ativa.
    updatePageTitle(sectionName) {
        const titles = {
            'inicial': 'Concordância e Dicionário Bíblico',
            'concordancia': 'Concordância Bíblica',
            'dicionario': 'Dicionário Bíblico',
            'sobre': 'Sobre - Concordância e Dicionário Bíblico'
        };
        document.title = titles[sectionName] || 'Concordância e Dicionário Bíblico';     // Define o título ou um valor padrão.
    }

    // Este bloco monitora o uso de memória e o tempo de carregamento da página.
    monitorPerformance() {                                                         // Verifica se a API de memória está disponível no navegador.
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const memoryInfo = {
                    used: Math.round(memory.usedJSHeapSize / 1024 / 1024),         // Memória usada em MB.
                    total: Math.round(memory.totalJSHeapSize / 1024 / 1024),       // Memória total em MB.
                    limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)        // Limite de memória em MB.
                };

                if (memoryInfo.used > 100) {                                       // Alerta se o uso de memória for alto e limpa o cache se for muito alto.
                    console.warn('⚠️ Alto uso de memória:', memoryInfo);
                    if (window.dataManager && memoryInfo.used > 200) {
                        window.dataManager.clearCache();
                        console.log('🧹 Cache limpo para economizar memória');
                    }
                }
            }, 30000);                                                             // Executa a cada 30 segundos.
        }

        //  este bloco mede e exibe o tempo de carregamento da página.
        window.addEventListener('load', () => {
            if (performance.timing.loadEventEnd > 0) {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log(`⏱️ Tempo de carregamento: ${loadTime}ms`);
            }
        });
    }

    // Este bloco retorna estatísticas atuais da aplicação para fins de depuração.
    getStats() {
        const stats = {
            currentSection: this.currentSection,
            timestamp: new Date().toISOString()
        };
        if (window.dataManager) {
            stats.dataManager = window.dataManager.getCacheStats();                // Inclui estatísticas do cache do DataManager.
        }
        return stats;
    }
}

// Este bloco inicializa a aplicação principal quando o DOM estiver completamente carregado.
document.addEventListener('DOMContentLoaded', () => {
    window.mainApp = new MainApp();
});

// Este bloco expõe funções de depuração na janela global.
window.debugApp = {
    getStats: () => window.mainApp?.getStats(),
    clearCache: () => window.dataManager?.clearCache(),
    showSection: (section) => window.mainApp?.showSection(section)
};