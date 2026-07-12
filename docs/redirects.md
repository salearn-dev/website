# Redirect Policy — SA Learn

No legacy redirect map is required while `https://salearn.online` is the sole established canonical origin and public slugs remain stable.

Before renaming or removing an indexed public URL:

1. Add the old path and its single canonical destination to the deployment redirect configuration.
2. Use a permanent 301 or 308 response.
3. Avoid redirect chains and loops.
4. Update internal links, canonical tags and sitemap entries in the same release.
5. Preserve query parameters only when they remain meaningful and safe.
6. Never redirect private routes into public content in a way that leaks learner data.
7. Retain redirects for at least one full academic application cycle.

## Redirect register

| Old path | Destination | Status | Reason | Added | Owner |
|---|---|---:|---|---|---|
| None | — | — | No public URL migration recorded | — | — |
