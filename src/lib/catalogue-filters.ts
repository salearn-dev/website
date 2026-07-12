import type { Course } from "@/lib/data";

export type CourseFilters = {
  query?: string;
  category?: string | null;
  province?: string;
  city?: string;
  nqf?: string;
  cost?: string;
  delivery?: string;
};

export function filterCourses(courses: Course[], filters: CourseFilters) {
  const query = filters.query?.trim().toLocaleLowerCase() ?? "";

  return courses.filter((course) => {
    const haystack = `${course.title} ${course.institution} ${course.careers.join(" ")}`.toLocaleLowerCase();
    const nqfLabel = course.nqf ? `NQF ${course.nqf}` : "Not NQF-rated";

    return (
      (!filters.category || course.category === filters.category) &&
      (!query || haystack.includes(query)) &&
      (!filters.province || filters.province === "All" || course.province === filters.province) &&
      (!filters.city || filters.city === "All" || course.city === filters.city) &&
      (!filters.nqf || filters.nqf === "All" || nqfLabel === filters.nqf) &&
      (!filters.cost || filters.cost === "Any" || course.cost === filters.cost) &&
      (!filters.delivery || filters.delivery === "Any" || course.deliveryMode === filters.delivery)
    );
  });
}

export type OpportunityFilters = {
  province?: string;
  sector?: string;
  type?: string;
};

export function filterOpportunities<
  T extends { province: string; sector: string; type: string },
>(opportunities: T[], filters: OpportunityFilters) {
  return opportunities.filter(
    (opportunity) =>
      (!filters.province || filters.province === "All" || opportunity.province === filters.province) &&
      (!filters.sector || filters.sector === "All" || opportunity.sector === filters.sector) &&
      (!filters.type || filters.type === "All" || opportunity.type === filters.type),
  );
}
