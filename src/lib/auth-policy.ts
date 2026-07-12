export type AuthProvider = "google" | "apple";

export function enabledAuthProviders(enableApple: boolean): AuthProvider[] {
  return enableApple ? ["google", "apple"] : ["google"];
}

export function accountRedirectUrl(origin: string) {
  const url = new URL("/account", origin);
  return url.toString();
}
