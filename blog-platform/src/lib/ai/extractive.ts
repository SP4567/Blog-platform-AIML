/**
 * Deterministic, instant Extractive NLP Engine
 * Runs in 0ms with zero memory overhead, 100% offline, anywhere.
 */

function cleanMarkdown(text: string): string {
  return text
    .replace(/^#+\s+/gm, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/[*_~>]/g, "")
    .trim();
}

function splitSentences(text: string): string[] {
  return cleanMarkdown(text)
    .split(/(?<=[.?!])\s+(?=[A-Z0-9])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20 && s.length < 300);
}

export function extractSummaryBullets(text: string, count = 4): string[] {
  const sentences = splitSentences(text);
  if (sentences.length <= count) {
    return sentences.map((s) => `• ${s}`);
  }

  // Weight by position, length and key terms
  const scored = sentences.map((sentence, idx) => {
    let score = 0;
    // Lead sentences in paragraphs get bonus
    if (idx === 0 || idx === 1) score += 3;
    if (idx === sentences.length - 1) score += 1.5;

    // Technical / actionable indicator words
    const lower = sentence.toLowerCase();
    if (/\b(important|critical|key|architecture|ensure|performance|design|scale|pattern|result)\b/.test(lower)) {
      score += 2;
    }
    if (/\b(because|therefore|in order to|leads to|results in)\b/.test(lower)) {
      score += 1.5;
    }

    return { sentence, score, idx };
  });

  scored.sort((a, b) => b.score - a.score);
  const selected = scored.slice(0, count).sort((a, b) => a.idx - b.idx);

  return selected.map((item) => `• ${item.sentence}`);
}

export function extractExcerpt(text: string, maxChars = 220): string {
  const sentences = splitSentences(text);
  if (sentences.length === 0) {
    return cleanMarkdown(text).slice(0, maxChars);
  }

  let excerpt = sentences[0];
  if (sentences.length > 1 && excerpt.length + sentences[1].length + 1 <= maxChars) {
    excerpt += ` ${sentences[1]}`;
  }

  if (excerpt.length > maxChars) {
    excerpt = excerpt.slice(0, maxChars - 3) + "...";
  }

  return excerpt;
}

export function extractTitleSuggestions(topicOrContent: string): string[] {
  const clean = cleanMarkdown(topicOrContent).slice(0, 100);
  const firstSentence = clean.split(/[.?!]/)[0] || topicOrContent;
  const capitalized = firstSentence.charAt(0).toUpperCase() + firstSentence.slice(1);

  return [
    `1. Architecting ${capitalized}: A Production Blueprint`,
    `2. The Modern Guide to ${capitalized}`,
    `3. Scaling ${capitalized}: Patterns & Best Practices`,
    `4. Mastering ${capitalized} in High-Velocity Teams`,
  ];
}

export function answerArticleQuestion(question: string, articleContent: string): string {
  const sentences = splitSentences(articleContent);
  const qWords = question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !/^(what|when|where|which|who|whom|whose|why|how|does|is|are|the|and|for|with)$/.test(w));

  if (qWords.length === 0) {
    return "Based on the article: " + (sentences[0] || "No content found in article.");
  }

  const scored = sentences.map((sentence) => {
    const sLower = sentence.toLowerCase();
    let matches = 0;
    for (const word of qWords) {
      if (sLower.includes(word)) matches += 1;
    }
    return { sentence, matches };
  });

  scored.sort((a, b) => b.matches - a.matches);

  if (scored[0] && scored[0].matches > 0) {
    const topMatches = scored.filter((s) => s.matches > 0).slice(0, 2);
    return `According to the article: "${topMatches.map((s) => s.sentence).join(" ")}"`;
  }

  return "The article discusses this topic, but no direct match for your specific inquiry was found in the text.";
}

export function generateTemplateDraft(topic: string): string {
  const title = topic.charAt(0).toUpperCase() + topic.slice(1);
  return `## Understanding ${title}

In modern software and engineering platforms, **${topic}** plays a foundational role in delivering reliability, speed, and great user experiences.

### Key Architectural Principles
- **Modularity**: Decouple responsibilities into isolated, testable components.
- **Resilience**: Implement graceful fallback strategies when dependencies degrade.
- **Observability**: Track core performance metrics and latency distributions.

### Practical Implementation
When applying ${topic} in production, prioritize clarity over premature optimization:

\`\`\`typescript
export interface SystemConfig {
  enabled: boolean;
  timeoutMs: number;
  retries: number;
}

export function configureService(options: Partial<SystemConfig> = {}): SystemConfig {
  return {
    enabled: true,
    timeoutMs: 5000,
    retries: 3,
    ...options,
  };
}
\`\`\`

### Summary & Takeaways
Building with ${topic} requires continuous measurement and deliberate system design. Establish automated tests early to maintain high delivery velocity.`;
}
