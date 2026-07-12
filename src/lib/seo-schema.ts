import type { Course } from "@/lib/data";

export function buildCourseJsonLd(course: Course) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: `${course.qualification} pathway at ${course.institution}. Admission details and fees require official confirmation before applying.`,
    provider: {
      "@type": "EducationalOrganization",
      name: course.institution,
    },
    educationalCredentialAwarded: course.qualification,
    educationalLevel: course.nqf ? `NQF ${course.nqf}` : "Information unavailable",
    timeRequired: course.duration,
    offers: {
      "@type": "Offer",
      ...(course.cost === "Free" ? { price: "0" } : {}),
      priceCurrency: "ZAR",
      availability: "https://schema.org/LimitedAvailability",
    },
  };
}
