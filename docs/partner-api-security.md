# Partner opportunity API security

Endpoint: `POST /api/public/opportunities`

## Controls enforced in application source

- shared partner key checked with constant-time comparison;
- 32 KiB declared and measured body limits;
- strict JSON schema with bounded fields and HTTPS source URLs;
- provisional/submitted moderation defaults;
- server-only service-role client;
- no-store responses and scrubbed public errors;
- regression tests for authentication, body limits and payload validation.

## Required production rate limit

Rate limiting must be distributed or enforced at the production edge. An in-memory process counter is not acceptable because instances restart and scale independently.

Apply the following baseline per authenticated partner identity:

- 30 accepted or rejected POST attempts per rolling minute;
- burst capacity no greater than 10 requests;
- return HTTP 429 with `Retry-After`;
- rate-limit authentication failures as well as valid submissions;
- do not use an untrusted client-supplied IP header as the sole identity;
- preserve request counts across instances and deployments;
- exclude GET endpoint documentation from the write quota;
- alert on sustained 401, 413, 422/400 and 429 rates without logging keys or request bodies.

Preferred enforcement order:

1. managed hosting/edge rate limit keyed by the authenticated partner credential fingerprint;
2. distributed datastore atomic counter with expiry;
3. database RPC using an atomic window counter.

## Acceptance evidence

T45 remains incomplete until all of the following are captured:

- production rule/configuration identifier;
- test showing requests within quota succeed;
- test showing the next request returns 429;
- `Retry-After` assertion;
- test from two application instances proving the quota is shared;
- confirmation that API keys and submitted payloads are absent from logs;
- owner and rollback instructions.

## Key rotation

Use only deployment secrets. Rotate the partner key after suspected disclosure, partner offboarding, or an abnormal authentication spike. During planned rotation, support a short dual-key overlap at the secret-management or edge layer rather than committing either key.
