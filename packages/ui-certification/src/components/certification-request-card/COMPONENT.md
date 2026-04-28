# CertificationRequestCard

Scaffolded by `scaffold workspace-ui add-component`, then ported from the PT1 request overview app.

## Purpose

`CertificationRequestCard` is a presentational overview card for certification request drafts and submitted requests.
It owns no routing or data fetching. Apps pass display-ready labels and provide `onOpen` when the card should behave as an interactive launcher.

## Story Coverage

- Draft request
- Submitted request
- Request without a product/value
- Static preview without `onOpen`

## Checklist

1. **Presentation** — `CertificationRequestCard.tsx` only; no data fetching.
2. **State** — Keep state in the consuming app or story.
3. **Formatting** — Match project Prettier/oxfmt (2 spaces in generated files).
