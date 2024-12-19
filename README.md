## Documentação do Projeto Bíblia Sagrada - Lógica e Recursos

Este projeto é uma aplicação web interativa para leitura da Bíblia Sagrada, com foco em uma experiência amigável, intuitiva e completa para o usuário. A aplicação utiliza JavaScript para gerenciar a interação do usuário e exibir o conteúdo dinamicamente, proporcionando uma experiência rica e envolvente. 

### Visão Geral:
O projeto "Bíblia Sagrada" tem como objetivo oferecer uma ferramenta online completa e acessível para leitura e estudo da Bíblia Sagrada, além de conteúdos complementares como Harpa Cristã, Hinário Batista, Dicionário Bíblico e Concordância. A aplicação foi desenvolvida para proporcionar uma navegação intuitiva entre livros, capítulos e versículos, permitindo ao usuário explorar o conteúdo de forma prática e eficiente.
Estão disponíveis diferentes versões da Bíblia, incluindo a Almeida Revista e Atualizada (ARA), Almeida Atualizada (AA), Almeida Corrigida e Fiel (ACF), Almeida Revisada e Corrigida (ARC), Almeida Revista e Atualizada (RA), Nova Versão Internacional (NVI), Bíblia Católica Vulgata Latina e também a versão no original com a tradução. Além disso, o projeto conta com recursos adicionais, como a projeção de versículos para Datashow, a possibilidade de baixar os conteúdos para estudo offline e acesso a utilidades extras, como links e cursos temáticos, ampliando as funcionalidades para atender a diversas necessidades.

### Lógica da Aplicação:

#### 1. Organização do Conteúdo:

* **Estrutura baseada em Arquivos:** A Bíblia é organizada em livros, cada um dividido em capítulos. Para a versão ARC (Almeida Revista e Corrigida), o conteúdo de cada capítulo é armazenado em arquivos HTML individuais, organizados em pastas específicas para cada livro (exemplo: /genesis/1_arc.html para o capítulo 1 de Gênesis). Essa organização facilita a manutenção e a atualização do conteúdo, permitindo um carregamento eficiente e dinâmico dos capítulos.
Para as demais versões da Bíblia, como ARA (Almeida Revista e Atualizada) e NVI (Nova Versão Internacional), assim como para a Harpa Cristã e o Cantor Cristão, os dados são armazenados em arquivos JSON. Cada arquivo contém as informações completas de um livro ou coleção, estruturadas para que o código JavaScript possa processar e exibir o conteúdo dinamicamente. Essa abordagem híbrida permite flexibilidade na gestão dos diferentes formatos e versões.

**Gerenciamento de Dados:**
O código JavaScript utiliza um sistema eficiente para acessar e manipular os dados armazenados nos arquivos HTML e JSON. Ele mantém um registro completo de livros, capítulos e versículos, permitindo uma navegação fluida e intuitiva. O uso de JSON para algumas versões e conteúdos complementares também facilita a integração com outras funcionalidades, como pesquisa e exportação de dados.

**Estrutura de Pastas do Projeto:**
A organização do projeto segue uma estrutura bem definida:
    • A versão ARC utiliza pastas específicas para cada livro, contendo os capítulos em arquivos HTML.
    • As demais versões e conteúdos estão centralizados na pasta json/, onde cada arquivo corresponde a um livro ou coleção.

#### 2. Menu Interativo de Livros:

* **Navegação Intuitiva:** A interface principal da aplicação apresenta um menu lateral com uma lista organizada de todos os livros da Bíblia. Essa lista é organizada de forma lógica e intuitiva, permitindo que o usuário encontre facilmente o livro desejado. 

* **Carregamento Dinâmico:** Ao clicar em um livro, a aplicação consulta os dados armazenados e exibe dinamicamente os botões de capítulos correspondentes ao livro selecionado. Essa dinâmica oferece uma experiência rápida e interativa ao usuário, sem necessidade de recarregar a página.

#### 3. Navegação por Capítulos:

* **Visualização Fluida:** O usuário pode navegar entre os capítulos da Bíblia com facilidade, utilizando os botões de capítulo gerados dinamicamente para cada livro. 

* **Carregamento de Conteúdo:** Ao clicar em um botão de capítulo, a aplicação busca o conteúdo do capítulo selecionado no arquivo HTML correspondente, utilizando uma técnica de requisição assíncrona (AJAX) para garantir que o conteúdo seja carregado de forma rápida e eficiente, sem interromper a navegação do usuário.
* **Exibição Organizada:** O conteúdo do capítulo é exibido na área de conteúdo principal da aplicação, com destaque para os versículos. Os versículos são numerados para facilitar a leitura e a navegação.

#### 4. Exibição de Versículos:

* **Leitura Simplificada:** Os versículos dentro de cada capítulo são exibidos de forma clara e organizada, facilitando a leitura e a compreensão do texto bíblico.

* **Destaque e Seleção:** O usuário pode selecionar um versículo específico, e o conteúdo do versículo escolhido é destacado, facilitando a leitura e o estudo do texto.

#### 5. Funcionalidade "Slide" para Datashow e Projetores:

* **Apresentação Imersiva:** A aplicação oferece a opção de abrir uma janela separada ("JanelaSlide") com uma interface simplificada e em tela cheia, ideal para apresentações em data-shows e projetores.

* **Controle da Apresentação:** O usuário pode selecionar o livro, capítulo e versículo desejado para a apresentação. A janela "Slide" exibe o conteúdo do versículo selecionado com destaque, facilitando a visualização do texto durante apresentações. 

* **Navegação Simplificada:** A janela "Slide" possui botões "VOLTAR" e "PRÓXIMO" para navegar entre os versículos, permitindo um controle preciso da apresentação e uma experiência fluida para o público.

* **Otimização para Projeção:** O layout da janela "Slide" é otimizado para projeção em telas maiores, com fontes e espaçamentos adequados, garantindo a legibilidade do texto em diferentes condições de iluminação e distância.


**Histórico do projeto**

Thu Oct 31 10:23:26 2024 -0300
Thu Oct 31 12:49:57 2024 -0300
Thu Oct 31 18:03:28 2024 -0300
Thu Oct 31 18:03:28 2024 -0300
Fri Nov 1 13:41:11 2024 -0300

Criação de modelos para a Bíblia em JSON 01/11/24 13:41
Configurando o estilo da lista da opção BAIXAR do menu superior 31/10/24 12:49
Formatando a lista da opção BAIXAR 31/10/24 10:23
Criação de modelos para a Bíblia em JSON 01/11/24 13:41.


Biblia/
│
├── index.html (Página principal do projeto)
├── style.css (Estilos gerais do projeto)
└── script.js (Script gerais do projeto)
│
├── html/
│   ├── original.html (Página da Bíblia em original)
│   ├── arc.html (Página da Bíblia ARC)
│   ├── ara.html (Página da Bíblia ARA)
│   ├── acf.html (Página da Bíblia ACF)
│   ├── aa.html (Página da Bíblia AA)
│   ├── ra.html (Página da Bíblia RA)
│   ├── nvi.html (Página da Bíblia NVI)
│   ├── harpa_crista.html (Página da Harpa Cristã)
│   ├── cantor_cristao.html (Página do Cantor Cristão)
│   └── cursos.html
│
├── css/
│   ├── original.css (Estilo da Bíblia em original)
│   ├── arc.css (Estilo da Bíblia ARC)
│   ├── ara.css (Estilo da Bíblia ARA)
│   ├── acf.css (Estilo da Bíblia ACF)
│   ├── aa.css (Estilo da Bíblia AA)
│   ├── ra.css (Estilo da Bíblia RA)
│   ├── nvi.css (Estilo da Bíblia NVI)
│   ├── harpa_crista.css (Estilo da Harpa Cristã)
│   ├── cantor_cristao.css (Estilo do Cantor Cristão)
│   └── cursos.css (Estilo da página de cursos)
│
├── script/
│   ├── original.js (Script da Bíblia em original)
│   ├── arc.js (Script da Bíblia ARC)
│   ├── ara.js (Script da Bíblia ARA)
│   ├── acf.js (Script da Bíblia ACF)
│   ├── aa.js (Script da Bíblia AA)
│   ├── ra.js (Script da Bíblia RA)
│   ├── nvi.js (Script da Bíblia NVI)
│   ├── harpa_crista.css (Estilo da Harpa Cristã)
│   └── cantor_cristao.css (Estilo do Cantor Cristão)
│
├── baixar/
│   ├── Bíblia Católica Vulgata Latina
│   ├── Bíblia Sagrada NVI
│   ├── Bíblia Viva
│   ├── Bíblia de Genebra
│   ├── Bíblia em ordem cronológica NVI
│   ├── Bíblia explicada
│   ├── Bíblia KJA
│   ├── Bíblia Palavra-Chave
│   └── Bíblia Thompson temas em cadeia
│
├── img/
│   ├── cursos.png
│   ├── biblia.png

├── genesis/
│   ├── 1_arc.html (Capítulo 1 de Gênesis - ARC)
│   ├── 2_arc.html (Capítulo 2 de Gênesis - ARC)
│   ├── 3_arc.html
│   ├── ...               (Demais capítulos)
├── exodo/
│   ├── 1_arc.html (Capítulo 1 de Êxodo - ARC)
│   ├── 2_arc.html (Capítulo 2 de Êxodo - ARC)
│   ├── 3_arc.html
│   ├── ...                (Demais capítulos)
├── ..... (Demais livros e capítulos)
│
├── json/
│   ├── ara.json            (JSON para o livro de Gênesis - ARA)
│   ├── nvi.json            (JSON para o livro de Gênesis - NVI)
│   ├── ...                 (Outros livros e versões)
