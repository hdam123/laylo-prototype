import { html, useRef, useLayoutEffect, gsap, rem, A, DESKTOP, MOBILE } from "./lib.js";
import { PLATFORM_STEPS, FAN_CARD, FAN_PROFILE, BARS } from "./content.js";
import { ChannelScreens } from "./channels.js";

// Positions are Figma px (== rem) inside the 1440-wide frame, taken from Landing Page
// Section 2A (top part) and storyboard frame 2C (bottom part, offset by +1279).
const Y = { phone: 662, sell: 1279 }; // camera stops (storyboard 2B, 2C)

const vline = (x, top, h, cls = "") => html`<div class=${"pf__vline pf-draw " + cls} style=${{ left: x + "rem", top: top + "rem", height: h + "rem" }}></div>`;
const icon = (src, x, y, round, cls) => html`<img class=${"pf__icon " + cls + (round ? " is-round" : "") + (round === "light" ? " is-light" : "")} src=${A(src)} alt="" style=${{ left: x + "rem", top: y + "rem" }} />`;
const elbow = (src, x, y, w, h, flip, cls) => html`<img class=${"pf-draw pf__elbow " + cls} src=${A(src)} alt="" style=${{ left: x + "rem", top: y + "rem", width: w + "rem", height: h + "rem", transform: flip ? "scaleX(-1)" : undefined }} />`;

// updated (Version A): a fourth "capture fans" icon, a richer Fan CRM card, every message channel
// beside the SMS phone, ticketing/commerce partners (DICE, Posh, Shotgun, Tixr, Eventbrite,
// Shopify) for "sell out the drop", and a single revenue counter instead of the bars. Icon rows
// re-centre and every icon gets its own elbow into the element below.
function Canvas({ updated }) {
  return html`
    <div class="pf__canvas">
      <!-- Capture fans -->
      ${updated ? html`
        ${icon("icon-instagram.png", 506.5, 321, false, "pf-i1")}
        ${icon("icon-linktree.png", 617.5, 321, false, "pf-i1")}
        ${icon("icon-spotify.png", 728.5, 321, false, "pf-i1")}
        ${icon("icon-capture-4.png", 839.5, 321, true, "pf-i1")}
        ${elbow("s2-vec-151.svg", 553.5, 416, 151, 91, false, "pf-c1")}
        ${elbow("s2-vec-40-long.svg", 664.5, 416, 40, 91, false, "pf-c1")}
        ${elbow("s2-vec-40-long.svg", 735.5, 416, 40, 91, true, "pf-c1")}
        ${elbow("s2-vec-151.svg", 735.5, 416, 151, 91, true, "pf-c1")}` : html`
        ${icon("icon-instagram.png", 562, 321, false, "pf-i1")}
        ${icon("icon-linktree.png", 673, 321, false, "pf-i1")}
        ${icon("icon-spotify.png", 784, 321, false, "pf-i1")}
        ${elbow("s2-vec1.svg", 608.5, 416, 96, 91, false, "pf-c1")}
        ${elbow("s2-vec2.svg", 735.5, 416, 96, 91, true, "pf-c1")}
        ${vline(720, 416, 91, "pf-c1")}`}
      <div class="pf__pill saans">Fan CRM</div>
      ${updated ? html`
        <div class="pf__card pf__card--rich fA">
          <div class="pf__cardHead">
            <img class="pf__avatar" src=${A("fan-avatar.jpg")} alt="" />
            <div>
              <div class="pf__cardName fB">Jordan r.</div>
              <div class="pf__cardSub">One of your notable fans</div>
            </div>
            <div class="pf__score"><b class="fB">${FAN_PROFILE.score}</b><span>Fan score</span></div>
          </div>
          <div class="pf__tags">${FAN_PROFILE.tags.map((t) => html`<span key=${t} class="pf__tag">${t}</span>`)}</div>
          <div class="pf__stats">
            ${FAN_PROFILE.stats.map(([v, k]) => html`<div key=${k} class="pf__stat"><b class="fB">${v}</b><span>${k}</span></div>`)}
          </div>
          <div class="pf__fields">
            ${FAN_PROFILE.fields.map(([k, v]) => html`<div key=${k} class="pf__row"><span>${k}</span><span>${v}</span></div>`)}
          </div>
        </div>` : html`
        <div class="pf__card">
          <div class="pf__cardName fB">Jordan r.</div>
          <div class="pf__cardSub fA">One of your notable fans</div>
          <div class="pf__rows fA">
            ${FAN_CARD.map(([k, v]) => html`<div key=${k} class="pf__row"><span>${k}</span><span>${v}</span></div>`)}
          </div>
        </div>`}

      <!-- Message everyone -->
      ${vline(720, 860, 91, "pf-c2")}
      <div class=${"pf__phone" + (updated ? " pf__phone--sm" : "")}>
        <div class="pf__screen"><img src=${A("phone-screen.webp")} alt="Text message thread with a presale code" /></div>
      </div>
      ${updated ? html`<${ChannelScreens} />${vline(720, 1440, 163, "pf-c3")}` : vline(720, 1400, 203, "pf-c3")}

      <!-- Sell out the drop -->
      ${updated ? html`
        ${icon("icon-dice.png", 395.5, 1632, "light", "pf-i2")}
        ${icon("icon-posh.png", 506.5, 1632, "light", "pf-i2")}
        ${icon("icon-shotgun.png", 617.5, 1632, true, "pf-i2")}
        ${icon("icon-tixr.png", 728.5, 1632, true, "pf-i2")}
        ${icon("icon-eventbrite.svg", 839.5, 1632, true, "pf-i2")}
        ${icon("icon-shopify.svg", 950.5, 1632, "light", "pf-i2")}
        ${elbow("s2c-vec-237.svg", 442.5, 1707, 237, 131, false, "pf-c4")}
        ${elbow("s2c-vec-142.svg", 553.5, 1717, 142, 126, false, "pf-c4")}
        ${elbow("s2c-vec-47.svg", 664.5, 1727, 47, 121, false, "pf-c4")}
        ${elbow("s2c-vec-47.svg", 729.5, 1727, 47, 121, true, "pf-c4")}
        ${elbow("s2c-vec-142.svg", 745.5, 1717, 142, 126, true, "pf-c4")}
        ${elbow("s2c-vec-237.svg", 761.5, 1707, 237, 131, true, "pf-c4")}` : html`
        ${icon("icon-tixr.png", 451, 1632, true, "pf-i2")}
        ${icon("icon-fourthwall.png", 562, 1632, true, "pf-i2")}
        ${icon("icon-instagram.png", 673, 1632, false, "pf-i2")}
        ${icon("icon-linktree.png", 784, 1632, false, "pf-i2")}
        ${icon("icon-spotify.png", 895, 1632, false, "pf-i2")}
        ${elbow("s2c-vec4.svg", 496.5, 1707, 191, 131, false, "pf-c4")}
        ${elbow("s2c-vec1.svg", 608.5, 1727, 96, 121, false, "pf-c4")}
        ${vline(719.5, 1727, 121, "pf-c4")}
        ${elbow("s2c-vec2.svg", 735.5, 1727, 96, 121, true, "pf-c4")}
        ${elbow("s2c-vec3.svg", 751.5, 1707, 191, 131, true, "pf-c4")}`}
      ${updated ? html`
        <div class="pf__panel pf__panel--rev">
          <span class="pf__revLabel fB">Revenue from this drop</span>
          <span class="pf__revValue fB"><span class="pf__barValue" data-value=${BARS.reduce((n, b) => n + b.value, 0)} data-prefix="$">$${BARS.reduce((n, b) => n + b.value, 0).toLocaleString("en-US")}</span></span>
          <span class="pf__revSplit fA">${[...BARS].reverse().map((b) => `${{ TOUR: "Tickets", MERCH: "Merch", MUSIC: "Streams" }[b.label]} $${b.value.toLocaleString("en-US")}`).join("  ·  ")}</span>
        </div>` : html`
        <div class="pf__panel fA">
          ${BARS.map((b) => html`
            <div key=${b.label} class="pf__bar">
              <span class="pf__barLabel">${b.label}</span>
              <span class="pf__barTrack"><span class="pf__barFill" style=${{ width: b.width + "rem" }}></span></span>
              <span class="pf__barValue" data-value=${b.value}>${b.value.toLocaleString("en-US")}</span>
            </div>`)}
        </div>`}
    </div>
  `;
}

// Storyboards 2A → 2B → 2C. Headline and subline stay pinned; the step label slides left
// to the next one while the diagram below builds itself and the camera pans down it.
export function Platform({ updated = false } = {}) {
  const root = useRef();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: DESKTOP, mobile: MOBILE }, (c) => {
        const q = gsap.utils.selector(root);
        const canvas = q(".pf__canvas")[0];
        const track = q(".pf__track")[0];
        const labels = q(".pf__label");
        const conns = q(".pf__conn");
        // Center a label on the frame's centre line (x = 720 on desktop).
        const stage = q(".pf__stage")[0];
        const centerOn = (i) => () => stage.offsetWidth / 2 - (labels[i].offsetLeft + labels[i].offsetWidth / 2);
        const cam = (y) => () => -y * rem();
        const draw = { clipPath: "inset(0% 0% 100% 0%)" };
        const drawn = { clipPath: "inset(0% 0% 0% 0%)", ease: "power1.inOut" };
        const pop = { scale: 0.6, opacity: 0, y: 24 };
        const popped = { scale: 1, opacity: 1, y: 0, ease: "back.out(1.6)", stagger: 0.12, duration: 0.5 };

        gsap.set(labels.slice(1), { opacity: 0, x: 30 });
        gsap.set(conns, { scaleX: 0, transformOrigin: "left center" });

        // The icons pop in while the section scrolls into view, so it never arrives blank.
        gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 75%", end: "top 15%", scrub: 0.7 } })
          .fromTo(".pf-i1", pop, { ...popped, stagger: 0.18 }, 0);

        const tl = gsap.timeline({
          defaults: { ease: "none", duration: 0.6 },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => "+=" + window.innerHeight * (c.conditions.mobile ? 3.2 : 4),
            pin: q(".pf__pin")[0],
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(track, { x: centerOn(0) }, { x: centerOn(0), duration: 0.001 }, 0)
          .fromTo(canvas, { y: cam(0) }, { y: cam(0), duration: 0.001 }, 0)

          // 2A — Capture fans, step by step once pinned: connectors → Fan CRM → Jordan R. card
          .fromTo(".pf-c1", draw, { ...drawn, duration: 0.6 }, 0.05)
          .fromTo(".pf__pill", { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, ease: "back.out(2)", duration: 0.4 }, 0.55)
          .fromTo(".pf__card", { y: 60, opacity: 0 }, { y: 0, opacity: 1, ease: "power3.out", duration: 0.6 }, 0.75)
          .fromTo(".pf__cardName, .pf__cardSub, .pf__avatar, .pf__score, .pf__tag, .pf__stat", { y: 14, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.4, ease: "power2.out" }, 0.95)
          .fromTo(".pf__row", { "--rule": 0, opacity: 0 }, { "--rule": 1, opacity: 1, stagger: 0.09, duration: 0.4, ease: "power2.out" }, 1.05)
          .to({}, { duration: 0.35 })

          // 2A → 2B — Message everyone in one send
          .addLabel("toPhone")
          .fromTo(".pf-c2", draw, { ...drawn, duration: 0.45 }, "toPhone")
          .to(canvas, { y: cam(Y.phone), duration: 1.3, ease: "power2.inOut" }, "toPhone")
          .fromTo(".pf__phone", { y: 120, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "toPhone+=0.3")
          // Version A: the other channels fan out from the centre phone.
          .fromTo(".pf__side", { y: 120, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: { each: 0.1, from: "center" } }, "toPhone+=0.55")
          .fromTo(".pf__chLabel--sms", { opacity: 0 }, { opacity: 1, duration: 0.5 }, "toPhone+=0.9")
          .to(track, { x: centerOn(1), duration: 1, ease: "power3.inOut" }, "toPhone+=0.2")
          .to(labels[0], { opacity: 0.2, duration: 0.6 }, "toPhone+=0.2")
          .to(conns[0], { scaleX: 1, duration: 0.5, ease: "power2.out" }, "toPhone+=0.45")
          .to(labels[1], { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, "toPhone+=0.55")
          .to({}, { duration: 0.5 })

          // 2B → 2C — Sell out the drop
          .addLabel("toSell")
          .fromTo(".pf-c3", draw, { ...drawn, duration: 0.5 }, "toSell")
          .to(canvas, { y: cam(Y.sell), duration: 1.4, ease: "power2.inOut" }, "toSell+=0.1")
          .to(track, { x: centerOn(2), duration: 1, ease: "power3.inOut" }, "toSell+=0.3")
          .to(labels[1], { opacity: 0.2, duration: 0.6 }, "toSell+=0.3")
          .to(conns[1], { scaleX: 1, duration: 0.5, ease: "power2.out" }, "toSell+=0.55")
          .to(labels[2], { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, "toSell+=0.65")
          .fromTo(".pf-i2", pop, { ...popped, stagger: 0.1 }, "toSell+=0.55")
          .fromTo(".pf-c4", draw, { ...drawn, duration: 0.6, stagger: 0.05 }, "toSell+=1.15")
          .fromTo(".pf__panel", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "toSell+=1.4")
          .addLabel("bars", "toSell+=1.8")
          .fromTo(".pf__barFill", { scaleX: 0 }, { scaleX: 1, duration: 0.9, stagger: 0.12, ease: "power2.out" }, "bars");
        if (!q(".pf__barFill").length) tl.to({}, { duration: 0.001 }, "bars");

        q(".pf__barValue").forEach((el, i) => {
          const target = +el.dataset.value;
          const o = { v: 0 };
          tl.to(o, {
            v: target, duration: el.dataset.prefix ? 1.4 : 0.9, ease: "power2.out",
            onUpdate: () => { el.textContent = (el.dataset.prefix || "") + Math.round(o.v).toLocaleString("en-US"); },
          }, `bars+=${i * 0.12}`);
        });
        tl.to({}, { duration: 0.5 });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return html`
    <section class="pf" data-nav="light" id="platform" ref=${root}>
      <div class="pf__pin">
        <div class="pf__window"><${Canvas} updated=${updated} /></div>
        <div class="stage pf__stage">
          <div class="pf__head">
            <h2 class="h-xl fC">The drop marketing platform<br />that started it all.</h2>
            <p class="pf__sub fB">Reach every fan the second you go live — all from one place.</p>
          </div>
          <div class="pf__labels">
            <div class="pf__track fB">
              ${PLATFORM_STEPS.map((s, i) => html`
                ${i > 0 && html`<span class="pf__conn" key=${"c" + i}></span>`}
                <span class="pf__label" key=${s}>${s}</span>`)}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
