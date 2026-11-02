import { html, useRef, useLayoutEffect, gsap } from "./lib.js";
import { NavRow } from "./nav.js";

// Paths from the Figma wordmark (assets/wordmark.svg). The A's drop counter is split out
// as its own shape, filled with the footer colour, so it can wiggle on hover.
const L1 = "M0 346.474V5.13672H56.1081V296.449H227.245V346.486H0V346.474Z";
const A_OUTER = "M429.245 5.13672H366.585L233.787 346.474H291.77L325.104 257.629H468.557L502.184 346.474H562.031L429.245 5.13672Z";
const DROP = "M436.653 171.117C436.289 180.611 432.515 189.39 426.033 196.27C411.16 212.07 386.745 212.726 371.144 197.571L368.894 195.203C362.975 188.546 359.623 180.177 359.177 171.293L359.154 166.686C359.564 159.783 360.924 153.383 362.963 146.773C365.108 139.822 367.745 133.118 370.746 126.484C373.5 120.4 376.454 114.411 379.595 108.504C385.198 97.9548 391.199 87.6755 397.634 77.6307L404.467 67.3397L404.42 70.7154C404.162 88.8359 408.593 103.968 416.469 120.131C419.001 125.335 421.755 130.34 424.592 135.368C426.959 139.564 429.186 143.737 431.179 148.12C434.32 155.059 436.957 163.498 436.664 171.117H436.653Z";
const Y = "M661.636 346.474H605.997V207.604L477.875 5.13672H538.66L634.514 158.036L730.836 5.13672H790.214L661.624 207.604V346.474H661.636Z";
const L2 = "M801.442 346.474V5.13672H857.55V296.449H1028.69V346.486H801.442V346.474Z";
const O = "M1000.17 175.814C1000.17 150.321 1004.07 126.926 1011.86 105.629C1019.64 84.3321 1030.64 65.7544 1044.82 49.896C1059 34.0376 1075.91 21.7658 1095.55 13.0571C1115.19 4.36019 1136.7 0 1160.07 0C1183.44 0 1204.96 4.36019 1224.59 13.0571C1244.24 21.7658 1261.14 34.0493 1275.32 49.896C1289.5 65.7544 1300.49 84.3321 1308.28 105.629C1316.06 126.926 1319.97 150.321 1319.97 175.814C1319.97 201.307 1316.06 224.702 1308.28 245.999C1300.49 267.296 1289.49 285.874 1275.32 301.732C1261.13 317.59 1244.23 329.862 1224.59 338.571C1204.95 347.268 1183.44 351.628 1160.07 351.628C1136.7 351.628 1115.18 347.268 1095.55 338.571C1075.9 329.874 1058.99 317.59 1044.82 301.732C1030.62 285.874 1019.64 267.296 1011.86 245.999C1004.07 224.702 1000.17 201.307 1000.17 175.814ZM1262.02 175.814C1262.02 151.599 1257.81 130.091 1249.4 111.302C1240.98 92.5133 1229.13 77.8387 1213.86 67.2782C1198.59 56.7176 1180.66 51.4432 1160.08 51.4432C1139.5 51.4432 1121.58 56.7293 1106.31 67.2782C1091.03 77.8387 1079.18 92.5133 1070.77 111.302C1062.35 130.091 1058.15 151.599 1058.15 175.814C1058.15 200.029 1062.35 221.467 1070.77 240.103C1079.18 258.74 1091.03 273.414 1106.31 284.127C1121.58 294.84 1139.5 300.197 1160.08 300.197C1180.66 300.197 1198.57 294.84 1213.86 284.127C1229.13 273.414 1240.98 258.74 1249.4 240.103C1257.81 221.467 1262.02 200.041 1262.02 175.814Z";

// Storyboard 8: big wordmark footer; the drop in the A wiggles on hover.
// wiggle: false keeps the drop still on hover (case studies page).
export function Footer({ wiggle = true } = {}) {
  const root = useRef();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const drop = root.current.querySelector(".ft__drop");
      gsap.set(drop, { svgOrigin: "404.44 67.34" });

      gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 95%", end: "bottom bottom", scrub: 0.6 } })
        .from(".ft__letter", { y: 380, stagger: 0.08, ease: "power3.out" }, 0)
        .from(".ft .navrow", { opacity: 0, y: -20 }, 0.2);

      if (!wiggle) return;
      let tl;
      const play = () => {
        if (tl?.isActive()) return;
        tl = gsap.timeline()
          .to(drop, { rotation: 5, duration: 0.22, ease: "sine.out" })
          .to(drop, { rotation: -3.5, duration: 0.3, ease: "sine.inOut" })
          .to(drop, { rotation: 1.5, duration: 0.28, ease: "sine.inOut" })
          .to(drop, { rotation: 0, duration: 0.4, ease: "sine.out" });
      };
      const svg = root.current.querySelector(".ft__mark");
      svg.addEventListener("mouseenter", play);
      root.current.querySelector(".ft__a").addEventListener("mouseenter", play);
    }, root);
    return () => ctx.revert();
  }, []);

  return html`
    <footer class="ft" ref=${root}>
      <div class="ft__nav"><${NavRow} showLogo=${false} /></div>
      <svg class="ft__mark" viewBox="0 0 1320 351.628" role="img" aria-label="Laylo">
        <path class="ft__letter" d=${L1} fill="white" />
        <g class="ft__letter ft__a">
          <path d=${A_OUTER} fill="white" />
          <path class="ft__drop" d=${DROP} fill="#675DFF" />
        </g>
        <path class="ft__letter" d=${Y} fill="white" />
        <path class="ft__letter" d=${L2} fill="white" />
        <path class="ft__letter" d=${O} fill="white" fill-rule="evenodd" />
      </svg>
    </footer>
  `;
}
