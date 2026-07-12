import { describe, expect, test } from "bun:test";
import {
  isLanguageCode,
  LANGUAGES,
  persistLanguage,
  readStoredLanguage,
} from "../src/lib/i18n";

describe("language configuration", () => {
  test("exposes the five supported South African UI languages", () => {
    expect(LANGUAGES.map((language) => language.code)).toEqual(["en", "zu", "af", "xh", "st"]);
  });

  test("accepts supported codes and rejects unknown values", () => {
    expect(isLanguageCode("zu")).toBe(true);
    expect(isLanguageCode("en")).toBe(true);
    expect(isLanguageCode("xx")).toBe(false);
    expect(isLanguageCode(null)).toBe(false);
  });

  test("restores a supported preference and falls back safely", () => {
    expect(readStoredLanguage({ getItem: () => "xh" })).toBe("xh");
    expect(readStoredLanguage({ getItem: () => "unsupported" })).toBe("en");
    expect(readStoredLanguage({ getItem: () => null })).toBe("en");
  });

  test("persists the preference and synchronizes document language", () => {
    const writes: Array<[string, string]> = [];
    const element = { lang: "en" };
    persistLanguage("st", { setItem: (key, value) => writes.push([key, value]) }, element);
    expect(element.lang).toBe("st");
    expect(writes).toEqual([["sa-learn-language", "st"]]);
  });
});
