document.addEventListener('DOMContentLoaded', function() {
    // Carrega os dados do dicionário
    fetch('../json/dicionario.json')
        .then(response => response.json())
        .then(dicionario => {
            inicializarDicionario(dicionario);
        })
        .catch(error => console.error('Erro ao carregar o dicionário:', error));

    function inicializarDicionario(dicionario) {
        // Navegação por letras
        const letraBtns = document.querySelectorAll('.letra-btn');
        const content = document.querySelector('.content');

        letraBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const letra = this.getAttribute('data-letra');
                
                // Atualiza botões ativos
                letraBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filtra e mostra verbetes da letra selecionada
                const verbetesLetra = dicionario[letra] || [];
                mostrarVerbetes(verbetesLetra, letra);
            });
        });

        // Funcionalidade de busca
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.search-btn');

        function realizarBusca() {
            const termo = searchInput.value.toLowerCase().trim();
            
            if (termo === '') {
                // Se a busca estiver vazia, mostra a seção ativa
                const letraAtiva = document.querySelector('.letra-btn.active').getAttribute('data-letra');
                mostrarVerbetes(dicionario[letraAtiva] || [], letraAtiva);
                return;
            }
            
            // Busca em todas as letras
            const resultados = [];
            Object.values(dicionario).forEach(verbetes => {
                verbetes.forEach(verbete => {
                    if (verbete.termo.toLowerCase().includes(termo) || 
                        verbete.definicao.toLowerCase().includes(termo)) {
                        resultados.push(verbete);
                    }
                });
            });
            
            if (resultados.length === 0) {
                alert('Nenhum resultado encontrado para: ' + termo);
            } else {
                mostrarVerbetes(resultados, 'Resultados da busca');
            }
        }

        function mostrarVerbetes(verbetes, titulo) {
            // Cria a seção de letra
            let html = `
                <div class="letra-section">
                    <div class="letra-header">
                        <span>${titulo[0]}</span> ${titulo}
                    </div>
            `;

            // Adiciona cada verbete
            verbetes.forEach(verbete => {
                html += `
                    <div class="verbete">
                        <h3>${verbete.termo}</h3>
                        <p>${verbete.definicao}</p>
                        ${verbete.definicaoAdicional ? `<p>${verbete.definicaoAdicional}</p>` : ''}
                        <div class="referencias">
                            <h4>Referências Bíblicas:</h4>
                            <div class="ref-list">
                                ${verbete.referencias.map(ref => `
                                    <span class="ref-item">${ref}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;
            });

            html += '</div>';
            
            // Atualiza o conteúdo
            content.innerHTML = html;
        }

        searchBtn.addEventListener('click', realizarBusca);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                realizarBusca();
            }
        });

        // Mostra a primeira letra (A) inicialmente
        document.querySelector('.letra-btn[data-letra="A"]').click();
    }
});
