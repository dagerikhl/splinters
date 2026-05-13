# Splinters

**Live:** https://dagerikhl.github.io/splinters/

Interactive 3D visualization of the Shattering of Adonalsium and the resulting Cosmere Shards.

Adonalsium starts as a single octahedron diamond. Scrub the timeline (or hit the **Splinter** button) and it fractures into 16 Voronoi-cut Shards, each tinted with its canon aspect color. Subsequent events on the canonical timeline splinter individual Shards further (Honor at T14, Devotion + Dominion at T7, Ambition at T9), and combine others (Preservation + Ruin → Harmony at T16; Honor + Odium → Retribution at T20). Aethers and Dawnshards orbit independently as canon allows.

Click any entity to inspect it — vessel, planetary system, events, Coppermind citations.

## Stack

- Next 16 + React 19, TypeScript
- React Three Fiber 9 / drei 10 / postprocessing
- three.js with `@dgreenheck/three-pinata` for Voronoi fracture
- Zustand for state, Vitest for unit tests, Playwright for visual checks

## Development

```bash
yarn dev          # http://localhost:3000
yarn lint         # eslint
yarn test         # vitest
yarn visual-check # Playwright screenshots to tmp/screenshots/
```

Node 22+ required.
