# Documentação Técnica - Bíblia Online

## Visão Geral
Este projeto é uma aplicação web que permite aos usuários acessar diferentes versões da Bíblia de forma interativa e intuitiva. A aplicação foi desenvolvida utilizando HTML5, CSS3 e JavaScript puro, sem dependências externas.

## Estrutura do Projeto
```
biblia/
├── index.html          # Página principal
├── style.css          # Estilos da aplicação
├── script.js          # Lógica principal
├── img/              # Diretório de imagens
│   ├── biblia.png    # Imagem de fundo
│   ├── acf.png       # Ícone ACF
│   ├── ara.png       # Ícone ARA
│   └── ...           # Outros ícones
└── html/             # Páginas das versões
    └── versoes.html  # Template para versões
```

## Componentes Principais

### 1. Interface do Usuário (index.html)
- **Cabeçalho (Header)**
  - Botão para adicionar nova versão
  - Título "Versões da Bíblia"
  - Barra de pesquisa

- **Lista de Versões**
  - Exibe cards com imagens e títulos
  - Layout responsivo em grid
  - Efeitos de hover e transições

- **Popups**
  - Popup de boas-vindas
  - Popup para adicionar nova versão
  - Overlay com efeito de blur

### 2. Estilização (style.css)
- **Layout**
  - Design responsivo
  - Flexbox para organização
  - Grid para cards
  - Efeitos visuais e animações

- **Temas e Cores**
  - Esquema de cores escuro
  - Gradientes e transparências
  - Sombras e efeitos de luz

- **Componentes**
  - Cards de versões
  - Botões e inputs
  - Popups e overlays

### 3. Funcionalidades (script.js)
- **Gerenciamento de Versões**
  - Array de versões disponíveis
  - Adição de novas versões
  - Persistência temporária

- **Sistema de Busca**
  - Filtragem em tempo real
  - Case-insensitive
  - Feedback visual

- **Upload de Imagens**
  - Preview em tempo real
  - Validação de arquivos
  - Conversão para base64

## Fluxo de Dados

1. **Carregamento Inicial**
   ```mermaid
   graph TD
   A[Página Carrega] --> B[Inicializa Array de Versões]
   B --> C[Renderiza Lista]
   C --> D[Mostra Popup de Boas-vindas]
   ```

2. **Busca de Versões**
   ```mermaid
   graph TD
   A[Usuário Digita] --> B[Filtra Array]
   B --> C[Atualiza Lista]
   C --> D[Feedback Visual]
   ```

3. **Adição de Nova Versão**
   ```mermaid
   graph TD
   A[Clique em +] --> B[Abre Popup]
   B --> C[Upload Imagem]
   C --> D[Preview]
   D --> E[Salvar]
   E --> F[Atualiza Lista]
   ```

## Classes e IDs Principais

### HTML
- `.cabecalho` - Container do cabeçalho
- `.caixa-pesquisa` - Barra de busca
- `.lista-versoes` - Container das versões
- `.seja-bem-vindo` - Popup de boas-vindas
- `.popup-nova-versao` - Popup de nova versão

### CSS
- `.gradiente` - Efeito de fundo
- `.material-icons` - Ícones do Material Design
- `.visivel` - Controle de visibilidade
- `.ativo` - Estado ativo de elementos

### JavaScript
- `bibleVersions` - Array de versões
- `uploadedImg` - Imagem temporária
- `barraPesquisa()` - Função de busca
- `createElementAnime()` - Criação de cards

## Responsividade
- Breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

## Performance
- Otimização de imagens
- Lazy loading de recursos
- Cache de dados temporário

## Segurança
- Validação de inputs
- Sanitização de dados
- Proteção contra XSS

## Manutenção
- Código modular
- Comentários explicativos
- Padrões de nomenclatura

## Próximos Passos
1. Implementar persistência de dados
2. Adicionar mais versões da Bíblia
3. Melhorar acessibilidade
4. Otimizar performance
5. Adicionar testes automatizados 