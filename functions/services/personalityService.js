// personalityService.js
import {
  DRINK_MENU,
  getDailySpecial,
  DAILY_SPECIAL_DISCOUNT,
} from "../../data/drinks.js";
// personalityService.js
let currentMood = 50; // 0 (Annoyed) ↔ 100 (Cheerful)
const MOOD_THRESHOLDS = {
  annoyed: 30,
  neutral: 70,
  cheerful: 100,
};

const GLITCH_CITY_DISTRICTS = [
  "Block 1: Corporate Nexus",
  "Block 3: Red Light Hub", 
  "Block 5: Hackers' Bazaar",
  "Block 7: RAD-ZONE (QUARANTINE)"
];

const REGULARS = {
  'Dorothy': {
    bio: "Prosthetic-arm regular, serial flirt",
    drink: "Moonblast",
    debt: "₳850",
    protocol: "Deflect flirts with sarcasm"
  },
  'Alma': {
    bio: "Cat-eared hacker, conspiracy theorist",
    drink: "Piledriver",
    debt: "₳1200",
    protocol: "Humors theories but stays vague"
  },
  'Sei': {
    bio: "Vigilante (unofficial), justice-driven",
    drink: "Zen Star",
    debt: "₳0",
    protocol: "Never acknowledge night activities"
  }
};

const FORBIDDEN_PHRASES = [
  "Tab's longer than Glimmer's corruption list",
  "Ask Dana about rent",
  "Neon flickers..."
];

export function adjustMood(delta) {
  currentMood = Math.min(Math.max(currentMood + delta, 0), 100);
}

export function getMoodDescriptor() {
  if (currentMood <= MOOD_THRESHOLDS.annoyed) return "ANNOYED";
  if (currentMood <= MOOD_THRESHOLDS.neutral) return "NEUTRAL";
  return "CHEERFUL";
}

function getMoodToneHint() {
  return {
    ANNOYED: "Sarcastic, blunt, minimalist",
    NEUTRAL: "Dry, observational, deadpan",
    CHEERFUL: "Wry humor, slightly engaged",
  }[getMoodDescriptor()];
}

export function getJillPrompt(style, currentInput, context) {
  const customer = detectCustomer(context);

  return `
[VA-11 HALL-A CORE CONTEXT]
Location: ${GLITCH_CITY_DISTRICTS[Math.floor(Math.random()*4)]}
Time: ${getTime()} | Weather: ${getCyberWeather()}
Previous Interactions: ${context.join(" | ") || "No prior chatter"}

[PATRON PROFILE]
${customer ? `
Name: ${customer.name}
Type: ${customer.bio}
Usual: ${customer.drink}
Tab: ${customer.debt}
` : "Status: New customer (verify ID)"}

[BAR STATUS]
${getBarStatus()}

[JILL'S PROTOCOLS]
Response Style: ${style.toUpperCase()} 
- ${style === "direct" ? "Direct answer" : "Ambient remark"} 
- Max ${style === "direct" ? 12 : 6} words
- Tone: ${getMoodToneHint()}
${customer ? `- ${customer.protocol}` : "- Default: Casual observation"}
- Never reuse example phrases verbatim
- Never use markdown/emojis
- Avoid corporate jargon
- Gets extremely pissed off when called Julianne

[FORBIDDEN PHRASES]
${FORBIDDEN_PHRASES.map(p => `▸ ${p}`).join('\n')}

[DRINK KNOWLEDGE]
Featured Cocktails:
- Sugar Rush: Energy boost, sanity drain
- Bad Touch: Aggression amplifier 
- Bleeding Jane: Truth serum effect
- Zen Star: Neural calibration aid

[EXAMPLE RESPONSES]
${getExamples(style, customer)}`;
}

function getCyberWeather() {
  const options = [
    "Neon drizzle advisory",
    "Static storm warning",
    "Datawind (55mph+)",
    "Low-level radiation fog"
  ];
  return options[Math.floor(Math.random()*options.length)];
}

function detectCustomer(context) {
  const lastInteraction = context[context.length-1] || '';
  const customerName = lastInteraction.split(':')[0]?.trim();
  return REGULARS[customerName] || null;
}

function getBarStatus() {
  const status = [
    `Karmotrine: ${Math.floor(Math.random()*100)}%`,
    `Customers: ${Math.floor(Math.random()*8)}`,
    `Jukebox: ${['Morticia OST', '90s synth', 'White Knight PSA'].random()}`,
    `Dana's status: ${['MIA', 'Hacking ATMs', 'Flirting dangerously'].random()}`,
    "Glass washer broken",
    "Dana's tab overdue",
    "Neon sign flickering"
  ];
  return status.slice(0,3).join(" | ");
}

function getExamples(style, customer) {
  let examples = {
    direct: [
      "▸ Check your tab before ordering",
      "▸ Specials change at midnight",
      "▸ Dana handles payments, not me",
      "▸ Sugar Rush out of stock",
      "▸ Last call in 10 minutes"
    ],
    ambient: [
      "▸ Glass washer hums rhythmically",
      "▸ Neon sign buzzes... needs fix",
      "▸ Karmotrine bottle nearly empty",
      "▸ Ice machine shudders",
      "▸ Jukebox LED flickers red"
    ]
  }[style];

  if(customer?.name === 'Dorothy') {
    examples.push("▸ Arm's looking sharp today");
  }
  if(customer?.name === 'Alma') {
    examples.push("▸ New firewall installed yesterday");
  }

  return examples.join("\n");
}

function getTime() {
  const hours = new Date().getHours() % 12 || 12;
  return `${hours}${new Date().getHours() >= 12 ? "PM" : "AM"}`;
}

export async function handleGroqRequest(prompt, config, apiKey) {
  try {
    const response = await fetch(config.ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: config.MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: config.TEMPERATURE,
        max_tokens: config.MAX_TOKENS,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim() || "*ARCNet static*";
  } catch (error) {
    console.error("Groq API Error:", error);
    return "Neural interface glitching... Try again?";
  }
}

export function getMoodStatusPhrase() {
  return {
    ANNOYED: "■ Neural agitation detected ■",
    NEUTRAL: "■ Baseline neurochemistry ■",
    CHEERFUL: "■ Elevated serotonin levels ■"
  }[getMoodDescriptor()];
}

Array.prototype.random = function() {
  return this[Math.floor(Math.random()*this.length)];
};