import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { StructuredData } from "../src/components/structured-data";
import { buildBreadcrumbJsonLd, buildSeoHead, getCanonicalUrl } from "../src/lib/seo";
import { getSeoRoutePolicy } from "../src/lib/seo-policy";
import { buildCourseJsonLd } from "../src/lib/seo-schema";
import { COURSES } from "../src/lib/data";

describe("SEO policy", () => {
  test("builds absolute production canonicals", () => {
    expect(getCanonicalUrl("/courses/example")).toBe("https://salearn.online/courses/example");
    const head = buildSeoHead({ title: "Example", description: "Description", path: "/courses" });
    expect(head.links).toContainEqual({ rel: "canonical", href: "https://salearn.online/courses" });
  });

  test("keeps private and system routes out of index directives", () => {
    expect(getSeoRoutePolicy("/courses")).toBe("index");
    expect(getSeoRoutePolicy("/account")).toBe("noindex-private");
    expect(getSeoRoutePolicy("/admin/data")).toBe("noindex-private");
    expect(getSeoRoutePolicy("/api/public/opportunities")).toBe("blocked-system");

    const account = buildSeoHead({ title: "Account", description: "Private", path: "/account" });
    expect(account.meta).toContainEqual({ name: "robots", content: "noindex, nofollow, noarchive" });
  });

  test("builds ordered absolute breadcrumbs", () => {
    const breadcrumb = buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Courses", path: "/courses" },
    ]);
    expect(breadcrumb.itemListElement.map((item) => item.position)).toEqual([1, 2]);
    expect(breadcrumb.itemListElement[1].item).toBe("https://salearn.online/courses");
  });
});

describe("StructuredData", () => {
  test("escapes HTML-sensitive schema content before embedding", () => {
    const html = renderToStaticMarkup(
      createElement(StructuredData, {
        data: { "@context": "https://schema.org", name: "</script><script>alert(1)</script>" },
      }),
    );
    expect(html).not.toContain("</script><script>");
    expect(html).toContain("\\u003c/script\\u003e");
  });
});


describe("course detail schema", () => {
  test("represents visible course detail fields without inventing a price", () => {
    const course = COURSES[0];
    const schema = buildCourseJsonLd(course);
    expect(schema.name).toBe(course.title);
    expect(schema.provider.name).toBe(course.institution);
    expect(schema.educationalCredentialAwarded).toBe(course.qualification);
    expect(schema.description).toContain("require official confirmation");
    if (course.cost !== "Free") expect("price" in schema.offers).toBe(false);
  });
});
