import { useEffect, useRef, useState } from "react";
import saFlag from "@/assets/sa-flag.png.asset.json";

export const SA_FLAG_FALLBACK_URL = "/flag-south-africa.webp";

function getInitialFlagSrc() {
  if (import.meta.env.DEV) {
    return SA_FLAG_FALLBACK_URL;
  }

  if (
    typeof window !== "undefined" &&
    ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname)
  ) {
    return SA_FLAG_FALLBACK_URL;
  }

  return saFlag.url;
}

// Codex: Local logo fallback
// Status: Vite dev uses the bundled flag immediately; production still tries the Lovable-hosted asset first.
export function SaFlagLogo() {
  const [src, setSrc] = useState(getInitialFlagSrc);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;

    if (image?.complete && image.naturalWidth === 0) {
      setSrc(SA_FLAG_FALLBACK_URL);
    }
  }, []);

  return (
    <img
      ref={imageRef}
      src={src}
      alt="South African flag"
      className="h-full w-full object-cover"
      onError={() => {
        if (src !== SA_FLAG_FALLBACK_URL) {
          setSrc(SA_FLAG_FALLBACK_URL);
        }
      }}
    />
  );
}
