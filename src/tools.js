import { html, useRef, useLayoutEffect, gsap, rem, useModal, DESKTOP } from "./lib.js";
import { TOOL_GROUPS } from "./content.js";

// Storyboard 6: headline holds while the tool list scrolls up through a faded window.
// Tools are packaged as Capture / Convert / AI Agents.
// Each button does what its label says: "start" buttons open sign-up set to that tool,
// "learn" buttons open the tool's details.
export function Tools() {
  const root = useRef();
  const openModal = useModal();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 80%", end: "top 20%", scrub: 0.6 } })
        .from(".tools__titleInner", { yPercent: 105, ease: "power3.out" }, 0)
        .from(".tools__group:first-child .tools__groupHead, .tool--first", { y: 80, opacity: 0, stagger: 0.06, ease: "power2.out" }, 0.1);

      const mm = gsap.matchMedia();
      mm.add(DESKTOP, () => {
        const list = root.current.querySelector(".tools__list");
        const win = root.current.querySelector(".tools__window");
        // How far the list must travel for its last row to clear the bottom fade.
        const dist = () => Math.max(0, list.offsetTop + list.offsetHeight - win.clientHeight + 120 * rem());
        gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => "+=" + (dist() + window.innerHeight * 0.25),
            pin: ".tools__pin",
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        })
          .fromTo(list, { y: 0 }, { y: () => -dist(), ease: "none", duration: 1 }, 0)
          .to({}, { duration: 0.15 });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const act = (t, group) => {
    if (t.action === "start") openModal({ type: "signup", context: t.name });
    else openModal({ type: "tool", tool: t, group: group.label });
  };

  return html`
    <section class="tools" data-nav="light" id="tools" ref=${root}>
      <div class="tools__pin">
        <div class="tools__window">
          <div class="tools__list">
            ${TOOL_GROUPS.map((g, gi) => html`
              <div key=${g.label} class="tools__group">
                <div class="tools__groupHead fB">
                  <span>${g.label}</span>
                </div>
                <div class="tools__grid">
                  ${g.tools.map((t, i) => html`
                    <article key=${t.name} class=${"tool" + (gi === 0 && i < 6 ? " tool--first" : "")}>
                      <span class="tool__icon" aria-hidden="true" style=${{ "--icon": `url("${t.icon}")` }}></span>
                      <h3 class="tool__name fB">${t.name}</h3>
                      <p class="tool__body fA">${t.body}</p>
                      <button class="pill pill--grey fA" onClick=${() => act(t, g)}>${t.cta}</button>
                    </article>`)}
                </div>
              </div>`)}
          </div>
        </div>
        <div class="stage tools__stage">
          <h2 class="h-xl fC tools__title"><span class="mask"><span class="tools__titleInner">Every tool your drop needs.</span></span></h2>
        </div>
      </div>
    </section>
  `;
}
