# Testing — SA Learn

## Local quality gate

```bash
bun install --frozen-lockfile
bun run check
```

The combined gate runs TypeScript, lint, unit tests with coverage, SEO checks, accessibility checks, server-only import checks, catalogue content health, the production build and bundle budgets.

## Unit tests

```bash
bun run test
bun run test:coverage
```

Coverage is configured in `bunfig.toml`. Test fixtures must remain deterministic and must not contain production learner data.

## Supabase RLS integration tests

Use a dedicated test project or isolated test users. Never use production learner accounts.

1. Copy `.env.test.example` into an untracked local environment.
2. Supply the test project URL, publishable key and short-lived tokens for two learner accounts plus one administrator.
3. Run `bun test tests/integration/rls.test.ts`.

The harness validates anonymous catalogue access, anonymous private-table denial, learner ownership isolation, cross-learner denial, role-escalation denial and administrator moderation access.

When credentials are absent, integration cases are explicitly skipped. A skipped test is not production proof.

## CI

The `Quality Gate` workflow runs on pushes to `main` and pull requests. Repository administrators must require it through branch protection.

CI publishes coverage evidence and blocks changes that violate lint, tests, source policies, dependency audit, build or bundle budgets.
