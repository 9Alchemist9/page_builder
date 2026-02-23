# Codex Handover - Page Builder

Data de atualizacao: 23/02/2026

## Projeto

- Nome: `page_builder`
- Caminho: `\\wsl.localhost\Ubuntu\home\alchemist\page_builder\page_builder`
- Objetivo: page builder comercial para profissionais autonomos, com niveis de maturidade do produto.

## Status atual (Nivel 1 concluido)

- Login local (fluxo inicial sem backend).
- Builder com preview em tempo real.
- Seções empilhaveis com reordenacao:
  - Hero (fundo imagem/cor, perfil, titulo/subtitulo, estilos).
  - Descricao/Introducao.
  - Publicacoes (cards editaveis + reordenacao).
  - Produtos (cards com titulo, preco R$, pagamento e botao).
  - Servicos (botao "Ver planos" + modal com cards de planos).
- Rodape editavel.
- Responsivo para desktop e mobile.

## Arquivos principais

- `index.html`
- `styles.css`
- `app.js`
- `README.md`

## Decisoes do usuario nesta sessao

- Antes do nivel 2: salvar tudo no GitHub e pausar.
- Banco de dados: **nao conectar ainda**; manter local para testes.
- Modelo comercial: cobranca unica por nivel de pagina + adicional por pacotes de consumo em nuvem.
- Prioridade de UX/visual: ajustar visual antes de avancar de fase (pedido para a proxima sessao).

## Recomendacao tecnica para quando iniciar Nivel 2

- Recomendado: **Supabase** (autenticacao + banco + storage + RLS) por velocidade de entrega e boa base para SaaS comercial.
- Alternativa: backend proprio Node + PostgreSQL se houver necessidade forte de controle total e equipe tecnica dedicada.

## Atualizacao desta sessao (23/02/2026)

- Refino visual aplicado no frontend (tokens visuais, foco, hover, cards, modal/toast).
- Persistencia local versionada implementada em `app.js`:
  - `schemaVersion: 1`
  - `localStorage` key: `page_builder_state_v1`
  - hidratacao com sanitizacao/fallback.
- Estrutura de niveis preparada no frontend:
  - niveis `1..5` com limites por nivel.
  - feature flags por `unlockAt`.
  - seletor de nivel no painel (simulacao local).
- Documento tecnico criado: `data_model.md`.
- Grande rodada de refinamentos de UX do builder/preview:
  - Sidebar mais compacta (campos menores, menos ruido visual, tema mais neutro).
  - Apenas um editor de secao aberto por vez (accordion global).
  - Rodape editavel com colapso e controles alinhados ao padrao das secoes.
  - Hero com upload por explorer para fundo e imagem de perfil.
  - Hero com customizacao de alinhamento/posicao de textos e imagem (X/Y).
  - Sliders com campo numerico sincronizado (digitacao + arraste).
  - Escolha de fonte para titulos e textos.
  - Preview com barra de dispositivos (desktop/tablet/mobile), olho (publicada) e avatar (dados da conta).
  - Visualizacao publicada integrada ao fluxo do builder.
  - Hero com novos modos de fundo: sem preenchimento, cor solida, gradiente e imagem.
  - Hero com largura/altura configuraveis (com unidades CSS).
  - Correcao de preview para `vw` no Hero considerar a largura da tela simulada no builder.
  - Imagem de fundo do Hero sem overlay azul forcado.
  - Subsecoes colapsaveis no editor do Hero (`Fundo`, `Imagem de perfil`, `Titulo`, `Subtitulo`).
  - Colapso com chevron (mesmo estilo visual de combobox), substituindo triangulos.
  - Foto de perfil do Hero reposicionada em relacao ao centro absoluto do Hero (`0x/0y = centro`) com limite automatico nas bordas.
  - Titulo e subtitulo do Hero passaram a usar a mesma regra da foto de perfil (centro absoluto + limites nas bordas do Hero).
  - Drag por mouse no preview (builder) para elementos posicionaveis:
    - Hero: foto de perfil, titulo e subtitulo.
    - Rodape: titulo e conteudo.
  - Clamps dinamicos para offsets do Rodape (inclusive ao digitar nos campos/sliders), impedindo ultrapassar bordas do container.
  - `border-radius` da foto de perfil do Hero padronizado em escala `0..100` (percentual), onde `0` = quadrado e `100` = totalmente redondo.
  - Botoes de acao no Hero/Rodape ficaram contextuais:
    - `Adicionar` so aparece quando o item esta oculto/ausente.
    - `Remover` usa icone de lixeira (padrao visual das secoes).
  - Campos de URL/upload de imagem do Hero mais compactos e alinhados.

## Pendencias para a proxima sessao

1. Definir identidade final de marca (logo oficial + direcao visual definitiva).
2. Validar mapeamento de feature flags contra precificacao comercial final.
3. Planejar migracao de estado local para backend (auth + banco + storage no Nivel 2).
4. Depois dos testes locais: conectar autenticacao e persistencia reais.

## Como rodar

1. Abrir `index.html` no navegador.
2. Ou servir localmente:
   - `python3 -m http.server 3000`
   - `http://localhost:3000`

## Observacoes operacionais

- O projeto e atualmente frontend estatico (HTML/CSS/JS puro).
- Nao ha testes automatizados nesta etapa.
- Nao iniciar "passo 2" nesta sessao (pedido explicito do usuario).
