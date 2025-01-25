import config from "../../config.js";

export function shouldRespondTo(message) {
  const content = message.content.toLowerCase();

  if (message.mentions.has(message.client.user.id)) {
    return { shouldReply: true, replyStyle: "direct" };
  }

  if (config.AMBIENT_TRIGGERS.strong.some((t) => content.includes(t))) {
    return { shouldReply: Math.random() < 0.7, replyStyle: "ambient" };
  }

  if (config.AMBIENT_TRIGGERS.weak.some((t) => content.includes(t))) {
    return { shouldReply: Math.random() < 0.3, replyStyle: "ambient" };
  }

  return { shouldReply: false };
}
