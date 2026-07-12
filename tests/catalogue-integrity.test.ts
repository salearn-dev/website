import { describe, expect, test } from "bun:test";
import {
  CAREERS,
  COURSES,
  GLOSSARY_TERMS,
  GUIDES,
  INSTITUTIONS,
  SKILLS,
} from "../src/lib/data";
import { INSTITUTION_IMAGES } from "../src/lib/institution-images";

function expectUniqueSlugs(records: Array<{ slug: string }>) {
  expect(new Set(records.map((record) => record.slug)).size).toBe(records.length);
}

describe("catalogue relationships", () => {
  test("catalogue slugs are unique", () => {
    for (const records of [CAREERS, COURSES, GUIDES, INSTITUTIONS, SKILLS]) {
      expectUniqueSlugs(records);
    }
  });

  test("career links resolve to current courses and skills", () => {
    const courseSlugs = new Set(COURSES.map((record) => record.slug));
    const skillSlugs = new Set(SKILLS.map((record) => record.slug));

    for (const career of CAREERS) {
      for (const slug of career.relatedCourseSlugs) expect(courseSlugs.has(slug)).toBe(true);
      for (const slug of career.relatedSkillSlugs) expect(skillSlugs.has(slug)).toBe(true);
    }
  });

  test("guide glossary links resolve to real terms", () => {
    const terms = new Set(GLOSSARY_TERMS.map((record) => record.term));
    for (const guide of GUIDES) {
      for (const term of guide.relatedTerms) expect(terms.has(term)).toBe(true);
    }
  });

  test("every institution resolves to attributed fallback-safe media", () => {
    expect(Object.keys(INSTITUTION_IMAGES)).toHaveLength(INSTITUTIONS.length);
    for (const institution of INSTITUTIONS) {
      const image = INSTITUTION_IMAGES[institution.slug];
      expect(image).toBeDefined();
      expect(image.alt).toContain(institution.name.split(" ")[0]);
      expect(image.url.startsWith("https://")).toBe(true);
      expect(image.sourceUrl.startsWith("https://")).toBe(true);
      expect(image.width).toBeGreaterThanOrEqual(320);
      expect(image.height).toBeGreaterThanOrEqual(120);
    }
  });
});
