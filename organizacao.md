# Organização do Projeto

## Estrutura de Arquivos
```
projeto/
├── html/
│   ├── cursos.html
│   ├── dicionario.html
│   ├── dicionario_concordancia.html
│   ├── concordancia.html
│   └── versoes.html
├── index.html
├── style.css
├── script/
│   ├── marcadagua.js
│   ├── naa.js
│   ├── ntlh.js
│   ├── nvi.js
│   ├── nvt.js
│   ├── original.js
│   ├── slide.js
│   ├── sobre.js
│   ├── versoes copy.js
│   ├── versoes.js                         # Módulo principal de versões da Bíblia
│   ├── versoes_cache.js                   # Gerencia cache de dados das versões
│   ├── versoes_capitulos.js               # Funções para capítulos das versões
│   ├── versoes_interface.js               # Funções de interface para versões
│   ├── versoes_modoleitura.js             # Modo de leitura das versões
│   ├── versoes_navegacao.js               # Navegação entre versões
│   ├── versoes_navegacao_modoleitura.js   # Navegação no modo leitura
│   ├── versoes_versiculos.js              # Manipulação de versículos das versões
└── img/
    └── biblia.png
    ├── acf.png
    ├── ara.png
    ├── arc.png
    ├── kjv.png
    ├── naa.png
    ├── ntlh.png
    ├── nvi.png
    ├── nvt.png
    └── original.png
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
  - Exemplo:
    ```javascript
    /*===============================================================================*/
    /*                   CONFIGURAÇÃO INICIAL E VARIÁVEIS GLOBAIS                    */
    /*  Lista que guarda todas as versões da Bíblia disponíveis dentro de um array   */
    /*===============================================================================*/
    ```
- **Comentários de linha:**  
  - Devem ser alinhados para iniciar na coluna 86.
  - O texto do comentário deve ser claro e objetivo.
  - Exemplo:
    ```javascript
    const lista = document.getElementById('lista');                                         // Obtém o elemento <ul> com id 'lista' do HTML
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
  - **Define** para definição de propriedades.
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

## Padrão de Comentários

### 1. HTML (index.html)
1. **Comentários de Seção**
   ```html
   <!------------------------------------------>
   <!--        CONFIGURAÇÃO DO DOCUMENTO      -->
   <!------------------------------------------>
   ```
   - Usa linhas de separação com `-`
   - Título centralizado
   - Fechamento com `-->`

2. **Comentários de Elementos**
   ```html
   <!-- O bloco abaixo é o cabeçalho da página -->
   ```
   - Explicação do propósito do elemento
   - Uso de português claro e direto
   - Posicionado antes do elemento que descreve

### 2. JavaScript (script.js e módulos)
1. **Comentários de Seção**
   ```javascript
   /*=====================================================*/
   /*           FUNÇÕES DE MANIPULAÇÃO DE VERSÕES         */
   /*=====================================================*/
   ```
   - Usa `=` para criar linhas de separação
   - Título centralizado
   - Fechamento com `*/`

2. **Comentários de Função**
   ```javascript
   function exibirTodasVersoes() { // Cria a função para mostrar todas as versões da Bíblia na tela
   ```
   - Descrição clara da função
   - Posicionado na linha da função
   - Explica o propósito e comportamento

3. **Comentários de Código**
   ```javascript
   const lista = document.getElementById('lista');                                  // Busca a lista onde as versões serão exibidas
   lista.innerHTML = '';                                                            // Limpa a lista antes de adicionar as versões
   ```
   - Explicação de operações específicas
   - Alinhados à direita na coluna 86
   - Breves e diretos

### 3. CSS (style.css)
1. **Comentários de Seção**
   ```css
   /*=====================================================*/
   /*              NOME DA SEÇÃO CENTRALIZADO             */
   /*        Descrição ou observação centralizada         */
   /*=====================================================*/
   ```
   - Usa `=` para criar linhas de separação
   - Título centralizado
   - Fechamento com `*/`

2. **Comentários de Propriedades**
   ```css
   margin: 0;                                  /* Remove margens padrão dos elementos                */
   background-size: auto 100%;                 /* Faz o fundo ocupar toda a altura da tela, ajustando a largura automaticamente */
   text-align: center;                         /* Centraliza o texto                                 */
   color: white;                               /* Deixa o texto branco                               */
   ```
   - Alinhados a 35 espaços após a propriedade
   - Explicação clara e concisa
   - Descrevem o efeito da propriedade

3. **Comentários de Bloco**
   ```css
   /* A linha abaixo cria um efeito de escurecimento gradual */
   ```
   - Explicam funcionalidades complexas
   - Posicionados antes do código relevante
   - Fornecem contexto adicional

### 4. Regras Gerais de Comentários
1. **Consistência**
   - Padrão visual uniforme em cada tipo de arquivo
   - Espaçamento consistente
   - Alinhamento padronizado

2. **Clareza**
   - Linguagem clara e direta
   - Evita redundâncias
   - Foca em informações relevantes

3. **Organização**
   - Comentários de seção no topo
   - Comentários de função/bloco antes do código
   - Comentários de linha alinhados à direita

4. **Manutenção**
   - Fácil de atualizar
   - Documentação sempre atualizada
   - Reflete mudanças no código

### 5. Propósitos dos Comentários
1. **Documentação**
   - Explicar a estrutura do código
   - Descrever funcionalidades
   - Documentar decisões de design

2. **Organização**
   - Separar seções lógicas
   - Identificar componentes
   - Facilitar navegação

3. **Clareza**
   - Explicar lógica complexa
   - Fornecer contexto
   - Ajudar na manutenção

---

## Organização dos Arquivos de Módulo (ex: versoesModulo.js)

- Cada arquivo de módulo deve conter apenas funções e variáveis relacionadas à sua responsabilidade.
- Comentários seguem o padrão dos demais arquivos:
  - Blocos de seção centralizados.
  - Comentários de linha iniciando com o verbo da ação (Cria, Adiciona, Limpa, Busca, Define, etc).
- Exemplo:
  ```javascript
  /*=====================================================*/
  /*           FUNÇÕES DE MANIPULAÇÃO DE VERSÕES         */
  /*=====================================================*/

  // Cria a função para adicionar uma nova versão
  function adicionarVersao() {
      // Adiciona a versão ao array de versões
  }
  ```

---

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

## Atualização - Padronização de Comentários

- O arquivo `versoes_cache.js` foi revisado e está em conformidade com o padrão de comentários adotado no projeto.
- Todos os blocos, funções e linhas relevantes possuem comentários claros, alinhados e explicativos, seguindo o mesmo padrão dos arquivos `versoes.js` e `script.js`.
- Comentários de bloco explicam o contexto e o propósito de cada parte do código, enquanto comentários de linha detalham comandos específicos.
- O padrão de documentação e comentários deve ser seguido em todos os novos arquivos e atualizações do projeto.
