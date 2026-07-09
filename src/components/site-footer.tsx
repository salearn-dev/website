import { Link } from "@tanstack/react-router";
import { SaFlagLogo } from "./sa-flag-logo";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="mt-24 border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-7 w-11 overflow-hidden rounded-[3px] ring-1 ring-border">
                <SaFlagLogo />
              </span>
              <span className="text-base font-semibold tracking-tight text-foreground">
                SA Learn
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {t("landing.tagline")}
            </p>
          </div>

          {/* 1.3 — Footer nav landmark: unique aria-label distinguishes it from the header navs */}
          <nav aria-label="Footer navigation" className="contents">
            <FooterCol
              title={t("footer.discover")}
              links={[
                [t("nav.courses"), "/courses"],
                [t("nav.careers"), "/careers"],
                [t("nav.institutions"), "/institutions"],
                ["Institution portal", "/institutions/portal"],
              ]}
            />
            <FooterCol
              title={t("footer.plan")}
              links={[
                [t("nav.match"), "/match"],
                [t("nav.ask"), "/ask"],
                [t("nav.funding"), "/funding"],
                [t("nav.opportunities"), "/opportunities"],
                ["WhatsApp", "/whatsapp"],
                [t("nav.account"), "/account"],
              ]}
            />
            <FooterCol
              title={t("footer.learn")}
              links={[
                [t("nav.skills"), "/skills"],
                [t("nav.guides"), "/guides"],
              ]}
            />
          </nav>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} SA Learn. {t("footer.prototype")}</p>
          <p>{t("footer.sources")}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <ul className="mt-3 space-y-2">
        {links.map(([label, to]) => (
          <li key={to}>
            <Link
              to={to}
              className="text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
