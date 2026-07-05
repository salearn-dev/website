// Static demo data for SA Learn prototype v1.
// All values are illustrative. Real deployment requires verification against
// SAQA / DHET / institutional sources before display.

export const LAST_VERIFIED = "Not yet verified";

export type TrustMeta = {
  sourceName: string;
  sourceUrl: string;
  lastVerifiedAt: string;
  verificationStatus: "Prototype data" | "Needs confirmation" | "Verified";
};

export type Course = {
  slug: string;
  title: string;
  institution: string;
  qualification: string;
  nqf: number;
  duration: string;
  cost: string;
  funding: string;
  careers: string[];
  province: string;
  category: string;
  accreditation: string;
  trust: TrustMeta;
};

export const COURSE_CATEGORIES = [
  { slug: "universities", title: "Universities", desc: "Degrees at public and private universities.", count: 26 },
  { slug: "tvet", title: "TVET Colleges", desc: "Practical, career-focused qualifications.", count: 50 },
  { slug: "private-colleges", title: "Private Colleges", desc: "Registered private higher education.", count: 32 },
  { slug: "short-courses", title: "Short Courses", desc: "Weeks to months. Fast upskilling.", count: 180 },
  { slug: "learnerships", title: "Learnerships", desc: "Earn while you learn, SETA-supported.", count: 64 },
  { slug: "skills-programmes", title: "Skills Programmes", desc: "Focused skill units, part-qualifications.", count: 48 },
  { slug: "certifications", title: "Professional Certifications", desc: "Industry certificates that employers value.", count: 40 },
  { slug: "online", title: "Online Courses", desc: "Learn from home, at your pace.", count: 120 },
];

export const COURSES: Course[] = [
  {
    slug: "hcert-it-wsu",
    title: "Higher Certificate in Information Technology",
    institution: "Walter Sisulu University",
    qualification: "Higher Certificate",
    nqf: 5,
    duration: "1 year",
    cost: "Information unavailable",
    funding: "NSFAS possible",
    careers: ["Junior Developer", "IT Support", "Systems Assistant"],
    province: "Eastern Cape",
    category: "universities",
    accreditation: "DHET registered",
    trust: {
      sourceName: "Prototype seed data",
      sourceUrl: "https://www.wsu.ac.za/",
      lastVerifiedAt: LAST_VERIFIED,
      verificationStatus: "Needs confirmation",
    },
  },
  {
    slug: "dip-nursing-ul",
    title: "Diploma in Nursing",
    institution: "University of Limpopo",
    qualification: "Diploma",
    nqf: 6,
    duration: "3 years",
    cost: "Information unavailable",
    funding: "NSFAS possible",
    careers: ["Registered Nurse", "Clinical Assistant"],
    province: "Limpopo",
    category: "universities",
    accreditation: "SANC accredited",
    trust: {
      sourceName: "Prototype seed data",
      sourceUrl: "https://www.ul.ac.za/",
      lastVerifiedAt: LAST_VERIFIED,
      verificationStatus: "Needs confirmation",
    },
  },
  {
    slug: "nc-electrical-tvet",
    title: "National Certificate: Electrical Infrastructure",
    institution: "False Bay TVET College",
    qualification: "National Certificate (Vocational)",
    nqf: 4,
    duration: "3 years",
    cost: "Information unavailable",
    funding: "NSFAS supported",
    careers: ["Electrician", "Electrical Technician"],
    province: "Western Cape",
    category: "tvet",
    accreditation: "DHET / QCTO",
    trust: {
      sourceName: "Prototype seed data",
      sourceUrl: "https://www.falsebaycollege.co.za/",
      lastVerifiedAt: LAST_VERIFIED,
      verificationStatus: "Needs confirmation",
    },
  },
  {
    slug: "bcom-accounting-up",
    title: "BCom Accounting",
    institution: "University of Pretoria",
    qualification: "Degree",
    nqf: 7,
    duration: "3 years",
    cost: "Information unavailable",
    funding: "Bursaries available",
    careers: ["Accountant", "Auditor", "Financial Analyst"],
    province: "Gauteng",
    category: "universities",
    accreditation: "SAICA accredited",
    trust: {
      sourceName: "Prototype seed data",
      sourceUrl: "https://www.up.ac.za/",
      lastVerifiedAt: LAST_VERIFIED,
      verificationStatus: "Needs confirmation",
    },
  },
  {
    slug: "short-digital-marketing",
    title: "Digital Marketing Fundamentals",
    institution: "Online (Google)",
    qualification: "Short Course",
    nqf: 0,
    duration: "6 weeks",
    cost: "Free",
    funding: "Free",
    careers: ["Marketing Assistant", "Social Media Coordinator"],
    province: "Online",
    category: "short-courses",
    accreditation: "Google Certificate",
    trust: {
      sourceName: "Prototype seed data",
      sourceUrl: "https://grow.google/",
      lastVerifiedAt: LAST_VERIFIED,
      verificationStatus: "Needs confirmation",
    },
  },
  {
    slug: "learnership-plumbing",
    title: "Plumbing Learnership (NQF 3)",
    institution: "MerSETA partner",
    qualification: "Learnership",
    nqf: 3,
    duration: "12 months",
    cost: "Stipend paid",
    funding: "Employer / SETA funded",
    careers: ["Plumber", "Site Assistant"],
    province: "Nationwide",
    category: "learnerships",
    accreditation: "QCTO registered",
    trust: {
      sourceName: "Prototype seed data",
      sourceUrl: "https://www.merseta.org.za/",
      lastVerifiedAt: LAST_VERIFIED,
      verificationStatus: "Needs confirmation",
    },
  },
];

export type Career = {
  slug: string;
  title: string;
  short: string;
  demand: "High" | "Growing" | "Stable";
  salary: string;
  fit: string[];
  subjects: string[];
  routes: string[];
  skills: string[];
};

export const CAREERS: Career[] = [
  { slug: "software-developer", title: "Software Developer", short: "Build websites, apps and digital systems.", demand: "High", salary: "R15k–R60k / month", fit: ["Problem solver", "Detail-focused", "Curious"], subjects: ["Mathematics", "English"], routes: ["Degree", "Diploma", "Higher Certificate", "Skills Programme"], skills: ["Coding", "Problem-solving", "Teamwork"] },
  { slug: "teacher", title: "Teacher", short: "Educate learners at foundation, primary or high school level.", demand: "High", salary: "R18k–R40k / month", fit: ["Patient", "Communicative"], subjects: ["English", "Two teaching subjects"], routes: ["BEd Degree", "PGCE"], skills: ["Communication", "Planning", "Empathy"] },
  { slug: "lawyer", title: "Lawyer", short: "Advise, represent and protect clients under South African law.", demand: "Stable", salary: "R20k–R80k / month", fit: ["Analytical", "Articulate"], subjects: ["English", "History useful"], routes: ["LLB Degree", "Articles"], skills: ["Writing", "Research", "Argumentation"] },
  { slug: "electrician", title: "Electrician", short: "Install and maintain electrical systems in homes and industry.", demand: "High", salary: "R12k–R35k / month", fit: ["Practical", "Safety-minded"], subjects: ["Mathematics", "Physical Sciences"], routes: ["NCV Electrical", "Apprenticeship", "Trade Test"], skills: ["Wiring", "Reading diagrams", "Safety"] },
  { slug: "accountant", title: "Accountant", short: "Manage financial records, taxes and reporting for organisations.", demand: "Stable", salary: "R18k–R60k / month", fit: ["Numerate", "Ethical"], subjects: ["Mathematics", "Accounting"], routes: ["BCom Accounting", "SAICA / SAIPA Articles"], skills: ["Excel", "Reporting", "Tax"] },
  { slug: "nurse", title: "Nurse", short: "Care for patients in hospitals, clinics and communities.", demand: "High", salary: "R14k–R35k / month", fit: ["Caring", "Resilient"], subjects: ["Life Sciences", "English"], routes: ["Diploma in Nursing", "BCur Degree"], skills: ["Clinical care", "Communication", "Empathy"] },
  { slug: "graphic-designer", title: "Graphic Designer", short: "Create visual communication for brands and campaigns.", demand: "Growing", salary: "R10k–R35k / month", fit: ["Creative", "Visual"], subjects: ["Visual Arts helpful"], routes: ["Diploma", "Short Courses", "Portfolio"], skills: ["Illustrator", "Photoshop", "Typography"] },
  { slug: "business-analyst", title: "Business Analyst", short: "Translate business problems into data-driven solutions.", demand: "Growing", salary: "R25k–R70k / month", fit: ["Analytical", "Communicative"], subjects: ["Mathematics", "English"], routes: ["BCom", "BSc Information Systems"], skills: ["SQL", "Excel", "Requirements analysis"] },
  { slug: "cyber-security-analyst", title: "Cyber Security Analyst", short: "Defend organisations from digital threats and attacks.", demand: "High", salary: "R25k–R80k / month", fit: ["Detail-focused", "Curious"], subjects: ["Mathematics"], routes: ["Degree", "Certifications (CompTIA, CISSP)"], skills: ["Networks", "Security tools", "Incident response"] },
];

export type Institution = {
  slug: string;
  name: string;
  type: string;
  province: string;
  courses: number;
  funding: string;
  website: string;
  trust: TrustMeta;
};

export const INSTITUTIONS: Institution[] = [
  { slug: "uct", name: "University of Cape Town", type: "Public University", province: "Western Cape", courses: 127, funding: "NSFAS supported", website: "uct.ac.za", trust: { sourceName: "Prototype seed data", sourceUrl: "https://www.uct.ac.za/", lastVerifiedAt: LAST_VERIFIED, verificationStatus: "Needs confirmation" } },
  { slug: "wits", name: "University of the Witwatersrand", type: "Public University", province: "Gauteng", courses: 140, funding: "NSFAS supported", website: "wits.ac.za", trust: { sourceName: "Prototype seed data", sourceUrl: "https://www.wits.ac.za/", lastVerifiedAt: LAST_VERIFIED, verificationStatus: "Needs confirmation" } },
  { slug: "up", name: "University of Pretoria", type: "Public University", province: "Gauteng", courses: 155, funding: "NSFAS supported", website: "up.ac.za", trust: { sourceName: "Prototype seed data", sourceUrl: "https://www.up.ac.za/", lastVerifiedAt: LAST_VERIFIED, verificationStatus: "Needs confirmation" } },
  { slug: "ukzn", name: "University of KwaZulu-Natal", type: "Public University", province: "KwaZulu-Natal", courses: 130, funding: "NSFAS supported", website: "ukzn.ac.za", trust: { sourceName: "Prototype seed data", sourceUrl: "https://www.ukzn.ac.za/", lastVerifiedAt: LAST_VERIFIED, verificationStatus: "Needs confirmation" } },
  { slug: "cput", name: "Cape Peninsula University of Technology", type: "University of Technology", province: "Western Cape", courses: 98, funding: "NSFAS supported", website: "cput.ac.za", trust: { sourceName: "Prototype seed data", sourceUrl: "https://www.cput.ac.za/", lastVerifiedAt: LAST_VERIFIED, verificationStatus: "Needs confirmation" } },
  { slug: "false-bay", name: "False Bay TVET College", type: "TVET College", province: "Western Cape", courses: 42, funding: "NSFAS supported", website: "falsebaycollege.co.za", trust: { sourceName: "Prototype seed data", sourceUrl: "https://www.falsebaycollege.co.za/", lastVerifiedAt: LAST_VERIFIED, verificationStatus: "Needs confirmation" } },
  { slug: "ekurhuleni-east", name: "Ekurhuleni East TVET College", type: "TVET College", province: "Gauteng", courses: 38, funding: "NSFAS supported", website: "eec.edu.za", trust: { sourceName: "Prototype seed data", sourceUrl: "https://www.eec.edu.za/", lastVerifiedAt: LAST_VERIFIED, verificationStatus: "Needs confirmation" } },
  { slug: "boston", name: "Boston City Campus", type: "Private College", province: "Nationwide", courses: 60, funding: "Private funding", website: "boston.co.za", trust: { sourceName: "Prototype seed data", sourceUrl: "https://www.boston.co.za/", lastVerifiedAt: LAST_VERIFIED, verificationStatus: "Needs confirmation" } },
];

export const FUNDING = [
  { slug: "nsfas", name: "NSFAS", short: "National Student Financial Aid Scheme", eligibility: "SA citizens with combined household income under R350,000/year (R600,000 for students with disabilities).", coverage: "Tuition, accommodation, allowances at public universities and TVET colleges.", best: "Students needing full financial support.", deadline: "Annual - see nsfas.org.za", trust: { sourceName: "NSFAS", sourceUrl: "https://www.nsfas.org.za/", lastVerifiedAt: LAST_VERIFIED, verificationStatus: "Needs confirmation" } },
  { slug: "funza-lushaka", name: "Funza Lushaka Bursary", short: "For future teachers", eligibility: "Studying a BEd or PGCE in priority subjects.", coverage: "Full tuition, accommodation, meals, stipend.", best: "Aspiring teachers.", deadline: "Annual - see funzalushaka.doe.gov.za", trust: { sourceName: "Funza Lushaka", sourceUrl: "https://www.funzalushaka.doe.gov.za/", lastVerifiedAt: LAST_VERIFIED, verificationStatus: "Needs confirmation" } },
  { slug: "sasol", name: "Sasol Bursary", short: "Engineering and sciences", eligibility: "Grade 12 or first-year students in engineering/science with strong marks.", coverage: "Tuition, accommodation, laptop, stipend.", best: "STEM students.", deadline: "March/April annually", trust: { sourceName: "Sasol", sourceUrl: "https://www.sasolbursaries.com/", lastVerifiedAt: LAST_VERIFIED, verificationStatus: "Needs confirmation" } },
  { slug: "eskom", name: "Eskom Bursary", short: "Energy and engineering", eligibility: "Engineering and technical fields with strong maths and science.", coverage: "Full study costs plus vacation work.", best: "Engineering students.", deadline: "Annual", trust: { sourceName: "Eskom", sourceUrl: "https://www.eskom.co.za/", lastVerifiedAt: LAST_VERIFIED, verificationStatus: "Needs confirmation" } },
  { slug: "seta-learnership", name: "SETA Learnerships", short: "Earn while you learn", eligibility: "Unemployed youth, matric usually required.", coverage: "Stipend during learnership.", best: "School-leavers seeking workplace experience.", deadline: "Rolling per SETA", trust: { sourceName: "SETAs", sourceUrl: "https://www.dhet.gov.za/SitePages/SETAlinks.aspx", lastVerifiedAt: LAST_VERIFIED, verificationStatus: "Needs confirmation" } },
  { slug: "employer", name: "Employer Bursaries", short: "Company-sponsored study", eligibility: "Varies per employer.", coverage: "Full or partial tuition, often bonded.", best: "Students willing to work back years.", deadline: "Varies", trust: { sourceName: "Provider websites", sourceUrl: "https://www.gov.za/services/education-and-training", lastVerifiedAt: LAST_VERIFIED, verificationStatus: "Prototype data" } },
];

export const SKILLS = [
  { slug: "programming", name: "Programming", diff: "Beginner–Advanced", time: "3–12 months", careers: ["Developer", "Data Analyst"] },
  { slug: "digital-literacy", name: "Digital Literacy", diff: "Beginner", time: "2–4 weeks", careers: ["Any office role"] },
  { slug: "communication", name: "Communication", diff: "Beginner", time: "Ongoing", careers: ["All careers"] },
  { slug: "ms-office", name: "Microsoft Office", diff: "Beginner", time: "4–8 weeks", careers: ["Admin", "Analyst"] },
  { slug: "design", name: "Design", diff: "Beginner–Intermediate", time: "2–6 months", careers: ["Designer", "Marketer"] },
  { slug: "business", name: "Business", diff: "Beginner–Intermediate", time: "1–3 months", careers: ["Manager", "Analyst"] },
  { slug: "entrepreneurship", name: "Entrepreneurship", diff: "Ongoing", time: "Ongoing", careers: ["Founder", "Freelancer"] },
  { slug: "marketing", name: "Marketing", diff: "Beginner–Intermediate", time: "2–4 months", careers: ["Marketer", "Brand Assistant"] },
  { slug: "ai", name: "AI", diff: "Intermediate", time: "3–6 months", careers: ["AI Practitioner", "Analyst"] },
  { slug: "cyber-security", name: "Cyber Security", diff: "Intermediate–Advanced", time: "6–12 months", careers: ["Security Analyst"] },
];

export const OPPORTUNITIES = [
  { id: "op1", title: "University of Cape Town - 2027 Undergraduate Applications", category: "University Applications", province: "Western Cape", closes: "30 September", paid: false, trust: { sourceName: "UCT", sourceUrl: "https://www.uct.ac.za/", lastVerifiedAt: LAST_VERIFIED, verificationStatus: "Needs confirmation" } },
  { id: "op2", title: "False Bay TVET College - Trimester Intake", category: "TVET Applications", province: "Western Cape", closes: "Rolling", paid: false, trust: { sourceName: "False Bay TVET College", sourceUrl: "https://www.falsebaycollege.co.za/", lastVerifiedAt: LAST_VERIFIED, verificationStatus: "Needs confirmation" } },
  { id: "op3", title: "MerSETA Plumbing Learnership", category: "Learnerships", province: "Gauteng", closes: "15 August", paid: true, trust: { sourceName: "MerSETA", sourceUrl: "https://www.merseta.org.za/", lastVerifiedAt: LAST_VERIFIED, verificationStatus: "Needs confirmation" } },
  { id: "op4", title: "Standard Bank Graduate Programme", category: "Graduate Programmes", province: "Nationwide", closes: "31 July", paid: true, trust: { sourceName: "Standard Bank", sourceUrl: "https://www.standardbank.com/", lastVerifiedAt: LAST_VERIFIED, verificationStatus: "Needs confirmation" } },
  { id: "op5", title: "Investec IT Internship", category: "Internships", province: "Western Cape", closes: "10 August", paid: true, trust: { sourceName: "Investec", sourceUrl: "https://www.investec.com/", lastVerifiedAt: LAST_VERIFIED, verificationStatus: "Needs confirmation" } },
  { id: "op6", title: "Sasol Engineering Bursary 2027", category: "Scholarships", province: "Nationwide", closes: "30 April", paid: false, trust: { sourceName: "Sasol", sourceUrl: "https://www.sasolbursaries.com/", lastVerifiedAt: LAST_VERIFIED, verificationStatus: "Needs confirmation" } },
  { id: "op7", title: "Toyota Apprenticeship Programme", category: "Apprenticeships", province: "KwaZulu-Natal", closes: "20 September", paid: true, trust: { sourceName: "Toyota South Africa", sourceUrl: "https://www.toyota.co.za/", lastVerifiedAt: LAST_VERIFIED, verificationStatus: "Needs confirmation" } },
  { id: "op8", title: "Shoprite Learner Cashier Programme", category: "Entry-Level Jobs", province: "Nationwide", closes: "Rolling", paid: true, trust: { sourceName: "Shoprite Group", sourceUrl: "https://www.shopriteholdings.co.za/", lastVerifiedAt: LAST_VERIFIED, verificationStatus: "Needs confirmation" } },
];

export const GUIDES = [
  { slug: "aps-explained", title: "APS Explained", summary: "How the Admission Point Score works and how to calculate yours." },
  { slug: "nqf-explained", title: "NQF Explained", summary: "The National Qualifications Framework and what each level means." },
  { slug: "saqa-explained", title: "SAQA Explained", summary: "The role of the South African Qualifications Authority." },
  { slug: "dhet-explained", title: "DHET Explained", summary: "What the Department of Higher Education and Training does." },
  { slug: "nsfas-explained", title: "NSFAS Explained", summary: "Who qualifies, what's covered, and how to apply." },
  { slug: "university-vs-tvet", title: "University vs TVET", summary: "Two valid routes - how to choose based on your goals." },
  { slug: "diploma-vs-degree", title: "Diploma vs Degree", summary: "The real differences in duration, cost and career outcomes." },
  { slug: "how-applications-work", title: "How Applications Work", summary: "Documents, deadlines and what to expect." },
  { slug: "avoiding-fake-colleges", title: "Avoiding Fake Colleges", summary: "How to verify accreditation before you pay." },
  { slug: "career-planning", title: "Career Planning", summary: "A simple framework for choosing your next step." },
];
