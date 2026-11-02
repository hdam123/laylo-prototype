import { html, useState, useEffect, useRef, gsap, getLenis, useModal } from "./lib.js";

const COPY = {
  demo: {
    title: "See Laylo in action",
    sub: "Tell us about your next drop and we'll walk you through it live.",
    cta: "Book my demo",
    done: "You're booked in. Check your inbox for a calendar invite.",
  },
  signup: {
    title: "Start your first drop",
    sub: "Free to start. Capture fans in minutes, message them the second you go live.",
    cta: "Create account",
    done: "Welcome to Laylo. We've sent a link to finish setting up.",
  },
  login: {
    title: "Welcome back",
    sub: "Log in to manage your drops, fans and messages.",
    cta: "Log in",
    done: "Signed in. Taking you to your dashboard…",
  },
};

// Info panel (no form): a tool's details.
function ToolInfo({ modal }) {
  const openModal = useModal();
  const t = modal.tool;
  return html`
    <div class="modal__info">
      <div class="modal__eyebrow fB">${modal.group}</div>
      <span class="modal__icon" aria-hidden="true" style=${{ "--icon": `url("${t.icon}")` }}></span>
      <h3 class="modal__title fC">${t.name}</h3>
      <p class="modal__sub fA">${t.body}</p>
      <div class="modal__actions">
        <button class="pill pill--purple" onClick=${() => openModal({ type: "signup", context: t.name })}>Start with ${t.name}</button>
        <button class="pill" onClick=${() => openModal({ type: "demo", context: t.name })}>See a demo</button>
      </div>
    </div>`;
}

function Fields({ type, context }) {
  if (type === "login") {
    return html`
      <label class="field"><span>Email</span><input type="email" name="email" required placeholder="you@label.com" autocomplete="email" /></label>
      <label class="field"><span>Password</span><input type="password" name="password" required placeholder="••••••••" autocomplete="current-password" /></label>`;
  }
  return html`
    <label class="field"><span>Name</span><input name="name" required placeholder="Your name" autocomplete="name" /></label>
    <label class="field"><span>Work email</span><input type="email" name="email" required placeholder="you@label.com" autocomplete="email" /></label>
    <label class="field"><span>I'm a…</span>
      <select name="role" defaultValue="Artist">
        <option>Artist</option><option>Manager</option><option>Venue</option><option>Promoter</option><option>Festival</option><option>Brand</option>
      </select>
    </label>
    ${type === "demo" && html`
      <label class="field"><span>Interested in</span><input name="interest" defaultValue=${context || ""} placeholder="Drops, tour suite, agents…" /></label>`}`;
}

export function Modal({ modal, onClose }) {
  const [status, setStatus] = useState("idle");
  const panel = useRef();
  const backdrop = useRef();
  const open = !!modal;

  useEffect(() => {
    if (!open) return;
    setStatus("idle");
    getLenis()?.stop();
    gsap.fromTo(backdrop.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    gsap.fromTo(panel.current, { y: 30, opacity: 0, scale: 0.98 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" });
    const t = setTimeout(() => panel.current?.querySelector("input")?.focus(), 80);
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => { clearTimeout(t); window.removeEventListener("keydown", onKey); getLenis()?.start(); };
  }, [modal]);

  const close = () => {
    gsap.to(panel.current, { y: 20, opacity: 0, duration: 0.25, ease: "power2.in" });
    gsap.to(backdrop.current, { opacity: 0, duration: 0.3, onComplete: onClose });
  };

  const submit = (e) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => setStatus("done"), 900);
  };

  if (!open) return null;
  const info = modal.type === "tool";
  const c = info ? { title: modal.tool.name }
    : modal.type === "signup" && modal.context
      ? { ...COPY.signup, title: `Start with ${modal.context}`, sub: `Create your free account and set up ${modal.context} in minutes.` }
      : COPY[modal.type];
  return html`
    <div class="modal" ref=${backdrop} onMouseDown=${(e) => e.target === backdrop.current && close()} role="dialog" aria-modal="true" aria-label=${c.title}>
      <div class="modal__panel" ref=${panel}>
        <button class="modal__close" onClick=${close} aria-label="Close">×</button>
        ${info
          ? html`<${ToolInfo} modal=${modal} />`
          : status === "done"
          ? html`<div class="modal__done">
              <div class="modal__check">✓</div>
              <h3 class="modal__title fC">${c.title}</h3>
              <p class="modal__sub fA">${c.done}</p>
              <button class="pill pill--purple" onClick=${close}>Back to Laylo</button>
            </div>`
          : html`<form onSubmit=${submit}>
              <h3 class="modal__title fC">${c.title}</h3>
              <p class="modal__sub fA">${c.sub}</p>
              <div class="modal__fields fA"><${Fields} type=${modal.type} context=${modal.context} /></div>
              <button class="pill pill--purple modal__submit" disabled=${status === "sending"}>
                ${status === "sending" ? "Sending…" : c.cta}
              </button>
              <p class="modal__fine fA">Prototype only: nothing is sent or stored.</p>
            </form>`}
      </div>
    </div>
  `;
}
