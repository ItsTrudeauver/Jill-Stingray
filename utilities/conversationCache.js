// utilities/conversationCache.js
const MAX_HISTORY = 50; // Remember last 4 messages
const TTL = 20 * 60 * 1000; // 20 minutes

const messageCache = new Map();

export function addToCache(userId, content) { // Renamed parameter for clarity
  if (!messageCache.has(userId)) {
    messageCache.set(userId, []);
  }

  const history = messageCache.get(userId);
  history.push({ content, timestamp: Date.now() });

  // Trim old messages
  while (
    history.length > MAX_HISTORY ||
    Date.now() - history[0].timestamp > TTL
  ) {
    history.shift();
  }
}

export function getRecentContext(userId) {
  return messageCache.get(userId)?.map((m) => m.content) || [];
}

// Cleanup old conversations every hour
setInterval(() => {
  messageCache.forEach((history, userId) => {
    messageCache.set(
      userId,
      history.filter((m) => Date.now() - m.timestamp <= TTL),
    );
  });
}, 3600000);
