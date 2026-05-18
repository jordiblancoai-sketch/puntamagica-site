# Punta Mágica

Static landing page for Punta Mágica — boutique stays and wellness in Puerto Escondido, Oaxaca.

## Stack

Plain HTML, CSS, JS — no build step.

- `index.html` — markup, JSON-LD, OpenGraph
- `styles.css` — all styles
- `app.js` — carousel, language toggle, counters, tilt, etc.
- `punta-magica.mp4` — hero reel video

## Local preview

Just open `index.html` in a browser. For video to load reliably, serve it:

```sh
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy (Railway)

Railway detects the `Dockerfile` and builds an nginx container. The site is
served on `$PORT` (Railway-assigned at runtime; falls back to 8080 locally).

After connecting this repo to a Railway project, no extra config is needed.
