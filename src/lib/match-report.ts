const LINES_PER_PAGE = 48;
const encoder = new TextEncoder();

function byteLength(value: string) {
  return encoder.encode(value).length;
}

function wrapLines(text: string) {
  return text.split("\n").flatMap((line) => {
    if (line.length <= 88) return [line];
    return line.match(/.{1,88}(\s|$)/g)?.map((part) => part.trim()) ?? [line];
  });
}

function pageStream(lines: string[]) {
  return [
    "BT",
    "/F1 11 Tf",
    "50 750 Td",
    "14 TL",
    ...lines.flatMap((line) => [`(${escapePdfText(line)}) Tj`, "T*"]),
    "ET",
  ].join("\n");
}

export function makePdfBlob(text: string) {
  const lines = wrapLines(text);
  const pages = Array.from(
    { length: Math.max(1, Math.ceil(lines.length / LINES_PER_PAGE)) },
    (_, index) => lines.slice(index * LINES_PER_PAGE, (index + 1) * LINES_PER_PAGE),
  );

  const pageObjectStart = 3;
  const fontObjectId = pageObjectStart + pages.length;
  const contentObjectStart = fontObjectId + 1;
  const pageObjectIds = pages.map((_, index) => pageObjectStart + index);
  const contentObjectIds = pages.map((_, index) => contentObjectStart + index);

  const objects = [
    `<< /Type /Catalog /Pages 2 0 R >>`,
    `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pages.length} >>`,
    ...pages.map(
      (_, index) =>
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontObjectId} 0 R >> >> /Contents ${contentObjectIds[index]} 0 R >>`,
    ),
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    ...pages.map((page) => {
      const stream = pageStream(page);
      return `<< /Length ${byteLength(stream)} >>\nstream\n${stream}\nendstream`;
    }),
  ];

  const parts = ["%PDF-1.4\n"];
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(byteLength(parts.join("")));
    parts.push(`${index + 1} 0 obj\n${object}\nendobj\n`);
  });

  const xrefOffset = byteLength(parts.join(""));
  parts.push(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`);
  offsets.slice(1).forEach((offset) => {
    parts.push(`${String(offset).padStart(10, "0")} 00000 n \n`);
  });
  parts.push(
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`,
  );

  return new Blob(parts, { type: "application/pdf" });
}

export function escapePdfText(value: string) {
  const safe = value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .replace(/[–—]/g, "-")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7e]/g, "?");

  return safe.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}
