import { html, useRef, useLayoutEffect, gsap, REDUCED, useModal, scrollToY } from "./lib.js";
import { HERO_CASES } from "./content.js";

// Version A hero, reworked from client feedback (rolling-frames example + meeting notes).
// Scroll (pinned, scrubbed) moves between use cases: the word rolls, the left photo and the right
// panel wipe up. On the right, the active use case loops on its own clock: one phone, the fan's
// view, then the action and its payoff. Four bars at the bottom show how far through the use cases you are.
// Positions are px in the 720 × 800 right panel, scaled by --p (styles.css .hero__right).
const STEP = 3.6; // seconds per step; one loop = 2 steps plus a beat to enjoy the payoff

const at = (x, y, w) => ({ left: `calc(${x} * var(--p))`, top: `calc(${y} * var(--p))`, width: w && `calc(${w} * var(--p))` });
const Sbar = ({ dark }) => html`<div class=${"hd__sbar" + (dark ? " is-dark" : "")}><b>9:41</b><i></i><b>5G</b></div>`;
// Micro-animations inside a step: data-at is seconds after the step starts (see caseTimeline).
const Typed = ({ text, ph, t = 0.5 }) => html`
  <span class="hd__typed"><i>${ph}</i><b class="hd-type" data-at=${t}>${text}</b></span>`;
const Check = () => html`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#fff" /><path d="M7 12.4l3.2 3.2L17 8.8" stroke="#000" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
const Spotify = () => html`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#1ed760" /><path d="M6.6 9.4c3.7-1.1 7.7-.7 10.9 1.1M7.1 12.5c3-.9 6.3-.6 9 .9M7.7 15.3c2.4-.7 4.9-.5 7 .7" stroke="#000" stroke-width="1.6" fill="none" stroke-linecap="round" /></svg>`;

// ---------- Fan-facing screens (inside the phone) ----------
function TourPage({ c, step }) {
  return html`
    <div class="hd__layer hd__odp">
      <${Sbar} dark />
      <img class="hd__odpAv" src=${c.avatar} alt="" />
      <div class="hd__odpName">${c.artist}</div>
      <div class="hd__odpSub">${c.title}</div>
      <div class="hd__stops">
        ${c.stops.map((s) => html`
          <div key=${s.city} class=${"hd__stop" + (s.near ? (step === 0 ? " hd-pick" : " is-on") : "")} data-at="1.3">
            <span class="hd__dt">${s.d}<small>${s.m}</small></span>
            <span class="hd__ct">${s.city}<small>${s.venue}</small></span>
            <span class="hd__ck"></span>
          </div>`)}
      </div>
      <div class="hd__odpField">
        ${step === 0 ? html`<span class="hd__ph">Phone number</span>` : html`<${Typed} text=${c.number} ph="Phone number" />`}
        <span class=${"hd__odpBtn" + (step === 1 ? " hd-press" : "")} data-at="1.7">RSVP</span>
      </div>
    </div>`;
}

function DropPage({ c, step, children }) {
  return html`
    <div class="hd__layer hd__dp">
      <${Sbar} dark />
      <div class="hd__dpArt"><img src=${c.art} alt="" />${c.key === "album" && html`<span class="hd__dpSp"><${Spotify} /></span>`}</div>
      <div class="hd__dpBody">
        <div class="hd__dpEye">${c.eyebrow}</div>
        <div class="hd__dpH">${c.title}</div>
        <div class="hd__dpP">${c.sub}</div>
        ${children}
      </div>
      <div class="hd__dpUrl"><div>🔒 ${c.key === "album" ? "diplo" : "harborline"}.laylo.com</div></div>
    </div>`;
}

function IgPost({ c }) {
  return html`
    <div class="hd__layer hd__ig">
      <${Sbar} dark />
      <div class="hd__igHead"><span class="hd__logoAv">SB</span>${c.handle}</div>
      <img class="hd__igImg" src=${c.art} alt="" />
      <div class="hd__igTxt">
        <span><b>${c.handle}</b> Drop 03 lands Friday. Comment MERCH for first access.</span>
        <span class="hd__muted">View all 2,184 comments</span>
        <span class="hd-pop" data-at="1.7"><b>you</b> MERCH</span>
      </div>
      <div class="hd__igComp"><span class="hd__igMe"></span><${Typed} text=${c.comment} ph="Add a comment…" t=${0.5} /><span class="hd__igPost hd-press" data-at="1.4">Post</span></div>
    </div>`;
}

function IgDm({ c }) {
  return html`
    <div class="hd__layer hd__ig">
      <${Sbar} dark />
      <div class="hd__igHead hd__igHead--dm"><span class="hd__back">‹</span><span class="hd__logoAv">SB</span><span>${c.handle}<small>Instagram</small></span></div>
      <div class="hd__thread">
        <div class="hd__igTime">Today 2:14 PM</div>
        <div class="hd__igCtx">${c.handle} replied to your comment</div>
        <div class="hd__igQuote">MERCH</div>
        <div class="hd__b hd__b--them hd-pop" data-at="0.3">saw your comment! here’s your first-access link to Drop 03</div>
        <div class="hd__igCard hd-pop" data-at="0.7"><img src=${c.art} alt="" /><div>${c.product[0]}<small>${c.handle}.laylo.co</small></div></div>
        <div class="hd__b hd__b--me hd-pop" data-at="2">in!</div>
      </div>
    </div>`;
}

// ---------- The use case on the right: one phone, two screens, one payoff ----------
// Step 1 is the fan's view (the tour's multi-city list, the drop page, the post); step 2 is the
// action, and its payoff ("You're on the list") floats out of the phone as the one pulled-out piece.
const Toast = ({ icon, lines, cls = "" }) => html`
  <div class=${"hd__toast hd-pop " + cls} data-at="1.9" style=${at(330, 540, 236)}>
    <span class="hd__toastIc">${icon}</span><span><b>${lines[0]}</b>${lines[1]}</span>
  </div>`;

function steps(c) {
  if (c.key === "tour") return [
    html`<${TourPage} c=${c} step=${0} />`,
    html`<${TourPage} c=${c} step=${1} />`,
    html`<${Toast} icon=${html`<${Check} />`} lines=${c.toast} />`,
  ];
  if (c.key === "event") return [
    html`<${DropPage} c=${c}><div class="hd__gn"><b>Get notified</b><div class="hd__gnField"><span class="hd__ph">+1 ••• ••• ••••</span><span class="hd__gnBtn">RSVP</span></div></div><//>`,
    html`<${DropPage} c=${c}><div class="hd__gn"><b>Get notified</b><div class="hd__gnField"><${Typed} text=${c.number} ph="+1 ••• ••• ••••" /><span class="hd__gnBtn hd-press" data-at="1.5">RSVP</span></div></div><//>`,
    html`<${Toast} icon=${html`<${Check} />`} lines=${c.toast} />`,
  ];
  if (c.key === "album") return [
    html`<${DropPage} c=${c}><span class="hd__dpBtn hd__dpBtn--sp"><${Spotify} /> Pre-save on Spotify</span><span class="hd__dpBtn">Pre-add on Apple Music</span><//>`,
    html`<${DropPage} c=${c}><span class="hd__dpBtn hd__dpBtn--sp hd-press" data-at="1.2"><${Spotify} /> Pre-save on Spotify</span><span class="hd__dpBtn">Pre-add on Apple Music</span><//>`,
    html`<${Toast} icon=${html`<${Spotify} />`} lines=${c.toast} />`,
  ];
  return [
    html`<${IgPost} c=${c} />`,
    html`<${IgDm} c=${c} />`,
    html`<${Toast} icon=${html`<img src=${c.art} alt="" />`} lines=${c.toast} cls="hd__toast--img" />`,
  ];
}

function Case({ c, i }) {
  const [a, b, payoff] = steps(c);
  return html`
    <div class=${"hd__case hd__case--" + c.key} data-case=${i}>
      <div class="hd__bg"></div>
      <div class="hd__fan">
        <div class="hd__phone" style=${at(245, 150, 230)}>
          <div class="hd__screen nhg">
            <div class="hd__screenStep hd-g0">${a}</div>
            <div class="hd__screenStep hd-g1">${b}</div>
          </div>
        </div>
        <div class="hd__floats hd-g1">${payoff}</div>
      </div>
    </div>`;
}

// One looping timeline per use case: the fan's view, then the action and its payoff.
function caseTimeline(el) {
  const q = gsap.utils.selector(el);
  const tl = gsap.timeline({ paused: true, repeat: -1 });
  const [g0, g1] = [q(".hd-g0"), q(".hd-g1")];
  const fan = q(".hd__fan")[0];
  const reset = () => {
    gsap.set(g0, { autoAlpha: 1 });
    gsap.set(g1, { autoAlpha: 0 });
    q(".is-picked, .is-pressed").forEach((n) => n.classList.remove("is-picked", "is-pressed"));
  };
  reset();
  tl.call(reset, null, 0)
    // immediateRender off: a use case that isn't playing yet still shows its first step.
    .fromTo(fan, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", immediateRender: false }, 0);

  // Micro-animations, timed from the start of the step their group belongs to.
  [g0, g1].forEach((g, k) => {
    g.forEach((root) => {
      root.querySelectorAll("[data-at]").forEach((n) => {
        const t = k * STEP + +n.dataset.at;
        if (n.classList.contains("hd-type")) tl.fromTo(n.previousElementSibling, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.01 }, t).fromTo(n, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.8, ease: "steps(14)" }, t);
        else if (n.classList.contains("hd-pop")) tl.fromTo(n, { autoAlpha: 0, y: 14, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.8)" }, t);
        else if (n.classList.contains("hd-press")) tl.call(() => n.classList.add("is-pressed"), null, t).fromTo(n, { scale: 1 }, { scale: 0.9, duration: 0.12, yoyo: true, repeat: 1 }, t);
        else if (n.classList.contains("hd-pick")) tl.call(() => n.classList.add("is-picked"), null, t);
      });
    });
  });

  tl.to(g0, { autoAlpha: 0, duration: 0.35 }, STEP - 0.35)
    .to(g1, { autoAlpha: 1, duration: 0.35 }, STEP)
    .to(fan, { autoAlpha: 0, y: -16, duration: 0.45, ease: "power2.in" }, 2 * STEP + 1.2 - 0.45);
  return tl;
}

export function Hero() {
  const root = useRef();
  const openModal = useModal();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray(".hero__word");
      const imgs = gsap.utils.toArray(".hero__img");
      const cases = gsap.utils.toArray(".hd__case");
      const fills = gsap.utils.toArray(".hd__progFill");
      const items = gsap.utils.toArray(".hd__progItem");
      const slot = root.current.querySelector(".hero__slot");
      const w = (i) => () => words[i].offsetWidth;
      const loops = cases.map(caseTimeline);
      let active = -1;
      const activate = (i) => {
        if (i === active) return;
        loops.forEach((l, k) => (k === i ? l.restart() : l.pause()));
        items.forEach((it, k) => it.classList.toggle("is-on", k === i));
        fills.forEach((f, k) => k !== i && gsap.set(f, { scaleX: k < i ? 1 : 0 }));
        active = i;
      };
      // The active use case's progress bar fills with its loop.
      const tick = () => { if (active >= 0) gsap.set(fills[active], { scaleX: loops[active].progress() }); };
      gsap.ticker.add(tick);

      gsap.set(words, { xPercent: -50 });
      gsap.set(words.slice(1), { yPercent: 115 });
      gsap.set([...imgs.slice(1), ...cases.slice(1)], { clipPath: "inset(100% 0% 0% 0%)" });

      gsap.fromTo(".hero__lineInner", { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.08, delay: 0.15 });
      gsap.fromTo(".hero__ctas .pill, .hd__progress", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.08, delay: 0.55 });
      gsap.from(".hero__img--0 img", { scale: 1.12, duration: 1.6, ease: "power3.out" });
      activate(0);

      const mm = gsap.matchMedia();
      mm.add({ motion: `not ${REDUCED}` }, () => {
        const steps = words.length - 1;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          // On the timeline, not the ScrollTrigger, so it also runs while the scrub catches up.
          // A use case is active once its panel is more than half wiped in.
          onUpdate: () => activate(Array.from({ length: steps }, (_, i) => i + 0.575).filter((t) => tl.time() >= t).length),
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => "+=" + window.innerHeight * steps * 0.9,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        tl.fromTo(slot, { width: w(0) }, { width: w(0), duration: 0.001 }, 0);
        for (let i = 1; i <= steps; i++) {
          const t = (i - 1) + 0.2;
          tl.to(words[i - 1], { yPercent: -115, duration: 0.45, ease: "power2.in" }, t)
            .to(words[i], { yPercent: 0, duration: 0.5, ease: "power3.out" }, t + 0.25)
            .to(slot, { width: w(i), duration: 0.6, ease: "power2.inOut" }, t + 0.1)
            .to([imgs[i], cases[i]], { clipPath: "inset(0% 0% 0% 0%)", duration: 0.75, ease: "power3.inOut" }, t);
        }
        tl.to({}, { duration: 0.25 });
        // Progress items jump to their use case.
        items.forEach((it, i) => {
          it.onclick = () => {
            const st = tl.scrollTrigger;
            const time = i === 0 ? 0 : (i - 1) + 0.95;
            scrollToY(st.start + (time / tl.duration()) * (st.end - st.start));
          };
        });
      });
      return () => gsap.ticker.remove(tick);
    }, root);
    return () => ctx.revert();
  }, []);

  return html`
    <section class="hero hero--demo" id="top" ref=${root}>
      <div class="hero__right hd">
        <div class="hero__stage hd__stage">${HERO_CASES.map((c, i) => html`<${Case} key=${c.key} c=${c} i=${i} />`)}</div>
      </div>
      <div class="hero__left">
        ${HERO_CASES.map((h, i) => html`<div key=${h.key} class=${`hero__img hero__img--${i}`}><img src=${h.img} alt="" /></div>`)}
      </div>
      <div class="hero__copy">
        <h1 class="hero__title fC">
          <span class="hero__line"><span class="hero__lineInner">RUN THE PERFECT</span></span>
          <span class="hero__line"><span class="hero__lineInner"><span class="hero__slot">${HERO_CASES.map((h) => html`<span key=${h.key} class="hero__word">${h.word}</span>`)}</span> DROP.</span></span>
          <span class="hero__line"><span class="hero__lineInner">AND SELL IT OUT.</span></span>
        </h1>
        <div class="hero__ctas">
          <button class="pill pill--grey" onClick=${() => openModal({ type: "demo" })}>See a demo</button>
          <button class="pill pill--grey" onClick=${() => openModal({ type: "signup" })}>Sign up</button>
        </div>
      </div>
      <nav class="hd__progress" aria-label="Use cases">
        ${HERO_CASES.map((c) => html`
          <button key=${c.key} class="hd__progItem" aria-label=${c.word.toLowerCase()}><span class="hd__progTrack"><i class="hd__progFill"></i></span></button>`)}
      </nav>
    </section>`;
}
