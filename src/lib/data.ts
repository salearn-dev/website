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
  {
    slug: "universities",
    title: "Universities",
    desc: "Degrees at public and private universities.",
    count: 26,
  },
  {
    slug: "tvet",
    title: "TVET Colleges",
    desc: "Practical, career-focused qualifications.",
    count: 50,
  },
  {
    slug: "private-colleges",
    title: "Private Colleges",
    desc: "Registered private higher education.",
    count: 32,
  },
  {
    slug: "short-courses",
    title: "Short Courses",
    desc: "Weeks to months. Fast upskilling.",
    count: 180,
  },
  {
    slug: "learnerships",
    title: "Learnerships",
    desc: "Earn while you learn, SETA-supported.",
    count: 64,
  },
  {
    slug: "skills-programmes",
    title: "Skills Programmes",
    desc: "Focused skill units, part-qualifications.",
    count: 48,
  },
  {
    slug: "certifications",
    title: "Professional Certifications",
    desc: "Industry certificates that employers value.",
    count: 40,
  },
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
  salaryBands: {
    entry: string;
    mid: string;
    senior: string;
  };
  outlook: string;
  fit: string[];
  subjects: string[];
  routes: string[];
  skills: string[];
  dailyWork: string[];
  entryRoles: string[];
  timeline: string[];
  relatedCourseSlugs: string[];
  relatedSkillSlugs: string[];
};

export const CAREERS: Career[] = [
  {
    slug: "software-developer",
    title: "Software Developer",
    short: "Build websites, apps and digital systems.",
    demand: "High",
    salary: "R15k-R60k / month",
    salaryBands: { entry: "R15k-R25k", mid: "R30k-R50k", senior: "R55k-R80k+" },
    outlook:
      "High demand across finance, retail, telecoms, public services and startups, especially for learners who build a visible portfolio.",
    fit: ["Problem solver", "Detail-focused", "Curious"],
    subjects: ["Mathematics", "English"],
    routes: ["Degree", "Diploma", "Higher Certificate", "Skills Programme"],
    skills: ["Coding", "Problem-solving", "Teamwork"],
    dailyWork: [
      "Write and test code",
      "Fix bugs",
      "Plan features with a team",
      "Review user feedback",
    ],
    entryRoles: ["Junior Developer", "Web Developer", "IT Support Developer"],
    timeline: [
      "Start with digital literacy and coding basics",
      "Build small projects",
      "Complete a certificate, diploma or degree route",
      "Apply for internships or junior roles",
    ],
    relatedCourseSlugs: ["hcert-it-wsu", "short-digital-marketing"],
    relatedSkillSlugs: ["programming", "digital-literacy", "ai"],
  },
  {
    slug: "teacher",
    title: "Teacher",
    short: "Educate learners at foundation, primary or high school level.",
    demand: "High",
    salary: "R18k-R40k / month",
    salaryBands: { entry: "R18k-R25k", mid: "R26k-R35k", senior: "R36k-R45k+" },
    outlook:
      "Teaching remains a core national need, with stronger prospects in priority subjects and underserved areas.",
    fit: ["Patient", "Communicative"],
    subjects: ["English", "Two teaching subjects"],
    routes: ["BEd Degree", "PGCE"],
    skills: ["Communication", "Planning", "Empathy"],
    dailyWork: [
      "Prepare lessons",
      "Teach classes",
      "Assess learner work",
      "Support learners and parents",
    ],
    entryRoles: ["Student Teacher", "Foundation Phase Teacher", "Subject Teacher"],
    timeline: [
      "Choose teaching phase and subjects",
      "Complete BEd or qualifying degree plus PGCE",
      "Register with SACE",
      "Apply to schools or districts",
    ],
    relatedCourseSlugs: [],
    relatedSkillSlugs: ["communication", "digital-literacy"],
  },
  {
    slug: "lawyer",
    title: "Lawyer",
    short: "Advise, represent and protect clients under South African law.",
    demand: "Stable",
    salary: "R20k-R80k / month",
    salaryBands: { entry: "R20k-R30k", mid: "R35k-R60k", senior: "R70k-R100k+" },
    outlook:
      "Stable demand, but progression depends strongly on articles, specialisation, writing ability and professional registration.",
    fit: ["Analytical", "Articulate"],
    subjects: ["English", "History useful"],
    routes: ["LLB Degree", "Articles"],
    skills: ["Writing", "Research", "Argumentation"],
    dailyWork: [
      "Research legal questions",
      "Draft documents",
      "Advise clients",
      "Prepare for hearings or negotiations",
    ],
    entryRoles: ["Candidate Attorney", "Legal Assistant", "Compliance Assistant"],
    timeline: [
      "Complete an LLB route",
      "Secure articles or practical vocational training",
      "Pass admission requirements",
      "Specialise through experience",
    ],
    relatedCourseSlugs: [],
    relatedSkillSlugs: ["communication", "business"],
  },
  {
    slug: "electrician",
    title: "Electrician",
    short: "Install and maintain electrical systems in homes and industry.",
    demand: "High",
    salary: "R12k-R35k / month",
    salaryBands: { entry: "R12k-R18k", mid: "R20k-R30k", senior: "R35k-R50k+" },
    outlook:
      "High demand in infrastructure, maintenance, construction and renewable energy, especially after trade testing.",
    fit: ["Practical", "Safety-minded"],
    subjects: ["Mathematics", "Physical Sciences"],
    routes: ["NCV Electrical", "Apprenticeship", "Trade Test"],
    skills: ["Wiring", "Reading diagrams", "Safety"],
    dailyWork: [
      "Install wiring",
      "Test circuits",
      "Read technical diagrams",
      "Follow safety procedures",
    ],
    entryRoles: ["Electrical Assistant", "Apprentice Electrician", "Maintenance Assistant"],
    timeline: [
      "Complete NCV or technical route",
      "Enter apprenticeship",
      "Build logged workplace experience",
      "Complete trade test",
    ],
    relatedCourseSlugs: ["nc-electrical-tvet"],
    relatedSkillSlugs: ["digital-literacy"],
  },
  {
    slug: "accountant",
    title: "Accountant",
    short: "Manage financial records, taxes and reporting for organisations.",
    demand: "Stable",
    salary: "R18k-R60k / month",
    salaryBands: { entry: "R18k-R28k", mid: "R30k-R50k", senior: "R55k-R80k+" },
    outlook:
      "Stable demand across most sectors, with stronger growth for learners who combine accounting with data and software skills.",
    fit: ["Numerate", "Ethical"],
    subjects: ["Mathematics", "Accounting"],
    routes: ["BCom Accounting", "SAICA / SAIPA Articles"],
    skills: ["Excel", "Reporting", "Tax"],
    dailyWork: [
      "Prepare reports",
      "Check transactions",
      "Support tax work",
      "Explain financial results",
    ],
    entryRoles: ["Accounts Clerk", "Trainee Accountant", "Bookkeeping Assistant"],
    timeline: [
      "Complete accounting qualification",
      "Build Excel and reporting skills",
      "Enter articles or trainee route",
      "Progress toward professional body requirements",
    ],
    relatedCourseSlugs: ["bcom-accounting-up"],
    relatedSkillSlugs: ["ms-office", "business"],
  },
  {
    slug: "nurse",
    title: "Nurse",
    short: "Care for patients in hospitals, clinics and communities.",
    demand: "High",
    salary: "R14k-R35k / month",
    salaryBands: { entry: "R14k-R22k", mid: "R24k-R35k", senior: "R38k-R50k+" },
    outlook:
      "High public and private healthcare need, but learners must confirm current SANC-approved training routes before applying.",
    fit: ["Caring", "Resilient"],
    subjects: ["Life Sciences", "English"],
    routes: ["Diploma in Nursing", "BCur Degree"],
    skills: ["Clinical care", "Communication", "Empathy"],
    dailyWork: [
      "Monitor patients",
      "Support treatment plans",
      "Record health information",
      "Communicate with families and clinical teams",
    ],
    entryRoles: ["Student Nurse", "Enrolled Nurse pathway", "Care Assistant"],
    timeline: [
      "Meet Life Sciences and language requirements",
      "Apply to approved nursing programme",
      "Complete clinical training",
      "Register with the relevant council",
    ],
    relatedCourseSlugs: ["dip-nursing-ul"],
    relatedSkillSlugs: ["communication", "digital-literacy"],
  },
  {
    slug: "graphic-designer",
    title: "Graphic Designer",
    short: "Create visual communication for brands and campaigns.",
    demand: "Growing",
    salary: "R10k-R35k / month",
    salaryBands: { entry: "R10k-R18k", mid: "R20k-R32k", senior: "R35k-R55k+" },
    outlook:
      "Growing where design connects with digital marketing, content, product design and portfolio-backed freelance work.",
    fit: ["Creative", "Visual"],
    subjects: ["Visual Arts helpful"],
    routes: ["Diploma", "Short Courses", "Portfolio"],
    skills: ["Illustrator", "Photoshop", "Typography"],
    dailyWork: [
      "Design layouts",
      "Prepare brand assets",
      "Revise work from feedback",
      "Export files for digital or print use",
    ],
    entryRoles: ["Junior Designer", "Design Intern", "Marketing Design Assistant"],
    timeline: [
      "Learn design basics",
      "Build a portfolio",
      "Complete short course or diploma route",
      "Apply for internships or freelance briefs",
    ],
    relatedCourseSlugs: ["short-digital-marketing"],
    relatedSkillSlugs: ["design", "marketing", "communication"],
  },
  {
    slug: "business-analyst",
    title: "Business Analyst",
    short: "Translate business problems into data-driven solutions.",
    demand: "Growing",
    salary: "R25k-R70k / month",
    salaryBands: { entry: "R25k-R35k", mid: "R40k-R60k", senior: "R70k-R95k+" },
    outlook:
      "Growing as organisations digitise processes and need people who can connect users, data and software teams.",
    fit: ["Analytical", "Communicative"],
    subjects: ["Mathematics", "English"],
    routes: ["BCom", "BSc Information Systems"],
    skills: ["SQL", "Excel", "Requirements analysis"],
    dailyWork: [
      "Map business processes",
      "Interview users",
      "Write requirements",
      "Support testing and rollout",
    ],
    entryRoles: ["Junior Business Analyst", "Data Analyst Intern", "Project Support Analyst"],
    timeline: [
      "Build business and spreadsheet basics",
      "Learn data and requirements tools",
      "Complete business or information systems route",
      "Apply for analyst internships",
    ],
    relatedCourseSlugs: ["bcom-accounting-up", "hcert-it-wsu"],
    relatedSkillSlugs: ["business", "ms-office", "ai"],
  },
  {
    slug: "cyber-security-analyst",
    title: "Cyber Security Analyst",
    short: "Defend organisations from digital threats and attacks.",
    demand: "High",
    salary: "R25k-R80k / month",
    salaryBands: { entry: "R25k-R38k", mid: "R45k-R70k", senior: "R80k-R110k+" },
    outlook:
      "High demand as organisations strengthen systems, with strong prospects for learners who combine networking, cloud and incident-response skills.",
    fit: ["Detail-focused", "Curious"],
    subjects: ["Mathematics"],
    routes: ["Degree", "Certifications (CompTIA, CISSP)"],
    skills: ["Networks", "Security tools", "Incident response"],
    dailyWork: [
      "Monitor alerts",
      "Investigate incidents",
      "Document risks",
      "Help improve security controls",
    ],
    entryRoles: ["Security Analyst Intern", "SOC Analyst", "IT Support Security Assistant"],
    timeline: [
      "Start with networking and operating systems",
      "Build security lab projects",
      "Complete ICT qualification or certificates",
      "Apply for SOC or support roles",
    ],
    relatedCourseSlugs: ["hcert-it-wsu"],
    relatedSkillSlugs: ["cyber-security", "programming", "digital-literacy"],
  },
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
  {
    slug: "uct",
    name: "University of Cape Town",
    type: "Public University",
    province: "Western Cape",
    courses: 127,
    funding: "NSFAS supported",
    website: "uct.ac.za",
    trust: {
      sourceName: "Prototype seed data",
      sourceUrl: "https://www.uct.ac.za/",
      lastVerifiedAt: LAST_VERIFIED,
      verificationStatus: "Needs confirmation",
    },
  },
  {
    slug: "wits",
    name: "University of the Witwatersrand",
    type: "Public University",
    province: "Gauteng",
    courses: 140,
    funding: "NSFAS supported",
    website: "wits.ac.za",
    trust: {
      sourceName: "Prototype seed data",
      sourceUrl: "https://www.wits.ac.za/",
      lastVerifiedAt: LAST_VERIFIED,
      verificationStatus: "Needs confirmation",
    },
  },
  {
    slug: "up",
    name: "University of Pretoria",
    type: "Public University",
    province: "Gauteng",
    courses: 155,
    funding: "NSFAS supported",
    website: "up.ac.za",
    trust: {
      sourceName: "Prototype seed data",
      sourceUrl: "https://www.up.ac.za/",
      lastVerifiedAt: LAST_VERIFIED,
      verificationStatus: "Needs confirmation",
    },
  },
  {
    slug: "ukzn",
    name: "University of KwaZulu-Natal",
    type: "Public University",
    province: "KwaZulu-Natal",
    courses: 130,
    funding: "NSFAS supported",
    website: "ukzn.ac.za",
    trust: {
      sourceName: "Prototype seed data",
      sourceUrl: "https://www.ukzn.ac.za/",
      lastVerifiedAt: LAST_VERIFIED,
      verificationStatus: "Needs confirmation",
    },
  },
  {
    slug: "cput",
    name: "Cape Peninsula University of Technology",
    type: "University of Technology",
    province: "Western Cape",
    courses: 98,
    funding: "NSFAS supported",
    website: "cput.ac.za",
    trust: {
      sourceName: "Prototype seed data",
      sourceUrl: "https://www.cput.ac.za/",
      lastVerifiedAt: LAST_VERIFIED,
      verificationStatus: "Needs confirmation",
    },
  },
  {
    slug: "false-bay",
    name: "False Bay TVET College",
    type: "TVET College",
    province: "Western Cape",
    courses: 42,
    funding: "NSFAS supported",
    website: "falsebaycollege.co.za",
    trust: {
      sourceName: "Prototype seed data",
      sourceUrl: "https://www.falsebaycollege.co.za/",
      lastVerifiedAt: LAST_VERIFIED,
      verificationStatus: "Needs confirmation",
    },
  },
  {
    slug: "ekurhuleni-east",
    name: "Ekurhuleni East TVET College",
    type: "TVET College",
    province: "Gauteng",
    courses: 38,
    funding: "NSFAS supported",
    website: "eec.edu.za",
    trust: {
      sourceName: "Prototype seed data",
      sourceUrl: "https://www.eec.edu.za/",
      lastVerifiedAt: LAST_VERIFIED,
      verificationStatus: "Needs confirmation",
    },
  },
  {
    slug: "boston",
    name: "Boston City Campus",
    type: "Private College",
    province: "Nationwide",
    courses: 60,
    funding: "Private funding",
    website: "boston.co.za",
    trust: {
      sourceName: "Prototype seed data",
      sourceUrl: "https://www.boston.co.za/",
      lastVerifiedAt: LAST_VERIFIED,
      verificationStatus: "Needs confirmation",
    },
  },
];

export const FUNDING: Array<{
  slug: string;
  name: string;
  short: string;
  eligibility: string;
  coverage: string;
  best: string;
  deadline: string;
  trust: TrustMeta;
}> = [
  {
    slug: "nsfas",
    name: "NSFAS",
    short: "National Student Financial Aid Scheme",
    eligibility:
      "SA citizens with combined household income under R350,000/year (R600,000 for students with disabilities).",
    coverage: "Tuition, accommodation, allowances at public universities and TVET colleges.",
    best: "Students needing full financial support.",
    deadline: "Annual - see nsfas.org.za",
    trust: {
      sourceName: "NSFAS",
      sourceUrl: "https://www.nsfas.org.za/",
      lastVerifiedAt: LAST_VERIFIED,
      verificationStatus: "Needs confirmation",
    },
  },
  {
    slug: "funza-lushaka",
    name: "Funza Lushaka Bursary",
    short: "For future teachers",
    eligibility: "Studying a BEd or PGCE in priority subjects.",
    coverage: "Full tuition, accommodation, meals, stipend.",
    best: "Aspiring teachers.",
    deadline: "Annual - see funzalushaka.doe.gov.za",
    trust: {
      sourceName: "Funza Lushaka",
      sourceUrl: "https://www.funzalushaka.doe.gov.za/",
      lastVerifiedAt: LAST_VERIFIED,
      verificationStatus: "Needs confirmation",
    },
  },
  {
    slug: "sasol",
    name: "Sasol Bursary",
    short: "Engineering and sciences",
    eligibility: "Grade 12 or first-year students in engineering/science with strong marks.",
    coverage: "Tuition, accommodation, laptop, stipend.",
    best: "STEM students.",
    deadline: "March/April annually",
    trust: {
      sourceName: "Sasol",
      sourceUrl: "https://www.sasolbursaries.com/",
      lastVerifiedAt: LAST_VERIFIED,
      verificationStatus: "Needs confirmation",
    },
  },
  {
    slug: "eskom",
    name: "Eskom Bursary",
    short: "Energy and engineering",
    eligibility: "Engineering and technical fields with strong maths and science.",
    coverage: "Full study costs plus vacation work.",
    best: "Engineering students.",
    deadline: "Annual",
    trust: {
      sourceName: "Eskom",
      sourceUrl: "https://www.eskom.co.za/",
      lastVerifiedAt: LAST_VERIFIED,
      verificationStatus: "Needs confirmation",
    },
  },
  {
    slug: "seta-learnership",
    name: "SETA Learnerships",
    short: "Earn while you learn",
    eligibility: "Unemployed youth, matric usually required.",
    coverage: "Stipend during learnership.",
    best: "School-leavers seeking workplace experience.",
    deadline: "Rolling per SETA",
    trust: {
      sourceName: "SETAs",
      sourceUrl: "https://www.dhet.gov.za/SitePages/SETAlinks.aspx",
      lastVerifiedAt: LAST_VERIFIED,
      verificationStatus: "Needs confirmation",
    },
  },
  {
    slug: "employer",
    name: "Employer Bursaries",
    short: "Company-sponsored study",
    eligibility: "Varies per employer.",
    coverage: "Full or partial tuition, often bonded.",
    best: "Students willing to work back years.",
    deadline: "Varies",
    trust: {
      sourceName: "Provider websites",
      sourceUrl: "https://www.gov.za/services/education-and-training",
      lastVerifiedAt: LAST_VERIFIED,
      verificationStatus: "Prototype data",
    },
  },
];

export const SKILLS = [
  {
    slug: "programming",
    name: "Programming",
    diff: "Beginner–Advanced",
    time: "3–12 months",
    careers: ["Developer", "Data Analyst"],
  },
  {
    slug: "digital-literacy",
    name: "Digital Literacy",
    diff: "Beginner",
    time: "2–4 weeks",
    careers: ["Any office role"],
  },
  {
    slug: "communication",
    name: "Communication",
    diff: "Beginner",
    time: "Ongoing",
    careers: ["All careers"],
  },
  {
    slug: "ms-office",
    name: "Microsoft Office",
    diff: "Beginner",
    time: "4–8 weeks",
    careers: ["Admin", "Analyst"],
  },
  {
    slug: "design",
    name: "Design",
    diff: "Beginner–Intermediate",
    time: "2–6 months",
    careers: ["Designer", "Marketer"],
  },
  {
    slug: "business",
    name: "Business",
    diff: "Beginner–Intermediate",
    time: "1–3 months",
    careers: ["Manager", "Analyst"],
  },
  {
    slug: "entrepreneurship",
    name: "Entrepreneurship",
    diff: "Ongoing",
    time: "Ongoing",
    careers: ["Founder", "Freelancer"],
  },
  {
    slug: "marketing",
    name: "Marketing",
    diff: "Beginner–Intermediate",
    time: "2–4 months",
    careers: ["Marketer", "Brand Assistant"],
  },
  {
    slug: "ai",
    name: "AI",
    diff: "Intermediate",
    time: "3–6 months",
    careers: ["AI Practitioner", "Analyst"],
  },
  {
    slug: "cyber-security",
    name: "Cyber Security",
    diff: "Intermediate–Advanced",
    time: "6–12 months",
    careers: ["Security Analyst"],
  },
];

export const OPPORTUNITIES: Array<{
  id: string;
  title: string;
  category: string;
  sector: string;
  type: string;
  province: string;
  closes: string;
  paid: boolean;
  trust: TrustMeta;
}> = [
  {
    id: "op1",
    title: "University of Cape Town - 2027 Undergraduate Applications",
    category: "University Applications",
    sector: "Higher Education",
    type: "Application",
    province: "Western Cape",
    closes: "30 September",
    paid: false,
    trust: {
      sourceName: "UCT",
      sourceUrl: "https://www.uct.ac.za/",
      lastVerifiedAt: LAST_VERIFIED,
      verificationStatus: "Needs confirmation",
    },
  },
  {
    id: "op2",
    title: "False Bay TVET College - Trimester Intake",
    category: "TVET Applications",
    sector: "TVET",
    type: "Application",
    province: "Western Cape",
    closes: "Rolling",
    paid: false,
    trust: {
      sourceName: "False Bay TVET College",
      sourceUrl: "https://www.falsebaycollege.co.za/",
      lastVerifiedAt: LAST_VERIFIED,
      verificationStatus: "Needs confirmation",
    },
  },
  {
    id: "op3",
    title: "MerSETA Plumbing Learnership",
    category: "Learnerships",
    sector: "Trades",
    type: "Learnership",
    province: "Gauteng",
    closes: "15 August",
    paid: true,
    trust: {
      sourceName: "MerSETA",
      sourceUrl: "https://www.merseta.org.za/",
      lastVerifiedAt: LAST_VERIFIED,
      verificationStatus: "Needs confirmation",
    },
  },
  {
    id: "op4",
    title: "Standard Bank Graduate Programme",
    category: "Graduate Programmes",
    sector: "Finance",
    type: "Graduate Programme",
    province: "Nationwide",
    closes: "31 July",
    paid: true,
    trust: {
      sourceName: "Standard Bank",
      sourceUrl: "https://www.standardbank.com/",
      lastVerifiedAt: LAST_VERIFIED,
      verificationStatus: "Needs confirmation",
    },
  },
  {
    id: "op5",
    title: "Investec IT Internship",
    category: "Internships",
    sector: "Technology",
    type: "Internship",
    province: "Western Cape",
    closes: "10 August",
    paid: true,
    trust: {
      sourceName: "Investec",
      sourceUrl: "https://www.investec.com/",
      lastVerifiedAt: LAST_VERIFIED,
      verificationStatus: "Needs confirmation",
    },
  },
  {
    id: "op6",
    title: "Sasol Engineering Bursary 2027",
    category: "Scholarships",
    sector: "Engineering",
    type: "Bursary",
    province: "Nationwide",
    closes: "30 April",
    paid: false,
    trust: {
      sourceName: "Sasol",
      sourceUrl: "https://www.sasolbursaries.com/",
      lastVerifiedAt: LAST_VERIFIED,
      verificationStatus: "Needs confirmation",
    },
  },
  {
    id: "op7",
    title: "Toyota Apprenticeship Programme",
    category: "Apprenticeships",
    sector: "Manufacturing",
    type: "Apprenticeship",
    province: "KwaZulu-Natal",
    closes: "20 September",
    paid: true,
    trust: {
      sourceName: "Toyota South Africa",
      sourceUrl: "https://www.toyota.co.za/",
      lastVerifiedAt: LAST_VERIFIED,
      verificationStatus: "Needs confirmation",
    },
  },
  {
    id: "op8",
    title: "Shoprite Learner Cashier Programme",
    category: "Entry-Level Jobs",
    sector: "Retail",
    type: "Entry-Level Job",
    province: "Nationwide",
    closes: "Rolling",
    paid: true,
    trust: {
      sourceName: "Shoprite Group",
      sourceUrl: "https://www.shopriteholdings.co.za/",
      lastVerifiedAt: LAST_VERIFIED,
      verificationStatus: "Needs confirmation",
    },
  },
];

export type Guide = {
  slug: string;
  title: string;
  summary: string;
  category: "Glossary" | "How-to" | "Comparison" | "Planning";
  plainLanguage: string;
  keyPoints: string[];
  steps?: string[];
  relatedTerms: string[];
};

export const GLOSSARY_TERMS = [
  {
    term: "APS",
    meaning:
      "Admission Point Score. A points total based on your matric marks that many universities use for entry checks.",
    guideSlug: "aps-explained",
  },
  {
    term: "NQF",
    meaning:
      "National Qualifications Framework. The South African level system that shows how qualifications compare.",
    guideSlug: "nqf-explained",
  },
  {
    term: "SAQA",
    meaning:
      "South African Qualifications Authority. SAQA helps manage the national qualifications framework and registered qualifications.",
    guideSlug: "saqa-explained",
  },
  {
    term: "DHET",
    meaning:
      "Department of Higher Education and Training. DHET oversees universities, TVET colleges, skills development and related public systems.",
    guideSlug: "dhet-explained",
  },
  {
    term: "NSFAS",
    meaning:
      "National Student Financial Aid Scheme. NSFAS funds eligible students at public universities and TVET colleges.",
    guideSlug: "nsfas-explained",
  },
  {
    term: "TVET",
    meaning:
      "Technical and Vocational Education and Training. TVET colleges focus on practical and career-linked study routes.",
    guideSlug: "university-vs-tvet",
  },
  {
    term: "Accreditation",
    meaning:
      "A quality or registration signal. Always confirm it through official sources before paying a provider.",
    guideSlug: "avoiding-fake-colleges",
  },
  {
    term: "Learnership",
    meaning:
      "A structured route that combines learning with workplace experience, often linked to a SETA and sometimes a stipend.",
    guideSlug: "how-applications-work",
  },
  {
    term: "Diploma",
    meaning:
      "A career-focused higher education qualification, often practical and usually shorter than many degree routes.",
    guideSlug: "diploma-vs-degree",
  },
  {
    term: "Degree",
    meaning:
      "A higher education qualification often offered by universities and universities of technology, usually with broader theory and progression routes.",
    guideSlug: "diploma-vs-degree",
  },
  {
    term: "Higher Certificate",
    meaning:
      "An entry-level higher education qualification that can sometimes help learners build toward diploma or degree study.",
    guideSlug: "diploma-vs-degree",
  },
];

export const GUIDES: Guide[] = [
  {
    slug: "aps-explained",
    title: "APS Explained",
    summary: "How the Admission Point Score works and how to calculate yours.",
    category: "How-to",
    plainLanguage:
      "APS turns your matric percentages into points. It helps institutions compare whether you meet a programme's minimum entry score.",
    keyPoints: [
      "APS is usually calculated from your best subjects, but rules can differ by institution.",
      "Life Orientation is often excluded from university APS calculations.",
      "APS alone is not enough when a course also requires specific subjects or marks.",
    ],
    steps: [
      "Write down your subjects and percentages.",
      "Remove Life Orientation if the institution excludes it.",
      "Convert each remaining mark into points using the institution's scale.",
      "Add the points from the required number of subjects.",
      "Compare the total with the programme requirement and check subject rules too.",
    ],
    relatedTerms: ["APS", "Degree", "Diploma", "Higher Certificate"],
  },
  {
    slug: "nqf-explained",
    title: "NQF Explained",
    summary: "The National Qualifications Framework and what each level means.",
    category: "Glossary",
    plainLanguage:
      "NQF levels help you understand where a qualification sits, from school-level certificates through higher education and advanced study.",
    keyPoints: [
      "NQF level is not the same as quality; it shows qualification level.",
      "Higher certificates, diplomas and degrees usually sit at different NQF levels.",
      "Always check that the qualification itself is registered or recognised where needed.",
    ],
    relatedTerms: ["NQF", "SAQA", "Higher Certificate", "Diploma", "Degree"],
  },
  {
    slug: "saqa-explained",
    title: "SAQA Explained",
    summary: "The role of the South African Qualifications Authority.",
    category: "Glossary",
    plainLanguage:
      "SAQA is one of the places learners can use to understand registered qualifications and how they fit into the national framework.",
    keyPoints: [
      "SAQA is a reference point for registered qualifications.",
      "A provider's marketing page is not enough proof on its own.",
      "SA Learn should show source links when qualification registration data is available.",
    ],
    relatedTerms: ["SAQA", "NQF", "Accreditation"],
  },
  {
    slug: "dhet-explained",
    title: "DHET Explained",
    summary: "What the Department of Higher Education and Training does.",
    category: "Glossary",
    plainLanguage:
      "DHET is the public department connected to post-school education, including universities, TVET colleges and skills development.",
    keyPoints: [
      "DHET is central to the post-school education system.",
      "Public universities and TVET colleges sit inside this broader ecosystem.",
      "Private providers still need proper registration or accreditation evidence.",
    ],
    relatedTerms: ["DHET", "TVET", "Accreditation"],
  },
  {
    slug: "nsfas-explained",
    title: "NSFAS Explained",
    summary: "Who qualifies, what's covered, and how to apply.",
    category: "How-to",
    plainLanguage:
      "NSFAS helps eligible South African students pay for approved public university and TVET studies.",
    keyPoints: [
      "NSFAS rules can change by year, so always confirm on the official NSFAS site.",
      "Funding checks can involve sensitive personal information.",
      "Do not pay anyone who promises guaranteed NSFAS approval.",
    ],
    steps: [
      "Check whether your institution and qualification type can be funded.",
      "Prepare identity, household and academic documents.",
      "Apply through the official NSFAS channel.",
      "Track the official application status.",
      "Keep copies of submitted documents and messages.",
    ],
    relatedTerms: ["NSFAS", "TVET", "Degree", "Diploma"],
  },
  {
    slug: "university-vs-tvet",
    title: "University vs TVET",
    summary: "Two valid routes - how to choose based on your goals.",
    category: "Comparison",
    plainLanguage:
      "University and TVET routes can both be valid. The right choice depends on your goal, learning style, marks, budget and career direction.",
    keyPoints: [
      "Universities often focus more on degrees and theory-linked study.",
      "TVET colleges often focus on practical and vocational routes.",
      "A practical route is not a weaker route when it fits the career goal.",
    ],
    relatedTerms: ["TVET", "Degree", "Diploma", "Higher Certificate"],
  },
  {
    slug: "diploma-vs-degree",
    title: "Diploma vs Degree",
    summary: "The real differences in duration, cost and career outcomes.",
    category: "Comparison",
    plainLanguage:
      "Diplomas and degrees can both lead to work. They differ in depth, entry rules, duration and the kind of pathway they usually support.",
    keyPoints: [
      "A diploma is often more career-focused and practical.",
      "A degree may be needed for some professions or postgraduate routes.",
      "A higher certificate can sometimes become a bridge into further study.",
    ],
    relatedTerms: ["Diploma", "Degree", "Higher Certificate", "NQF"],
  },
  {
    slug: "how-applications-work",
    title: "How Applications Work",
    summary: "Documents, deadlines and what to expect.",
    category: "How-to",
    plainLanguage:
      "Applications are easier when you track documents, deadlines and official links before the closing date.",
    keyPoints: [
      "Apply through official provider channels only.",
      "Keep proof of submission.",
      "Some routes may need tests, portfolios, interviews or extra documents.",
    ],
    steps: [
      "Choose the course or opportunity.",
      "Check the official requirements and deadline.",
      "Collect documents before starting the form.",
      "Submit through the official link.",
      "Save proof and watch for follow-up messages.",
    ],
    relatedTerms: ["Learnership", "NSFAS", "Accreditation"],
  },
  {
    slug: "avoiding-fake-colleges",
    title: "Avoiding Fake Colleges",
    summary: "How to verify accreditation before you pay.",
    category: "How-to",
    plainLanguage:
      "A college can look professional online and still be unsafe. Verify registration, accreditation and official source evidence before paying.",
    keyPoints: [
      "Do not trust pressure tactics or guaranteed-job promises.",
      "Check official registers and source links.",
      "Be careful when a provider cannot explain the exact qualification and registration status.",
    ],
    steps: [
      "Find the provider's official name, not just the brand name.",
      "Look for registration or accreditation evidence.",
      "Check the qualification name and NQF level.",
      "Confirm details through official public sources.",
      "Do not pay until unclear claims are resolved.",
    ],
    relatedTerms: ["Accreditation", "SAQA", "DHET", "NQF"],
  },
  {
    slug: "career-planning",
    title: "Career Planning",
    summary: "A simple framework for choosing your next step.",
    category: "Planning",
    plainLanguage:
      "Career planning means comparing what you enjoy, what you can access, what you qualify for and what work the route can lead to.",
    keyPoints: [
      "Start with more than one possible route.",
      "Compare courses, skills and opportunities together.",
      "If you miss one requirement, look for alternatives instead of stopping.",
    ],
    relatedTerms: ["APS", "Diploma", "Degree", "Learnership"],
  },
];
