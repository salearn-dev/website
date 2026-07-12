export const CATALOGUE_TABLES = [
  "institutions",
  "courses",
  "qualifications",
  "opportunities",
  "funding_windows",
  "careers",
  "skills",
  "guides",
] as const;

export type CatalogueTable = (typeof CATALOGUE_TABLES)[number];

export const TABLE_LABEL_COLUMN: Record<CatalogueTable, "name" | "title"> = {
  institutions: "name",
  courses: "title",
  qualifications: "name",
  opportunities: "title",
  funding_windows: "name",
  careers: "title",
  skills: "title",
  guides: "title",
};

export function moderationSelectColumns(table: CatalogueTable) {
  return `id,${TABLE_LABEL_COLUMN[table]},source_url,verification_status`;
}
