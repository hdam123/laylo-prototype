# Laylo — website prototype

Three pages, static files only (React 18 via htm, GSAP 3 + ScrollTrigger, Lenis), no build step.
All libraries are vendored in `vendor/`, so it runs offline.

| Page | File | Script / styles |
| --- | --- | --- |
| Homepage | `index.html` | `src/main.js` · `styles.css`, `hero-demo.css` |
| Case Studies | `case-studies.html` | `src/case-studies.js` · `styles.css`, `cs.css` |
| About | `about.html` | `src/about.js` · `styles.css`, `cs.css`, `about.css` |

Copy and image references live in `src/content.js` (homepage), `src/cs-content.js` (Case Studies)
and `src/about-content.js` (About). Anything not final is marked `PLACEHOLDER` there.

## Run locally

    python3 serve.py

Then open http://localhost:5180 (Case Studies at `/case-studies.html`, About at `/about.html`).
Opening the HTML files straight from disk won't work: browsers block the page scripts on `file://`.

## GitHub Pages

Push this folder as the repository root and turn on Pages for the branch (root folder).
`.nojekyll` is included so the files are served as-is. All paths are relative, so it also works
from a project URL like `https://<user>.github.io/<repo>/`.

## Before going public

- `fonts/` holds **trial** licences of Test Die Grotesk and Saans (fine for review, not for a public
  site). License the full fonts first, or keep the repository private.
- Case study links point to `laylo.com/case-studies/...`; the Mark Ambor and Sam Smith slugs are guesses.
- The hero's phone screens, news thumbnails and several headlines/metrics are placeholders (see the
  content files above).
