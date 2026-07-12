import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { TrustMetadata } from "@/components/trust-metadata";
import { COURSES, COURSE_CATEGORIES, type Course } from "@/lib/data";
import { loadApprovedCourses } from "@/lib/live-catalogue";
import { buildSeoHead } from "@/lib/seo";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/courses")({
  head: () =>
    buildSeoHead({
      title: "Courses - SA Learn",
      description:
        "Browse every learning opportunity: universities, TVET, learnerships, short courses and more.",
      path: "/courses",
      ogType: "website",
    }),
  component: CoursesPage,
});

function CoursesPage() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [province, setProvince] = useState("All");
  const [city, setCity] = useState("All");
  const [nqf, setNqf] = useState("All");
  const [cost, setCost] = useState("Any");
  const [delivery, setDelivery] = useState("Any");
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [catalogueSource, setCatalogueSource] = useState<"live" | "static">("static");

  useEffect(() => {
    let alive = true;

    // Codex: Live approved course catalogue bridge
    // Status: Reads Lovable Phase 2 approved courses and falls back to static prototype data.
    loadApprovedCourses().then((result) => {
      if (!alive) return;
      setCourses(result.items);
      setCatalogueSource(result.source);
    });

    return () => {
      alive = false;
    };
  }, []);

  const provinceOptions = useMemo(() => ["All", ...unique(courses.map((c) => c.province))], [courses]);
  const cityOptions = useMemo(() => ["All", ...unique(courses.map((c) => c.city))], [courses]);
  const nqfOptions = useMemo(
    () => ["All", ...unique(courses.map((c) => (c.nqf ? `NQF ${c.nqf}` : "Not NQF-rated")))],
    [courses],
  );
  const costOptions = useMemo(() => ["Any", ...unique(courses.map((c) => c.cost))], [courses]);
  const deliveryOptions = useMemo(() => ["Any", ...unique(courses.map((c) => c.deliveryMode))], [courses]);

  // Codex: Course explorer city and delivery filters
  // Status: Public filters now run over live approved rows when available; SAQA/DHET sync remains data-owned.
  const filtered = courses.filter((c) => {
    const haystack = `${c.title} ${c.institution} ${c.careers.join(" ")}`.toLowerCase();
    const matchesCat = !cat || c.category === cat;
    const matchesQ = !q || haystack.includes(q.toLowerCase());
    const matchesProvince = province === "All" || c.province === province;
    const matchesCity = city === "All" || c.city === city;
    const matchesNqf = nqf === "All" || (c.nqf ? `NQF ${c.nqf}` : "Not NQF-rated") === nqf;
    const matchesCost = cost === "Any" || c.cost === cost;
    const matchesDelivery = delivery === "Any" || c.deliveryMode === delivery;

    return (
      matchesCat &&
      matchesQ &&
      matchesProvince &&
      matchesCity &&
      matchesNqf &&
      matchesCost &&
      matchesDelivery
    );
  });

  function clearFilters() {
    setQ("");
    setCat(null);
    setProvince("All");
    setCity("All");
    setNqf("All");
    setCost("Any");
    setDelivery("Any");
  }

  return (
    <PageShell
      eyebrow={t("route.courses.eyebrow")}
      title={t("route.courses.title")}
      description={t("route.courses.description")}
    >
      <section aria-labelledby="course-search-heading" className="mb-10">
        <h2 id="course-search-heading" className="sr-only">
          Search and filter courses
        </h2>
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] md:flex-row md:items-center">
          <label className="flex min-w-0 flex-1 items-center gap-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="sr-only">Search courses, institutions and careers</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search courses, institutions, careers..."
              className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <button
            type="button"
            onClick={clearFilters}
            className="h-10 rounded-md bg-muted px-3 text-xs font-medium text-foreground hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Clear filters
          </button>
        </div>
      </section>

      <section aria-labelledby="course-categories-heading" className="mb-12">
        <h2
          id="course-categories-heading"
          className="mb-4 text-sm font-medium text-muted-foreground"
        >
          Categories
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {COURSE_CATEGORIES.map((c) => (
            <button
              type="button"
              key={c.slug}
              onClick={() => setCat(cat === c.slug ? null : c.slug)}
              aria-pressed={cat === c.slug}
              className={`rounded-2xl border p-5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
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
      </section>

      <section aria-labelledby="course-filters-heading" className="mb-8">
        <h2 id="course-filters-heading" className="sr-only">
          Detailed course filters
        </h2>
        <div className="grid gap-3 md:grid-cols-5">
          <FilterSelect
            label="Province"
            value={province}
            onChange={setProvince}
            options={provinceOptions}
          />
          <FilterSelect label="City" value={city} onChange={setCity} options={cityOptions} />
          <FilterSelect label="NQF level" value={nqf} onChange={setNqf} options={nqfOptions} />
          <FilterSelect label="Cost" value={cost} onChange={setCost} options={costOptions} />
          <FilterSelect
            label="Delivery mode"
            value={delivery}
            onChange={setDelivery}
            options={deliveryOptions}
          />
        </div>
      </section>

      <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
        Showing <span className="font-medium text-foreground">{filtered.length}</span> of{" "}
        {courses.length} {catalogueSource === "live" ? "approved live" : "curated"} courses.
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((c) => (
          <article
            key={c.slug}
            className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-[var(--shadow-card-hover)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>{c.institution}</span>
              <span>
                {c.city}, {c.province} - {c.deliveryMode}
              </span>
            </div>
            <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">{c.title}</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
              <Info label="Qualification" value={c.qualification} />
              <Info label="NQF Level" value={c.nqf ? String(c.nqf) : "Not rated"} />
              <Info label="Duration" value={c.duration} />
              <Info label="Estimated Cost" value={c.cost} />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Careers: </span>
              {c.careers.join(", ")}
            </p>
            <TrustMetadata trust={c.trust} />
            <div className="mt-5 flex items-center justify-between gap-4 border-t border-border pt-4">
              <span className="inline-flex items-center rounded-full bg-success-soft px-2.5 py-1 text-xs font-medium text-success">
                {c.accreditation}
              </span>
              <Link
                to="/courses/$slug"
                params={{ slug: c.slug }}
                className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                View course <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <p className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            No courses match those filters yet. Clear filters or broaden your search.
          </p>
        )}
      </div>
    </PageShell>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block text-xs">
      <span className="mb-1.5 block font-medium text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
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

function unique(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}
