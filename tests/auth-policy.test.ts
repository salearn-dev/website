import { describe, expect, test } from "bun:test";
import {
  accountRedirectUrl,
  enabledAuthProviders,
} from "@/lib/auth-policy";

describe("account auth policy", () => {
  test("does not expose Apple until explicitly enabled", () => {
    expect(enabledAuthProviders(false)).toEqual(["google"]);
    expect(enabledAuthProviders(true)).toEqual(["google", "apple"]);
  });

  test("builds a same-origin account callback", () => {
    expect(accountRedirectUrl("https://salearn.online")).toBe(
      "https://salearn.online/account",
    );
    expect(accountRedirectUrl("http://localhost:3000/other")).toBe(
      "http://localhost:3000/account",
    );
  });
});
