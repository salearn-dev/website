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
  asOf?: Date;
};

export function filterOpportunities<
  T extends { province: string; sector: string; type: string; closes?: string },
>(opportunities: T[], filters: OpportunityFilters) {
  const asOf = filters.asOf ?? new Date();
  return opportunities.filter(
    (opportunity) =>
      !isOpportunityExpired(opportunity.closes, asOf) &&
      (!filters.province || filters.province === "All" || opportunity.province === filters.province) &&
      (!filters.sector || filters.sector === "All" || opportunity.sector === filters.sector) &&
      (!filters.type || filters.type === "All" || opportunity.type === filters.type),
  );
}


export function isOpportunityExpired(deadline: string | undefined, asOf = new Date()) {
  if (!deadline) return false;
  const timestamp = Date.parse(deadline);
  if (Number.isNaN(timestamp)) return false;
  const endOfDeadline = new Date(timestamp);
  endOfDeadline.setHours(23, 59, 59, 999);
  return endOfDeadline.getTime() < asOf.getTime();
}

export function reminderDateFromDeadline(deadline: string, now = new Date()) {
  const timestamp = Date.parse(deadline);
  if (Number.isNaN(timestamp)) {
    const fallback = new Date(now);
    fallback.setDate(fallback.getDate() + 30);
    return fallback;
  }

  const reminder = new Date(timestamp);
  reminder.setDate(reminder.getDate() - 7);
  return reminder;
}
