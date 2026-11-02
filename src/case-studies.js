// Case Studies index (Figma 217:2155). Same runtime and choreography as the homepage:
// masked headline reveals, a drifting featured strip, a pinned horizontal music rail.
import { html, gsap, ScrollTrigger, setLenis, useState, useRef, useLayoutEffect, useEffect, ModalContext, useModal, rem, scrollToSection, DESKTOP } from "./lib.js";
import { Nav } from "./nav.js";
import { Modal } from "./modal.js";
import { Footer } from "./footer.js";
import { HERO, FEATURED, FEATURED_COPY, FILTERS, TOURS, MERCH, MUSIC, EVENTS, CTA } from "./cs-content.js";

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

// Case card (Figma "Case Card" component): image, name, result, optional category.
const Card = ({ c, cat, i = 0 }) => html`
  <a class="cs-card" href=${c.href} target="_blank" rel="noopener" data-rise=${i}>
    <span class="cs-card__img"><img src=${c.img} alt=${c.name} loading="lazy" /></span>
    <span class="cs-card__name fC">${c.name}</span>
    <span class="cs-card__row fA"><span>${c.result}</span>${cat && html`<span>${cat}</span>`}</span>
    <span class="cs-card__rule"></span>
  </a>`;

function Hero() {
  const root = useRef();
  const openModal = useModal();
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline()
        .from(".cs-hero__img img", { scale: 1.15, duration: 2.2, ease: "power3.out" }, 0)
        .from(".cs-hero__img", { clipPath: "inset(0 0 100% 0)", stagger: 0.12, duration: 1.3, ease: "power3.inOut" }, 0)
        .from(".cs-hero .cs-line", { yPercent: 105, stagger: 0.1, duration: 1, ease: "power3.out" }, 0.6)
        .from(".cs-hero__sub, .cs-hero__cta", { y: 20, opacity: 0, stagger: 0.1, duration: 0.9, ease: "power3.out" }, 0.9);
      // Scroll away: photos drift slower than the page, copy lifts and fades.
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } })
        .to(".cs-hero__img img", { yPercent: 12, ease: "none" }, 0)
        .to(".cs-hero__copy", { y: -80, opacity: 0, ease: "none" }, 0);
    }, root);
    return () => ctx.revert();
  }, []);
  return html`
    <section class="cs-hero" ref=${root} data-nav="dark">
      <div class="cs-hero__img"><img src=${HERO.bg} alt="" /></div>
      <div class="cs-hero__copy">
        <h1 class="h-xl fC"><${Lines} lines=${HERO.title} /></h1>
        <p class="cs-hero__sub fA">${HERO.sub[0]}<br />${HERO.sub[1]}</p>
        <button class="cs-hero__cta outline-pill saans cs-tag cs-tag--filled" onClick=${() => openModal({ type: "demo" })}>Book a demo</button>
      </div>
    </section>`;
}

// Featured strip: edge to edge like the homepage strip; drifts on its own, follows scroll
// direction, eases to a stop on hover.
function Featured() {
  const root = useRef();
  useEntrance(root);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const track = root.current.querySelector(".cs-feat__track");
      let setW = 0, x = 0, speed = 1, target = 1, dir = 1, boost = 0, active = false;
      const measure = () => { setW = track.children[FEATURED.length].offsetLeft; x = -setW; gsap.set(track, { x }); };
      measure();
      ScrollTrigger.addEventListener("refresh", measure);
      const tick = (t, dt) => {
        if (!active) return;
        const f = dt / 16.67;
        speed += (target - speed) * 0.06 * f;
        boost *= Math.pow(0.92, f);
        x -= (0.45 * rem() * dir + boost) * speed * f;
        x = gsap.utils.wrap(-2 * setW, -setW, x);
        gsap.set(track, { x });
      };
      gsap.ticker.add(tick);
      ScrollTrigger.create({
        trigger: root.current, start: "top bottom", end: "bottom top",
        onToggle: (s) => { active = s.isActive; },
        onUpdate: (s) => { dir = s.direction; boost = gsap.utils.clamp(-12, 12, s.getVelocity() / 260) * rem(); },
      });
      track.addEventListener("mouseenter", () => { target = 0; });
      track.addEventListener("mouseleave", () => { target = 1; });
      gsap.from(".cs-feat__viewport", { y: 80, opacity: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 70%" } });
      return () => { gsap.ticker.remove(tick); ScrollTrigger.removeEventListener("refresh", measure); };
    }, root);
    return () => ctx.revert();
  }, []);
  const all = [0, 1, 2, 3].flatMap((c) => FEATURED.map((f) => ({ ...f, key: c + f.name })));
  return html`
    <section class="cs-feat" ref=${root} data-nav="dark">
      <h2 class="h-xl fC cs-feat__title"><${Lines} lines=${["Featured drops."]} /></h2>
      <div class="cs-feat__viewport">
        <div class="cs-feat__track">
          ${all.map((f) => html`
            <a key=${f.key} class="cs-feat__item" href=${f.href} target="_blank" rel="noopener">
              <span class="cs-feat__img"><img src=${f.img} alt=${f.name} loading="lazy" /></span>
              <span class="cs-feat__meta">
                <span class="cs-feat__row"><span class="fB cs-feat__name">${f.name}</span><span class="cs-label cs-feat__cat">${f.cat}</span></span>
                <span class="fA cs-feat__result">${f.result}</span>
              </span>
            </a>`)}
        </div>
      </div>
      <div class="cs-feat__copy" data-rise>
        <p class="fA">${FEATURED_COPY}</p>
        <a class="pill pill--grey" href="https://laylo.com/case-studies" target="_blank" rel="noopener">Browse all drops</a>
      </div>
    </section>`;
}

// Drop filter: the pill group under "Drop everything", repeated as a floating bar while the
// four category sections are on screen. The active pill follows the section in view.
function useActiveCategory() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const triggers = FILTERS.map((f, i) => ScrollTrigger.create({
      trigger: "#" + f.target, start: "top 35%", end: "bottom 35%",
      onToggle: (s) => s.isActive && setActive(i),
    }));
    return () => triggers.forEach((t) => t.kill());
  }, []);
  return active;
}

function Filter({ active, floating = false }) {
  return html`
    <div class=${"cs-filter" + (floating ? " cs-filter--float" : "")} role="tablist" aria-label="Drop type">
      <span class="cs-filter__ind" style=${{ "--i": active }}></span>
      ${FILTERS.map((f, i) => html`
        <button key=${f.label} role="tab" aria-selected=${i === active} class=${"cs-filter__btn saans" + (i === active ? " is-active" : "")}
          onClick=${() => scrollToSection(f.target)}>${f.label}</button>`)}
    </div>`;
}

function FloatingFilter({ active }) {
  const ref = useRef();
  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
      // Appears once the inline filter has scrolled off the top, until the events section ends.
      trigger: "#cs-tours .cs-filter", endTrigger: "#cs-events", start: "bottom top", end: "bottom 60%",
      onToggle: (s) => ref.current.classList.toggle("is-on", s.isActive),
    });
    return () => st.kill();
  }, []);
  return html`<div class="cs-floatwrap" ref=${ref}><${Filter} active=${active} floating /></div>`;
}

function Tours({ active }) {
  const root = useRef();
  useEntrance(root);
  const f = TOURS.feature;
  return html`
    <section class="cs-tours" id="cs-tours" ref=${root} data-nav="light">
      <div class="cs-tours__head">
        <h2 class="h-xl fC"><${Lines} lines=${["Drop everything."]} /></h2>
        <p class="fA" data-rise>Pick a drop type to see who’s doing it best.</p>
        <div data-rise="1"><${Filter} active=${active} /></div>
      </div>
      <div class="cs-story">
        <div class="cs-story__left">
          <div class="cs-label" data-rise>${TOURS.label}</div>
          <h3 class="cs-h36 fC" data-rise>${TOURS.title}</h3>
          <p class="cs-body fA" data-rise="1">${TOURS.quote}</p>
          <p class="cs-label cs-who" data-rise="1">${TOURS.quoteWho}</p>
          <ul class="cs-points">
            ${TOURS.points.map((p, i) => html`<li key=${p} class="fA" data-rise=${i}>${p}</li>`)}
          </ul>
          <div data-rise><${Tag} href="https://laylo.com/case-studies">View all tours</${Tag}></div>
        </div>
        <span class="cs-story__divider"></span>
        <a class="cs-story__img" href=${f.href} target="_blank" rel="noopener" data-wipe><img src=${f.img} alt=${f.name} /></a>
        <div class="cs-story__right">
          <div data-rise>
            <div class="cs-label">${f.name}</div>
            <h3 class="cs-h36 fC">${f.result}</h3>
            <p class="cs-body fA cs-sub">${f.sub}</p>
          </div>
          <div data-rise="1">
            <p class="cs-body fA">${f.quote}</p>
            <p class="cs-label cs-who">${f.who[0]}<br />${f.who[1]}</p>
          </div>
        </div>
      </div>
    </section>`;
}

function Merch() {
  const root = useRef();
  useEntrance(root);
  return html`
    <section class="cs-merch" id="cs-merch" ref=${root} data-nav="light">
      <h2 class="h-xl fC cs-merch__title"><${Lines} lines=${["Sell out your", "store in style."]} /></h2>
      <div class="cs-grid">
        ${MERCH.cards.map((c, i) => html`
          <div key=${c.name} class="cs-grid__cell">
            <${Card} c=${c} i=${i} />
            <div class="cs-merch__quote" data-rise=${i + 2}>
              <p class="cs-body fA">${c.quote}</p>
              <p class="cs-label cs-who">${c.who}</p>
            </div>
          </div>`)}
      </div>
    </section>`;
}

// Pinned horizontal rail, like the homepage testimonials: vertical scroll moves the cards
// sideways; each purple figure counts up as its card comes into view.
function Music() {
  const root = useRef();
  useEntrance(root);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(DESKTOP, () => {
        const track = root.current.querySelector(".cs-music__track");
        // Scroll until the last card's right edge (plus the track's end padding) meets the stage edge.
        const travel = () => track.offsetLeft + track.scrollWidth - root.current.querySelector(".stage").offsetWidth;
        const tween = gsap.to(track, {
          x: () => -travel(), ease: "none",
          scrollTrigger: { trigger: ".cs-music__pin", start: "top top", end: () => "+=" + travel() * 1.1, pin: true, scrub: 0.6, invalidateOnRefresh: true },
        });
        gsap.utils.toArray(".cs-mcard").forEach((card) => {
          const v = card.querySelector(".cs-stat__value");
          const raw = v.dataset.value;
          const num = parseFloat(raw);
          const suffix = raw.replace(/[\d.]/g, "");
          const o = { n: 0 };
          gsap.to(o, {
            n: num, duration: 1.4, ease: "power2.out",
            onUpdate: () => { v.textContent = Math.round(o.n) + suffix; },
            scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 85%" },
          });
          gsap.from(card.querySelector(".cs-mcard__img img"), {
            scale: 1.2, ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
          });
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return html`
    <section class="cs-music" id="cs-music" ref=${root} data-nav="dark">
      <div class="cs-music__pin">
        <div class="stage">
          <div class="cs-music__head">
            <div class="cs-label">${MUSIC.label}</div>
            <h2 class="h-xl fC"><${Lines} lines=${MUSIC.title} /></h2>
          </div>
          <div class="cs-music__track">
            ${MUSIC.cards.map((c) => html`
              <article key=${c.name} class="cs-mcard">
                <a class="cs-mcard__img" href=${c.href} target="_blank" rel="noopener"><img src=${c.img} alt=${c.name} loading="lazy" /></a>
                <div class="cs-mcard__copy">
                  <div class="cs-stat">
                    <div class="cs-stat__value saans" data-value=${c.value}>${c.value}</div>
                    <div class="cs-stat__label fA">${c.label}</div>
                  </div>
                  <div class="cs-mcard__foot">
                    <div class="cs-mcard__name fC">${c.name}</div>
                    ${c.quote && html`<p class="cs-body fA">${c.quote}</p><p class="cs-label cs-who">${c.who}</p>`}
                    <${Tag} tone="light" href=${c.href}>Read case study ›</${Tag}>
                  </div>
                </div>
              </article>`)}
          </div>
        </div>
      </div>
    </section>`;
}

function Events() {
  const root = useRef();
  useEntrance(root);
  const f = EVENTS.feature;
  return html`
    <section class="cs-events" id="cs-events" ref=${root} data-nav="light">
      <div class="cs-events__head">
        <div class="cs-label" data-rise>${EVENTS.label}</div>
        <h2 class="h-xl fC"><${Lines} lines=${EVENTS.title} /></h2>
      </div>
      <div class="cs-feature">
        <a class="cs-feature__img" href=${f.href} target="_blank" rel="noopener" data-wipe><img src=${f.img} alt=${f.name} /></a>
        <span class="cs-story__divider"></span>
        <div class="cs-feature__copy">
          <div data-rise>
            <div class="cs-label">${f.name}</div>
            <h3 class="cs-h36 fC">${f.result}</h3>
          </div>
          <div class="cs-feature__quote" data-rise="1">
            <img class="cs-avatar" src=${f.avatar} alt="FNGRS CRSSD" />
            <p class="cs-q24 fC">${f.quote}</p>
            <p class="cs-label">${f.who}</p>
          </div>
        </div>
      </div>
      <div class="cs-grid">
        ${EVENTS.cards.map((c, i) => html`<div key=${c.name} class="cs-grid__cell"><${Card} c=${c} cat="Events" i=${i} /></div>`)}
      </div>
      <div class="cs-center" data-rise><${Tag} href="https://laylo.com/case-studies">View all events ›</${Tag}></div>
    </section>`;
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
  const active = useActiveCategory();
  return html`
    <${ModalContext.Provider} value=${setModal}>
      <${Nav} keepLogo />
      <main>
        <${Hero} />
        <${Featured} />
        <${Tours} active=${active} />
        <${Merch} />
        <${Music} />
        <${Events} />
        <${Cta} />
      </main>
      <${Footer} wiggle=${false} />
      <${FloatingFilter} active=${active} />
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
