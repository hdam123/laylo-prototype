import { html, useRef, useLayoutEffect, gsap, REDUCED, useModal } from "./lib.js";
import { HERO_WORDS } from "./content.js";
import { PhonePanel } from "./hero.js";

// Version A2 landing: same layout as A, but not pinned, so the page scrolls straight past.
// Four slides (TOUR → PRE-SAVE → EVENT → MERCH) advance on their own, every image and phone
// screen wiping in from left to right. Loops while the hero is on screen.
const WORDS = HERO_WORDS;
const HOLD = 3.2; // seconds per slide

export function Hero() {
  const root = useRef();
  const openModal = useModal();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray(".hero__word");
      const imgs = gsap.utils.toArray(".hero__img");
      const screens = gsap.utils.toArray(".hero__screen");
      const bars = gsap.utils.toArray(".heroA2__barFill");
      const slot = root.current.querySelector(".hero__slot");

      gsap.set(words, { xPercent: -50 });
      gsap.set(words.slice(1), { opacity: 0 });
      gsap.set([...imgs.slice(1), ...screens.slice(1)], { clipPath: "inset(0% 100% 0% 0%)" });
      gsap.set(slot, { width: words[0].offsetWidth });

      // Load-in (time based, runs once).
      gsap.fromTo(".hero__lineInner", { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.08, delay: 0.15 });
      gsap.fromTo(".hero__ctas .pill", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.08, delay: 0.55 });
      gsap.from(".hero__img--0 img, .hero__stage", { scale: 1.12, duration: 1.6, ease: "power3.out" });

      const mm = gsap.matchMedia();
      mm.add({ motion: `not ${REDUCED}` }, () => {
        let i = 0, timer;
        const fill = () => gsap.fromTo(bars[i], { scaleX: 0 }, { scaleX: 1, duration: HOLD, ease: "none" });
        const go = () => {
          const prev = i;
          i = (i + 1) % WORDS.length;
          gsap.set(bars, { scaleX: 0 });
          // Incoming slide on top, outgoing just under it, the rest below.
          gsap.set([...imgs, ...screens], { zIndex: 0 });
          gsap.set([imgs[prev], screens[prev]], { zIndex: 1 });
          gsap.set([imgs[i], screens[i]], { zIndex: 2, clipPath: "inset(0% 100% 0% 0%)" });
          gsap.to([imgs[i], screens[i]], { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power3.inOut" });
          gsap.to(words[prev], { x: 40, opacity: 0, duration: 0.4, ease: "power2.in" });
          gsap.fromTo(words[i], { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, ease: "power3.out", delay: 0.25 });
          gsap.to(slot, { width: words[i].offsetWidth, duration: 0.6, ease: "power2.inOut", delay: 0.1 });
          fill();
          timer = gsap.delayedCall(HOLD, go);
        };
        fill();
        timer = gsap.delayedCall(HOLD, go);
        return () => timer && timer.kill();
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return html`
    <section class="hero heroA2" id="top" ref=${root}>
      <${PhonePanel} words=${WORDS} />
      <div class="hero__left">
        ${WORDS.map((h, i) => html`
          <div key=${h.word} class=${`hero__img hero__img--${i}`}><img src=${h.img} alt="" /></div>`)}
      </div>
      <div class="hero__copy">
      <h1 class="hero__title fC">
        <span class="hero__line"><span class="hero__lineInner">RUN THE PERFECT <span class="hero__slot">${WORDS.map((h) => html`<span key=${h.word} class="hero__word">${h.word}</span>`)}</span> DROP.</span></span>
        <span class="hero__line"><span class="hero__lineInner">AND SELL IT OUT.</span></span>
      </h1>
      <div class="hero__ctas">
        <button class="pill pill--grey" onClick=${() => openModal({ type: "demo" })}>See a demo</button>
        <button class="pill pill--grey" onClick=${() => openModal({ type: "signup" })}>Sign up</button>
      </div>
      </div>
      <div class="heroA2__bars" aria-hidden="true">
        ${WORDS.map((h) => html`<span key=${h.word} class="heroA2__bar"><span class="heroA2__barFill"></span></span>`)}
      </div>
    </section>
  `;
}
