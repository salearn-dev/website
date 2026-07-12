import { GLOSSARY_TERMS, GUIDES } from "./data";

export function getGuideDetail(slug: string) {
  const guide = GUIDES.find((item) => item.slug === slug);

  if (!guide) {
    return null;
  }

  return {
    guide,
    glossary: GLOSSARY_TERMS.filter((item) => guide.relatedTerms.includes(item.term)),
  };
}

export function buildGuideSchemas(slug: string) {
  const detail = getGuideDetail(slug);

  if (!detail) {
    return null;
  }

  const { guide } = detail;
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.summary,
    articleSection: guide.category,
    publisher: {
      "@type": "Organization",
      name: "SA Learn",
    },
  };

  const howTo = guide.steps
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: guide.title,
        description: guide.summary,
        step: guide.steps.map((text, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          text,
        })),
      }
    : null;

  return { article, howTo };
}
