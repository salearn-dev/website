import { describe, expect, test } from "bun:test";
import {
  learnerDocumentPath,
  MAX_LEARNER_DOCUMENT_BYTES,
  validateLearnerDocument,
} from "@/lib/learner-document";

describe("learner document upload boundary", () => {
  test("accepts bounded supported documents and sanitises names", () => {
    expect(validateLearnerDocument({
      name: "../../My ID copy (final).pdf",
      size: 1024,
      type: "application/pdf",
    })).toEqual({
      ok: true,
      safeName: "My-ID-copy-final-.pdf",
    });
  });

  test("rejects executable and oversized content", () => {
    expect(validateLearnerDocument({
      name: "document.exe",
      size: 100,
      type: "application/x-msdownload",
    }).ok).toBe(false);
    expect(validateLearnerDocument({
      name: "large.pdf",
      size: MAX_LEARNER_DOCUMENT_BYTES + 1,
      type: "application/pdf",
    }).ok).toBe(false);
  });

  test("rejects empty files and unusable names", () => {
    expect(validateLearnerDocument({
      name: "empty.pdf",
      size: 0,
      type: "application/pdf",
    }).ok).toBe(false);
    expect(validateLearnerDocument({
      name: "...",
      size: 100,
      type: "application/pdf",
    }).ok).toBe(false);
  });

  test("keeps storage paths owner scoped and sanitises document types", () => {
    expect(learnerDocumentPath(
      "user-123",
      "proof/of residence",
      "proof.pdf",
      123456,
    )).toBe("user-123/proof-of-residence/123456-proof.pdf");
  });
});
