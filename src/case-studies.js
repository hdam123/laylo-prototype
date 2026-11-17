// Case Studies index, reworked from client feedback: one browsable library. Filters (Featured by
// default, All, Tours, Merch, Music, Events) update a grid of magazine covers, four to a row;
// each cover links to its own case study page. The previous version is in case-studies-v1.js.
import { html, gsap, ScrollTrigger, setLenis, useState, useRef, useLayoutEffect, ModalContext, useModal, scrollToY, A } from "./lib.js";
import { Nav } from "./nav.js";
import { Modal } from "./modal.js";
import { Footer } from "./footer.js";
import { CATEGORIES, LIBRARY, CTA } from "./cs-content.js";

// Masked headline: each line slides up out of its own mask.
const Lines = ({ lines, cls = "" }) => html`
  ${lines.map((l) => html`<span key=${l} class="mask"><span class=${"cs-line " + cls}>${l}</span></span>`)}`;

// Scroll-linked entrance shared by every section: headline lines, then [data-rise] blocks.
function useEntrance(root) {
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const lines = root.current.querySelectorAll(".cs-line");
      if (lines.length) {
        gsap.from(lines, { yPercent: 105, stagger: 0.1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: lines[0], start: "top 88%" } });
      }
      gsap.utils.toArray(root.current.querySelectorAll("[data-rise]")).forEach((el) => {
        gsap.from(el, { y: 50, opacity: 0, duration: 1, ease: "power3.out", delay: (+el.dataset.rise || 0) * 0.08,
          scrollTrigger: { trigger: el, start: "top 92%" } });
      });
      gsap.utils.toArray(root.current.querySelectorAll("[data-wipe]")).forEach((el) => {
        gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.2, ease: "power3.inOut",
          scrollTrigger: { trigger: el, start: "top 85%" } });
        const img = el.querySelector("img");
        if (img) gsap.fromTo(img, { scale: 1.18 }, { scale: 1, duration: 1.6, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } });
      });
    }, root);
    return () => ctx.revert();
  }, []);
}

const Tag = ({ children, tone = "dark", href, onClick }) => {
  const cls = `outline-pill saans cs-tag cs-tag--${tone}`;
  return href
    ? html`<a class=${cls} href=${href} target="_blank" rel="noopener">${children}</a>`
    : html`<button class=${cls} onClick=${onClick}>${children}</button>`;
};

// Filters: Featured (default), All, then the four drop types, each with its count.
const FILTERS = [
  { key: "featured", label: "Featured", items: LIBRARY.filter((c) => c.featured).sort((a, b) => a.featured - b.featured) },
  { key: "all", label: "All", items: LIBRARY },
  ...CATEGORIES.map((c) => ({ key: c.key, label: c.label, items: LIBRARY.filter((d) => d.cat === c.key) })),
];
const CAT_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.key, c.label]));

function Filter({ active, onPick, floating = false }) {
  return html`
    <div class=${"lib-filter" + (floating ? " lib-filter--float" : "")} role="tablist" aria-label="Filter case studies">
      ${FILTERS.map((f) => html`
        <button key=${f.key} role="tab" aria-selected=${f.key === active} class=${"lib-filter__btn saans" + (f.key === active ? " is-active" : "")}
          onClick=${() => onPick(f.key)}>${f.label} (${f.items.length})</button>`)}
    </div>`;
}

// Magazine cover (client reference: Diplo "New Drop"): the artist photo set into a backdrop in a colour
// picked from the photo (cs-content.js), the Laylo masthead over the photo, the name set big on the
// colour band, and a round stamp carrying the one metric (or the drop type when there isn't one).
// Clicks through to the case study's own page.
const DROP = { tours: "Tour drop", merch: "Merch drop", music: "Music drop", events: "Event drop" };
function Cover({ c }) {
  const n = LIBRARY.indexOf(c);
  return html`
    <a class="lib-cover" href=${c.href} target="_blank" rel="noopener" style=${{ "--cover": c.color }}>
      <span class="lib-cover__img">
        <img src=${c.img} alt="" loading="lazy" />
        <span class="lib-cover__mast" role="img" aria-label="Laylo"></span>
        <span class="lib-cover__no fB">${CAT_LABEL[c.cat]} · Nº ${String(n + 1).padStart(2, "0")}</span>
      </span>
      <span class="lib-cover__band">
        <span class="lib-cover__text">
          <span class="lib-cover__name fC">${c.name}</span>
          <span class="lib-cover__head fA">${c.headline}</span>
        </span>
        <span class="lib-cover__stamp fB">
          ${c.metric ? html`<b>${c.metric[0]}</b>${c.metric[1]}` : html`${DROP[c.cat]}<br />Read it ↗`}
        </span>
      </span>
    </a>`;
}

// Header and filters sit above the first row of covers, so the library is visible on arrival.
function Intro({ active, onPick }) {
  const root = useRef();
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline()
        .from(".lib-intro .cs-line", { yPercent: 105, stagger: 0.1, duration: 1, ease: "power3.out" }, 0.1)
        .from(".lib-intro__sub, .lib-intro .lib-filter", { y: 16, opacity: 0, stagger: 0.08, duration: 0.8, ease: "power3.out" }, 0.4);
    }, root);
    return () => ctx.revert();
  }, []);
  return html`
    <section class="lib-intro" ref=${root} data-nav="light">
      <h1 class="h-xl fC lib-intro__title"><${Lines} lines=${["Culture drops here first."]} /></h1>
      <p class="lib-intro__sub fA">${LIBRARY.length} drops from the artists, festivals and creators running them best. Browse the library, or filter by what you’re dropping.</p>
      <${Filter} active=${active} onPick=${onPick} />
    </section>`;
}

// The library grid: four covers a row. Filtering swaps the covers; they just rise in, so browsing stays quick.
function Library({ active, onPick }) {
  const root = useRef();
  const items = FILTERS.find((f) => f.key === active).items;
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".lib-cover", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.04 });
    }, root);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [active]);
  return html`
    <section class="lib" id="library" ref=${root} data-nav="light">
      <div class="lib__grid">${items.map((c) => html`<${Cover} key=${c.name} c=${c} />`)}</div>
      ${active === "featured" && html`<div class="lib__more"><button class="outline-pill saans cs-tag cs-tag--dark" onClick=${() => onPick("all")}>See all ${LIBRARY.length} drops</button></div>`}
    </section>`;
}

// The same filters, floating at the bottom once the inline ones have scrolled away.
function FloatingFilter({ active, onPick }) {
  const ref = useRef();
  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
      trigger: ".lib-intro .lib-filter", endTrigger: "#library", start: "bottom top", end: "bottom 70%",
      onToggle: (s) => ref.current.classList.toggle("is-on", s.isActive),
    });
    return () => st.kill();
  }, []);
  return html`<div class="cs-floatwrap" ref=${ref}><${Filter} active=${active} onPick=${onPick} floating /></div>`;
}

function Cta() {
  const root = useRef();
  const openModal = useModal();
  useEntrance(root);
  return html`
    <section class="cs-cta" ref=${root} data-nav="dark">
      <h2 class="h-xl fC"><${Lines} lines=${CTA.title} /></h2>
      <div class="cs-cta__copy" data-rise>
        <p class="fA">${CTA.body}</p>
        <${Tag} tone="light" onClick=${() => openModal({ type: "demo" })}>Book a demo</${Tag}>
      </div>
    </section>`;
}

function App() {
  const [modal, setModal] = useState(null);
  const [active, setActive] = useState("featured");
  // Picking a filter from further down brings the top of the library back into view.
  const pick = (key) => {
    setActive(key);
    const lib = document.getElementById("library");
    if (lib.getBoundingClientRect().top < 0) scrollToY(lib.getBoundingClientRect().top + window.scrollY - 90, { duration: 0.9 });
  };
  return html`
    <${ModalContext.Provider} value=${setModal}>
      <${Nav} keepLogo />
      <main>
        <${Intro} active=${active} onPick=${pick} />
        <${Library} active=${active} onPick=${pick} />
        <${Cta} />
      </main>
      <${Footer} wiggle=${false} />
      <${FloatingFilter} active=${active} onPick=${pick} />
      <${Modal} modal=${modal} onClose=${() => setModal(null)} />
    <//>`;
}

function startLenis() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const lenis = new window.Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  setLenis(lenis);
}

async function boot() {
  await Promise.all([
    document.fonts.load('500 48px "Die"'),
    document.fonts.load('400 14px "Die"'),
    document.fonts.load('600 10px "Saans"'),
  ]).catch(() => {});
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  startLenis();
  window.ReactDOM.createRoot(document.getElementById("root")).render(html`<${App} />`);
  window.addEventListener("load", () => ScrollTrigger.refresh());
}

boot();
