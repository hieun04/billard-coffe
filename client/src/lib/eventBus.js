const listeners = new Map();

export function on(event, fn) {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event).add(fn);
  return () => off(event, fn);
}

export function off(event, fn) {
  if (listeners.has(event)) listeners.get(event).delete(fn);
}

export function emit(event, payload) {
  const set = listeners.get(event);
  if (!set) return;
  set.forEach(fn => {
    try { fn(payload); } catch (e) { console.error(`[eventBus] handler for "${event}" threw:`, e); }
  });
}

export const Events = {
  PAYMENT_COMPLETED: 'payment:completed',
  TABLE_CHANGED: 'table:changed',
  ORDER_UPDATED: 'order:updated',
  CUSTOMER_UPDATED: 'customer:updated',
  VOUCHER_USED: 'voucher:used',
};
