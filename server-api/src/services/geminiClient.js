import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

let client = null;
let modelCache = new Map();

export function isGeminiEnabled() {
  return Boolean(API_KEY && API_KEY.trim().length > 0);
}

export function getModel(role = 'default') {
  if (!isGeminiEnabled()) {
    throw new Error('GEMINI_API_KEY chưa được cấu hình');
  }
  if (!client) client = new GoogleGenerativeAI(API_KEY);
  if (!modelCache.has(role)) {
    modelCache.set(role, client.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: { temperature: 0.5, topP: 0.9, maxOutputTokens: 1024 },
    }));
  }
  return modelCache.get(role);
}

export const GEMINI_MODEL_NAME = MODEL_NAME;
