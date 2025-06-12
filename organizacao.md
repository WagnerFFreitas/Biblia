# Organização do Projeto

## Estrutura de Arquivos
```
projeto/
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

## Organização do HTML (index.html)

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

### 3. Classes e IDs
- Nomes descritivos e em português
- Seguindo padrão BEM (Block Element Modifier)
- Organizados por funcionalidade

### 4. Comentários
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
