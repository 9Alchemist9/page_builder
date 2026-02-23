# Page Builder - Nivel 1

Projeto inicial de um page builder focado em profissionais autonomos.

## Escopo implementado (Nivel 1)

- Tela inicial com login local (validacao basica de email/senha preenchidos).
- Painel de edicao + preview em tempo real.
- Estrutura de secoes empilhaveis com reordenacao:
  - Hero (fundo por cor ou imagem, foto de perfil, titulo/subtitulo com estilo editavel).
  - Descricao/Introducao.
  - Publicacoes (cards com imagem + texto, com reordenacao).
  - Produtos (cards com titulo, preco em R$, pagamento e CTA).
  - Servicos (botao "Ver planos" + modal com cards de planos).
- Rodape editavel.
- Layout responsivo para desktop e mobile.

## Melhorias aplicadas nesta continuidade

- Refino visual (paleta, contraste, profundidade de cards, estados de foco e hover).
- Microinteracoes (modal e toast com animacao curta, feedback visual de controles).
- Persistencia local versionada em `localStorage` com sanitizacao na carga.
- Arquitetura de niveis `1..5` com feature flags locais e limites por nivel.
- Painel com seletor de nivel (simulacao local) para validar evolucao comercial.

## Modelo de dados

- Documento persistivel: `data_model.md`
- Chave local: `page_builder_state_v1`
- Versao de esquema: `schemaVersion: 1`

## Arquivos principais

- `index.html`
- `styles.css`
- `app.js`
- `data_model.md`

## Como executar localmente

1. Abrir `index.html` no navegador.
2. Ou servir localmente:
   - `python3 -m http.server 8080`
   - acessar `http://localhost:8080`

## Proximos niveis sugeridos

- Nivel 2: autenticacao real, persistencia em banco, upload de imagens.
- Nivel 3: templates, dominio customizado, analytics e funil.
- Nivel 4: multi-tenant, billing por plano e permissoes.
- Nivel 5: marketplace de templates/plugins e automacoes.
