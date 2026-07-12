**Verdict: Amber/Red — launchable by 1 August only as a controlled public beta.** It is not ready for unrestricted production reliance today.

There are 19 full working days remaining. The frontend foundation is reasonably mature, but production proof, data verification, automated testing, security validation, and operations are behind the UI.

## Executive assessment

| Area | Status | Assessment |
|---|---:|---|
| Core frontend | Amber | Broad feature coverage and reusable route structure |
| Production build | Red | Latest commit has no verified production build |
| CI/CD | Red | No GitHub Actions runs or commit checks |
| Automated testing | Red | `test` only runs TypeScript checking |
| Security/RLS | Red | Policies exist, but direct API attack-path testing is outstanding |
| Data accuracy | Red | Admissions, deadlines, accreditation and salary data remain provisional |
| Authentication | Amber | Supabase integration exists; production flows need verification |
| Accessibility | Amber/Red | Structural work exists, but forms, contrast, motion and assistive testing remain |
| SEO | Amber | Canonicals, robots and structured data improved; sitemap requires confirmation |
| Monitoring | Red | Error reporting depends on an optional Lovable global; no proven operational stack |
| Deployment | Red | No repository-owned production deployment configuration or observable pipeline |
| Institution imagery | Green/Amber | 76/76 coverage, but licensing and runtime delivery require final audit |

## Confirmed launch blockers

### 1. No real quality gate

`package.json` currently defines:

```text
test = bun run typecheck
check = bun run typecheck && bun run build
```

There are no unit, integration, browser, accessibility or RLS tests in the test command. GitHub reports no checks or workflow runs for the current head.

Before launch, every change should require:

- Clean dependency installation
- TypeScript
- ESLint
- Production build
- Unit tests for matching and data transforms
- Browser smoke tests
- RLS/API tests
- Accessibility scan
- Dependency/security audit

### 2. Production build is unproven

The latest commit says TypeScript passed, but the production build could not run because of the development environment. That does not prove the deployed bundle works.

A clean, reproducible production build must be demonstrated in CI and staging—not only on a contributor’s machine.

### 3. Data cannot yet support authoritative guidance

Repository documentation explicitly says the following remain unverified:

- Programme admission requirements
- Faculty-specific APS and subject rules
- NBT and additional-test requirements
- Application windows and deadlines
- Accreditation references
- Fees
- Career salary bands and demand signals

This is the largest product risk. A technically stable website can still harm users if it gives outdated education or funding guidance.

For 1 August, unverified values should either:

- Be removed,
- Be prominently labelled as estimates,
- Or link directly to the official source with a verification date.

The match engine must remain advisory until verified rule datasets exist.

### 4. RLS and administrative authorization are unproven

Supabase clients and authentication middleware are present, including a server-side service-role client that bypasses RLS. The design acknowledges the risk, but there is no test evidence covering:

- Anonymous reads
- Cross-user profile access
- Cross-user saved-item access
- Role escalation
- Admin moderation
- Institution portal authorization
- Direct REST/RPC access bypassing the UI
- Service-role isolation from browser bundles

UI role checks are not sufficient. These need direct API tests with anonymous, learner, institution and administrator credentials.

### 5. No operational monitoring proof

A React root error boundary exists, but external reporting is conditional on:

```text
window.__lovableEvents?.captureException
```

There is no verified evidence of:

- Production error ingestion
- Server-side exception reporting
- Uptime monitoring
- Alert delivery
- Deployment health checks
- Performance monitoring
- Audit-log review
- Backup and restoration testing

Without this, production failures may only be discovered through users.

### 6. Accessibility is incomplete

Positive work includes landmarks, skip navigation, keyboard improvements and live-region support. Outstanding work includes:

- Contrast validation
- Visible form labels
- Required-field semantics
- Error association
- Fieldset/legend grouping
- Reduced-motion handling
- 200% zoom validation
- Minimum touch targets
- Axe scans
- Lighthouse accessibility testing
- Keyboard and screen-reader walkthroughs

The accessibility document is also partially stale: it claims institution images and multilingual infrastructure were absent, although both have since changed. Audit evidence must be refreshed against the current code.

## High-priority risks

### Security headers

No repository evidence was found for a Content Security Policy. Production should explicitly configure:

- Content-Security-Policy
- Strict-Transport-Security
- Referrer-Policy
- Permissions-Policy
- X-Content-Type-Options
- Frame restrictions through CSP
- Secure cache policy for authenticated pages

The inline theme script and JSON-LD scripts mean CSP will need a nonce or hash strategy.

### Session storage

The browser Supabase session is persisted in `localStorage`. This is common, but it raises the impact of any XSS defect. CSP, dependency hygiene and avoidance of unsafe HTML become important.

The current `dangerouslySetInnerHTML` use is limited to `JSON.stringify()` output for structured data, which is lower risk while the data is controlled internally. If catalogue content becomes partner-editable, JSON-LD serialization must escape `<` or use a hardened structured-data component.

### Deployment ownership

The repository has a minimal Vite configuration and no visible GitHub workflow or standard Cloudflare configuration. The team needs a documented answer for:

- Which platform owns production
- Which branch deploys
- Preview versus staging versus production
- Environment-secret ownership
- Database migration order
- Rollback procedure
- Domain and DNS ownership
- Cache invalidation
- Deployment approval

### Image licensing

Institution images have source records and fallbacks, which is good. The CC BY University of Venda asset appears to need clearer creator and licence attribution. All 76 records need a final licence/source review—not merely URL availability.

### Documentation drift

The SEO report lists canonical, robots and structured-data gaps that are already partly corrected in current code. Conversely, the expected sitemap route could not be fetched under the documented path. Treat reports as historical notes until regenerated from the current head.

## Recommended 1 August launch scope

Launch the following:

- Public landing page
- Institution directory and profiles
- Curated course, funding, career and opportunity discovery
- Advisory match flow with explicit limitations
- Account functions that pass RLS testing
- Official-source links and verification metadata

Do not launch unrestricted access to:

- Admin surfaces without proven authorization
- Institution self-service without role and RLS testing
- Partner ingestion APIs without authentication/rate-limit testing
- Any “you qualify” result based on unverified rules
- Deadlines or accreditation claims lacking official source dates
- Features that silently fail when Supabase or environment variables are unavailable

## Delivery plan

### 13–15 July: establish the release gate

- Add GitHub Actions.
- Make clean install, lint, typecheck and production build pass.
- Add branch protection.
- Establish staging.
- Record the exact production deployment process.
- Freeze new broad features.

Exit condition: every commit produces a reproducible staging build.

### 16–19 July: security and backend proof

- Test every Supabase table and RPC as anonymous, learner, institution and admin.
- Verify service-role code is server-only.
- Test admin and portal route authorization.
- Add security headers.
- Review environment secrets.
- Test signup, login, logout, session restoration and password recovery.
- Add rate limits or abuse controls to public/server endpoints.

Exit condition: no unauthorized cross-user or privileged access.

### 20–23 July: critical user journeys

Automate and manually test:

- Browse institution → open detail → official source
- Browse course → detail → related career
- Complete match flow
- Download advisory report
- Find funding
- Create account → save → reload → delete
- Invalid routes and network failures
- Mobile navigation
- Supabase unavailable states

Exit condition: critical paths pass on desktop and mobile.

### 24–26 July: content and data trust

- Review all live deadlines.
- Review accreditation language.
- Review match rules and disclaimers.
- Validate all official links.
- Verify 76 institution images and attribution.
- Remove or clearly label unsupported salary, demand and eligibility claims.
- Assign an owner and expiry date to every sensitive dataset.

Exit condition: no unsupported authoritative claim is exposed.

### 27–28 July: accessibility, SEO and performance

- Axe scan critical routes.
- Keyboard-only walkthrough.
- NVDA or VoiceOver smoke test.
- Contrast and 200% zoom testing.
- Confirm absolute sitemap URLs and production response.
- Validate robots, canonicals and structured data.
- Run Lighthouse on representative routes.
- Check mobile image performance and layout stability.

Exit condition: no critical accessibility or indexing defect.

### 29 July: release candidate

- Deploy release candidate to staging.
- Freeze code except blockers.
- Run the full regression suite.
- Test migrations against a production-like database.
- Test rollback.
- Confirm backups and restoration procedure.

### 30–31 July: controlled launch preparation

- Resolve release-candidate defects.
- Configure uptime and error alerts.
- Confirm domain, SSL and DNS.
- Prepare incident contacts and user-support path.
- Take a final database backup.
- Approve a written go/no-go checklist.

### 1 August: launch

Use a controlled rollout if the hosting platform permits it. Monitor:

- HTTP error rate
- Client exceptions
- Authentication failures
- Supabase errors
- Slow routes
- Broken external links and images
- Match-flow abandonment
- User reports

## Go/no-go criteria

The site is a **go** only when all of these are true:

- Production build passes from a clean environment.
- CI is required on the release branch.
- No critical or high security finding remains.
- RLS tests prove tenant and role isolation.
- Critical browser journeys pass.
- Production environment variables are verified.
- Monitoring and alerts are receiving real events.
- Backup and rollback procedures have been tested.
- Sensitive education claims are verified or explicitly advisory.
- Critical accessibility defects are closed.
- Domain, sitemap, robots and canonical URLs use the production origin.

**Estimated readiness today: approximately 55–65% for a controlled beta, and below 40% for fully trusted production guidance.** The 1 August target is realistic if the team freezes feature expansion now and spends the remaining period on proof, verification and operational readiness.