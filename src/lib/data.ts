// Static demo data for SA Learn prototype v1.
// All values are illustrative. Real deployment requires verification against
// SAQA / DHET / institutional sources before display.

import { INSTITUTION_IMAGES, type InstitutionImage } from "./institution-images";

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
  city: string;
  deliveryMode: "Contact" | "Online" | "Blended" | "Workplace";
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
    city: "Mthatha",
    deliveryMode: "Contact",
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
    city: "Polokwane",
    deliveryMode: "Contact",
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
    city: "Cape Town",
    deliveryMode: "Contact",
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
    city: "Pretoria",
    deliveryMode: "Contact",
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
    city: "Online",
    deliveryMode: "Online",
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
    city: "Workplace-based",
    deliveryMode: "Workplace",
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
  campuses: string[];
  accreditationStatus: string;
  registerLinks: Array<{ label: string; url: string }>;
  applicationWindows: Array<{ label: string; period: string; status: string }>;
  heroImage?: InstitutionImage;
  trust: TrustMeta;
};

type InstitutionSeed = {
  slug: string;
  name: string;
  type: "Public University" | "University of Technology" | "TVET College";
  province: string;
  website: string;
  campuses: string[];
};

const PUBLIC_UNIVERSITY_SOURCE = "https://www.usaf.ac.za/";
const TVET_SOURCE = "https://www.dhet.gov.za/SitePages/TVETColleges.aspx";

export const PUBLIC_UNIVERSITY_SEEDS: InstitutionSeed[] = [
  { slug: "cput", name: "Cape Peninsula University of Technology", type: "University of Technology", province: "Western Cape", website: "cput.ac.za", campuses: ["Cape Town", "Bellville"] },
  { slug: "cut", name: "Central University of Technology", type: "University of Technology", province: "Free State", website: "cut.ac.za", campuses: ["Bloemfontein", "Welkom"] },
  { slug: "dut", name: "Durban University of Technology", type: "University of Technology", province: "KwaZulu-Natal", website: "dut.ac.za", campuses: ["Durban", "Pietermaritzburg"] },
  { slug: "mut", name: "Mangosuthu University of Technology", type: "University of Technology", province: "KwaZulu-Natal", website: "mut.ac.za", campuses: ["Umlazi"] },
  { slug: "nmu", name: "Nelson Mandela University", type: "Public University", province: "Eastern Cape", website: "mandela.ac.za", campuses: ["Gqeberha", "George"] },
  { slug: "nwu", name: "North-West University", type: "Public University", province: "North West", website: "nwu.ac.za", campuses: ["Mahikeng", "Potchefstroom", "Vanderbijlpark"] },
  { slug: "rhodes", name: "Rhodes University", type: "Public University", province: "Eastern Cape", website: "ru.ac.za", campuses: ["Makhanda"] },
  { slug: "smu", name: "Sefako Makgatho Health Sciences University", type: "Public University", province: "Gauteng", website: "smu.ac.za", campuses: ["Ga-Rankuwa"] },
  { slug: "spu", name: "Sol Plaatje University", type: "Public University", province: "Northern Cape", website: "spu.ac.za", campuses: ["Kimberley"] },
  { slug: "stellenbosch", name: "Stellenbosch University", type: "Public University", province: "Western Cape", website: "sun.ac.za", campuses: ["Stellenbosch", "Tygerberg", "Bellville", "Worcester"] },
  { slug: "tut", name: "Tshwane University of Technology", type: "University of Technology", province: "Gauteng", website: "tut.ac.za", campuses: ["Pretoria", "Soshanguve", "Ga-Rankuwa", "Mbombela", "Polokwane", "eMalahleni"] },
  { slug: "uct", name: "University of Cape Town", type: "Public University", province: "Western Cape", website: "uct.ac.za", campuses: ["Cape Town"] },
  { slug: "ufh", name: "University of Fort Hare", type: "Public University", province: "Eastern Cape", website: "ufh.ac.za", campuses: ["Alice", "East London", "Bhisho"] },
  { slug: "ufs", name: "University of the Free State", type: "Public University", province: "Free State", website: "ufs.ac.za", campuses: ["Bloemfontein", "Qwaqwa", "South Campus"] },
  { slug: "uj", name: "University of Johannesburg", type: "Public University", province: "Gauteng", website: "uj.ac.za", campuses: ["Auckland Park", "Doornfontein", "Soweto"] },
  { slug: "ukzn", name: "University of KwaZulu-Natal", type: "Public University", province: "KwaZulu-Natal", website: "ukzn.ac.za", campuses: ["Durban", "Pietermaritzburg", "Pinetown", "Westville"] },
  { slug: "ul", name: "University of Limpopo", type: "Public University", province: "Limpopo", website: "ul.ac.za", campuses: ["Mankweng"] },
  { slug: "ump", name: "University of Mpumalanga", type: "Public University", province: "Mpumalanga", website: "ump.ac.za", campuses: ["Mbombela", "Siyabuswa"] },
  { slug: "up", name: "University of Pretoria", type: "Public University", province: "Gauteng", website: "up.ac.za", campuses: ["Pretoria", "Mamelodi", "Onderstepoort"] },
  { slug: "unisa", name: "University of South Africa", type: "Public University", province: "Gauteng", website: "unisa.ac.za", campuses: ["Distance education", "Pretoria", "Regional centres"] },
  { slug: "univen", name: "University of Venda", type: "Public University", province: "Limpopo", website: "univen.ac.za", campuses: ["Thohoyandou"] },
  { slug: "uwc", name: "University of the Western Cape", type: "Public University", province: "Western Cape", website: "uwc.ac.za", campuses: ["Bellville"] },
  { slug: "wits", name: "University of the Witwatersrand", type: "Public University", province: "Gauteng", website: "wits.ac.za", campuses: ["Johannesburg"] },
  { slug: "unizulu", name: "University of Zululand", type: "Public University", province: "KwaZulu-Natal", website: "unizulu.ac.za", campuses: ["KwaDlangezwa", "Richards Bay"] },
  { slug: "vut", name: "Vaal University of Technology", type: "University of Technology", province: "Gauteng", website: "vut.ac.za", campuses: ["Vanderbijlpark", "Secunda", "Upington"] },
  { slug: "wsu", name: "Walter Sisulu University", type: "Public University", province: "Eastern Cape", website: "wsu.ac.za", campuses: ["Mthatha", "Butterworth", "Buffalo City", "Queenstown"] },
];

export const TVET_COLLEGE_SEEDS: InstitutionSeed[] = [
  { slug: "boland-tvet", name: "Boland TVET College", type: "TVET College", province: "Western Cape", website: "bolandcollege.com", campuses: ["Boland region"] },
  { slug: "buffalo-city-tvet", name: "Buffalo City TVET College", type: "TVET College", province: "Eastern Cape", website: "bccollege.co.za", campuses: ["East London", "Mdantsane", "King Street"] },
  { slug: "capricorn-tvet", name: "Capricorn TVET College", type: "TVET College", province: "Limpopo", website: "capricorncollege.edu.za", campuses: ["Polokwane", "Seshego", "Senwabarwana", "Ramokgopa"] },
  { slug: "central-johannesburg-tvet", name: "Central Johannesburg TVET College", type: "TVET College", province: "Gauteng", website: "cjc.edu.za", campuses: ["Johannesburg"] },
  { slug: "coastal-tvet", name: "Coastal TVET College", type: "TVET College", province: "KwaZulu-Natal", website: "coastalkzn.co.za", campuses: ["Durban", "KwaMakhutha", "Umlazi", "Swinton"] },
  { slug: "college-of-cape-town-tvet", name: "College of Cape Town for TVET", type: "TVET College", province: "Western Cape", website: "cct.edu.za", campuses: ["Cape Town"] },
  { slug: "eastcape-midlands-tvet", name: "Eastcape Midlands TVET College", type: "TVET College", province: "Eastern Cape", website: "emcol.co.za", campuses: ["Uitenhage", "Graaff-Reinet", "Gqeberha"] },
  { slug: "ehlanzeni-tvet", name: "Ehlanzeni TVET College", type: "TVET College", province: "Mpumalanga", website: "ehlanzenicollege.co.za", campuses: ["Mbombela", "Barberton", "Mlumati", "Mapulaneng"] },
  { slug: "ekurhuleni-east-tvet", name: "Ekurhuleni East TVET College", type: "TVET College", province: "Gauteng", website: "eec.edu.za", campuses: ["Ekurhuleni"] },
  { slug: "ekurhuleni-west-tvet", name: "Ekurhuleni West TVET College", type: "TVET College", province: "Gauteng", website: "ewc.edu.za", campuses: ["Ekurhuleni"] },
  { slug: "elangeni-tvet", name: "Elangeni TVET College", type: "TVET College", province: "KwaZulu-Natal", website: "elangeni.edu.za", campuses: ["Durban", "Pinetown", "KwaMashu", "Ntuzuma"] },
  { slug: "esayidi-tvet", name: "Esayidi TVET College", type: "TVET College", province: "KwaZulu-Natal", website: "esayidifet.co.za", campuses: ["Port Shepstone", "Kokstad", "Harding"] },
  { slug: "false-bay-tvet", name: "False Bay TVET College", type: "TVET College", province: "Western Cape", website: "falsebaycollege.co.za", campuses: ["Fish Hoek", "Muizenberg", "Mitchells Plain", "Khayelitsha", "Westlake"] },
  { slug: "flavius-mareka-tvet", name: "Flavius Mareka TVET College", type: "TVET College", province: "Free State", website: "flaviusmareka.net", campuses: ["Sasolburg", "Kroonstad", "Mphohadi"] },
  { slug: "gert-sibande-tvet", name: "Gert Sibande TVET College", type: "TVET College", province: "Mpumalanga", website: "gscollege.edu.za", campuses: ["Ermelo", "Standerton", "Evander", "Balfour"] },
  { slug: "goldfields-tvet", name: "Goldfields TVET College", type: "TVET College", province: "Free State", website: "goldfieldstvet.edu.za", campuses: ["Welkom", "Tosa", "Skills Academy"] },
  { slug: "ikhala-tvet", name: "Ikhala TVET College", type: "TVET College", province: "Eastern Cape", website: "ikhala.edu.za", campuses: ["Queenstown", "Aliwal North", "Ezibeleni", "Sterkspruit"] },
  { slug: "ingwe-tvet", name: "Ingwe TVET College", type: "TVET College", province: "Eastern Cape", website: "ingwecollege.edu.za", campuses: ["Mount Frere", "Maluti", "Ngqungqushe", "Siteto"] },
  { slug: "king-hintsa-tvet", name: "King Hintsa TVET College", type: "TVET College", province: "Eastern Cape", website: "kinghintsacollege.edu.za", campuses: ["Teko", "Dutywa", "Centane", "Msobomvu"] },
  { slug: "ksd-tvet", name: "King Sabata Dalindyebo TVET College", type: "TVET College", province: "Eastern Cape", website: "ksdcollege.edu.za", campuses: ["Mthatha", "Libode", "Ngcobo"] },
  { slug: "lephalale-tvet", name: "Lephalale TVET College", type: "TVET College", province: "Limpopo", website: "lephalalefetcollege.co.za", campuses: ["Lephalale"] },
  { slug: "letaba-tvet", name: "Letaba TVET College", type: "TVET College", province: "Limpopo", website: "letcol.co.za", campuses: ["Tzaneen", "Giyani", "Maake"] },
  { slug: "lovedale-tvet", name: "Lovedale TVET College", type: "TVET College", province: "Eastern Cape", website: "lovedalecollege.co.za", campuses: ["Alice", "King William's Town", "Zwelitsha"] },
  { slug: "majuba-tvet", name: "Majuba TVET College", type: "TVET College", province: "KwaZulu-Natal", website: "majuba.edu.za", campuses: ["Newcastle", "Dundee"] },
  { slug: "maluti-tvet", name: "Maluti TVET College", type: "TVET College", province: "Free State", website: "malutitvet.co.za", campuses: ["Phuthaditjhaba", "Bethlehem", "Harrismith", "Kwetlisong"] },
  { slug: "mnambithi-tvet", name: "Mnambithi TVET College", type: "TVET College", province: "KwaZulu-Natal", website: "mnambithicollege.co.za", campuses: ["Ladysmith", "Estcourt"] },
  { slug: "mopani-south-east-tvet", name: "Mopani South East TVET College", type: "TVET College", province: "Limpopo", website: "mopanicollege.edu.za", campuses: ["Phalaborwa", "Sir Val Duncan"] },
  { slug: "motheo-tvet", name: "Motheo TVET College", type: "TVET College", province: "Free State", website: "motheotvet.edu.za", campuses: ["Bloemfontein", "Botshabelo", "Thaba Nchu"] },
  { slug: "mthashana-tvet", name: "Mthashana TVET College", type: "TVET College", province: "KwaZulu-Natal", website: "mthashanacollege.co.za", campuses: ["Vryheid", "Nongoma", "Ulundi"] },
  { slug: "nkangala-tvet", name: "Nkangala TVET College", type: "TVET College", province: "Mpumalanga", website: "nkangalafet.edu.za", campuses: ["Witbank", "Middelburg", "CN Mahlangu"] },
  { slug: "northern-cape-rural-tvet", name: "Northern Cape Rural TVET College", type: "TVET College", province: "Northern Cape", website: "ncrfet.edu.za", campuses: ["Upington", "Kuruman", "Namaqualand", "Kathu"] },
  { slug: "northern-cape-urban-tvet", name: "Northern Cape Urban TVET College", type: "TVET College", province: "Northern Cape", website: "ncutvet.edu.za", campuses: ["Kimberley"] },
  { slug: "northlink-tvet", name: "Northlink TVET College", type: "TVET College", province: "Western Cape", website: "northlink.co.za", campuses: ["Bellville", "Goodwood", "Parow", "Tygerberg", "Wingfield"] },
  { slug: "orbit-tvet", name: "Orbit TVET College", type: "TVET College", province: "North West", website: "orbitcollege.co.za", campuses: ["Rustenburg", "Brits", "Mankwe"] },
  { slug: "port-elizabeth-tvet", name: "Port Elizabeth TVET College", type: "TVET College", province: "Eastern Cape", website: "pecollege.edu.za", campuses: ["Gqeberha"] },
  { slug: "sedibeng-tvet", name: "Sedibeng TVET College", type: "TVET College", province: "Gauteng", website: "sedcol.co.za", campuses: ["Vereeniging", "Vanderbijlpark", "Sebokeng", "Heidelberg"] },
  { slug: "sekhukhune-tvet", name: "Sekhukhune TVET College", type: "TVET College", province: "Limpopo", website: "sekhukhunetvet.edu.za", campuses: ["CS Barlow", "CN Phatudi", "Apel"] },
  { slug: "south-cape-tvet", name: "South Cape TVET College", type: "TVET College", province: "Western Cape", website: "sccollege.co.za", campuses: ["George", "Mossel Bay", "Oudtshoorn", "Beaufort West"] },
  { slug: "south-west-gauteng-tvet", name: "South West Gauteng TVET College", type: "TVET College", province: "Gauteng", website: "swgc.co.za", campuses: ["Soweto", "Roodepoort", "Randburg"] },
  { slug: "taletso-tvet", name: "Taletso TVET College", type: "TVET College", province: "North West", website: "taletsocollege.co.za", campuses: ["Mafikeng", "Lichtenburg", "Lehurutshe"] },
  { slug: "thekwini-tvet", name: "Thekwini TVET College", type: "TVET College", province: "KwaZulu-Natal", website: "thekwini.edu.za", campuses: ["Durban"] },
  { slug: "tshwane-north-tvet", name: "Tshwane North TVET College", type: "TVET College", province: "Gauteng", website: "tnc.edu.za", campuses: ["Pretoria", "Soshanguve", "Mamelodi", "Temba"] },
  { slug: "tshwane-south-tvet", name: "Tshwane South TVET College", type: "TVET College", province: "Gauteng", website: "tsc.edu.za", campuses: ["Pretoria", "Centurion", "Atteridgeville", "Odi"] },
  { slug: "umfolozi-tvet", name: "Umfolozi TVET College", type: "TVET College", province: "KwaZulu-Natal", website: "umfolozi.edu.za", campuses: ["Richards Bay", "eSikhawini", "Mandeni"] },
  { slug: "umgungundlovu-tvet", name: "Umgungundlovu TVET College", type: "TVET College", province: "KwaZulu-Natal", website: "ufetc.edu.za", campuses: ["Pietermaritzburg"] },
  { slug: "vhembe-tvet", name: "Vhembe TVET College", type: "TVET College", province: "Limpopo", website: "vhembecollege.edu.za", campuses: ["Thohoyandou", "Makwarela", "Mavhoi", "Mashamba"] },
  { slug: "vuselela-tvet", name: "Vuselela TVET College", type: "TVET College", province: "North West", website: "vuselelacollege.co.za", campuses: ["Klerksdorp", "Potchefstroom", "Taung"] },
  { slug: "waterberg-tvet", name: "Waterberg TVET College", type: "TVET College", province: "Limpopo", website: "waterbergcollege.co.za", campuses: ["Mokopane", "Mahwelereng", "Thabazimbi"] },
  { slug: "west-coast-tvet", name: "West Coast TVET College", type: "TVET College", province: "Western Cape", website: "westcoastcollege.co.za", campuses: ["Malmesbury", "Atlantis", "Vredenburg", "Vredendal"] },
  { slug: "western-tvet", name: "Western College for TVET", type: "TVET College", province: "Gauteng", website: "westcol.co.za", campuses: ["Randfontein", "Krugersdorp", "Carletonville", "Westonaria"] },
];

function publicInstitution(seed: InstitutionSeed): Institution {
  const isTvet = seed.type === "TVET College";
  const nationalSource = isTvet ? TVET_SOURCE : PUBLIC_UNIVERSITY_SOURCE;

  return {
    slug: seed.slug,
    name: seed.name,
    type: seed.type,
    province: seed.province,
    courses: 0,
    funding: isTvet ? "NSFAS supported at public TVET colleges" : "NSFAS supported at public universities",
    website: seed.website,
    campuses: seed.campuses,
    accreditationStatus: isTvet
      ? "Public TVET college - registration and programme details require official confirmation"
      : "Public university - registration and programme details require official confirmation",
    registerLinks: [
      { label: "Official website", url: `https://${seed.website}/` },
      {
        label: isTvet ? "DHET TVET colleges" : "Universities South Africa",
        url: nationalSource,
      },
    ],
    applicationWindows: [
      {
        label: isTvet ? "NC(V) / Report 191 applications" : "Undergraduate applications",
        period: "Confirm current intake with the institution",
        status: "Needs confirmation",
      },
      {
        label: isTvet ? "Trimester / semester intake" : "Faculty or programme selection",
        period: "Programme dependent",
        status: "Needs confirmation",
      },
    ],
    heroImage: INSTITUTION_IMAGES[seed.slug],
    trust: {
      sourceName: isTvet ? "DHET TVET branch reference" : "Universities South Africa member reference",
      sourceUrl: nationalSource,
      lastVerifiedAt: LAST_VERIFIED,
      verificationStatus: "Needs confirmation",
    },
  };
}

export const INSTITUTIONS: Institution[] = [
  ...PUBLIC_UNIVERSITY_SEEDS.map(publicInstitution),
  ...TVET_COLLEGE_SEEDS.map(publicInstitution),
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
    track: [
      "Learn digital basics and simple web pages",
      "Build small JavaScript or Python projects",
      "Publish a portfolio and connect it to study or internship routes",
    ],
    practice: "Create a small website that explains one SA Learn career route.",
  },
  {
    slug: "digital-literacy",
    name: "Digital Literacy",
    diff: "Beginner",
    time: "2–4 weeks",
    careers: ["Any office role"],
    track: [
      "Set up email, cloud storage and safe password habits",
      "Practise documents, spreadsheets and online applications",
      "Use official portals to find courses, funding and opportunities",
    ],
    practice: "Prepare a clean application folder with CV, ID copy checklist and certificates.",
  },
  {
    slug: "communication",
    name: "Communication",
    diff: "Beginner",
    time: "Ongoing",
    careers: ["All careers"],
    track: [
      "Practise clear written messages and short explanations",
      "Prepare interview answers using real examples",
      "Build presentation confidence through short recorded practice",
    ],
    practice: "Write a one-page motivation for a course, bursary or learnership.",
  },
  {
    slug: "ms-office",
    name: "Microsoft Office",
    diff: "Beginner",
    time: "4–8 weeks",
    careers: ["Admin", "Analyst"],
    track: [
      "Learn document formatting and spreadsheet basics",
      "Practise formulas, tables and simple dashboards",
      "Use templates for budgets, application trackers and reports",
    ],
    practice: "Build a spreadsheet that compares three courses by cost, city and NQF level.",
  },
  {
    slug: "design",
    name: "Design",
    diff: "Beginner–Intermediate",
    time: "2–6 months",
    careers: ["Designer", "Marketer"],
    track: [
      "Learn layout, colour, typography and basic brand rules",
      "Recreate simple posters, social posts and portfolio pieces",
      "Collect feedback and refine a small public portfolio",
    ],
    practice: "Design a one-page career guide poster for a learner audience.",
  },
  {
    slug: "business",
    name: "Business",
    diff: "Beginner–Intermediate",
    time: "1–3 months",
    careers: ["Manager", "Analyst"],
    track: [
      "Learn basic finance, operations and customer language",
      "Map a simple process and identify pain points",
      "Practise comparing options with cost, risk and outcome notes",
    ],
    practice:
      "Create a simple decision table for choosing between university, TVET and work routes.",
  },
  {
    slug: "entrepreneurship",
    name: "Entrepreneurship",
    diff: "Ongoing",
    time: "Ongoing",
    careers: ["Founder", "Freelancer"],
    track: [
      "Choose a small problem and define the customer",
      "Test an offer with a simple price and delivery plan",
      "Track income, costs and feedback before scaling",
    ],
    practice: "Draft a one-page offer for a local service you could test this month.",
  },
  {
    slug: "marketing",
    name: "Marketing",
    diff: "Beginner–Intermediate",
    time: "2–4 months",
    careers: ["Marketer", "Brand Assistant"],
    track: [
      "Learn audience, message and channel basics",
      "Plan content around a learner or employer goal",
      "Measure reach, clicks or responses and improve the next version",
    ],
    practice: "Plan a seven-day content calendar for a bursary or application deadline campaign.",
  },
  {
    slug: "ai",
    name: "AI",
    diff: "Intermediate",
    time: "3–6 months",
    careers: ["AI Practitioner", "Analyst"],
    track: [
      "Learn prompt basics and safe verification habits",
      "Use AI to summarise, compare and draft without copying blindly",
      "Build a small workflow that improves study or job-search productivity",
    ],
    practice: "Create a prompt checklist for comparing two career paths using verified sources.",
  },
  {
    slug: "cyber-security",
    name: "Cyber Security",
    diff: "Intermediate–Advanced",
    time: "6–12 months",
    careers: ["Security Analyst"],
    track: [
      "Start with networking, operating systems and password safety",
      "Practise threat awareness and incident notes in a small lab",
      "Build toward recognised ICT study or entry support roles",
    ],
    practice: "Write a simple cyber safety checklist for learners applying online.",
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
