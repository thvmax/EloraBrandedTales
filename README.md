# Elora — Creative Portfolio

A single-page portfolio site built from `Mo_s_Portfolio.pptx`.

## Stack

Plain HTML + CSS + tiny vanilla JS. No build step. No framework. Ships as a static site.

## Structure

```
elora-portfolio/
├── index.html       ← the whole site (HTML + CSS + JS inlined)
├── vercel.json      ← static-site config, caching headers
├── images/          ← 56 assets extracted from the deck
└── README.md
```

## Run locally

Just open `index.html` in a browser — or serve it:

```bash
# Python 3
python3 -m http.server 3000

# or Node (if you have npx)
npx serve .
```

Then visit http://localhost:3000

## Deploy to Vercel

**Option 1 — via the Vercel CLI** (fastest):

```bash
npm i -g vercel
cd elora-portfolio
vercel
```

Answer the prompts (scope, project name). It will deploy and give you a URL.

**Option 2 — via GitHub + Vercel dashboard**:

1. Push this folder to a GitHub repo.
2. Go to https://vercel.com/new
3. Import the repo. Framework preset: **Other** (or leave as detected).
4. No build command, no output directory — it's pure static.
5. Click **Deploy**.

**Option 3 — drag-and-drop**:

1. Open https://vercel.com/new
2. Drag the `elora-portfolio` folder onto the drop zone.
3. Deploy.

## Sections

1. **Hero** — Working Experience cover
2. **About Me**
3. **Working Experience timeline** — 5 roles, chronological
4. **Reportage Group** — current role + brand grid
5. **Poke.Creative Studio** — role + main brands + 4 featured campaigns
   (Rangoon Tea House · René Mattias · Geon Bae Soju · Printing Bee)
6. **Blink Marketing Agency** — role + 3 campaigns
   (Rakuten Viber · Bawdar Beer · Drink Smart, Drive Safe)
7. **Pocket MM** — role + Yoma Entities + Non-Yoma Merchants + Content Creation + TVC + KOLs
8. **Thank You** footer

## Hyperlinks preserved

All "CLICK HERE" links from the original deck are active on the campaign tiles — they open in new tabs:

- **Rangoon Tea House** → 3 TikTok videos + 2 LinkedIn recap posts
- **René Mattias** → Facebook teaser video
- **Geon Bae Soju** → Poke.Creative Studio Facebook post

## Editing

Everything is in one file (`index.html`). CSS is inside a single `<style>` block at the top — CSS variables for theme live in `:root` and are easy to swap.

Brand palette:

- `--bg` `#0a0a0a`
- `--pink` `#ff2d6e` (the accent)
- `--text` `#ffffff`
