export type AskIntent =
  | "courses"
  | "careers"
  | "funding"
  | "opportunities"
  | "guides"
  | "skills"
  | "institutions"
  | "match"
  | "general";

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "can",
  "do",
  "for",
  "how",
  "i",
  "in",
  "is",
  "me",
  "my",
  "of",
  "the",
  "to",
  "what",
  "with",
]);

function hasAny(text: string, needles: string[]) {
  return needles.some((needle) => text.includes(needle));
}

export function detectAskIntent(query: string): AskIntent {
  const text = query.trim().toLowerCase();

  if (hasAny(text, ["qualify", "my marks", "my subjects", "aps score", "check my options"])) {
    return "match";
  }
  if (hasAny(text, ["fund", "nsfas", "bursary", "scholarship", "pay", "fees"])) return "funding";
  if (hasAny(text, ["career", "job", "work", "salary", "earn", "do with"])) return "careers";
  if (hasAny(text, ["apply", "deadline", "open", "internship", "learnership", "apprenticeship"])) {
    return "opportunities";
  }
  if (hasAny(text, ["fake", "aps", "saqa", "dhet", "glossary", "explain", "avoid"])) return "guides";
  if (hasAny(text, ["skill", "certificate", "learn today", "short skill"])) return "skills";
  if (hasAny(text, ["course", "study", "online", "tvet", "nqf", "diploma", "degree", "higher certificate"])) {
    return "courses";
  }
  if (hasAny(text, ["institution", "university", "college", "campus", "registered"])) {
    return "institutions";
  }
  return "general";
}

export function askTokens(query: string) {
  return query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}
