# Page Builder - Nivel 1

Projeto inicial de um page builder focado em profissionais autonomos.

## Escopo implementado (Nivel 1)

- Tela inicial com login local (validacao basica de email/senha preenchidos).
- Apos login: painel de edicao + preview em tempo real da pagina.
- Seções empilhaveis com reordenacao:
  - Hero (fundo por cor ou imagem, imagem de perfil, titulo/subtitulo com estilo editavel).
  - Descricao/Introducao.
  - Publicacoes (cards com imagem + texto, com reordenacao).
  - Produtos (cards add/edit/remove com titulo, preco em R$, pagamento e botao comprar).
  - Servicos (somente botao "Ver planos" na pagina e modal com cards de planos).
- Rodape editavel (titulo e conteudo livre para contatos e outros elementos).
- Layout responsivo para desktop e mobile.

## Arquivos principais

- `index.html`
- `styles.css`
- `app.js`

## Como executar localmente

1. Abra `index.html` no navegador.
2. Para um ambiente local com servidor:
   - `python3 -m http.server 8080`
   - acesse `http://localhost:8080`

## Proximos niveis sugeridos

- Nivel 2: autenticacao real, persistencia (API + banco), upload de imagens.
- Nivel 3: templates, dominio customizado, analytics e funil de conversao.
- Nivel 4: multi-tenant, billing/assinatura, limite por plano.
- Nivel 5: marketplace de templates/plugins e automacoes de marketing.
