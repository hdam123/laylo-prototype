import { html, useRef, useLayoutEffect, gsap, A, REDUCED, useModal } from "./lib.js";
import { HERO_WORDS } from "./content.js";

// Right half: Figma "Version A_Landing Scroll_Right Panel Frames" (90:1864). The phone on the
// shelf shows a different screen per word; each new screen swipes up with the left image.
// All positions are Figma px in the 720 × 800 panel, scaled by --p (styles.css .hero__right).
const u = (n) => `calc(${n} * var(--p))`;
const box = (x, y, w, h, extra) => ({ left: u(x), top: u(y), width: u(w), height: u(h), ...extra });
const CROP = { position: "absolute", left: 0, top: "-26.95%", width: "100.25%", height: "153.75%", maxWidth: "none", objectFit: "cover" };

// Screen layers, positioned relative to the screen's top-left (244.18, 133.35) in the panel.
function Bubble({ x, y, w, h, bg, size, pad, r, text }) {
  return html`<div class="hero__bubble" style=${box(x, y, w, h, { background: bg, padding: u(pad), borderRadius: u(r) })}><p style=${{ fontSize: u(size) }}>${text}</p></div>`;
}
function Card({ x, y, w, h, imgH, bg, r, gap, pb, size, link, color = "#000", img, crop, title, padX, url = "oliviadean.laylo.co" }) {
  return html`
    <div class="hero__card" style=${box(x, y, w, h, { background: bg, borderRadius: u(r), gap: u(gap), paddingBottom: u(pb), color })}>
      <div class="hero__cardImg" style=${{ height: u(imgH), borderRadius: `${u(r)} ${u(r)} 0 0` }}><img src=${img} alt="" style=${crop ? CROP : undefined} /></div>
      <p style=${{ fontSize: u(size), padding: `0 ${u(padX)}` }}>${title}</p>
      <p style=${{ fontSize: u(link), padding: `0 ${u(padX)}` }}>${url}</p>
    </div>`;
}
const BASE = A("phone-a/base.jpg");
const SCREENS = [
  // TOUR: Olivia Dean thread
  html`<img class="hero__base" src=${BASE} alt="" />
    <div class="hero__white" style=${box(0, 132.49, 230.72, 320.54)}></div>
    <div class="hero__white" style=${box(61.4, 32.96, 108.57, 57.52)}></div>
    <img class="hero__avatar" src=${A("hero-olivia.jpg")} alt="" style=${box(97.82, 35.65, 34.9, 34.9)} />
    <div class="hero__name nhg-md" style=${{ left: u(115.18), top: u(67.86), padding: u(3.23), borderRadius: u(11.25), fontSize: u(9.048), borderWidth: u(0.129) }}>Olivia Dean</div>
    <${Bubble} x=${9.05} y=${132.49} w=${126.02} h=${34.39} bg="#e9e9ea" size=${7.755} pad=${7.5} r=${11.25} text="You’re in, tickets on sale 26 June, 10AM" />
    <${Bubble} x=${9.05} y=${169.46} w=${126.02} h=${34.39} bg="#e9e9ea" size=${7.755} pad=${7.5} r=${11.25} text="Claim your presale code to access today's presale!" />
    <${Card} x=${9.05} y=${206.44} w=${126.02} h=${145.47} imgH=${102.71} bg="#e9e9ea" r=${12.68} gap=${4.23} pb=${8.46} size=${7.755} link=${5.17} padX=${7.5} img=${A("phone-a/card-1.jpg")} crop=${true} url="oliviadean.laylo.co" title="Get your presale code, the art of loving" />`,
  // LINEUP: concert photo card
  html`<img class="hero__base" src=${BASE} alt="" />
    <div class="hero__white" style=${box(0, 132.49, 230.72, 320.54)}></div>
    <div class="hero__white" style=${box(61.4, 32.96, 108.57, 57.52)}></div>
    <${Card} x=${7.14} y=${66.65} w=${216.58} h=${250} imgH=${176.52} bg="#e9e9ea" r=${21.8} gap=${7.27} pb=${14.53} size=${12} link=${8.885} padX=${12.89} img=${A("phone-a/card-2.jpg")} title="Get your presale code, the art of loving" />`,
  // PRE SALE: venue card + presale messages on a warm tint
  html`<img class="hero__base" src=${BASE} alt="" />
    <div class="hero__white" style=${box(0, 132.49, 230.72, 320.54)}></div>
    <div class="hero__white" style=${box(61.82, 32.65, 108, 121)}></div>
    <div class="hero__tint" style=${box(-0.18, -0.35, 231, 509, { background: "#f6f1ea", borderRadius: u(32) })}></div>
    <div class="hero__col" style=${{ left: u(8.82), top: u(73.65), width: u(148.77), gap: u(4) }}>
      <${Card} x=${0} y=${0} w=${148.77} h=${171.73} imgH=${121.25} bg="#fff" r=${14.97} gap=${4.99} pb=${9.98} size=${9.155} link=${6.103} padX=${8.86} img=${A("phone-a/card-3.jpg")} crop=${true} title="Get your presale code, the art of loving" />
      <${Bubble} x=${0} y=${0} w=${148.77} h=${40.6} bg="#fff" size=${9.155} pad=${8.855} r=${13.28} text="You’re in, tickets on sale 26 June, 10AM" />
      <${Bubble} x=${0} y=${0} w=${148.77} h=${40.6} bg="#fff" size=${9.155} pad=${8.855} r=${13.28} text="Claim your presale code to access today's presale!" />
    </div>`,
  // MERCH: merch launch card
  html`<img class="hero__base" src=${BASE} alt="" />
    <div class="hero__white" style=${box(0, 132.49, 230.72, 320.54)}></div>
    <div class="hero__white" style=${box(61.82, 32.65, 108, 121)}></div>
    <div class="hero__tint" style=${box(-0.18, -0.35, 231, 509, { background: "#f1f1f1", borderRadius: u(32) })}></div>
    <${Card} x=${4.82} y=${126.65} w=${221.26} h=${255.4} imgH=${180.33} bg="#6e6e6e" r=${22.27} gap=${7.42} pb=${14.85} size=${13.478} link=${9.077} padX=${13.17} color="#fff" img=${A("phone-a/card-4.jpg")} crop=${true} title="The Art of Loving, Merch launch" />`,
  // SHOW: Diplo card
  html`<img class="hero__base" src=${BASE} alt="" />
    <div class="hero__white" style=${box(0, 132.49, 230.72, 320.54)}></div>
    <div class="hero__white" style=${box(61.4, 32.96, 108.57, 57.52)}></div>
    <${Card} x=${7.14} y=${66.65} w=${216.58} h=${250} imgH=${176.52} bg="#e9e9ea" r=${21.8} gap=${7.27} pb=${14.53} size=${12} link=${8.885} padX=${12.89} img=${A("phone-a/card-5.jpg")} url="diplo.laylo.co" title="Get your presale code, the art of loving" />`,
];

// words: also used by Version A2 (hero-a2.js) with its own, shorter word list.
export function PhonePanel({ words = HERO_WORDS } = {}) {
  return html`
    <div class="hero__right">
      <div class="hero__stage">
        <div class="hero__phone" style=${box(-268.35, -138, 1256.7, 1135)}><img src=${A("phone-a/phone.jpg")} alt="" /></div>
        ${words.map(({ screen }) => SCREENS[screen]).map((content, i) => html`
          <div key=${i} class="hero__screen nhg" style=${box(244.18, 133.35, 230.97, 502.14, { borderRadius: u(34.26) })}>${content}</div>`)}
        <div class="hero__shade"></div>
      </div>
    </div>`;
}

// Storyboard 1: pinned hero. Scrolling swaps TOUR → PRE-SAVE → EVENT → MERCH,
// and each word wipes in its own image on the left half and its phone screen on the right
// Fully scrubbed, so it reverses cleanly.
export function Hero() {
  const root = useRef();
  const openModal = useModal();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray(".hero__word");
      const imgs = gsap.utils.toArray(".hero__img");
      const screens = gsap.utils.toArray(".hero__screen");
      const slot = root.current.querySelector(".hero__slot");
      const w = (i) => () => words[i].offsetWidth;

      gsap.set(words, { xPercent: -50 });
      gsap.set(words.slice(1), { yPercent: 115 });
      gsap.set([...imgs.slice(1), ...screens.slice(1)], { clipPath: "inset(100% 0% 0% 0%)" });

      // Load-in (time based, runs once).
      gsap.fromTo(".hero__lineInner", { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.08, delay: 0.15 });
      // fromTo, not from: if this runs again mid-tween, from() would lock in a half-way offset.
      gsap.fromTo(".hero__ctas .pill", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.08, delay: 0.55 });
      gsap.from(".hero__img--0 img, .hero__stage", { scale: 1.12, duration: 1.6, ease: "power3.out" });

      const mm = gsap.matchMedia();
      mm.add({ motion: `not ${REDUCED}` }, () => {
        const steps = words.length - 1;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => "+=" + window.innerHeight * steps * 0.75,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        tl.fromTo(slot, { width: w(0) }, { width: w(0), duration: 0.001 }, 0);
        for (let i = 1; i <= steps; i++) {
          const at = (i - 1) + 0.2;
          tl.to(words[i - 1], { yPercent: -115, duration: 0.45, ease: "power2.in" }, at)
            .to(words[i], { yPercent: 0, duration: 0.5, ease: "power3.out" }, at + 0.25)
            .to(slot, { width: w(i), duration: 0.6, ease: "power2.inOut" }, at + 0.1)
            .to(imgs[i], { clipPath: "inset(0% 0% 0% 0%)", duration: 0.75, ease: "power3.inOut" }, at);
          if (screens[i]) tl.to(screens[i], { clipPath: "inset(0% 0% 0% 0%)", duration: 0.75, ease: "power3.inOut" }, at);
        }
        tl.to({}, { duration: 0.25 });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return html`
    <section class="hero" id="top" ref=${root}>
      <${PhonePanel} />
      <div class="hero__left">
        ${HERO_WORDS.map((h, i) => html`
          <div key=${h.word} class=${`hero__img hero__img--${i}`}><img src=${h.img} alt="" /></div>`)}
      </div>
      <div class="hero__copy">
      <h1 class="hero__title fC">
        <span class="hero__line"><span class="hero__lineInner">RUN THE PERFECT <span class="hero__slot">${HERO_WORDS.map((h) => html`<span key=${h.word} class="hero__word">${h.word}</span>`)}</span> DROP.</span></span>
        <span class="hero__line"><span class="hero__lineInner">AND SELL IT OUT.</span></span>
      </h1>
      <div class="hero__ctas">
        <button class="pill pill--grey" onClick=${() => openModal({ type: "demo" })}>See a demo</button>
        <button class="pill pill--grey" onClick=${() => openModal({ type: "signup" })}>Sign up</button>
      </div>
      </div>
    </section>
  `;
}
