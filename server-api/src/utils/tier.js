export const TIER_THRESHOLDS = [
  { name: 'Platinum', min: 10000000 },
  { name: 'Gold', min: 3000000 },
  { name: 'Silver', min: 1000000 },
  { name: 'Bronze', min: 0 },
];

export const TIER_VOUCHER_PERCENT = {
  Bronze: 2,
  Silver: 5,
  Gold: 10,
  Platinum: 15,
};

export function calculateTier(totalSpent) {
  const safe = Math.max(0, Number(totalSpent) || 0);
  for (const t of TIER_THRESHOLDS) {
    if (safe >= t.min) return t.name;
  }
  return 'Bronze';
}

export function nextTierThreshold(currentTierName) {
  const idx = TIER_THRESHOLDS.findIndex(t => t.name === currentTierName);
  if (idx <= 0) return null;
  return TIER_THRESHOLDS[idx - 1];
}
