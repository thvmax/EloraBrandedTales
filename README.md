# Ei Chaw Myint Mo — Portfolio 2026

A single-page, responsive portfolio built from the Figma file
**Mo Social Media Portfolio → V4 — The Showcase**.

## Stack

Plain HTML + CSS + vanilla JS in one file. No build step, no framework.

```
index.html          the whole site (markup, styles, script)
assets/             social preview image, portrait, self-hosted fonts
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

All copy is plain HTML in `index.html`, so it is readable without JavaScript.

- Each project is an `<article class="work">`. The top part is the summary shown
  on the page; the `<div class="case">` inside it is the case study that opens
  in the overlay.
- A case study is split into chapters: each `<section class="ch">` has a title,
  a paragraph, a short fact list and a rail of films. Luxury Launches has five.
- Add a film: put `name.mp4` in `videos/` and `name.jpg` in `videos/posters/`,
  then copy a `<figure class="vc" data-v="name">` block into a rail
  (add the class `wide` for 16:9).
- Experience and skills are the `#experience` block. Hero phrases and their
  colours are the `HERO` array in the script.
- The social preview tags near the top use the site's full URL; update them if
  the domain changes.

### Encoding new videos

```bash
ffmpeg -i input.mp4 -vf "scale=-2:1280" -c:v libx264 -preset medium -crf 22 \
  -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart videos/name.mp4
ffmpeg -ss 1.5 -i videos/name.mp4 -frames:v 1 -vf "scale=720:-2" -q:v 4 videos/posters/name.jpg
```

## Deploy

Static site — push to GitHub and import in Vercel (framework preset: Other,
no build command), or run `vercel` in this folder.
