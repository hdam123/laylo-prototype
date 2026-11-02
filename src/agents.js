import { html, useRef, useState, useEffect, useLayoutEffect, gsap, ScrollTrigger, scrollToY, useModal, DESKTOP } from "./lib.js";
import { AUDIENCES, PHASES, STORIES } from "./content.js";

// Swap displayed content with an out/in animation whenever `value` changes.
function useSwap(value, ref, sel) {
  const [shown, setShown] = useState(value);
  const mounted = useRef(false);
  useEffect(() => {
    const els = ref.current.querySelectorAll(sel);
    gsap.killTweensOf(els);
    if (value === shown) {
      gsap.to(els, { opacity: 1, y: 0, duration: 0.3 });
      return;
    }
    gsap.to(els, { opacity: 0, y: -14, duration: 0.22, stagger: 0.02, ease: "power2.in", onComplete: () => setShown(value) });
  }, [value]);
  useLayoutEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    const els = ref.current.querySelectorAll(sel);
    gsap.fromTo(els, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power3.out" });
  }, [shown]);
  return shown;
}

const imgStyle = (crop) => crop
  ? { width: crop.w + "%", height: crop.h + "%", left: crop.l + "%", top: crop.t + "%", objectFit: "cover" }
  : { width: "100%", height: "100%", left: 0, top: 0, objectFit: "cover" };

// Image frame: each new image wipes up over the previous one. img: null shows a labelled
// "photo to come" panel instead of a stand-in face.
function WipeImage({ item }) {
  const id = item.img || item.label;
  const [layers, setLayers] = useState([{ ...item, id: 0 }]);
  const ref = useRef();
  const n = useRef(0);
  useEffect(() => {
    const top = layers[layers.length - 1];
    if ((top.img || top.label) === id) return;
    n.current += 1;
    setLayers((ls) => [...ls.slice(-1), { ...item, id: n.current }]);
  }, [id]);
  useLayoutEffect(() => {
    if (layers.length < 2) return;
    const next = ref.current.children[1];
    gsap.fromTo(next, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power3.inOut" });
  }, [layers]);
  return html`
    <div class="ag__img" ref=${ref}>
      ${layers.map((l) => html`
        <div key=${l.id} class="ag__imgLayer">
          ${l.img
            ? html`<img src=${l.img} alt="" style=${imgStyle(l.crop)} />`
            : html`<div class="ag__imgTodo"><span class="fC">${l.label}</span><small class="fB">Photo to come</small></div>`}
        </div>`)}
    </div>`;
}

// Storyboards 3A → 3B → 3C, reworked per the client brief: one real customer story per tab,
// told as a numbered Before → During → After timeline. Headline + audience switch stay pinned;
// scrolling steps through the timeline, and a progress rail fills along each step as you go.
export function Agents() {
  const [aud, setAud] = useState("Artists");
  const [phase, setPhase] = useState(0);
  const root = useRef();
  const left = useRef();
  const right = useRef();
  const st = useRef(null);
  const ind = useRef();
  const openModal = useModal();

  const shownL = useSwap(aud, left, ".ag-swap");
  const shownR = useSwap(aud, right, ".ag-swap");
  const L = STORIES[shownL], R = STORIES[shownR];
  const live = STORIES[aud];
  const photo = live.imgs[phase] || live.imgs[0];

  // Progress rail: completed steps full, the active step fills with scroll, upcoming steps empty.
  const setRails = (p) => {
    root.current?.querySelectorAll(".ag__railFill").forEach((el, i) => {
      el.style.transform = `scaleX(${Math.min(1, Math.max(0, p - i))})`;
    });
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(DESKTOP, () => {
        st.current = ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: () => "+=" + window.innerHeight * 2.2,
          pin: root.current.querySelector(".ag__pin"),
          onUpdate: (self) => {
            setPhase(Math.min(2, Math.floor(self.progress * 3 * 0.999)));
            setRails(self.progress * 3);
          },
        });
        return () => { st.current = null; };
      });
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 80%", end: "top top", scrub: 0.6 } })
        .from(".ag__titleInner", { yPercent: 105, stagger: 0.1, ease: "power3.out" }, 0)
        .from(".ag__sub, .ag__tabs", { y: 24, opacity: 0, stagger: 0.08 }, 0.2)
        .from(".ag__body", { y: 70, opacity: 0, ease: "power2.out" }, 0.3);
    }, root);
    return () => ctx.revert();
  }, []);

  // Without the pin (mobile), the rail simply marks completed + active steps.
  useEffect(() => { if (!st.current) setRails(phase + 1); }, [phase]);

  // Slide the purple pill under the active audience tab.
  useLayoutEffect(() => {
    const tab = root.current.querySelector(`.ag__tab[data-aud="${aud}"]`);
    gsap.to(ind.current, { x: tab.offsetLeft, width: tab.offsetWidth, duration: 0.5, ease: "power3.inOut" });
  }, [aud]);

  const goPhase = (i) => {
    const s = st.current;
    if (s) scrollToY(s.start + ((i + 0.5) / 3) * (s.end - s.start), { duration: 1 });
    else setPhase(i);
  };

  return html`
    <section class="ag" data-nav="light" id="solutions" ref=${root}>
      <div class="ag__pin">
        <div class="stage ag__stage">
          <h2 class="h-xl fC ag__title">
            <span class="mask"><span class="ag__titleInner">Make every drop</span></span>
            <span class="mask"><span class="ag__titleInner">better than the last.</span></span>
          </h2>
          <p class="ag__sub fB">Let Agents handle the busywork.</p>
          <div class="ag__tabs saans" role="tablist" aria-label="Audience">
            <span class="ag__ind" ref=${ind}></span>
            ${AUDIENCES.map((a) => html`
              <button key=${a} role="tab" aria-selected=${a === aud} class=${"ag__tab" + (a === aud ? " is-active" : "")} data-aud=${a} onClick=${() => setAud(a)}>${a}</button>`)}
          </div>

          <div class="ag__body">
            <ol class="ag__steps" ref=${left} aria-label=${`${L.client}: before, during and after`}>
              ${PHASES.map((p, i) => html`
                <li key=${p} class=${"ag__step" + (i === phase ? " is-active" : "") + (i < phase ? " is-done" : "")}>
                  <button class="ag__stepBtn" onClick=${() => goPhase(i)} aria-current=${i === phase ? "step" : undefined}>
                    <span class="ag__stepHead fB"><span class="ag__stepNum">${String(i + 1).padStart(2, "0")}</span>${p}</span>
                    <span class="ag__stepText fB ag-swap">${L.steps[i]}</span>
                  </button>
                  <span class="ag__rail"><span class="ag__railFill"></span></span>
                </li>`)}
            </ol>
            <div class="ag__divider"></div>
            <${WipeImage} item=${photo} />
            <div class="ag__right fA" ref=${right}>
              <div>
                <div class="ag__client fB ag-swap">${R.client}</div>
                <div class="ag__stat fB ag-swap">${R.stat}</div>
                ${R.sub && html`<p class="ag__statSub ag-swap">${R.sub}</p>`}
                <div class="ag__cta ag-swap">
                  <button class="pill pill--purple" onClick=${() => openModal({ type: "signup", context: `a drop like ${R.client}` })}>Run a drop like this</button>
                  ${R.caseStudy && html`<a class="ag__caseLink" href=${R.caseStudy} target="_blank" rel="noopener noreferrer">Read the case study</a>`}
                </div>
              </div>
              ${R.quote && html`
                <div>
                  <p class="ag__quote ag-swap">“${R.quote}”</p>
                  <div class="ag__who ag-swap">${R.who[0]}<br />${R.who[1]}</div>
                </div>`}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
