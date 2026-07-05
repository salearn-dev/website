# SA Learn — Production-Ready Vision Specification

## 1. Document Purpose

This document defines the production-ready vision for **SA Learn**.

It exists as the official alignment mirror for the original SA Learn idea: a South African education platform that helps learners understand what they can study, where they can study, whether they qualify, how much it may cost, whether the path is accredited, what funding may apply, and what career or employment opportunities the path can lead to.

This document should be used by founders, developers, designers, AI builders, data engineers, institutions, counsellors, and product contributors as the source of truth for what SA Learn must become.

SA Learn must not become a generic learning platform.

SA Learn must not become a vague AI chatbot.

SA Learn must not become a course advertising directory.

SA Learn exists to make the South African post-matric journey clear, trustworthy, practical, and action-ready.

---

## 2. Product Identity

### Name

**SA Learn**

### Tagline

**Gain skills. Get qualified. Get hired.**

### Core Promise

SA Learn helps South African learners move from confusion to direction by matching their results, interests, location, budget, and goals against verified education and employment pathways.

### Mission

To make South African post-school opportunities as clear as daylight by organising fragmented education data into simple, verified, student-friendly decisions.

### Vision

A learner should be able to visit SA Learn on a phone, enter their marks or browse freely, and leave with a realistic understanding of:

* what they qualify for;
* what they almost qualify for;
* what alternatives are available;
* where they can study;
* how much it may cost;
* whether funding may be possible;
* whether the qualification or institution appears legitimate;
* what career direction the pathway can support;
* what they can apply for right now.

---

## 3. The Real-World Problem

Many South African learners finish matric or approach matric without a clear, organised view of their next step.

The issue is not always lack of ambition. Often the issue is scattered, inaccessible, outdated, overly complex, or poorly presented information.

A learner may need to check university websites, TVET college pages, private college pages, PDFs, bursary portals, NSFAS rules, SAQA records, DHET registers, career pages, and application deadlines separately. This creates confusion, especially for learners who do not have strong guidance at home or school.

SA Learn solves this by becoming a clarity layer over the post-school education system.

It does not replace official institutions.

It does not replace SAQA, DHET, NSFAS, SETAs, universities, TVET colleges, or registered providers.

It organises and explains verified information in a way that students can actually use.

SAQA’s official registered qualifications portal already exposes registered qualifications and unit standards, and states that qualifications and part-qualifications registered on the National Qualifications Framework are public property. SA Learn must treat this kind of official source as a core reference point, not as optional decoration.

DHET remains a central official ecosystem actor for post-school education and training, with public resources connected to universities, vocational education, SETAs, skills development, SAQA, NSFAS, QCTO, and related bodies. SA Learn must organise around this national education context.

---

## 4. Non-Negotiable Product Principles

### 4.1 Clarity First

Every screen must reduce confusion.

The learner should always understand:

* what the page is for;
* what action they can take;
* what information is verified;
* what information is missing;
* what step comes next.

No page should feel like an old education portal, a cluttered job board, or a government-style PDF dump.

### 4.2 Data Before AI

SA Learn is data-first and AI-assisted.

The database is the source of truth.

AI may explain, summarise, compare, translate, and guide, but it must not invent requirements, costs, deadlines, accreditation status, or funding eligibility.

When data is missing, the system must say:

**Information unavailable.**

It must never fill gaps with confident guesses.

### 4.3 Public Browsing Before Authentication

Learners must be able to browse without signing in.

No auth wall should block the core discovery experience.

Public users must be able to access:

* the landing page;
* course browsing;
* career browsing;
* institution browsing;
* funding guides;
* skills paths;
* opportunities;
* plain-language guides;
* at least one basic compatibility check.

Authentication should only be required for personal features such as saving results, saving courses, storing marks, reminders, application tracking, document uploads, or personal dashboards.

### 4.4 Trust Must Be Visible

Every important education record must show trust metadata.

This includes:

* source name;
* source URL;
* last verified date;
* accreditation or registration status where available;
* uncertainty labels where the data is incomplete;
* warnings where information may be outdated.

A learner should not need to guess whether a course is real.

### 4.5 Mobile-First South African Reality

SA Learn must be designed for real South African usage.

Many learners will use low-end Android phones, limited data, unstable connectivity, and small screens.

The production platform must prioritise:

* fast loading;
* compressed assets;
* offline-friendly guides where possible;
* no horizontal scrolling;
* readable text without zooming;
* large tap targets;
* simple forms;
* progressive disclosure;
* WhatsApp-friendly extensions later.

### 4.6 Employability Is Part of Education

SA Learn should not stop at “find a course.”

The platform must connect study paths to careers, skills, learnerships, bursaries, internships, apprenticeships, and entry-level opportunities.

The tagline is not decorative.

**Gain skills. Get qualified. Get hired.** must shape the whole product.

---

## 5. Who SA Learn Serves

### Primary Users

SA Learn primarily serves:

* Grade 10 learners choosing subjects or thinking ahead;
* Grade 11 learners preparing for applications;
* Grade 12 learners planning after matric;
* post-matric learners who are unsure what to do next;
* learners who did not qualify for their first-choice course;
* learners who need alternative routes;
* learners comparing university, TVET, private college, short course, skills programme, or learnership options.

### Secondary Users

SA Learn also serves:

* parents and guardians;
* teachers;
* school career advisors;
* NGO counsellors;
* libraries;
* youth centres;
* institutions;
* bursary providers;
* employers;
* government and education ecosystem partners.

### Emotional User State

SA Learn must be built with empathy for users who may feel:

* overwhelmed;
* behind;
* disappointed by results;
* unsure whether they qualify;
* afraid of choosing wrong;
* worried about money;
* unsure which institutions are trustworthy;
* confused by terms like APS, NQF, SAQA, DHET, NSFAS, diploma, higher certificate, learnership, accreditation, or articulation.

The product must respond with calm clarity, not pressure.

---

## 6. Core Production Experience

A production-ready SA Learn experience should support three main user behaviours.

### 6.1 Browse

A learner can browse courses, careers, institutions, funding options, skills, opportunities, and guides without logging in.

This is important because a confused user may not yet trust the platform enough to create an account.

### 6.2 Match

A learner can enter subjects, marks, location, interests, and constraints.

SA Learn returns:

* courses they qualify for;
* courses they almost qualify for;
* alternatives;
* bridging or improvement routes;
* funding possibilities;
* relevant skills;
* careers linked to the path.

The platform must explain why each result appears.

### 6.3 Act

A learner can move from information to action.

Actions may include:

* view official source;
* apply through institution site;
* save course;
* save career;
* save opportunity;
* create application checklist;
* set deadline reminder;
* generate PDF pathway report;
* share result with parent, teacher, or counsellor;
* continue learning a skill path.

---

## 7. Permanent Route Architecture

The production platform must preserve the selected route structure:

```txt
/
 /courses
 /match
 /careers
 /institutions
 /funding
 /skills
 /opportunities
 /guides
```

These routes are permanent conceptual pillars. Sub-routes may be added, but the core route model should remain stable.

---

## 8. Route Specifications

## 8.1 `/` — Welcome Page

### Purpose

Introduce SA Learn, establish trust, and guide users into the right next action.

### Real-World Use

A learner, parent, teacher, or counsellor lands here and must understand the platform within seconds.

### Required Sections

* SA Learn identity;
* tagline;
* short mission explanation;
* primary CTA: **Check My Options**;
* secondary CTA: **Browse Courses**;
* cards linking to Courses, Match, Funding, Careers, Skills, and Opportunities;
* short explanation of verified data;
* trust message;
* FAQ;
* footer with important links.

### Production Behaviour

If signed out, the homepage is a public welcome page.

If signed in, it may include a dashboard preview, but it must not hide public discovery behind authentication.

---

## 8.2 `/courses` — Course Explorer

### Purpose

Help learners discover study options across qualification types and institution types.

### Must Include

* public universities;
* universities of technology;
* TVET programmes;
* registered private institution offerings;
* short courses;
* learnerships;
* skills programmes;
* online or hybrid programmes;
* NQF-based browsing;
* SAQA-linked qualification references where available.

### Course Card Must Show

* course or programme name;
* institution/provider;
* qualification type;
* NQF level where available;
* duration;
* location or delivery mode;
* estimated cost where available;
* funding possibility;
* minimum entry requirements summary;
* accreditation or registration indicator;
* last verified date;
* CTA to view details.

### Course Detail Page Must Show

* full description;
* admission requirements;
* APS requirements where applicable;
* subject-specific requirements;
* fees or fee estimate;
* funding options;
* related careers;
* related skills;
* application deadline;
* official source link;
* verification metadata;
* missing-data warnings.

### Required Filters

* province;
* city;
* institution type;
* field of study;
* qualification type;
* NQF level;
* funding available;
* cost range;
* duration;
* delivery mode;
* application status;
* accepts Mathematics Literacy where relevant;
* no Mathematics requirement where relevant;
* open applications only.

---

## 8.3 `/match` — Results Compatibility Engine

### Purpose

This is the flagship feature.

It answers:

**What do I qualify for?**

### User Inputs

The matching flow should support:

* qualification context: Grade 11, Grade 12, post-matric, rewrite, other;
* subjects;
* marks;
* Mathematics or Mathematical Literacy distinction;
* home language and first additional language where needed;
* province;
* preferred study location;
* budget sensitivity;
* funding need;
* career interests;
* institution preference;
* willingness to relocate;
* preferred study mode;
* accessibility needs where applicable.

### Matching Outputs

The engine must return grouped results:

1. **You qualify**
2. **You almost qualify**
3. **Alternative paths**
4. **Improve your chances**
5. **Skills you can start now**
6. **Funding to check**
7. **Open opportunities linked to your path**

### Explanation Requirement

Every result must explain why.

Examples:

* “You meet the APS requirement.”
* “You meet English and Mathematics requirements.”
* “You are missing 4 APS points.”
* “This programme requires Mathematics, not Mathematical Literacy.”
* “Your Life Sciences mark is 58%; the listed minimum is 60%.”
* “This alternative path has a lower entry requirement.”
* “This qualification may provide a route into a diploma later.”

The system must never return a bare yes or no.

### Match Confidence

Each recommendation should include a confidence level based on data quality.

Example labels:

* **Verified match** — rules are complete and recently verified.
* **Partial match** — some requirements are known, but some are missing.
* **Needs confirmation** — learner should confirm with institution.
* **Data outdated** — record has not been verified recently.

### Server-Side Requirement

In production, the match engine must run server-side using versioned rules.

Admission rules change. The platform must store rule versions so that previous reports remain explainable.

---

## 8.4 `/careers` — Career Pathways

### Purpose

Help users begin from a career goal instead of a course name.

Many learners do not know which course they want. They may only know they like computers, helping people, business, health, law, design, or building things.

### Career Card Must Show

* career name;
* plain-language description;
* typical work activities;
* skills needed;
* subjects that help;
* possible study routes;
* related courses;
* related skills;
* possible entry-level roles;
* employability notes.

### Career Detail Page Must Include

* what the career involves;
* personality fit;
* school subjects that help;
* courses that can lead there;
* TVET routes;
* degree routes;
* diploma routes;
* higher certificate routes;
* skills-first routes;
* learnership or apprenticeship options where relevant;
* related careers;
* realistic pathway timeline.

### Required Design Pattern

Career pages should show multiple paths, not one “correct” path.

Example:

```txt
Software Developer

Route A: Degree
Route B: Diploma
Route C: Higher Certificate → Diploma
Route D: TVET ICT route
Route E: Skills + Portfolio + Internship
```

The goal is to show that rejection from one route does not mean the dream is dead.

---

## 8.5 `/institutions` — Verified Institution Directory

### Purpose

Help learners find safe, legitimate, understandable places to study.

### Institution Types

* public universities;
* universities of technology;
* TVET colleges;
* registered private higher education institutions;
* registered private colleges where applicable;
* community education and training institutions;
* skills development providers;
* online providers;
* training academies.

### Institution Card Must Show

* official name;
* institution type;
* province and campuses;
* public/private status;
* funding compatibility where available;
* number of courses listed on SA Learn;
* verification status;
* official website;
* last verified date.

### Institution Detail Page Must Include

* overview;
* campuses;
* official contact information;
* application windows;
* listed programmes;
* funding notes;
* accreditation or registration notes;
* source links;
* warnings if registration status is unclear or under review.

### Critical Requirement

SA Learn must never present an institution as safe or accredited without data support.

When status is unclear, say:

**Registration or accreditation status requires confirmation.**

---

## 8.6 `/funding` — Funding, NSFAS, Bursaries and Cost Clarity

### Purpose

Help learners understand how they may pay for education.

### Funding Categories

* NSFAS;
* bursaries;
* scholarships;
* learnership stipends;
* employer-funded programmes;
* SETA-linked funding;
* institution-specific funding;
* private funding;
* low-cost routes.

NSFAS’s 2026 eligibility criteria document explicitly covers conditions and criteria for financial aid, including citizenship/place of study, funded qualifications, financial eligibility, academic eligibility, allowances, appeals, and POPIA compliance sections. SA Learn’s funding logic must therefore treat funding guidance as rule-based and source-grounded, not as generic advice.

### Funding Card Must Show

* funding name;
* who it is for;
* what it may cover;
* eligibility summary;
* required documents;
* closing date;
* linked courses or fields;
* official application link;
* last verified date.

### Funding Wizard

A future production wizard should estimate possible funding fit using:

* citizenship or permanent-resident status;
* institution type;
* qualification type;
* household income band where appropriate;
* disability status where voluntarily provided;
* SASSA-related indicators where voluntarily provided;
* academic progression context;
* first-time or returning student status.

### Privacy Warning

Funding checks may involve sensitive personal information. SA Learn must collect the minimum data necessary and must obtain explicit consent before saving such information.

---

## 8.7 `/skills` — Job-Ready Skills

### Purpose

Help learners gain practical ability even before or alongside formal study.

### Skill Categories

* digital literacy;
* coding;
* Microsoft Office or productivity tools;
* communication;
* customer service;
* sales;
* bookkeeping;
* design;
* marketing;
* entrepreneurship;
* AI literacy;
* cybersecurity basics;
* technical trades;
* work readiness;
* CV and interview skills.

### Skill Card Must Show

* skill name;
* difficulty level;
* estimated learning time;
* free resources;
* paid resources where relevant;
* certificate availability;
* related careers;
* related courses;
* practice projects;
* portfolio tasks.

### Production Behaviour

Skills should connect back to courses and careers.

Example:

```txt
Digital Literacy → Office Administration → Business Studies
Coding → Software Developer → ICT Courses
Communication → Sales / Support → Learnerships
```

SA Learn must treat skills as employability bridges, not motivational content.

---

## 8.8 `/opportunities` — Live Opportunity Board

### Purpose

Show real opportunities that learners can act on now.

### Opportunity Types

* open university applications;
* TVET applications;
* bursaries;
* scholarships;
* learnerships;
* internships;
* apprenticeships;
* entry-level jobs;
* youth programmes;
* skills programmes;
* graduate programmes.

### Opportunity Card Must Show

* opportunity title;
* provider;
* location;
* remote/onsite status;
* requirements;
* closing date;
* paid/unpaid/stipend status;
* field;
* application link;
* verification status;
* last verified date.

### Required Filters

* province;
* field;
* closing soon;
* no experience required;
* matric required;
* remote;
* paid/stipend;
* age requirement;
* qualification requirement;
* open now.

### Stale Record Rule

Opportunities become harmful when outdated.

Any opportunity past its closing date must be:

* automatically hidden from default results; or
* moved to expired state;
* clearly labelled as closed.

---

## 8.9 `/guides` — Plain-Language Education Guides

### Purpose

Explain confusing concepts in simple language.

### Required Guide Topics

* What is APS?
* What is NQF?
* What is SAQA?
* What is DHET?
* What is NSFAS?
* What is a TVET college?
* University vs University of Technology vs TVET
* Degree vs Diploma vs Higher Certificate
* What is a learnership?
* What is accreditation?
* How to avoid fake colleges
* How applications work
* What documents do learners need?
* What if I do not qualify?
* Mathematics vs Mathematical Literacy
* How to choose subjects
* How to compare courses
* How to prepare for employment.

### Guide Format

Each guide must use:

* plain English;
* short sections;
* examples;
* decision cards;
* related courses;
* related careers;
* related funding;
* official source links;
* last reviewed date.

Guides must not become long walls of text.

---

## 9. Production Data Model

A production-ready SA Learn needs structured data, not hardcoded content.

### Core Tables or Collections

#### learners

Stores user identity only when account creation is used.

Fields may include:

* user ID;
* name;
* email or phone;
* province;
* preferred language;
* role;
* consent records.

#### learner_profiles

Stores optional learner education profile.

Fields may include:

* grade or post-matric status;
* subjects;
* marks;
* interests;
* preferred provinces;
* budget sensitivity;
* funding need;
* saved career goals.

Marks must only be saved with explicit consent.

#### institutions

Fields:

* official name;
* institution type;
* public/private;
* province;
* campuses;
* website;
* contact details;
* registration/accreditation references;
* source URL;
* source name;
* last verified date;
* status.

#### courses

Fields:

* course name;
* institution ID;
* qualification type;
* NQF level;
* SAQA qualification ID where available;
* field of study;
* duration;
* delivery mode;
* campus;
* cost estimate;
* funding compatibility;
* application deadline;
* official page URL;
* last verified date;
* status.

#### programme_requirements

Fields:

* course ID;
* minimum APS;
* required subjects;
* minimum subject marks;
* language requirements;
* Mathematics vs Mathematical Literacy rules;
* NBT or additional test rules;
* faculty-specific rules;
* year of rule;
* rule version;
* source URL;
* last verified date.

#### careers

Fields:

* career name;
* description;
* skills;
* subjects that help;
* related courses;
* related qualifications;
* entry-level roles;
* long-term roles;
* industry category;
* demand notes;
* source references.

#### skills

Fields:

* skill name;
* category;
* difficulty;
* estimated learning time;
* related careers;
* related courses;
* resources;
* project ideas;
* certificate notes.

#### funding_options

Fields:

* funding name;
* provider;
* eligibility rules;
* covered costs;
* required documents;
* application deadline;
* linked fields;
* linked institution types;
* official URL;
* last verified date.

#### opportunities

Fields:

* title;
* provider;
* type;
* province;
* requirements;
* closing date;
* application link;
* stipend or paid indicator;
* field;
* source;
* last verified date;
* status.

#### guides

Fields:

* title;
* slug;
* topic;
* content;
* related routes;
* official sources;
* reviewed by;
* last reviewed date;
* publish status.

#### source_records

Every imported or manually verified record should connect to source tracking.

Fields:

* source name;
* source URL;
* source type;
* retrieval method;
* retrieved at;
* verified by;
* verification status;
* notes.

---

## 10. Matching Engine Specification

The match engine is the heart of SA Learn.

### Required Inputs

```txt
subjects
marks
qualification context
location
interests
budget sensitivity
funding need
institution preferences
study mode preference
```

### Required Outputs

```txt
qualify[]
almost[]
alternative[]
skills[]
funding[]
opportunities[]
warnings[]
```

### Matching Logic

The engine must evaluate:

* APS score;
* subject requirements;
* minimum marks;
* Mathematics vs Mathematical Literacy;
* language requirements;
* institution-specific rules;
* faculty-specific rules;
* NQF level fit;
* funding possibility;
* location preference;
* application status;
* missing data;
* outdated data;
* alternative paths.

### Result Explanation Object

Every returned item should include:

```txt
result_type
reason
requirements_met[]
requirements_missing[]
confidence_level
source_references[]
next_step
```

### Example Output Behaviour

Instead of:

```txt
You do not qualify.
```

SA Learn should say:

```txt
You do not currently meet the listed requirements for this programme.

Missing:
- Mathematics minimum: 60%
- Your Mathematics mark: 52%

Possible next steps:
- Consider a related diploma with a lower Mathematics requirement.
- Consider a higher certificate route.
- Consider improving Mathematics through a rewrite.
- Confirm with the institution before applying.
```

This is central to SA Learn’s identity.

The product must turn disappointment into direction.

---

## 11. AI Layer Specification

AI is allowed, but controlled.

### AI May Do

* explain match results;
* simplify education terms;
* compare courses;
* summarise institution pages;
* create personalised pathway explanations;
* translate guides into supported languages;
* generate checklists;
* answer questions from verified SA Learn data;
* help counsellors understand learner options.

### AI Must Not Do

* invent course requirements;
* invent fees;
* invent funding eligibility;
* invent accreditation status;
* claim an institution is registered without evidence;
* guarantee admission;
* guarantee funding;
* guarantee employment;
* override official source data.

### Required AI Behaviour

The AI assistant must use retrieval from SA Learn’s verified database before answering factual questions.

If the answer is not in the database, it must say:

**I do not have verified information for that yet.**

### AI Tone

The AI should sound:

* clear;
* calm;
* practical;
* encouraging;
* honest;
* not overly formal;
* not childish;
* not motivational without substance.

---

## 12. UI and Design Vision

SA Learn should feel like a calm decision-making tool.

### Visual Style

* lots of whitespace;
* clean card grids;
* large readable text;
* minimal icons;
* subtle shadows;
* soft borders;
* no clutter;
* no dense tables on mobile;
* no overwhelming colour;
* no unnecessary animations.

### UI Personality

The product should feel:

* trustworthy;
* modern;
* helpful;
* student-friendly;
* public-service quality;
* clean enough for government or schools;
* simple enough for any learner.

### Core Components

#### Decision Card

Used to show the important answer quickly.

Examples:

```txt
You qualify
Almost qualify
Alternative path
Funding possible
Deadline closing soon
Verified source
Information unavailable
```

#### Course Card

Summarises study options.

#### Career Path Card

Shows routes into a career.

#### Institution Card

Shows verified places to study.

#### Funding Card

Shows eligibility and deadlines.

#### Opportunity Card

Shows what can be applied for now.

#### Guide Card

Explains confusing topics.

### Progressive Disclosure

SA Learn must show:

```txt
Summary first
Details second
Sources third
```

This prevents clutter while preserving trust.

---

## 13. Trust, Safety, Legal and Compliance

### POPIA

SA Learn will process personal information if it stores learner profiles, marks, IDs, funding documents, or application tracking data.

The Information Regulator identifies POPIA as South Africa’s privacy law context, and SA Learn must treat privacy, consent, lawful processing, access control, and user rights as production requirements, not afterthoughts.

### Required Privacy Standards

* explicit consent for saving marks;
* explicit consent for document uploads;
* minimum data collection;
* clear privacy policy;
* ability to delete account data;
* secure authentication;
* encrypted sensitive data where appropriate;
* role-based access control;
* audit logs for admin access;
* no public exposure of learner profiles;
* no selling of learner data.

### Security Standards

* server-side validation;
* rate limiting;
* bot protection on public endpoints;
* row-level security;
* secure file storage;
* signed webhooks;
* admin approval for institution-submitted changes;
* source verification workflow;
* abuse reporting;
* monitoring and alerts.

### Education Disclaimer

SA Learn must clearly state:

* it helps users understand options;
* it does not replace official institution admission decisions;
* it does not guarantee acceptance;
* it does not guarantee funding;
* users should confirm critical details with the official provider before applying.

---

## 14. Data Operations and Verification

A production SA Learn needs a data operations workflow.

### Data Sources

Sources may include:

* SAQA registered qualifications;
* DHET registers;
* public university pages;
* university of technology pages;
* TVET college pages;
* registered private institution pages;
* NSFAS criteria;
* SETA learnership data;
* bursary provider pages;
* employer opportunity feeds;
* official PDFs;
* institution partner submissions.

### Verification Workflow

Every record should move through states:

```txt
imported
needs review
verified
published
stale
archived
rejected
```

### Last Verified Rule

Every course, institution, funding option, and opportunity should display a last verified date.

If a record has not been verified within the defined freshness window, it should be flagged.

Suggested freshness windows:

* opportunities: daily or weekly;
* funding deadlines: weekly during application seasons;
* course requirements: every application cycle;
* institution status: monthly or quarterly;
* guides: quarterly or when policy changes.

### Human Review

Critical education records should not be published purely by automated ingestion.

Human or trusted admin review is required for:

* accreditation status;
* institution registration;
* fees;
* funding eligibility rules;
* admission requirements;
* closing dates;
* warnings;
* legal/privacy content.

---

## 15. Accessibility and Language

SA Learn must be accessible by design.

### Accessibility Requirements

* WCAG 2.1 AA target;
* keyboard navigation;
* visible focus states;
* sufficient colour contrast;
* screen-reader-friendly labels;
* form error messages in plain language;
* large tap targets;
* mobile-first layout;
* no essential information conveyed by colour alone.

### Language Strategy

Initial production language may be English.

The platform should be architected for multilingual support.

Priority languages may include:

* English;
* isiZulu;
* isiXhosa;
* Afrikaans;
* Sesotho.

Language support must not be treated as a simple translation layer only. Education terms need careful explanation in each language.

---

## 16. Performance and Technical Expectations

SA Learn must be fast and reliable.

### Frontend Requirements

* server-rendered or statically generated public pages where possible;
* SEO-friendly course, career, institution, funding, and guide pages;
* responsive layout;
* low JavaScript burden on public pages;
* optimised images;
* accessible components;
* reusable design system;
* PWA support where useful.

### Backend Requirements

* structured database;
* authenticated user profiles;
* server-side match engine;
* role-based access;
* data ingestion pipeline;
* moderation workflow;
* AI retrieval layer;
* PDF report generation;
* reminders;
* analytics;
* admin dashboard;
* institution portal.

### API Requirements

Production should expose internal APIs for:

* course search;
* institution search;
* match results;
* funding checks;
* opportunity feeds;
* guide content;
* saved items;
* application tracking.

Later, SA Learn may expose public or partner APIs, but only after data governance is mature.

---

## 17. SEO and Public Discovery

SA Learn should be discoverable through search engines.

Every public page should have:

* unique title;
* meta description;
* canonical URL;
* structured data where appropriate;
* clean slug;
* fast load;
* internal links;
* source links;
* readable content;
* FAQ sections where relevant.

SEO target pages include:

* course pages;
* career pages;
* institution pages;
* funding guides;
* education explainers;
* opportunity pages.

SA Learn should become the page a learner finds when searching:

```txt
What can I study with my matric marks?
What is APS?
What is NQF?
How do I apply for NSFAS?
TVET colleges near me
Courses that accept Maths Literacy
What can I study without Mathematics?
How to become a software developer in South Africa
```

---

## 18. Admin and Institution Portal

### Admin Portal

Admins need tools to:

* review imported data;
* approve course records;
* flag outdated information;
* manage institutions;
* manage guides;
* manage funding options;
* moderate institution submissions;
* view reports;
* handle user feedback;
* audit source changes.

### Institution Portal

Verified institution users may be allowed to:

* claim institution profile;
* suggest updates;
* add application windows;
* update programme pages;
* upload official documents;
* respond to data issues.

However, institution changes should not automatically publish without moderation unless trust agreements exist.

---

## 19. Student Account Features

Accounts are optional for browsing, but useful for personal planning.

### Signed-In Learner Features

* saved marks;
* saved courses;
* saved careers;
* saved institutions;
* saved funding options;
* application checklist;
* reminders;
* PDF reports;
* progress on skills;
* shared counsellor view;
* profile deletion;
* consent management.

### Dashboard

The signed-in dashboard should show:

* current pathway summary;
* upcoming deadlines;
* saved opportunities;
* match results;
* recommended next steps;
* skills in progress;
* funding tasks;
* application checklist.

The dashboard must feel calm, not like an enterprise admin panel.

---

## 20. Counsellor, School and NGO Features

SA Learn should eventually support guided usage.

### Counsellors Should Be Able To

* help learners complete profiles;
* compare options;
* generate reports;
* view shared learner plans with consent;
* recommend careers or courses;
* track school-level usage without exposing private learner data unnecessarily.

### Schools and NGOs

Schools and NGOs may receive:

* anonymised insights;
* workshop tools;
* downloadable guides;
* learner pathway templates;
* career day resources.

---

## 21. Success Metrics

SA Learn should measure clarity, not vanity.

### Core Metrics

* number of users completing match flow;
* percentage of users receiving at least one qualifying path;
* percentage of users receiving alternative paths;
* saved courses;
* saved funding options;
* applications started;
* opportunities clicked;
* guides read;
* PDF reports generated;
* returning users;
* verified data coverage;
* stale records;
* source completeness.

### Trust Metrics

* percentage of course records with source URL;
* percentage of course records with last verified date;
* percentage of institution records verified;
* number of stale records;
* number of user-reported data issues;
* average time to correct data issues.

### Outcome Metrics

Long-term outcome measurement may include:

* applications completed;
* bursary applications started;
* learnership applications started;
* skills tracks completed;
* users who report acceptance;
* users who report employment;
* counsellor-reported usefulness.

---

## 22. What SA Learn Is Not

SA Learn is not:

* a replacement for official applications;
* a replacement for official admission decisions;
* a replacement for NSFAS;
* a university;
* a private college;
* a generic online course marketplace;
* a motivational blog;
* a fake “AI knows your future” tool;
* a job board with education branding;
* a directory that accepts unverified listings.

SA Learn is a verified guidance and pathway platform.

---

## 23. Production Roadmap Philosophy

The correct production sequence is:

### Phase 1 — Trustworthy Prototype

* clean UI;
* selected routes;
* static but realistic data;
* basic match engine;
* source fields visible;
* public browsing;
* mobile-first design.

### Phase 2 — Structured Data

* real database;
* real course records;
* source tracking;
* verification workflow;
* admin dashboard;
* server-side match engine.

### Phase 3 — Live Guidance

* saved learner profiles;
* PDF reports;
* funding checker;
* opportunity ingestion;
* reminders;
* AI explanation layer.

### Phase 4 — Ecosystem Growth

* institution portal;
* counsellor accounts;
* school/NGO tools;
* multilingual UI;
* WhatsApp interface;
* offline-friendly resources;
* partner integrations.

### Phase 5 — Employability Loop

* skill tracks;
* certificates where valid;
* employer partnerships;
* learnership feeds;
* internship and entry-level job pathways;
* portfolio and CV support.

---

## 24. Absolute Alignment Statement

SA Learn exists because South African learners deserve clear access to education and career opportunities.

The original problem was not that students have no dreams.

The problem was that the information needed to act on those dreams is scattered, unclear, hidden behind old websites, locked inside PDFs, written in confusing language, or disconnected from real-world outcomes.

A production-ready SA Learn must solve that exact problem.

It must help a learner answer:

```txt
What can I study?
What do I qualify for?
What am I close to qualifying for?
What alternatives do I have?
Where can I study safely?
How much might it cost?
Can I get funding?
What career can this lead to?
What skills can I build now?
What can I apply for today?
```

If SA Learn answers those questions clearly, honestly, and with verified data, it is aligned.

If it becomes cluttered, generic, unverified, overly AI-dependent, locked behind accounts, or disconnected from employment, it has drifted from the original vision.

The measure of success is not the amount of data stored in SA Learn.

The measure of success is how clearly SA Learn turns complex South African education information into confident next steps for real learners.
