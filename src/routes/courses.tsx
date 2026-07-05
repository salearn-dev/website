import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { TrustMetadata } from "@/components/trust-metadata";
import { COURSES, COURSE_CATEGORIES } from "@/lib/data";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Courses - SA Learn" },
      { name: "description", content: "Browse every learning opportunity: universities, TVET, learnerships, short courses and more." },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);

  const filtered = COURSES.filter((c) => {
    const matchesCat = !cat || c.category === cat;
    const matchesQ = !q || (c.title + c.institution + c.careers.join(" ")).toLowerCase().includes(q.toLowerCase());
    return matchesCat && matchesQ;
  });

  return (
    <PageShell
      eyebrow="What can I study?"
      title="Explore every learning opportunity"
      description="Universities, TVET colleges, private colleges, learnerships and short courses - filter by what matters to you."
    >
      {/* Search */}
      <div className="mb-10 flex items-center gap-3 rounded-2xl border border-border bg-card p-2 pl-4 shadow-[var(--shadow-card)]">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search courses, institutions, careers…"
          className="h-11 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        {cat && (
          <button onClick={() => setCat(null)} className="rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/80">
            Clear filter
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-12">
        <h2 className="mb-4 text-sm font-medium text-muted-foreground">Categories</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {COURSE_CATEGORIES.map((c) => (
            <button
              key={c.slug}
              onClick={() => setCat(cat === c.slug ? null : c.slug)}
              className={`rounded-2xl border p-5 text-left transition-all ${
                cat === c.slug
                  ? "border-foreground/40 bg-muted/60"
                  : "border-border bg-card hover:border-foreground/20"
              }`}
            >
              <p className="text-base font-medium text-foreground">{c.title}</p>
              <p className="mt-1.5 text-xs text-muted-foreground">{c.desc}</p>
              <p className="mt-3 text-xs text-muted-foreground">{c.count} listings</p>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 grid gap-3 md:grid-cols-4">
        {[
          { l: "Province", o: ["All", "Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape"] },
          { l: "NQF Level", o: ["All", "NQF 3", "NQF 4", "NQF 5", "NQF 6", "NQF 7"] },
          { l: "Cost", o: ["Any", "Free", "Under R30k", "Over R30k"] },
          { l: "Funding", o: ["Any", "NSFAS", "Bursaries", "Employer funded"] },
        ].map((f) => (
          <label key={f.l} className="block text-xs">
            <span className="mb-1.5 block font-medium text-muted-foreground">{f.l}</span>
            <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
              {f.o.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
        ))}
      </div>

      {/* Results */}
      <p className="mb-4 text-sm text-muted-foreground">{filtered.length} results</p>
      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((c) => (
          <article key={c.slug} className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-[var(--shadow-card-hover)]">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{c.institution}</span>
              <span>{c.province}</span>
            </div>
            <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">{c.title}</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
              <Info label="Qualification" value={c.qualification} />
              <Info label="NQF Level" value={c.nqf ? String(c.nqf) : "-"} />
              <Info label="Duration" value={c.duration} />
              <Info label="Estimated Cost" value={c.cost} />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Careers: </span>{c.careers.join(", ")}
            </p>
            <TrustMetadata trust={c.trust} />
            <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
              <div className="text-xs text-muted-foreground">
                <span className="inline-flex items-center rounded-full bg-success-soft px-2.5 py-1 font-medium text-success">
                  {c.accreditation}
                </span>
              </div>
              <Link to="/courses" className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:underline">
                View course <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-medium text-foreground">{value}</p>
    </div>
  );
}
