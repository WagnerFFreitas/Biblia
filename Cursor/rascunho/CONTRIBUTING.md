# Guia de Contribuição

Obrigado pelo seu interesse em contribuir com o projeto Biblia! Este documento fornece um guia passo a passo para contribuir.

## Como Contribuir

### 1. Configuração do Ambiente

1. Faça um fork do repositório
2. Clone seu fork localmente:
```bash
git clone https://github.com/seu-usuario/biblia.git
cd biblia
```

3. Configure o repositório remoto:
```bash
git remote add upstream https://github.com/original/biblia.git
```

### 2. Desenvolvimento

1. Crie uma nova branch para sua feature:
```bash
git checkout -b feature/nome-da-feature
```

2. Faça suas alterações seguindo as convenções de código:
   - Use indentação de 4 espaços
   - Siga o estilo de código existente
   - Adicione comentários quando necessário
   - Mantenha as funções pequenas e focadas

3. Teste suas alterações:
   - Verifique se não há erros no console
   - Teste em diferentes navegadores
   - Teste em diferentes dispositivos

4. Commit suas alterações:
```bash
git add .
git commit -m "Descrição clara e concisa das alterações"
```

### 3. Convenções de Código

#### JavaScript
- Use ES6+ features
- Use classes para organização
- Use async/await para operações assíncronas
- Trate erros adequadamente
- Documente funções complexas

#### CSS
- Use variáveis CSS para cores e valores comuns
- Organize estilos por componente
- Use BEM para nomenclatura de classes
- Mantenha a especificidade baixa
- Use media queries para responsividade

#### HTML
- Use HTML5 semântico
- Mantenha a estrutura limpa e organizada
- Use atributos ARIA quando necessário
- Otimize para SEO
- Mantenha a acessibilidade

### 4. Pull Request

1. Atualize sua branch com as alterações mais recentes:
```bash
git fetch upstream
git rebase upstream/main
```

2. Push suas alterações:
```bash
git push origin feature/nome-da-feature
```

3. Crie um Pull Request:
   - Use um título descritivo
   - Descreva as alterações em detalhes
   - Liste as funcionalidades adicionadas/modificadas
   - Mencione problemas resolvidos
   - Adicione screenshots quando relevante

### 5. Revisão de Código

- Responda aos comentários dos revisores
- Faça as alterações solicitadas
- Mantenha a discussão construtiva
- Atualize o PR conforme necessário

### 6. Documentação

- Atualize o README.md quando necessário
- Documente novas funcionalidades
- Mantenha a documentação atualizada
- Use exemplos quando apropriado

### 7. Testes

- Adicione testes para novas funcionalidades
- Mantenha a cobertura de testes
- Execute todos os testes antes de submeter
- Corrija testes quebrados

### 8. Performance

- Otimize o carregamento de recursos
- Minimize requisições HTTP
- Use lazy loading quando apropriado
- Monitore o desempenho

### 9. Segurança

- Não exponha dados sensíveis
- Valide inputs do usuário
- Use HTTPS para requisições
- Siga as melhores práticas de segurança

### 10. Comunidade

- Seja respeitoso e profissional
- Ajude outros contribuidores
- Participe das discussões
- Compartilhe conhecimento

## Recursos Adicionais

- [Documentação do Projeto](docs/)
- [Guia de Estilo](STYLEGUIDE.md)
- [Código de Conduta](CODE_OF_CONDUCT.md)
- [FAQ](FAQ.md)

## Suporte

Se precisar de ajuda ou tiver dúvidas:
- Abra uma issue
- Entre em contato com os mantenedores
- Consulte a documentação
- Participe da comunidade

Obrigado por contribuir com o projeto Biblia! 