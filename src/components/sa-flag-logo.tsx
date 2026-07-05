import { useEffect, useRef, useState } from "react";
import saFlag from "@/assets/sa-flag.png.asset.json";

const FALLBACK_FLAG_URL = "/flag-south-africa.webp";

function getInitialFlagSrc() {
  if (import.meta.env.DEV) {
    return FALLBACK_FLAG_URL;
  }

  if (
    typeof window !== "undefined" &&
    ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname)
  ) {
    return FALLBACK_FLAG_URL;
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
      setSrc(FALLBACK_FLAG_URL);
    }
  }, []);

  return (
    <img
      ref={imageRef}
      src={src}
      alt="South African flag"
      className="h-full w-full object-cover"
      onError={() => {
        if (src !== FALLBACK_FLAG_URL) {
          setSrc(FALLBACK_FLAG_URL);
        }
      }}
    />
  );
}
