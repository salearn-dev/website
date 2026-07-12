export const MAX_LEARNER_DOCUMENT_BYTES = 5 * 1024 * 1024;
export const LEARNER_DOCUMENT_MIME_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
]);

export function validateLearnerDocument(file: Pick<File, "name" | "size" | "type">) {
  if (!LEARNER_DOCUMENT_MIME_TYPES.has(file.type)) {
    return {
      ok: false as const,
      error: "Use a PDF, PNG, JPEG or WebP document.",
    };
  }
  if (file.size <= 0 || file.size > MAX_LEARNER_DOCUMENT_BYTES) {
    return {
      ok: false as const,
      error: "Document files must be between 1 byte and 5 MB.",
    };
  }
  const safeName = file.name
    .normalize("NFKC")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^[-.]+/, "")
    .slice(-80);

  if (!safeName) {
    return { ok: false as const, error: "Document filename is invalid." };
  }

  return { ok: true as const, safeName };
}

export function learnerDocumentPath(
  userId: string,
  documentType: string,
  safeName: string,
  timestamp: number,
) {
  const safeType = documentType.replace(/[^a-z0-9_-]+/gi, "-").slice(0, 40) || "other";
  return `${userId}/${safeType}/${timestamp}-${safeName}`;
}
