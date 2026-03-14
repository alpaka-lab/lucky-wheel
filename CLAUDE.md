# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Vite dev server (http://localhost:5173)
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

No test framework or linter is configured.

## Architecture

Vanilla JavaScript app using Vite as the build tool. No frameworks. All state persists to `localStorage`.

### Key modules (all in `src/`):

- **state.js** — `State` class: manages participants, settings (title, duration, speed, theme). Uses a pub/sub pattern (`subscribe`/`notify`) to update both the UI and the wheel canvas when data changes. Persists to `localStorage` under key `wheelData` with backward-compat migration from older `spinWheelParticipants` key.
- **wheel.js** — `Wheel` class: renders the spinning wheel on an HTML5 Canvas. Handles spin physics (acceleration phase → friction-based deceleration), segment-crossing tick sounds via Web Audio API, and winner determination based on pointer angle. Exposes `onSpinEnd` callback.
- **i18n.js** — Translation strings for English (`en`) and Thai (`th`). Uses `data-i18n` and `data-i18n-placeholder` HTML attributes for DOM text binding.
- **main.js** — Entry point: wires DOM events, instantiates `State` and `Wheel`, manages settings modal, winner modal, language toggle (persisted to `localStorage` key `appLang`), and participant list rendering.
- **counter.js** — Unused Vite scaffold file.

### UI patterns

- i18n is attribute-driven: elements use `data-i18n="key"` for text and `data-i18n-placeholder="key"` for placeholders. `updateLanguage()` in main.js queries these attributes.
- Modals (settings, winner) use a `.modal-overlay.hidden` pattern toggled via `classList`.
- Themes apply a `theme-{name}` class on `<body>` with 12 gradient themes defined in CSS.
