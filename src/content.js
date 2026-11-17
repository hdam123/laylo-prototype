// All copy and image references. Anything not in the Figma file is marked PLACEHOLDER.
import { A } from "./lib.js";

export const NAV_LINKS = [
  { label: "Platform", target: "platform" },
  { label: "Why Laylo", target: "why" },
  { label: "Solutions", target: "solutions" },
  { label: "Greatest Hits", target: "greatest-hits" },
  { label: "Resources", target: "tools" },
];

// Hero: the word after "RUN THE PERFECT" cycles; each word has its own left image.
export const HERO_WORDS = [
// screen: which phone screen (hero.js SCREENS) goes with the word.
  { word: "TOUR", img: A("hero-olivia.jpg"), screen: 0 },
  { word: "PRE-SAVE", img: A("hero-presale.jpg"), screen: 2 },
  { word: "EVENT", img: A("hero-show.jpg"), screen: 4 },
  { word: "MERCH", img: A("hero-merch.jpg"), screen: 3 },
];

// "Started it all" strip, in Figma order. Only Diplo's caption is from Figma.
export const STRIP = [
  { img: A("strip-14.jpg"), name: "Juniper Rae", meta: "Tour Presale", mult: "2.4x" }, // PLACEHOLDER
  { img: A("hero-show.jpg"), name: "Diplo", meta: "Run Club", mult: "1.5x" },
  { img: A("hero-presale.jpg"), name: "Sunset Sessions", meta: "Festival Drop", mult: "3.2x" }, // PLACEHOLDER
  { img: A("hero-portrait.jpg"), name: "Nova Kai", meta: "Album Presave", mult: "1.8x" }, // PLACEHOLDER
  { img: A("hero-lineup.jpg"), name: "Afterglow Club", meta: "Merch Drop", mult: "2.1x" }, // PLACEHOLDER
  { img: A("strip-35.jpg"), name: "Elliot Vane", meta: "Ticket Presale", mult: "4.0x" }, // PLACEHOLDER
];

export const PLATFORM_STEPS = ["Capture fans", "Message everyone in one send", "Sell out the drop"];

// Version A: AI agents take over once a fan profile exists. One frame groups the stages where
// they work (Reach and Sell), after Legora's layered "stack". Copy is PLACEHOLDER.
export const AI_AGENTS = {
  tag: "AI agents",
  chips: ["Right message", "Right time", "Right channel"],
  timing: "Sending at 6:02 PM, each fan’s peak open time",
  agents: [
    { name: "Ticket Sales Agent", body: "312 RSVPs haven’t bought yet. Texting them the presale link." },
    { name: "Abandoned Cart Agent", body: "48 carts left open. Nudging them with a code, in your voice." },
  ],
};

// Version A, "Capture fans": the three places Laylo captures fans (client lo-fi + meeting notes).
// Copy is PLACEHOLDER: Laylo will align it with the broader capture story.
export const CAPTURE = [
  { key: "irl", name: "IRL", sub: "Live events", img: A("s3-after.jpg"), alt: "Artist on stage in front of a festival crowd",
    chip: { title: "Scan to join the list", value: "+2,431 tonight" } },
  { key: "socials", name: "Socials", sub: "Stories, posts & DMs", img: A("strip-14.jpg"), alt: "Artist portrait",
    reply: "DROP", dm: "Here’s your early access link ↗" },
  { key: "online", name: "Online", sub: "The artist’s website", img: A("hero-show.jpg"), alt: "Artist photo on their website",
    site: "diplo.com", form: { title: "Join the list", field: "Phone number", cta: "Get early access" } },
];

export const FAN_CARD = [
  ["CONTACT", "401.985.9925"],
  ["LOCATION", "Brooklyn, New York"],
  ["MUSIC", "Top 1% on Spotify"],
  ["BOUGHT", "2 Tickets, 1 Tee"],
  ["AMOUNT", "184USD"],
];

// Version A: richer Fan CRM card. PLACEHOLDER fan data.
export const FAN_PROFILE = {
  tags: ["Superfan", "Presale buyer", "Merch collector"],
  score: 98,
  stats: [["12", "Drops RSVPed"], ["94%", "Open rate"], ["$184", "Lifetime value"]],
  fields: [
    ["Contact", "401.985.9925"],
    ["Location", "Brooklyn, NY"],
    ["Music", "Top 1% on Spotify"],
    ["Bought", "2 Tickets, 1 Tee"],
    ["Fan since", "Mar 2024"],
    ["Last active", "2 min ago"],
  ],
};

export const BARS = [
  { label: "MUSIC", value: 2100, width: 76 },
  { label: "MERCH", value: 6900, width: 206 },
  { label: "TOUR", value: 12480, width: 298 },
];

export const AUDIENCES = ["Artists", "Promoters", "Festivals", "Creators"];
export const PHASES = ["Before", "During", "After"];

// Section 4: one real customer story per tab. Steps, stats and quotes are from the client's brief
// (laylo.com case studies, checked Oct 26, 2026). imgs: one per step, or one for all three.
// PLACEHOLDER photos: Circoloco and Capitol Hill Block Party use stand-in event shots from the
// Figma file; Matt Rife has no photo yet (img: null shows a labelled panel).
export const STORIES = {
  Artists: {
    client: "The Beaches",
    steps: [
      "300% fan list growth in a single month from Instagram story replies and DMs",
      "195% CTR on a merch drop; the superfan presale drove a 1.18× CTR to tickets",
      "56× total fan list growth in 2 years; every new release goes straight to the list",
    ],
    stat: "56× fan list",
    caseStudy: "https://laylo.com/case-studies/the-beaches",
    quote: "When someone replies to a story, that's when the sign up comes in.",
    who: ["Laurie Lee", "Manager, The Beaches"],
    imgs: [
      { img: A("s3-before.jpg"), crop: { w: 100, h: 120.8, l: 0, t: -16.79 } },
      { img: A("s3-during.jpg") },
      { img: A("s3-after.jpg"), crop: { w: 178.67, h: 119.13, l: -27.58, t: -15.67 } },
    ],
  },
  Promoters: {
    client: "Circoloco",
    steps: [
      "Moved sign-ups off Mailchimp and external promoters onto Laylo; the Paris drop drew 55,000 sign-ups",
      "Paris sold out in about 15 minutes; the Ibiza opening party sold out in two days",
      "DICE is connected, so ticket revenue tracks back to each drop",
    ],
    stat: "Ibiza opening party sold out ~3 months early",
    quote: "We did a drop for the opening party and we sold out within like two days which has been the fastest sellout in like 25 years.",
    who: ["Juliette Van Doorn", "Brand & Marketing, Circoloco"],
    imgs: [{ img: A("t-dance.jpg"), crop: { w: 145.69, h: 182.11, l: -22.84, t: -41.05 } }], // PLACEHOLDER photo
  },
  Festivals: {
    client: "Capitol Hill Block Party",
    steps: [
      "Connected Eventim so 100% of ticket buyers sync into the Laylo CRM with no manual upload",
      "50% avg CTR during the festival cycle",
      "Eventim became the festival's #1 source of fan list growth",
    ],
    stat: "25× ticket sales",
    sub: "$50,000+ in revenue",
    caseStudy: "https://laylo.com/case-studies/capitol-hill-block-party",
    quote: "Laylo really allowed us to create one seamless onboarding process.",
    who: ["Grace Lindsey", "Music Marketing Manager, Daydream State + Capitol Hill Block Party"],
    imgs: [{ img: A("hero-presale.jpg") }], // PLACEHOLDER photo
  },
  Creators: {
    client: "Matt Rife",
    steps: [
      "43% of fans on his list RSVPed for the tour",
      "Multiple sold-out stops, including his first headline show at Madison Square Garden",
      "26% of fans requested their city get added",
    ],
    stat: "Sold out Madison Square Garden",
    caseStudy: "https://laylo.com/case-studies/matt-rife",
    quote: null, // none published
    who: null,
    imgs: [{ img: null, label: "Matt Rife" }], // PLACEHOLDER: photo to come
  },
};

// Tools, packaged as the client's grouping (Capture / Convert / AI Agents).
// Copy comes from laylo-homepage-AM.html; Segments, WhatsApp and Discovery are PLACEHOLDER copy.
// action: "start" opens sign-up set to that tool; "learn" opens the tool's details panel.
const T = (icon) => A(`tools/${icon}.svg`);
export const TOOL_GROUPS = [
  {
    label: "Capture",
    intro: "Turn hype into fans you own.", // PLACEHOLDER copy
    tools: [
      { icon: T("outdoor_garden"), name: "Drops", body: "High-converting drop pages and RSVP cards — the most powerful way to capture signups on landing pages. Convert 7× more fans.", cta: "Build your first drop", action: "start" },
      { icon: T("group"), name: "Fan profiles", body: "Laylo automatically enriches fan profiles from your list with ticket, merch, and music data.", cta: "Explore fan profiles", action: "learn" },
      { icon: T("tabs"), name: "Tour Suite", body: "Sell out tours and events with automated fan RSVPs and city-based notifications.", cta: "Drop your tour", action: "start" },
      { icon: T("forum"), name: "Instagram DMs", body: "Automatically send direct messages when fans respond to your stories and posts.", cta: "Set up auto-DMs", action: "start" },
      { icon: T("code_blocks"), name: "Embeds", body: "Collect fan signups from your website using embedded forms.", cta: "Capture more signups", action: "start" },
      { icon: T("headphones"), name: "Presaves", body: "Let fans presave your songs and follow you on Spotify for better playlist placement.", cta: "Drive streams on Spotify", action: "start" },
      { icon: T("filter_alt"), name: "Segments", body: "Group fans by city, purchases, streaming and engagement, then message exactly the right people for each drop.", cta: "Learn more", action: "learn" }, // PLACEHOLDER copy
      { icon: T("verified_user"), name: "RealFan", body: "Verifies every fan RSVP and delivers unique codes that brokers can't reuse.", cta: "Lock out brokers", action: "start" },
    ],
  },
  {
    label: "Convert",
    intro: "Reach them where they already are.", // PLACEHOLDER copy
    tools: [
      { icon: T("chat"), name: "SMS", body: "Send SMS messages and drop notifications directly to fans from a custom phone number.", cta: "Light up your line", action: "start" },
      { icon: T("sms"), name: "Branded RCS", body: "Transform messages into a branded fan experience. The next generation of SMS, with verified branding.", cta: "Own your branding", action: "start" },
      { icon: T("mail"), name: "Email", body: "Schedule and send automated emails to keep fans engaged.", cta: "Learn more", action: "learn" },
      { icon: T("phone_iphone"), name: "Custom number", body: "Message fans from a unique, dedicated phone number that they can save to contacts.", cta: "Get your number", action: "start" },
      { icon: T("voicemail"), name: "Voicemail", body: "Let fans call in, leave messages, hear from you, and join your list, all through voicemail.", cta: "Learn more", action: "learn" },
      { icon: T("mark_chat_read"), name: "WhatsApp", body: "Reach fans on the app they already use, with drop alerts and presale codes delivered straight to WhatsApp.", cta: "Learn more", action: "learn" }, // PLACEHOLDER copy
    ],
  },
  {
    label: "AI Agents",
    intro: "Agents that keep selling after the drop.", // PLACEHOLDER copy
    tools: [
      { icon: T("file_export"), name: "Abandoned Cart", body: "Send personalized texts in your voice, with a discount code if they need a nudge. No setup needed.", cta: "Discover this agent", action: "learn" },
      { icon: T("photo_camera"), name: "UGC", body: "Finds fan moments worth keeping, and connects with UGC tools you already use for permission & access.", cta: "Discover this agent", action: "learn" },
      { icon: T("confirmation_number"), name: "Ticket Sales", body: "Turn RSVPs into sold-out shows. Your Agent texts fans with real-time ticketing data and brings them back to buy.", cta: "Discover this agent", action: "learn" },
      { icon: T("explore"), name: "Discovery", body: "Finds new fans who look like your best ones and brings them into your next drop.", cta: "Discover this agent", action: "learn" }, // PLACEHOLDER copy
    ],
  },
];

// Testimonial quotes from the client's appendix (section 6). Stats/labels are taken from each
// quote where it has a number (#1, #4), from the Figma Beaches stat (#2), or paraphrase the quote (#3).
// Slot 5 is open in the appendix; the original Figma $180K card stands in until it is filled.
export const TESTIMONIALS = [
  { img: A("hero-portrait.jpg"), stat: "50%", label: "Fewer bots & brokers", quote: "With Sabrina Carpenter's latest tour drop, we tested unique codes through Laylo and saw just half of what Ticketmaster typically sees with bots and brokers.", who: ["Shayna Ehrlich", "Music Tour Marketing, CAA"] },
  { img: A("s3-before.jpg"), stat: "56×", label: "Fan list in two years", quote: "When someone replies to a story, that's when the sign up comes in.", who: ["Laurie Lee", "Artist Manager, The Beaches"] },
  { img: A("t-dance.jpg"), crop: { w: 145.69, h: 182.11, l: -22.84, t: -41.05 }, stat: "1 list", label: "Reused across campaigns", quote: "Laylo is helping us move into the fan data era, away from spray-and-pray ad strategies… We now have this audience that we can reuse for multiple campaigns.", who: ["Ethan Sacré", "Sr. Director of Digital Strategy, EMPIRE"] },
  { img: A("hero-presale.jpg"), crop: { w: 108.02, h: 104.89, l: -6.53, t: -2.45 }, stat: "$12.50", label: "CPA vs $30 typical", quote: "$12.50 CPA with Laylo versus $30 typical CPA for non-Laylo conversions… every dollar you spend on Laylo could be a hundred tickets sold.", who: ["Jesse Lawrence", "CEO & Co-Founder, FanIQ"] },
  // OPEN SLOT: stand-in from the Figma design until the fifth quote is chosen.
  { img: A("t-hoodie.jpg"), crop: { w: 118.62, h: 118.62, l: -9.31, t: -9.26 }, stat: "$180K", label: "From one text", quote: "We made about $180K from a single text.", who: ["Rhys Jackson", "Founder, TELETECH"] },
];

// Version A hero (hero-demo.js), from the client's rolling-frames example and meeting notes.
// Scroll moves between use cases; on the right, each one loops on a phone: the fan's view, the action,
// and its payoff (toast) floating out of the phone. Toast copy and phone numbers are PLACEHOLDER.
const HD = (name) => A(`hero-demo/${name}`);
export const HERO_CASES = [
  {
    key: "tour", word: "TOUR", img: A("hero-olivia.jpg"),
    artist: "Olivia Dean", avatar: A("hero-olivia.jpg"), art: HD("olivia-stage.jpg"), title: "The Art of Loving Tour",
    stops: [
      { d: "26", m: "Jun", city: "London", venue: "The O2", near: true },
      { d: "28", m: "Jun", city: "Manchester", venue: "AO Arena" },
      { d: "02", m: "Jul", city: "Paris", venue: "Zénith" },
      { d: "05", m: "Jul", city: "Amsterdam", venue: "Ziggo Dome" },
      { d: "09", m: "Jul", city: "Berlin", venue: "Uber Arena" },
    ],
    number: "+44 7700 900412",
    toast: ["You’re on the list for London", "Presale code by text, 25 June"],
  },
  {
    key: "event", word: "EVENT", img: A("hero-presale.jpg"),
    eyebrow: "Harborline Fest", art: HD("festival.jpg"), title: "Lineup drops Friday", sub: "RSVP for first access to tickets.",
    number: "+1 415 555 0132",
    toast: ["You’re on the list", "We’ll text your ticket code Friday at 10"],
  },
  {
    key: "album", word: "ALBUM", img: A("hero-show.jpg"),
    eyebrow: "Diplo", art: HD("album.jpg"), title: "New album", sub: "Out Friday. Pre-save and get a text when it drops.",
    toast: ["Pre-saved ✓", "You’re now following Diplo on Spotify"],
  },
  {
    key: "merch", word: "MERCH", img: A("hero-merch.jpg"),
    handle: "staticbloom", art: HD("tee.jpg"), comment: "MERCH",
    product: ["Drop 03 · Black tee", "$35 · code FIRST10"],
    toast: ["Your Drop 03 link is in your DMs", "Black tee · $35 · code FIRST10"],
  },
];
