# Testing — SA Learn

## Local quality gate

```bash
bun install --frozen-lockfile
bun run check
```

The combined gate runs TypeScript, lint, unit tests with coverage, SEO checks, accessibility checks, server-only import checks, catalogue content health, the production build and bundle budgets.

## Unit tests

```bash
bun run test:unit
bun run test:coverage
```

Coverage is configured in `bunfig.toml`. Test fixtures must remain deterministic and must not contain production learner data.

## Supabase RLS integration tests

Use a dedicated test project or isolated test users. Never use production learner accounts.

1. Copy `.env.test.example` into an untracked local environment.
2. Supply the test project URL, publishable key and short-lived tokens for two learner accounts, one institution-role account and one administrator.
3. Run `bun run test:integration:rls`.

The harness validates anonymous catalogue access, anonymous private-table denial, learner ownership isolation, cross-learner denial, institution-role visibility, role-escalation denial, testimonial submission/moderation, stale-record RPC permissions and administrator moderation access.

A direct `bun test` may skip integration cases when credentials are absent. The dedicated `test:integration:rls` command sets `REQUIRE_RLS_TESTS=1` and fails immediately when any credential is missing, so it is the only acceptable proof command.

## CI

The `Quality Gate` workflow runs on pushes to `main` and pull requests. Repository administrators must require it through branch protection.

CI publishes coverage evidence and blocks changes that violate lint, unit tests, source policies, dependency audit, build or bundle budgets.\n\nThe separate `rls-integration` job runs only after an administrator sets the repository variable `RLS_TESTS_REQUIRED=true` and configures every `SUPABASE_TEST_*` Actions secret listed in `.env.test.example`. Once enabled, missing credentials fail the job rather than silently skipping RLS proof. Branch protection must require both `verify` and `rls-integration` before RLS tasks can be marked complete.
