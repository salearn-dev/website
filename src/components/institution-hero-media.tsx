import { useEffect, useState } from "react";
import { SA_FLAG_FALLBACK_URL } from "@/components/sa-flag-logo";
import type { InstitutionImage } from "@/lib/institution-images";

type InstitutionHeroMediaProps = {
  image?: InstitutionImage;
  institutionName: string;
  variant: "card" | "detail";
};

// Codex: Resilient institution media fallback
// Status: Tries the sourced institution image, then the bundled SA flag, then removes the media region.
export function InstitutionHeroMedia({
  image,
  institutionName,
  variant,
}: InstitutionHeroMediaProps) {
  const [source, setSource] = useState<"primary" | "flag" | null>(image ? "primary" : "flag");

  useEffect(() => {
    setSource(image ? "primary" : "flag");
  }, [image]);

  if (!source) return null;

  const src = source === "primary" && image ? image.url : SA_FLAG_FALLBACK_URL;
  const alt =
    source === "primary" && image
      ? image.alt
      : `South African flag fallback for ${institutionName}`;
  const handleError = () => setSource((current) => (current === "primary" ? "flag" : null));

  if (variant === "card") {
    return (
      <img
        src={src}
        alt={alt}
        className="h-44 w-full object-cover"
        loading="lazy"
        decoding="async"
        onError={handleError}
      />
    );
  }

  return (
    <figure className="mb-6 overflow-hidden rounded-2xl border border-border bg-card">
      <img
        src={src}
        alt={alt}
        className="aspect-[16/7] w-full object-cover"
        loading="eager"
        decoding="async"
        onError={handleError}
      />
      <figcaption className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
        {source === "primary" && image ? (
          <>
            Image source:{" "}
            <a
              href={image.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground hover:underline"
            >
              {image.sourceName}
            </a>
          </>
        ) : (
          "Fallback image: South African flag"
        )}
      </figcaption>
    </figure>
  );
}
