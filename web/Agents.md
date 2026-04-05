# Micelio — web / p5.js agent notes

**Read repository root [`Agents.md`](../Agents.md) first.** It defines Micelio-wide layout, Docker and `web/` workflows, nginx/DNS testing, security, and the pre-merge checklist. **This file** adds conventions for **p5.js** and similar **static browser sketches** living under `web/` (for example `web/ryzotropik/`).

When a task touches **only** p5 or static HTML/JS/CSS in `web/`, follow **both** documents: repo rules here stay binding; p5 specifics below refine how sketches are structured.

## Alignment with `web/` and static hosting

- Use **`cd web && make help`** for build/up/down and documented targets; mirror existing `Makefile` and `docker-compose.yml` patterns when changing automation.
- If you edit **nginx** config under `web/`, validate it the way root `Agents.md` describes (`nginx -t` with the same image/version where possible).
- If JavaScript grows beyond trivial sketches, add **fast, deterministic** tests as described under **Frontend / static assets** in root `Agents.md`.
- **No secrets** in sketch code or HTML; p5 runs entirely in the browser (same rule as root security section).

---

## Sketch project layout

- **One sketch folder per piece** (e.g. `web/ryzotropik/`): `index.html`, `sketch.js`, optional assets.
- **Keep `index.html` minimal**: load p5 (CDN or local), one script entry point, small CSS for full-viewport canvas (`margin: 0`, `overflow: hidden` if needed).
- **Split only when it helps**: one `sketch.js` is fine if sections are clearly labeled; extract modules when reuse or testing demands it (use ES modules only if your server supports `type="module"`).

## Global vs instance mode

- **Global mode** (`setup` / `draw` in the global scope) is fine for small demos and matches most tutorials.
- **Instance mode** (`new p5((p) => { ... })`) is better when you need **multiple canvases**, namespacing, or embedding in larger apps without globals.

## Lifecycle and structure

- Put initialization in **`setup()`** (canvas, fonts, initial state). Put per-frame work in **`draw()`**.
- Use **`preload()`** for `loadImage`, `loadFont`, `loadJSON`, etc., so assets are ready before `setup`.
- Call **`noLoop()`** for static or event-driven sketches; use **`redraw()`** when something changes.
- Handle **`windowResized()`** when using full-window canvases: `resizeCanvas(windowWidth, windowHeight)` and recompute any layout that depends on size.

## Drawing and text

- Set **`textFont`**, **`textSize`**, and **`textAlign`** explicitly; do not rely on defaults across browsers.
- For **ASCII grids**, use a **monospace** font and measure **`textWidth`** (and a consistent line height) to compute columns and rows—avoid hard-coded cell sizes that drift between OS/fonts.
- **`pixelDensity(1)`** avoids oversized canvases on HiDPI when you care about exact pixel layout or performance.

## Performance

- Avoid **allocating large arrays every frame** if unnecessary; reuse buffers or only rebuild when `t` or size changes for heavy pieces.
- Prefer **`createGraphics()`** for expensive layers that rarely change.
- For many sprites, use **`texture()`** with offscreen graphics or image atlases instead of thousands of `text()` calls if you hit frame limits (ASCII art is usually fine at modest grid sizes).

## Randomness and determinism

- **`randomSeed()`** / **`noiseSeed()`** at the start of `setup` if you need **reproducible** output (debug, tests, thumbnails).
- Use **`noise()`** for smooth organic variation; use **`random()`** for discrete choices.

## Errors and debugging

- Prefer **`console.log`** with clear tags during development; remove noisy logs before merge.
- Guard optional APIs (microphone, WebGL) with capability checks so static hosting does not white-screen.

## Accessibility and UX

- If the canvas is the whole UI, provide a **page title** and consider a **short description** in HTML for screen readers where the art is decorative.
- Avoid **seizure-inducing** full-screen flashing; cap contrast flicker frequency for public pages.

## Versioning

- **Pin the p5 version** in the CDN URL (e.g. `@1.6.0`) so sketches do not break on silent major updates.

## CORS and external assets

- Sketches that load external URLs may hit **CORS**; prefer **same-origin** assets or headers configured on the asset host.
