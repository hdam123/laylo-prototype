import { html, A } from "./lib.js";

// Version A, "Message everyone in one send": the same Olivia Dean presale drop as it lands on
// every channel. Drawn in HTML so text stays crisp; sized to match the centre SMS phone
// (203.76 × 439.59 screen, styles.css .pf__screen). All content is PLACEHOLDER.
const IMG = A("phone-a/card-2.jpg");
const AVATAR = A("hero-portrait.jpg");

const Status = ({ dark }) => html`
  <div class=${"ch__status" + (dark ? " is-dark" : "")}>
    <span>9:41</span>
    <span class="ch__statusIcons"><i></i><i></i><b></b></span>
  </div>`;

const Tick = () => html`<svg class="ch__tick" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0l2 2.2 2.9-.4.5 2.9 2.6 1.4-1.3 2.6 1.3 2.6-2.6 1.4-.5 2.9-2.9-.4L8 16l-2-2.2-2.9.4-.5-2.9L0 9.9l1.3-2.6L0 4.7l2.6-1.4.5-2.9 2.9.4z" fill="#3797f0"/><path d="M4.8 8.2l2.1 2.1 4.3-4.4" stroke="#fff" stroke-width="1.6" fill="none"/></svg>`;

function Email() {
  return html`
    <div class="ch ch--email">
      <${Status} />
      <div class="ch__mailBar"><span>‹ Inbox</span><span class="ch__mailIcons">⌃ ⌄</span></div>
      <div class="ch__mailHead">
        <img class="ch__av" src=${AVATAR} alt="" />
        <div><b>Olivia Dean</b><small>to me · 9:07 AM</small></div>
      </div>
      <div class="ch__mailSubject">Presale is live: The Art of Loving Tour</div>
      <div class="ch__mailBody">
        <img src=${IMG} alt="" />
        <p class="ch__mailH">You're on the list.</p>
        <p>Your presale code unlocks tickets before general sale on 26 June, 10AM.</p>
        <div class="ch__code">LOVING26</div>
        <span class="ch__btn">Get my tickets</span>
        <small class="ch__foot">Sent with Laylo · Unsubscribe</small>
      </div>
    </div>`;
}

function InstagramDM() {
  return html`
    <div class="ch ch--ig">
      <${Status} />
      <div class="ch__igHead">
        <span class="ch__back">‹</span>
        <img class="ch__av" src=${AVATAR} alt="" />
        <div><b>oliviadean <${Tick} /></b><small>Active now</small></div>
      </div>
      <div class="ch__thread">
        <div class="ch__story"><img src=${IMG} alt="" /><small>Replied to their story</small></div>
        <div class="ch__msg is-me ch__igMe">TOUR</div>
        <div class="ch__msg">Thanks for replying! Here's your early access link to the presale.</div>
        <div class="ch__link">
          <img src=${IMG} alt="" />
          <div><b>The Art of Loving Tour</b><small>oliviadean.laylo.co</small></div>
        </div>
        <div class="ch__msg">Code: LOVING26</div>
      </div>
      <div class="ch__input">Message...</div>
    </div>`;
}

function RCS() {
  return html`
    <div class="ch ch--rcs">
      <${Status} />
      <div class="ch__rcsHead">
        <span class="ch__back">←</span>
        <img class="ch__av" src=${AVATAR} alt="" />
        <div><b>Olivia Dean <${Tick} /></b><small>Verified business</small></div>
      </div>
      <div class="ch__thread">
        <small class="ch__day">Today · 9:07 AM</small>
        <div class="ch__rich">
          <img src=${IMG} alt="" />
          <div class="ch__richBody">
            <b>Presale is live</b>
            <p>Your code unlocks The Art of Loving Tour before general sale.</p>
          </div>
          <span class="ch__action">Get presale code</span>
          <span class="ch__action">Add to calendar</span>
        </div>
        <div class="ch__chips"><span>Show dates</span><span>Merch</span></div>
      </div>
      <div class="ch__input">RCS message</div>
    </div>`;
}

function WhatsApp() {
  return html`
    <div class="ch ch--wa">
      <${Status} />
      <div class="ch__waHead">
        <span class="ch__back">‹</span>
        <img class="ch__av" src=${AVATAR} alt="" />
        <div><b>Olivia Dean <span class="ch__waTick">✓</span></b><small>Official business account</small></div>
      </div>
      <div class="ch__thread ch__waBg">
        <small class="ch__day ch__waDay">TODAY</small>
        <div class="ch__waMsg">
          <img src=${IMG} alt="" />
          <p>You're in. Presale for The Art of Loving Tour opens 26 June, 10AM.</p>
          <p>Your code: <b>LOVING26</b></p>
          <small>9:07 AM</small>
          <span class="ch__waBtn">Get tickets</span>
        </div>
        <div class="ch__waMsg is-me"><p>Let's go!!</p><small>9:08 AM ✓✓</small></div>
      </div>
      <div class="ch__input">Message</div>
    </div>`;
}

// x = screen's left edge in canvas px; the centre SMS screen sits at 618.12. Centres are 207 apart
// (about 24 px between phones once scaled to .9).
const SIDES = [
  { x: 204.12, label: "Email", el: Email },
  { x: 411.12, label: "Instagram DM", el: InstagramDM },
  { x: 825.12, label: "RCS", el: RCS },
  { x: 1032.12, label: "WhatsApp", el: WhatsApp },
];

export function ChannelScreens() {
  return html`
    ${SIDES.map(({ x, label, el: Screen }) => html`
      <div key=${label} class="pf__side nhg" style=${{ left: x + "rem", top: "953.03rem" }}>
        <div class="pf__sideScreen"><${Screen} /></div>
        <span class="pf__chLabel fB">${label}</span>
      </div>`)}
    <span class="pf__chLabel pf__chLabel--sms fB" style=${{ left: "618.12rem", top: "953.03rem" }}>SMS</span>`;
}
