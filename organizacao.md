# Organização do Projeto

## Estrutura de Arquivos
```
biblia/
├── baixar/                  # PDFs e recursos para download
│   ├── A_Biblia_Catolica.pdf
│   ├── A_Biblia_Sagrada_NVT.pdf
│   ├── A_Biblia_Viva.pdf
│   └── ...
├── concordancia/            # Dados de concordância bíblica
│   ├── a.json, b.json, ...  # Concordância por letra
│   ├── a/ b/ ...            # Subpastas por letra com temas
│   ├── indexes/             # Indexadores de concordância
│   ├── rascunho/            # Arquivos de rascunho/teste
│   ├── themes/              # Temas bíblicos
│   └── words/               # Palavras-chave
├── css/                     # Arquivos de estilo
│   ├── capitulos.css
│   ├── concordancia.css
│   ├── cursos.css
│   ├── dicionario.css
│   ├── dicionario_concordancia.css
│   ├── modo_leitura.css
│   ├── slide_biblia.css
│   ├── style.css
│   ├── style_versoes.css
│   ├── versoes.css
│   └── ...
├── dicionario/              # Dados do dicionário bíblico
│   ├── a.json, b.json, ...
│   ├── rascunho/            # Rascunhos e testes
│   └── ...
├── html/                    # Páginas HTML
│   ├── concordancia.html
│   ├── cursos.html
│   ├── dicionario.html
│   ├── dicionario_concordancia.html
│   └── versoes.html
├── img/                     # Imagens e ícones
│   ├── acf.png, ara.png, ...
│   ├── biblia.png
│   ├── marcadagua.png
│   └── ...
├── json/                    # Dados auxiliares em JSON
│   ├── dicionario.json
│   ├── harpa_crista.json
│   └── ...
├── script/                  # Scripts JavaScript
│   ├── acf.js, ara.js, ...  # Scripts de versões
│   ├── biblia-navegacao.js
│   ├── config_dicionarioeconcordancia.js
│   ├── concordancia.js
│   ├── dicionario.js
│   ├── dicionario_concordancia.js
│   ├── dropdown.js
│   ├── dropdown_concordancia.js
│   ├── livros_capitulos.js
│   ├── marcadagua.js
│   ├── original.js
│   ├── slide_biblia_coordenador.js
│   ├── slide_biblia_dados.js
│   ├── slide_biblia_interface.js
│   ├── slide_biblia_janela.js
│   ├── slide_biblia_utils.js
│   ├── sobre.js
│   ├── versoes.js
│   ├── versoes_cache.js
│   ├── versoes_capitulos.js
│   ├── versoes_interface.js
│   ├── versoes_modoleitura.js
│   ├── versoes_navegacao.js
│   ├── versoes_navegacao_modoleitura.js
│   ├── versoes_versiculos.js
│   └── ...
├── versao/                  # Dados das versões bíblicas
│   ├── acf/ ara/ arc/ ...   # Subpastas por versão
│   │   ├── genesis/ ...     # Subpastas por livro
│   │   │   ├── 1.json ...   # Capítulos em JSON
│   │   └── ...
│   └── ...
├── index.html               # Página inicial
├── style.css                # Estilo principal
├── script.js                # Script principal
├── README.md                # Documentação geral
├── organizacao.md           # Organização do projeto (este arquivo)
├── documentacao.md          # Documentação complementar
├── projeto.md               # Planejamento e histórico
├── LICENSE                  # Licença do projeto
└── ...
```

## Organização dos Arquivos de Módulo de Versões (pasta /script/)

- Todos os arquivos de módulo relacionados a versões estão em `/script/` e seguem o padrão de nomes iniciando por `versoes`.
- Função de cada módulo:
  - **versoes.js**: Módulo principal de controle e listagem de versões da Bíblia.
  - **versoes_cache.js**: Gerencia o cache de dados das versões para otimizar carregamento.
  - **versoes_capitulos.js**: Funções para manipulação e navegação de capítulos das versões.
  - **versoes_interface.js**: Funções de interface e interação do usuário com as versões.
  - **versoes_modoleitura.js**: Gerencia o modo de leitura das versões.
  - **versoes_navegacao.js**: Funções para navegação entre diferentes versões.
  - **versoes_navegacao_modoleitura.js**: Navegação específica no modo leitura.
  - **versoes_versiculos.js**: Manipulação e exibição de versículos das versões.
  - **versoes copy.js**: (Arquivo auxiliar, possível backup ou rascunho).

- Todos seguem o padrão de comentários:
  - Blocos de seção centralizados.
  - Comentários de linha iniciando com o verbo da ação (Cria, Adiciona, Limpa, Busca, Define, etc).

Exemplo de bloco de comentário de seção:
```javascript
/*=====================================================*/
/*           FUNÇÕES DE MANIPULAÇÃO DE VERSÕES         */
/*=====================================================*/
```
Exemplo de comentário de linha:
```javascript
// Cria a função para adicionar uma nova versão
function adicionarVersao() {
    // Adiciona a versão ao array de versões
}
```

---

## Organização dos Arquivos de Módulo de Slide (pasta /script/)

- Todos os arquivos de módulo relacionados ao sistema de slides estão em `/script/` e seguem o padrão de nomes iniciando por `slide_biblia_`.
- Função de cada módulo:
  - **slide_biblia_dados.js**: Contém os dados bíblicos e informações utilizadas nos slides.
  - **slide_biblia_utils.js**: Funções utilitárias e auxiliares para manipulação de dados e lógica dos slides.
  - **slide_biblia_interface.js**: Responsável pela geração da interface HTML e integração visual do popup de slide.
  - **slide_biblia_janela.js**: Gerencia a criação, exibição e fechamento da janela/modal de slide.
  - **slide_biblia_coordenador.js**: Coordena a inicialização, integração e comunicação entre os módulos de slide.
- O carregamento e a ordem dos módulos são coordenados dinamicamente pelo arquivo `versoes.js`, garantindo que todas as dependências estejam disponíveis antes da inicialização do sistema de slides.
- Todos seguem o padrão de comentários:
  - Blocos de seção centralizados.
  - Comentários de linha iniciando com o verbo da ação (Cria, Adiciona, Limpa, Busca, Define, etc).

Exemplo de bloco de comentário de seção:
```javascript
/*=====================================================*/
/*           FUNÇÕES DE MANIPULAÇÃO DE SLIDES          */
/*=====================================================*/
```
Exemplo de comentário de linha:
```javascript
// Cria a função para exibir o slide popup
function exibirSlide() {
    // Adiciona o popup de slide à página
}
```

---

## Padrões Adotados em index.html, style.css e script.js

### HTML (`index.html`)
- **Estrutura semântica:** Utilize tags semânticas (`<header>`, `<footer>`, `<section>`, etc.) para organizar o conteúdo.
- **Identificação de elementos:** Use `id` e `class` descritivos e em português para facilitar a manipulação via CSS e JavaScript.
- **Comentários:**  
  - Utilize comentários claros para identificar blocos e funções de cada parte do HTML.
  - Blocos de seção com `<!------------------------------------------>` para separar seções principais.
  - Comentários de linha com `<!-- -->` para explicar elementos específicos.
  - Exemplo:
    ```html
    <!------------------------------------------>
    <!--        CONFIGURAÇÃO DO DOCUMENTO     -->
    <!------------------------------------------>
    <ul class='lista-versoes' id='lista'></ul> <!-- Lista de versões da Bíblia -->
    <!-- Este bloco é o pop-up de Boas-Vindas -->
    ```

### CSS (`style.css` e arquivos da pasta /css/)
- **Comentários de bloco:**  
  - Utilize blocos de comentários para separar e identificar grandes seções do CSS.
  - Padrão: `/*=====================================================*/` para delimitar seções.
  - Exemplo:
    ```css
    /*=====================================================*/
    /*                JANELA DE BOAS-VINDAS                */
    /*=====================================================*/
    ```
- **Comentários de linha:**  
  - Devem ser alinhados à direita, com o fechamento `*/` sempre na mesma coluna (padrão visual).
  - Após o texto do comentário, apenas um espaço antes do fechamento.
  - Exemplo:
    ```css
    padding: 0;                                 /* Remove espaçamentos internos padrão.                */
    ```
- **Nomenclatura:**  
  - Classes e ids devem ser descritivos e, preferencialmente, em português.
  - Imagens e seletores relacionados à marca d'água devem usar `marcadagua` (ex: `.marcadagua-image`).

### JavaScript (`script.js` e arquivos da pasta /script/)
- **Comentários de bloco:**  
  - Use blocos de comentários para separar grandes seções do código.
  - Padrão: `/*===============================================================================*/` para delimitar seções principais.
  - O cabeçalho do arquivo pode ser centralizado visualmente, com espaçamento extra para melhor estética.
  - Exemplo de cabeçalho centralizado:
    ```javascript
    /*===============================================================================*/
    /*                        SCRIPT DE CONCORDÂNCIA BÍBLICA                         */
    /*===============================================================================*/
    /*                   - Funções para carregar e exibir resultados da concordância */
    /*                   - Filtros por testamento, livro e palavra                   */
    /*                   - Busca global e renderização dinâmica                      */
    /*===============================================================================*/
    ```
- **Comentários de linha:**  
  - Devem ser alinhados para iniciar na coluna 86, à direita do código.
  - O texto do comentário deve ser claro, objetivo e iniciar com verbo de ação (Cria, Adiciona, Busca, Define, etc).
  - Comentários de linha podem ser usados ao lado de variáveis, funções ou comandos, sempre alinhados à direita.
  - Exemplo:
    ```javascript
    let filtroTestamentoAtual = 'todos';                                              // Variável de estado para o filtro de testamento. 'todos' é o valor padrão.
    ```
- **Introdução de funções e blocos internos:**
  - Recomenda-se iniciar blocos de funções, utilitários ou seções internas com comentários do tipo:
    ```javascript
    // Este bloco cria a função que inicializa a view da concordância e aplica filtros atuais.
    export function onConcordanciaViewReady() {
        const testamentoSelect = ...;   // Obtém a referência ao elemento selecionado no dropdown de testamento.
        // ...
    }
    ```
- **Nomenclatura:**  
  - Variáveis, funções e classes devem ser nomeadas em português, de forma descritiva.
  - Evite nomes genéricos ou em inglês, exceto quando for padrão de bibliotecas externas.
- **Organização:**  
  - Separe funções por responsabilidade e utilize comentários para indicar o propósito de cada bloco.

### Padrão para Marca d'Água
- **CSS:**  
  - Utilize a classe `.marcadagua-image` para estilizar a marca d'água.
  - O caminho da imagem deve ser `../img/marcadagua.png` e o seletor deve ser atualizado em todos os arquivos.
- **JavaScript:**  
  - O elemento de marca d'água deve ser criado com a classe `.marcadagua-image` e adicionado ao `body` ou ao container principal.
  - Exemplo:
    ```javascript
    const marcadaguaContainer = document.createElement('div');
    marcadaguaContainer.classList.add('marcadagua-image');
    document.body.appendChild(marcadaguaContainer);
    ```

---

## Padrões de Comentários Específicos por Arquivo

### script.js
- **Blocos de seção:** Usa `/*===============================================================================*/` para delimitar seções principais
- **Comentários de linha:** Alinhados na coluna 86 com explicações detalhadas
- **Estrutura:** Organizado em seções como "CONFIGURAÇÃO INICIAL", "INICIALIZAÇÃO E CONFIGURAÇÃO DE EVENTOS", etc.

### versoes.js
- **Blocos de seção:** Segue o mesmo padrão do script.js com `/*===============================================================================*/`
- **Comentários de linha:** Alinhados na coluna 86
- **Estrutura:** Organizado em seções como "SCRIPT PRINCIPAL DE VERSÕES BÍBLICAS", funções específicas para cada módulo

### versoes_versiculos.js
- **Blocos de seção:** Usa `/*===============================================================================*/` para delimitar seções
- **Comentários de linha:** Alinhados na coluna 86 com explicações detalhadas sobre cada método
- **Estrutura:** Organizado em classe `VersiculosManager` com métodos bem documentados
- **Comentários internos:** Usa comentários detalhados dentro dos métodos para explicar a lógica

### style.css
- **Blocos de seção:** Usa `/*=====================================================*/` para delimitar seções
- **Comentários de linha:** Alinhados à direita com fechamento `*/` na mesma coluna
- **Estrutura:** Organizado em seções como "CONFIGURAÇÃO INICIAL", "ORGANIZAÇÃO DO CORPO DA PÁGINA", etc.

### index.html
- **Blocos de seção:** Usa `<!------------------------------------------>` para delimitar seções principais
- **Comentários de linha:** Usa `<!-- -->` para explicar elementos específicos
- **Estrutura:** Organizado em seções como "CONFIGURAÇÃO DO DOCUMENTO", "CONTEÚDO PRINCIPAL", etc.

### versoes_navegacao_modoleitura.js
- **Blocos de seção:** Usa `/*===============================================================================*/` para delimitar seções
- **Comentários de linha:** Alinhados na coluna 86 com explicações detalhadas sobre navegação
- **Estrutura:** Organizado em IIFE (Immediately Invoked Function Expression) para isolamento de escopo
- **Funcionalidades específicas:** 
  - Navegação por teclado (setas esquerda/direita)
  - Geração de HTML para botões de navegação
  - Configuração de event listeners para botões
- **Padrão de comentários:** Usa "Este bloco" para introduzir seções e explicações técnicas detalhadas
- **Integração:** Trabalha em conjunto com `versoes_navegacao.js` e `versoes_modoleitura.js`

### versoes_navegacao.js
- **Blocos de seção:** Usa `/*===============================================================================*/` para delimitar seções
- **Comentários de linha:** Alinhados na coluna 86 com explicações detalhadas sobre dados e navegação
- **Estrutura:** Organizado em funções assíncronas para gerenciamento de dados da Bíblia
- **Funcionalidades específicas:**
  - Lista de livros da Bíblia
  - Verificação de existência de capítulos
  - Contagem e cache de capítulos por livro
  - Navegação entre capítulos anterior/próximo
- **Padrão de comentários:** Usa "Este bloco" para introduzir seções e explicações técnicas detalhadas

## Organização do HTML

### 1. Estrutura Básica
- DOCTYPE e meta tags
- Links para recursos externos (CSS, fontes)
- Estrutura semântica HTML5

### 2. Organização dos Elementos
1. **Cabeçalho**
   - Título principal
   - Barra de navegação
   - Caixa de busca

2. **Conteúdo Principal**
   - Lista de versões da Bíblia
   - Imagens e cards
   - Pop-ups e modais

3. **Rodapé**
   - Informações de copyright
   - Links úteis

### 4. Páginas Específicas
1. **cursos.html**
   - Página dedicada aos cursos bíblicos
   - Estrutura de conteúdo educacional

2. **dicionario.html**
   - Interface do dicionário bíblico
   - Sistema de busca e navegação

3. **dicionario_concordancia.html**
   - Integração entre dicionário e concordância
   - Funcionalidades combinadas

4. **concordancia.html**
   - Sistema de concordância bíblica
   - Busca e filtros específicos

5. **versoes.html**
   - Listagem e comparação de versões bíblicas
   - Seleção e visualização de traduções

### 4. Classes e IDs
- Nomes descritivos e em português
- Seguindo padrão BEM (Block Element Modifier)
- Organizados por funcionalidade

### 5. Comentários
- Seções principais documentadas
- Funcionalidades complexas explicadas
- Estrutura clara e legível

## Boas Práticas
1. **Consistência**
   - Nomenclatura padronizada
   - Indentação consistente
   - Comentários informativos

2. **Semântica**
   - Uso apropriado de tags HTML5
   - Estrutura lógica e hierárquica
   - Acessibilidade considerada

3. **Manutenibilidade**
   - Código organizado e documentado
   - Separação clara de responsabilidades
   - Fácil de entender e modificar

---

## Organização do CSS (style.css)

### 1. Estrutura Geral
- Cada seção começa com um bloco de comentário centralizado:
  ```css
  /*=====================================================*/
  /*              NOME DA SEÇÃO CENTRALIZADO             */
  /*        Descrição ou observação centralizada         */
  /*=====================================================*/
  ```
- Blocos organizados hierarquicamente, do mais geral para o mais específico.
- Comentários de propriedades alinhados à direita, sempre padronizados conforme a ação:
  - **Cria** para criação de elementos ou funções.
  - **Limpa** para limpeza de campos ou listas.
  - **Adiciona** para adicionar itens.
  - **Busca** para busca de elementos.
  - **Define** para definição de propriedades ou valores.
  - **Centraliza** para centralização de elementos ou textos.
  - **Remove** para remoção de estilos ou elementos.
- Exemplo:
  ```css
  background-size: auto 100%;                 /* Faz o fundo ocupar toda a altura da tela, ajustando a largura automaticamente */
  text-align: center;                         /* Centraliza o texto */
  color: white;                               /* Deixa o texto branco */
  ```

### 2. Ordem dos Blocos
1. **Reset Geral** (`*`)
2. **Corpo da Página** (`body`)
3. **Elementos de Fundo** (`.gradiente`)
4. **Elementos de Navegação** (`a`, `.cabecalho`)
5. **Elementos de Interface** (pop-ups, botões, etc)
6. **Elementos de Conteúdo** (listas, imagens, títulos)
7. **Media Queries** (ajustes responsivos)

### 3. Organização Interna dos Blocos
- Propriedades agrupadas por categoria:
  - Posicionamento e Layout (display, position, etc.)
  - Box Model (width, height, margin, padding)
  - Visual (background, border, etc.)
  - Tipografia (font, text, etc.)

### 4. Comentários
- Comentários de seção (cabeçalhos) são centralizados, com `/*` e `*/` alinhados na coluna 56.
- Comentários de propriedades são padronizados conforme a ação e alinhados à direita.
- Comentários especiais (como "A linha abaixo...") são mantidos em sua posição original.

### 5. Espaçamento
- Blocos principais são separados por linhas em branco.
- Propriedades relacionadas são agrupadas juntas.
- Comentários de propriedades são alinhados a 35 espaços após a propriedade.

### 6. Hierarquia Visual
- Elementos base primeiro.
- Estados e modificadores depois (como :hover).
- Media queries por último.

---

## Organização do JavaScript (script.js)

### 1. Estrutura Geral
- Cada função começa com um comentário de linha padronizado:
  - Exemplo:  
    ```javascript
    function exibirTodasVersoes() { // Cria a função para mostrar todas as versões da Bíblia na tela
    ```
- Comentários de linha sempre iniciam com o verbo da ação:
  - **Cria** para criação de funções ou elementos.
  - **Limpa** para limpeza de campos ou listas.
  - **Adiciona** para adicionar itens.
  - **Busca** para busca de elementos.
  - **Define** para definição de propriedades ou valores.
- Comentários de bloco de seção centralizados:
  ```javascript
  /*=====================================================*/
  /*           FUNÇÕES DE MANIPULAÇÃO DE VERSÕES         */
  /*=====================================================*/
  ```
- **Alinhamento dos comentários de linha:**  
  - Comentários de linha devem iniciar na coluna 86, alinhados à direita do código.

### 2. Organização dos Módulos (ex: versoes_capitulos.js)
- Cada módulo deve conter apenas uma responsabilidade (ex: manipulação de versões, capítulos, etc).
- Comentários seguem o mesmo padrão do script.js:
  - Blocos de comentário de seção centralizados.
  - Comentários de linha claros e padronizados.
- Exemplo:
  ```javascript
  // Cria a função para adicionar uma nova versão
  function adicionarVersao() {
      // Adiciona a versão ao array de versões
  }
  ```

---

## Padrão de Comentários e Documentação Interna

Todos os arquivos das pastas `/css`, `/html` e `/script` foram revisados e agora seguem um padrão de comentários detalhados, tanto em blocos quanto em linhas, para facilitar a compreensão, manutenção e colaboração no projeto.

### Como são os comentários?

- **Comentários de bloco**: Utilizados para separar grandes seções, explicar o propósito de arquivos, módulos ou áreas do código.
- **Comentários de linha**: Explicam a função de propriedades, comandos, funções ou trechos específicos.

#### Exemplos:

**CSS**
```css
/*================== BARRA DE BUSCA ===================*/
.search-bar {
    background: #222; /* Fundo escuro para destaque */
    color: #fff;      /* Texto branco */
}
```

**HTML**
```html
<!-- ========== MENU LATERAL COM LIVROS ========== -->
<aside class="menu-livros">
    <!-- Lista de links para livros bíblicos -->
    <ul>...</ul>
</aside>
```

**JavaScript**
```js
// ===================== Função de navegação =====================
/**
 * Navega para o próximo capítulo
 * @param {string} livro - Nome do livro
 * @param {number} capitulo - Número do capítulo
 */
function irParaProximoCapitulo(livro, capitulo) {
    // Verifica se existe próximo capítulo
    if (!temProximoCapitulo(livro, capitulo)) return;
    // ... lógica de navegação ...
}
```

### Boas práticas para futuras contribuições
- Sempre utilize comentários de bloco para separar grandes seções ou explicar o propósito de arquivos/módulos.
- Utilize comentários de linha para explicar propriedades, funções, comandos ou trechos não triviais.
- Prefira clareza e concisão.
- Mantenha o padrão já adotado nos arquivos existentes.

---

## Arquivos de Dados (JSON)
- **/json/**: Dados auxiliares como `dicionario.json` (dicionário geral) e `harpa_crista.json` (hinos).
- **/concordancia/**: Dados de concordância bíblica, organizados por letra, temas, palavras-chave e índices. Inclui rascunhos para testes e desenvolvimento.
- **/dicionario/**: Dados do dicionário bíblico, organizados por letra e com rascunhos para testes.
- **/versao/**: Estrutura hierárquica de versões bíblicas. Cada subpasta é uma versão (ex: acf, ara, kjv), cada subpasta interna é um livro, e cada arquivo é um capítulo em JSON.
- **Padrão de codificação:** UTF-8, campos e textos em português.

## Imagens e Recursos Visuais
- **/img/**: Contém ícones de versões, logotipo, marca d'água (`marcadagua.png`), imagens de cursos e outros recursos visuais.
- **Padrão de nomenclatura:** Sempre descritivo, preferencialmente em português.
- **Marca d'água:** Usada em várias páginas, estilizada via `.marcadagua-image` no CSS.

## Recursos para Download
- **/baixar/**: PDFs de Bíblias, estudos, cronologias e outros materiais para leitura offline ou estudo.
- **Exemplos:**
  - `A_Biblia_Catolica.pdf`, `A_Biblia_Sagrada_NVT.pdf`, `Biblia_Thompson_temas_em_cadeia.pdf`, etc.
- **Uso:** Referenciados em páginas HTML ou para download direto.

## Rascunhos e Arquivos Auxiliares
- **/concordancia/rascunho/** e **/dicionario/rascunho/**: Arquivos de teste, desenvolvimento e dados auxiliares. Podem conter versões intermediárias ou experimentais dos dados.
- **Importante:** Não são usados em produção, mas servem para desenvolvimento e validação.

## Temas e Palavras-Chave
- **/concordancia/themes/**: Arquivos temáticos para agrupamento de passagens bíblicas por tema.
- **/concordancia/words/**: Arquivos de palavras-chave para buscas rápidas e agrupamentos específicos.

## Organização dos Módulos de Livros e Capítulos
- **/versao/**: Estrutura padrão:
  - `/versao/<versao>/<livro>/<capitulo>.json`
  - Exemplo: `/versao/acf/genesis/1.json` representa o capítulo 1 de Gênesis na versão Almeida Corrigida Fiel.
- **Cada arquivo de capítulo** contém os versículos em formato JSON, com campos padronizados.

## Arquivos de Teste
- **teste_modulos_slide.html**, **teste_slide.html**: Arquivos HTML para testar módulos de slide e integração de scripts. Úteis para desenvolvimento e depuração.

## Scripts Específicos e Utilitários
- **/script/** contém scripts utilitários como:
  - `marcadagua.js`: Gerencia a marca d'água.
  - `sobre.js`: Informações sobre o projeto.
  - `dropdown.js`, `dropdown_concordancia.js`: Menus suspensos.
  - `config_dicionarioeconcordancia.js`: Configuração de integração entre dicionário e concordância.
  - `livros_capitulos.js`: Manipulação de livros e capítulos.
  - E outros scripts auxiliares para funcionalidades específicas.

## Padrão de Dados e Internacionalização
- **Idioma padrão:** Português (pt-BR) para todos os campos, textos e comentários.
- **Codificação:** UTF-8 em todos os arquivos de texto e dados.
- **Estrutura de dados:** Consistente entre módulos, com campos descritivos e padronizados.

## Licença e Créditos
- O projeto está sob a licença especificada em `LICENSE`.
- Créditos e informações adicionais podem ser encontrados no `README.md` e demais arquivos de documentação.

---

## Histórico de Atualizações de Comentários nos Scripts (2024)

Em maio de 2024, os arquivos de versões bíblicas na pasta `/script/` passaram por uma revisão completa de comentários para garantir conformidade com o padrão estabelecido neste documento. Foram revisados e padronizados os seguintes arquivos:

- `acf.js`
- `ara.js`
- `arc.js`
- `kjv.js`
- `nvt.js`
- `nvi.js`
- `ntlh.js`
- `naa.js`
- `original.js`

**Padrão aplicado:**
- Blocos de seção centralizados com `/*===============================================================================*/`.
- Comentários de linha iniciando com verbo da ação (Cria, Adiciona, Busca, etc).
- Funções documentadas com explicação de propósito, parâmetros e retorno.
- Comentários detalhados em trechos importantes (fetch, manipulação de DOM, tratamento de erro, etc).

**Exemplo real aplicado:**
```javascript
/*===============================================================================*/
/*                  SCRIPT ESPECÍFICO PARA ACF (Almeida Corrigida Fiel)          */
/*===============================================================================*/

// Definição da versão da Bíblia para este script
window.BIBLE_VERSION = 'acf';
window.NOME_VERSAO_COMPLETA_BIBLIA = 'Almeida Corrigida Fiel';

/**
 * Carrega e exibe um versículo específico da Bíblia ACF
 * @param {string} livro - Nome do livro bíblico (chave, ex: "genesis")
 * @param {number} capitulo - Número do capítulo
 * @param {number} versiculo - Número do versículo
 */
window.loadSpecificVerse = async function(livro, capitulo, versiculo) {
    // Busca o elemento de conteúdo principal
    const content = document.querySelector('.conteudo');
    if (!content) {
        console.error("[ACF] Elemento .conteudo não encontrado.");
        return;
    }
    // Remove versículo anterior, se existir
    const existingVersiculoDiv = content.querySelector('.texto-versiculo');
    if (existingVersiculoDiv) {
        existingVersiculoDiv.remove();
    }
    // Cria a div para o novo versículo
    const versiculoElementDiv = document.createElement('div');
    versiculoElementDiv.classList.add('versiculo', 'texto-versiculo');
    // ... restante do código ...
}
```

Essas práticas devem ser mantidas em todos os scripts do projeto para garantir clareza, manutenção e padronização.

---

## Documentação de Arquivos CSS Específicos

### versoes_base.css
- **Propósito:** Reset, configurações globais e container principal para as versões bíblicas
- **Localização:** `/css/versoes_base.css`
- **Funcionalidades:**
  - Reset CSS para garantir consistência entre navegadores
  - Configurações básicas do corpo da página
  - Layout principal com flexbox
- **Estrutura:**
  - **Seção 1:** Configuração inicial (reset) - `*`
  - **Seção 2:** Layout principal do corpo da página - `body`
- **Propriedades principais:**
  - `box-sizing: border-box` - Modelo de caixa consistente
  - `background-color: #181818` - Cor de fundo escura
  - `font-family: sans-serif` - Tipo de fonte padrão
  - `overflow-x: hidden` - Oculta barra horizontal
- **Padrão de comentários:**
  - Blocos de seção centralizados com `/*=====================================================*/`
  - Comentários de linha alinhados à direita com verbos de ação
- **Integração:** Base fundamental para todos os outros arquivos CSS de versões

### versoes_cabecalho.css
- **Propósito:** Estilos para cabeçalho, títulos principais e seletor de versão
- **Localização:** `/css/versoes_cabecalho.css`
- **Funcionalidades:**
  - Configuração do cabeçalho principal
  - Estilização de títulos e subtítulos das versões
  - Interface do seletor de versão dropdown
  - Layout dos cabeçalhos superior e inferior
- **Estrutura:**
  - **Seção 1:** Cabeçalho principal - `header`
  - **Seção 2:** Título principal da versão - `#titulo-principal-versao`
  - **Seção 3:** Subtítulo da versão - `#subtitulo-versao-extenso`
  - **Seção 4:** Seletor de versão - `#seletor-versao-principal`
  - **Seção 5:** Cabeçalhos superior e inferior - `.cabeçalho-superior`, `.cabeçalho-inferior`
- **Propriedades principais:**
  - `font-size: 2.5em` - Tamanho grande para títulos
  - `color: #d4ac0d` - Cor dourada para textos importantes
  - `background-color: #383838` - Cor de fundo escura para elementos
  - `border-radius: 5px` - Cantos arredondados
- **Integração:** Trabalha em conjunto com `versoes_navegacao.css` para layout completo

### versoes_navegacao.css
- **Propósito:** Estilos para a barra de navegação superior com menu de opções
- **Localização:** `/css/versoes_navegacao.css`
- **Funcionalidades:**
  - Barra de navegação fixa com gradiente
  - Menu de opções centralizado
  - Título do menu
  - Posicionamento fixo abaixo do cabeçalho
- **Estrutura:**
  - **Seção 1:** Barra de navegação principal - `nav`
  - **Seção 2:** Lista de opções - `nav .menu-opcoes`
  - **Seção 3:** Itens da lista - `nav .menu-opcoes li`
  - **Seção 4:** Links de navegação - `nav .menu-opcoes li a`
  - **Seção 5:** Efeitos hover - `nav .menu-opcoes li a:hover`
  - **Seção 6:** Título do menu - `.titulo-menu`
- **Propriedades principais:**
  - `position: fixed` - Fixa na tela
  - `background: linear-gradient(to right, #333, #555, #777)` - Gradiente horizontal
  - `box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3)` - Sombra suave
  - `z-index: 1` - Ordem de empilhamento
- **Responsividade:** Tamanhos de fonte responsivos com `vw`

### versoes_conteudo.css
- **Propósito:** Estilos para a área principal onde o conteúdo da Bíblia é exibido
- **Localização:** `/css/versoes_conteudo.css`
- **Funcionalidades:**
  - Área de conteúdo principal com rolagem
  - Barra de rolagem customizada
  - Títulos e subtítulos
  - Marca d'água de fundo
- **Estrutura:**
  - **Seção 1:** Área de conteúdo principal - `.conteudo`
  - **Seção 2:** Barra de rolagem - `.conteudo::-webkit-scrollbar`
  - **Seção 3:** Títulos e subtítulos - `h2`, `h3`
  - **Seção 4:** Marca d'água - `.marcadagua-image`
- **Propriedades principais:**
  - `height: calc(100vh - 160px)` - Altura dinâmica
  - `overflow-y: auto` - Rolagem vertical
  - `color: #d4ac0d` - Cor dourada para títulos
  - `position: fixed` - Marca d'água fixa
- **Integração:** Área central de exibição do conteúdo bíblico

### versoes_interface.css
- **Propósito:** Estilos para elementos de interface como dropdowns e janela sobre
- **Localização:** `/css/versoes_interface.css`
- **Funcionalidades:**
  - Dropdowns de navegação
  - Janela modal "Sobre"
  - Efeitos hover e transições
  - Posicionamento absoluto para overlays
- **Estrutura:**
  - **Seção 1:** Dropdown - `.dropdown`, `.conteudo-dropdown`
  - **Seção 2:** Itens e links do dropdown - `.conteudo-dropdown li`, `nav .dropdown .conteudo-dropdown li a`
  - **Seção 3:** Efeitos hover do dropdown - `.dropdown:hover .conteudo-dropdown`, `nav .dropdown .conteudo-dropdown li a:hover`
  - **Seção 4:** Janela sobre - `.sobre-content`, `.sobre-content h2`, `.sobre-content p`, `.sobre`
- **Propriedades principais:**
  - `position: absolute` - Posicionamento para dropdowns
  - `background-color: rgba(0, 0, 0, 0.9)` - Fundo semi-transparente
  - `z-index: 1000` - Alta prioridade para overlays
  - `transition: background-color 0.3s ease` - Transições suaves
- **Interatividade:** Elementos responsivos com feedback visual

### versoes_menulateral.css
- **Propósito:** Estilos para o menu lateral com lista de livros da Bíblia
- **Localização:** `/css/versoes_menulateral.css`
- **Funcionalidades:**
  - Menu lateral fixo com lista de livros
  - Barra de rolagem customizada
  - Links de navegação para livros
  - Efeitos hover nos links
- **Estrutura:**
  - **Seção 1:** Menu lateral - `.menu-livros`
  - **Seção 2:** Barra de rolagem - `.menu-livros::-webkit-scrollbar`
  - **Seção 3:** Lista de livros - `.menu-livros ul`, `.menu-livros li`
  - **Seção 4:** Links do menu - `.menu-livros a`, `.menu-livros a:hover`
- **Propriedades principais:**
  - `position: fixed` - Menu fixo na lateral
  - `width: 225px` - Largura fixa do menu
  - `height: calc(100vh - 180px)` - Altura dinâmica
  - `background-color: #181818` - Cor de fundo escura
- **Navegação:** Acesso rápido aos livros da Bíblia

### versoes_busca.css
- **Propósito:** Estilos para a barra de busca e seletor de versão
- **Localização:** `/css/versoes_busca.css`
- **Funcionalidades:**
  - Container da barra de pesquisa
  - Estilização de select, input e botão
  - Efeitos hover no botão
  - Layout flexbox para alinhamento
- **Estrutura:**
  - **Seção 1:** Container da barra de pesquisa - `.barraPesquisa`
  - **Seção 2:** Select da barra de pesquisa - `.barraPesquisa select`
  - **Seção 3:** Input de texto - `.barraPesquisa input[type="text"]`
  - **Seção 4:** Botão da barra de pesquisa - `.barraPesquisa button`, `.barraPesquisa button:hover`
- **Propriedades principais:**
  - `display: flex` - Layout flexbox
  - `background-color: #383838` - Cor de fundo escura
  - `border: 1px solid #fff` - Bordas brancas
  - `border-radius: 5px` - Cantos arredondados
- **Funcionalidade:** Interface de busca e seleção de versões

### versoes_rodape.css
- **Propósito:** Estilos específicos para o rodapé das páginas de versões bíblicas
- **Localização:** `/css/versoes_rodape.css`
- **Funcionalidades:**
  - Configuração do elemento `<footer>` com posicionamento fixo na parte inferior da tela
  - Estilização do texto do rodapé com tipografia específica
  - Cores e layout padronizados para consistência visual
- **Estrutura:**
  - **Seção 1:** Configuração do rodapé principal (`footer`)
  - **Seção 2:** Configuração do texto do rodapé (`footer p`)
- **Propriedades principais:**
  - `position: fixed` - Fixa o rodapé na tela
  - `background-color: #383838` - Cor de fundo escura
  - `color: #d4ac0d` - Cor dourada para o texto
  - `height: 30px` - Altura fixa do rodapé
  - `z-index: 1` - Ordem de empilhamento
- **Padrão de comentários:**
  - Blocos de seção centralizados com `/*=====================================================*/`
  - Comentários de linha alinhados à direita com verbos de ação (Define, Centraliza, etc.)
- **Integração:** Utilizado em páginas que necessitam de rodapé fixo, especialmente nas páginas de versões bíblicas
- **Responsividade:** Mantém posicionamento fixo independente do tamanho da tela
- **Acessibilidade:** Texto com contraste adequado e tamanho legível

### modo_leitura.css
- **Propósito:** Estilos específicos para o modo de leitura das versões bíblicas
- **Localização:** `/css/modo_leitura.css`
- **Funcionalidades:**
  - Layout otimizado para leitura contínua
  - Botões de navegação entre capítulos
  - Estilização de versículos e títulos
  - Responsividade para diferentes tamanhos de tela
- **Estrutura:**
  - **Seção 1:** Container principal - `.modo-leitura-conteudo`
  - **Seção 2:** Cabeçalho do modo leitura - `.reading-mode-header`
  - **Seção 3:** Navegação e botões - `.reading-mode-navigation`, `#modoLeitura-capitulo-anterior`, `#modoLeitura-capitulo-proximo`
  - **Seção 4:** Versículos e containers - `.chapter-verses`, `.verse-container`, `.verse-number`, `.verse-text`
  - **Seção 5:** Títulos - `.verse-section-title`, `.chapter-title`
  - **Seção 6:** Botão modo leitura nav - `#modo-leitura`
  - **Seção 7:** Texto do versículo - `.texto-versiculo`, `.texto-versiculo h3`
  - **Seção 8:** Responsividade - `@media (max-width: 768px)`
- **Propriedades principais:**
  - `max-width: 80%` - Largura máxima do conteúdo
  - `background-color: rgba(30, 30, 30, 0.7)` - Fundo semi-transparente
  - `color: #4CAF50` - Cor verde para elementos ativos
  - `font-size: 2.2vw` - Tamanho responsivo
- **Estados dos botões:** Habilitado, desabilitado e hover com cores específicas
- **Responsividade:** Ajustes específicos para telas menores

### capitulos.css
- **Propósito:** Estilos para a exibição e navegação de capítulos bíblicos
- **Localização:** `/css/capitulos.css`
- **Funcionalidades:** Layout e estilização da interface de capítulos

### concordancia.css
- **Propósito:** Estilos para o sistema de concordância bíblica
- **Localização:** `/css/concordancia.css`
- **Funcionalidades:** Interface de busca e exibição de resultados de concordância

### cursos.css
- **Propósito:** Estilos para a seção de cursos bíblicos
- **Localização:** `/css/cursos.css`
- **Funcionalidades:** Layout e apresentação dos cursos disponíveis

### dicionario.css
- **Propósito:** Estilos para o dicionário bíblico
- **Localização:** `/css/dicionario.css`
- **Funcionalidades:** Interface de consulta e exibição de definições

### dicionario_concordancia.css
- **Propósito:** Estilos para a integração entre dicionário e concordância
- **Localização:** `/css/dicionario_concordancia.css`
- **Funcionalidades:** Interface combinada de dicionário e concordância

### slide_biblia.css
- **Propósito:** Estilos para o sistema de slides bíblicos
- **Localização:** `/css/slide_biblia.css`
- **Funcionalidades:** Apresentação em slides de versículos e passagens

---

## Padrão de Organização CSS Aplicado

Todos os arquivos CSS da pasta `/css/` foram reorganizados seguindo o padrão estabelecido no `organizacao.md`:

### Ordem das Propriedades CSS:
1. **Posicionamento e Layout** (display, position, top, left, z-index, etc.)
2. **Box Model** (width, height, margin, padding, flex, etc.)
3. **Visual** (background, border, box-shadow, etc.)
4. **Tipografia** (font, text, color, etc.)

### Padrão de Comentários:
- **Blocos de seção:** `/*=====================================================*/`
- **Comentários de linha:** Alinhados à direita com verbos de ação
- **Estrutura hierárquica:** Do mais geral para o mais específico

### Arquivos Organizados:
- ✅ `versoes_base.css` - Reset e configurações globais
- ✅ `versoes_cabecalho.css` - Cabeçalho e títulos
- ✅ `versoes_navegacao.css` - Barra de navegação
- ✅ `versoes_conteudo.css` - Área de conteúdo principal
- ✅ `versoes_interface.css` - Elementos de interface
- ✅ `versoes_menulateral.css` - Menu lateral
- ✅ `versoes_busca.css` - Barra de busca
- ✅ `versoes_rodape.css` - Rodapé
- ✅ `modo_leitura.css` - Modo de leitura
- ⏳ `capitulos.css` - Capítulos (pendente)
- ⏳ `concordancia.css` - Concordância (pendente)
- ⏳ `cursos.css` - Cursos (pendente)
- ⏳ `dicionario.css` - Dicionário (pendente)
- ⏳ `dicionario_concordancia.css` - Dicionário + Concordância (pendente)
- ⏳ `slide_biblia.css` - Slides bíblicos (pendente)

---
