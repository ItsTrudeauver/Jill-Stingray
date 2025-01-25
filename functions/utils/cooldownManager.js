const cooldowns = new Map();

export function isOnCooldown(userId) {
  return cooldowns.has(userId) && Date.now() - cooldowns.get(userId) < 1500;
}

export function handleCooldown(userId) {
  cooldowns.set(userId, Date.now());
  setTimeout(() => cooldowns.delete(userId), 1500);
}
