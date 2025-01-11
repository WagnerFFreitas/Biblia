
#### Inicio do projeto: Agosto de 2024 
#### Documentação do Projeto Bíblia Sagrada - Lógica e Recursos

Este projeto é uma aplicação web interativa para leitura da Bíblia Sagrada, com foco em uma experiência amigável, intuitiva e completa para o usuário. A aplicação utiliza JavaScript para gerenciar a interação do usuário e exibir o conteúdo dinamicamente, proporcionando uma experiência rica e envolvente. 

Todo o projeto foi feito sem qualquer ferramenta de framework, pois a ideia era que exercitasse melhor o que aprendi e fixasse melhor toda a estrutura e os comandos utilizado no projeto.

#### Visão Geral:

O projeto "Bíblia Sagrada" tem como objetivo oferecer uma ferramenta online completa e acessível para leitura e estudo da Bíblia Sagrada, além de conteúdos complementares como Harpa Cristã, Hinário Batista, Dicionário Bíblico e Concordância. A aplicação foi desenvolvida para proporcionar uma navegação intuitiva entre livros, capítulos e versículos, permitindo ao usuário explorar o conteúdo de forma prática e eficiente.

Estão disponíveis diferentes versões da Bíblia, incluindo a Almeida Revista e Atualizada (ARA), Almeida Atualizada (AA), Almeida Corrigida e Fiel (ACF), Almeida Revisada e Corrigida (ARC), Almeida Revista e Atualizada (RA), Nova Versão Internacional (NVI), Bíblia Católica Vulgata Latina e também a versão no original com texto literário e a tradução. Além disso, o projeto conta com recursos adicionais, como a projeção de versículos para Datashow, a possibilidade de baixar os conteúdos para estudo offline e acesso a utilidades extras, como links e cursos temáticos, ampliando as funcionalidades para atender a diversas necessidades, concordância Bíblica permitindo que o usuário encontre versículos que contenham uma palavra ou frase específica e o dicionário Bíblico,

#### Lógica da Aplicação:

## 1. Organização do Conteúdo:

* **Estrutura baseada em Arquivos:** A Bíblia é organizada em livros, cada um dividido em capítulos. Para a versão ARC (Almeida Revista e Corrigida), o conteúdo de cada capítulo é armazenado em arquivos HTML individuais, organizados em pastas específicas para cada livro (exemplo: /genesis/1.html para o capítulo 1 de Gênesis). Essa organização facilita a manutenção e a atualização do conteúdo, permitindo um carregamento eficiente e dinâmico dos capítulos.
Para as demais versões da Bíblia, como ARA (Almeida Revista e Atualizada) e NVI (Nova Versão Internacional), assim como para a Harpa Cristã e o Cantor Cristão, os dados são armazenados em arquivos JSON. Cada arquivo contém as informações completas de um livro ou coleção, estruturadas para que o código JavaScript possa processar e exibir o conteúdo dinamicamente. Essa abordagem híbrida permite flexibilidade na gestão dos diferentes formatos e versões.

**Gerenciamento de Dados:**

O código JavaScript utiliza um sistema eficiente para acessar e manipular os dados armazenados nos arquivos HTML e JSON. Ele mantém um registro completo de livros, capítulos e versículos, permitindo uma navegação fluida e intuitiva. O uso de JSON para algumas versões e conteúdos complementares também facilita a integração com outras funcionalidades, como pesquisa e exportação de dados.

**Estrutura de Pastas do Projeto:**

A organização do projeto segue uma estrutura bem definida:

    • A versão ARC utiliza pastas específicas para cada livro, contendo os capítulos em arquivos HTML (ex: /genesis/1.html para o capítulo 1 de Gênesis). Essa organização em arquivos facilita a manutenção e a atualização do conteúdo da Bíblia, e permite um carregamento dinâmico e eficiente dos capítulos.

    • As demais versões e conteúdos estão centralizados na pasta json/, onde cada arquivo corresponde a um livro ou coleção.

Biblia/
│
├── index.html (Página principal do projeto)
├── style.css (Estilos gerais do projeto)
├── script.js (Script gerais do projeto)
├── README.md (Documentação do projeto)
├── LICENSE (Licença do projeto)
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
├── script/
│   ├── original.js (Script da Bíblia em original)
│   ├── arc.js (Script da Bíblia ARC)
│   ├── ara.js (Script da Bíblia ARA)
│   ├── acf.js (Script da Bíblia ACF)
│   ├── aa.js (Script da Bíblia AA)
│   ├── ra.js (Script da Bíblia RA)
│   ├── nvi.js (Script da Bíblia NVI)
│   └── cantor_cristao.css (Estilo do Cantor Cristão)
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
│   ├── ...                (Demais capítulos)
├── ..... (Demais livros e capítulos)
├── json/
│   ├── ara.json            (JSON para o livro de Gênesis - ARA)
│   ├── nvi.json            (JSON para o livro de Gênesis - NVI)
│   ├── ...                 (Outros livros e versões)

#### 2. Menu Interativo de Livros:

* **Navegação Intuitiva:** A interface principal da aplicação apresenta um menu lateral com uma lista organizada de todos os livros da Bíblia. Essa lista é organizada de forma lógica e intuitiva, permitindo que o usuário encontre facilmente o livro desejado. 

* **Carregamento Dinâmico:** Ao clicar em um livro, a aplicação consulta os dados armazenados e exibe dinamicamente os botões de capítulos correspondentes ao livro selecionado. Essa dinâmica oferece uma experiência rápida e interativa ao usuário, sem necessidade de recarregar a página.

#### 3. Navegação por Capítulos:

* **Visualização Fluida:** O usuário pode navegar entre os capítulos da Bíblia com facilidade, utilizando 
os botões de capítulo gerados dinamicamente para cada livro. 

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

**Exemplos de Uso:**

- Apresentação de versículos em reuniões ou estudos em grupo.
- Exibição de hinos durante eventos.

#### 6. Leitura de Hinos

**Harpa Cristã e Hinário Batista:** A aplicação permite a leitura de hinos de ambos os hinários, com a mesma interface intuitiva.

#### 7. Conclusão:

A aplicação Bíblia Sagrada é uma ferramenta útil e completa para a leitura, estudo e compartilhamento da Bíblia, oferecendo uma interface interativa e recursos que facilitam a navegação e a compreensão do conteúdo. A funcionalidade "Slide" para data-show torna a aplicação ainda mais versátil, permitindo a exibição do conteúdo bíblico em eventos e apresentações. O suporte para a leitura de hinos da Harpa Cristã e do Hinário Batista amplia a abrangência da aplicação, tornando-a uma ferramenta completa para o estudo e a prática da fé.

#### 8. Instruções de Uso

1º. **Clonar o Repositório**:

    ```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git
    ```
2º. **Abrir o Projeto**: Abra o projeto em seu editor de código preferido (recomendado: Visual Studio Code).

3º. **Estrutura de Arquivos**:

    - `index.html`: Página principal da aplicação.
    - `styles.css`: Arquivo de estilos CSS.
    - `menu.js`: Script para manipulação do menu de livros.
    - `contato.js`: Script para manipulação do contato.
    - `sobre.js`: Script para manipulação da seção sobre.
    - `slide.js`: Script para manipulação de slides (se aplicável).
    - `/Livros`: Pasta contendo os arquivos JSON de cada livro da Bíblia.
    - `/genesis`: Pasta contendo os arquivos HTML dos capítulos do livro de Gênesis.

#### 9. Exemplo de Arquivo JSON

```json
{
    "book": "Genesis",
    "chapters": [
        {
            "chapter": 1,
            "verses": [
                {"number": 1, "title": "A Criação do Mundo", "verse": "No princípio criou Deus os céus e a terra."},
                {"number": 2, "verse": "A terra era sem forma e vazia; e havia trevas sobre a face do abismo, mas o Espírito de Deus pairava sobre a face das águas."},
                {"number": 3, "verse": "Disse Deus: haja luz. E houve luz."},
                {"number": 4, "verse": "Viu Deus que a luz era boa; e fez separação entre a luz e as trevas."},
                {"number": 5, "verse": "E Deus chamou à luz dia, e às trevas noite. E foi a tarde e a manhã, o dia primeiro."},
                {"number": 6, "verse": "E disse Deus: haja um firmamento no meio das águas, e haja separação entre águas e águas."}
                // ... outros versículos ...
            ]
        }
        // ... outros capítulos ...
    ]
}

#### 10. Contribuição

**Se você deseja contribuir para este projeto, por favor, siga os passos abaixo:
**

1º. Faça um fork do repositório.
2º. Crie uma nova branch (git checkout -b feature/nova-funcionalidade).
3º. Faça suas alterações e commit (git commit -am 'Adiciona nova funcionalidade').
4º. Envie para o branch (git push origin feature/nova-funcionalidade).
5º. Abra um Pull Request.

#### 11. Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo LICENSE para mais detalhes.

#### 12. Contato

Para mais informações, entre em contato pelo e-mail: wagnerffreitas1973@gmail.com.


*-----------------*------------------*

#### Pontos de Melhoria para o futuro:

- **Busca Avançada:** Busca por palavras-chave e filtros, como livros, capítulos e versículos
que permitem aos usuários encontrar o texto específico na Bíblia.

- **Leitura em Áudio:** Opção para ouvir a leitura dos capítulos e versículos, tornando a aplicação ainda mais acessível.

- **Marcação de Versículos Favoritos:** Salvar versículos favoritos para acesso rápido.

- **Compartilhamento de Versículos:** Opção de compartilhar versículos em redes sociais e e-mail ou outras plataformas, facilitando a evangelização de amigos e familiares e também de outra pessoal que não conhecem a palavra de Deus.

- **Integração com Dispositivos Móveis:** Desenvolvimento de aplicativos móveis para acesso em qualquer lugar.

* **Interface de Usuário Modernizada:** Re-projetar a interface da aplicação para torná-la mais moderna e amigável, com foco na usabilidade em dispositivos móveis.

* **Notas e Comentários:** A aplicação pode exibir notas e comentários sobre o texto bíblico, fornecendo informações adicionais para o estudo.

* **API:** Criação de uma API;

* **Banco de Dados:** Criação de uma banco de dados em uma versão futura


---------*----------
Verificar

Bíblia Almeida Revista e Atualizada (ARA) ok
Bíblia de Jerusalém (BJ)
Nova Versão Internacional (NVI) ok
Bíblia King James (KJV)
Bíblia em Linguagem de Hoje (BLH)
Nova Tradução na Linguagem de Hoje (NTLH) ok
Bíblia Católica Pastoral (BCP)
Bíblia de Estudo MacArthur (BEM)
Nova Almeida Atualizada (NAA)
Bíblia Sociedade Bíblica (BSB)
Bíblia Septuaginta (LXX)
Almeida Revista e Corrigida (ARC) ok
Almeida Corrigida e Fiel (ACF) ok
Almeida Atualizada (AA) ok
Almeida Revista e Atualizada (RA) ok

