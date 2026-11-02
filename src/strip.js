import { html, useRef, useState, useEffect, useLayoutEffect, gsap, ScrollTrigger, rem, useModal } from "./lib.js";
import { STRIP } from "./content.js";

const COPIES = 4;

// Storyboard 2: continuous horizontal strip. Drifts on its own, speeds up and follows the
// direction of page scroll, eases to a stop on hover and reveals the caption under the image.
// primaryCta: filled grey pill (landing scroll style) instead of the outlined button.
// feed: captions always visible, plus a rank and a live growth figure on each image
// (ranked in strip order, growth ticks up every few seconds like a real-time feed).
export function Strip({ primaryCta = false, feed = false } = {}) {
  const root = useRef();
  const openModal = useModal();
  const data = STRIP;
  const [mults, setMults] = useState(() => STRIP.map((d) => parseFloat(d.mult)).sort((a, b) => b - a));
  const [bumped, setBumped] = useState(-1);

  // Mock real-time updates: every few seconds one drop's growth ticks up, never past the one ranked above it.
  useEffect(() => {
    if (!feed) return;
    const id = setInterval(() => {
      setMults((m) => {
        const i = Math.floor(Math.random() * m.length);
        const next = Math.round((m[i] + 0.1) * 10) / 10;
        if (i > 0 && next > m[i - 1]) return m;
        setBumped(i);
        return m.map((v, j) => (j === i ? next : v));
      });
    }, 2200);
    return () => clearInterval(id);
  }, [feed]);
  useEffect(() => {
    if (bumped < 0) return;
    const t = setTimeout(() => setBumped(-1), 1000);
    return () => clearTimeout(t);
  }, [bumped]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const track = root.current.querySelector(".strip__track");
      const items = track.children;
      let setW = 0, x = 0, speed = 1, targetSpeed = 1, dir = 1, boost = 0, active = false;

      const measure = () => {
        setW = items[data.length].offsetLeft - items[0].offsetLeft;
        // Figma: first image sits at x = -21.58 with Diplo at x = 228.
        x = -setW - 21.58 * rem();
        gsap.set(track, { x });
      };
      measure();
      ScrollTrigger.addEventListener("refresh", measure);
      const wrap = () => gsap.utils.wrap(-2 * setW, -setW, x);

      const tick = (time, dt) => {
        if (!active) return;
        const f = dt / 16.67;
        speed += (targetSpeed - speed) * 0.06 * f;
        boost *= Math.pow(0.92, f);
        x -= (0.55 * rem() * dir + boost) * speed * f;
        x = wrap();
        gsap.set(track, { x });
      };
      gsap.ticker.add(tick);

      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => { active = self.isActive; },
        onUpdate: (self) => {
          dir = self.direction;
          boost = gsap.utils.clamp(-14, 14, self.getVelocity() / 260) * rem();
        },
      });

      track.addEventListener("mouseenter", () => { targetSpeed = 0; });
      track.addEventListener("mouseleave", () => { targetSpeed = 1; });

      // Scroll-linked entrance for the headline, strip and copy.
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 15%", scrub: 0.6 } })
        .from(".strip__titleInner", { yPercent: 105, stagger: 0.12, ease: "power3.out" }, 0)
        .from(".strip__viewport", { y: 80, opacity: 0, ease: "power2.out" }, 0.15)
        // Text and button move as one block so the gap between them never changes mid-scroll.
        .fromTo(".strip__copy", { y: 30, opacity: 0 }, { y: 0, opacity: 1, ease: "power2.out" }, 0.35);

      return () => {
        gsap.ticker.remove(tick);
        ScrollTrigger.removeEventListener("refresh", measure);
      };
    }, root);
    return () => ctx.revert();
  }, []);

  const all = Array.from({ length: COPIES }, (_, c) => data.map((s, i) => ({ ...s, i, key: `${c}-${i}` }))).flat();

  return html`
    <section class=${"strip" + (feed ? " strip--feed" : "")} id="why" ref=${root}>
      <h2 class="strip__title h-xl fC">
        <span class="mask"><span class="strip__titleInner">The drop marketing platform</span></span>
        <span class="mask"><span class="strip__titleInner">that started it all.</span></span>
      </h2>
      <div class="strip__viewport">
        <div class="strip__track">
          ${all.map((s) => html`
            <figure key=${s.key} class="strip__item">
              <div class="strip__media">
                <img src=${s.img} alt=${s.name} loading="lazy" />
                ${feed && html`
                  <div class="strip__top fB">
                    <span>${s.i + 1}</span>
                    <span class=${"strip__growth" + (bumped === s.i ? " is-up" : "")}><svg class="strip__arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.4,18L5,16.6L14.6,7H6V5H18V17H16V8.4L6.4,18Z" /></svg>${mults[s.i].toFixed(1)}×</span>
                  </div>`}
              </div>
              <figcaption class="strip__cap">
                <span class="mask"><span class="strip__name fD">${s.name}</span></span>
                <span class="strip__meta fB"><span>${s.meta}</span>${!feed && html`<span>${s.mult}</span>`}</span>
                <span class="strip__rule"></span>
              </figcaption>
            </figure>`)}
        </div>
      </div>
      <div class="strip__copy">
        <p class="fB">We built everything it takes to sell out your next drop faster. For the artist with 1,000 fans and the festival selling out arenas.</p>
        <button class=${primaryCta ? "pill pill--grey" : "outline-pill saans"} onClick=${() => openModal({ type: "signup" })}>Create a drop like this</button>
      </div>
    </section>
  `;
}
