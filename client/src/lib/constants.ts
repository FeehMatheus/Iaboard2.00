export const DEFAULT_AI_SETTINGS = {
  temperature: 0.7,
  maxTokens: 1000,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
};

export const PRESET_ENDPOINTS = [
  { url: 'http://localhost:1234', name: 'LM Studio' },
  { url: 'http://localhost:11434', name: 'Ollama' },
  { url: 'http://localhost:8080', name: 'llama.cpp' },
];

export const SUPPORTED_MODELS = [
  'gpt-4o',
  'gpt-4o-mini',
  'claude-3-5-sonnet-20241022',
  'claude-3-sonnet-20240229',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
];

export const MODEL_PROVIDERS = {
  'gpt-4o': 'openai',
  'gpt-4o-mini': 'openai',
  'claude-3-5-sonnet-20241022': 'anthropic',
  'claude-3-sonnet-20240229': 'anthropic',
  'gemini-1.5-pro': 'google',
  'gemini-1.5-flash': 'google',
} as const;

export const BRAND_CONFIG = {
  name: "IA Board by Filippe",
  tagline: "Sistema Avançado de Canvas Inteligente",
  version: "Supremo v3.0",
  color: "#00d9ff",
  downloadUrl: "https://github.com/FeehMatheus/ia-board/releases"
};

export type AISettings = typeof DEFAULT_AI_SETTINGS;