/**
 * ryzotropik — ASCII morph: figures (e.g. mushroom ↔ motherboard) via a shared Figure abstraction.
 * Modular layout: tweak CONFIG, add Figure subclasses, or morph between any two figures.
 */

// ---------------------------------------------------------------------------
// Config — single place to tune look and timing
// ---------------------------------------------------------------------------

const CFG = {
  textSize: 12,
  background: [18, 22, 28],
  colorMushroom: [232, 216, 190],
  colorCircuit: [64, 255, 180],
  morphSpeed: 0.02,
  morphWave: false,
  /** Characters from dim → bright (organic / metallic read) */
  asciiRamp: " .'`^\",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&%@",
};

// ---------------------------------------------------------------------------
// Time → morph factor t in [0, 1]
// ---------------------------------------------------------------------------

function morphFactorFromTime(ms) {
  if (CFG.morphWave) {
    const phase = ms * CFG.morphSpeed;
    return 0.5 + 0.5 * Math.sin(phase);
  }
  const period = 8000;
  return (ms % period) / period;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ---------------------------------------------------------------------------
// Normalized grid coords: nx, ny in roughly [0, 1]
// ---------------------------------------------------------------------------

function normXY(ix, iy, cols, rows) {
  return {
    nx: (ix + 0.5) / cols,
    ny: (iy + 0.5) / rows,
  };
}

// ---------------------------------------------------------------------------
// Shared SDF helpers for scalar fields (~[0, 1] ink)
// ---------------------------------------------------------------------------

/** Ellipse SDF: negative inside, positive outside (softened). */
function sdEllipse(nx, ny, cx, cy, rx, ry) {
  const px = (nx - cx) / rx;
  const py = (ny - cy) / ry;
  return Math.sqrt(px * px + py * py) - 1;
}

/** Smooth 0..1 from signed distance (inside brighter). */
function sdfToIntensity(d, inner, outer) {
  return constrain(map(d, outer, inner, 0, 1), 0, 1);
}

// ---------------------------------------------------------------------------
// Figure — abstraction: name, RGB, and per-cell intensity
// ---------------------------------------------------------------------------

class Figure {
  /**
   * @param {string} name
   * @param {[number, number, number]} rgb
   */
  constructor(name, rgb) {
    this.name = name;
    this.rgb = rgb;
  }

  /**
   * @param {number} ix
   * @param {number} iy
   * @param {number} cols
   * @param {number} rows
   * @returns {number} intensity in [0, 1]
   */
  intensity(ix, iy, cols, rows) {
    throw new Error(`${this.constructor.name}.intensity() must be implemented`);
  }
}

/**
 * Cubensis-inspired silhouette: convex cap + central stem + subtle veil hint.
 */
class MushroomFigure extends Figure {
  constructor(rgb) {
    super("mushroom", rgb);
  }

  intensity(ix, iy, cols, rows) {
    const { nx, ny } = normXY(ix, iy, cols, rows);

    const capD = sdEllipse(nx, ny, 0.5, 0.34, 0.4, 0.2);
    const cap = sdfToIntensity(capD, -0.08, 0.12);

    const stemW = 0.055;
    const stem =
      nx > 0.5 - stemW &&
      nx < 0.5 + stemW &&
      ny > 0.42 &&
      ny < 0.94
        ? sdfToIntensity(Math.abs(nx - 0.5) / stemW - 1, -0.2, 0.35)
        : 0;

    const annulus =
      nx > 0.38 &&
      nx < 0.62 &&
      ny > 0.4 &&
      ny < 0.46
        ? 0.35 * (1 - Math.abs(ny - 0.43) / 0.03)
        : 0;

    const gills =
      ny > 0.36 &&
      ny < 0.44 &&
      capD < 0.15
        ? 0.25 *
          (0.5 +
            0.5 *
              Math.sin(
                (nx * cols + ny * rows) * 0.9 + noise(ix * 0.1, iy * 0.1) * 4
              ))
        : 0;

    const speckle =
      0.08 * noise(ix * 0.31 + 20, iy * 0.29 + 10) * (cap > 0.3 ? 1 : 0);

    return constrain(Math.max(cap, stem, annulus, gills) + speckle, 0, 1);
  }
}

/**
 * Motherboard-like traces, vias, and a “chip” block; deterministic per cell.
 */
class MotherboardCircuitFigure extends Figure {
  constructor(rgb) {
    super("motherboard", rgb);
  }

  intensity(ix, iy, cols, rows) {
    const { nx, ny } = normXY(ix, iy, cols, rows);
    const n = noise(ix * 0.08, iy * 0.08);

    let v = 0;

    const busH = ny > 0.48 && ny < 0.52 ? 0.75 : 0;
    const busV = nx > 0.48 && nx < 0.52 ? 0.72 : 0;
    v = Math.max(v, busH, busV);

    const pitchX = Math.max(4, Math.floor(cols / 18));
    const pitchY = Math.max(3, Math.floor(rows / 14));
    const onGridH = iy % pitchY === 0 ? 0.45 + 0.2 * n : 0;
    const onGridV = ix % pitchX === 0 ? 0.42 + 0.18 * n : 0;
    v = Math.max(v, onGridH, onGridV);

    const branch =
      (ix + iy) % 7 === 0 && (ix % 3 === 0 || iy % 3 === 0) ? 0.35 : 0;
    v = Math.max(v, branch);

    const via = ix % pitchX === 0 && iy % pitchY === 0 ? 0.55 : 0;
    v = Math.max(v, via);

    const chipLeft = 0.58;
    const chipRight = 0.88;
    const chipTop = 0.12;
    const chipBot = 0.38;
    if (nx > chipLeft && nx < chipRight && ny > chipTop && ny < chipBot) {
      const inner =
        nx > chipLeft + 0.03 &&
        nx < chipRight - 0.03 &&
        ny > chipTop + 0.03 &&
        ny < chipBot - 0.03;
      v = Math.max(v, inner ? 0.95 : 0.7);
      if ((ix + iy) % 2 === 0 && inner) v = Math.min(1, v + 0.05);
    }

    const pad =
      dist(nx, ny, 0.22, 0.72) < 0.045 || dist(nx, ny, 0.78, 0.78) < 0.04
        ? 0.5
        : 0;
    v = Math.max(v, pad);

    return constrain(v + 0.06 * (n - 0.5), 0, 1);
  }
}

/** Default scene pair; swap or extend with new Figure subclasses. */
const FIGURES = {
  mushroom: new MushroomFigure(CFG.colorMushroom),
  motherboard: new MotherboardCircuitFigure(CFG.colorCircuit),
};

// ---------------------------------------------------------------------------
// Morph — blend any two figures (intensity + display color)
// ---------------------------------------------------------------------------

/**
 * @param {Figure} from
 * @param {Figure} to
 * @param {number} tSmooth eased t in [0, 1]
 */
function morphIntensity(from, to, tSmooth, ix, iy, cols, rows) {
  const a = from.intensity(ix, iy, cols, rows);
  const b = to.intensity(ix, iy, cols, rows);
  return lerp(a, b, tSmooth);
}

/**
 * Color cross-fade tied to morph progress and local brightness.
 * @param {Figure} from
 * @param {Figure} to
 */
function morphFigureColor(from, to, intensity, tSmooth) {
  const cFrom = color(from.rgb[0], from.rgb[1], from.rgb[2]);
  const cTo = color(to.rgb[0], to.rgb[1], to.rgb[2]);
  const u = constrain(intensity * 0.65 + tSmooth * 0.35, 0, 1);
  return lerpColor(cFrom, cTo, u);
}

function scalarToChar(intensity) {
  const ramp = CFG.asciiRamp;
  const idx = floor(constrain(intensity, 0, 0.9999) * ramp.length);
  return ramp[idx];
}

// ---------------------------------------------------------------------------
// Grid metrics — monospace cell size for stable columns
// ---------------------------------------------------------------------------

let cellW = 8;
let cellH = 12;

function refreshCellMetrics() {
  push();
  textFont("monospace");
  textSize(CFG.textSize);
  textLeading(CFG.textSize * 1.05);
  cellW = max(textWidth("M"), textWidth("@"), textWidth("#"));
  cellH = CFG.textSize * 1.15;
  pop();
}

function gridDimensions() {
  const cols = max(8, floor(width / cellW));
  const rows = max(6, floor(height / cellH));
  return { cols, rows };
}

/**
 * @param {Figure} fromFigure
 * @param {Figure} toFigure
 * @returns {{ chars: string[][], colors: p5.Color[][] }}
 */
function buildAsciiFrame(cols, rows, tRaw, fromFigure, toFigure) {
  const tSmooth = easeInOutCubic(constrain(tRaw, 0, 1));
  const chars = [];
  const colors = [];
  for (let iy = 0; iy < rows; iy++) {
    chars[iy] = [];
    colors[iy] = [];
    for (let ix = 0; ix < cols; ix++) {
      const s = morphIntensity(fromFigure, toFigure, tSmooth, ix, iy, cols, rows);
      chars[iy][ix] = scalarToChar(s);
      colors[iy][ix] = morphFigureColor(fromFigure, toFigure, s, tSmooth);
    }
  }
  return { chars, colors };
}

function drawAsciiFrame(chars, colors, offsetX, offsetY) {
  push();
  textFont("monospace");
  textSize(CFG.textSize);
  textLeading(CFG.textSize * 1.05);
  noStroke();
  textAlign(LEFT, TOP);
  const rows = chars.length;
  const cols = rows > 0 ? chars[0].length : 0;
  for (let iy = 0; iy < rows; iy++) {
    for (let ix = 0; ix < cols; ix++) {
      fill(colors[iy][ix]);
      text(chars[iy][ix], offsetX + ix * cellW, offsetY + iy * cellH);
    }
  }
  pop();
}

// ---------------------------------------------------------------------------
// p5 lifecycle
// ---------------------------------------------------------------------------

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  c.parent(document.body);
  pixelDensity(1);
  refreshCellMetrics();
}

function draw() {
  background(CFG.background[0], CFG.background[1], CFG.background[2]);
  const t = morphFactorFromTime(millis());
  const { cols, rows } = gridDimensions();
  const { chars, colors } = buildAsciiFrame(
    cols,
    rows,
    t,
    FIGURES.mushroom,
    FIGURES.motherboard
  );
  const gridPixelW = cols * cellW;
  const gridPixelH = rows * cellH;
  const ox = (width - gridPixelW) / 2;
  const oy = (height - gridPixelH) / 2;
  drawAsciiFrame(chars, colors, ox, oy);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  refreshCellMetrics();
}
