// Shared runtime: React via htm (no build step), GSAP + ScrollTrigger, Lenis.
export const React = window.React;
export const { useState, useEffect, useLayoutEffect, useRef, useCallback, createContext, useContext } = React;
export const html = window.htm.bind(React.createElement);
export const gsap = window.gsap;
export const ScrollTrigger = window.ScrollTrigger;

gsap.registerPlugin(ScrollTrigger);

export const A = (name) => `./assets/${name}`;

// Breakpoint shared by CSS (styles.css) and GSAP matchMedia.
export const DESKTOP = "(min-width: 768px)";
export const MOBILE = "(max-width: 767px)";
export const REDUCED = "(prefers-reduced-motion: reduce)";

// 1 rem == 1 Figma px on desktop (see html font-size in styles.css).
export const rem = () => parseFloat(getComputedStyle(document.documentElement).fontSize);

// Lenis instance is created in main.js; sections read it through this getter.
let lenis = null;
export const setLenis = (l) => { lenis = l; };
export const getLenis = () => lenis;

export function scrollToY(y, opts = {}) {
  if (lenis) lenis.scrollTo(y, { duration: 1.4, ...opts });
  else window.scrollTo({ top: y, behavior: "smooth" });
}

export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  // A pinned section's spacer starts where the section starts.
  const top = el.getBoundingClientRect().top + window.scrollY;
  scrollToY(top);
}

// Modal context: any button can open the demo / sign-up / log-in dialogs.
export const ModalContext = createContext(() => {});
export const useModal = () => useContext(ModalContext);
