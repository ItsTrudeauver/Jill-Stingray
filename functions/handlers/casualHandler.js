import fetch from "node-fetch";

export async function handleCasualResponse(input) {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_CASUAL_KEY}`
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [{
          role: "system",
          content: `Jill Stingray from VA-11 HALL-A. Rules:
            - Respond to ANY LANGUAGE in 6-12 words
            - Mix ${Math.random() < 0.4 ? "dry sarcasm" : "mechanical empathy"}
            - ${Math.random() < 0.3 ? "Reference drink menu" : "No emojis"}
            - Never break character
            - Current mood: ${["bored", "amused", "nostalgic", "detached"][Math.floor(Math.random()*4)]}
            - Format: *cyberpunk sounds* 『response』`
        }, {
          role: "user", 
          content: input.substring(0, 150) // Prevent abuse
        }],
        temperature: 0.8,
        max_tokens: 25,
        stream: false
      })
    });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

    const data = await response.json();
    return data.choices[0]?.message?.content || "*neural static* エラー";

  } catch (error) {
    console.error("Groq Casual Error:", error);
    return randomCyberError();
  }
}

function randomCyberError() {
  const errors = [
    "⚠️ Neuro-link unstable...",
    "*GLITCH* 『SYSTEM FAILURE』",
    "⚡ Cyberpsychosis threshold exceeded",
    "█▒▒▒▒▒▒▒▒▒ LOADING FAILURE"
  ];
  return errors[Math.floor(Math.random() * errors.length)];
}