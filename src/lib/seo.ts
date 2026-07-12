import { getRobotsDirective } from "@/lib/seo-policy";

const SITE_URL = "https://salearn.online";
const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/flag-south-africa.webp`;

export function getCanonicalUrl(pathname: string) {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return new URL(normalizedPath, SITE_URL).toString();
}

export function buildSeoHead({
  title,
  description,
  path = "/",
  ogType = "website",
  extraMeta = [],
  robots,
}: {
  title: string;
  description: string;
  path?: string;
  ogType?: string;
  extraMeta?: Array<{ name?: string; property?: string; content: string }>;
  robots?: string;
}) {
  const canonicalUrl = getCanonicalUrl(path);
  const robotsDirective = robots ?? getRobotsDirective(path);

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: ogType },
      { property: "og:url", content: canonicalUrl },
      { property: "og:site_name", content: "SA Learn" },
      { property: "og:image", content: DEFAULT_SOCIAL_IMAGE },
      { property: "og:image:alt", content: "SA Learn South African education guidance" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: DEFAULT_SOCIAL_IMAGE },
      { name: "twitter:image:alt", content: "SA Learn South African education guidance" },
      { name: "robots", content: robotsDirective },
      ...extraMeta,
    ],
    links: [{ rel: "canonical", href: canonicalUrl }],
  };
}

export function getLastModified(value?: string) {
  if (!value || value === "Not yet verified") {
    return undefined;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed.toISOString();
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(item.path),
    })),
  };
}
