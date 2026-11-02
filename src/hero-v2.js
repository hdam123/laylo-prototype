import { html, useRef, useLayoutEffect, gsap, A, REDUCED, useModal } from "./lib.js";

// Version B hero (Figma "Landing Scroll 2", node 82:3).
// Pinned. The purple word cycles TOUR → LINEUP → PRE SALE → MERCH → SHOW while the photo
// column on the right moves up one image per word, so the centred photo always matches the word.
const WORDS = ["TOUR", "LINEUP", "PRE SALE", "MERCH", "SHOW"];

// Merch and lineup use the Figma frame crops (as % of the 429 × 322 frame); the rest fill their frame.
const MERCH_CROP = { width: "112.12%", height: "185.76%", left: "-3.26%", top: "-21.12%" };
const LINEUP_CROP = { width: "103.87%", height: "138.51%", left: "-1.93%", top: "-3.11%" };

// Index 1 is centred at rest (as in Figma); each word step moves the next one to the centre.
const REEL = [
  { img: A("hero-merch.jpg"), crop: MERCH_CROP }, // peeks above, as in Figma
  { img: A("hero-portrait.jpg") }, // TOUR
  { img: A("hero-lineup.jpg"), crop: LINEUP_CROP }, // LINEUP
  { img: A("hero-presale.jpg") }, // PRE SALE
  { img: A("hero-merch.jpg"), crop: MERCH_CROP }, // MERCH
  { img: A("hero-show.jpg") }, // SHOW
  { img: A("hero-portrait.jpg") }, // peeks below at the end
];

export function HeroV2() {
  const root = useRef();
  const openModal = useModal();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray(".hero2__word");
      const slot = root.current.querySelector(".hero2__slot");
      const track = root.current.querySelector(".hero2__track");
      const items = track.children;
      const w = (i) => () => words[i].offsetWidth;
      const pitch = () => items[1].offsetTop - items[0].offsetTop;

      gsap.set(words.slice(1), { yPercent: 115 });

      // Load-in (time based, runs once).
      gsap.from(".hero2__lineInner", { yPercent: 110, duration: 1.1, ease: "power4.out", stagger: 0.08, delay: 0.15 });
      gsap.from(".hero2__cta", { y: 20, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.5 });
      // The photos you can see at rest "drop" in from above the screen and stack up from the
      // bottom (lowest lands first), so none falls through one that has already landed.
      // Photos off-screen below stay put. Scrolling then moves the column as before.
      const onScreen = [...items].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.bottom > 0 && r.top < window.innerHeight;
      });
      gsap.from(onScreen, {
        y: () => -(window.innerHeight + 400),
        duration: 1.25,
        ease: "expo.out",
        stagger: { each: 0.14, from: "end" },
        delay: 0.15,
      });

      const mm = gsap.matchMedia();
      mm.add({ motion: `not ${REDUCED}` }, () => {
        const steps = WORDS.length - 1;
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
        tl.fromTo(slot, { width: w(0) }, { width: w(0), duration: 0.001 }, 0)
          .fromTo(track, { y: 0 }, { y: 0, duration: 0.001 }, 0);
        for (let i = 1; i <= steps; i++) {
          const at = (i - 1) + 0.2;
          tl.to(words[i - 1], { yPercent: -115, duration: 0.45, ease: "power2.in" }, at)
            .to(words[i], { yPercent: 0, duration: 0.5, ease: "power3.out" }, at + 0.25)
            .to(slot, { width: w(i), duration: 0.6, ease: "power2.inOut" }, at + 0.1)
            .to(track, { y: () => -pitch() * i, duration: 0.75, ease: "power3.inOut" }, at);
        }
        tl.to({}, { duration: 0.25 });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return html`
    <section class="hero2" id="top" ref=${root}>
      <div class="hero2__frame">
        <h1 class="hero2__title fC">
          <span class="hero2__line"><span class="hero2__lineInner">RUN THE PERFECT</span></span>
          <span class="hero2__line"><span class="hero2__lineInner"><span class="hero2__accent"><span class="hero2__slot">${WORDS.map((wd) => html`<span key=${wd} class="hero2__word">${wd}</span>`)}</span> DROP</span>.</span></span>
          <span class="hero2__line"><span class="hero2__lineInner">AND SELL IT OUT.</span></span>
        </h1>
        <button class="pill hero2__cta fA" onClick=${() => openModal({ type: "demo" })}>See a demo</button>
        <div class="hero2__reel">
          <div class="hero2__track">
            ${REEL.map((r, i) => html`
              <div key=${i} class="hero2__item">
                <img src=${r.img} alt="" style=${r.crop ? { ...r.crop, position: "absolute", maxWidth: "none", objectFit: "cover" } : undefined} />
              </div>`)}
          </div>
        </div>
      </div>
    </section>
  `;
}
