# App Graph Builder

A "App Graph Builder" UI built with React, ReactFlow, TanStack Query, and Zustand.

## Setup

```bash
npm install
npm run dev
# Open http://localhost:5173
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with HMR + MSW |
| `npm run build` | TypeScript check + Vite production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript strict check |

## Features

- **Layout**: Top bar, left icon rail, right panel (app list + inspector), dotted canvas
- **Responsive**: Right panel slides in as drawer on mobile (Zustand-controlled)
- **ReactFlow**: Custom ServiceNode, drag/select/delete/zoom/pan, fit-view, Add Node bonus
- **Node Inspector**: Tabs (Config/Runtime), synced slider+input, editable name/description, status badge
- **TanStack Query**: Mock /api/apps and /api/apps/:id/graph with loading/error/caching
- **Zustand**: selectedAppId, selectedNodeId, isMobilePanelOpen, activeInspectorTab

## Key Decisions

1. **MSW** — Intercepts real fetch calls at network level
2. **Custom ServiceNode** — Fully styled to match the screenshot
3. **Window bridge** — `window.__updateNodeData` bridges inspector → ReactFlow state
4. **Tailwind v3** — Stable PostCSS pipeline

## Known Limitations

- Runtime tab metrics use mock static values
- Node edits reset on page refresh (no persistence)
- Mobile drawer triggers at < 768px width

## Structure

```
src/
├── types/       interfaces
├── store/       Zustand
├── hooks/       TanStack Query
├── mocks/       MSW handlers
├── lib/         utilities
└── components/
    ├── canvas/     ReactFlow + ServiceNode
    ├── inspector/  NodeInspector
    ├── layout/     TopBar, LeftRail, RightPanel, AppSelector
    └── ui/         StatusBadge
```
