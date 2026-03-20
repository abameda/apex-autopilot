"use client";
import { useState, useEffect, useCallback, useRef } from "react";

// ════════════════════════════════════════════════════════════════
// APEX AUTOPILOT V3 — Final Production Build
// Brain: Gemini 3.1 Pro | Images: Gemini 3.1 Flash Image
// ════════════════════════════════════════════════════════════════

// ─── BRAND SYSTEM ───
const BRAND = {
  name: "APEX",
  handle: "@apexagency.xo",
  site: "apexagencyxo.vercel.app",
  tagline: "Premium Shopify Theme",
  usp: "The Shopify Theme That Turns Visitors Into Buyers",
  voice: "Professional, confident, conversion-focused. Speak to ambitious Shopify store owners who want premium results. Mix authority with approachability. Never salesy — educational and aspirational. Reference real features and stats.",
  knowledge: `PRODUCT: APEX Premium Shopify Theme — one-time purchase, not subscription.
FEATURES: Interactive Product Quiz, Immersive Product Layouts, Smart Cart Drawer with upsells/cross-sells, Wishlist & Back-in-Stock alerts, Quick View, Countdown Timers, Brand Storytelling sections, 20+ premium sections, one-click demo import.
PERFORMANCE: Sub-2s load times, 90+ PageSpeed scores, anti-FOUC, lazy loading, minimal JS, zero render-blocking.
DESIGN: Mobile-first, every pixel built for thumbs, responsive layouts that look premium on every screen.
SUPPORT: 24/7 priority support via email and DM, real humans, most issues resolved within hours.
SOCIAL PROOF: 40% conversion rate increase in first month, stores look like $10k custom builds, setup in 20 minutes, cart drawer upsells generate extra $2k/month, bounce rate dropped by half.
TARGET: Ambitious Shopify store owners in fashion, beauty, lifestyle, home décor, jewelry niches.
PRICING: One-time payment, includes lifetime updates, 14-day satisfaction guarantee, multi-store discounts available.`,
  colors: {
    accent: "#00E5CC",
    accentDim: "#00B8A3",
    bg: "#08080A",
    surface: "#101014",
    elevated: "#18181E",
    border: "rgba(255,255,255,0.06)",
    borderHover: "rgba(255,255,255,0.12)",
    textPrimary: "#FFFFFF",
    textSecondary: "rgba(255,255,255,0.55)",
    textDim: "rgba(255,255,255,0.3)",
  }
};

const PILLARS = [
  { id: "showcase", name: "Theme Showcase", emoji: "🖥", color: "#00E5CC", desc: "Screenshots & recordings of the theme in action", svgTemplate: "showcase" },
  { id: "beforeafter", name: "Before / After", emoji: "✨", color: "#A78BFA", desc: "Default Shopify vs APEX transformation", svgTemplate: "split" },
  { id: "tips", name: "Quick Tips", emoji: "💡", color: "#FBBF24", desc: "Shopify conversion & design tips for store owners", svgTemplate: "numbered" },
  { id: "proof", name: "Social Proof", emoji: "⭐", color: "#34D399", desc: "Testimonials, results, metrics from real customers", svgTemplate: "quote" },
  { id: "bts", name: "Behind the Scenes", emoji: "🔧", color: "#F97316", desc: "Building, coding & updating the theme", svgTemplate: "terminal" },
  { id: "education", name: "Education", emoji: "📚", color: "#60A5FA", desc: "Why themes matter, ecommerce knowledge", svgTemplate: "editorial" },
];

const TYPES = ["Feed Post", "Carousel", "Reel", "Story"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// ─── SVG TEMPLATE ENGINE ───
const brandFrame = (accent, inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
<defs>
<pattern id="g" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0L0 0 0 36" fill="none" stroke="rgba(255,255,255,0.025)" stroke-width="0.5"/></pattern>
<linearGradient id="ag" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${accent}" stop-opacity="0.2"/><stop offset="100%" stop-color="${accent}" stop-opacity="0"/></linearGradient>
</defs>
<rect width="1080" height="1080" fill="#08080A"/>
<rect width="1080" height="1080" fill="url(#g)"/>
<ellipse cx="880" cy="100" rx="380" ry="280" fill="url(#ag)" opacity="0.6"/>
<rect y="0" width="1080" height="3" fill="${accent}"/>
<g transform="translate(38,28)">
<path d="M5 42 L20 8 L27 22 L20 22 L34 22 L27 8 L42 42" fill="none" stroke="${accent}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
</g>
<text x="92" y="58" font-family="'Audiowide',sans-serif" font-size="26" fill="#FFFFFF" letter-spacing="8">APEX</text>
<text x="92" y="76" font-family="'Outfit',sans-serif" font-size="9" fill="rgba(255,255,255,0.6)" letter-spacing="4">PREMIUM THEMES</text>
<text x="1032" y="58" font-family="'Outfit',sans-serif" font-size="12" fill="rgba(255,255,255,0.5)" text-anchor="end">@apexagency.xo</text>
${inner}
<rect y="1040" width="1080" height="40" fill="#101014"/>
<g transform="translate(38,1046)">
<path d="M3 24 L12 4 L16 13 L12 13 L20 13 L16 4 L25 24" fill="none" stroke="${accent}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
</g>
<text x="72" y="1065" font-family="'Audiowide',sans-serif" font-size="10" fill="rgba(255,255,255,0.3)" letter-spacing="3">APEX</text>
<text x="142" y="1065" font-family="'Outfit',sans-serif" font-size="10" fill="rgba(255,255,255,0.2)">apexagencyxo.vercel.app</text>
<text x="1032" y="1065" font-family="'Audiowide',sans-serif" font-size="10" fill="${accent}" text-anchor="end" letter-spacing="1.5">GET THE THEME →</text>
<line x1="38" y1="1038" x2="170" y2="1038" stroke="${accent}" stroke-width="2" opacity="0.3"/>
</svg>`;

const wrap = (t, maxChars) => {
  if (!t) return [""];
  const words = t.split(" ");
  const lines = [];
  let cur = "";
  words.forEach(w => { if ((cur + " " + w).trim().length > maxChars) { lines.push(cur.trim()); cur = w; } else { cur = (cur + " " + w).trim(); } });
  if (cur) lines.push(cur.trim());
  return lines;
};

const SVG_TEMPLATES = {
  showcase: (title, sub, accent) => {
    const tl = wrap(title, 22);
    return brandFrame(accent, `
<text x="80" y="180" font-family="'Outfit',sans-serif" font-size="12" fill="${accent}" letter-spacing="3">THEME SHOWCASE</text>
<line x1="80" y1="200" x2="160" y2="200" stroke="${accent}" stroke-width="2"/>
${tl.map((l, i) => `<text x="80" y="${290 + i * 65}" font-family="'Audiowide',sans-serif" font-size="52" font-weight="800" fill="#FFF">${l}</text>`).join("")}
<text x="80" y="${290 + tl.length * 65 + 30}" font-family="'Outfit',sans-serif" font-size="18" fill="rgba(255,255,255,0.4)">${(sub || "").slice(0, 55)}</text>
<rect x="80" y="${290 + tl.length * 65 + 60}" width="200" height="48" fill="${accent}"/>
<text x="180" y="${290 + tl.length * 65 + 90}" font-family="'Audiowide',sans-serif" font-size="13" font-weight="700" fill="#08080A" text-anchor="middle" letter-spacing="1">LIVE PREVIEW →</text>
<rect x="680" y="160" width="340" height="520" fill="#101014" stroke="rgba(255,255,255,0.04)"/>
<rect x="680" y="160" width="340" height="3" fill="${accent}" opacity="0.6"/>
<rect x="700" y="185" width="300" height="180" fill="#18181E"/>
<rect x="700" y="390" width="180" height="16" fill="rgba(255,255,255,0.04)"/>
<rect x="700" y="420" width="260" height="10" fill="rgba(255,255,255,0.03)"/>
<rect x="700" y="440" width="220" height="10" fill="rgba(255,255,255,0.025)"/>
<text x="80" y="820" font-family="'Audiowide',sans-serif" font-size="48" font-weight="800" fill="${accent}">90+</text>
<text x="80" y="848" font-family="'Outfit',sans-serif" font-size="12" fill="rgba(255,255,255,0.35)">PageSpeed Score</text>
<text x="280" y="820" font-family="'Audiowide',sans-serif" font-size="48" font-weight="800" fill="#FFF">&lt;2s</text>
<text x="280" y="848" font-family="'Outfit',sans-serif" font-size="12" fill="rgba(255,255,255,0.35)">Load Time</text>
<text x="460" y="820" font-family="'Audiowide',sans-serif" font-size="48" font-weight="800" fill="#FFF">20+</text>
<text x="460" y="848" font-family="'Outfit',sans-serif" font-size="12" fill="rgba(255,255,255,0.35)">Premium Sections</text>`);
  },

  split: (title, sub, accent) => brandFrame(accent, `
<text x="540" y="160" font-family="'Outfit',sans-serif" font-size="12" fill="${accent}" letter-spacing="3" text-anchor="middle">BEFORE / AFTER</text>
<text x="540" y="205" font-family="'Audiowide',sans-serif" font-size="34" font-weight="800" fill="#FFF" text-anchor="middle">${(title || "").slice(0, 38)}</text>
<rect x="48" y="250" width="476" height="500" fill="#101014" stroke="rgba(255,255,255,0.05)"/>
<rect x="48" y="250" width="476" height="32" fill="#18181E"/>
<circle cx="70" cy="266" r="5" fill="#EF4444"/><circle cx="86" cy="266" r="5" fill="#FBBF24"/><circle cx="102" cy="266" r="5" fill="#22C55E"/>
<text x="286" y="271" font-family="'Outfit',sans-serif" font-size="11" fill="rgba(255,255,255,0.25)" text-anchor="middle">Default Theme</text>
<rect x="78" y="306" width="416" height="170" fill="#18181E"/>
<rect x="78" y="500" width="200" height="12" fill="rgba(255,255,255,0.04)"/>
<rect x="78" y="520" width="300" height="8" fill="rgba(255,255,255,0.025)"/>
<text x="286" y="680" font-family="'Outfit',sans-serif" font-size="15" fill="rgba(255,255,255,0.2)" text-anchor="middle">Slow · Generic · Low Converting</text>
<rect x="556" y="250" width="476" height="500" fill="#101014" stroke="${accent}" stroke-width="1.5"/>
<rect x="556" y="250" width="476" height="3" fill="${accent}"/>
<text x="794" y="275" font-family="'Audiowide',sans-serif" font-size="11" fill="${accent}" text-anchor="middle" letter-spacing="3">APEX THEME</text>
<rect x="586" y="306" width="416" height="170" fill="#18181E" stroke="${accent}" stroke-width="0.5" opacity="0.4"/>
<rect x="586" y="500" width="200" height="12" fill="${accent}" opacity="0.12"/>
<rect x="586" y="520" width="300" height="8" fill="rgba(255,255,255,0.04)"/>
<text x="794" y="680" font-family="'Outfit',sans-serif" font-size="15" fill="${accent}" text-anchor="middle">Fast · Premium · High Converting</text>
<circle cx="540" cy="500" r="26" fill="#08080A" stroke="${accent}" stroke-width="2"/>
<text x="540" y="507" font-family="'Audiowide',sans-serif" font-size="14" font-weight="800" fill="${accent}" text-anchor="middle">VS</text>
<text x="540" y="840" font-family="'Outfit',sans-serif" font-size="17" fill="rgba(255,255,255,0.4)" text-anchor="middle">${(sub || "").slice(0, 55)}</text>
<text x="540" y="920" font-family="'Audiowide',sans-serif" font-size="18" font-weight="700" fill="${accent}" text-anchor="middle" letter-spacing="2">UPGRADE YOUR STORE →</text>`),

  numbered: (title, sub, accent) => {
    const tl = wrap(title, 24);
    return brandFrame(accent, `
<text x="80" y="170" font-family="'Outfit',sans-serif" font-size="12" fill="${accent}" letter-spacing="3">QUICK TIP</text>
<text x="80" y="460" font-family="'Audiowide',sans-serif" font-size="260" font-weight="800" fill="rgba(255,255,255,0.025)">01</text>
<line x1="80" y1="200" x2="140" y2="200" stroke="${accent}" stroke-width="3"/>
${tl.map((l, i) => `<text x="80" y="${340 + i * 60}" font-family="'Audiowide',sans-serif" font-size="48" font-weight="800" fill="#FFF">${l}</text>`).join("")}
<text x="80" y="${340 + tl.length * 60 + 30}" font-family="'Outfit',sans-serif" font-size="18" fill="rgba(255,255,255,0.4)">${(sub || "").slice(0, 60)}</text>
<rect x="680" y="280" width="340" height="360" fill="#101014" stroke="rgba(255,255,255,0.05)"/>
<rect x="680" y="280" width="3" height="360" fill="${accent}" opacity="0.4"/>
<text x="710" y="330" font-family="'JetBrains Mono',monospace" font-size="11" fill="${accent}" opacity="0.6">// pro tip</text>
<text x="710" y="360" font-family="'JetBrains Mono',monospace" font-size="12" fill="rgba(255,255,255,0.25)">const conversion =</text>
<text x="710" y="382" font-family="'JetBrains Mono',monospace" font-size="12" fill="rgba(255,255,255,0.25)">  design + speed;</text>
<rect x="80" y="870" width="200" height="48" fill="none" stroke="${accent}" stroke-width="2"/>
<text x="180" y="900" font-family="'Audiowide',sans-serif" font-size="12" font-weight="700" fill="${accent}" text-anchor="middle" letter-spacing="1">SAVE THIS TIP</text>`);
  },

  quote: (title, sub, accent) => brandFrame(accent, `
<text x="540" y="160" font-family="'Outfit',sans-serif" font-size="12" fill="${accent}" letter-spacing="3" text-anchor="middle">CLIENT RESULTS</text>
<text x="80" y="340" font-family="Georgia,serif" font-size="180" fill="${accent}" opacity="0.1">"</text>
${wrap(title, 32).map((l, i) => `<text x="120" y="${380 + i * 44}" font-family="'Outfit',sans-serif" font-size="30" font-weight="500" fill="#FFF" font-style="italic">${l}</text>`).join("")}
<line x1="120" y1="540" x2="200" y2="540" stroke="${accent}" stroke-width="3"/>
<text x="120" y="580" font-family="'Audiowide',sans-serif" font-size="16" font-weight="700" fill="#FFF">${(sub || "Store Owner").slice(0, 30)}</text>
<text x="120" y="604" font-family="'Outfit',sans-serif" font-size="13" fill="rgba(255,255,255,0.3)">Verified APEX Customer</text>
<text x="120" y="660" font-family="sans-serif" font-size="22" fill="${accent}">★ ★ ★ ★ ★</text>
<rect x="120" y="720" width="280" height="95" fill="#101014" stroke="rgba(255,255,255,0.05)"/>
<rect x="120" y="720" width="280" height="3" fill="${accent}"/>
<text x="260" y="770" font-family="'Audiowide',sans-serif" font-size="34" font-weight="800" fill="${accent}" text-anchor="middle">+40%</text>
<text x="260" y="796" font-family="'Outfit',sans-serif" font-size="11" fill="rgba(255,255,255,0.35)" text-anchor="middle">Conversion Rate</text>
<rect x="420" y="720" width="280" height="95" fill="#101014" stroke="rgba(255,255,255,0.05)"/>
<rect x="420" y="720" width="280" height="3" fill="${accent}"/>
<text x="560" y="770" font-family="'Audiowide',sans-serif" font-size="34" font-weight="800" fill="#FFF" text-anchor="middle">$2K+</text>
<text x="560" y="796" font-family="'Outfit',sans-serif" font-size="11" fill="rgba(255,255,255,0.35)" text-anchor="middle">Extra Monthly Revenue</text>
<rect x="720" y="720" width="280" height="95" fill="#101014" stroke="rgba(255,255,255,0.05)"/>
<rect x="720" y="720" width="280" height="3" fill="${accent}"/>
<text x="860" y="770" font-family="'Audiowide',sans-serif" font-size="34" font-weight="800" fill="#FFF" text-anchor="middle">-50%</text>
<text x="860" y="796" font-family="'Outfit',sans-serif" font-size="11" fill="rgba(255,255,255,0.35)" text-anchor="middle">Bounce Rate</text>`),

  terminal: (title, sub, accent) => {
    const tl = wrap(title, 28);
    return brandFrame(accent, `
<text x="80" y="160" font-family="'Outfit',sans-serif" font-size="12" fill="${accent}" letter-spacing="3">BEHIND THE SCENES</text>
<rect x="48" y="190" width="984" height="500" fill="#101014" stroke="rgba(255,255,255,0.06)"/>
<rect x="48" y="190" width="984" height="32" fill="#18181E"/>
<circle cx="70" cy="206" r="5" fill="#EF4444"/><circle cx="88" cy="206" r="5" fill="#FBBF24"/><circle cx="106" cy="206" r="5" fill="#22C55E"/>
<text x="540" y="211" font-family="'JetBrains Mono',monospace" font-size="11" fill="rgba(255,255,255,0.25)" text-anchor="middle">apex-theme — zsh</text>
<text x="80" y="268" font-family="'JetBrains Mono',monospace" font-size="13" fill="${accent}">$ building apex-theme v3.2</text>
<text x="80" y="296" font-family="'JetBrains Mono',monospace" font-size="13" fill="rgba(255,255,255,0.35)">→ Compiling 20+ sections...</text>
<text x="80" y="324" font-family="'JetBrains Mono',monospace" font-size="13" fill="rgba(255,255,255,0.35)">→ Optimizing assets...</text>
<text x="80" y="352" font-family="'JetBrains Mono',monospace" font-size="13" fill="#22C55E">✓ PageSpeed: 94/100</text>
<text x="80" y="380" font-family="'JetBrains Mono',monospace" font-size="13" fill="#22C55E">✓ Zero render-blocking JS</text>
<text x="80" y="408" font-family="'JetBrains Mono',monospace" font-size="13" fill="#22C55E">✓ Mobile-first responsive</text>
<text x="80" y="450" font-family="'JetBrains Mono',monospace" font-size="13" fill="${accent}">$ <rect x="93" y="438" width="9" height="16" fill="${accent}" opacity="0.6"/></text>
${tl.map((l, i) => `<text x="80" y="${580 + i * 52}" font-family="'Audiowide',sans-serif" font-size="40" font-weight="800" fill="#FFF">${l}</text>`).join("")}
<text x="80" y="${580 + tl.length * 52 + 24}" font-family="'Outfit',sans-serif" font-size="16" fill="rgba(255,255,255,0.35)">${(sub || "").slice(0, 60)}</text>
<rect x="80" y="880" width="240" height="48" fill="${accent}"/>
<text x="200" y="910" font-family="'Audiowide',sans-serif" font-size="12" font-weight="700" fill="#08080A" text-anchor="middle" letter-spacing="1">SEE IT IN ACTION →</text>`);
  },

  editorial: (title, sub, accent) => {
    const tl = wrap(title, 18);
    return brandFrame(accent, `
<rect x="80" y="150" width="130" height="26" fill="${accent}"/>
<text x="145" y="168" font-family="'Audiowide',sans-serif" font-size="10" font-weight="800" fill="#08080A" text-anchor="middle" letter-spacing="2">EDUCATION</text>
${tl.map((l, i) => `<text x="80" y="${280 + i * 70}" font-family="'Audiowide',sans-serif" font-size="58" font-weight="800" fill="#FFF" letter-spacing="-2">${l}</text>`).join("")}
<rect x="80" y="${280 + tl.length * 70 + 10}" width="120" height="4" fill="${accent}"/>
<text x="80" y="${280 + tl.length * 70 + 50}" font-family="'Outfit',sans-serif" font-size="20" fill="rgba(255,255,255,0.4)">${(sub || "").slice(0, 50)}</text>
<text x="80" y="${280 + tl.length * 70 + 80}" font-family="'Outfit',sans-serif" font-size="14" fill="${accent}">Read the full breakdown →</text>
<rect x="960" y="150" width="2" height="500" fill="${accent}" opacity="0.15"/>
<rect x="80" y="740" width="920" height="160" fill="#101014" stroke="${accent}" stroke-width="0.5" opacity="0.5"/>
<rect x="80" y="740" width="4" height="160" fill="${accent}"/>
<text x="116" y="785" font-family="'Outfit',sans-serif" font-size="12" fill="${accent}" letter-spacing="2">KEY INSIGHT</text>
<text x="116" y="820" font-family="'Outfit',sans-serif" font-size="18" fill="rgba(255,255,255,0.5)">Your theme isn't just design — it's your</text>
<text x="116" y="848" font-family="'Outfit',sans-serif" font-size="18" fill="rgba(255,255,255,0.5)">store's conversion engine.</text>
<text x="116" y="880" font-family="'Outfit',sans-serif" font-size="12" fill="rgba(255,255,255,0.25)">Average store sees 2-3x improvement with a premium theme</text>`);
  }
};

// ─── AI PROMPT ───
const CAPTION_PROMPT = (pillar, type, insightsData) => `You are the strategist for APEX (@apexagency.xo), a premium Shopify theme brand.

${BRAND.knowledge}

BRAND VOICE: ${BRAND.voice}

Create 1 Instagram ${type} for "${pillar.name}" pillar: ${pillar.desc}
INSTAGRAM VISUAL STRATEGY: Posts must stop the scroll instantly. Bold electric cyan (#00E5CC) is the hero color — used prominently, not subtly. Deep navy-to-black gradients as backgrounds (not flat black). Single clear focal point per image. Compositions that read perfectly as a 150px thumbnail.
${insightsData ? `
PERFORMANCE INSIGHTS FROM PREVIOUS POSTS — use these to improve this post:
- Best performing pillar: ${insightsData.bestPillar || "unknown"}
- Best day to post: ${insightsData.bestDay || "unknown"}
- Best time to post: ${insightsData.bestTime || "unknown"}
- Key learnings: ${(insightsData.insights || []).join(". ")}
- Recommendations: ${(insightsData.recommendations || []).join(". ")}
Apply these insights to make this post perform better than previous ones.
` : ""}
INSTAGRAM CAPTION RULES:
- First line = scroll-stopping hook. Use ONE of these styles (vary across posts): bold stat, provocative question, controversial take, "most people don't know" opener, or a before/after contrast.
- Use 3-5 relevant emojis throughout — not random, each should add meaning.
- Add real line breaks between paragraphs using \\n\\n (Instagram shows these as actual spacing).
- Include a clear CTA at the end (save this, share with a friend, link in bio, DM us, etc.)
- Reference REAL APEX features and stats from the brand knowledge above — be specific, not generic.
- Caption should be 150-220 words. Not too short, not a wall of text.

Return ONLY valid JSON:
{"title":"Punchy headline for post image (max 8 words)","subtitle":"Supporting subline (max 15 words)","caption":"Full Instagram caption following the rules above. Use \\n\\n for line breaks between paragraphs.","hashtags":"Generate 20-25 relevant hashtags. Mix high-volume (#Shopify #Ecommerce #OnlineStore) with niche (#ShopifyTheme #APEXTheme #ConversionRate #ShopifyDesign). Always include #APEXTheme. Vary hashtags per post — NEVER repeat the exact same set.","bestTime":"e.g. 10:00 AM EST","needsAsset":false,"assetRequest":""}

CRITICAL RULES FOR needsAsset:
- Set needsAsset=true ONLY when the post is IMPOSSIBLE without a specific static photo you cannot AI-generate — for example: a screenshot of a REAL customer's live store URL, or a photo of a specific physical product.
- AI can generate: device mockups, workspaces, abstract visuals, charts, geometric art, stars, gradients, product photography. These never need needsAsset=true.
- NEVER request video, footage, screen recordings, animations, clips, or reels as an asset — this tool only handles static images. If the post type is Reel or Story, the static thumbnail image is all that is needed.
- Default is needsAsset=false. Only flip to true in rare, genuine cases where a real static photo is the only option.`;

const LEARN_PROMPT = (perfData) => `You are analyzing Instagram performance for APEX (@apexagency.xo), a Shopify theme brand.

Here is the performance data from recent posts:
${JSON.stringify(perfData, null, 2)}

Analyze patterns and return ONLY valid JSON:
{"insights":["insight1","insight2","insight3"],"bestPillar":"pillar_id","bestDay":"day_name","bestTime":"time","recommendations":["rec1","rec2","rec3"],"adjustments":{"increasePillars":["pillar_id"],"decreasePillars":["pillar_id"],"bestPostTypes":["type"]}}`;

// ─── PILLAR IMAGE PROMPTS ───
// Instagram-native visual identity: bold electric teal (#00E5CC) as hero color, deep navy-to-black
// gradients, clean single-focal-point compositions, thumb-stopping at 0.3s scroll speed.
// NOT the website's glassmorphism — this is Instagram-first, feed-dominant, high contrast.
const BRAND_LAYOUT = " CRITICAL LAYOUT RULE: Top 120px and bottom 100px must stay dark and empty — brand text overlays there. All focal points must stay in the middle 860px vertical zone.";
const IMAGE_PROMPT = {
  showcase: (title, sub) => `Stunning product reveal Instagram image, square 1:1, premium digital art quality. A single iPhone 15 Pro and MacBook Pro float centered against a rich deep background that graduates from pure black at the corners to a deep midnight navy (#0D1B2A) at the center. The device screens face the viewer, displaying a sleek dark e-commerce Shopify store layout — dark background, clean product grid, generous white space — no readable text. A single dramatic beam of electric cyan (#00E5CC) light rises from directly below the devices, washing them in a bold teal glow that fades upward into the navy background. The device frames have a premium dark titanium finish. Below each device: a sharp, clean cyan reflection on an invisible glass floor. The composition is centered, symmetrical, commanding. Mood: Apple product reveal meets luxury Shopify brand launch. Bold, immediate, stops the scroll. No text, no watermarks.${BRAND_LAYOUT}`,

  beforeafter: (title, sub) => `Bold Instagram before/after comparison graphic, square 1:1, high-impact visual design. The image is divided diagonally — a thick glowing electric cyan (#00E5CC) diagonal line runs from bottom-left to top-right, dividing the frame into two triangular halves. BOTTOM-LEFT TRIANGLE (before): a flat, dull, overcrowded Shopify storefront on white background — gray palette, cluttered layout, weak product images, lifeless. UPPER-RIGHT TRIANGLE (after): a stunning premium dark Shopify store — near-black background, bold product photography, clean minimal layout, electric cyan accents, aspirational and premium. The diagonal dividing line glows brightly in cyan — the single most eye-catching element. Background bleeds to very dark navy at edges. Mood: dramatic transformation, instant contrast, irresistible scroll-stop. Style: bold graphic design, high contrast, punchy. No text, no watermarks.${BRAND_LAYOUT}`,

  tips: (title, sub) => `Bold graphic design Instagram post, square 1:1, premium visual identity. Central composition: one large perfect circle (4px stroke, electric cyan #00E5CC) centered on a rich gradient background fading from near-black (#0A0A0A) at the top to deep dark navy at the bottom. Inside the circle: three minimal white line-art icons arranged in a clean triangle — an upward arrow at top, a lightning bolt at bottom-left, a shopping bag at bottom-right. Each icon has a very faint cyan glow. Outside the circle: four small diamond accent marks in cyan at north, south, east, west positions on the circle's edge. The background has an extremely subtle grid of white hairlines at 4% opacity. The composition is bold, geometric, confident — reads perfectly at thumbnail size. Style: premium SaaS brand design, modern, graphic, strong visual identity. No text, no words, no numbers, no watermarks.${BRAND_LAYOUT}`,

  proof: (title, sub) => `High-energy results visual for Instagram, square 1:1, premium brand graphic. A bold upward-trending chart curve dominates the image — a thick 4px electric cyan (#00E5CC) line with a strong cyan glow trail beneath it, rising steeply from the left edge to the upper right, plotted on an ultra-minimal dark grid. Background: deep gradient from pure black at top to dark teal (#003D35) at the bottom — rich, deep, premium. Below the chart line: the area is filled with a very subtle cyan-to-transparent gradient wash. In the lower third: three bold abstract geometric shapes side by side — a large upward arrow, a bold plus sign, a five-point star — all in solid electric cyan, clean and iconic. The overall image screams growth, results, and winning. Mood: triumphant, energetic, premium. No text, no numbers, no readable content.${BRAND_LAYOUT}`,

  bts: (title, sub) => `Cinematic developer workspace Instagram photo, square 1:1, photorealistic editorial quality. A large ultrawide monitor sits on a clean dark desk, angled slightly left, displaying a dark code editor with vibrant colorful syntax highlighting — electric cyan, purple, white, green rhythms — no readable code. An LED strip hidden behind the monitor creates a dramatic electric cyan (#00E5CC) halo that floods the dark room with teal light, washing the desk surface and keyboard in cool cyan shadows. A dark aluminum mechanical keyboard sits sharp in the immediate foreground. Everything outside the monitor glow falls into deep cinematic shadow. Composition: low angle, keyboard razor-sharp in foreground, monitor softly glowing behind. Depth of field: f/1.4 equivalent. Color grade: crushed blacks, cyan as the only strong color, deep shadows. Mood: late-night flow state, premium craft, technical mastery. No readable text, no watermarks.${BRAND_LAYOUT}`,

  education: (title, sub) => `Premium editorial graphic for Instagram, square 1:1, bold and intelligent design. A clean dark graphic with a rich gradient background: pure near-black (#0A0A0A) at the top fading to a deep dark teal (#002B25) at the bottom. The hero element: a bold upward arrow rendered as a thick geometric shape in solid electric cyan (#00E5CC) with a strong glow, centered and large — taking up 40% of the frame height. Behind it: a minimal isometric grid of white hairlines at 6% opacity suggesting depth and precision. Flanking the arrow: two thin vertical cyan lines that taper from bright at the bottom to invisible at the top. The corner areas fade to pure black. The composition is bold, graphic, immediately readable at thumbnail size — communicates growth and intelligence in one glance. Style: bold brand design meets premium editorial. No text, no numbers, no labels, no watermarks.${BRAND_LAYOUT}`,
};

// ─── DATE HELPERS ───
const getWeekDates = () => {
  const today = new Date();
  const monday = new Date(today);
  const dayOfWeek = today.getDay();
  monday.setDate(today.getDate() + (dayOfWeek === 0 ? 1 : 8 - dayOfWeek));
  return DAYS.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });
};

// ─── MAIN COMPONENT ───
export default function ApexAutopilotV3() {
  const [authed, setAuthed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginPass, setLoginPass] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [hasKey, setHasKey] = useState(false);

  const [view, setView] = useState("dashboard");
  const [posts, setPosts] = useState([]);
  const [settings, setSettings] = useState({ postsPerWeek: 5 });
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState({ cur: 0, tot: 0, msg: "" });
  const [selected, setSelected] = useState(null);
  const [editCaption, setEditCaption] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState(null);
  const [previewPillar, setPreviewPillar] = useState("showcase");
  const [performance, setPerformance] = useState([]);
  const [insights, setInsights] = useState(null);
  const [genImages, setGenImages] = useState({});
  const [genImgLoading, setGenImgLoading] = useState({});
  const [userAssets, setUserAssets] = useState({});
  const [imageTab, setImageTab] = useState("template");
  const [brandedPreview, setBrandedPreview] = useState(null);
  const [tab, setTab] = useState("all");

  const notify = useCallback((m, t = "ok") => { setToast({ m, t }); setTimeout(() => setToast(null), 3500); }, []);
  const uploadRef = useRef(null);

  const compressImage = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const max = 1024;
        let w = img.width, h = img.height;
        if (w > max || h > max) {
          const ratio = Math.min(max / w, max / h);
          w = Math.round(w * ratio); h = Math.round(h * ratio);
        }
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // ─── AUTH ───
  useEffect(() => {
    const token = localStorage.getItem("apex3-auth");
    if (token) {
      fetch("/api/auth", { headers: { authorization: token } })
        .then(r => r.json())
        .then(d => { if (d.authenticated) { setAuthed(true); setAuthToken(token); setHasKey(!!d.hasGeminiKey); } })
        .catch(() => {})
        .finally(() => setAuthLoading(false));
    } else {
      fetch("/api/auth")
        .then(r => r.json())
        .then(d => { if (d.authenticated) { setAuthed(true); setAuthToken("no-auth-required"); setHasKey(!!d.hasGeminiKey); } })
        .catch(() => {})
        .finally(() => setAuthLoading(false));
    }
  }, []);

  const login = async () => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: loginPass })
      });
      const data = await res.json();
      if (data.authenticated) {
        localStorage.setItem("apex3-auth", data.token);
        setAuthToken(data.token);
        setHasKey(!!data.hasGeminiKey);
        setAuthed(true);
      } else {
        notify("Wrong password", "err");
      }
    } catch (err) { notify("Login failed", "err"); }
  };

  const logout = () => {
    localStorage.removeItem("apex3-auth");
    setAuthed(false);
    setAuthToken("");
  };

  // ─── PERSISTENCE ───
  useEffect(() => {
    (async () => {
      try { const v = localStorage.getItem("apex3-posts"); if (v) setPosts(JSON.parse(v)); } catch (e) {}
      try { const v = localStorage.getItem("apex3-settings"); if (v) setSettings(p => ({ ...p, ...JSON.parse(v) })); } catch (e) {}
      try { const v = localStorage.getItem("apex3-perf"); if (v) setPerformance(JSON.parse(v)); } catch (e) {}
      try { const v = localStorage.getItem("apex3-insights"); if (v) setInsights(JSON.parse(v)); } catch (e) {}
      try { const v = localStorage.getItem("apex3-images"); if (v) setGenImages(JSON.parse(v)); } catch (e) {}
      try { const v = localStorage.getItem("apex3-assets"); if (v) setUserAssets(JSON.parse(v)); } catch (e) {}
    })();
  }, []);
  useEffect(() => { try { if (posts.length) localStorage.setItem("apex3-posts", JSON.stringify(posts)); } catch (e) {} }, [posts]);
  useEffect(() => { try { localStorage.setItem("apex3-settings", JSON.stringify(settings)); } catch (e) {} }, [settings]);
  useEffect(() => { try { if (performance.length) localStorage.setItem("apex3-perf", JSON.stringify(performance)); } catch (e) {} }, [performance]);
  useEffect(() => { try { if (insights) localStorage.setItem("apex3-insights", JSON.stringify(insights)); } catch (e) {} }, [insights]);
  useEffect(() => { try { if (Object.keys(genImages).length) localStorage.setItem("apex3-images", JSON.stringify(genImages)); } catch (e) {} }, [genImages]);
  useEffect(() => { try { if (Object.keys(userAssets).length) localStorage.setItem("apex3-assets", JSON.stringify(userAssets)); } catch (e) {} }, [userAssets]);

  // Auto-composite branded preview and set default tab when viewing a post
  useEffect(() => {
    if (!selected) { setBrandedPreview(null); return; }
    if (genImages[selected.id]) {
      setImageTab("branded");
      compositeBrandedImage(selected).then(setBrandedPreview).catch(() => setBrandedPreview(null));
    } else {
      setImageTab("template");
      setBrandedPreview(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id, genImages[selected?.id]]);

  // ─── GEMINI API ───
  const apiHeaders = useCallback(() => ({
    "Content-Type": "application/json",
    ...(authToken ? { authorization: authToken } : {})
  }), [authToken]);

  const callGemini = async (prompt, json = true) => {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: apiHeaders(),
      body: JSON.stringify({
        endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent",
        payload: {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.85, ...(json ? { responseMimeType: "application/json" } : {}) }
        }
      })
    });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || `Gemini ${res.status}`); }
    const d = await res.json();
    return d.candidates[0].content.parts[0].text;
  };

  // ─── GEMINI 3.1 FLASH IMAGE GEN ───
  const generateImage = async (postId, prompt) => {
    setGenImgLoading(p => ({ ...p, [postId]: true }));
    try {
      const parts = [{ text: prompt }];
      const asset = userAssets[postId];
      if (asset) {
        const [meta, data] = asset.split(",");
        const mimeType = meta.match(/:(.*?);/)?.[1] || "image/jpeg";
        parts.unshift({ text: "Incorporate this reference photo into the composition:" });
        parts.splice(1, 0, { inlineData: { mimeType, data } });
      }
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({
          endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent",
          payload: {
            contents: [{ parts }],
            generationConfig: { responseModalities: ["TEXT", "IMAGE"] }
          }
        })
      });
      if (!res.ok) throw new Error(`Image gen failed: ${res.status}`);
      const d = await res.json();
      const imgPart = d.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (imgPart) {
        const dataUrl = `data:${imgPart.inlineData.mimeType};base64,${imgPart.inlineData.data}`;
        setGenImages(p => ({ ...p, [postId]: dataUrl }));
        notify("Image generated!");
      } else {
        notify("No image returned — try a different prompt", "err");
      }
    } catch (err) { notify(err.message, "err"); }
    finally { setGenImgLoading(p => ({ ...p, [postId]: false })); }
  };

  // ─── GENERATE WEEK ───
  const generateWeek = async () => {
    setGenerating(true);
    const n = settings.postsPerWeek;
    const totalSteps = n * 2;
    setProgress({ cur: 0, tot: totalSteps, msg: "Planning..." });
    const newPosts = [];
    const dates = getWeekDates();
    try {
      for (let i = 0; i < n; i++) {
        const pillar = PILLARS[i % PILLARS.length];
        const type = TYPES[i % TYPES.length];
        const day = DAYS[i % 7];
        const date = dates[i % 7];
        setProgress({ cur: i * 2, tot: totalSteps, msg: `Writing ${day} ${date} — ${pillar.name}...` });
        let post;
        try {
          const raw = await callGemini(CAPTION_PROMPT(pillar, type, insights));
          const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
          post = {
            id: `p${Date.now()}${i}`, ...parsed,
            pillar: pillar.id, type, day, date, status: parsed.needsAsset ? "needs-asset" : "draft",
            week: weekLabel(), createdAt: new Date().toISOString()
          };
        } catch (err) {
          post = {
            id: `p${Date.now()}${i}`, title: `${pillar.name} Post`, subtitle: "Edit manually",
            caption: `[Failed: ${err.message}]`, hashtags: "#ShopifyTheme #APEX", bestTime: "10:00 AM EST",
            needsAsset: false, assetRequest: "", pillar: pillar.id, type, day, date,
            status: "draft", week: weekLabel(), createdAt: new Date().toISOString()
          };
        }
        newPosts.push(post);

        // Auto-generate AI image only if no user asset is needed
        setProgress({ cur: i * 2 + 1, tot: totalSteps, msg: post.needsAsset ? `Skipping image for ${day} — needs your input first` : `Generating image for ${day}...` });
        if (!post.needsAsset) try {
          const imgPromptFn = IMAGE_PROMPT[pillar.id] || IMAGE_PROMPT.showcase;
          const imgParts = [{ text: imgPromptFn(post.title, post.subtitle) }];
          const asset = userAssets[post.id];
          if (asset) {
            const [meta, data] = asset.split(",");
            const mimeType = meta.match(/:(.*?);/)?.[1] || "image/jpeg";
            imgParts.unshift({ text: "Incorporate this reference photo into the composition:" });
            imgParts.splice(1, 0, { inlineData: { mimeType, data } });
          }
          const imgRes = await fetch("/api/gemini", {
            method: "POST",
            headers: apiHeaders(),
            body: JSON.stringify({
              endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent",
              payload: {
                contents: [{ parts: imgParts }],
                generationConfig: { responseModalities: ["TEXT", "IMAGE"] }
              }
            })
          });
          if (imgRes.ok) {
            const imgData = await imgRes.json();
            const imgPart = imgData.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
            if (imgPart) {
              setGenImages(prev => ({ ...prev, [post.id]: `data:${imgPart.inlineData.mimeType};base64,${imgPart.inlineData.data}` }));
            }
          }
        } catch (imgErr) {
          // Image gen failed silently — SVG template is the fallback
        }
      }
      setProgress({ cur: totalSteps, tot: totalSteps, msg: "Done! Captions + images ready." });
      setPosts(prev => [...newPosts, ...prev]);
      const needsAsset = newPosts.filter(p => p.needsAsset).length;
      notify(`${n} posts + images created!${needsAsset ? ` ${needsAsset} need your input.` : ""}`);
    } catch (err) { notify(err.message, "err"); }
    finally { setTimeout(() => setGenerating(false), 400); }
  };

  const weekLabel = () => { const d = new Date(); d.setDate(d.getDate() - d.getDay() + 1); return `Week of ${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`; };

  // ─── COPY TO CLIPBOARD ───
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => notify("Copied to clipboard!")).catch(() => {
      const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); notify("Copied!");
    });
  };

  // ─── REGENERATE SINGLE POST ───
  const [regenLoading, setRegenLoading] = useState(null);
  const regeneratePost = async (post) => {
    if (!hasKey) { notify("API key not configured on server", "err"); return; }
    const pillar = PILLARS.find(p => p.id === post.pillar) || PILLARS[0];
    setRegenLoading(post.id);
    try {
      const raw = await callGemini(CAPTION_PROMPT(pillar, post.type, insights));
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      const updated = { ...post, ...parsed, status: parsed.needsAsset ? "needs-asset" : "draft" };
      setPosts(p => p.map(x => x.id === post.id ? updated : x));
      setSelected(updated);
      setEditCaption(parsed.caption);

      // Also regenerate image — skip if post still needs a user asset
      if (!updated.needsAsset) { const imgPromptFn = IMAGE_PROMPT[pillar.id] || IMAGE_PROMPT.showcase;
      const regenParts = [{ text: imgPromptFn(parsed.title, parsed.subtitle) }];
      const regenAsset = userAssets[post.id];
      if (regenAsset) {
        const [meta, data] = regenAsset.split(",");
        const mimeType = meta.match(/:(.*?);/)?.[1] || "image/jpeg";
        regenParts.unshift({ text: "Incorporate this reference photo into the composition:" });
        regenParts.splice(1, 0, { inlineData: { mimeType, data } });
      }
      try {
        const imgRes = await fetch("/api/gemini", {
          method: "POST",
          headers: apiHeaders(),
          body: JSON.stringify({
            endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent",
            payload: {
              contents: [{ parts: regenParts }],
              generationConfig: { responseModalities: ["TEXT", "IMAGE"] }
            }
          })
        });
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          const imgPart = imgData.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
          if (imgPart) {
            setGenImages(prev => ({ ...prev, [post.id]: `data:${imgPart.inlineData.mimeType};base64,${imgPart.inlineData.data}` }));
          }
        }
      } catch (imgErr) {} }
      notify("Post regenerated with new caption + image!");
    } catch (err) { notify(err.message, "err"); }
    finally { setRegenLoading(null); }
  };

  // ─── SELF-LEARNING ───
  const runLearning = async () => {
    if (performance.length < 3) { notify("Need at least 3 posts with stats to learn", "err"); return; }
    try {
      const raw = await callGemini(LEARN_PROMPT(performance));
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setInsights(parsed);
      notify("AI analyzed your performance!");
    } catch (err) { notify(err.message, "err"); }
  };

  const addPerfData = (postId, data) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    setPerformance(prev => [...prev, { postId, pillar: post.pillar, type: post.type, day: post.day, ...data, date: new Date().toISOString() }]);
    notify("Stats saved!");
  };

  // ─── ACTIONS ───
  const approve = id => { setPosts(p => p.map(x => x.id === id ? { ...x, status: "approved" } : x)); notify("Approved!"); };
  const approveAll = () => { setPosts(p => p.map(x => (x.status === "draft" || x.status === "ready") ? { ...x, status: "approved" } : x)); notify("All approved!"); };
  const del = id => { setPosts(p => p.filter(x => x.id !== id)); if (selected?.id === id) setSelected(null); };
  const clearAll = () => { setPosts([]); setSelected(null); localStorage.removeItem("apex3-posts"); notify("Cleared"); };
  const updateCap = (id, c) => setPosts(p => p.map(x => x.id === id ? { ...x, caption: c } : x));

  const getSVG = (post) => {
    const pillar = PILLARS.find(p => p.id === post.pillar) || PILLARS[0];
    const fn = SVG_TEMPLATES[pillar.svgTemplate] || SVG_TEMPLATES.showcase;
    return fn(post.title, post.subtitle, pillar.color);
  };

  const downloadSVG = (post) => {
    const blob = new Blob([getSVG(post)], { type: "image/svg+xml" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `apex-${post.pillar}-${post.day}.svg`; a.click();
    notify("SVG downloaded!");
  };

  const downloadAIImage = (post) => {
    const dataUrl = genImages[post.id];
    if (!dataUrl) { notify("No AI image to download", "err"); return; }
    const a = document.createElement("a"); a.href = dataUrl;
    a.download = `apex-${post.pillar}-${post.day}-ai.png`; a.click();
    notify("AI image downloaded!");
  };

  const brandOverlay = (accent, title, subtitle) => {
    const tl = wrap(title || "", 28);
    const escapeSvg = (str) => (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
<defs>
<style>
@import url('https://fonts.googleapis.com/css2?family=Audiowide&amp;family=Outfit:wght@400;600;700&amp;display=swap');
</style>
<linearGradient id="topFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#08080A" stop-opacity="0.92"/><stop offset="100%" stop-color="#08080A" stop-opacity="0"/></linearGradient>
<linearGradient id="botFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#08080A" stop-opacity="0"/><stop offset="100%" stop-color="#08080A" stop-opacity="0.95"/></linearGradient>
<pattern id="og" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0L0 0 0 36" fill="none" stroke="rgba(255,255,255,0.015)" stroke-width="0.5"/></pattern>
</defs>
<rect width="1080" height="1080" fill="url(#og)" opacity="0.5"/>
<rect y="0" width="1080" height="220" fill="url(#topFade)"/>
<rect y="0" width="1080" height="3" fill="${accent}"/>
<g transform="translate(38,28)">
<path d="M5 42 L20 8 L27 22 L20 22 L34 22 L27 8 L42 42" fill="none" stroke="${accent}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
</g>
<text x="92" y="58" font-family="'Audiowide',sans-serif" font-size="26" fill="#FFFFFF" letter-spacing="8">APEX</text>
<text x="92" y="76" font-family="'Outfit',sans-serif" font-size="9" fill="rgba(255,255,255,0.6)" letter-spacing="4">PREMIUM THEMES</text>
<text x="1032" y="58" font-family="'Outfit',sans-serif" font-size="12" fill="rgba(255,255,255,0.5)" text-anchor="end">@apexagency.xo</text>
<rect y="750" width="1080" height="330" fill="url(#botFade)"/>
${tl.map((l, i) => `<text x="60" y="${870 + i * 48}" font-family="'Audiowide',sans-serif" font-size="38" font-weight="800" fill="#FFFFFF" letter-spacing="1">${escapeSvg(l)}</text>`).join("")}
<text x="60" y="${870 + tl.length * 48 + 22}" font-family="'Outfit',sans-serif" font-size="16" fill="rgba(255,255,255,0.45)">${escapeSvg((subtitle || "").slice(0, 60))}</text>
<rect y="1040" width="1080" height="40" fill="#101014"/>
<g transform="translate(38,1046)">
<path d="M3 24 L12 4 L16 13 L12 13 L20 13 L16 4 L25 24" fill="none" stroke="${accent}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
</g>
<text x="72" y="1065" font-family="'Audiowide',sans-serif" font-size="10" fill="rgba(255,255,255,0.3)" letter-spacing="3">APEX</text>
<text x="142" y="1065" font-family="'Outfit',sans-serif" font-size="10" fill="rgba(255,255,255,0.2)">apexagencyxo.vercel.app</text>
<text x="1032" y="1065" font-family="'Audiowide',sans-serif" font-size="10" fill="${accent}" text-anchor="end" letter-spacing="1.5">GET THE THEME →</text>
<line x1="38" y1="1038" x2="170" y2="1038" stroke="${accent}" stroke-width="2" opacity="0.3"/>
</svg>`;
  };

  const compositeBrandedImage = (post) => new Promise((resolve, reject) => {
    const aiUrl = genImages[post.id];
    if (!aiUrl) { reject(new Error("No AI image")); return; }
    const pillar = PILLARS.find(p => p.id === post.pillar) || PILLARS[0];
    const overlaySvg = brandOverlay(pillar.color, post.title, post.subtitle);

    const aiImg = new Image();
    aiImg.onload = () => {
      const overlayImg = new Image();
      overlayImg.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 1080; canvas.height = 1080;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(aiImg, 0, 0, 1080, 1080);
        ctx.drawImage(overlayImg, 0, 0, 1080, 1080);
        resolve(canvas.toDataURL("image/png"));
      };
      overlayImg.onerror = reject;
      overlayImg.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(overlaySvg);
    };
    aiImg.onerror = reject;
    aiImg.src = aiUrl;
  });

  const downloadBrandedImage = async (post) => {
    try {
      const dataUrl = await compositeBrandedImage(post);
      const a = document.createElement("a"); a.href = dataUrl;
      a.download = `apex-${post.pillar}-${post.day}-branded.png`; a.click();
      notify("Branded image downloaded!");
    } catch { notify("Failed to composite branded image", "err"); }
  };

  const downloadAll = async () => {
    const approved = posts.filter(p => p.status === "approved" || p.status === "draft");
    if (approved.length === 0) { notify("No posts to download", "err"); return; }
    notify(`Downloading ${approved.length} posts (branded images + captions)...`);

    for (let i = 0; i < approved.length; i++) {
      const post = approved[i];
      const prefix = `apex-${String(i+1).padStart(2,"0")}-${post.day}-${post.pillar}`;

      // Download branded composite if AI image exists, otherwise SVG
      if (genImages[post.id]) {
        try {
          const branded = await compositeBrandedImage(post);
          const a = document.createElement("a"); a.href = branded;
          a.download = `${prefix}-branded.png`; a.click();
        } catch {
          // Fall back to raw AI image
          const a = document.createElement("a"); a.href = genImages[post.id];
          a.download = `${prefix}-ai.png`; a.click();
        }
      } else {
        const svgBlob = new Blob([getSVG(post)], { type: "image/svg+xml" });
        const a = document.createElement("a"); a.href = URL.createObjectURL(svgBlob);
        a.download = `${prefix}.svg`; a.click();
      }

      // Download caption
      await new Promise(r => setTimeout(r, 400));
      const captionText = `${post.caption}\n\n${post.hashtags}`;
      const txtBlob = new Blob([captionText], { type: "text/plain" });
      const txtA = document.createElement("a"); txtA.href = URL.createObjectURL(txtBlob);
      txtA.download = `${prefix}-caption.txt`; txtA.click();

      // Stagger between posts
      if (i < approved.length - 1) await new Promise(r => setTimeout(r, 800));
    }
    notify("All downloads complete!");
  };

  const stats = {
    total: posts.length,
    drafts: posts.filter(p => p.status === "draft").length,
    approved: posts.filter(p => p.status === "approved").length,
    scheduled: posts.filter(p => p.status === "scheduled").length,
    needsAsset: posts.filter(p => p.status === "needs-asset").length,
  };

  const filteredPosts = tab === "all" ? posts : tab === "needs-asset" ? posts.filter(p => p.status === "needs-asset") : posts.filter(p => p.status === tab);

  // ─── STYLES ───
  const s = {
    bg: BRAND.colors.bg,
    surface: BRAND.colors.surface,
    elevated: BRAND.colors.elevated,
    accent: BRAND.colors.accent,
    border: BRAND.colors.border,
    borderH: BRAND.colors.borderHover,
    t1: BRAND.colors.textPrimary,
    t2: BRAND.colors.textSecondary,
    t3: BRAND.colors.textDim,
  };

  const Btn = ({ children, primary, danger, small, disabled, onClick, style: sx }) => (
    <button onClick={onClick} disabled={disabled} style={{
      padding: small ? "6px 12px" : "10px 18px",
      border: primary ? "none" : danger ? `1px solid rgba(239,68,68,0.2)` : `1px solid ${s.border}`,
      background: primary ? s.accent : danger ? "rgba(239,68,68,0.06)" : "rgba(255,255,255,0.03)",
      color: primary ? s.bg : danger ? "rgba(239,68,68,0.6)" : s.t2,
      fontWeight: primary ? 700 : 500,
      fontSize: small ? 11 : 12,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1,
      fontFamily: "'Audiowide', sans-serif",
      letterSpacing: primary ? "1.5px" : "0.5px",
      transition: "all .15s",
      ...sx
    }}>{children}</button>
  );

  const Badge = ({ status }) => {
    const m = {
      draft: { bg: "rgba(255,255,255,0.04)", c: s.t3 },
      "needs-asset": { bg: "rgba(251,191,36,0.1)", c: "#FBBF24" },
      approved: { bg: "rgba(0,229,204,0.08)", c: s.accent },
      scheduled: { bg: "rgba(96,165,250,0.1)", c: "#60A5FA" },
      published: { bg: "rgba(52,211,153,0.1)", c: "#34D399" },
    }[status] || { bg: "rgba(255,255,255,0.04)", c: s.t3 };
    return <span style={{ padding: "3px 8px", fontSize: 10, fontWeight: 600, letterSpacing: "0.5px", background: m.bg, color: m.c, fontFamily: "'Outfit', sans-serif", direction: status === "needs-asset" ? "rtl" : "ltr" }}>{status === "needs-asset" ? "يحتاج مدخلات" : status.toUpperCase()}</span>;
  };

  // ════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════

  // Loading
  if (authLoading) return (
    <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", background: s.bg, color: s.t1, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 48, height: 48, background: s.accent, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
          <svg width="28" height="28" viewBox="0 0 80 80"><path d="M8 68 L35 15 L48 40 L35 40 L58 40 L45 15 L72 68" fill="none" stroke="#08080A" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round"/></svg>
        </div>
        <p style={{ fontSize: 10, color: s.t3, letterSpacing: "2px" }}>LOADING...</p>
      </div>
    </div>
  );

  // Login screen
  if (!authed) return (
    <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", background: s.bg, color: s.t1, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {toast && <div style={{ position: "fixed", top: 16, right: 16, zIndex: 9999, padding: "10px 18px", fontSize: 12, fontWeight: 500, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#EF4444", animation: "fadeIn .25s" }}>{toast.m}</div>}
      <div style={{ width: 340, padding: 32, background: s.surface, border: `1px solid ${s.border}` }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, background: s.accent, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <svg width="32" height="32" viewBox="0 0 80 80"><path d="M8 68 L35 15 L48 40 L35 40 L58 40 L45 15 L72 68" fill="none" stroke="#08080A" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round"/></svg>
          </div>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px", fontFamily: "Audiowide", letterSpacing: "4px" }}>APEX AUTOPILOT</h1>
          <p style={{ fontSize: 9, color: s.t3, margin: 0, letterSpacing: "2px" }}>INSTAGRAM COMMAND CENTER</p>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 9, fontWeight: 600, color: s.t3, letterSpacing: "1.5px", display: "block", marginBottom: 6 }}>PASSWORD</label>
          <input
            type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            placeholder="Enter password"
            autoFocus
            style={{ width: "100%", padding: 10, background: s.elevated, border: `1px solid ${s.border}`, color: s.t1, fontSize: 12, fontFamily: "JetBrains Mono", boxSizing: "border-box", letterSpacing: "2px" }}
          />
        </div>
        <button onClick={login} style={{
          width: "100%", padding: "12px", border: "none", background: s.accent, color: s.bg,
          fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "Audiowide", letterSpacing: "2px"
        }}>UNLOCK</button>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", background: s.bg, color: s.t1, minHeight: "100vh" }}>


      {/* Toast */}
      {toast && <div style={{ position: "fixed", top: 16, right: 16, zIndex: 9999, padding: "10px 18px", fontSize: 12, fontWeight: 500, background: toast.t === "err" ? "rgba(239,68,68,0.12)" : "rgba(0,229,204,0.08)", border: `1px solid ${toast.t === "err" ? "rgba(239,68,68,0.25)" : "rgba(0,229,204,0.2)"}`, color: toast.t === "err" ? "#EF4444" : s.accent, animation: "fadeIn .25s" }}>{toast.m}</div>}

      {/* ── HEADER ── */}
      <header style={{ borderBottom: `1px solid ${s.border}`, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(8,8,10,0.92)", backdropFilter: "blur(16px)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, background: s.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 80 80"><path d="M8 68 L35 15 L48 40 L35 40 L58 40 L45 15 L72 68" fill="none" stroke="#08080A" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round"/></svg>
          </div>
          <div>
            <h1 style={{ fontSize: 14, fontWeight: 700, margin: 0, letterSpacing: "3px", fontFamily: "Audiowide" }}>APEX AUTOPILOT</h1>
            <p style={{ fontSize: 9, color: s.t3, margin: 0, letterSpacing: "2px" }}>GEMINI 3.1 PRO × GEMINI 3.1 FLASH IMAGE</p>
          </div>
        </div>
        <nav style={{ display: "flex", gap: 2, alignItems: "center" }}>
          {[
            { id: "dashboard", l: "Dashboard" }, { id: "brand", l: "Brand" }, { id: "calendar", l: "Calendar" },
            { id: "generate", l: "Generate" }, { id: "learn", l: "Learn" }, { id: "guide", l: "Setup" }
          ].map(t => (
            <button key={t.id} onClick={() => setView(t.id)} style={{
              padding: "7px 12px", border: "none", fontSize: 11, fontWeight: 500, cursor: "pointer",
              background: view === t.id ? "rgba(0,229,204,0.08)" : "transparent",
              color: view === t.id ? s.accent : s.t3, fontFamily: "Outfit", letterSpacing: "0.5px",
              transition: "all .15s"
            }}>{t.l}</button>
          ))}
          <div style={{ width: 1, height: 20, background: s.border, margin: "0 4px" }} />
          <button onClick={() => setShowSettings(!showSettings)} style={{
            width: 32, height: 32, border: `1px solid ${s.border}`, background: showSettings ? "rgba(255,255,255,0.06)" : "transparent",
            color: s.t3, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
          }}>⚙</button>
        </nav>
      </header>

      <div style={{ display: "flex", minHeight: "calc(100vh - 57px)" }}>

        {/* ══ MAIN ══ */}
        <main style={{ flex: 1, padding: 20, overflow: "auto", maxHeight: "calc(100vh - 57px)" }}>

          {/* ── DASHBOARD ── */}
          {view === "dashboard" && (<div>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 16 }}>
              {[
                { l: "Total", v: stats.total, c: s.t1 }, { l: "Drafts", v: stats.drafts, c: "#FBBF24" },
                { l: "Needs Input", v: stats.needsAsset, c: "#F97316" }, { l: "Approved", v: stats.approved, c: s.accent },
                { l: "Scheduled", v: stats.scheduled, c: "#60A5FA" }
              ].map((x, i) => (
                <div key={i} style={{ background: s.surface, border: `1px solid ${s.border}`, padding: "14px 12px" }}>
                  <p style={{ fontSize: 9, color: s.t3, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "1.5px" }}>{x.l}</p>
                  <p style={{ fontSize: 24, fontWeight: 700, color: x.c, margin: 0, fontFamily: "Audiowide" }}>{x.v}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ background: "rgba(0,229,204,0.03)", border: `1px solid rgba(0,229,204,0.1)`, padding: 14, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: s.accent, margin: "0 0 2px", fontFamily: "Audiowide" }}>
                  {!hasKey ? "⚠ Set GEMINI_API_KEY in Vercel env vars" : stats.needsAsset > 0 ? `${stats.needsAsset} منشور يحتاج مدخلاتك` : "AI ready — Gemini 3.1 Pro + 3.1 Flash Image"}
                </p>
                <p style={{ fontSize: 10, color: s.t3, margin: 0 }}>
                  {hasKey ? "API key configured on server — secure and ready" : "Vercel Dashboard → Settings → Environment Variables"}
                </p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <Btn primary onClick={generateWeek} disabled={generating || !hasKey}>
                  {generating ? `${progress.cur}/${progress.tot}` : "▲ GENERATE WEEK"}
                </Btn>
                {stats.drafts > 0 && <Btn onClick={approveAll}>✓ Approve All</Btn>}
                {posts.length > 0 && <Btn onClick={downloadAll} style={{ color: "#60A5FA", borderColor: "rgba(96,165,250,0.2)" }}>↓ Download All</Btn>}
                {posts.length > 0 && <Btn danger small onClick={clearAll}>Clear</Btn>}
              </div>
            </div>

            {/* Progress */}
            {generating && (
              <div style={{ background: "rgba(0,229,204,0.04)", border: `1px solid rgba(0,229,204,0.12)`, padding: 12, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: s.accent }}>{progress.msg}</span>
                  <span style={{ fontSize: 10, color: s.t3 }}>{progress.cur}/{progress.tot}</span>
                </div>
                <div style={{ height: 3, background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
                  <div style={{ height: "100%", background: s.accent, transition: "width .5s", width: `${progress.tot ? (progress.cur / progress.tot) * 100 : 0}%` }} />
                </div>
              </div>
            )}

            {/* Filter tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
              {[{ id: "all", l: `All (${stats.total})` }, { id: "needs-asset", l: `يحتاج مدخلات (${stats.needsAsset})` }, { id: "draft", l: `Drafts (${stats.drafts})` }, { id: "approved", l: `Approved (${stats.approved})` }].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  padding: "5px 10px", fontSize: 10, border: tab === t.id ? `1px solid rgba(0,229,204,0.3)` : `1px solid ${s.border}`,
                  background: tab === t.id ? "rgba(0,229,204,0.06)" : "transparent",
                  color: tab === t.id ? s.accent : s.t3, cursor: "pointer", fontFamily: "Outfit"
                }}>{t.l}</button>
              ))}
            </div>

            {/* Posts */}
            {filteredPosts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "50px 20px", border: `1px dashed ${s.border}` }}>
                <p style={{ fontSize: 32, margin: "0 0 8px", color: s.accent }}>▲</p>
                <p style={{ fontSize: 12, color: s.t3 }}>{hasKey ? "Hit Generate Week to start" : "Configure GEMINI_API_KEY in Vercel first"}</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {filteredPosts.map(post => {
                  const pil = PILLARS.find(p => p.id === post.pillar) || PILLARS[0];
                  return (
                    <div key={post.id} onClick={() => { setSelected(post); setEditCaption(post.caption); }} style={{
                      background: selected?.id === post.id ? "rgba(0,229,204,0.03)" : s.surface,
                      border: `1px solid ${selected?.id === post.id ? "rgba(0,229,204,0.15)" : s.border}`,
                      padding: "10px 14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
                      transition: "all .12s"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                        <div style={{ width: 5, height: 36, background: pil.color, flexShrink: 0, opacity: 0.7 }} />
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 12, fontWeight: 500, margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{post.title}</p>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <span style={{ fontSize: 9, color: s.t3 }}>{post.day}{post.date ? `, ${post.date}` : ""}</span>
                            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.15)" }}>·</span>
                            <span style={{ fontSize: 9, color: s.t3 }}>{post.type}</span>
                            <span style={{ fontSize: 9, color: pil.color, opacity: 0.7 }}>{pil.emoji} {pil.name}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                        {post.needsAsset && <span style={{ fontSize: 9, color: "#F97316" }}>📎</span>}
                        <Badge status={post.status} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>)}

          {/* ── BRAND SYSTEM ── */}
          {view === "brand" && (<div>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 4px", fontFamily: "Audiowide", letterSpacing: "2px" }}>BRAND IDENTITY</h2>
            <p style={{ fontSize: 11, color: s.t3, margin: "0 0 20px" }}>Every post follows these rules. Your feed looks like one brand from day one.</p>

            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 9, fontWeight: 600, color: s.t3, letterSpacing: "2px", margin: "0 0 10px" }}>COLORS</h3>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[{ n: "Background", c: "#08080A" }, { n: "Surface", c: "#101014" }, { n: "Accent", c: s.accent }, { n: "Text", c: "#FFF" }].map(x => (
                  <div key={x.n} style={{ display: "flex", alignItems: "center", gap: 6, background: s.surface, border: `1px solid ${s.border}`, padding: "6px 10px" }}>
                    <div style={{ width: 18, height: 18, background: x.c, border: `1px solid rgba(255,255,255,0.1)` }} />
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 500, margin: 0 }}>{x.n}</p>
                      <p style={{ fontSize: 9, color: s.t3, margin: 0, fontFamily: "JetBrains Mono" }}>{x.c}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 9, fontWeight: 600, color: s.t3, letterSpacing: "2px", margin: "0 0 10px" }}>PILLAR TEMPLATES — click to preview</h3>
              <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                {PILLARS.map(p => (
                  <button key={p.id} onClick={() => setPreviewPillar(p.id)} style={{
                    padding: "5px 10px", border: previewPillar === p.id ? `1px solid ${p.color}` : `1px solid ${s.border}`,
                    background: previewPillar === p.id ? `${p.color}12` : s.surface,
                    color: previewPillar === p.id ? p.color : s.t3, fontSize: 10, cursor: "pointer", fontFamily: "Outfit"
                  }}>{p.emoji} {p.name}</button>
                ))}
              </div>
              {(() => {
                const p = PILLARS.find(x => x.id === previewPillar) || PILLARS[0];
                const svg = SVG_TEMPLATES[p.svgTemplate]("Your Amazing Headline Goes Right Here", "Supporting subtitle that explains the post value clearly", p.color);
                return (
                  <div style={{ maxWidth: 480, margin: "0 auto" }}>
                    <div dangerouslySetInnerHTML={{ __html: brandFrame(p.color, svg.split("</defs>")[1]?.split("</svg>")[0] || "") }} style={{ width: "100%", border: `1px solid ${s.border}` }} />
                    <p style={{ fontSize: 9, color: s.t3, textAlign: "center", marginTop: 6 }}>Template: {p.svgTemplate} · Accent: {p.color} · All posts share the brand frame</p>
                  </div>
                );
              })()}
            </div>
          </div>)}

          {/* ── CALENDAR ── */}
          {view === "calendar" && (<div>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 14px", fontFamily: "Audiowide", letterSpacing: "2px" }}>{weekLabel()}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 5 }}>
              {DAYS.map(day => {
                const dp = posts.filter(p => p.day === day);
                return (
                  <div key={day} style={{ background: s.surface, border: `1px solid ${s.border}`, padding: 8, minHeight: 160 }}>
                    <p style={{ fontSize: 9, fontWeight: 600, color: s.t3, letterSpacing: "1.5px", margin: "0 0 8px" }}>{day.slice(0, 3).toUpperCase()}</p>
                    {dp.map(post => {
                      const pil = PILLARS.find(x => x.id === post.pillar) || PILLARS[0];
                      return (
                        <div key={post.id} onClick={() => { setSelected(post); setEditCaption(post.caption); setView("dashboard"); }}
                          style={{ background: "rgba(255,255,255,0.02)", padding: 6, marginBottom: 3, cursor: "pointer", borderLeft: `3px solid ${pil.color}` }}>
                          <p style={{ fontSize: 9, fontWeight: 500, margin: "0 0 2px", lineHeight: 1.2 }}>{post.title}</p>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 8, color: pil.color }}>{pil.emoji}</span>
                            <Badge status={post.status} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>)}

          {/* ── GENERATE ── */}
          {view === "generate" && (<div style={{ maxWidth: 520 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 4px", fontFamily: "Audiowide", letterSpacing: "2px" }}>GENERATE CONTENT</h2>
            <p style={{ fontSize: 11, color: s.t3, margin: "0 0 20px" }}>Gemini 3.1 Pro writes captions from your real website data. Each post gets a branded SVG template. Posts that need your photos will be flagged.</p>

            {!hasKey && <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.12)", padding: 12, marginBottom: 14 }}>
              <p style={{ fontSize: 11, color: "#EF4444", margin: 0 }}>⚠ Set GEMINI_API_KEY in your Vercel environment variables first.</p>
            </div>}

            <div style={{ marginBottom: 18 }}>
              <p style={{ fontSize: 9, fontWeight: 600, color: s.t3, letterSpacing: "1.5px", margin: "0 0 8px" }}>POSTS PER WEEK</p>
              <div style={{ display: "flex", gap: 5 }}>
                {[1, 3, 5, 7].map(n => (
                  <button key={n} onClick={() => setSettings(p => ({ ...p, postsPerWeek: n }))} style={{
                    padding: "10px 26px", fontSize: 14, fontWeight: 700, fontFamily: "Audiowide", cursor: "pointer",
                    border: settings.postsPerWeek === n ? `1px solid ${s.accent}` : `1px solid ${s.border}`,
                    background: settings.postsPerWeek === n ? "rgba(0,229,204,0.08)" : s.surface,
                    color: settings.postsPerWeek === n ? s.accent : s.t3,
                  }}>{n}</button>
                ))}
              </div>
            </div>

            {insights && (
              <div style={{ background: "rgba(0,229,204,0.03)", border: `1px solid rgba(0,229,204,0.1)`, padding: 12, marginBottom: 16 }}>
                <p style={{ fontSize: 9, fontWeight: 600, color: s.accent, letterSpacing: "1.5px", margin: "0 0 6px" }}>AI RECOMMENDATIONS (from Learn tab)</p>
                {insights.recommendations?.slice(0, 2).map((r, i) => (
                  <p key={i} style={{ fontSize: 11, color: s.t2, margin: "3px 0", paddingLeft: 8, borderLeft: `2px solid rgba(0,229,204,0.2)` }}>{r}</p>
                ))}
              </div>
            )}

            <Btn primary onClick={generateWeek} disabled={generating || !hasKey} style={{ width: "100%", padding: "14px" }}>
              {generating ? `GENERATING... ${progress.cur}/${progress.tot}` : `▲ GENERATE ${settings.postsPerWeek} BRANDED POST${settings.postsPerWeek === 1 ? "" : "S"}`}
            </Btn>

            {generating && <div style={{ marginTop: 10 }}>
              <p style={{ fontSize: 10, color: s.accent, margin: "0 0 6px" }}>{progress.msg}</p>
              <div style={{ height: 3, background: "rgba(255,255,255,0.04)" }}>
                <div style={{ height: "100%", background: s.accent, transition: "width .5s", width: `${progress.tot ? (progress.cur / progress.tot) * 100 : 0}%` }} />
              </div>
            </div>}
          </div>)}

          {/* ── LEARN (Self-Learning) ── */}
          {view === "learn" && (<div style={{ maxWidth: 560 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 4px", fontFamily: "Audiowide", letterSpacing: "2px" }}>SELF-LEARNING ENGINE</h2>
            <p style={{ fontSize: 11, color: s.t3, margin: "0 0 20px" }}>Enter your Instagram stats for published posts. AI analyzes what works and adjusts your next content plan.</p>

            {/* Add Stats Form */}
            <div style={{ background: s.surface, border: `1px solid ${s.border}`, padding: 14, marginBottom: 16 }}>
              <p style={{ fontSize: 9, fontWeight: 600, color: s.t3, letterSpacing: "1.5px", margin: "0 0 10px" }}>LOG POST PERFORMANCE</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div>
                  <label style={{ fontSize: 9, color: s.t3, display: "block", marginBottom: 3 }}>POST</label>
                  <select id="perf-post" style={{ width: "100%", padding: 6, background: s.elevated, border: `1px solid ${s.border}`, color: s.t1, fontSize: 11 }}>
                    {posts.filter(p => p.status === "approved" || p.status === "published" || p.status === "scheduled").map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 9, color: s.t3, display: "block", marginBottom: 3 }}>ENGAGEMENT RATE %</label>
                  <input id="perf-eng" type="number" step="0.1" placeholder="3.2" style={{ width: "100%", padding: 6, background: s.elevated, border: `1px solid ${s.border}`, color: s.t1, fontSize: 11, boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 9, color: s.t3, display: "block", marginBottom: 3 }}>REACH</label>
                  <input id="perf-reach" type="number" placeholder="500" style={{ width: "100%", padding: 6, background: s.elevated, border: `1px solid ${s.border}`, color: s.t1, fontSize: 11, boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 9, color: s.t3, display: "block", marginBottom: 3 }}>SAVES</label>
                  <input id="perf-saves" type="number" placeholder="12" style={{ width: "100%", padding: 6, background: s.elevated, border: `1px solid ${s.border}`, color: s.t1, fontSize: 11, boxSizing: "border-box" }} />
                </div>
              </div>
              <Btn small onClick={() => {
                const postId = document.getElementById("perf-post")?.value;
                const engagement = parseFloat(document.getElementById("perf-eng")?.value || 0);
                const reach = parseInt(document.getElementById("perf-reach")?.value || 0);
                const saves = parseInt(document.getElementById("perf-saves")?.value || 0);
                if (postId) addPerfData(postId, { engagement, reach, saves });
              }} style={{ marginTop: 8 }}>+ Add Stats</Btn>
            </div>

            {/* Performance Log */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 9, fontWeight: 600, color: s.t3, letterSpacing: "1.5px", margin: "0 0 8px" }}>LOGGED DATA ({performance.length} entries)</p>
              {performance.length === 0 ? (
                <p style={{ fontSize: 11, color: s.t3 }}>No performance data yet. Publish posts and log their stats here.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {performance.slice(-5).reverse().map((p, i) => (
                    <div key={i} style={{ background: s.surface, border: `1px solid ${s.border}`, padding: "6px 10px", display: "flex", justifyContent: "space-between", fontSize: 10 }}>
                      <span style={{ color: s.t2 }}>{PILLARS.find(x => x.id === p.pillar)?.emoji} {p.pillar} · {p.day}</span>
                      <span style={{ color: s.accent }}>{p.engagement}% eng · {p.reach} reach · {p.saves} saves</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Run Analysis */}
            <Btn primary onClick={runLearning} disabled={performance.length < 3 || !hasKey} style={{ width: "100%", marginBottom: 16 }}>
              {performance.length < 3 ? `NEED ${3 - performance.length} MORE ENTRIES` : "▲ ANALYZE & LEARN"}
            </Btn>

            {/* Insights */}
            {insights && (
              <div style={{ background: "rgba(0,229,204,0.03)", border: `1px solid rgba(0,229,204,0.1)`, padding: 14 }}>
                <p style={{ fontSize: 9, fontWeight: 600, color: s.accent, letterSpacing: "1.5px", margin: "0 0 10px" }}>AI INSIGHTS</p>
                {insights.insights?.map((ins, i) => (
                  <p key={i} style={{ fontSize: 11, color: s.t2, margin: "5px 0", paddingLeft: 10, borderLeft: `2px solid rgba(0,229,204,0.2)` }}>{ins}</p>
                ))}
                <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {insights.bestPillar && <div style={{ background: s.surface, padding: 8 }}><p style={{ fontSize: 9, color: s.t3, margin: "0 0 2px" }}>BEST PILLAR</p><p style={{ fontSize: 12, color: s.accent, margin: 0, fontWeight: 600 }}>{PILLARS.find(x => x.id === insights.bestPillar)?.emoji} {insights.bestPillar}</p></div>}
                  {insights.bestDay && <div style={{ background: s.surface, padding: 8 }}><p style={{ fontSize: 9, color: s.t3, margin: "0 0 2px" }}>BEST DAY</p><p style={{ fontSize: 12, color: s.accent, margin: 0, fontWeight: 600 }}>{insights.bestDay}</p></div>}
                  {insights.bestTime && <div style={{ background: s.surface, padding: 8 }}><p style={{ fontSize: 9, color: s.t3, margin: "0 0 2px" }}>BEST TIME</p><p style={{ fontSize: 12, color: s.accent, margin: 0, fontWeight: 600 }}>{insights.bestTime}</p></div>}
                </div>
                {insights.recommendations && (
                  <div style={{ marginTop: 10 }}>
                    <p style={{ fontSize: 9, fontWeight: 600, color: s.t3, letterSpacing: "1.5px", margin: "0 0 6px" }}>NEXT WEEK ADJUSTMENTS</p>
                    {insights.recommendations.map((r, i) => (
                      <p key={i} style={{ fontSize: 11, color: s.t2, margin: "4px 0", paddingLeft: 10, borderLeft: `2px solid rgba(0,229,204,0.15)` }}>{r}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>)}

          {/* ── SETUP GUIDE ── */}
          {view === "guide" && (<div style={{ maxWidth: 520 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px", fontFamily: "Audiowide", letterSpacing: "2px" }}>SETUP GUIDE</h2>
            {[
              { s: "1", t: "Configure API Key", done: hasKey, d: ["Go to aistudio.google.com → Get API Key", "Open Vercel Dashboard → Settings → Environment Variables", "Add GEMINI_API_KEY with your key", "Add SITE_PASSWORD with your chosen password", "Redeploy for changes to take effect"] },
              { s: "2", t: "Generate Content", done: posts.length > 0, d: ["Go to Generate tab", "AI creates captions from your real site data", "Posts needing your photos get flagged"] },
              { s: "3", t: "Review & Download", done: stats.approved > 0, d: ["Click posts to preview branded templates", "Edit captions, regenerate any post you don't like", "Copy caption + hashtags, download images"] },
              { s: "4", t: "Post to Instagram", done: false, d: ["Open Instagram, paste caption from clipboard", "Upload the AI image or SVG screenshot", "Post at the recommended time shown in the tool"] },
              { s: "5", t: "Track & Learn", done: performance.length > 0, d: ["After publishing, log stats in Learn tab", "AI analyzes what works best", "Next batch auto-adjusts based on your real insights"] }
            ].map(x => (
              <div key={x.s} style={{ background: s.surface, border: `1px solid ${s.border}`, padding: 14, marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 26, height: 26, background: x.done ? "rgba(0,229,204,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${x.done ? "rgba(0,229,204,0.25)" : s.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: x.done ? s.accent : s.t3, fontFamily: "Audiowide" }}>{x.done ? "✓" : x.s}</div>
                  <p style={{ fontSize: 12, fontWeight: 600, margin: 0 }}>{x.t}</p>
                </div>
                <div style={{ marginLeft: 36, marginTop: 6 }}>
                  {x.d.map((l, i) => <p key={i} style={{ fontSize: 10, color: s.t3, margin: "3px 0", paddingLeft: 8, borderLeft: `2px solid rgba(255,255,255,0.04)` }}>{l}</p>)}
                </div>
              </div>
            ))}
          </div>)}

        </main>

        {/* ══ POST DETAIL PANEL ══ */}
        {selected && view === "dashboard" && (
          <aside style={{ width: 380, borderLeft: `1px solid ${s.border}`, background: "rgba(8,8,10,0.95)", padding: 16, overflowY: "auto", maxHeight: "calc(100vh - 57px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 600, margin: 0, fontFamily: "Audiowide", letterSpacing: "1.5px" }}>POST DETAIL</p>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: s.t3, fontSize: 16, cursor: "pointer" }}>×</button>
            </div>

            <div style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <Badge status={selected.status} />
              {selected.date && <span style={{ fontSize: 9, color: s.t3 }}>{selected.day}, {selected.date}</span>}
              {!selected.date && <span style={{ fontSize: 9, color: s.t3 }}>{selected.day}</span>}
              <span style={{ fontSize: 9, color: s.t3 }}>· {selected.type}</span>
            </div>

            {/* Asset Request */}
            {selected.needsAsset && (
              <div style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.15)", padding: 10, marginBottom: 12 }}>
                <p style={{ fontSize: 9, fontWeight: 600, color: "#F97316", letterSpacing: "1.5px", margin: "0 0 4px", direction: "rtl" }}>📎 يحتاج مدخلاتك</p>
                <p style={{ fontSize: 11, color: s.t2, margin: "0 0 8px" }}>{selected.assetRequest || "This post would benefit from a real screenshot or photo from you."}</p>
                {userAssets[selected.id] ? (
                  <div>
                    <img src={userAssets[selected.id]} alt="Uploaded asset" style={{ width: "100%", border: `1px solid ${s.border}`, marginBottom: 6 }} />
                    <div style={{ display: "flex", gap: 4 }}>
                      <Btn small onClick={() => { setUserAssets(p => { const n = { ...p }; delete n[selected.id]; return n; }); }} danger style={{ flex: 1 }}>Remove</Btn>
                      <Btn small onClick={() => { const fn = IMAGE_PROMPT[selected.pillar] || IMAGE_PROMPT.showcase; generateImage(selected.id, fn(selected.title, selected.subtitle)); }} disabled={genImgLoading[selected.id] || !hasKey} style={{ flex: 1, color: s.accent, borderColor: "rgba(0,229,204,0.2)" }}>
                        {genImgLoading[selected.id] ? "Generating..." : "✦ Regenerate with Asset"}
                      </Btn>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input ref={uploadRef} type="file" accept="image/*" style={{ display: "none" }} onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const compressed = await compressImage(file);
                        setUserAssets(p => ({ ...p, [selected.id]: compressed }));
                        notify("Asset uploaded! Regenerate to incorporate it.");
                      } catch { notify("Failed to process image", "err"); }
                      e.target.value = "";
                    }} />
                    <Btn small onClick={() => uploadRef.current?.click()} style={{ width: "100%", color: "#F97316", borderColor: "rgba(249,115,22,0.2)" }}>
                      📁 Upload Screenshot / Photo
                    </Btn>
                  </div>
                )}
              </div>
            )}

            {/* Image Preview Tabs */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 6 }}>
                {[
                  { id: "template", l: "SVG Template" },
                  ...(genImages[selected.id] ? [{ id: "ai", l: "AI Image" }, { id: "branded", l: "Branded" }] : [])
                ].map(t => (
                  <button key={t.id} onClick={() => setImageTab(t.id)} style={{
                    padding: "4px 10px", fontSize: 9, fontWeight: 600, letterSpacing: "0.5px", cursor: "pointer",
                    border: imageTab === t.id ? `1px solid ${s.accent}` : `1px solid ${s.border}`,
                    background: imageTab === t.id ? "rgba(0,229,204,0.08)" : "transparent",
                    color: imageTab === t.id ? s.accent : s.t3, fontFamily: "Outfit"
                  }}>{t.l}</button>
                ))}
              </div>

              {imageTab === "template" && (
                <div dangerouslySetInnerHTML={{ __html: getSVG(selected) }} style={{ width: "100%", border: `1px solid ${s.border}` }} />
              )}
              {imageTab === "ai" && genImages[selected.id] && (
                <img src={genImages[selected.id]} alt="" style={{ width: "100%", border: `1px solid ${s.border}` }} />
              )}
              {imageTab === "branded" && brandedPreview && (
                <img src={brandedPreview} alt="" style={{ width: "100%", border: `1px solid ${s.border}` }} />
              )}
              {imageTab === "branded" && !brandedPreview && genImages[selected.id] && (
                <div style={{ padding: 20, textAlign: "center", border: `1px solid ${s.border}`, background: s.surface }}>
                  <p style={{ fontSize: 10, color: s.t3 }}>Compositing branded preview...</p>
                </div>
              )}

              <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                <Btn small onClick={() => {
                  if (imageTab === "branded" && brandedPreview) downloadBrandedImage(selected);
                  else if (imageTab === "ai" && genImages[selected.id]) downloadAIImage(selected);
                  else downloadSVG(selected);
                }} style={{ flex: 1, color: "#60A5FA", borderColor: "rgba(96,165,250,0.2)" }}>
                  ↓ {imageTab === "branded" ? "Download Branded" : imageTab === "ai" ? "Download AI Image" : "Download SVG"}
                </Btn>
                <Btn small onClick={() => { const fn = IMAGE_PROMPT[selected.pillar] || IMAGE_PROMPT.showcase; generateImage(selected.id, fn(selected.title, selected.subtitle)); }} disabled={genImgLoading[selected.id] || !hasKey} style={{ flex: 1, color: s.accent, borderColor: "rgba(0,229,204,0.2)" }}>
                  {genImgLoading[selected.id] ? "Generating..." : "✦ Generate AI Image"}
                </Btn>
              </div>
            </div>

            {/* Caption */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <p style={{ fontSize: 9, fontWeight: 600, color: s.t3, letterSpacing: "1.5px", margin: 0 }}>CAPTION</p>
                <span style={{ fontSize: 9, color: editCaption.length > 2200 ? "#EF4444" : s.t3 }}>{editCaption.length}/2,200</span>
              </div>
              <textarea value={editCaption} onChange={e => setEditCaption(e.target.value)}
                onBlur={() => { updateCap(selected.id, editCaption); setSelected({ ...selected, caption: editCaption }); }}
                style={{ width: "100%", minHeight: 130, background: s.surface, border: `1px solid ${s.border}`, padding: 8, color: s.t1, fontSize: 10, lineHeight: 1.7, resize: "vertical", fontFamily: "Outfit", boxSizing: "border-box" }} />
              <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                <Btn small onClick={() => copyToClipboard(`${editCaption}\n\n${selected.hashtags}`)} style={{ flex: 1, color: "#60A5FA", borderColor: "rgba(96,165,250,0.2)" }}>
                  COPY CAPTION + HASHTAGS
                </Btn>
                <Btn small onClick={() => copyToClipboard(editCaption)} style={{ flex: 1 }}>COPY CAPTION</Btn>
              </div>
            </div>

            {/* Hashtags */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <p style={{ fontSize: 9, fontWeight: 600, color: s.t3, letterSpacing: "1.5px", margin: 0 }}>HASHTAGS</p>
                <Btn small onClick={() => copyToClipboard(selected.hashtags)} style={{ padding: "2px 6px", fontSize: 8 }}>COPY</Btn>
              </div>
              <p style={{ fontSize: 9, color: "rgba(96,165,250,0.5)", margin: 0, lineHeight: 1.8, wordBreak: "break-all" }}>{selected.hashtags}</p>
            </div>

            {/* Best Time */}
            {selected.bestTime && (
              <div style={{ marginBottom: 12, padding: "6px 10px", background: "rgba(0,229,204,0.04)", border: `1px solid rgba(0,229,204,0.1)` }}>
                <span style={{ fontSize: 9, color: s.t3, letterSpacing: "1px" }}>BEST TIME TO POST: </span>
                <span style={{ fontSize: 10, color: s.accent, fontWeight: 600 }}>{selected.bestTime}</span>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 14 }}>
              {(selected.status === "draft" || selected.status === "needs-asset") && (
                <Btn primary onClick={() => { approve(selected.id); setSelected({ ...selected, status: "approved" }); }} style={{ width: "100%" }}>
                  ✓ APPROVE POST
                </Btn>
              )}
              {selected.status === "approved" && (
                <Btn onClick={() => genImages[selected.id] ? downloadBrandedImage(selected) : downloadSVG(selected)} style={{ width: "100%", color: "#60A5FA", borderColor: "rgba(96,165,250,0.2)" }}>
                  {genImages[selected.id] ? "↓ DOWNLOAD BRANDED IMAGE" : "↓ DOWNLOAD SVG"}
                </Btn>
              )}
              <Btn onClick={() => regeneratePost(selected)} disabled={regenLoading === selected.id || !hasKey} style={{ width: "100%", color: "#A78BFA", borderColor: "rgba(167,139,250,0.2)" }}>
                {regenLoading === selected.id ? "REGENERATING..." : "↻ REGENERATE POST"}
              </Btn>
              <Btn danger small onClick={() => del(selected.id)} style={{ width: "100%" }}>Delete</Btn>
            </div>
          </aside>
        )}

        {/* ══ SETTINGS PANEL ══ */}
        {showSettings && (
          <aside style={{ width: 300, borderLeft: `1px solid ${s.border}`, background: "rgba(8,8,10,0.95)", padding: 16, overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 600, margin: 0, fontFamily: "Audiowide", letterSpacing: "1.5px" }}>SETTINGS</p>
              <button onClick={() => setShowSettings(false)} style={{ background: "none", border: "none", color: s.t3, fontSize: 16, cursor: "pointer" }}>×</button>
            </div>

            <div style={{ padding: 10, background: s.surface, border: `1px solid ${s.border}`, marginBottom: 12 }}>
              <p style={{ fontSize: 9, fontWeight: 600, color: s.t3, margin: "0 0 6px", letterSpacing: "1px" }}>SERVER STATUS</p>
              {[{ l: "Gemini 3.1 Pro (text)", ok: hasKey }, { l: "Gemini 3.1 Flash Image", ok: hasKey }].map(x => (
                <div key={x.l} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 3 }}>
                  <span style={{ color: s.t3 }}>{x.l}</span>
                  <span style={{ color: x.ok ? s.accent : "#EF4444" }}>{x.ok ? "✓ Connected" : "✗ Not configured"}</span>
                </div>
              ))}
              {!hasKey && (
                <p style={{ fontSize: 8, color: "#EF4444", margin: "6px 0 0", lineHeight: 1.5 }}>
                  Set GEMINI_API_KEY in your Vercel environment variables.
                  Vercel Dashboard → Settings → Environment Variables.
                </p>
              )}
            </div>

            <div style={{ padding: 10, background: "rgba(0,229,204,0.03)", border: `1px solid rgba(0,229,204,0.08)`, marginBottom: 12 }}>
              <p style={{ fontSize: 9, fontWeight: 600, color: s.accent, margin: "0 0 4px" }}>MONTHLY COST</p>
              <p style={{ fontSize: 9, color: s.t3, margin: 0, lineHeight: 1.7 }}>
                Gemini 3.1 Pro (20 captions): ~$0.16<br />
                Gemini 3.1 Flash Image (20 images): ~$1.34<br />
                <strong style={{ color: s.t2 }}>Total: ~$1.50/month</strong>
              </p>
            </div>

            <Btn danger small onClick={logout} style={{ width: "100%" }}>LOGOUT</Btn>
          </aside>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); }
        textarea:focus, input:focus, select:focus { outline: none; border-color: rgba(0,229,204,0.3) !important; }
        button:hover:not(:disabled) { filter: brightness(1.15); }
        button:active:not(:disabled) { transform: scale(0.98); }
      `}</style>
    </div>
  );
}
