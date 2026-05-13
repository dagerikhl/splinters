# Splinters

> Interactive 3D visualization of the Shattering of Adonalsium and the resulting Cosmere Shards.

**[→ Open the live demo](https://dagerikhl.github.io/splinters/)**

[![License: GPL v3](https://img.shields.io/badge/license-GPL_3.0-blue.svg)](LICENSE)
[![Deploy](https://github.com/dagerikhl/splinters/actions/workflows/deploy.yml/badge.svg)](https://github.com/dagerikhl/splinters/actions/workflows/deploy.yml)

---

Adonalsium starts as a single octahedron diamond. Scrub the timeline (or hit the **Splinter** button) and it fractures into 16 Voronoi-cut Shards, each tinted with its canon aspect color. Subsequent events on the canonical timeline splinter individual Shards further — Honor at T14, Devotion + Dominion at T7, Ambition at T9 — and combine others: Preservation + Ruin → Harmony at T16, Honor + Odium → Retribution at T20. Aethers and Dawnshards orbit independently as canon allows.

Click any entity to inspect its vessel, planetary system, events, and Coppermind citations.

## Features

- 16 Shards rendered as Voronoi-cut crystal fragments, colored by canon aspect
- Scrubable timeline mapping canonical events to splinterings, combinations, and lifecycles
- Manual splinter/unsplinter on individual Shards
- Aethers and Dawnshards rendered independently
- Detail panel with vessel, planetary system, events, and Coppermind citations
- Camera orbit, pan, zoom, and reset

## Stack

| Area      | Tools                                                                              |
| --------- | ---------------------------------------------------------------------------------- |
| Framework | Next 16, React 19, TypeScript                                                      |
| 3D        | three.js, React Three Fiber 9, drei, postprocessing                                |
| Fracture  | [`@dgreenheck/three-pinata`](https://github.com/dgreenheck/three-pinata) (Voronoi) |
| State     | Zustand                                                                            |
| Testing   | Vitest (unit), Playwright (visual)                                                 |

## Development

Requires Node 22+ and Yarn.

```bash
yarn install
yarn dev          # http://localhost:3000
```

Other scripts:

```bash
yarn lint           # eslint
yarn prettify       # check formatting
yarn test           # vitest
yarn visual-check   # Playwright screenshots to tmp/screenshots/
yarn build          # production build (static export to out/)
```

## Deployment

The site deploys to GitHub Pages on every push to `main` via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The build runs `next build` with `output: 'export'` behind a `GITHUB_PAGES=true` flag, so `basePath` is only applied in CI — local development stays rooted at `/`.

## License

[GPL-3.0-only](LICENSE)
