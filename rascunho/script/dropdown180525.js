(function () {
    'use strict';

    console.log("[dropdown.js] Script iniciado.");

    // --- DADOS PARA OS MENUS ---
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

    const versoes = [
        { texto: 'Versão 1', link: '#' },
        { texto: 'Versão 2', link: '#' }
    ];

    const dicionario = [
        { texto: 'Dicionário 1', link: '#' },
        { texto: 'Dicionário 2', link: '#' }
    ];

    const harpaHinario = [
        { texto: 'Hinário 1', link: '#' },
        { texto: 'Hinário 2', link: '#' }
    ];

    const utilidades = [
        { texto: 'IA Ajudar a estudar a bíblia', link: 'https://bible.ai/pt' },
        { texto: 'Posso conhecer a Deus', link: 'https://caniknowgod.com/' },
        { texto: 'Dicionário e Comentário<br> de toda a Bíblia', link: 'https://www.apologeta.com.br' },
        { texto: 'BíbliaOn', link: 'https://www.bibliaon.com/' },
        { texto: 'Cursos', link: 'html/cursos.html' }
    ];

    function populateList(listId, items) {
        const listElement = document.getElementById(listId);
        if (!listElement) {
            console.warn(`[dropdown.js] Elemento com ID '${listId}' não encontrado.`);
            return;
        }

        items.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.link;
            a.innerHTML = item.texto;
            a.target = '_blank';
            li.appendChild(a);
            listElement.appendChild(li);
        });
    }

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

    document.addEventListener('DOMContentLoaded', () => {
        console.log("[dropdown.js] DOM carregado, populando listas...");

        populateList('Baixar', downloads);
        populateList('versoes-list', versoes);
        populateList('dicionario-list', dicionario);
        populateList('harpa-hinario-list', harpaHinario);
        populateList('utilidades-list', utilidades);

        document.querySelectorAll('.dropdown').forEach(dropdown => {
            const listId = dropdown.querySelector('.dropdown-content')?.id;
            if (!listId) return;

            dropdown.addEventListener('mouseenter', () => showList(listId));
            dropdown.addEventListener('mouseleave', () => {
                setTimeout(() => {
                    if (!dropdown.matches(':hover') && !document.getElementById(listId).matches(':hover')) {
                        hideList(listId);
                    }
                }, 200);
            });

            document.getElementById(listId).addEventListener('mouseenter', () => showList(listId));
            document.getElementById(listId).addEventListener('mouseleave', () => {
                setTimeout(() => {
                    if (!dropdown.matches(':hover') && !document.getElementById(listId).matches(':hover')) {
                        hideList(listId);
                    }
                }, 200);
            });
        });
    });

})();
