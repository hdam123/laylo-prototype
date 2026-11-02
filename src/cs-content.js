// Case Studies index: all copy and image references, from Figma frame 217:2155
// (Laylo_Website-Design, Page 11). Copy, results and quotes are from laylo.com/case-studies.
const I = (name) => `./assets/cs/${name}`;
const CASE = (slug) => `https://laylo.com/case-studies/${slug}`;

export const HERO = {
  // Figma 219:2159: one full-bleed crowd shot (replaces the Skrillex / Mark Ambor split).
  bg: I("hero-bg.jpg"),
  title: ["Culture drops", "here first."],
  sub: ["Tours. Merch. Music. Lineups.", "See how top artists, festivals, & creators use Laylo to launch what’s next."],
};

export const FEATURED = [
  { name: "Wuki", result: "83% of fan list signups acquired through Instagram DMs", cat: "Music", img: I("wuki.jpg"), href: CASE("wuki-beats-i-cant-release") },
  { name: "VOILÀ", result: "Grew fan list 20% with tour teaser", cat: "Tours", img: I("voila.jpg"), href: CASE("voila") },
  { name: "Rosalía", result: "Sold out worldwide across all tour dates", cat: "Tours", img: I("rosalia.jpg"), href: CASE("rosalia") },
  { name: "Capitol Hill Block Party", result: "“We’re seeing more new sign-ups than ever before.”", cat: "Events", img: I("capitol.jpg"), href: CASE("capitol-hill-block-party") },
  { name: "The Beaches", result: "56X fan list through IG DMs, giveaways, merch", cat: "Merch", img: I("beaches-portrait.jpg"), href: CASE("the-beaches") },
  { name: "FISHER", result: "Activated fans on WhatsApp", cat: "Music", img: I("fisher.jpg"), href: CASE("fisher") },
];
export const FEATURED_COPY = "Expert advice from the world’s artists, festivals and creators to help you get more from every drop.";

export const FILTERS = [
  { label: "Tours", target: "cs-tours" },
  { label: "Merch", target: "cs-merch" },
  { label: "Music", target: "cs-music" },
  { label: "Events", target: "cs-events" },
];

export const TOURS = {
  label: "Drop tours",
  title: "Get fans in line before presale",
  quote: "“It’s all about how to collect data, utilize the data, and then activate those fans… Social media is rented real estate, you need to own the data.”",
  quoteWho: "Brandon Frankel, Head of Tour Marketing @ 33 & West",
  points: [
    "Mark Ambor — built his tour around fan demand.",
    "Mitski — 45%+ of RSVPs clicked to buy.",
    "Sam Smith — 75K+ sign ups in 24 hours.",
    "VOILÀ — grew fan list 20% with tour teaser.",
  ],
  feature: {
    name: "Sabrina Carpenter", img: I("sabrina.jpg"), href: CASE("sabrinacarpentersocial"),
    result: "Sold out instantly during presale",
    sub: "Unique presale codes through Laylo.",
    quote: "“With Sabrina Carpenter’s latest tour drop, we tested unique codes through Laylo and saw just half of what Ticketmaster typically sees with bots and brokers, and we were really happy with that result.”",
    who: ["Shayne Ehrlich,", "CAA"],
  },
};

export const MERCH = {
  title: "Sell out your store in style.",
  cards: [
    {
      name: "Wu-Tang Clan & Nike", result: "96% of fans clicked on drop day", img: I("wutang.jpg"), href: CASE("wtc"),
      quote: "“We get DMs “Can I please be part of the daily list?” It ends up being a little bit of a FOMO thing[…] We’ll do direct merch for those daily people.”",
      who: "Andrew Spelman, Artist Manager",
    },
    {
      name: "The Beaches", result: "56X fan list through IG DMs, giveaways, merch", img: I("beaches-merch.jpg"), href: CASE("the-beaches"),
      // Real quote (laylo.com, Laurie Lee), shortened with an ellipsis.
      quote: "“I love my Laylo… in one month, The Beaches went from 1,500 emails to 6,000 emails through presales, merch drops, and giveaways.”",
      who: "Laurie Lee, The Beaches Manager",
    },
    {
      name: "GRiZ", result: "His biggest merch sale ever", img: I("griz.jpg"), href: CASE("griz"),
      // PLACEHOLDER testimonial (not from laylo.com); replace with a real quote.
      quote: "“We dropped the collection to the fans who’d already raised their hands. It was gone before we could post about it anywhere else.”",
      who: "GRiZ merch team",
    },
    {
      name: "Aminé x New Balance", result: "Sold out merch drop", img: I("amine.jpg"), href: CASE("amine"),
      // PLACEHOLDER testimonial (not from laylo.com); replace with a real quote.
      quote: "“Fans got the alert the second the shoe went live. Having a list we own made the sell-out feel easy.”",
      who: "Aminé’s management team",
    },
  ],
};

export const MUSIC = {
  label: "Drop music",
  title: ["Drive more streams", "each release."],
  cards: [
    {
      name: "JVKE", value: "200K+", label: "Fans collected for Golden Hour", img: I("jvke.jpg"), href: CASE("jvke"),
      // As in Figma: the JVKE card carries Andrew Spelman's merch quote.
      quote: "“We get DMs “Can I please be part of the daily list?” It ends up being a little bit of a FOMO thing[…] We’ll do direct merch for those daily people.”",
      who: "Andrew Spelman, Artist Manager",
    },
    {
      name: "Japanese Breakfast", value: "40%", label: "Tour RSVP → album pre-save", img: I("japanese-breakfast.jpg"), href: CASE("japanese-breakfast"),
      // PLACEHOLDER testimonial (not from laylo.com); replace with a real quote.
      quote: "“Fans who RSVP’d for the tour were the first ones to pre-save the album. One list did both jobs for us.”",
      who: "Japanese Breakfast team",
    },
    {
      name: "Russ", value: "50K+", label: "Fans joined Russ World", img: I("russ.jpg"), href: CASE("russ"),
      // PLACEHOLDER testimonial (not from laylo.com); replace with a real quote.
      quote: "“Russ World gave fans a home that we actually own. Every release now goes straight to the people who care most.”",
      who: "Russ’s management team",
    },
  ],
};

export const EVENTS = {
  label: "Drop events",
  title: ["Pack the event,", "engage your crowd."],
  feature: {
    name: "Chris Lake + FNGRS CRSSD", img: I("chrislake.jpg"), avatar: I("fngrs.jpg"), href: CASE("chris-lake-fngrs-crssd"),
    result: "Artist + promoter teamed up, sold out",
    quote: "“We were just marveling at [presale performance] on a call yesterday... let’s just say we’ll sell out quickly.”",
    who: "Lee Krysinski, FNGRS CRSSD",
  },
  cards: [
    { name: "Capitol Hill Block Party", result: "“We’re seeing more new sign-ups than ever before.”", img: I("capitol.jpg"), href: CASE("capitol-hill-block-party") },
    { name: "Shambhala Music Festival", result: "Captured thousands of fan phone numbers in 2 days", img: I("shambhala.jpg"), href: CASE("shambhala-music-festival") },
    { name: "CRSSD Fest", result: "Presale sold out in two hours", img: I("crssd.jpg"), href: CASE("crssd-fest") },
    { name: "Outside Lands", result: "139% CTR on single day tickets", img: I("outside.jpg"), href: CASE("outside-lands") },
  ],
};

export const CTA = {
  title: ["Drop in your style.", "Amplify your audience.", "Sell out faster every time."],
  body: "Drive results with the #1 drop CRM trusted by The Beaches, Sabrina Carpenter, Japanese Breakfast and more.",
};
