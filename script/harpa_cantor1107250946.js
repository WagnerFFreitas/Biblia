// biblia/script/harpa_cantor.js

document.addEventListener('DOMContentLoaded', () => {
    const btnHarpa = document.getElementById('btnHarpa');
    const btnCantor = document.getElementById('btnCantor');
    const telaInicial = document.getElementById('tela-inicial');
    const botoesHinosContainer = document.getElementById('botoes-hinos');
    const hinoExibidoContainer = document.getElementById('hino-exibido');
    const themeStyle = document.getElementById('theme-style');

    window.activeHinario = null;
    window.activeHinoData = null;

    const HINARIOS = {
        harpa: {
            nome: 'Harpa Cristã',
            total: 640,
            // CORREÇÃO: Caminho relativo da pasta /html para a raiz e depois para /harpacrista
            pasta: '../harpacrista',
            css: '../css/harpa_crista.css'
        },
        cantor: {
            nome: 'Cantor Cristão',
            total: 581,
            // CORREÇÃO: Caminho relativo da pasta /html para a raiz e depois para /cantorcristao
            pasta: '../cantorcristao',
            css: '../css/cantor_cristao.css'
        }
    };

    function selecionarHinario(hinario) {
        window.activeHinario = hinario;
        window.activeHinoData = null;
        telaInicial.style.display = 'none';
        botoesHinosContainer.innerHTML = '';
        hinoExibidoContainer.innerHTML = '';
        themeStyle.href = hinario.css;
        
        for (let i = 1; i <= hinario.total; i++) {
            const btn = document.createElement('button');
            btn.className = 'botao-capitulo';
            btn.textContent = i;
            btn.addEventListener('click', () => exibirHino(hinario.pasta, i));
            botoesHinosContainer.appendChild(btn);
        }
        botoesHinosContainer.style.display = 'grid';
    }
    
    async function exibirHino(pasta, numero) {
        try {
            const response = await fetch(`${pasta}/${numero}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            window.activeHinoData = data;
            
            let letraHtml = data.letra.split('\n\n').map(p => {
                const isCoro = p.toLowerCase().includes('[coro]');
                const cleanParagraph = p.replace(/\[coro\]/ig, '').trim();
                const versos = cleanParagraph.split('\n').join('<br>');
                return `<p class="${isCoro ? 'coro' : ''}">${versos}</p>`;
            }).join('');

            hinoExibidoContainer.innerHTML = `
                <div class="hino-container">
                    <h3 class="hino-titulo">${data.numero} - ${data.titulo}</h3>
                    <div class="hino-letra">${letraHtml}</div>
                </div>`;
            
            hinoExibidoContainer.scrollIntoView({ behavior: 'smooth' });

            if (window.abrirJanelaSlideHino) {
                window.abrirJanelaSlideHino(data);
            }

        } catch (error) {
            console.error('Erro ao carregar o hino:', error);
            window.activeHinoData = null;
            hinoExibidoContainer.innerHTML = `<div class="hino-container"><p>Não foi possível carregar o hino ${numero}.</p></div>`;
        }
    }

    btnHarpa.addEventListener('click', () => {
        selecionarHinario(HINARIOS.harpa);
        btnHarpa.classList.add('active');
        btnCantor.classList.remove('active');
    });

    btnCantor.addEventListener('click', () => {
        selecionarHinario(HINARIOS.cantor);
        btnCantor.classList.add('active');
        btnHarpa.classList.remove('active');
    });
});