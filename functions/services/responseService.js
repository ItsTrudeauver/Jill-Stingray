// responseService.js
import fetch from "node-fetch";
import config from "../../config.js";
import { applyJillMannerisms } from "./formattingService.js";
import { getJillPrompt, adjustMood } from "./personalityService.js";
import { getRecentContext, addToCache } from "../../utilities/conversationCache.js";

const RUDE_KEYWORDS = ["idiot", "slow", "sucks", "lame", "boring"];
const POSITIVE_KEYWORDS = ["thanks", "cool", "awesome", "love", "perfect"];

function detectMoodImpact(input) {
  const lowerInput = input.toLowerCase();
  if (RUDE_KEYWORDS.some((kw) => lowerInput.includes(kw))) return -15;
  if (POSITIVE_KEYWORDS.some((kw) => lowerInput.includes(kw))) return +10;
  return 0;
}

export async function generateJillResponse(userId, input, style) {
  try {
    // Conversation memory handling
    addToCache(userId, input);
    const context = getRecentContext(userId);

    // Mood system integration
    const moodDelta = detectMoodImpact(input);
    if (moodDelta !== 0) adjustMood(moodDelta);

    // Build message history with context
    const messages = [
      {
        role: "system",
        content: getJillPrompt(style, input, context)
      },
      ...context.slice(-3).map(content => ({ 
        role: "user", 
        content: content 
      })),
      { role: "user", content: input }
    ];

    // API call with safety measures
    const response = await fetch(config.API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_KEY}`,
      },
      body: JSON.stringify({
        model: config.LLM_MODEL,
        messages: messages,
        temperature: style === "direct" 
          ? config.DIRECT_RESPONSE_TEMP 
          : config.AMBIENT_RESPONSE_TEMP,
        max_tokens: Math.min(config.MAX_RESPONSE_LENGTH, 1024), // Hard cap
      }),
    });

    // Validate HTTP response
    if (!response.ok) {
      throw new Error(`API Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Validate response structure
    const responseContent = data?.choices?.[0]?.message?.content;
    if (!responseContent || typeof responseContent !== "string") {
      console.error("Malformed API Response:", JSON.stringify(data, null, 2));
      return config.ERROR_RESPONSES[
        Math.floor(Math.random() * config.ERROR_RESPONSES.length)
      ];
    }

    // Sanitize and validate final output
    const sanitized = applyJillMannerisms(responseContent);
    return isValidResponse(sanitized) 
      ? sanitized
      : "Neural interference... Try again・";

  } catch (error) {
    console.error("Cyber Interface Failure:", error.message);
    return config.ERROR_RESPONSES[
      Math.floor(Math.random() * config.ERROR_RESPONSES.length)
    ] || "System reboot required・";
  }
}

function isValidResponse(text) {
  return (
    typeof text === "string" &&
    text.length > 1 &&
    !/(as an ai|language model|sorry|apologize)/i.test(text)
  );
}