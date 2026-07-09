# POPIA Consent Flow Audit - 2026-07-09

**Auditor:** Codex  
**Scope:** Code review of learner-facing data collection, consent prompts, RLS-backed tables, and storage paths.  
**Result:** Pass for current prototype/beta flows, with deployment and legal review caveats.

## What Was Checked

- Match profile saving requires explicit learner consent before storing marks and subjects.
- Funding document upload requires sign-in and explicit consent before private storage upload.
- Document consent metadata is recorded in `document_consents`.
- New general consent records table exists for broader consent logging.
- Learner skill progress and deadline reminders are owner-scoped by RLS.
- Testimonials require consent and moderation before public display.
- The UI tells learners when data is stored and when SA Learn does not submit documents or applications automatically.

## Evidence

- `src/routes/match.tsx` gates profile saving behind a consent checkbox before writing `learner_details`.
- `src/routes/funding.tsx` gates document upload behind consent and writes document consent metadata.
- `supabase/migrations/20260707152000_stale_records_partner_documents.sql` creates private learner-document storage and `document_consents`.
- `supabase/migrations/20260709113620_4a20ffbf-35aa-4f12-ba6e-5317708cb3d6.sql` creates `consent_records`, `skill_progress`, `deadline_reminders`, and `testimonials` RLS foundations.
- `supabase/migrations/20260709142000_reconcile_testimonials_contract.sql` makes `testimonials` consent-aware and keeps public reads approved-only.

## Residual Requirements

- Kuzi/Lovable should confirm retention periods for uploaded documents and consent records.
- Deployment secrets must stay outside Git.
- Legal counsel should review final POPIA wording before broad public launch.
- Backend workers that send reminders must record delivery status and opt-out handling before claiming full communication compliance.

## Readiness Interpretation

This audit is sufficient to mark the internal checklist item "POPIA-compliant data handling and consent flows (audited)" complete for the current beta scope. It is not a formal legal opinion.
