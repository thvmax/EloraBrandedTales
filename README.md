# Ei Chaw Myint Mo — Portfolio 2026

A single-page, responsive portfolio built from the Figma file
**Mo Social Media Portfolio → V4 — The Showcase**.

## Stack

Plain HTML + CSS + vanilla JS in one file. No build step, no framework.

```
index.html          the whole site (markup, styles, script)
assets/             hero images, portrait, self-hosted fonts
videos/             web-optimised MP4s (H.264, 720p, faststart)
videos/posters/     one JPG poster per video
Supporting Videos/  raw source footage — git-ignored, not deployed
```

## Run locally

Videos need a server (they will not stream from `file://` in every browser):

```bash
python3 -m http.server 3000
# open http://localhost:3000
```

## Editing content

All project copy lives in the `W` array near the bottom of `index.html`:
titles, taglines, overview, ideas, stats and which videos appear. A story with a
`ch` list (Luxury Launches) is split into chapters in its case study: each
chapter has a title, a paragraph, a short fact list and its own films.

- Swap a hero image: replace `assets/hero-*.jpg` (1500×1000 or larger).
- Swap the portrait: replace `assets/portrait.jpg` (portrait ratio, ~520×720+).
- Add a video: put `name.mp4` in `videos/` and `name.jpg` in `videos/posters/`,
  then add `'name'` to a `vids` list.

### Encoding new videos

```bash
ffmpeg -i input.mp4 -vf "scale=-2:1280" -c:v libx264 -preset medium -crf 22 \
  -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart videos/name.mp4
ffmpeg -ss 1.5 -i videos/name.mp4 -frames:v 1 -vf "scale=720:-2" -q:v 4 videos/posters/name.jpg
```

## Deploy

Static site — push to GitHub and import in Vercel (framework preset: Other,
no build command), or run `vercel` in this folder.
