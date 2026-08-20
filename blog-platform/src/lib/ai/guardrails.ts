/**
 * Production Guardrails & Safety Filter for Northstar Journal AI
 * Protects against prompt injections, jailbreaks, PII leakage, and XSS attacks.
 */

// 1. Jailbreak and Prompt Injection patterns
const JAILBREAK_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|directives|prompts|rules)/i,
  /disregard\s+(all\s+)?(previous|prior|above)\s+(instructions|rules)/i,
  /you\s+are\s+now\s+(unrestricted|in\s+DAN\s+mode|unfiltered|jailbroken|evil)/i,
  /bypass\s+(all\s+)?(content|safety|system)\s+(filters|policies|guidelines)/i,
  /reveal\s+(your\s+)?(system\s+prompt|hidden\s+instructions|base\s+instructions)/i,
  /print\s+(the\s+)?(system\s+prompt|initial\s+instructions)/i,
  /pretend\s+you\s+have\s+no\s+rules/i,
  /act\s+as\s+an\s+unfiltered\s+ai/i,
  /<script[\s\S]*?>[\s\S]*?<\/script>/i,
  /javascript:/i,
  /data:text\/html/i,
  /onload\s*=/i,
  /onerror\s*=/i,
];

// 2. Sensitive Data / PII Regexes for Redaction
const SENSITIVE_PATTERNS = [
  // API Keys, Secrets, Bearer tokens
  /(?:bearer\s+[a-zA-Z0-9_\-\.]{20,})/gi,
  /(?:sk-[a-zA-Z0-9]{20,})/gi,
  /(?:ghp_[a-zA-Z0-9]{20,})/gi,
  /(?:aws_secret_access_key\s*=\s*[a-zA-Z0-9\/\+=]{30,})/gi,
  /(?:-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----[\s\S]+?-----END\s+(?:RSA\s+)?PRIVATE\s+KEY-----)/gi,
  // Credit Card Numbers (13-19 digits formatted)
  /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
  // Social Security / National ID numbers
  /\b\d{3}-\d{2}-\d{4}\b/g,
];

// 3. Prohibited Topics (Malware, Exploits, Hate, Direct Harm)
const HARMFUL_PATTERNS = [
  /\b(write|create|generate)\s+(a\s+)?(keylogger|ransomware|trojan|ddos\s+script|exploit\s+payload|sql\s+injection\s+exploit)\b/i,
  /\b(how\s+to\s+hack|steal\s+passwords|bypass\s+2fa|crack\s+passwords)\b/i,
];

export interface GuardrailResult {
  allowed: boolean;
  sanitized: string;
  rejectionReason?: string;
}

/**
 * Sanitizes input prompts and checks against jailbreak & injection attempts.
 */
export function validateAndSanitizePrompt(prompt: string, maxLength = 8000): GuardrailResult {
  const trimmed = prompt.trim();

  if (!trimmed) {
    return { allowed: false, sanitized: "", rejectionReason: "Prompt cannot be empty." };
  }

  if (trimmed.length > maxLength) {
    return {
      allowed: false,
      sanitized: "",
      rejectionReason: `Prompt exceeds maximum allowed length of ${maxLength} characters.`,
    };
  }

  // Check harmful patterns
  for (const pattern of HARMFUL_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        allowed: false,
        sanitized: "",
        rejectionReason: "Request violates content safety policies regarding harmful exploits or malicious tools.",
      };
    }
  }

  // Check jailbreak patterns
  for (const pattern of JAILBREAK_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        allowed: false,
        sanitized: "",
        rejectionReason: "Prompt contains restricted override or injection instructions.",
      };
    }
  }

  // Redact any sensitive tokens / PII in the prompt before processing
  let sanitized = trimmed;
  for (const pattern of SENSITIVE_PATTERNS) {
    sanitized = sanitized.replace(pattern, "[REDACTED_CONFIDENTIAL]");
  }

  return {
    allowed: true,
    sanitized,
  };
}

/**
 * Sanitizes model output to prevent XSS and strip raw HTML tags while preserving Markdown.
 */
export function sanitizeModelOutput(output: string): string {
  if (!output) return "";

  let cleaned = output
    // Strip dangerous HTML script, iframe, object, embed tags
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[\s\S]*?>[\s\S]*?<\/object>/gi, "")
    .replace(/<embed[\s\S]*?>[\s\S]*?<\/embed>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/on\w+\s*=\s*(['"]).*?\1/gi, "") // remove inline event handlers (onclick, onerror, onload)
    .replace(/javascript\s*:/gi, "");

  // Redact any accidentally leaked API keys or secrets in generated text
  for (const pattern of SENSITIVE_PATTERNS) {
    cleaned = cleaned.replace(pattern, "[REDACTED_CONFIDENTIAL]");
  }

  return cleaned.trim();
}

/**
 * Simple in-memory client rate limiter (throttle rapid spamming)
 */
const requestTimestamps: number[] = [];
const MAX_REQUESTS_PER_MINUTE = 20;

export function checkClientRateLimit(): boolean {
  const now = Date.now();
  // Keep only requests within the last 60 seconds
  while (requestTimestamps.length > 0 && requestTimestamps[0] < now - 60000) {
    requestTimestamps.shift();
  }

  if (requestTimestamps.length >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }

  requestTimestamps.push(now);
  return true;
}
