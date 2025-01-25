const casualCooldowns = new Map();

export function checkCasualCooldown(userId) {
  const cooldownEnd = casualCooldowns.get(userId);
  return cooldownEnd && Date.now() < cooldownEnd;
}

export function setCasualCooldown(userId) {
  const minutes = 20 + Math.floor(Math.random() * 40); // 20-60 minutes
  casualCooldowns.set(userId, Date.now() + minutes * 60_000);
}