document.addEventListener('DOMContentLoaded', function() {
    const letraBtns = document.querySelectorAll('.letra-btn');
    const content = document.querySelector('.content');
    let dicionario = {}; // This will store loaded letter data

    letraBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const letra = this.getAttribute('data-letra');
            
            letraBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Check if we already have this letter loaded
            if (dicionario[letra]) {
                mostrarVerbetes(dicionario[letra], letra);
            } else {
                fetch(`../dicionario/${letra.toLowerCase()}.json`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`No entries for letter ${letra}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Store the loaded data
                        dicionario[letra] = data[letra] || [];
                        mostrarVerbetes(dicionario[letra], letra);
                    })
                    .catch(error => {
                        console.error(`Error loading letter ${letra}:`, error);
                        mostrarVerbetes([], letra);
                    });
            }
        });
    });

    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    function realizarBusca() {
        const termo = searchInput.value.toLowerCase().trim();
        
        if (termo === '') {
            const letraAtiva = document.querySelector('.letra-btn.active').getAttribute('data-letra');
            mostrarVerbetes(dicionario[letraAtiva] || [], letraAtiva);
            return;
        }
        
        // Search through all loaded letters
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
        let html = `
            <div class="letra-section">
                <div class="letra-header">
                    <span>${titulo[0]}</span> ${titulo}
                </div>
        `;

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
                                <span class="ref-item" data-ref="${ref}">${ref}</span>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        
        const existingSection = content.querySelector('.letra-section');
        if (existingSection) {
            existingSection.remove();
        }
        content.insertAdjacentHTML('beforeend', html);

        const refItems = document.querySelectorAll('.ref-item');
        refItems.forEach(item => {
            item.addEventListener('click', function() {
                const referencia = this.getAttribute('data-ref');
                abrirReferencia(referencia);
            });
        });
    }

    function abrirReferencia(referencia) {
        const partes = referencia.split(' ');
        const livroNome = partes[0].toLowerCase();
        const capituloVersiculo = partes[1].split(':');
        const capitulo = capituloVersiculo[0];
        const intervaloVersiculos = capituloVersiculo[1].split('-');
        const versiculoInicio = parseInt(intervaloVersiculos[0]);
        const versiculoFim = intervaloVersiculos[1] ? parseInt(intervaloVersiculos[1]) : versiculoInicio;

        const livroMap = {
            // Pentateuco
            'gênesis': 'genesis',
            'êxodo': 'exodo',
            'levítico': 'levitico',
            'números': 'numeros',
            'deuteronômio': 'deuteronomio',

            // Livros Históricos
            'josué': 'josue',
            'juízes': 'juizes',
            'rute': 'rute',
            '1samuel': '1samuel',
            '2samuel': '2samuel',
            '1reis': '1reis',
            '2reis': '2reis',
            '1crônicas': '1cronicas',
            '2crônicas': '2cronicas',
            'esdras': 'esdras',
            'neemias': 'neemias',
            'ester': 'ester',

            // Livros Poéticos e Sapienciais
            'jó': 'jo',
            'salmos': 'salmos',
            'provérbios': 'proverbios',
            'eclesiastes': 'eclesiastes',
            'cantares': 'cantares',
            'cânticos': 'cantares',

            // Profetas Maiores
            'isaías': 'isaias',
            'jeremias': 'jeremias',
            'lamentações': 'lamentacoes',
            'ezequiel': 'ezequiel',
            'daniel': 'daniel',

            // Profetas Menores
            'oseias': 'oseias',
            'joel': 'joel',
            'amós': 'amos',
            'obadias': 'obadias',
            'jonas': 'jonas',
            'miqueias': 'miqueias',
            'naum': 'naum',
            'habacuque': 'habacuque',
            'sofonias': 'sofonias',
            'ageu': 'ageu',
            'zacarias': 'zacarias',
            'malaquias': 'malaquias',

            // Evangelhos
            'mateus': 'mateus',
            'marcos': 'marcos',
            'lucas': 'lucas',
            'joão': 'joao',

            // Histórico (Novo Testamento)
            'atos': 'atos',

            // Epístolas Paulinas
            'romanos': 'romanos',
            '1coríntios': '1corintios',
            '2coríntios': '2corintios',
            'gálatas': 'galatas',
            'efésios': 'efesios',
            'filipenses': 'filipenses',
            'colossenses': 'colossenses',
            '1tessalonicenses': '1tessalonicenses',
            '2tessalonicenses': '2tessalonicenses',
            '1timóteo': '1timoteo',
            '2timóteo': '2timoteo',
            'tito': 'tito',
            'filemom': 'filemom',

            // Epístolas Gerais / Católicas
            'hebreus': 'hebreus',
            'tiago': 'tiago',
            '1pedro': '1pedro',
            '2pedro': '2pedro',
            '1joão': '1joao',
            '2joão': '2joao',
            '3joão': '3joao',
            'judas': 'judas',

            // Apocalíptico
            'apocalipse': 'apocalips'
        };

        const livro = livroMap[livroNome] || livroNome.replace(/[^a-z0-9]/g, '');
        const filePath = `/versao/arc/${livro}/${capitulo}.html`;

        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Arquivo não encontrado: ' + filePath);
                }
                return response.text();
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                let versiculosHTML = '';
                for (let i = versiculoInicio; i <= versiculoFim; i++) {
                    const versiculoElement = doc.querySelector(`#versiculo-${i}`);
                    if (versiculoElement) {
                        versiculosHTML += `
                            <div class="versiculo">
                                <span class="versiculo-num">${i}.</span>
                                <span class="versiculo-texto">${versiculoElement.innerHTML}</span>
                            </div>
                        `;
                    }
                }

                mostrarVersiculos(versiculosHTML, partes[0], capitulo, versiculoInicio, versiculoFim);
            })
            .catch(error => {
                console.error('Erro ao carregar os versículos:', error);
                alert('Não foi possível carregar os versículos: ' + error.message);
            });
    }

    function mostrarVersiculos(html, livroNome, capitulo, versiculoInicio, versiculoFim) {
        const existingPopup = document.querySelector('.popup-window');
        if (existingPopup) {
            existingPopup.remove();
        }

        const popup = document.createElement('div');
        popup.className = 'popup-window';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-btn';
        closeBtn.innerHTML = '×';
        closeBtn.onclick = () => popup.remove();

        const titulo = document.createElement('h3');
        titulo.style.color = '#d4ac0d';
        titulo.style.marginTop = '0';
        titulo.textContent = `${livroNome.toUpperCase()} ${capitulo}:${versiculoInicio}-${versiculoFim}`;

        const conteudo = document.createElement('div');
        conteudo.innerHTML = html;

        popup.appendChild(closeBtn);
        popup.appendChild(titulo);
        popup.appendChild(conteudo);
        document.body.appendChild(popup);

        // Garantir que a janela se ajuste ao conteúdo
        const maxHeight = window.innerHeight * 0.8;
        if (popup.offsetHeight > maxHeight) {
            popup.style.height = maxHeight + 'px';
        }
    }

    searchBtn.addEventListener('click', realizarBusca);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            realizarBusca();
        }
    });

    // Load the first letter by default
    document.querySelector('.letra-btn[data-letra="A"]').click();
});