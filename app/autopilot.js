"use client";
import { useState, useEffect, useCallback, useRef } from "react";

// ════════════════════════════════════════════════════════════════
// APEX AUTOPILOT V3 — Final Production Build
// Brain: Gemini 3.1 Flash-Lite | Images: Gemini 3.1 Flash Image
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

// ─── IMAGE DIMENSIONS (4:5 for Feed/Carousel = 23% more screen real estate) ───
const getImageDims = (postType) => {
  if (postType === "Reel" || postType === "Story") return { w: 1080, h: 1080, label: "square 1:1, 1080x1080px" };
  return { w: 1080, h: 1350, label: "portrait 4:5 aspect ratio, 1080x1350px — this taller format dominates the Instagram feed with 23% more screen area" };
};
let _nextGridIndex;

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

// ─── AI PROMPT (V2 — Algorithm-Aware Instagram Strategy) ───
const CAPTION_PROMPT = (pillar, type, insightsData) => `You are the senior content strategist for APEX (@apexagency.xo), a premium Shopify theme brand that sells a high-converting dark-mode Shopify theme. Every caption you write must feel like it was crafted by a $5K/month social media agency.

${BRAND.knowledge}

BRAND VOICE: ${BRAND.voice}

Create 1 Instagram ${type} for the "${pillar.name}" content pillar: ${pillar.desc}
${insightsData ? `
PERFORMANCE INTELLIGENCE — Apply these data-driven insights to maximize this post:
- Top-performing pillar: ${insightsData.bestPillar || "unknown"}
- Highest-engagement day: ${insightsData.bestDay || "unknown"}
- Optimal posting time: ${insightsData.bestTime || "unknown"}
- Patterns discovered: ${(insightsData.insights || []).join(". ")}
- Strategic recommendations: ${(insightsData.recommendations || []).join(". ")}
Use these insights to outperform all previous posts.
` : ""}
SCROLL-STOPPING HOOK (first line is EVERYTHING — 80% of engagement is decided here):
Pick ONE of these 8 proven patterns. Rotate across posts — never repeat the same pattern in a week:
1. SHOCKING STAT: Lead with a specific, visceral number ("40% of your visitors leave in 3 seconds — and your theme is why")
2. MYTH BUSTER: Destroy a common belief ("Your Shopify theme is NOT just design. It is your #1 sales employee")
3. PROVOCATIVE QUESTION: Impossible to scroll past ("Why does your $50K inventory sit behind a $0 template?")
4. UNPOPULAR OPINION: Take a confident stance ("Free Shopify themes are the most expensive mistake you will ever make")
5. BEFORE/AFTER CONTRAST: Paint the gap ("Last month: 1.2% conversion. This month: 4.8%. Same products. One change.")
6. CURIOSITY GAP: Create irresistible intrigue ("The #1 thing luxury Shopify brands do that you are ignoring...")
7. SOCIAL PROOF LEAD: Open with undeniable proof ("Another APEX store owner just crossed $10K/month. Here is what changed.")
8. DIRECT CHALLENGE: Call them out respectfully ("You are losing $2,000/month because of your free theme. Let me show you.")

CAPTION ARCHITECTURE (follow this exact 5-part structure):
PART 1 — HOOK (line 1): The scroll-stopping opener. This single line determines everything.
PART 2 — TENSION (2-3 sentences): Expand on the problem or opportunity. Make them FEEL the pain of their current situation or the desire for the transformation.
PART 3 — INSIGHT (3-5 sentences): Deliver genuine value. Be SPECIFIC — reference real APEX features (Interactive Product Quiz, Smart Cart Drawer, Countdown Timers, 20+ sections, sub-2s loads, 90+ PageSpeed). Use real stats from the brand knowledge. This section should be so valuable they want to save the post.
PART 4 — BRIDGE (1-2 sentences): Connect the insight naturally to APEX as the solution. Not forced, not salesy — just obvious.
PART 5 — CTA (final line): Strong call-to-action. Rotate between these: "Save this for later", "Share with a store owner who needs this", "DM us THEME for a free preview", "Link in bio — see it live", "Drop a fire emoji if this hit different", "Tag a Shopify entrepreneur below".

FORMATTING RULES:
- Use \\n\\n between every section (Instagram renders these as real paragraph breaks)
- 3-5 strategic emojis — each adds meaning or visual rhythm, never decorative spam
- Caption length: 150-220 words. Punchy paragraphs of 1-3 sentences max
- Write in second person ("you", "your") — speak directly to ONE ambitious store owner
- Vary sentence rhythm: short punchy lines mixed with one longer descriptive sentence
- The insight section should make them think "I need to save this post"

HASHTAG STRATEGY — Generate 20-25 hashtags in 3 tiers:
Tier 1 (5-7 high-volume discovery): #Shopify #Ecommerce #OnlineStore #ShopifyStore #SmallBusiness #Entrepreneur #OnlineBusiness
Tier 2 (8-10 niche targeting): #ShopifyTheme #ShopifyDesign #ConversionOptimization #ShopifyTips #EcommerceTips #StoreDesign #ShopifyExperts #EcommerceGrowth #ShopifyPartner
Tier 3 (5-7 brand + micro): #APEXTheme #PremiumShopify #DarkModeDesign #ShopifyConversion #HighConvertingTheme #ShopifyPremium
ALWAYS include #APEXTheme. NEVER repeat the exact same hashtag set — shuffle and vary every time.

IMAGE HEADLINE RULES:
- "title" = the bold headline that will overlay the image. Max 8 words. Every word must earn its place. This should work as a standalone scroll-stopper even without the caption.
- "subtitle" = supporting context line. Max 15 words. Adds clarity to the headline.

Return ONLY valid JSON:
{"title":"Scroll-stopping image headline — max 8 words, make every word count","subtitle":"Supporting context line — max 15 words","caption":"Full caption using the 5-part architecture above. Use \\n\\n for paragraph breaks.","hashtags":"All hashtags in a single string, space-separated","bestTime":"Recommended posting time with timezone, e.g. 10:00 AM EST","visualDirection":"One sentence describing the specific mood, subject, and angle the accompanying image should convey to perfectly match this caption. Be concrete — e.g. a glowing device showing a fast-loading store, not just premium theme.","needsAsset":false,"assetRequest":""}${type === "Carousel" ? `

CAROUSEL SLIDES — because this is a Carousel post, also return:
"carouselSlides":["Slide 1 hook headline (max 8 words)","Slide 2 value point headline","Slide 3 deeper insight headline","Slide 4 CTA headline with urgency"]
Each slide headline should tell a progressive story: Hook → Problem → Solution → CTA. Make each slide compelling enough to keep swiping.` : ""}

CRITICAL RULES FOR needsAsset:
- Set needsAsset=true ONLY when the post is genuinely IMPOSSIBLE without a real photo that AI cannot generate — e.g., a screenshot of an actual customer's live store URL, or a real-world product photo.
- AI CAN generate: device mockups, workspaces, abstract visuals, charts, geometric shapes, gradients, product photography concepts. These NEVER need needsAsset=true.
- NEVER request video, footage, screen recordings, animations, or clips — this tool handles static images only. For Reels and Stories, a static thumbnail is all that is needed.
- Default is needsAsset=false. Only flip to true in genuinely rare cases.`;

const LEARN_PROMPT = (perfData) => `You are a senior Instagram analytics strategist analyzing performance data for APEX (@apexagency.xo), a premium Shopify theme brand.

Performance data from recent posts:
${JSON.stringify(perfData, null, 2)}

Analyze engagement patterns, reach trends, save rates, and pillar performance. Look for:
- Which content pillars drive the highest engagement rate AND saves (saves = algorithmic gold on Instagram)
- Day-of-week and time-of-day patterns
- Post type performance (Feed vs Carousel vs Reel vs Story)
- What content themes resonate most with the Shopify store owner audience
- Engagement-to-reach ratio trends (are we reaching new people or just existing followers?)

Return ONLY valid JSON:
{"insights":["insight1 — be specific with data","insight2","insight3","insight4"],"bestPillar":"pillar_id","bestDay":"day_name","bestTime":"time with timezone","recommendations":["actionable_rec1","actionable_rec2","actionable_rec3"],"adjustments":{"increasePillars":["pillar_id"],"decreasePillars":["pillar_id"],"bestPostTypes":["type"]}}`;

// ─── PILLAR IMAGE PROMPTS (V2 — Instagram-Optimized) ───
// Strategy: Each pillar has 3 visual variations selected by title hash.
// This ensures feed variety (no two posts look the same) while keeping regeneration deterministic.
// Engineered for: (1) 150px thumbnail clarity, (2) 0.3s scroll-stop, (3) 7:1+ contrast,
// (4) single focal point, (5) Instagram 1:1 safe zones, (6) contextual relevance to post topic.
const BRAND_LAYOUT = " CRITICAL LAYOUT RULE: The top 120px and bottom 100px of the image must remain very dark and uncluttered (no key visual elements there) — brand text and logos overlay these zones in post-production. Keep ALL primary focal points and visual interest within the central 860px vertical band. Do NOT place any text, typography, watermarks, or logos anywhere in the image.";
const pickVariation = (title, count) => {
  if (_nextGridIndex !== undefined) return _nextGridIndex % count;
  let hash = 0;
  for (let i = 0; i < (title || "").length; i++) hash = ((hash << 5) - hash + title.charCodeAt(i)) | 0;
  return Math.abs(hash) % count;
};

const IMAGE_PROMPT = {
  showcase: (title, sub) => {
    const topic = `The scene should relate to: "${title || 'Premium Shopify Theme'}".`;
    const variations = [
      // V1: MacBook + iPhone showing a real dark-mode Shopify store
      `Professional product photography for Instagram, square 1:1. A MacBook Pro and iPhone 15 Pro placed on a clean matte dark desk, both displaying a beautiful dark-mode Shopify fashion store — dark charcoal background, clean product grid showing clothing/accessories with large high-quality product photos, teal (#00E5CC) "Add to Cart" buttons, elegant sans-serif typography, generous whitespace. The screens should look like a real premium online store, not abstract UI. Natural soft studio lighting from the left, subtle warm fill from the right. A small succulent plant and a coffee cup sit nearby. Background is a clean dark wall, slightly out of focus. The overall feel is professional, clean, aspirational — like a real brand photoshoot. ${topic} Style: commercial product photography, natural and realistic. No neon effects, no sci-fi elements. No readable text, no watermarks.${BRAND_LAYOUT}`,

      // V2: Close-up of beautiful Shopify store on screen
      `Realistic editorial photography for Instagram, square 1:1. Close-up of a large desktop monitor showing a stunning premium Shopify store — dark theme with charcoal/black background, beautiful hero section with a lifestyle fashion photo, clean navigation bar, product cards with elegant hover states in teal (#00E5CC). The store looks real and shoppable — showing actual product categories like clothing, beauty, or home decor. Shallow depth of field (f/2.8), the screen is sharp while the desk edges blur softly. Soft natural light from a window, warm and inviting. A few tasteful desk accessories visible: a wireless mouse, a small notebook. The room feels like a real designer's workspace, not a sci-fi lab. ${topic} Mood: professional, aspirational, "I want my store to look like this." No neon glow effects. No readable text, no watermarks.${BRAND_LAYOUT}`,

      // V3: Mobile-first — hand holding phone with beautiful store
      `Lifestyle photography for Instagram, square 1:1. A hand holding an iPhone displaying a gorgeous mobile Shopify store — dark theme, beautiful product detail page showing a premium product with a large hero image, teal (#00E5CC) "Buy Now" button, clean price display, elegant product description layout. The mobile design looks polished and professional. Background is softly blurred — a clean modern workspace or cafe environment with warm neutral tones. Natural daylight, soft and flattering. The composition feels authentic and aspirational, like a real entrepreneur checking their store. ${topic} Style: authentic lifestyle photography, warm and inviting. No sci-fi, no neon, no abstract elements. No readable text, no watermarks.${BRAND_LAYOUT}`,
    ];
    return variations[pickVariation(title, variations.length)];
  },

  beforeafter: (title, sub) => {
    const topic = `The transformation relates to: "${title || 'Store Transformation'}".`;
    const variations = [
      // V1: Clean side-by-side laptop screens
      `Clean comparison photography for Instagram, square 1:1. Two laptop screens side by side on a dark desk. LEFT LAPTOP: shows a generic, boring Shopify store — plain white background, small product images crammed together, basic blue default buttons, cluttered navigation, amateur layout that looks like every other free theme. The left side has flat, dull lighting. RIGHT LAPTOP: shows the same store transformed with a premium dark theme — rich dark background, large beautiful product photography, teal (#00E5CC) accent buttons, elegant spacing, immersive product layouts that look like a luxury brand. The right side has warm, inviting studio lighting that makes it glow. A subtle teal accent light reflects on the desk near the right laptop. The contrast should be immediately obvious — cheap vs premium, generic vs stunning. ${topic} Style: realistic product comparison photography. No neon effects, no lightning bolts, no sci-fi. No readable text, no watermarks.${BRAND_LAYOUT}`,

      // V2: Phone mockup transformation — split screen
      `Professional comparison visual for Instagram, square 1:1. A clean vertical split down the middle. LEFT HALF: a mobile phone screen showing a generic white-background Shopify store — small product thumbnails, basic layout, default blue links, looks dated and cluttered, washed-out product photos, the kind of store you'd immediately bounce from. Desaturated, flat appearance. RIGHT HALF: the same phone showing a premium dark-mode store — sleek charcoal background, large bold product images, teal (#00E5CC) call-to-action buttons, clean cart drawer preview, beautiful product cards with hover effects. The right side looks 10x more professional. Background: clean dark surface, subtle gradient. A thin clean line divides the two halves. The comparison tells the story instantly. ${topic} Style: clean marketing comparison, professional and realistic. No abstract art, no neon glow. No readable text, no watermarks.${BRAND_LAYOUT}`,

      // V3: Desktop transformation — before/after overlay
      `Dramatic before-after reveal for Instagram, square 1:1. A single large desktop monitor on a clean dark desk. The screen is split vertically — left side shows a generic, plain white Shopify store with default styling, basic product grid, small images, no personality. Right side of the same screen shows the premium dark-mode transformation — rich blacks, stunning product hero images, teal (#00E5CC) accents, elegant typography, luxury feel throughout. A clean vertical divider line separates the two halves on screen. The monitor sits in a professional studio setting with soft overhead lighting. A wireless keyboard and mouse are placed neatly in front. The message is clear: same store, dramatically different experience. ${topic} Style: product demonstration photography, commercial quality. No sci-fi elements. No readable text, no watermarks.${BRAND_LAYOUT}`,
    ];
    return variations[pickVariation(title, variations.length)];
  },

  tips: (title, sub) => {
    const topic = `The tip relates to: "${title || 'Shopify Conversion Tip'}".`;
    const variations = [
      // V1: Clean flat lay with Shopify store on screen + tip props
      `Clean flat lay photography for Instagram, square 1:1. Overhead shot of a dark matte desk with: a tablet showing a premium dark-mode Shopify store with teal (#00E5CC) accents, a notebook with a pen, a cup of coffee, and a few small e-commerce related props (a small product box, shipping envelope, or branded packaging). Items arranged with intentional spacing and clean composition. Soft overhead studio lighting, warm tone. The overall feel is "business tips from a successful store owner." Clean, organized, professional. ${topic} Style: editorial flat lay, lifestyle brand photography. Natural and warm, no sci-fi, no neon effects. No readable text, no watermarks.${BRAND_LAYOUT}`,

      // V2: Focused screen showing a specific Shopify feature
      `Product detail photography for Instagram, square 1:1. Close-up of a laptop screen showing a specific Shopify store feature — a beautiful smart cart drawer sliding out from the right, showing product thumbnails, upsell suggestions, and a teal (#00E5CC) checkout button against a dark theme. The cart drawer design looks premium and functional — clean typography, elegant product cards, smooth dark UI. Shallow depth of field, screen sharp, laptop edges soft. A hand with a wireless mouse nearby suggests someone actively using the feature. Clean desk, soft ambient lighting, professional workspace. ${topic} Style: software product photography, realistic and professional. No abstract graphics, no neon. No readable text, no watermarks.${BRAND_LAYOUT}`,

      // V3: Clean workspace with analytics visible
      `Professional workspace photography for Instagram, square 1:1. A monitor showing a Shopify analytics dashboard with upward-trending graphs and positive metrics — dark theme UI with teal (#00E5CC) chart lines and accent colors. Next to the monitor, a second smaller screen or tablet shows the front of the Shopify store looking beautiful in dark mode. The workspace is clean and organized — dark desk, minimal accessories, a plant, good lighting. Natural soft window light mixed with warm desk lamp. The scene communicates "data-driven success" without being abstract. ${topic} Style: real workspace photography, editorial quality. Warm, professional, grounded. No sci-fi, no abstract art. No readable text, no watermarks.${BRAND_LAYOUT}`,
    ];
    return variations[pickVariation(title, variations.length)];
  },

  proof: (title, sub) => {
    const topic = `The success relates to: "${title || 'Customer Results'}".`;
    const variations = [
      // V1: Shopify store on screen with visible success indicators
      `Aspirational success photography for Instagram, square 1:1. A laptop on a clean modern desk showing a beautiful dark-mode Shopify store with teal (#00E5CC) accents — the store looks polished, premium, and clearly successful. Next to the laptop: a smartphone showing a notification or order confirmation screen. Small celebratory details scattered naturally — maybe a "thank you for your order" card, premium packaging materials, or a small champagne glass. Clean, bright workspace with warm natural lighting. The scene tells the story of a thriving online business. ${topic} Style: lifestyle commercial photography, aspirational but authentic. No abstract graphics, no neon effects. No readable text, no watermarks.${BRAND_LAYOUT}`,

      // V2: Multiple devices showing store success
      `Multi-device product photography for Instagram, square 1:1. Three devices arranged on a dark marble or matte black surface — a laptop, tablet, and phone — all showing different pages of the same premium dark-mode Shopify store with teal (#00E5CC) accents. The laptop shows the homepage with a stunning hero section, the tablet shows a product collection page, the phone shows a checkout flow. All screens demonstrate a cohesive, premium brand experience. Soft studio lighting from above, clean reflections on the surface. The arrangement communicates consistency and professionalism across all devices. ${topic} Style: commercial tech photography, Apple product shot energy but for Shopify. No neon, no abstract effects. No readable text, no watermarks.${BRAND_LAYOUT}`,

      // V3: Real-feeling order fulfillment scene
      `E-commerce success scene for Instagram, square 1:1. A clean workspace where an entrepreneur is packing orders — premium dark branded packaging boxes, tissue paper, a laptop open in the background showing a Shopify admin dashboard with a dark theme and teal (#00E5CC) accents showing recent orders. The scene feels real and aspirational — this is what a successful Shopify business looks like day-to-day. Warm natural lighting, clean organized space, premium packaging materials. Small branded stickers and thank-you cards visible. ${topic} Style: authentic lifestyle photography, documentary feel with commercial polish. No sci-fi, no abstract elements. No readable text, no watermarks.${BRAND_LAYOUT}`,
    ];
    return variations[pickVariation(title, variations.length)];
  },

  bts: (title, sub) => {
    const topic = `The behind-the-scenes work relates to: "${title || 'Building the Theme'}".`;
    const variations = [
      // V1: Developer workspace — realistic coding scene
      `Realistic developer workspace for Instagram, square 1:1. A clean modern desk with a large monitor showing a code editor — dark theme with syntax highlighting in teal (#00E5CC), purple, and warm amber tones. The code is not readable but looks like real HTML/CSS/Liquid (Shopify's template language). Next to the code editor, a browser window shows a Shopify store preview in dark mode with teal accents. A mechanical keyboard and quality mouse on the desk. Soft ambient lighting — a warm desk lamp and cool monitor glow creating natural contrast. A coffee mug and small plant add warmth. ${topic} Style: authentic workspace photography, editorial quality. Realistic and professional, like a day-in-the-life feature. No sci-fi effects, no abstract code rain. No readable text, no watermarks.${BRAND_LAYOUT}`,

      // V2: Design process — Figma/design tool on screen
      `Creative workspace photography for Instagram, square 1:1. A large monitor showing a design tool interface with a Shopify theme being designed — dark UI with component layouts, color swatches featuring teal (#00E5CC) and dark tones, and what looks like a premium e-commerce page in progress. A drawing tablet or sketchbook with rough wireframe sketches sits next to the keyboard. The workspace feels creative but organized — clean dark desk, good lighting, a few design books stacked nearby. Natural studio lighting, warm and professional. This shows the craft behind building a premium theme. ${topic} Style: creative professional photography, realistic behind-the-scenes. No neon, no abstract art. No readable text, no watermarks.${BRAND_LAYOUT}`,

      // V3: Testing on multiple devices
      `Quality assurance scene for Instagram, square 1:1. A developer's desk with multiple devices lined up for testing — a laptop, a tablet propped up, and two phones of different sizes. All devices show the same premium dark-mode Shopify store page with teal (#00E5CC) accents, each displaying how the responsive design adapts to different screen sizes. The scene looks like real QA testing in progress. A notepad with checkmarks visible nearby. Clean, organized workspace with soft studio lighting. The message: meticulous attention to detail on every screen size. ${topic} Style: authentic behind-the-scenes photography. Professional and real, not staged-looking. No neon effects. No readable text, no watermarks.${BRAND_LAYOUT}`,
    ];
    return variations[pickVariation(title, variations.length)];
  },

  education: (title, sub) => {
    const topic = `The educational concept is: "${title || 'E-commerce Knowledge'}".`;
    const variations = [
      // V1: Clean infographic-style — store on screen with learning context
      `Educational photography for Instagram, square 1:1. A clean desk setup with a monitor showing a premium dark-mode Shopify store with teal (#00E5CC) accents. In the foreground, an open notebook or planner with clean handwritten-style notes and simple diagrams about e-commerce strategy (not readable, just visual texture). A cup of coffee, a highlighter, and a few sticky notes add color. The scene feels like a focused study/learning session about e-commerce. Warm, inviting natural light from a window. Clean and organized but lived-in. ${topic} Style: educational lifestyle photography, warm and approachable. Think "learn from an expert" vibes. No abstract graphics, no sci-fi. No readable text, no watermarks.${BRAND_LAYOUT}`,

      // V2: Whiteboard/planning scene with store visible
      `Strategy planning photography for Instagram, square 1:1. A workspace with a laptop showing a beautiful dark-mode Shopify store with teal (#00E5CC) accents. Behind or beside it, a small whiteboard or paper with simple flowcharts and diagrams about conversion funnels or store optimization (visual shapes only, not readable). The scene communicates "strategic thinking about your online store." Clean desk, professional but approachable environment. Warm mixed lighting — natural light with a soft desk lamp. A few e-commerce related books stacked nearby. ${topic} Style: professional workspace photography, editorial and aspirational. No abstract nodes, no network visualizations. No readable text, no watermarks.${BRAND_LAYOUT}`,

      // V3: Comparison/learning — showing store features
      `Product education photography for Instagram, square 1:1. A tablet held at a comfortable angle showing a Shopify store's product page in dark mode — beautiful product imagery, clean layout, teal (#00E5CC) action buttons, elegant product details section. The background is a clean, well-lit workspace or cafe setting, softly blurred. The composition suggests someone studying and appreciating good e-commerce design. Natural warm lighting. The image should make viewers think "I want to learn how to make my store look this good." ${topic} Style: lifestyle tech photography, clean and aspirational. Warm tones, natural feel. No abstract art, no neon. No readable text, no watermarks.${BRAND_LAYOUT}`,
    ];
    return variations[pickVariation(title, variations.length)];
  },
};

// ─── BUILD IMAGE PROMPT (master wrapper — handles all 5 upgrades) ───
const buildImagePrompt = (pillarId, title, sub, postType, gridIndex, visualDirection) => {
  // Grid alternation: override variation selection for feed diversity
  _nextGridIndex = gridIndex;
  const fn = IMAGE_PROMPT[pillarId] || IMAGE_PROMPT.showcase;
  let prompt = fn(title, sub);
  _nextGridIndex = undefined;

  // 4:5 aspect ratio for feed posts and carousels
  const dims = getImageDims(postType);
  prompt = prompt.replaceAll("square 1:1", dims.label);

  // Prompt chaining: inject caption context so image matches the caption's angle
  if (visualDirection) {
    prompt = prompt.replace(
      BRAND_LAYOUT,
      ` VISUAL CONTEXT — the caption for this post focuses on: "${visualDirection}". Ensure the image mood, subject, and energy align with this specific angle.${BRAND_LAYOUT}`
    );
  }

  return { prompt, width: dims.w, height: dims.h };
};

// ─── CAROUSEL SLIDE PROMPTS ───
const CAROUSEL_SLIDE_SVG = (slideNum, totalSlides, headline, accent) => {
  const tl = wrap(headline || "", 22);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1350" width="1080" height="1350">
<defs>
<pattern id="g" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0L0 0 0 36" fill="none" stroke="rgba(255,255,255,0.025)" stroke-width="0.5"/></pattern>
<linearGradient id="ag" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${accent}" stop-opacity="0.15"/><stop offset="100%" stop-color="${accent}" stop-opacity="0"/></linearGradient>
</defs>
<rect width="1080" height="1350" fill="#08080A"/>
<rect width="1080" height="1350" fill="url(#g)"/>
<ellipse cx="880" cy="200" rx="400" ry="300" fill="url(#ag)" opacity="0.5"/>
<rect y="0" width="1080" height="3" fill="${accent}"/>
<g transform="translate(38,28)">
<path d="M5 42 L20 8 L27 22 L20 22 L34 22 L27 8 L42 42" fill="none" stroke="${accent}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
</g>
<text x="92" y="58" font-family="'Audiowide',sans-serif" font-size="26" fill="#FFFFFF" letter-spacing="8">APEX</text>
<text x="92" y="76" font-family="'Outfit',sans-serif" font-size="9" fill="rgba(255,255,255,0.6)" letter-spacing="4">PREMIUM THEMES</text>
<text x="1032" y="58" font-family="'Outfit',sans-serif" font-size="12" fill="rgba(255,255,255,0.5)" text-anchor="end">${slideNum}/${totalSlides}</text>
<text x="540" y="400" font-family="'Audiowide',sans-serif" font-size="320" font-weight="800" fill="rgba(255,255,255,0.02)" text-anchor="middle">${String(slideNum).padStart(2, "0")}</text>
<text x="80" y="520" font-family="'Outfit',sans-serif" font-size="12" fill="${accent}" letter-spacing="3">SLIDE ${slideNum}</text>
<line x1="80" y1="545" x2="160" y2="545" stroke="${accent}" stroke-width="3"/>
${tl.map((l, i) => `<text x="80" y="${640 + i * 65}" font-family="'Audiowide',sans-serif" font-size="52" font-weight="800" fill="#FFF">${l}</text>`).join("")}
${slideNum === totalSlides ? `<rect x="80" y="${640 + tl.length * 65 + 40}" width="260" height="56" fill="${accent}"/>
<text x="210" y="${640 + tl.length * 65 + 75}" font-family="'Audiowide',sans-serif" font-size="14" font-weight="700" fill="#08080A" text-anchor="middle" letter-spacing="2">GET THE THEME &#x2192;</text>` : ""}
<rect y="1310" width="1080" height="40" fill="#101014"/>
<text x="540" y="1336" font-family="'Outfit',sans-serif" font-size="10" fill="rgba(255,255,255,0.2)" text-anchor="middle">@apexagency.xo &middot; apexagencyxo.vercel.app</text>
${Array.from({length: totalSlides}, (_, k) => `<rect x="${540 - (totalSlides * 12) + k * 24}" y="1280" width="${k === slideNum - 1 ? 20 : 8}" height="4" rx="2" fill="${k === slideNum - 1 ? accent : 'rgba(255,255,255,0.15)'}"/>`).join("\n")}
</svg>`;
};

// ─── DATE HELPERS ───
const getWeekDates = () => {
  const today = new Date();
  const monday = new Date(today);
  const dow = today.getDay(); // 0=Sun,1=Mon,...
  const offset = dow === 0 ? 1 : dow === 1 ? 0 : 8 - dow; // next Monday, or today if Monday
  monday.setDate(today.getDate() + offset);
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
  const [brandedError, setBrandedError] = useState(false);
  const [tab, setTab] = useState("all");
  const [tokenUsage, setTokenUsage] = useState(() => { try { return JSON.parse(localStorage.getItem("apex3-tokens")) || { prompt: 0, completion: 0, total: 0, calls: 0 }; } catch { return { prompt: 0, completion: 0, total: 0, calls: 0 }; } });

  const notify = useCallback((m, t = "ok") => { setToast({ m, t }); setTimeout(() => setToast(null), 3500); }, []);
  const trackTokens = useCallback((data) => {
    const u = data?.usageMetadata;
    if (!u) return;
    setTokenUsage(prev => {
      const next = {
        prompt: prev.prompt + (u.promptTokenCount || 0),
        completion: prev.completion + (u.candidatesTokenCount || 0),
        total: prev.total + (u.totalTokenCount || 0),
        calls: prev.calls + 1
      };
      try { localStorage.setItem("apex3-tokens", JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);
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
    if (!selected) { setBrandedPreview(null); setBrandedError(false); return; }
    if (genImages[selected.id]) {
      setImageTab("branded");
      setBrandedError(false);
      compositeBrandedImage(selected).then(setBrandedPreview).catch(() => { setBrandedPreview(null); setBrandedError(true); });
    } else {
      setImageTab("template");
      setBrandedPreview(null);
      setBrandedError(false);
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
        endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent",
        payload: {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.85, ...(json ? { responseMimeType: "application/json" } : {}) }
        }
      })
    });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || `Gemini ${res.status}`); }
    const d = await res.json();
    trackTokens(d);
    return d.candidates[0].content.parts[0].text;
  };

  // ─── GEMINI 3.1 FLASH IMAGE GEN ───
  const generateImage = async (postId, prompt, imageKey) => {
    const storeKey = imageKey || postId;
    setGenImgLoading(p => ({ ...p, [storeKey]: true }));
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
            generationConfig: { responseModalities: ["TEXT", "IMAGE"], temperature: 0.9 }
          }
        })
      });
      if (!res.ok) throw new Error(`Image gen failed: ${res.status}`);
      const d = await res.json();
      trackTokens(d);
      const imgPart = d.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (imgPart) {
        const dataUrl = `data:${imgPart.inlineData.mimeType};base64,${imgPart.inlineData.data}`;
        setGenImages(p => ({ ...p, [storeKey]: dataUrl }));
        notify("Image generated!");
      } else {
        notify("No image returned — try a different prompt", "err");
      }
    } catch (err) { notify(err.message, "err"); }
    finally { setGenImgLoading(p => ({ ...p, [storeKey]: false })); }
  };

  // ─── GENERATE WEEK ───
  const generateWeek = async () => {
    setGenerating(true);
    const n = settings.postsPerWeek;
    const totalSteps = n * 2;
    setProgress({ cur: 0, tot: totalSteps, msg: "Planning..." });
    const newPosts = [];
    const dates = getWeekDates();

    // Grid alternation: shuffle pillars so Instagram grid rows (3 per row) always look diverse
    const shuffledPillars = [...PILLARS];
    for (let k = shuffledPillars.length - 1; k > 0; k--) {
      const j = (Date.now() + k) % (k + 1);
      [shuffledPillars[k], shuffledPillars[j]] = [shuffledPillars[j], shuffledPillars[k]];
    }

    try {
      for (let i = 0; i < n; i++) {
        const pillar = shuffledPillars[i % shuffledPillars.length];
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
            needsAsset: false, assetRequest: "", visualDirection: "", pillar: pillar.id, type, day, date,
            status: "draft", week: weekLabel(), createdAt: new Date().toISOString()
          };
        }
        newPosts.push(post);

        // Auto-generate AI image with prompt chaining + grid alternation + 4:5 aspect ratio
        setProgress({ cur: i * 2 + 1, tot: totalSteps, msg: post.needsAsset ? `Skipping image for ${day} — needs your input first` : `Generating ${type === "Carousel" ? "carousel slide 1" : "image"} for ${day}...` });
        if (!post.needsAsset) try {
          const { prompt } = buildImagePrompt(pillar.id, post.title, post.subtitle, type, i, post.visualDirection);
          const imgParts = [{ text: prompt }];
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
                generationConfig: { responseModalities: ["TEXT", "IMAGE"], temperature: 0.9 }
              }
            })
          });
          if (imgRes.ok) {
            const imgData = await imgRes.json();
            trackTokens(imgData);
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
      const carousels = newPosts.filter(p => p.type === "Carousel" && p.carouselSlides?.length).length;
      notify(`${n} posts + images created!${needsAsset ? ` ${needsAsset} need your input.` : ""}${carousels ? ` ${carousels} carousels with slide data.` : ""}`);
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

      // Also regenerate image with prompt chaining — skip if post still needs a user asset
      if (!updated.needsAsset) {
      const { prompt: regenPrompt } = buildImagePrompt(pillar.id, parsed.title, parsed.subtitle, post.type, undefined, parsed.visualDirection);
      const regenParts = [{ text: regenPrompt }];
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
              generationConfig: { responseModalities: ["TEXT", "IMAGE"], temperature: 0.9 }
            }
          })
        });
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          trackTokens(imgData);
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

  const brandOverlay = (accent, title, subtitle, h = 1080) => {
    const tl = wrap(title || "", 28);
    const escapeSvg = (str) => (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    const botStart = h - 330;
    const titleY = h - 210;
    const footerY = h - 40;
    const footerTextY = h - 15;
    const footerLineY = h - 42;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 ${h}" width="1080" height="${h}">
<defs>
<style>
@import url('https://fonts.googleapis.com/css2?family=Audiowide&amp;family=Outfit:wght@400;600;700&amp;display=swap');
</style>
<linearGradient id="topFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#08080A" stop-opacity="0.92"/><stop offset="100%" stop-color="#08080A" stop-opacity="0"/></linearGradient>
<linearGradient id="botFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#08080A" stop-opacity="0"/><stop offset="100%" stop-color="#08080A" stop-opacity="0.95"/></linearGradient>
<pattern id="og" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0L0 0 0 36" fill="none" stroke="rgba(255,255,255,0.015)" stroke-width="0.5"/></pattern>
</defs>
<rect width="1080" height="${h}" fill="url(#og)" opacity="0.5"/>
<rect y="0" width="1080" height="220" fill="url(#topFade)"/>
<rect y="0" width="1080" height="3" fill="${accent}"/>
<g transform="translate(38,28)">
<path d="M5 42 L20 8 L27 22 L20 22 L34 22 L27 8 L42 42" fill="none" stroke="${accent}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
</g>
<text x="92" y="58" font-family="'Audiowide',sans-serif" font-size="26" fill="#FFFFFF" letter-spacing="8">APEX</text>
<text x="92" y="76" font-family="'Outfit',sans-serif" font-size="9" fill="rgba(255,255,255,0.6)" letter-spacing="4">PREMIUM THEMES</text>
<text x="1032" y="58" font-family="'Outfit',sans-serif" font-size="12" fill="rgba(255,255,255,0.5)" text-anchor="end">@apexagency.xo</text>
<rect y="${botStart}" width="1080" height="330" fill="url(#botFade)"/>
${tl.map((l, i) => `<text x="60" y="${titleY + i * 48}" font-family="'Audiowide',sans-serif" font-size="38" font-weight="800" fill="#FFFFFF" letter-spacing="1">${escapeSvg(l)}</text>`).join("")}
<text x="60" y="${titleY + tl.length * 48 + 22}" font-family="'Outfit',sans-serif" font-size="16" fill="rgba(255,255,255,0.45)">${escapeSvg((subtitle || "").slice(0, 60))}</text>
<rect y="${footerY}" width="1080" height="40" fill="#101014"/>
<g transform="translate(38,${footerY + 6})">
<path d="M3 24 L12 4 L16 13 L12 13 L20 13 L16 4 L25 24" fill="none" stroke="${accent}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
</g>
<text x="72" y="${footerTextY}" font-family="'Audiowide',sans-serif" font-size="10" fill="rgba(255,255,255,0.3)" letter-spacing="3">APEX</text>
<text x="142" y="${footerTextY}" font-family="'Outfit',sans-serif" font-size="10" fill="rgba(255,255,255,0.2)">apexagencyxo.vercel.app</text>
<text x="1032" y="${footerTextY}" font-family="'Audiowide',sans-serif" font-size="10" fill="${accent}" text-anchor="end" letter-spacing="1.5">GET THE THEME &#x2192;</text>
<line x1="38" y1="${footerLineY}" x2="170" y2="${footerLineY}" stroke="${accent}" stroke-width="2" opacity="0.3"/>
</svg>`;
  };

  const compositeBrandedImage = (post, imageKey) => new Promise((resolve, reject) => {
    const aiUrl = genImages[imageKey || post.id];
    if (!aiUrl) { reject(new Error("No AI image")); return; }
    const pillar = PILLARS.find(p => p.id === post.pillar) || PILLARS[0];

    const aiImg = new Image();
    aiImg.onload = () => {
      // Detect actual AI image dimensions — supports 1:1 and 4:5
      const w = 1080;
      const h = aiImg.height > aiImg.width ? Math.round(1080 * (aiImg.height / aiImg.width)) : 1080;
      const canvasH = Math.max(h, 1080);
      const overlaySvg = brandOverlay(pillar.color, post.title, post.subtitle, canvasH);

      const overlayImg = new Image();
      overlayImg.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = canvasH;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(aiImg, 0, 0, w, canvasH);
        ctx.drawImage(overlayImg, 0, 0, w, canvasH);
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
            <p style={{ fontSize: 9, color: s.t3, margin: 0, letterSpacing: "2px" }}>GEMINI 3.1 FLASH × FLASH IMAGE</p>
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 8 }}>
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

            {/* Token Usage */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
              {[
                { l: "API Calls", v: tokenUsage.calls.toLocaleString(), c: s.t2 },
                { l: "Prompt Tokens", v: tokenUsage.prompt.toLocaleString(), c: "#A78BFA" },
                { l: "Output Tokens", v: tokenUsage.completion.toLocaleString(), c: "#34D399" },
                { l: "Total Tokens", v: tokenUsage.total.toLocaleString(), c: "#FBBF24" }
              ].map((x, i) => (
                <div key={i} style={{ background: s.surface, border: `1px solid ${s.border}`, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontSize: 9, color: s.t3, margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>{x.l}</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: x.c, margin: 0, fontFamily: "Audiowide" }}>{x.v}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ background: "rgba(0,229,204,0.03)", border: `1px solid rgba(0,229,204,0.1)`, padding: 14, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: s.accent, margin: "0 0 2px", fontFamily: "Audiowide" }}>
                  {!hasKey ? "⚠ Set GEMINI_API_KEY in Vercel env vars" : stats.needsAsset > 0 ? `${stats.needsAsset} منشور يحتاج مدخلاتك` : "AI ready — Gemini 3.1 Flash"}
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
            <p style={{ fontSize: 11, color: s.t3, margin: "0 0 20px" }}>Gemini 3.1 Flash writes captions from your real website data. Each post gets a branded SVG template. Posts that need your photos will be flagged.</p>

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
                      <Btn small onClick={() => { const { prompt } = buildImagePrompt(selected.pillar, selected.title, selected.subtitle, selected.type, undefined, selected.visualDirection); generateImage(selected.id, prompt); }} disabled={genImgLoading[selected.id] || !hasKey} style={{ flex: 1, color: s.accent, borderColor: "rgba(0,229,204,0.2)" }}>
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
                  <p style={{ fontSize: 10, color: s.t3 }}>{brandedError ? "Failed to composite preview" : "Compositing branded preview..."}</p>
                  {brandedError && <button onClick={() => { setBrandedError(false); compositeBrandedImage(selected).then(setBrandedPreview).catch(() => { setBrandedPreview(null); setBrandedError(true); }); }} style={{ marginTop: 8, fontSize: 10, color: s.accent, background: "none", border: `1px solid ${s.accent}`, padding: "4px 12px", cursor: "pointer" }}>Retry</button>}
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
                <Btn small onClick={() => { const { prompt } = buildImagePrompt(selected.pillar, selected.title, selected.subtitle, selected.type, undefined, selected.visualDirection); generateImage(selected.id, prompt); }} disabled={genImgLoading[selected.id] || !hasKey} style={{ flex: 1, color: s.accent, borderColor: "rgba(0,229,204,0.2)" }}>
                  {genImgLoading[selected.id] ? "Generating..." : "✦ Generate AI Image"}
                </Btn>
              </div>
            </div>

            {/* Carousel Slides */}
            {selected.type === "Carousel" && selected.carouselSlides?.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 9, fontWeight: 600, color: s.t3, letterSpacing: "1.5px", margin: "0 0 6px" }}>CAROUSEL SLIDES ({selected.carouselSlides.length})</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {selected.carouselSlides.map((slide, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: 6, background: s.surface, border: `1px solid ${s.border}`, padding: "6px 10px" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: s.accent, fontFamily: "Audiowide", minWidth: 20 }}>{idx + 1}</span>
                      <span style={{ fontSize: 10, color: s.t2, flex: 1 }}>{slide}</span>
                      <Btn small onClick={() => {
                        const slideKey = `${selected.id}_slide${idx + 1}`;
                        const { prompt } = buildImagePrompt(selected.pillar, slide, selected.subtitle, selected.type, idx, selected.visualDirection);
                        generateImage(selected.id, prompt, slideKey);
                      }} disabled={genImgLoading[`${selected.id}_slide${idx + 1}`] || !hasKey} style={{ padding: "3px 8px", fontSize: 8, color: s.accent, borderColor: "rgba(0,229,204,0.2)" }}>
                        {genImgLoading[`${selected.id}_slide${idx + 1}`] ? "..." : genImages[`${selected.id}_slide${idx + 1}`] ? "REDO" : "GEN"}
                      </Btn>
                      {genImages[`${selected.id}_slide${idx + 1}`] && (
                        <Btn small onClick={() => {
                          const a = document.createElement("a"); a.href = genImages[`${selected.id}_slide${idx + 1}`];
                          a.download = `apex-${selected.pillar}-slide${idx + 1}.png`; a.click();
                        }} style={{ padding: "3px 8px", fontSize: 8, color: "#60A5FA", borderColor: "rgba(96,165,250,0.2)" }}>DL</Btn>
                      )}
                    </div>
                  ))}
                </div>
                {selected.carouselSlides.some((_, idx) => genImages[`${selected.id}_slide${idx + 1}`]) && (
                  <div style={{ display: "flex", gap: 3, marginTop: 6, overflowX: "auto" }}>
                    {selected.carouselSlides.map((_, idx) => {
                      const key = `${selected.id}_slide${idx + 1}`;
                      return genImages[key] ? (
                        <img key={idx} src={genImages[key]} alt={`Slide ${idx + 1}`} style={{ width: 80, height: 100, objectFit: "cover", border: `1px solid ${s.border}` }} />
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            )}

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
              {[{ l: "Gemini 3.1 Flash (text)", ok: hasKey }, { l: "Gemini 3.1 Flash Image", ok: hasKey }].map(x => (
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
              <p style={{ fontSize: 9, fontWeight: 600, color: s.accent, margin: "0 0 4px" }}>MONTHLY COST ESTIMATE</p>
              <p style={{ fontSize: 9, color: s.t3, margin: 0, lineHeight: 1.7 }}>
                Gemini 3.1 Flash (20 captions): ~$0.02<br />
                Gemini 3.1 Flash Image (20 images): ~$1.34<br />
                <strong style={{ color: s.t2 }}>Total: ~$1.36/month</strong>
              </p>
            </div>

            <div style={{ padding: 10, background: s.surface, border: `1px solid ${s.border}`, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <p style={{ fontSize: 9, fontWeight: 600, color: s.t3, margin: 0, letterSpacing: "1px" }}>TOKEN USAGE</p>
                <button onClick={() => { setTokenUsage({ prompt: 0, completion: 0, total: 0, calls: 0 }); try { localStorage.removeItem("apex3-tokens"); } catch {} notify("Token usage reset"); }} style={{ fontSize: 8, color: "#EF4444", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Reset</button>
              </div>
              {[
                { l: "API Calls", v: tokenUsage.calls },
                { l: "Prompt Tokens", v: tokenUsage.prompt.toLocaleString() },
                { l: "Output Tokens", v: tokenUsage.completion.toLocaleString() },
                { l: "Total Tokens", v: tokenUsage.total.toLocaleString() }
              ].map(x => (
                <div key={x.l} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 3 }}>
                  <span style={{ color: s.t3 }}>{x.l}</span>
                  <span style={{ color: s.t2 }}>{x.v}</span>
                </div>
              ))}
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
