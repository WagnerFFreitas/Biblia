// ====================== INÍCIO DO BLOCO A SER REMOVIDO ======================

    const listaLivrosBiblia = [                       // Este bloco lista dos livros da Bíblia
        'genesis',
        'exodo',
        'levitico',
        'numeros',
        'deuteronomio',
        'josue',
        'juizes',
        'rute', 
        '1samuel',
        '2samuel',
        '1reis',
        '2reis',
        '1cronicas',
        '2cronicas',
        'esdras',
        'neemias',
        'ester',
        'jo',
        'salmos',
        'proverbios',
        'eclesiastes',
        'cantares',
        'isaias',
        'jeremias',
        'lamentacoes',
        'ezequiel',
        'daniel',
        'oseias',
        'joel',
        'amos',
        'obadias',
        'jonas',
        'miqueias',
        'naum',
        'habacuque',
        'sofonias',
        'ageu',
        'zacarias',
        'malaquias',
        'mateus',
        'marcos',
        'lucas',
        'joao',
        'atos',
        'romanos',
        '1corintios',
        '2corintios',
        'galatas',
        'efesios',
        'filipenses',
        'colossenses',
        '1tessalonicenses',
        '2tessalonicenses',
        '1timoteo',
        '2timoteo', 
        'tito',
        'filemom',
        'hebreus',
        'tiago',
        '1pedro',
        '2pedro',
        '1joao',
        '2joao',
        '3joao',
        'judas',
        'apocalipse'
    ];

    const cacheNumeroCapitulos = {};                                        // Objeto para armazenar o número de capítulos de cada livro em cache

    // Este bloco verifica se um capítulo existe, ex: Gênesis 1; retorna true ou false.
    async function capituloExistentes(livro, capitulo) {
        try {
            let versaoAtual = 'ara';
            if (typeof window.obterPreferencia === 'function') {
                const v = window.obterPreferencia('versaoBiblicaSelecionada', 'ara');
                if (typeof v === 'string' && v.length > 0) versaoAtual = v;
            }
            const versoesQueUsamHtml = ['arc'];
            const ehVersaoHtml = versoesQueUsamHtml.includes(versaoAtual.toLowerCase());
            const caminho = ehVersaoHtml ?
                `../versao/${versaoAtual.toLowerCase()}/${livro.toLowerCase()}/${capitulo}.html` :
                `../versao/${versaoAtual.toLowerCase()}/${livro.toLowerCase()}/${capitulo}.json`;

            const resposta = await fetch(caminho, { method: 'HEAD' });
            return resposta.ok;
        } catch (error) {
            console.error(`Erro ao verificar capítulo ${livro} ${capitulo}:`, error);
            return false;
        }
    }

    // Este bloco conta o número de capítulos de um livro, usando cache para otimizar.
    async function obterContagemCapitulosLivro(livro) {
        const chaveLivro = livro.toLowerCase();
        // Usa o cache global do módulo de cache corretamente (capítulo 0 = contagem)
        const cacheCap = window.obterCapítuloDoCache(chaveLivro, 0);
        if (cacheCap) return cacheCap;
        if (window.livros && window.livros[chaveLivro] && window.livros[chaveLivro].capitulos) {
            window.cacheCapítulo(chaveLivro, 0, window.livros[chaveLivro].capitulos);
            return window.livros[chaveLivro].capitulos;
        }
        console.warn(`[Capítulos] Contagem para ${livro} não encontrada em 'window.livros'. Tentando descobrir...`);
        let maximoCapitulo = 0;
        for (let capitulo = 1; capitulo <= 150; capitulo++) {
            if (await capituloExistentes(chaveLivro, capitulo)) maximoCapitulo = capitulo;
            else break;
        }
        window.cacheCapítulo(chaveLivro, 0, maximoCapitulo);
        return maximoCapitulo;
    }
    window.obterContagemCapitulosLivro = obterContagemCapitulosLivro; // Torna global para módulos externos
    
    // Este bloco encontra o próximo livro e capítulo, ex: Gênesis 50 → Êxodo 1.
    window.obterProximoLivroECapitulo = async function(livroAtual, capituloAtual) {
        const indiceLivroAtual = listaLivrosBiblia.indexOf(livroAtual.toLowerCase());
        if (indiceLivroAtual === -1) return null;
        const numCapitulosLivro = await obterContagemCapitulosLivro(livroAtual);
        if (capituloAtual < numCapitulosLivro) {
             return { livro: livroAtual, capitulo: capituloAtual + 1 };
        }
        if (indiceLivroAtual < listaLivrosBiblia.length - 1)
            return { livro: listaLivrosBiblia[indiceLivroAtual + 1], capitulo: 1 };
        return null;
    };

    // Este bloco encontra o livro e capítulo anterior, ex: Êxodo 1 → Gênesis 50.
    window.obterLivroCapituloAnterior = async function(livroAtual, capituloAtual) {
        if (capituloAtual > 1) {
            return { livro: livroAtual, capitulo: capituloAtual - 1 };
        }
        const indiceLivroAtual = listaLivrosBiblia.indexOf(livroAtual.toLowerCase());
        if (indiceLivroAtual <= 0) return null;
        const livroAnterior = listaLivrosBiblia[indiceLivroAtual - 1];
        const ultimoCapituloLivroAnterior = await obterContagemCapitulosLivro(livroAnterior);
        return { livro: livroAnterior, capitulo: ultimoCapituloLivroAnterior };
    };

