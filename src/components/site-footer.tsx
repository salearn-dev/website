import { Link } from "@tanstack/react-router";
import { SaFlagLogo } from "./sa-flag-logo";

export function SiteFooter() {
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
              Gain Skills. Get Qualifications. Get Hired.
            </p>
          </div>

          {/* 1.3 — Footer nav landmark: unique aria-label distinguishes it from the header navs */}
          <nav aria-label="Footer navigation" className="contents">
            <FooterCol
              title="Discover"
              links={[
                ["Courses", "/courses"],
                ["Careers", "/careers"],
                ["Institutions", "/institutions"],
              ]}
            />
            <FooterCol
              title="Plan"
              links={[
                ["Match", "/match"],
                ["Funding", "/funding"],
                ["Opportunities", "/opportunities"],
                ["WhatsApp", "/whatsapp"],
                ["Account", "/account"],
              ]}
            />
            <FooterCol
              title="Learn"
              links={[
                ["Skills", "/skills"],
                ["Guides", "/guides"],
              ]}
            />
          </nav>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} SA Learn. Prototype - information not yet verified.</p>
          <p>Sources: SAQA, DHET, NSFAS, SETAs and institutional publications.</p>
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
