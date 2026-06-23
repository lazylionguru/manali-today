#!/usr/bin/env node
/**
 * generate-cover.js — manali.today blog cover/thumbnail generator
 *
 * Renders two images per post using Puppeteer (same tooling as RemoteStack):
 *   - cover.jpg  (1200x630, used for the featured hero + OG/social share)
 *   - thumb.jpg  (400x225, used for grid cards, simplified, icon-led)
 *
 * Usage (called from blog.py):
 *   node generate-cover.js "<title>" "<type>" "<outputDir>"
 *
 * type must be one of: village, trek, seasonal_event, food, culture, practical
 * Unknown types fall back to a neutral grey + compass treatment rather than
 * failing, so adding a new topic type in blog_topics.py never breaks the
 * pipeline, it just looks generic until a matching icon/color is added below.
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const FONTS_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=Inter:wght@500;600&display=swap');`;

// ── Category visual system ───────────────────────────────────────────────────
// Colors deliberately avoid the site's reserved status meanings:
// blue = yes/open (checkers), grey = no/closed, yellow = caution-only (Atal
// Tunnel AWD state), teal = the live-pulse dot. None of those get reused
// here as a *category* color except blue/grey/teal-adjacent tones chosen
// to be visually distinct from the literal reserved hexes.

const CATEGORIES = {
  village: {
    label: 'Village',
    tint: '#c6e3ff', tintDark: '#6fa8d8', tintGlow: 'rgba(198,227,255,0.18)',
    icon: `
      <path d="M10 28 L32 12 L54 28"/>
      <path d="M14 30 L32 18 L50 30"/>
      <rect x="16" y="30" width="32" height="22"/>
      <line x1="16" y1="36" x2="48" y2="36"/>
      <line x1="16" y1="42" x2="48" y2="42"/>
      <line x1="16" y1="48" x2="48" y2="48"/>
      <rect x="28" y="40" width="8" height="12"/>
    `,
  },
  trek: {
    label: 'Trail Guide',
    tint: '#7fe0c9', tintDark: '#3a9e85', tintGlow: 'rgba(127,224,201,0.18)',
    icon: `
      <path d="M4 52 L24 16 L34 32 L40 22 L60 52 Z"/>
      <path d="M10 52 Q30 40 54 52" stroke-dasharray="2 3"/>
    `,
  },
  seasonal_event: {
    label: 'Seasonal',
    tint: '#b9aef0', tintDark: '#7b6dc2', tintGlow: 'rgba(185,174,240,0.18)',
    icon: `
      <path d="M4 54 L20 30 L28 40 L36 26 L60 54 Z"/>
      <circle cx="18" cy="14" r="6"/>
      <line x1="18" y1="3" x2="18" y2="6"/>
      <line x1="18" y1="22" x2="18" y2="25"/>
      <line x1="7" y1="14" x2="10" y2="14"/>
      <line x1="26" y1="14" x2="29" y2="14"/>
      <path d="M42 8 A7 7 0 1 0 42 21 A5.5 5.5 0 1 1 42 8 Z"/>
    `,
  },
  food: {
    label: 'Local Food',
    tint: '#f0a3a3', tintDark: '#c2696e', tintGlow: 'rgba(240,163,163,0.18)',
    icon: `
      <path d="M16 26 L48 26 L44 46 Q44 50 32 50 Q20 50 20 46 Z"/>
      <ellipse cx="32" cy="52" rx="20" ry="4"/>
      <path d="M48 29 C58 27 60 38 50 39 C48 39.3 47 39 47 39"/>
      <path d="M25 10 Q25 16 21 19 M33 8 Q33 14 29 18 M41 10 Q41 16 37 19" stroke-dasharray="1.5 2.5"/>
    `,
  },
  culture: {
    label: 'Culture',
    tint: '#d9c08a', tintDark: '#a8895a', tintGlow: 'rgba(217,192,138,0.18)',
    icon: `
      <line x1="32" y1="0" x2="32" y2="18"/>
      <path d="M32 4 L46 10 L32 14 Z" fill="#c45a4a" stroke="#c45a4a" fill-opacity="0.85"/>
      <path d="M22 30 C22 22 26 18 32 18 C38 18 42 22 42 30 Z"/>
      <rect x="18" y="30" width="28" height="8"/>
      <path d="M14 54 L24 38 L40 38 L50 54 Z"/>
      <line x1="10" y1="54" x2="54" y2="54"/>
    `,
  },
  practical: {
    label: 'Practical',
    tint: '#aab0bb', tintDark: '#71777f', tintGlow: 'rgba(170,176,187,0.18)',
    icon: `
      <circle cx="32" cy="32" r="22"/>
      <path d="M32 32 L42 20 L36 32 L42 44 Z"/>
      <circle cx="32" cy="32" r="2" fill="currentColor"/>
    `,
  },
};

const FALLBACK_CATEGORY = {
  label: 'Manali',
  tint: '#aab0bb', tintDark: '#71777f', tintGlow: 'rgba(170,176,187,0.18)',
  icon: CATEGORIES.practical.icon,
};

function getCategory(type) {
  if (CATEGORIES[type]) return CATEGORIES[type];
  console.warn(`  [generate-cover] Unknown type "${type}", using fallback style. Add it to CATEGORIES in generate-cover.js.`);
  return FALLBACK_CATEGORY;
}

// ── Title sizing ──────────────────────────────────────────────────────────────
// Auto-shrink font size based on length so long titles never overflow the
// cover card. Thresholds tuned for Cormorant Garamond at the cover's text
// column width (roughly 990px across left:90px right:140px on a 1200px canvas).

function coverTitleFontSize(title) {
  const len = title.length;
  if (len <= 40) return 64;
  if (len <= 60) return 54;
  if (len <= 80) return 46;
  return 38;
}

// ── HTML templates ────────────────────────────────────────────────────────────

function buildCoverHtml(title, category) {
  const fontSize = coverTitleFontSize(title);
  return `
<!DOCTYPE html><html><head><style>
  ${FONTS_IMPORT}
  * { margin:0; padding:0; box-sizing:border-box }
  body {
    width:1200px; height:630px;
    background:linear-gradient(135deg, #0e1116 0%, #090a0d 100%);
    position:relative; overflow:hidden; font-family:'Inter', sans-serif;
  }
  .accent-bar { position:absolute; top:0; left:0; bottom:0; width:10px;
    background:linear-gradient(180deg, ${category.tint} 0%, ${category.tintDark} 100%); }
  .glow { position:absolute; top:-200px; right:-200px; width:600px; height:600px;
    background:radial-gradient(circle, ${category.tintGlow} 0%, transparent 70%); }
  .eyebrow { position:absolute; top:80px; left:90px;
    font-size:12px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:${category.tint}; }
  .rule { position:absolute; top:115px; left:90px; width:60px; height:2px; background:${category.tint}; }
  .title { position:absolute; left:90px; right:140px; top:155px;
    font-family:'Cormorant Garamond', serif; font-weight:300;
    font-size:${fontSize}px; line-height:1.15; color:rgba(255,255,255,0.97); }
  .brand { position:absolute; bottom:55px; left:90px;
    font-family:'Cormorant Garamond', serif; font-size:20px; color:rgba(255,255,255,0.4); }
  .brand em { font-style:italic; color:rgba(198,227,255,0.6) }
</style></head><body>
  <div class="accent-bar"></div>
  <div class="glow"></div>
  <div class="eyebrow">${category.label}</div>
  <div class="rule"></div>
  <div class="title">${escapeHtml(title)}</div>
  <div class="brand">manali<em>.today</em></div>
</body></html>`;
}

function buildThumbHtml(category) {
  return `
<!DOCTYPE html><html><head><style>
  ${FONTS_IMPORT}
  * { margin:0; padding:0; box-sizing:border-box }
  body { width:400px; height:225px; position:relative; overflow:hidden;
    background:linear-gradient(135deg, #0e1116 0%, #090a0d 100%); font-family:'Inter', sans-serif; }
  .accent-bar { position:absolute; top:0; left:0; bottom:0; width:6px;
    background:linear-gradient(180deg, ${category.tint} 0%, ${category.tintDark} 100%); }
  .glow { position:absolute; top:-80px; right:-80px; width:260px; height:260px;
    background:radial-gradient(circle, ${category.tintGlow} 0%, transparent 70%); }
  .icon { position:absolute; right:28px; top:50%; transform:translateY(-50%);
    width:80px; height:80px; opacity:0.6; color:${category.tint}; }
  .icon svg { width:100%; height:100%; stroke:${category.tint}; fill:none; stroke-width:1.4 }
  .eyebrow { position:absolute; bottom:24px; left:28px;
    font-size:11px; font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:${category.tint}; }
  .mark { position:absolute; top:24px; left:28px;
    font-family:'Cormorant Garamond', serif; font-style:italic; font-size:16px; color:rgba(255,255,255,0.35); }
</style></head><body>
  <div class="accent-bar"></div>
  <div class="glow"></div>
  <div class="mark">.today</div>
  <div class="icon"><svg viewBox="0 0 64 64">${category.icon}</svg></div>
  <div class="eyebrow">${category.label}</div>
</body></html>`;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const [, , title, type, outputDir] = process.argv;

  if (!title || !type || !outputDir) {
    console.error('Usage: node generate-cover.js "<title>" "<type>" "<outputDir>"');
    process.exit(1);
  }

  fs.mkdirSync(outputDir, { recursive: true });
  const category = getCategory(type);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // Cover: 1200x630
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
    await page.setContent(buildCoverHtml(title, category), { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(outputDir, 'cover.jpg'), type: 'jpeg', quality: 90 });

    // Thumb: 400x225
    await page.setViewport({ width: 400, height: 225, deviceScaleFactor: 2 });
    await page.setContent(buildThumbHtml(category), { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(outputDir, 'thumb.jpg'), type: 'jpeg', quality: 90 });

    console.log(`  Generated cover.jpg + thumb.jpg in ${outputDir}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('  [generate-cover] Error:', err.message);
  process.exit(1);
});