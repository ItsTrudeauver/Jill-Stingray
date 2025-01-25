import config from "../../config.js";

export function formatCyberpunk(text) {
  return text
    .replace(/["“”]/g, "")
    .replace(/\n/g, " ")
    .replace(/\byou're?\b/gi, "ya")
    .replace(/ing\b/g, "in'")
    .replace(/\.{3,}/g, "…")
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, config.MAX_RESPONSE_LENGTH);
}

// Alias for backwards compatibility
export const applyJillMannerisms = formatCyberpunk;