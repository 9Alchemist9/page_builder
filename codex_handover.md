# Codex Handover - Page Builder

Data de atualizacao: 23/02/2026

## Projeto

- Nome: `page_builder`
- Caminho: `\\wsl.localhost\Ubuntu\home\alchemist\projects\page_builder`
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

## Pendencias para a proxima sessao

1. Refino visual/identidade (cores, tipografia, logo, microinteracoes).
2. Definir estrutura de dados persistivel (mesmo sem conectar no banco ainda).
3. Preparar arquitetura de niveis (1 a 5) com feature flags por plano.
4. Depois dos testes locais: conectar autenticacao e persistencia.

## Como rodar

1. Abrir `index.html` no navegador.
2. Ou servir localmente:
   - `python3 -m http.server 8080`
   - `http://localhost:8080`

## Observacoes operacionais

- O projeto e atualmente frontend estatico (HTML/CSS/JS puro).
- Nao ha testes automatizados nesta etapa.
- Nao iniciar "passo 2" nesta sessao (pedido explicito do usuario).
