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
└── img/
    └── biblia.png
    ├── acf.png
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

### 3. Páginas Específicas
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

## Organização do CSS (style.css)

### 1. Estrutura Geral
- Cada seção começa com um comentário de cabeçalho no formato `/* ===== Nome da Seção ===== */`
- Blocos organizados hierarquicamente, do mais geral para o mais específico
- Comentários de propriedades alinhados a 35 espaços após a propriedade

### 2. Ordem dos Blocos
1. **Reset Geral** (`*`)
   - Margens e paddings
   - Box model
   - Fonte padrão

2. **Corpo da Página** (`body`)
   - Posicionamento e Layout
   - Box Model
   - Visual (background, etc.)
   - Tipografia

3. **Elementos de Fundo** (`.gradiente`)
   - Posicionamento
   - Efeitos visuais

4. **Elementos de Navegação**
   - Link do título principal (`a`)
   - Cabeçalho superior (`.cabecalho`)
   - Caixa de busca (`.caixa-pesquisa`)

5. **Elementos de Interface**
   - Janela de boas-vindas (`.seja-bem-vindo`)
   - Pop-ups (`.popup-nova-versao`)
   - Botões e controles

6. **Elementos de Conteúdo**
   - Lista de versões (`.lista-versoes`)
   - Imagens e cards
   - Títulos e textos

7. **Media Queries**
   - Ajustes para diferentes tamanhos de tela

### 3. Organização Interna dos Blocos
- Propriedades agrupadas por categoria:
  - Posicionamento e Layout (display, position, etc.)
  - Box Model (width, height, margin, padding)
  - Visual (background, border, etc.)
  - Tipografia (font, text, etc.)

### 4. Comentários
- Comentários de seção (cabeçalhos) são mais destacados
- Comentários de propriedades são alinhados à direita
- Comentários especiais (como "A linha abaixo...") são mantidos em sua posição original

### 5. Espaçamento
- Blocos principais são separados por linhas em branco
- Propriedades relacionadas são agrupadas juntas
- Comentários de propriedades são alinhados a 35 espaços após a propriedade

### 6. Hierarquia Visual
- Elementos base primeiro
- Estados e modificadores depois (como :hover)
- Media queries por último

## Padrão de Comentários

### 1. HTML (index.html)
1. **Comentários de Seção**
   ```html
   <!------------------------------------------>
   <!--        CONFIGURAÇÃO DO DOCUMENTO     -->
   <!------------------------------------------>
   ```
   - Usa linhas de separação com `-`
   - Título centralizado
   - Fechamento com `-->`

2. **Comentários de Elementos**
   ```html
   <!-- O Bloco abaixo e o cabeçalho da página -->
   ```
   - Explicação do propósito do elemento
   - Uso de português claro e direto
   - Posicionado antes do elemento que descreve

### 2. JavaScript (script.js)
1. **Comentários de Seção**
   ```javascript
   /*==========================================*/
   /* CONFIGURAÇÃO INICIAL E VARIÁVEIS GLOBAIS */
   /*==========================================*/
   ```
   - Usa `=` para criar linhas de separação
   - Título centralizado
   - Fechamento com `*/`

2. **Comentários de Função**
   ```javascript
   /* Função que exibe todas as versões da Bíblia */
   ```
   - Descrição clara da função
   - Posicionado antes da função
   - Explica o propósito e comportamento

3. **Comentários de Código**
   ```javascript
   const list = document.getElementById('lista'); // Encontra a lista onde as versões serão mostradas
   ```
   - Explicação de operações específicas
   - Alinhados à direita quando possível
   - Breves e diretos

### 3. CSS (style.css)
1. **Comentários de Seção**
   ```css
   /*=======================*/
   /*    RESET DE ESTILO    */
   /*=======================*/
   ```
   - Usa `=` para criar linhas de separação
   - Título centralizado
   - Fechamento com `*/`

2. **Comentários de Propriedades**
   ```css
   margin: 0;                                  /* Remove margens padrão */
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
