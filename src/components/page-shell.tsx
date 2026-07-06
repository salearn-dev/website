import type { ReactNode } from "react";

export function PageShell({
  eyebrow,
  title,
  description,
  action,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    // id="main-content" is the skip-link target (1.2)
    <main id="main-content" className="mx-auto max-w-7xl px-6 pb-16 pt-12 md:pt-16">
      <header className="mb-10 max-w-3xl">
        {eyebrow && (
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            {description}
          </p>
        )}
        {action && <div className="mt-6">{action}</div>}
      </header>
      {children}
    </main>
  );
}
