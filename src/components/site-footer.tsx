import { Link } from "@tanstack/react-router";
import saFlag from "@/assets/sa-flag.png.asset.json";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-7 w-11 overflow-hidden rounded-[3px] ring-1 ring-border">
                <img src={saFlag.url} alt="South African flag" className="h-full w-full object-cover" />
              </span>
              <span className="text-base font-semibold tracking-tight text-foreground">SA Learn</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Gain Skills. Get Qualifications. Get Hired.
            </p>
          </div>

          <FooterCol title="Discover" links={[
            ["Courses", "/courses"], ["Careers", "/careers"], ["Institutions", "/institutions"],
          ]} />
          <FooterCol title="Plan" links={[
            ["Match", "/match"], ["Funding", "/funding"], ["Opportunities", "/opportunities"],
          ]} />
          <FooterCol title="Learn" links={[
            ["Skills", "/skills"], ["Guides", "/guides"],
          ]} />
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
            <Link to={to} className="text-sm text-muted-foreground hover:text-foreground">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
