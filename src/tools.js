import { html, useState, useRef, useLayoutEffect, gsap, useModal } from "./lib.js";
import { TOOL_GROUPS } from "./content.js";

// Storyboard 6, reworked from client feedback: the three pillars (Capture / Convert / AI Agents)
// sit side by side as vertical lists, so all of them are visible at once without scrolling the section.
// All tools start closed; hovering (or focusing) a tool opens it to show its copy and CTA, leaving closes it.
// Each button does what its label says: "start" buttons open sign-up set to that tool,
// "learn" buttons open the tool's details. The earlier scrolling-grid version is in tools-scroll.js.
function Pillar({ g, gi }) {
  const openModal = useModal();
  const [open, setOpen] = useState(-1);
  const act = (t) => {
    if (t.action === "start") openModal({ type: "signup", context: t.name });
    else openModal({ type: "tool", tool: t, group: g.label });
  };
  return html`
    <div class="pillar">
      <div class="pillar__head">
        <h3 class="pillar__name fC">${g.label}</h3>
        <p class="pillar__intro fA">${g.intro}</p>
      </div>
      <ul class="pillar__list">
        ${g.tools.map((t, i) => html`
          <li key=${t.name} class=${"ptool" + (i === open ? " is-open" : "")} onMouseEnter=${() => setOpen(i)} onMouseLeave=${() => setOpen(-1)}
            onFocus=${() => setOpen(i)} onBlur=${(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(-1)}>
            <button class="ptool__row" aria-expanded=${i === open} onClick=${() => (i === open ? act(t) : setOpen(i))}>
              <span class="tool__icon ptool__icon" aria-hidden="true" style=${{ "--icon": `url("${t.icon}")` }}></span>
              <span class="ptool__name fB">${t.name}</span>
            </button>
            <div class="ptool__more">
              <div class="ptool__inner">
                <p class="ptool__body fA">${t.body}</p>
                <button class="pill pill--grey fA" onClick=${() => act(t)}>${t.cta}</button>
              </div>
            </div>
          </li>`)}
      </ul>
    </div>`;
}

export function Tools() {
  const root = useRef();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 15%", scrub: 0.6 } })
        .from(".tools__titleInner", { yPercent: 105, ease: "power3.out" }, 0)
        .from(".pillar__head", { y: 60, opacity: 0, stagger: 0.08, ease: "power2.out" }, 0.1)
        .from(".pillar__list > li", { y: 30, opacity: 0, stagger: 0.015, ease: "power2.out" }, 0.25);
    }, root);
    return () => ctx.revert();
  }, []);

  return html`
    <section class="tools tools--pillars" data-nav="light" id="tools" ref=${root}>
      <div class="stage tools__frame">
        <h2 class="h-xl fC tools__heading"><span class="mask"><span class="tools__titleInner">Every tool your drop needs.</span></span></h2>
        <div class="pillars">
          ${TOOL_GROUPS.map((g, gi) => html`<${Pillar} key=${g.label} g=${g} gi=${gi} />`)}
        </div>
      </div>
    </section>
  `;
}
