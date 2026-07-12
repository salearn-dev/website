# Branch Protection — SA Learn

Protect `main` as the production source branch.

## Required settings

- Require a pull request before merging.
- Require at least one review from a human or designated review owner.
- Dismiss stale approvals when new commits are pushed.
- Require the `Quality Gate / verify` status check.
- Require branches to be up to date before merging.
- Require conversation resolution.
- Block force pushes and branch deletion.
- Restrict direct pushes to named release administrators.
- Include administrators unless emergency recovery is documented.
- Require signed commits when the team can support key management reliably.

## Emergency changes

A production incident may use an expedited review, but it must still:

1. reference the incident;
2. pass the quality workflow;
3. avoid rewriting history;
4. receive retrospective review;
5. record rollback or follow-up work.

## Evidence owner

The repository can define this policy, but a GitHub administrator must apply and periodically verify it in repository settings.
