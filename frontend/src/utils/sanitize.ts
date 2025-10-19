const CHAR_MAP: Record<string, string> = {
  "“": '"',
  "”": '"',
  "„": '"',
  "‟": '"',
  "’": "'",
  "‘": "'",
  "‚": "'",
  "‛": "'",
  "–": "-",
  "—": "-",
  "―": "-",
  "…": "...",
};

const SAFE_PATTERN = /[^\x09\x0a\x0d\x20-\x7e]/g;

function replaceSmartPunctuation(input: string): string {
  return input.replace(/[\u2018-\u201F\u2026\u2014\u2013\u2015]/g, (match) => CHAR_MAP[match] ?? "");
}

export function sanitizeInput(raw: string): string {
  if (!raw) return "";

  let value = raw.normalize("NFKC");
  value = replaceSmartPunctuation(value);
  value = value.replace(SAFE_PATTERN, "");
  value = value.replace(/\s+/g, " ");
  return value.trim();
}
