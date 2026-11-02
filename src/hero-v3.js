import { html, useRef, useLayoutEffect, gsap, A, REDUCED } from "./lib.js";

// Version C hero (Figma "Landing Scroll 3", section 86:2533: frames 27–31).
// Pinned, full-bleed photo with a centred headline. Scrolling rolls the word
// TOUR → LINEUP → PRESALE → MERCH → SHOW and each new photo swipes up over the last.
//
// Photos are AI-upscaled (EDSR, 2x; 4x for SHOW) from the Figma originals into assets/v3/,
// so they stay sharp full-screen; Versions A and B keep their own copies.
// Photo boxes are the Figma layer geometry, in px relative to the 1440 × 930 frame's centre
// (720, 465). styles-v3.css scales them with --c so the photo always covers the viewport.
const SLIDES = [
  { word: "TOUR", img: A("v3/tour.jpg"), box: [-720, -801, 1440, 1921] },
  { word: "LINEUP", img: A("v3/lineup.jpg"), box: [-720, -721, 1441, 1442] },
  { word: "PRESALE", img: A("v3/presale.jpg"), box: [-744, -903, 1488, 1444] },
  { word: "MERCH", img: A("v3/merch.jpg"), box: [-734, -1063, 1474, 1833] },
  { word: "SHOW", img: A("v3/show.jpg"), box: [-744, -832, 1489, 1489] },
];

const boxStyle = ([dx, dy, w, h]) => ({
  left: `calc(50% + ${dx} * var(--c))`,
  top: `calc(50% + ${dy} * var(--c))`,
  width: `calc(${w} * var(--c))`,
  height: `calc(${h} * var(--c))`,
});

export function HeroV3() {
  const root = useRef();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray(".hero3__word");
      const slides = gsap.utils.toArray(".hero3__slide");
      const slot = root.current.querySelector(".hero3__slot");
      const w = (i) => () => words[i].offsetWidth;

      gsap.set(words, { xPercent: -50 });
      gsap.set(words.slice(1), { yPercent: 115 });
      gsap.set(slides.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });

      // Load-in (time based, runs once).
      gsap.from(".hero3__lineInner", { yPercent: 110, duration: 1.1, ease: "power4.out", stagger: 0.08, delay: 0.15 });

      const mm = gsap.matchMedia();
      mm.add({ motion: `not ${REDUCED}` }, () => {
        const steps = SLIDES.length - 1;
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
            .to(slides[i], { clipPath: "inset(0% 0% 0% 0%)", duration: 0.75, ease: "power3.inOut" }, at);
        }
        tl.to({}, { duration: 0.25 });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return html`
    <section class="hero3" id="top" ref=${root}>
      ${SLIDES.map((s) => html`
        <div key=${s.word} class="hero3__slide"><img src=${s.img} alt="" style=${boxStyle(s.box)} /></div>`)}
      <h1 class="hero3__title fC">
        <span class="hero3__line"><span class="hero3__lineInner">RUN THE PERFECT <span class="hero3__slot">${SLIDES.map((s) => html`<span key=${s.word} class="hero3__word">${s.word}</span>`)}</span> DROP.</span></span>
        <span class="hero3__line"><span class="hero3__lineInner">AND SELL IT OUT.</span></span>
      </h1>
    </section>
  `;
}
