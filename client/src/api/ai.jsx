import client from './client';

export const getAIInsights = () => client.get('/ai/insights');

// Admin chat (requires auth) — uses Gemini with admin tools
export const chatAdminAI = (payload) => {
  const body = typeof payload === 'string' ? { message: payload } : payload || {};
  return client.post('/admin/ai/chat', body);
};

// Legacy admin chat (kept for backward compatibility, calls public endpoint with auth)
export const chatWithAI = (message) => client.post('/ai/chat', { message });

// Public chat for landing page (no auth)
export const chatPublic = (payload) => {
  const body = typeof payload === 'string' ? { message: payload } : payload || {};
  return fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  })
    .then(async r => {
      try {
        return await r.json();
      } catch {
        return { success: false, error: 'Phản hồi không hợp lệ từ máy chủ' };
      }
    });
};
