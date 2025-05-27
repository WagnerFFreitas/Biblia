document.addEventListener('DOMContentLoaded', function() {
    fetch('../json/dicionario.json')
        .then(response => response.json())
        .then(dicionario => {
            inicializarDicionario(dicionario);
        })
        .catch(error => console.error('Erro ao carregar o dicionário:', error));

    function inicializarDicionario(dicionario) {
        const letraBtns = document.querySelectorAll('.letra-btn');
        const content = document.querySelector('.content');

        letraBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const letra = this.getAttribute('data-letra');
                
                letraBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const verbetesLetra = dicionario[letra] || [];
                mostrarVerbetes(verbetesLetra, letra);
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
            '1samuel': '1samuel', // Assumindo que a referência é "1Samuel 1:1"
            '2samuel': '2samuel', // Assumindo que a referência é "2Samuel 1:1"
            '1reis': '1reis',     // Assumindo que a referência é "1Reis 1:1"
            '2reis': '2reis',     // Assumindo que a referência é "2Reis 1:1"
            '1crônicas': '1cronicas', // Assumindo que a referência é "1Crônicas 1:1"
            '2crônicas': '2cronicas', // Assumindo que a referência é "2Crônicas 1:1"
            'esdras': 'esdras',
            'neemias': 'neemias',
            'ester': 'ester',

            // Livros Poéticos e Sapienciais
            'jó': 'jo', // Abreviação comum para nome de arquivo
            'salmos': 'salmos',
            'provérbios': 'proverbios',
            'eclesiastes': 'eclesiastes',
            'cantares': 'cantares', // "Cantares de Salomão" ou "Cântico dos Cânticos", chave como "cantares"
            'cânticos': 'cantares', // Alias para Cântico dos Cânticos

            // Profetas Maiores
            'isaías': 'isaias',
            'jeremias': 'jeremias',
            'lamentações': 'lamentacoes', // "Lamentações de Jeremias"
            'ezequiel': 'ezequiel',
            'daniel': 'daniel',

            // Profetas Menores
            'oseias': 'oseias', // Ou 'oséias': 'oseias' se a acentuação variar na entrada
            'joel': 'joel',
            'amós': 'amos',
            'obadias': 'obadias',
            'jonas': 'jonas',
            'miqueias': 'miqueias', // Ou 'miquéias': 'miqueias'
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
            'atos': 'atos', // "Atos dos Apóstolos"

            // Epístolas Paulinas
            'romanos': 'romanos',
            '1coríntios': '1corintios', // Assumindo que a referência é "1Coríntios 1:1"
            '2coríntios': '2corintios', // Assumindo que a referência é "2Coríntios 1:1"
            'gálatas': 'galatas',
            'efésios': 'efesios',
            'filipenses': 'filipenses',
            'colossenses': 'colossenses',
            '1tessalonicenses': '1tessalonicenses',
            '2tessalonicenses': '2tessalonicenses',
            '1timóteo': '1timoteo',
            '2timóteo': '2timoteo',
            'tito': 'tito',
            'filemom': 'filemom', // Ou 'filémon': 'filemon'

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
            'apocalipse': 'apocalips' // Já existia, mantido
        };

            const livro = livroMap[livroNome] || livroNome.replace(/[^a-z0-9]/g, '');
            const filePath = `/version/arc/${livro}/${capitulo}.html`;

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

                    const newWindow = window.open('', 'ReferenciaBiblica', 
                        'width=550,height=350,scrollbars=no,resizable=yes,menubar=no,toolbar=no,location=no,status=no');
                    
                    newWindow.document.write(`
                        <!DOCTYPE html>
                        <html lang="pt-br">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>${partes[0]} ${capitulo}:${versiculoInicio}${versiculoInicio !== versiculoFim ? '-' + versiculoFim : ''}</title>
                            <style>
                                body {
                                    margin: 0;
                                    padding: 0;
                                    background-color: #181818;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    height: 100vh;
                                    overflow: hidden;
                                    font-family: sans-serif;
                                }
                                .referencia-window {
                                    width: 500px;
                                    max-height: 80vh;
                                    background-color: #181818;
                                    border: 2px solid #d4ac0d;
                                    border-radius: 10px;
                                    padding: 25px;
                                    box-shadow: 0 0 25px rgba(0,0,0,0.7);
                                    overflow: hidden;
                                    display: flex;
                                    flex-direction: column;
                                }
                                .referencia-header {
                                    color: #4CAF50;
                                    text-align: center;
                                    font-weight: bold;
                                    font-style: italic;
                                    font-size: 1.5em;
                                    margin-bottom: 20px;
                                    padding-bottom: 10px;
                                    border-bottom: 1px solid #d4ac0d;
                                }
                                .versiculos-container {
                                    color: #d4ac0d;
                                    font-size: 1.1em;
                                    line-height: 1.8;
                                    overflow-y: auto;
                                    flex-grow: 1;
                                    padding: 10px;
                                    text-align: justify;
                                }
                                .versiculos-container::-webkit-scrollbar {
                                    display: none;
                                }
                                .versiculo {
                                    margin-bottom: 15px;
                                    display: flex;
                                }
                                .versiculo-num {
                                    font-weight: bold;
                                    color: #4CAF50;
                                    min-width: 25px;
                                }
                                .versiculo-texto {
                                    font-style: italic;
                                }
                                .watermark {
                                    position: fixed;
                                    top: 0;
                                    left: 0;
                                    width: 100%;
                                    height: 100%;
                                    background-image: url('../img/biblia.jpg');
                                    background-size: cover;
                                    background-position: center;
                                    opacity: 0.1;
                                    pointer-events: none;
                                    z-index: -1;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="referencia-window">
                                <div class="referencia-header">${partes[0]} ${capitulo}:${versiculoInicio}${versiculoInicio !== versiculoFim ? '-' + versiculoFim : ''}</div>
                                <div class="versiculos-container">
                                    ${versiculosHTML}
                                </div>
                            </div>
                            <div class="watermark"></div>
                        </body>
                        </html>
                    `);
                    newWindow.document.close();
                    
                    // Ajusta o tamanho após o carregamento
                    setTimeout(() => {
                        const contentHeight = newWindow.document.querySelector('.versiculos-container').scrollHeight;
                        const windowHeight = Math.min(contentHeight + 120, 600);
                        newWindow.resizeTo(550, windowHeight);
                    }, 100);
                })
                .catch(error => {
                    console.error('Erro ao carregar os versículos:', error);
                    alert('Não foi possível carregar os versículos: ' + error.message);
                });
        }

        searchBtn.addEventListener('click', realizarBusca);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                realizarBusca();
            }
        });

        document.querySelector('.letra-btn[data-letra="A"]').click();
    }
});