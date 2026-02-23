# Data Model (Local Draft)

Este documento define o modelo persistivel usado no Nivel 1 antes da conexao com backend.

## Objetivos

- Manter compatibilidade futura com banco (documento versionado).
- Permitir migracoes por `schemaVersion`.
- Salvar e restaurar rascunho local via `localStorage`.

## Chave de armazenamento

- `page_builder_state_v1`

## Documento persistido

```json
{
  "schemaVersion": 1,
  "product": {
    "level": 1
  },
  "auth": {
    "logged": true,
    "userEmail": "usuario@exemplo.com"
  },
  "page": {
    "id": "page_ab12cd",
    "title": "Minha Pagina Profissional",
    "subtitle": "Edite as secoes no painel e veja o resultado em tempo real.",
    "sections": [
      {
        "id": "sec_x1y2z3",
        "type": "hero",
        "data": {
          "bgMode": "color",
          "bgColor": "#0e7490",
          "bgImage": "",
          "profileImage": "",
          "profileSize": 120,
          "title": "Seu Nome Profissional",
          "subtitle": "Especialista em resultado rapido com pagina personalizada",
          "titleColor": "#ffffff",
          "titleSize": 42,
          "titleWeight": 700,
          "subtitleColor": "#d1fae5",
          "subtitleSize": 19,
          "subtitleWeight": 500
        }
      }
    ],
    "footer": {
      "title": "Contato",
      "content": "WhatsApp: (00) 00000-0000"
    },
    "settings": {
      "theme": "oceanic",
      "locale": "pt-BR"
    },
    "meta": {
      "updatedAt": "2026-02-23T12:00:00.000Z"
    }
  }
}
```

## Regras de hidratacao/sanitizacao

- Campo ausente ou invalido: cai para valor default.
- Colecoes vazias de cards/planos: recebem 1 item padrao para evitar estado quebrado.
- Campos numericos: passam por `clamp` em limites de negocio (ex.: `durationDays` 0..365).
- `product.level`: sempre normalizado para faixa `1..5`.

## Arquitetura de niveis

- Nivel 1: fluxo local, preview em tempo real, persistencia local.
- Nivel 2: autenticacao em nuvem, sync com banco, storage de imagens.
- Nivel 3: templates, analytics, dominio customizado.
- Nivel 4: multi-tenant, billing, controle de permissao.
- Nivel 5: marketplace e automacoes.

## Feature flags

As flags sao declaradas por catalogo com `unlockAt` e resolvidas localmente por nivel ativo.

Exemplo:

- `localDraft` desbloqueia no nivel 1.
- `cloudSync` desbloqueia no nivel 2.
- `billing` desbloqueia no nivel 4.

Esse desenho permite trocar o nivel por plano comercial no backend sem mudar o frontend base.
