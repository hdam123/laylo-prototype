// About page: all copy and image references. Copy is from the "About Laylo" draft
// (laylo-about-us.html); portraits were extracted from it into assets/about/.
const I = (name) => `./assets/about/${name}`;

export const HERO = {
  eyebrow: "Laylo’s liner notes / Vol. 001",
  title: ["Giving artists & events", "a better way to drop"],
  since: "since 2017.",
  sub: "We’re a team of builders & live entertainment veterans who turned decades of industry experience into the leading drop platform, helping you convert earned hype into connection that lasts.",
  img: "./assets/s3-after.jpg", // photo band
  bg: "./assets/hero-lineup.jpg", // hero
};

// The four chapters: shown as record sleeves under the hero and as the floating chapter switch.
export const CHAPTERS = [
  { n: "01", title: "The Prologue", short: "Prologue", sub: "How it all started", target: "ab-story", },
  { n: "02", title: "The Founders", short: "Founders", sub: "Meet Alec & Saj", target: "ab-founders", },
  { n: "03", title: "The Band", short: "Band", sub: "The people behind your drops", target: "ab-team", },
  { n: "04", title: "Mission", short: "Mission", sub: "What we believe", target: "ab-mission", },
];

export const STORY = {
  label: "01 / The Prologue",
  title: ["It started with a little", "friendly rivalry."],
  paragraphs: [
    "Alec and Saj built competing music startups. One day, Saj’s best friend dragged Alec online. Alec decided to take Saj’s app for a spin. Almost immediately, he knew he’d been bested.",
    "A DM (and a couple meals) later, the duo had become fast friends. They shut down their rival companies and banded together.",
  ],
  turn: "That became Laylo.",
  timeline: [
    { year: "2017", text: "The company begins." },
    { year: "2020", text: "Y Combinator, Summer batch." },
    { year: "2021", text: "The drop platform launches." },
  ],
  bridge: "Today, we help artists, events, and creators turn the excitement around a release into a fan connection they can build on.",
};

export const FOUNDERS = {
  label: "02 / The Founders",
  title: ["Better on the", "same side."],
  lead: "Meet Alec Ellin and Sajan “Saj” Sanghvi, the cofounders behind Laylo.",
  people: [
    {
      name: "Alec Ellin", role: "Cofounder / CEO", img: I("alec.webp"),
      bio: "Before Laylo, Alec was building a music startup of his own. He and Saj decided they could make something better together. Today, Alec leads Laylo as cofounder and CEO.",
      links: [["LinkedIn", "https://www.linkedin.com/in/alec-ellin/"], ["X", "https://twitter.com/AlecEllin"]],
    },
    {
      name: "Sajan “Saj” Sanghvi", role: "Cofounder / CTO", img: I("sajan.webp"),
      bio: "Saj builds software and makes music. Laylo’s cofounder and CTO is also a producer with no suits, bringing an artist’s perspective to the tools he builds.",
      links: [["LinkedIn", "https://www.linkedin.com/in/sajan-sanghvi-77b638a0"], ["X", "https://twitter.com/nosuitsnotrends"]],
    },
  ],
};

export const TEAM = {
  label: "03 / The Band",
  title: ["A team that knows", "what’s at stake."],
  lead: "The release you’ve spent months on. The first night of a tour. The fans waiting for a link to go live. We build for those moments, and the people behind them.",
  intro: "Our team brings together experience in music, artist development, software, and growth. Alongside Alec and Saj, meet two of the people helping shape Laylo’s next chapter.",
  people: [
    {
      name: "Brian Shin", role: "Head of Growth", img: I("brian.webp"),
      bio: "Brian joined Laylo from Perplexity, where he led growth. At Laylo, his work spans artists, promoters, festivals, and entertainment brands.",
      href: "https://laylo.com/blog/laylo-hires-perplexitys-brian-shin-to-lead-ai-growth", cta: "Meet Brian",
    },
    {
      name: "Taz Sharp", role: "Director of Artists & Events, EMEA", img: I("taz.webp"),
      bio: "Based in London, Taz brings experience across artist development, management, and fan communities, including roles at Levellr and Believe.",
      href: "https://laylo.com/blog/laylo-expands-across-the-uk-europe-with-taz-sharp", cta: "Meet Taz",
    },
  ],
  join: { text: "Want to help build what comes next?", href: "https://www.ycombinator.com/companies/laylo/jobs", cta: "See open roles" },
};

export const MISSION = {
  label: "04 / Mission",
  title: ["Own your audience.", "Make your own noise."],
  lead: "You put the work into bringing people together. You should be able to reach them when it matters. Our mission is to help you build a direct relationship with your fans, one that carries from this release to the next.",
  beliefs: [
    { title: "The fan relationship comes first.", body: "There’s a person behind every signup. Someone waiting for the tickets, playing the album, or wearing the merch. Give them a direct way to hear what’s next." },
    { title: "Every drop builds the next one.", body: "The moment may be a ticket on-sale, a record, or a new collection. The connection should carry on after it. Keep building on the audience you’ve brought together." },
    { title: "Your tools should work together.", body: "Your store, your ticketing platform, your messages. Bring them together so you can understand what fans care about and make your next move count." },
  ],
};

// Thumbnails are PLACEHOLDER photos from the prototype until each post's own image is supplied.
const BLOG = (slug) => `https://laylo.com/blog/${slug}`;
export const NEWS = [
  { source: "Launch", title: "Introducing Discovery Agent", date: "October 9, 2026", href: BLOG("introducing-discovery-agent"), img: "./assets/s3-before.jpg" },
  { source: "Launch", title: "Laylo launches AI Ticket Sales Agent to fill seats after on-sale", date: "June 4, 2026", href: BLOG("meet-your-ai-ticket-sales-agent"), img: "./assets/cs/crssd.jpg" },
  { source: "Expansion", title: "Laylo expands across the UK & Europe with Taz Sharp as Director of Artists & Events, EMEA", date: "May 27, 2026", href: BLOG("laylo-expands-across-the-uk-europe-with-taz-sharp"), img: I("taz.webp") },
];

export const CTA = {
  title: ["Make some noise."],
  body: "Your next release is a moment. Make the connection last.",
};
