import db from '../db.js';
import { calculateTier } from './tier.js';

export async function applyLoyaltyForOrder({ customer_id, total, options = {} }) {
  if (!customer_id || !total || total <= 0) return null;

  const { skipVisit = false, pointsMultiplier = 1 } = options;
  const customer = await db.prepare('SELECT * FROM customers WHERE id = ?').get(customer_id);
  if (!customer) return null;

  const newTotalSpent = (customer.total_spent || 0) + total;
  const newVisitCount = (customer.visit_count || 0) + (skipVisit ? 0 : 1);
  const earnedPoints = Math.floor(total / 1000) * pointsMultiplier;
  const newPoints = (customer.points || 0) + earnedPoints;
  const tier = calculateTier(newTotalSpent);

  await db.prepare(`
    UPDATE customers SET total_spent = ?, visit_count = ?, points = ?, tier = ? WHERE id = ?
  `).run(newTotalSpent, newVisitCount, newPoints, tier, customer_id);

  return {
    customer_id,
    newTotalSpent,
    newVisitCount,
    earnedPoints,
    newPoints,
    tier,
    previousTier: customer.tier,
  };
}