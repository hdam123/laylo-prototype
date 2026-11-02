import { html, useRef, useLayoutEffect, gsap, DESKTOP } from "./lib.js";
import { TESTIMONIALS } from "./content.js";

const imgStyle = (crop) => crop
  ? { width: crop.w + "%", height: crop.h + "%", left: crop.l + "%", top: crop.t + "%" }
  : { width: "100%", height: "100%", left: 0, top: 0 };

function Card({ t, peek }) {
  return html`
    <article class=${"tm__card" + (peek ? " is-peek" : "")}>
      <div class="tm__img"><img src=${t.img} alt="" style=${imgStyle(t.crop)} loading="lazy" /></div>
      <div class="tm__text">
        <div>
          <div class="tm__stat saans">${t.stat}</div>
          <div class="tm__label saans">${t.label}</div>
        </div>
        <div>
          <p class="tm__quote fA">${t.quote}</p>
          <div class="tm__who fA">${t.who[0]}<br />${t.who[1]}</div>
        </div>
      </div>
    </article>`;
}

// Storyboard 7: pinned, scroll drives the testimonial strip sideways.
export function Testimonials() {
  const root = useRef();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const track = root.current.querySelector(".tm__track");
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 80%", end: "top 10%", scrub: 0.6 } })
        .from(".tm__titleInner", { yPercent: 105, stagger: 0.08, ease: "power3.out" }, 0)
        .from(".tm__card", { y: 90, opacity: 0, stagger: 0.06, ease: "power2.out" }, 0.1);

      const mm = gsap.matchMedia();
      mm.add(DESKTOP, () => {
        const dist = () => {
          const pad = parseFloat(getComputedStyle(document.documentElement).fontSize) * 60;
          return Math.max(0, track.offsetLeft + track.offsetParent.getBoundingClientRect().left + track.scrollWidth - (window.innerWidth - pad));
        };
        gsap.fromTo(track, { x: 0 }, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => "+=" + dist(), pin: ".tm__pin", scrub: 0.7, invalidateOnRefresh: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const last = TESTIMONIALS[TESTIMONIALS.length - 1];
  return html`
    <section class="tm" id="greatest-hits" ref=${root}>
      <div class="tm__pin">
        <div class="stage tm__stage">
          <h2 class="h-xl fC tm__title">
            <span class="mask"><span class="tm__titleInner">The world's most iconic</span></span>
            <span class="mask"><span class="tm__titleInner">artists, festivals & creators</span></span>
            <span class="mask"><span class="tm__titleInner">run their drops with Laylo.</span></span>
          </h2>
          <div class="tm__track">
            <${Card} t=${last} peek=${true} />
            ${TESTIMONIALS.map((t) => html`<${Card} key=${t.stat} t=${t} />`)}
          </div>
        </div>
      </div>
    </section>
  `;
}
