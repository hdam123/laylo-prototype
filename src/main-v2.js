// Version B entry point: identical to main.js except the hero (Figma "Landing Scroll 2").
// Every section below the hero is the same module the original version uses.
import { html, gsap, ScrollTrigger, setLenis, useState, ModalContext } from "./lib.js";
import { Nav } from "./nav.js";
import { Modal } from "./modal.js";
import { HeroV2 } from "./hero-v2.js";
import { Strip } from "./strip.js";
import { Platform } from "./platform.js";
import { Agents } from "./agents.js";
import { Tools } from "./tools.js";
import { Testimonials } from "./testimonials.js";
import { Footer } from "./footer.js";

function App() {
  const [modal, setModal] = useState(null);
  return html`
    <${ModalContext.Provider} value=${setModal}>
      <${Nav} />
      <main>
        <${HeroV2} />
        <${Strip} />
        <${Platform} />
        <${Agents} />
        <${Tools} />
        <${Testimonials} />
      </main>
      <${Footer} />
      <${Modal} modal=${modal} onClose=${() => setModal(null)} />
    <//>
  `;
}

function startLenis() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const lenis = new window.Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  setLenis(lenis);
}

async function boot() {
  await Promise.all([
    document.fonts.load('500 64px "Die"'),
    document.fonts.load('500 48px "Die"'),
    document.fonts.load('400 14px "Die"'),
    document.fonts.load('600 10px "Saans"'),
    document.fonts.load('400 13px "Saans"'),
  ]).catch(() => {});
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  startLenis();
  window.ReactDOM.createRoot(document.getElementById("root")).render(html`<${App} />`);
  window.addEventListener("load", () => ScrollTrigger.refresh());
}

boot();
