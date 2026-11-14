#!/usr/bin/env node
/* Generates the pages under /work and /insights, and sitemap.xml.
   No dependencies:  node build.mjs
   - Case studies come from data/work.js (the homepage reads the same file).
   - Articles come from content/insights/*.md (files starting with "_" are skipped).
   - To move to a new domain, change SITE below and run the build once. */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const SITE = 'https://elora-branded-tales.vercel.app';
const NAME = 'Ei Chaw Myint Mo';
const ROLE = 'Social media specialist · Dubai, UAE';
const MAIL = 'eichawmyintmo@gmail.com';

const root = path.dirname(fileURLToPath(import.meta.url));
const WORK = createRequire(import.meta.url)('./data/work.js');
const DRAFTS = process.argv.includes('--drafts');
const at = (...p) => path.join(root, ...p);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const n2 = i => String(i + 1).padStart(2, '0');
const today = new Date().toISOString().slice(0, 10);
const write = (file, html) => { fs.mkdirSync(path.dirname(at(file)), { recursive: true }); fs.writeFileSync(at(file), html); console.log('  wrote', file); };

const ARROW = '<svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M3 19 19 3M6 3h13v13"/></svg>';
const CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19"/></svg>';
const CHEV = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="${d}"/></svg>`;
const PERSON = { '@type': 'Person', '@id': `${SITE}/#person`, name: NAME, url: `${SITE}/`, jobTitle: 'Social Media Specialist & Strategist' };

/* ───────── articles ───────── */
function inline(s) {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, (m, t, u) => `<a href="${u}"${/^https?:/.test(u) ? ' target="_blank" rel="noopener"' : ''}>${t}</a>`);
}
const IMG = /^!\[(.*?)\]\((\S+?)(?:\s+"(.*?)")?\)$/;
const slugify = s => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
function markdown(src) {
  const out = [], toc = [];
  const blocks = src.replace(/\r/g, '').trim().split(/\n{2,}/);
  for (let b of blocks) {
    b = b.trim(); if (!b) continue;
    const lines = b.split('\n');
    if (b.startsWith(':::slides')) {
      const imgs = lines.map(l => l.trim().match(IMG)).filter(Boolean);
      out.push(`<div class="slides" role="group" aria-label="Carousel slides">${imgs.map(m => `<img src="${esc(m[2])}" alt="${esc(m[1])}" loading="lazy">`).join('')}</div>`);
    } else if (b.startsWith('## ')) { const t = b.slice(3).trim(), id = slugify(t); toc.push([id, t]); out.push(`<h2 id="${id}">${inline(t)}</h2>`); }
    else if (b.startsWith('### ')) out.push(`<h3>${inline(b.slice(4).trim())}</h3>`);
    else if (lines.every(l => l.startsWith('>'))) out.push(`<blockquote>${inline(lines.map(l => l.replace(/^>\s?/, '')).join(' '))}</blockquote>`);
    else if (lines.every(l => /^[-*] /.test(l))) out.push(`<ul>${lines.map(l => `<li>${inline(l.slice(2))}</li>`).join('')}</ul>`);
    else if (lines.every(l => /^\d+\. /.test(l))) out.push(`<ol>${lines.map(l => `<li>${inline(l.replace(/^\d+\. /, ''))}</li>`).join('')}</ol>`);
    else if (IMG.test(b)) { const m = b.match(IMG); out.push(`<figure><img src="${esc(m[2])}" alt="${esc(m[1])}" loading="lazy">${m[3] ? `<figcaption class="caps">${inline(m[3])}</figcaption>` : ''}</figure>`); }
    else out.push(`<p>${inline(lines.join(' '))}</p>`);
  }
  return { html: out.join('\n'), toc };
}
function readArticles() {
  const dir = at('content/insights');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.md') && (DRAFTS || !f.startsWith('_'))).map(f => {
    const raw = fs.readFileSync(path.join(dir, f), 'utf8');
    const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!m) throw new Error(`${f}: missing the --- header block`);
    const meta = Object.fromEntries(m[1].split('\n').filter(l => l.includes(':')).map(l => { const i = l.indexOf(':'); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));
    for (const k of ['title', 'description', 'date']) if (!meta[k]) throw new Error(`${f}: "${k}" is required in the header`);
    const body = markdown(m[2]);
    const words = m[2].replace(/[#>*\-\[\]()!:]/g, ' ').split(/\s+/).filter(Boolean).length;
    return { ...meta, slug: f.replace(/^_/, '').replace(/\.md$/, ''), ...body, mins: Math.max(1, Math.round(words / 200)) };
  }).sort((a, b) => b.date.localeCompare(a.date));
}
const ARTICLES = readArticles();
const HAS_INSIGHTS = ARTICLES.length > 0;
const fmtDate = d => new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

/* ───────── shared page parts ───────── */
function head({ title, desc, url, image, type = 'article', ld, preloadImg }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="author" content="${NAME}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#0c0a09">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="${NAME}">
<meta property="og:locale" content="en_AE">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${image}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${image}">
<link rel="preload" href="/assets/fonts/archivo-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/archivo-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin>${preloadImg ? `\n<link rel="preload" href="${preloadImg}" as="image">` : ''}
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='g'%3E%3Cstop stop-color='%23ff6a00'/%3E%3Cstop offset='1' stop-color='%23ffb8d2'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='32' height='32' rx='9' fill='%230a0807'/%3E%3Ccircle cx='16' cy='16' r='7' fill='url(%23g)'/%3E%3C/svg%3E">
<link rel="stylesheet" href="/assets/site.css">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': ld })}</script>
<script>document.documentElement.classList.add('js')</script>
</head>`;
}
const topRow = (crumbs, back, label) => `<header class="top">
  <p class="crumb caps">${crumbs.map(([t, u, opt], k) => `<span class="c${opt ? ' opt' : ''}">${k ? '<span aria-hidden="true">/</span>' : ''}${u ? `<a href="${u}">${esc(t)}</a>` : esc(t)}</span>`).join('')}</p>
  <a class="x" href="${back}" aria-label="${esc(label)}">${CLOSE}</a>
</header>`;
const barNav = current => `<nav class="bar-nav" aria-label="Primary">
  <div class="l"><i class="dot"></i><a href="/">${NAME}</a><span class="mist">— Social Media Strategist</span></div>
  <nav><a href="/#projects"${current === 'work' ? ' aria-current="true"' : ''}>Projects,</a>${HAS_INSIGHTS ? ` <a href="/insights"${current === 'insights' ? ' aria-current="true"' : ''}>Insights,</a>` : ''} <a href="/#experience">Experience,</a> <a href="/#about">About</a></nav>
  <div class="r"><a href="/#contact">Contact</a></div>
</nav>`;
const footer = () => `<footer class="foot">
  <p class="caps mist rv">Think we could create something viral together?</p>
  <a class="mail rv" href="mailto:${MAIL}">${MAIL}</a>
  <p class="row caps mist"><span>© ${today.slice(0, 4)} ${NAME}</span><span>${ROLE}</span></p>
</footer>`;
const tail = '<script src="/assets/site.js" defer></script>\n</body>\n</html>\n';
const crumbList = items => ({ '@type': 'BreadcrumbList', itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })) });

/* ───────── case studies ───────── */
const film = ([id, label, wide]) => `<div class="vc${wide ? ' wide' : ''}" data-src="/videos/${id}.mp4"><img src="/videos/posters/${id}.jpg" alt="${esc(label)}" loading="lazy" draggable="false"><button class="pl caps" aria-label="Play ${esc(label)}"><i></i><span>${esc(label)}</span></button></div>`;
const titleLines = t => { const i = t.indexOf(' '); return i < 0 ? [t] : [t.slice(0, i), t.slice(i + 1)]; };

function casePage(w, i) {
  const url = `${SITE}/work/${w.slug}`, next = WORK[(i + 1) % WORK.length], multi = w.ch.length > 1;
  const image = `${SITE}/assets/hero-${w.img}.jpg`;
  const ld = [
    { '@type': 'CreativeWork', '@id': `${url}#case`, name: w.t, headline: `${w.a} ${w.b}`, description: w.desc, url, image, inLanguage: 'en', dateCreated: w.year.slice(0, 4), keywords: w.tags.split(' · ').join(', '), author: { '@id': PERSON['@id'] }, isPartOf: { '@id': `${SITE}/#website` } },
    PERSON,
    crumbList([['Home', `${SITE}/`], ['Work', `${SITE}/#projects`], [w.t, url]])
  ];
  const stats = `<ul>${w.st.map(([v, l]) => `<li><b>${esc(v)}</b><span class="caps mist">${esc(l)}</span></li>`).join('')}</ul>`;
  return `${head({ title: w.title, desc: w.desc, url, image, ld, preloadImg: `/videos/posters/${w.cover}.jpg` })}
<body class="case" data-slug="${w.slug}">
${topRow([['Work', '/#projects'], [`Story ${n2(i)} of ${n2(WORK.length - 1)}`, null], [w.yr, null, 1]], '/#projects', 'Back to all work')}
<main>
<section class="c-hero">
  <div class="bd" style="background-image:url(/assets/hero-${w.img}.jpg)"></div><div class="veil"></div>
  <h1 class="ptitle" aria-label="${esc(w.t)}">${titleLines(w.t).map((l, k) => `<span class="mask" style="--d:${k}"><i>${esc(l)}</i></span>`).join('')}</h1>
  <div class="pc-wrap"><div class="pc-in"><a class="pcard" href="#${w.ch[0].id}" aria-label="Watch the films">
    <img src="/videos/posters/${w.cover}.jpg" alt="${esc(w.t)}: social media campaign by ${NAME}"><video muted playsinline loop preload="none" data-src="/videos/${w.cover}.mp4"></video>
    <span class="a caps"><span>${esc(w.t)}</span><span>${n2(i)}</span></span><span class="b caps"><span>${w.v.length} films</span><span class="go">${ARROW}</span></span>
  </a></div></div>
  <div class="pmeta">
    <p class="caps mist fade" style="--d:3">${esc(w.tags)}</p>
    <p class="tg fade" style="--d:4">${esc(w.a)} <span class="script grad">${esc(w.b)}</span></p>
    <div class="fade" style="--d:5">${stats}</div>
  </div>
</section>

<section class="c-over">
  <div class="rv"><h2>Project overview</h2><p class="lead">${esc(w.o)}</p></div>
  <div class="cols">
    <div class="rv" style="--d:1"><h2>The idea</h2><p>${esc(w.i)}</p></div>
    <div class="rv" style="--d:2"><h2>Details</h2><dl class="facts">${[['Client', w.client], ['Role', w.role], ['Year', w.year], ['Scope', w.tags]].map(([a, b]) => `<div><dt class="caps">${a}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl></div>
    <div class="rv" style="grid-column:1/-1"><h2>What I did</h2><ul class="did">${w.r.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
  </div>${multi ? `
  <nav class="chl rv" aria-label="Chapters">${w.ch.map((c, k) => `<a href="#${c.id}"><span class="caps mist">${n2(k)}</span><span class="nm">${esc(c.t.replace(/[,:]$/, ''))} ${esc(c.s)}</span><span class="caps mist k">${esc(c.k)}</span><span class="caps mist">${c.v.length} ${c.v.length > 1 ? 'films' : 'film'}</span></a>`).join('')}</nav>` : ''}
</section>

<section class="films" aria-label="Films">
${w.ch.map((c, k) => `  <section class="ch" id="${c.id}">
    <div class="ch-t rv"><p class="no caps"><b>${n2(k)}</b><span>${esc(c.k)}</span></p><h2>${esc(c.t)} <span class="script grad">${esc(c.s)}</span></h2>${c.p ? `<p>${esc(c.p)}</p>` : ''}
      <dl class="facts">${c.m.concat([['Films', String(c.v.length)]]).map(([a, b]) => `<div><dt class="caps">${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl>
      <div class="rail-nav" hidden><button aria-label="Previous films">${CHEV('M15 5l-7 7 7 7')}</button><button aria-label="More films">${CHEV('M9 5l7 7-7 7')}</button></div></div>
    <div class="rail rv" style="--d:1">${c.v.map(film).join('')}</div>
  </section>`).join('\n')}
</section>

<a class="next" href="/work/${next.slug}">
  <div class="bd" style="background-image:url(/assets/hero-${next.img}.jpg)"></div><div class="veil"></div>
  <p class="caps mist">Next story — ${n2((i + 1) % WORK.length)} of ${n2(WORK.length - 1)}</p>
  <p class="ttl"><span>${titleLines(next.t).map(esc).join('<br>')}</span><span class="go">${ARROW}</span></p>
  <p class="tg">${esc(next.a)} <span class="script grad">${esc(next.b)}</span></p>
</a>
${footer()}
</main>
${barNav('work')}
${tail}`;
}

/* ───────── insights ───────── */
function articlePage(a, i) {
  const url = `${SITE}/insights/${a.slug}`, image = a.cover ? SITE + a.cover : `${SITE}/assets/hero-township.jpg`;
  const rel = a.related && WORK.find(w => w.slug === a.related), next = ARTICLES.length > 1 ? ARTICLES[(i + 1) % ARTICLES.length] : null;
  const ld = [
    { '@type': 'BlogPosting', '@id': `${url}#article`, headline: a.title, description: a.description, url, image, datePublished: a.date, dateModified: a.updated || a.date, inLanguage: 'en', author: { '@id': PERSON['@id'] }, publisher: { '@id': PERSON['@id'] }, mainEntityOfPage: url, isPartOf: { '@id': `${SITE}/#website` } },
    PERSON,
    crumbList([['Home', `${SITE}/`], ['Insights', `${SITE}/insights`], [a.title, url]])
  ];
  return `${head({ title: `${a.title} | ${NAME}`, desc: a.description, url, image, ld, preloadImg: a.cover })}
<body class="article">
${topRow([['Insights', '/insights'], [a.topic || 'Article', null, 1]], '/insights', 'Back to all insights')}
<main>
<article>
  <header class="a-head">
    <p class="caps mist fade">${esc(a.topic || 'Insight')}</p>
    <h1><span class="mask"><i>${esc(a.title)}</i></span></h1>
    <p class="dek fade" style="--d:2">${esc(a.description)}</p>
    <p class="a-meta caps fade" style="--d:3"><span>By <b>${NAME}</b></span><span><time datetime="${a.date}">${fmtDate(a.date)}</time></span><span>${a.mins} min read</span>${a.source ? `<span><a href="${esc(a.source)}" target="_blank" rel="noopener">View the original post</a></span>` : ''}</p>
  </header>
  ${a.cover ? `<figure class="a-cover fade" style="--d:4"><img src="${esc(a.cover)}" alt="${esc(a.coverAlt || a.title)}"></figure>` : ''}
  <div class="a-body">
    <aside class="toc">${a.toc.length ? `<p class="caps mist" style="margin-bottom:14px">In this piece</p><ul>${a.toc.map(([id, t]) => `<li><a href="#${id}">${esc(t)}</a></li>`).join('')}</ul>` : ''}</aside>
    <div class="prose">
${a.html}
    </div>
  </div>
  <footer class="a-end">
    <p class="caps mist">Written by</p>
    <p class="by">${NAME} is a social media specialist and creative strategist based in Dubai, UAE. <a href="/#projects">See the work</a> or <a href="mailto:${MAIL}">get in touch</a>.</p>
  </footer>
</article>
${rel ? `<a class="next" href="/work/${rel.slug}">
  <div class="bd" style="background-image:url(/assets/hero-${rel.img}.jpg)"></div><div class="veil"></div>
  <p class="caps mist">Related case study</p>
  <p class="ttl"><span>${titleLines(rel.t).map(esc).join('<br>')}</span><span class="go">${ARROW}</span></p>
  <p class="tg">${esc(rel.a)} <span class="script grad">${esc(rel.b)}</span></p>
</a>` : next ? `<a class="next" href="/insights/${next.slug}">
  <div class="veil"></div>
  <p class="caps mist">Next insight</p>
  <p class="ttl" style="text-transform:none;font-weight:400;font-size:clamp(34px,6vw,110px);line-height:.96"><span>${esc(next.title)}</span><span class="go">${ARROW}</span></p>
</a>` : ''}
${footer()}
</main>
${barNav('insights')}
${tail}`;
}
function insightsIndex() {
  const url = `${SITE}/insights`, desc = `Short reads on creative strategy, campaigns and social media trends by ${NAME}, social media specialist in Dubai, UAE.`;
  const ld = [
    { '@type': 'Blog', '@id': `${url}#blog`, name: `Insights by ${NAME}`, description: desc, url, inLanguage: 'en', author: { '@id': PERSON['@id'] }, blogPost: ARTICLES.map(a => ({ '@type': 'BlogPosting', headline: a.title, url: `${SITE}/insights/${a.slug}`, datePublished: a.date })) },
    PERSON, crumbList([['Home', `${SITE}/`], ['Insights', url]])
  ];
  return `${head({ title: `Insights: Creative Strategy & Campaigns | ${NAME}`, desc, url, image: `${SITE}/assets/hero-township.jpg`, type: 'website', ld })}
<body class="insights">
${topRow([['Home', '/'], ['Insights', null]], '/', 'Back to the homepage')}
<main>
<header class="i-head">
  <h1><span class="mask"><i>Insights</i></span><span class="mask" style="--d:1"><i class="script">on the scroll</i></span></h1>
  <p class="fade" style="--d:2">Short reads on creative strategy, campaigns worth studying and the trends shaping social media.</p>
</header>
<section class="i-list">
${ARTICLES.map((a, k) => `  <a class="i-row rv" href="/insights/${a.slug}" style="--d:${Math.min(k, 4)}">
    <span class="caps mist"><time datetime="${a.date}">${fmtDate(a.date)}</time></span>
    <span><h2>${esc(a.title)}</h2><p>${esc(a.description)}</p></span>
    <span class="caps mist">${esc(a.topic || 'Insight')} · ${a.mins} min</span>
    <span class="go">${ARROW}</span>
  </a>`).join('\n')}
</section>
${footer()}
</main>
${barNav('insights')}
${tail}`;
}

/* ───────── run ───────── */
console.log('Building…');
fs.rmSync(at('work'), { recursive: true, force: true });
fs.rmSync(at('insights'), { recursive: true, force: true });
WORK.forEach((w, i) => write(`work/${w.slug}/index.html`, casePage(w, i)));
if (HAS_INSIGHTS) { write('insights/index.html', insightsIndex()); ARTICLES.forEach((a, i) => write(`insights/${a.slug}/index.html`, articlePage(a, i))); }

/* homepage: keep generated blocks and the site address in step */
let home = fs.readFileSync(at('index.html'), 'utf8');
const fill = (name, html) => { const re = new RegExp(`(<!--${name}-->)[\\s\\S]*?(<!--/${name}-->)`); if (!re.test(home)) throw new Error(`index.html: marker <!--${name}--> not found`); home = home.replace(re, `$1${html}$2`); };
fill('insights-link', HAS_INSIGHTS ? ' <a href="insights">Insights,</a>' : '');
fill('work-links', WORK.map(w => `\n      <h2><a href="work/${w.slug}">${esc(w.t)}</a></h2><p>${esc(w.a)} ${esc(w.b)}. ${esc(w.desc)}</p>`).join('') + '\n    ');
const old = (home.match(/<link rel="canonical" href="(https?:\/\/[^"/]+)\/?">/) || [])[1];
if (old && old !== SITE) { home = home.split(old).join(SITE); console.log(`  site address: ${old} → ${SITE}`); }
fs.writeFileSync(at('index.html'), home); console.log('  updated index.html');

const urls = [[`${SITE}/`, '1.0'], ...WORK.map(w => [`${SITE}/work/${w.slug}`, '0.8']), ...(HAS_INSIGHTS ? [[`${SITE}/insights`, '0.7'], ...ARTICLES.map(a => [`${SITE}/insights/${a.slug}`, '0.7', a.updated || a.date])] : [])];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u, p, d]) => `  <url><loc>${u}</loc><lastmod>${d || today}</lastmod><priority>${p}</priority></url>`).join('\n')}\n</urlset>\n`);
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`Done: ${WORK.length} case studies, ${ARTICLES.length} article${ARTICLES.length === 1 ? '' : 's'}.`);
