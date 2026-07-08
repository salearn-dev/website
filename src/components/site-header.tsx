import { Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Menu, X, Search, UserRound } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { SaFlagLogo } from "./sa-flag-logo";
import { LANGUAGES, useI18n } from "@/lib/i18n";

const NAV = [
  { to: "/courses", labelKey: "nav.courses" },
  { to: "/match", labelKey: "nav.match" },
  { to: "/careers", labelKey: "nav.careers" },
  { to: "/institutions", labelKey: "nav.institutions" },
  { to: "/funding", labelKey: "nav.funding" },
  { to: "/skills", labelKey: "nav.skills" },
  { to: "/opportunities", labelKey: "nav.opportunities" },
  { to: "/guides", labelKey: "nav.guides" },
] as const;

function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <span className="inline-flex h-7 w-11 overflow-hidden rounded-[3px] ring-1 ring-border">
        <SaFlagLogo />
      </span>
      <span className="text-base font-semibold tracking-tight text-foreground">SA Learn</span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const { t } = useI18n();

  // 2.2 — Close on Escape and return focus to the trigger button
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // 2.2 — Move focus to first link inside the menu when it opens
  useEffect(() => {
    if (!open) return;
    const firstFocusable = menuRef.current?.querySelector<HTMLElement>(
      "a, button, [tabindex]:not([tabindex='-1'])",
    );
    firstFocusable?.focus();
  }, [open]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              activeProps={{
                className: "rounded-md px-3 py-2 text-sm font-medium text-foreground bg-muted",
              }}
            >
              {t(n.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1 lg:flex">
          <button
            type="button"
            aria-label={t("nav.search")}
            className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Search className="h-4 w-4" />
          </button>
          <LanguageSelect />
          <ThemeToggle />
          <Link
            to="/account"
            aria-label={t("nav.account")}
            className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <UserRound className="h-4 w-4" />
          </Link>
          <Link
            to="/match"
            className="ml-2 inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {t("nav.checkOptions")}
          </Link>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <LanguageSelect compact />
          <ThemeToggle />
          <button
            ref={triggerRef}
            type="button"
            className="grid h-9 w-9 place-items-center rounded-md text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav
            ref={menuRef}
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="mx-auto flex max-w-7xl flex-col px-6 py-3"
          >
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {t(n.labelKey)}
              </Link>
            ))}
            <Link
              to="/account"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-3 text-sm text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {t("nav.account")}
            </Link>
            <Link
              to="/match"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {t("nav.checkOptions")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function LanguageSelect({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useI18n();

  return (
    <label className="sr-only" htmlFor={compact ? "language-mobile" : "language-desktop"}>
      Language
      <select
        id={compact ? "language-mobile" : "language-desktop"}
        value={language}
        onChange={(event) => setLanguage(event.target.value as typeof language)}
        className="not-sr-only h-9 rounded-md border border-input bg-background px-2 text-xs font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Language"
      >
        {LANGUAGES.map((item) => (
          <option key={item.code} value={item.code}>
            {compact ? item.code.toUpperCase() : item.label}
          </option>
        ))}
      </select>
    </label>
  );
}
