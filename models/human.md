# Model Operating Rules

This folder is for every AI model, coding agent, or assisted development tool that works inside this codebase.

The purpose is simple:

Keep the project organised, readable, modular, and aligned with the existing source of truth.

Do not use this file to redefine SA Learn. The product vision already exists elsewhere in the codebase. This file only defines how models should behave while editing code.

## 1. Register Before Working

Every model must create or update its own file inside `/models`.

Examples:

`/models/codex.md`
`/models/lovable.md`
`/models/gpt.md`
`/models/v0.md`
`/models/claude.md`

At the top of that file, register the current working role for the session or task.

Each model file should begin with:

Model name
Date
Assigned role for this task
Files or areas expected to touch
Files or areas to avoid
Task summary
Known risks
Completion report location

Roles are not permanently assigned by this document. The project owner decides what each model is doing on a specific day.

A model must not assume it owns the whole codebase.

## 2. Source of Truth

Before editing, read the existing source-of-truth files in the repo.

Do not rewrite the product vision.

Do not create competing visions.

Do not reinterpret SA Learn into a different product.

If a task appears to conflict with the source of truth, stop and report the conflict before making changes.

## 3. Separation of Concerns

Work in your lane.

A task should touch the smallest reasonable area of the codebase.

Do not mix unrelated changes in one edit.

Avoid commits that combine UI, logic, security, data structure, styling, and documentation changes unless the task explicitly requires it.

Examples of separated work:

UI layout change
Match logic change
Security policy change
Data model update
Documentation update
Test update
Refactor only

Do not silently “improve” unrelated files while completing a task.

If you notice a problem outside your task, document it in your model report instead of fixing it immediately.

## 4. Keep It Simple

Prefer simple, readable solutions.

Do not over-engineer.

Do not introduce abstractions before they are needed.

Do not add new patterns if existing project patterns solve the problem.

Do not replace working systems just because another structure is cleaner in theory.

The best solution is usually the one another model or human developer can understand quickly tomorrow.

## 5. DRY: Do Not Repeat Yourself

Before creating new logic, components, styles, helpers, or data structures, search the existing codebase.

Reuse existing work where possible.

Plug into another model’s work instead of reinventing it.

If a reusable component exists, extend it.

If a helper exists, improve it.

If a pattern exists, follow it.

Create new code only when the existing system cannot reasonably support the task.

Avoid duplicate versions of:

cards
buttons
filters
match logic
APS logic
source verification logic
layout wrappers
form validation
status badges
mock data structures
API utilities

If duplication is unavoidable, explain why in your report.

## 6. Preserve the Current Stack

The current Lovable stack is the active deployment stack.

Do not replace the stack without explicit approval.

Do not casually introduce a new framework, UI system, styling system, backend provider, database layer, deployment flow, or authentication structure.

Extend the existing system.

Respect the current architecture.

Preserve deployment compatibility.

## 7. Code Format

Write code that is readable, consistent, and easy to review.

Use clear names.

Prefer domain-specific names over vague names.

Good names:

programmeRequirements
qualificationStatus
matchExplanation
sourceVerification
fundingEligibility
alternativePathways

Weak names:

data
stuff
items
result2
newThing
finalLogic

Keep files focused.

If a file becomes too large, extract carefully into a named helper, component, or module.

Do not create clever code that only the current model understands.

## 8. Comments

Document code where it matters.

Comments should explain why something exists, not merely repeat what the code already says.

Good comments explain:

why a rule exists
why a decision was made
why a workaround is necessary
what must not be changed casually
which source or project rule affects the code

Avoid useless comments.

Bad:

increment count

Good:

Life Orientation is excluded here because this APS calculation follows the project’s current admission scoring rules.

If a model adds complex logic without comments, the work is incomplete.

## 9. Reports

Every model should leave a short completion report in its own markdown file.

The report should include:

Task completed
Files changed
What was added
What was reused
What was intentionally not changed
Any duplicated logic found
Any risks
Any follow-up needed
Testing done
Known limitations

This is important because multiple models may work on the same project. Reports help the next model understand the state of the codebase without guessing.

## 10. Commit Behaviour

Commits should be small and understandable.

One commit should represent one clear purpose.

Use simple commit messages:

feat(match): add grouped result explanations
fix(courses): correct filter state
docs(models): add model working rules
refactor(cards): reuse decision card component
security(auth): tighten learner profile access
test(match): add APS edge cases

Avoid vague commits:

update stuff
fix things
changes
new version
final final

For meaningful changes, include why the change was made.

## 11. Do Not Hide Uncertainty

If a model is unsure, it should say so in its report.

Do not pretend incomplete work is finished.

Do not present mock data as production data.

Do not hide missing source links, missing verification, incomplete security, or temporary logic.

Mark temporary work clearly.

Use language like:

Temporary prototype logic
Mock data only
Needs production verification
Requires human review
Not security-reviewed yet

## 12. Security Awareness

Do not expose secrets.

Do not hardcode API keys.

Do not weaken authentication, permissions, validation, or database rules for convenience.

Do not touch security-sensitive areas unless the task explicitly requires it.

Security-sensitive areas include:

authentication
learner profiles
saved marks
document uploads
admin roles
institution portals
database policies
public APIs
webhooks
environment variables
secrets

If a task touches security, flag it clearly in the report.

## 13. Testing

When changing logic, add or update tests where the project supports them.

At minimum, logic work should consider:

normal case
edge case
missing data
invalid input

If tests are not added, explain why.

Do not break existing tests silently.

## 14. Styling and UI Consistency

Do not create new visual patterns unnecessarily.

Reuse existing components and styles.

Keep UI simple, spacious, card-based, and readable.

Do not add clutter.

Do not add animations, colours, or layout complexity unless the task requires it.

UI work must preserve mobile usability.

## 15. Handoff Rule

Before finishing, each model must make the next model’s job easier.

That means:

leave readable code
leave useful comments
reuse existing structures
write a short report
name files clearly
avoid hidden side effects
document anything unfinished

The goal is not just to complete a task.

The goal is to complete it in a way that another model, another tool, or a human developer can safely continue from.

## 16. Final Rule

Before making a change, ask:

Does this keep the codebase simpler, clearer, more modular, or easier to continue?

If not, do not make the change without approval.
