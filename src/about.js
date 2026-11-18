// About page. Same runtime, type and choreography as the homepage and Case Studies:
// masked headline reveals, scroll-linked entrances, a pinned section, the floating pill switch.
// The draft's record-sleeve idea survives as the four chapter sleeves under the hero.
import { html, gsap, ScrollTrigger, setLenis, useState, useRef, useLayoutEffect, useEffect, ModalContext, useModal, scrollToSection, A } from "./lib.js";
import { Nav } from "./nav.js";
import { Modal } from "./modal.js";
import { Footer } from "./footer.js";
import { HERO, CHAPTERS, STORY, FOUNDERS, TEAM, MISSION, NEWS, CTA } from "./about-content.js";

// Masked headline: each line slides up out of its own mask (as on Case Studies).
const Lines = ({ lines, cls = "" }) => html`
  ${lines.map((l) => html`<span key=${l} class="mask"><span class=${"cs-line " + cls}>${l}</span></span>`)}`;

// Scroll-linked entrance shared by every section: headline lines, then [data-rise] and [data-wipe] blocks.
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

// Section head: small label, masked headline, optional lead.
const Head = ({ label, title, lead }) => html`
  <div class="ab-head">
    ${label && html`<div class="cs-label" data-rise>${label}</div>`}
    <h2 class="h-xl fC ab-title"><${Lines} lines=${title} /></h2>
    ${lead && html`<p class="ab-lead fA" data-rise="1">${lead}</p>`}
  </div>`;

// On hover the cover lifts a touch and its vinyl peeks out; each cover keeps its own artwork.
// Material Symbols (400) arrow_outward / arrow_downward, drawn in the text colour.
const ARROW = {
  out: "m256-240-56-56 384-384H240v-80h480v480h-80v-344L256-240Z",
  down: "M440-800v487L216-537l-56 57 320 320 320-320-56-57-224 224v-487h-80Z",
};
const Arrow = ({ dir = "out" }) => html`<svg class="ab-ic" viewBox="0 -960 960 960" aria-hidden="true"><path d=${ARROW[dir]} /></svg>`;
// The drop from the Laylo wordmark's A (footer.js DROP), cropped to its own box.
const DROP_PATH = "M436.653 171.117C436.289 180.611 432.515 189.39 426.033 196.27C411.16 212.07 386.745 212.726 371.144 197.571L368.894 195.203C362.975 188.546 359.623 180.177 359.177 171.293L359.154 166.686C359.564 159.783 360.924 153.383 362.963 146.773C365.108 139.822 367.745 133.118 370.746 126.484C373.5 120.4 376.454 114.411 379.595 108.504C385.198 97.9548 391.199 87.6755 397.634 77.6307L404.467 67.3397L404.42 70.7154C404.162 88.8359 408.593 103.968 416.469 120.131C419.001 125.335 421.755 130.34 424.592 135.368C426.959 139.564 429.186 143.737 431.179 148.12C434.32 155.059 436.957 163.498 436.664 171.117H436.653Z";

// Record sleeves in Laylo's own look: Die Grotesk caps, the purple / light blue / ink / white palette,
// and the wordmark's drop. Four covers in one row; on hover the cover lifts a touch and the vinyl peeks out.
const COVERS = [
  { top: ["Laylo records", "01 / Side A"], bottom: [["A battle of", "the bands."], "33⅓ RPM"],
    art: html`<span class="ab-orbit"><span class="ab-orbit__label"><img src=${A("logo.svg")} alt="" /><small>The beginning</small></span></span>` },
  { top: ["An unexpected duo", "02 / Side A"], bottom: [["Two founders.", "One frequency."], "Cofounders"],
    art: html`<span class="ab-cover__founders">Alec<br />& Saj.</span>` },
  { top: ["The people behind it", "03 / Side A"], bottom: [["The Laylo crew"], "Stereo"],
    art: html`<span class="ab-cover__team">Good<br />people.<br /><em>Great<br />taste.</em></span><span class="ab-cover__stamp">All<br />together<br />now</span>` },
  { top: ["Our reason for being", "04 / Side B"], bottom: [["Own your audience.", "Make your own noise."], "On repeat"],
    art: html`<span class="ab-cover__mission">Fans<br />first.</span><svg class="ab-cover__drop" viewBox="355 62 86 152" aria-hidden="true"><path d=${DROP_PATH} /></svg>` },
];

const Sleeve = ({ c, i }) => {
  const cv = COVERS[i];
  return html`
    <a class=${"ab-rec ab-rec--" + i} href=${"#" + c.target} onClick=${(e) => { e.preventDefault(); scrollToSection(c.target); }}
      aria-label=${`${c.title}, chapter ${i + 1} of 4`}>
      <span class="ab-rec__art">
        <span class="ab-rec__disc" aria-hidden="true"><span class="fB">Laylo<br />33⅓</span></span>
        <span class="ab-rec__sleeve fC" aria-hidden="true">
          <span class="ab-cover__row ab-cover__row--top fB"><span>${cv.top[0]}</span><span>${cv.top[1]}</span></span>
          ${cv.art}
          <span class="ab-cover__row ab-cover__row--bottom fB">
            <span>${cv.bottom[0].map((l, k) => html`${k ? html`<br />` : ""}${l}`)}</span><span>${cv.bottom[1]}</span>
          </span>
          <span class="ab-rec__lift"><${Arrow} /></span>
        </span>
      </span>
      <span class="ab-rec__caption">
        <span class="ab-rec__n fB">${c.n}</span>
        <span class="ab-rec__title fC">${c.title}</span>
        <span class="ab-rec__sub fA">${c.sub} <${Arrow} /></span>
      </span>
    </a>`;
};

// The record wall: a light band between the dark hero and the photo band.
function Wall() {
  const root = useRef();
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".ab-rec", { y: 90, opacity: 0, stagger: 0.09, duration: 1.2, ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 85%" } });
      // The vinyls peek out once, then slide home: a hint that the sleeves are interactive.
      gsap.fromTo(".ab-rec__disc", { xPercent: 0 }, { xPercent: 14, stagger: 0.08, duration: 0.7, ease: "power2.out", yoyo: true, repeat: 1,
        repeatDelay: 0.25, clearProps: "transform", scrollTrigger: { trigger: root.current, start: "top 60%" } });
    }, root);
    return () => ctx.revert();
  }, []);
  return html`
    <section class="ab-wall" ref=${root} data-nav="light">
      <div class="ab-wall__bar"><span><i></i>Four records. One shared obsession.</span></div>
      <div class="ab-wall__grid">${CHAPTERS.map((c, i) => html`<${Sleeve} key=${c.n} c=${c} i=${i} />`)}</div>
    </section>`;
}

function Hero() {
  const root = useRef();
  const openModal = useModal();
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline()
        .from(".ab-hero .cs-line", { yPercent: 105, stagger: 0.1, duration: 1, ease: "power3.out" }, 0.1)
        .from(".ab-hero__eyebrow, .ab-hero__sub, .ab-hero__cta .pill", { y: 20, opacity: 0, stagger: 0.1, duration: 0.9, ease: "power3.out" }, 0.5)
        .from(".ab-hero__img img", { scale: 1.12, duration: 1.8, ease: "power3.out" }, 0);
      // Scroll away: the photo drifts slower than the page, the copy lifts and fades.
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } })
        .to(".ab-hero__img img", { yPercent: 12, ease: "none" }, 0)
        .to(".ab-hero__copy", { y: -60, opacity: 0, ease: "none" }, 0);
    }, root);
    return () => ctx.revert();
  }, []);
  return html`
    <section class="ab-hero" ref=${root} data-nav="dark">
      <div class="ab-hero__img"><img src=${HERO.bg} alt="" /></div>
      <div class="ab-hero__copy">
        <div class="cs-label ab-hero__eyebrow">${HERO.eyebrow}</div>
        <h1 class="ab-hero__title fC">
          <${Lines} lines=${HERO.title} />
          <span class="mask"><span class="cs-line">${HERO.since}</span></span>
        </h1>
        <p class="ab-hero__sub fA">${HERO.sub}</p>
        <div class="ab-hero__cta">
          <button class="pill pill--grey" onClick=${() => openModal({ type: "signup" })}>Start your next drop</button>
          <button class="pill pill--grey" onClick=${() => scrollToSection("ab-story")}>Read the liner notes</button>
        </div>
      </div>
    </section>`;
}

// Full-bleed photo band; the image drifts slower than the page.
function Band() {
  const root = useRef();
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".ab-band__img", { clipPath: "inset(12% 6% 12% 6%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 20%", scrub: true } });
      gsap.fromTo(".ab-band__img img", { yPercent: -10 }, { yPercent: 10, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);
  return html`
    <section class="ab-band" ref=${root} data-nav="dark">
      <div class="ab-band__img"><img src=${HERO.img} alt="An artist performing to a festival crowd" loading="lazy" /></div>
      <div class="ab-band__copy h-xl fC">Earned hype.<br />Lasting connection.</div>
    </section>`;
}

// One centred column: the story, the line it lands on, and three dates.
function Story() {
  const root = useRef();
  useEntrance(root);
  return html`
    <section class="ab-story" id="ab-story" ref=${root} data-nav="light">
      <${Head} label=${STORY.label} title=${STORY.title} />
      <div class="ab-story__text">
        ${STORY.paragraphs.map((p, i) => html`<p key=${i} class="fA" data-rise=${i}>${p}</p>`)}
        <p class="ab-story__turn fB" data-rise="2">${STORY.turn}</p>
        <p class="ab-story__bridge fC" data-rise="3">${STORY.bridge}</p>
      </div>
      <ol class="ab-timeline">
        ${STORY.timeline.map((t, i) => html`
          <li key=${t.year} data-rise=${i}>
            <span class="ab-timeline__year fC">${t.year}</span>
            <span class="fA">${t.text}</span>
          </li>`)}
      </ol>
    </section>`;
}

function Founders() {
  const root = useRef();
  useEntrance(root);
  return html`
    <section class="ab-founders" id="ab-founders" ref=${root} data-nav="light">
      <${Head} label=${FOUNDERS.label} title=${FOUNDERS.title} lead=${FOUNDERS.lead} />
      <div class="ab-duo">
        ${FOUNDERS.people.map((p, i) => html`
          <article key=${p.name} class="ab-person">
            <figure class="ab-person__img" data-wipe><img src=${p.img} alt=${p.name} loading="lazy" /></figure>
            <div class="ab-person__copy" data-rise=${i + 1}>
              <div>
                <div class="cs-label">${String(i + 1).padStart(2, "0")} / ${p.role}</div>
                <h3 class="cs-card__name fC">${p.name}</h3>
                <p class="cs-body fA ab-person__bio">${p.bio}</p>
              </div>
              <div class="ab-links">${p.links.map(([l, h]) => html`<${Tag} key=${l} href=${h}>${l}</${Tag}>`)}</div>
            </div>
          </article>`)}
      </div>
    </section>`;
}

function Team() {
  const root = useRef();
  useEntrance(root);
  return html`
    <section class="ab-team" id="ab-team" ref=${root} data-nav="dark">
      <${Head} label=${TEAM.label} title=${TEAM.title} lead=${TEAM.lead} />
      <div class="ab-team__grid">
        <div class="ab-team__intro" data-rise>
          <p class="cs-q24 fC">${TEAM.intro}</p>
          <div class="ab-team__join">
            <p class="cs-body fA">${TEAM.join.text}</p>
            <${Tag} tone="light" href=${TEAM.join.href}>${TEAM.join.cta}</${Tag}>
          </div>
        </div>
        ${TEAM.people.map((p, i) => html`
          <a key=${p.name} class="cs-card ab-member" href=${p.href} target="_blank" rel="noopener" data-rise=${i + 1}>
            <span class="cs-card__img ab-member__img"><img src=${p.img} alt=${p.name} loading="lazy" /></span>
            <span class="cs-card__name fC">${p.name}</span>
            <span class="cs-card__row fA"><span>${p.role}</span></span>
            <span class="cs-card__rule"></span>
            <span class="cs-body fA ab-member__bio">${p.bio}</span>
            <span class="cs-card__row fA ab-member__cta"><span>${p.cta} <${Arrow} /></span></span>
          </a>`)}
      </div>
    </section>`;
}

// Same layout as the homepage's "Every tool your drop needs" pillars: three columns, a big caps line
// over a short paragraph.
function Mission() {
  const root = useRef();
  useEntrance(root);
  return html`
    <section class="ab-mission" id="ab-mission" ref=${root} data-nav="light">
      <${Head} label=${MISSION.label} title=${MISSION.title} lead=${MISSION.lead} />
      <div class="pillars ab-mission__pillars">
        ${MISSION.beliefs.map((b, i) => html`
          <div key=${b.title} class="pillar" data-rise=${i}>
            <div class="pillar__head">
              <div class="cs-label">${String(i + 1).padStart(2, "0")}</div>
              <h3 class="pillar__name fB">${b.title}</h3>
              <p class="pillar__intro fA">${b.body}</p>
            </div>
          </div>`)}
      </div>
    </section>`;
}

// Three story cards: thumbnail, source and date, title, and a link to read the post.
function News() {
  const root = useRef();
  useEntrance(root);
  return html`
    <section class="ab-news" ref=${root} data-nav="light">
      <${Head} label="Press" title=${["In the news."]} />
      <div class="ab-news__grid">
        ${NEWS.map((n, i) => html`
          <a key=${n.title} class="ab-story-card" href=${n.href} target="_blank" rel="noopener" data-rise=${i}>
            <span class="ab-story-card__img"><img src=${n.img} alt="" loading="lazy" /></span>
            <span class="cs-label">Laylo / ${n.source} · ${n.date}</span>
            <span class="ab-story-card__title fB">${n.title}</span>
            <span class="outline-pill saans cs-tag cs-tag--dark ab-story-card__cta">Read more</span>
          </a>`)}
      </div>
    </section>`;
}

// Same closing section as the Case Studies page.
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

// Floating chapter switch (the Case Studies drop filter): follows the chapter in view.
function useActiveChapter() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const triggers = CHAPTERS.map((c, i) => ScrollTrigger.create({
      trigger: "#" + c.target, start: "top 45%", end: "bottom 45%",
      onToggle: (s) => s.isActive && setActive(i),
    }));
    return () => triggers.forEach((t) => t.kill());
  }, []);
  return active;
}

function ChapterSwitch({ active }) {
  const ref = useRef();
  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
      trigger: "#ab-story", endTrigger: "#ab-mission", start: "top 60%", end: "bottom 60%",
      onToggle: (s) => ref.current.classList.toggle("is-on", s.isActive),
    });
    return () => st.kill();
  }, []);
  return html`
    <div class="cs-floatwrap" ref=${ref}>
      <div class="cs-filter cs-filter--float ab-switch" role="tablist" aria-label="Chapters">
        <span class="cs-filter__ind" style=${{ "--i": active }}></span>
        ${CHAPTERS.map((c, i) => html`
          <button key=${c.n} role="tab" aria-selected=${i === active} class=${"cs-filter__btn saans" + (i === active ? " is-active" : "")}
            onClick=${() => scrollToSection(c.target)}>${c.short}</button>`)}
      </div>
    </div>`;
}

function App() {
  const [modal, setModal] = useState(null);
  const active = useActiveChapter();
  return html`
    <${ModalContext.Provider} value=${setModal}>
      <${Nav} keepLogo />
      <main>
        <${Hero} />
        <${Wall} />
        <${Band} />
        <${Story} />
        <${Founders} />
        <${Team} />
        <${Mission} />
        <${News} />
        <${Cta} />
      </main>
      <${Footer} wiggle=${false} />
      <${ChapterSwitch} active=${active} />
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
