import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { InstitutionHeroMedia } from "../src/components/institution-hero-media";
import { INSTITUTION_IMAGES } from "../src/lib/institution-images";

describe("InstitutionHeroMedia", () => {
  test("renders attributed institution media with intrinsic dimensions", () => {
    const image = INSTITUTION_IMAGES["uct"];
    const html = renderToStaticMarkup(
      <InstitutionHeroMedia
        image={image}
        institutionName="University of Cape Town"
        variant="detail"
      />,
    );
    expect(html).toContain(image.url);
    expect(html).toContain(`width="${image.width}"`);
    expect(html).toContain(`height="${image.height}"`);
    expect(html).toContain(image.sourceUrl.replaceAll("&", "&amp;"));
  });

  test("renders the South African flag when primary media is unavailable", () => {
    const html = renderToStaticMarkup(
      <InstitutionHeroMedia
        institutionName="Example Institution"
        variant="card"
      />,
    );
    expect(html).toContain("/flag-south-africa.webp");
    expect(html).toContain("South African flag fallback for Example Institution");
  });
});
