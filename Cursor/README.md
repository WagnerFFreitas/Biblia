# Biblia - Aplicação de Estudo Bíblico

Uma aplicação web moderna para estudo da Bíblia, desenvolvida com HTML5, CSS3 e JavaScript puro.

## Funcionalidades

- **Leitura da Bíblia**
  - Múltiplas versões bíblicas
  - Navegação intuitiva por livros e capítulos
  - Modo de apresentação
  - Leitura em áudio
  - Recursos multimídia

- **Busca Avançada**
  - Busca por palavras e frases
  - Filtros por versão e idioma
  - Resultados em tempo real
  - Histórico de buscas

- **Concordância**
  - Busca por palavras em diferentes idiomas
  - Contexto completo dos versículos
  - Estatísticas de uso
  - Compartilhamento de resultados

- **Hinários**
  - Múltiplos hinários
  - Busca por título e autor
  - Reprodução de áudio
  - Partituras para download

- **Recursos Adicionais**
  - Dicionário bíblico
  - Mapas e cronologias
  - Notas pessoais
  - Referências cruzadas

## Tecnologias Utilizadas

- HTML5
- CSS3 (com variáveis CSS e Grid/Flexbox)
- JavaScript (ES6+)
- Material Icons
- Google Fonts

## Estrutura do Projeto

```
biblia/
├── index.html
├── bible.html
├── search.html
├── concordance.html
├── hymns.html
├── dictionary.html
├── css/
│   ├── common.css
│   ├── bible.css
│   ├── search.css
│   ├── concordance.css
│   ├── hymns.css
│   └── dictionary.css
├── js/
│   ├── config.js
│   ├── common.js
│   ├── bible-reader.js
│   ├── search.js
│   ├── concordance.js
│   ├── hymns.js
│   └── dictionary.js
└── assets/
    ├── images/
    ├── audio/
    └── maps/
```

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/biblia.git
```

2. Navegue até o diretório do projeto:
```bash
cd biblia
```

3. Inicie um servidor local:
```bash
# Usando Python
python -m http.server 8000

# Usando Node.js
npx serve
```

4. Acesse a aplicação no navegador:
```
http://localhost:8000
```

## Configuração

O arquivo `js/config.js` contém todas as configurações da aplicação, incluindo:

- Endpoints da API
- Configurações de cache
- Configurações de paginação
- Configurações de busca
- Configurações de idiomas
- Configurações de temas
- Configurações de notificações
- Configurações de segurança
- Configurações de performance
- Configurações de acessibilidade

## Desenvolvimento

### Pré-requisitos

- Navegador moderno com suporte a ES6+
- Editor de código (recomendado: VS Code)
- Conhecimento básico de HTML, CSS e JavaScript

### Estrutura de Código

- **Módulos**: Cada funcionalidade é um módulo independente
- **Classes**: Uso de classes ES6 para organização do código
- **Eventos**: Sistema de eventos personalizado
- **Cache**: Sistema de cache para melhor performance
- **Temas**: Suporte a temas claro e escuro
- **Responsividade**: Design adaptativo para diferentes dispositivos

### Boas Práticas

- Código limpo e bem documentado
- Separação de responsabilidades
- Reutilização de código
- Tratamento de erros
- Testes unitários
- Otimização de performance

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Contato

Seu Nome - [@seu_twitter](https://twitter.com/seu_twitter) - email@exemplo.com

Link do Projeto: [https://github.com/seu-usuario/biblia](https://github.com/seu-usuario/biblia)

