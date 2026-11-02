# Laylo — homepage scroll prototype

React 18 + GSAP 3.13 (ScrollTrigger) + Lenis smooth scroll, built from the Figma file
`Laylo_Website-Design` (Landing Page `71:1869`, Scroll Animation Board `72:2426`).

## Run

No install, no internet needed (all libraries are vendored in `vendor/`):

    python3 ~/Documents/Claude/augmodo/laylo/serve.py

Then open http://localhost:5180. Pass another port if 5180 is busy: `serve.py 8080`.
The server disables caching so edits show on a normal refresh.

## Versions

`present.html` switches between them (buttons bottom left, or press V):
A (`index.html`), A2 (`a2.html`: same as A, but the landing is not pinned; four slides,
TOUR → PRE-SAVE → EVENT → MERCH, auto-advance every 3.2 s and wipe in left to right, with progress bars),
B (`v2.html`) and C (`v3.html`).

## How the page maps to the storyboard

| Storyboard frame | Section (file) | Behaviour |
| --- | --- | --- |
| Landing Scroll | `src/hero.js` | Pinned. TOUR → PRE-SAVE → EVENT → MERCH, each word wipes in its left image and phone screen. Sign up / See a demo CTAs under the headline. |
| Section 7 | `src/strip.js` | Endless strip: drifts on its own, speeds up and follows scroll direction, stops on hover. Version A keeps captions visible and adds a rank and a live growth figure (↗ 4.0×, ticks up every few seconds) on each image; B and C reveal captions on hover. |
| Section 2A → 2B → 2C | `src/platform.js` | Pinned headline; step label slides left; diagram builds (icons, connectors, CRM card, phone, chart) while the camera pans down it. Version A (`updated`): four capture icons, a richer fan card, Email / Instagram DM / SMS / RCS / WhatsApp screens (`src/channels.js`), six ticketing/commerce partners and a revenue counter instead of the bars. |
| Section 3A → 3B → 3C | `src/agents.js` | Pinned headline + audience switch (Artists / Promoters / Festivals / Creators). One real customer story per tab as a numbered Before → During → After timeline; a progress rail fills as you scroll and steps are clickable. Result stat in purple, followed by a CTA. |
| Section 6 | `src/tools.js` | Pinned headline; all 25 tools (from `laylo-homepage-AM.html`) scroll up through a faded window in a 6-column grid. |
| Section 5 | `src/testimonials.js` | Pinned horizontal scroll through the testimonial cards. |
| Footer | `src/footer.js` | Large wordmark letters rise in; the drop in the A wiggles on hover. |

Everything scroll-driven is scrubbed, so it runs the same in both directions. The Before/During/After
content is the one exception by design: it switches state at thirds of the pin with a short
transition, so text is never caught half-faded.

## Layout units

On desktop, `1rem` = 1 Figma px on the 1440 × 800 frame. The root font size scales to fit
width, or height on short screens, so pinned frames always fit on screen (`styles.css`, `html`).
Below 768 px a simplified mobile layout takes over (no Figma mobile design exists).

## Placeholders (not in Figma)

All in `src/content.js`, marked `PLACEHOLDER`:

- Strip captions for the five images other than Diplo, and the Version A growth figures.
- Section 4 photos for Circoloco and Capitol Hill Block Party (stand-in event shots), and a "photo to come" panel for Matt Rife.
- Tools: Segments, WhatsApp and Discovery descriptions.
- Testimonial cards 3–5 (images reused from Figma).
- Log in / See a demo / Sign up and every CTA open a local modal; nothing is sent or stored.

Copy fix: "A page fr every drop." → "A page for every drop."

## Tool icons

`assets/tools/`: the four Figma icons plus filled Material Symbols (Apache 2.0, `@material-symbols/svg-400@0.27.0`)
in the same style, one per tool.

## Fonts

`fonts/` holds Test Die Grotesk VF and Saans **trial** fonts copied from this Mac. Die Grotesk's
A/B/C/D styles are its optical sizes 6/18/30/42 (`.fA`–`.fD` in `styles.css`). Trial licences
are fine for a presentation; licence the full fonts before anything goes live.
