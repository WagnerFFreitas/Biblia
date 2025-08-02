console.log("[slide_harpacantor_interface.js] Script iniciado.");

function gerarHtmlJanelaHino(hinoData) {
    const estrofesArray = hinoData.letra
        .split(/\n{2,}/)
        .filter(e => e.trim() !== '')
        .map(estrofe => estrofe.trim());

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Slide - ${hinoData.titulo}</title>
    <style>
        /* ESTILOS INCORPORADOS PARA GARANTIR CARREGAMENTO */
        html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            font-family: sans-serif;
            background-color: #181818;
            color: white;
            position: relative;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            box-sizing: border-box;
        }
        
        body::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(10, 10, 10, 0.85);
            z-index: 1;
        }
        
        #slide-container {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            height: 100vh;
            width: 100%;
            box-sizing: border-box;
            position: relative;
            z-index: 2;
        }
        
        #slide-header {
            background-color: rgba(0, 0, 0, 0.6);
            width: 100%;
            padding: 0.75rem 0;
            text-align: center;
            font-size: clamp(1.2rem, 3vw, 2rem);
            font-weight: bold;
            font-style: italic;
            text-transform: uppercase;
            margin: 0;
            box-sizing: border-box;
            flex-shrink: 0;
            z-index: 3;
        }
        
        #slide-titulo {
            color: #f1c40f;
            margin: 0;
        }
        
        #slide-progresso {
            color: #cccccc;
            font-size: clamp(0.9rem, 1.5vw, 1.5rem);
            margin-top: 0.5vh;
        }
        
        #slide-conteudo {
            width: 95%;
            text-align: center;
            flex-grow: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3;
            padding: 1rem;
            box-sizing: border-box;
            overflow-y: auto;
        }
        
        .estrofe-texto {
            text-align: center;
            font-size: clamp(2rem, 2.82vw, 5rem);
            max-width: 100%;
            overflow-wrap: break-word;
            line-height: 1.3;
            font-weight: bold;
            font-style: italic;
            font-family: "Arial Black", Gadget, sans-serif;
            z-index: 3;
            padding: 1.5rem;
            background-color: rgba(0, 0, 0, 0.4);
            border-radius: 10px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
            animation: fadeIn 0.5s ease-out;
        }
        
        .estrofe-texto.coro {
            color: #5df565;
            font-style: italic;
        }
        
        #controles {
            width: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            padding: 0.5rem 1.2rem;
            box-sizing: border-box;
            flex-shrink: 0;
            z-index: 3;
        }
        
        #btn-anterior, #btn-proximo {
            border: none;
            padding: 0.6rem 1.5rem;
            font-size: clamp(0.9rem, 1.2vw, 1.2rem);
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            min-width: 120px;
            text-align: center;
        }
        
        #btn-anterior {
            background-color: #f1c40f;
            color: black;
        }
        
        #btn-proximo {
            background-color: #f1c40f;
            color: black;
        }
        
        #btn-anterior:not(:disabled):hover {
            background-color: #d4ac0d;
            color: white;
        }
        
        #btn-proximo:not(:disabled):hover {
            background-color: #d4ac0d;
            color: white;
        }
        
        #btn-anterior:disabled, #btn-proximo:disabled {
            background-color: #333333;
            color: #888888;
            cursor: not-allowed;
            opacity: 0.6;
        }
        
        #marcadagua {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('../img/biblia.png');
            opacity: 0.15;
            z-index: 1;
            pointer-events: none;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>
    <div id="marcadagua"></div>
    
    <div id="slide-container">
        <header id="slide-header">
            <h1 id="slide-titulo"></h1>
            <p id="slide-progresso"></p>
        </header>
        <main id="slide-conteudo"></main>
    </div>
    <div id="controles">
        <button id="btn-anterior">‹ Anterior</button>
        <button id="btn-proximo">Próximo ›</button>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const tituloEl = document.getElementById('slide-titulo');
            const progressoEl = document.getElementById('slide-progresso');
            const conteudoEl = document.getElementById('slide-conteudo');
            const btnAnterior = document.getElementById('btn-anterior');
            const btnProximo = document.getElementById('btn-proximo');
            
            const hino = ${JSON.stringify(hinoData)};
            const estrofes = ${JSON.stringify(estrofesArray)};
            let indiceAtual = 0;

            function exibirEstrofe() {
                if (estrofes.length === 0) {
                    conteudoEl.innerHTML = "<p>Nenhuma estrofe encontrada</p>";
                    return;
                }
                
                const estrofeTexto = estrofes[indiceAtual];
                const isCoro = estrofeTexto.toLowerCase().includes('[coro]');
                const textoLimpo = estrofeTexto.replace(/\\[coro\\]/ig, '').trim();
                const textoFormatado = textoLimpo.split('\\n').join('<br>');
                
                conteudoEl.innerHTML = \`<div class="estrofe-texto \${isCoro ? 'coro' : ''}">\${textoFormatado}</div>\`;
                progressoEl.textContent = \`Estrofe \${indiceAtual + 1} de \${estrofes.length}\`;
                
                btnAnterior.disabled = (indiceAtual === 0);
                btnProximo.disabled = (indiceAtual === estrofes.length - 1);
            }

            function proximaEstrofe() {
                if (indiceAtual < estrofes.length - 1) {
                    indiceAtual++;
                    exibirEstrofe();
                }
            }

            function estrofeAnterior() {
                if (indiceAtual > 0) {
                    indiceAtual--;
                    exibirEstrofe();
                }
            }

            tituloEl.textContent = \`\${hino.numero} - \${hino.titulo}\`;
            exibirEstrofe();
            
            btnProximo.addEventListener('click', proximaEstrofe);
            btnAnterior.addEventListener('click', estrofeAnterior);
            
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
                    e.preventDefault();
                    proximaEstrofe();
                } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                    e.preventDefault();
                    estrofeAnterior();
                }
            });
        });
    <\/script>
</body>
</html>`;
}

function escreverHtmlNaJanela(janela, html) {
    janela.document.open();
    janela.document.write(html);
    janela.document.close();
    console.log("[Interface] Conteúdo escrito na janela do slide.");
}

window.gerarHtmlJanelaHino = gerarHtmlJanelaHino;
window.escreverHtmlNaJanela = escreverHtmlNaJanela;