import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "zu", label: "isiZulu" },
  { code: "af", label: "Afrikaans" },
  { code: "xh", label: "isiXhosa" },
  { code: "st", label: "Sesotho" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

type Dictionary = Record<string, string>;

const STORAGE_KEY = "sa-learn-language";

const DICTIONARIES: Record<LanguageCode, Dictionary> = {
  en: {
    "nav.courses": "Courses",
    "nav.match": "Match",
    "nav.careers": "Careers",
    "nav.institutions": "Institutions",
    "nav.funding": "Funding",
    "nav.skills": "Skills",
    "nav.opportunities": "Opportunities",
    "nav.guides": "Guides",
    "nav.ask": "Ask",
    "nav.account": "Account",
    "nav.search": "Search",
    "nav.checkOptions": "Check My Options",
    "nav.openMenu": "Open menu",
    "nav.closeMenu": "Close menu",
    "route.match.eyebrow": "What do I qualify for?",
    "route.match.title": "Check your options",
    "route.match.description": "A calm, four-step check based on your matric subjects and interests. No account needed.",
    "route.courses.eyebrow": "What can I study?",
    "route.courses.title": "Explore every learning opportunity",
    "route.courses.description": "Universities, TVET colleges, private colleges, learnerships and short courses - filter by what matters to you.",
    "route.careers.eyebrow": "Where does this lead?",
    "route.careers.title": "Career pathways",
    "route.careers.description": "Start from a career you want, and see the subjects, study routes and skills that get you there.",
    "route.institutions.eyebrow": "Where can I study?",
    "route.institutions.title": "Institutions",
    "route.institutions.description": "Verified universities, universities of technology, TVET colleges and private institutions across South Africa.",
    "route.funding.eyebrow": "How will I pay?",
    "route.funding.title": "Funding your studies",
    "route.funding.description": "Clear, calm information about NSFAS, bursaries, scholarships and learnership funding - so cost is never the reason you don't apply.",
    "route.skills.eyebrow": "What can I learn today?",
    "route.skills.title": "Job-ready skills",
    "route.skills.description": "Practical skills that make you employable - start now, mostly free, and connect each skill to real career and study routes.",
    "route.opportunities.eyebrow": "What can I apply for right now?",
    "route.opportunities.title": "Open opportunities",
    "route.opportunities.description": "Real listings with real deadlines. Filter by province, sector and opportunity type.",
    "route.guides.eyebrow": "Understand the system",
    "route.guides.title": "Plain-English guides",
    "route.guides.description": "Every confusing acronym, process and decision - explained simply. No jargon, no fluff.",
    "landing.eyebrow": "South African education, made clear",
    "landing.tagline": "Gain Skills. Get Qualifications. Get Hired.",
    "landing.description":
      "Find courses, careers, funding and skills paths that match your results and your goals - all in one calm, verified place.",
    "landing.browseCourses": "Browse Courses",
    "landing.deadlinesEyebrow": "Applications and funding",
    "landing.deadlinesTitle": "Deadline watch",
    "landing.quickExplore": "Explore",
    "landing.missionEyebrow": "Why SA Learn",
    "landing.missionTitle": "Our mission",
    "landing.missionLead":
      "To become South Africa's most trusted education discovery platform - making post-school opportunities simple, transparent and accessible.",
    "landing.missionBody":
      "We don't just help you pick a course. We help you build a realistic path towards employment: study routes, funding, live opportunities and job-ready skills, all connected.",
    "landing.stepsEyebrow": "Three simple steps",
    "landing.stepsTitle": "How it works",
    "landing.testimonialsEyebrow": "Learner voices",
    "landing.testimonialsTitle": "Real learner feedback",
    "landing.testimonialsEmpty":
      "Approved learner testimonials will appear here after moderation. SA Learn does not publish invented quotes.",
    "landing.testimonialSubmit": "Share feedback",
    "landing.testimonialName": "Display name",
    "landing.testimonialProvince": "Province",
    "landing.testimonialQuote": "Feedback",
    "landing.testimonialConsent":
      "I consent to SA Learn reviewing and publishing this feedback with my display name.",
    "landing.testimonialSubmitButton": "Submit for review",
    "landing.testimonialSignIn": "Sign in from Account to submit learner feedback.",
    "footer.discover": "Discover",
    "footer.plan": "Plan",
    "footer.learn": "Learn",
    "footer.verification": "Information may require verification.",
    "footer.sources": "Sources: SAQA, DHET, NSFAS, SETAs and institutional publications.",
  },
  zu: {
    "nav.courses": "Izifundo",
    "nav.match": "Ukuqhathanisa",
    "nav.careers": "Imisebenzi",
    "nav.institutions": "Izikhungo",
    "nav.funding": "Uxhaso",
    "nav.skills": "Amakhono",
    "nav.opportunities": "Amathuba",
    "nav.guides": "Imihlahlandlela",
    "nav.ask": "Buza",
    "nav.account": "I-akhawunti",
    "nav.search": "Sesha",
    "nav.checkOptions": "Hlola amathuba ami",
    "nav.openMenu": "Vula imenyu",
    "nav.closeMenu": "Vala imenyu",
    "route.match.eyebrow": "Yini engingayifundela?",
    "route.match.title": "Hlola amathuba akho",
    "route.match.description": "Ukuhlola okuzolile ngezifundo zakho, amamaki nezinto ozithandayo. Akudingeki i-akhawunti.",
    "route.courses.eyebrow": "Ngingafundani?",
    "route.courses.title": "Hlola amathuba okufunda",
    "route.courses.description": "Amanyuvesi, ama-TVET, izikhungo ezizimele, ama-learnership nezifundo ezimfishane.",
    "route.careers.eyebrow": "Kuholela kuphi?",
    "route.careers.title": "Izindlela zemisebenzi",
    "route.careers.description": "Qala ngomsebenzi owufunayo ubone izifundo, izindlela namakhono akudingayo.",
    "route.institutions.eyebrow": "Ngingafunda kuphi?",
    "route.institutions.title": "Izikhungo",
    "route.institutions.description": "Amanyuvesi, ama-TVET nezikhungo ezizimele eNingizimu Afrika.",
    "route.funding.eyebrow": "Ngizokhokha kanjani?",
    "route.funding.title": "Uxhaso lwezifundo",
    "route.funding.description": "Ulwazi olucacile nge-NSFAS, amabhasari, imifundaze nama-learnership.",
    "route.skills.eyebrow": "Ngingafundani namuhla?",
    "route.skills.title": "Amakhono omsebenzi",
    "route.skills.description": "Amakhono asebenzayo axhuma emisebenzini nasezifundweni.",
    "route.opportunities.eyebrow": "Yini engingayifaka isicelo manje?",
    "route.opportunities.title": "Amathuba avulekile",
    "route.opportunities.description": "Uhlu olunemihla yokugcina. Hlunga ngesifundazwe, umkhakha nohlobo.",
    "route.guides.eyebrow": "Qonda uhlelo",
    "route.guides.title": "Imihlahlandlela ecacile",
    "route.guides.description": "Amagama, izinqubo nezinqumo ezinzima zichazwe kalula.",
    "landing.eyebrow": "Imfundo yaseNingizimu Afrika, icaciswe",
    "landing.tagline": "Thola amakhono. Thola iziqu. Thola umsebenzi.",
    "landing.description":
      "Thola izifundo, imisebenzi, uxhaso namakhono ahambisana nemiphumela yakho nezinhloso zakho.",
    "landing.browseCourses": "Buka izifundo",
    "landing.deadlinesEyebrow": "Izicelo noxhaso",
    "landing.deadlinesTitle": "Izinsuku zokugcina",
    "landing.quickExplore": "Bheka",
    "landing.missionEyebrow": "Kungani i-SA Learn",
    "landing.missionTitle": "Umgomo wethu",
    "landing.missionLead":
      "Ukuba indawo ethembekile yaseNingizimu Afrika yokuthola izindlela zemfundo ezicacile.",
    "landing.missionBody":
      "Asikusizi ukukhetha isifundo kuphela. Sixhumanisa izifundo, uxhaso, amathuba namakhono omsebenzi.",
    "landing.stepsEyebrow": "Izinyathelo ezintathu",
    "landing.stepsTitle": "Isebenza kanjani",
    "landing.testimonialsEyebrow": "Amazwi abafundi",
    "landing.testimonialsTitle": "Impendulo yabafundi bangempela",
    "landing.testimonialsEmpty":
      "Impendulo evunyelwe izovela lapha ngemva kokubuyekezwa. I-SA Learn ayishicileli amazwi aqanjiwe.",
    "landing.testimonialSubmit": "Thumela impendulo",
    "landing.testimonialName": "Igama elizovela",
    "landing.testimonialProvince": "Isifundazwe",
    "landing.testimonialQuote": "Impendulo",
    "landing.testimonialConsent":
      "Ngiyavuma ukuthi i-SA Learn ibuyekeze futhi ishicilele le mpendulo negama lami.",
    "landing.testimonialSubmitButton": "Thumela ukuze kubuyekezwe",
    "landing.testimonialSignIn": "Ngena ku-Akhawunti ukuze uthumele impendulo.",
    "footer.discover": "Thola",
    "footer.plan": "Hlela",
    "footer.learn": "Funda",
    "footer.verification": "Ulwazi lungadinga ukuqinisekiswa.",
    "footer.sources": "Imithombo: SAQA, DHET, NSFAS, SETAs nezikhungo.",
  },
  af: {
    "nav.courses": "Kursusse",
    "nav.match": "Pasmaat",
    "nav.careers": "Loopbane",
    "nav.institutions": "Instellings",
    "nav.funding": "Befondsing",
    "nav.skills": "Vaardighede",
    "nav.opportunities": "Geleenthede",
    "nav.guides": "Gidse",
    "nav.ask": "Vra",
    "nav.account": "Rekening",
    "nav.search": "Soek",
    "nav.checkOptions": "Kyk na my opsies",
    "nav.openMenu": "Maak kieslys oop",
    "nav.closeMenu": "Maak kieslys toe",
    "route.match.eyebrow": "Waarvoor kwalifiseer ek?",
    "route.match.title": "Kyk na jou opsies",
    "route.match.description": "Vier rustige stappe gebaseer op jou vakke, punte en belangstellings. Geen rekening nodig nie.",
    "route.courses.eyebrow": "Wat kan ek studeer?",
    "route.courses.title": "Verken leergeleenthede",
    "route.courses.description": "Universiteite, TVET-kolleges, privaat instellings, leerlingskappe en kortkursusse.",
    "route.careers.eyebrow": "Waarheen lei dit?",
    "route.careers.title": "Loopbaanpaaie",
    "route.careers.description": "Begin by 'n loopbaan en sien die vakke, roetes en vaardighede wat jou daarheen neem.",
    "route.institutions.eyebrow": "Waar kan ek studeer?",
    "route.institutions.title": "Instellings",
    "route.institutions.description": "Universiteite, TVET-kolleges en privaat instellings regoor Suid-Afrika.",
    "route.funding.eyebrow": "Hoe betaal ek?",
    "route.funding.title": "Befonds jou studies",
    "route.funding.description": "Duidelike inligting oor NSFAS, beurse, studiebeurse en leerlingskapbefondsing.",
    "route.skills.eyebrow": "Wat kan ek vandag leer?",
    "route.skills.title": "Werksgereed vaardighede",
    "route.skills.description": "Praktiese vaardighede wat met loopbane en studieroetes verbind.",
    "route.opportunities.eyebrow": "Waarvoor kan ek nou aansoek doen?",
    "route.opportunities.title": "Oop geleenthede",
    "route.opportunities.description": "Regte lyste met sperdatums. Filter volgens provinsie, sektor en tipe.",
    "route.guides.eyebrow": "Verstaan die stelsel",
    "route.guides.title": "Gewone-taal gidse",
    "route.guides.description": "Verwarrende terme, prosesse en besluite eenvoudig verduidelik.",
    "landing.eyebrow": "Suid-Afrikaanse onderwys, duidelik gemaak",
    "landing.tagline": "Bou vaardighede. Kry kwalifikasies. Kry werk.",
    "landing.description":
      "Vind kursusse, loopbane, befondsing en vaardigheidspaaie wat by jou punte en doelwitte pas.",
    "landing.browseCourses": "Blaai deur kursusse",
    "landing.deadlinesEyebrow": "Aansoeke en befondsing",
    "landing.deadlinesTitle": "Sperdatums",
    "landing.quickExplore": "Verken",
    "landing.missionEyebrow": "Hoekom SA Learn",
    "landing.missionTitle": "Ons missie",
    "landing.missionLead":
      "Om Suid-Afrika se mees betroubare onderwysplatform vir duidelike naskoolse opsies te word.",
    "landing.missionBody":
      "Ons help jou nie net om 'n kursus te kies nie. Ons verbind studieroetes, befondsing, geleenthede en werkvaardighede.",
    "landing.stepsEyebrow": "Drie eenvoudige stappe",
    "landing.stepsTitle": "Hoe dit werk",
    "landing.testimonialsEyebrow": "Leerderstemme",
    "landing.testimonialsTitle": "Regte leerderterugvoer",
    "landing.testimonialsEmpty":
      "Goedgekeurde leerderterugvoer sal hier verskyn na moderering. SA Learn publiseer nie uitgedinkte aanhalings nie.",
    "landing.testimonialSubmit": "Deel terugvoer",
    "landing.testimonialName": "Vertoonnaam",
    "landing.testimonialProvince": "Provinsie",
    "landing.testimonialQuote": "Terugvoer",
    "landing.testimonialConsent":
      "Ek stem in dat SA Learn hierdie terugvoer met my vertoonnaam mag hersien en publiseer.",
    "landing.testimonialSubmitButton": "Dien in vir hersiening",
    "landing.testimonialSignIn": "Meld aan by Rekening om terugvoer te stuur.",
    "footer.discover": "Ontdek",
    "footer.plan": "Beplan",
    "footer.learn": "Leer",
    "footer.verification": "Inligting moet moontlik geverifieer word.",
    "footer.sources": "Bronne: SAQA, DHET, NSFAS, SETAs en instellingspublikasies.",
  },
  xh: {
    "nav.courses": "Izifundo",
    "nav.match": "Ukuthelekisa",
    "nav.careers": "Imisebenzi",
    "nav.institutions": "Amaziko",
    "nav.funding": "Inkxaso-mali",
    "nav.skills": "Izakhono",
    "nav.opportunities": "Amathuba",
    "nav.guides": "Izikhokelo",
    "nav.ask": "Buza",
    "nav.account": "Iakhawunti",
    "nav.search": "Khangela",
    "nav.checkOptions": "Jonga iinketho zam",
    "nav.openMenu": "Vula imenyu",
    "nav.closeMenu": "Vala imenyu",
    "route.match.eyebrow": "Ndifanelekile kwintoni?",
    "route.match.title": "Jonga iinketho zakho",
    "route.match.description": "Ukujonga ngamanyathelo amane ngokusekelwe kwizifundo, amanqaku nezinto ozithandayo.",
    "route.courses.eyebrow": "Ndingafunda ntoni?",
    "route.courses.title": "Phonononga amathuba okufunda",
    "route.courses.description": "Iiyunivesithi, ii-TVET, amaziko abucala, ii-learnership nezifundo ezimfutshane.",
    "route.careers.eyebrow": "Oku kundisa phi?",
    "route.careers.title": "Iindlela zemisebenzi",
    "route.careers.description": "Qala ngomsebenzi owufunayo uze ubone izifundo, iindlela nezakhono.",
    "route.institutions.eyebrow": "Ndingafunda phi?",
    "route.institutions.title": "Amaziko",
    "route.institutions.description": "Iiyunivesithi, ii-TVET namaziko abucala kuMzantsi Afrika.",
    "route.funding.eyebrow": "Ndiza kuhlawula njani?",
    "route.funding.title": "Inkxaso-mali yezifundo",
    "route.funding.description": "Ulwazi olucacileyo nge-NSFAS, iibhasari, izibonelelo ne-learnership.",
    "route.skills.eyebrow": "Ndingafunda ntoni namhlanje?",
    "route.skills.title": "Izakhono zomsebenzi",
    "route.skills.description": "Izakhono ezisebenzayo ezidityaniswe nemisebenzi neendlela zokufunda.",
    "route.opportunities.eyebrow": "Ndingafaka isicelo sentoni ngoku?",
    "route.opportunities.title": "Amathuba avulekileyo",
    "route.opportunities.description": "Uluhlu olunemihla yokugqibela. Hluza ngephondo, icandelo nohlobo.",
    "route.guides.eyebrow": "Qonda inkqubo",
    "route.guides.title": "Izikhokelo ezilula",
    "route.guides.description": "Amagama, iinkqubo nezigqibo ezididayo zichazwe ngokulula.",
    "landing.eyebrow": "Imfundo yaseMzantsi Afrika, yenziwe yacaca",
    "landing.tagline": "Fumana izakhono. Fumana iziqinisekiso. Fumana umsebenzi.",
    "landing.description":
      "Fumana izifundo, imisebenzi, inkxaso-mali kunye nezakhono ezihambelana neziphumo neenjongo zakho.",
    "landing.browseCourses": "Buka izifundo",
    "landing.deadlinesEyebrow": "Izicelo nenkxaso-mali",
    "landing.deadlinesTitle": "Imihla yokugqibela",
    "landing.quickExplore": "Phonononga",
    "landing.missionEyebrow": "Kutheni SA Learn",
    "landing.missionTitle": "Injongo yethu",
    "landing.missionLead":
      "Ukuba liqonga elithembekileyo eMzantsi Afrika lokucacisa amathuba emfundo emva kwesikolo.",
    "landing.missionBody":
      "Asikuncedi ukukhetha isifundo kuphela. Sidibanisa iindlela zokufunda, inkxaso-mali, amathuba nezakhono zomsebenzi.",
    "landing.stepsEyebrow": "Amanyathelo amathathu",
    "landing.stepsTitle": "Isebenza njani",
    "landing.testimonialsEyebrow": "Amazwi abafundi",
    "landing.testimonialsTitle": "Ingxelo yabafundi bokwenene",
    "landing.testimonialsEmpty":
      "Ingxelo evunyiweyo iya kuvela apha emva kokumodareyithwa. SA Learn ayipapashi amazwi ayiliweyo.",
    "landing.testimonialSubmit": "Yabelana ngengxelo",
    "landing.testimonialName": "Igama eliboniswayo",
    "landing.testimonialProvince": "Iphondo",
    "landing.testimonialQuote": "Ingxelo",
    "landing.testimonialConsent":
      "Ndiyavuma ukuba SA Learn iphonononge kwaye ipapashe le ngxelo negama lam.",
    "landing.testimonialSubmitButton": "Thumela ukuze kuhlolwe",
    "landing.testimonialSignIn": "Ngena kwiAkhawunti ukuze uthumele ingxelo.",
    "footer.discover": "Fumana",
    "footer.plan": "Cwangcisa",
    "footer.learn": "Funda",
    "footer.verification": "Ulwazi lusenokufuna ukuqinisekiswa.",
    "footer.sources": "Imithombo: SAQA, DHET, NSFAS, SETAs namaziko.",
  },
  st: {
    "nav.courses": "Dithuto",
    "nav.match": "Tshwantsho",
    "nav.careers": "Mesebetsi",
    "nav.institutions": "Ditheo",
    "nav.funding": "Tshehetso",
    "nav.skills": "Bokgoni",
    "nav.opportunities": "Menyetla",
    "nav.guides": "Ditataiso",
    "nav.ask": "Botsa",
    "nav.account": "Akhaonto",
    "nav.search": "Batla",
    "nav.checkOptions": "Sheba dikgetho tsa ka",
    "nav.openMenu": "Bula menyu",
    "nav.closeMenu": "Kwala menyu",
    "route.match.eyebrow": "Ke tšoaneleha ho eng?",
    "route.match.title": "Sheba dikgetho tsa hao",
    "route.match.description": "Tlhahlobo ya mehato e mene e thehilweng dithutong, matshwaong le dithahasellong tsa hao.",
    "route.courses.eyebrow": "Nka ithuta eng?",
    "route.courses.title": "Lekola menyetla ya thuto",
    "route.courses.description": "Diyunivesithi, TVET, ditheo tsa poraefete, learnership le dithuto tse kgutshwane.",
    "route.careers.eyebrow": "Sena se isa hokae?",
    "route.careers.title": "Ditsela tsa mesebetsi",
    "route.careers.description": "Qala ka mosebetsi oo o o batlang mme o bone dithuto, ditsela le bokgoni.",
    "route.institutions.eyebrow": "Nka ithuta kae?",
    "route.institutions.title": "Ditheo",
    "route.institutions.description": "Diyunivesithi, TVET le ditheo tsa poraefete Afrika Borwa.",
    "route.funding.eyebrow": "Ke tla lefa jwang?",
    "route.funding.title": "Tshehetso ya dithuto",
    "route.funding.description": "Tlhahisoleseding e hlakileng ka NSFAS, dibasari, dithuso le learnership.",
    "route.skills.eyebrow": "Nka ithuta eng kajeno?",
    "route.skills.title": "Bokgoni ba mosebetsi",
    "route.skills.description": "Bokgoni bo sebetsang bo hokahaneng le mesebetsi le ditsela tsa thuto.",
    "route.opportunities.eyebrow": "Nka etsa kopo ya eng hona jwale?",
    "route.opportunities.title": "Menyetla e bulehileng",
    "route.opportunities.description": "Manane a nang le matsatsi a ho qetela. Hlopha ka porofense, lekala le mofuta.",
    "route.guides.eyebrow": "Utlwisisa tsamaiso",
    "route.guides.title": "Ditataiso tse bonolo",
    "route.guides.description": "Mantswe, ditsamaiso le diqeto tse ferekanyang di hlalositswe habonolo.",
    "landing.eyebrow": "Thuto ya Afrika Borwa, e hlakisitswe",
    "landing.tagline": "Fumana bokgoni. Fumana mangolo. Fumana mosebetsi.",
    "landing.description":
      "Fumana dithuto, mesebetsi, tshehetso le ditsela tsa bokgoni tse dumellanang le diphetho le dipakane tsa hao.",
    "landing.browseCourses": "Sheba dithuto",
    "landing.deadlinesEyebrow": "Dikopo le tshehetso",
    "landing.deadlinesTitle": "Matsatsi a ho qetela",
    "landing.quickExplore": "Lekola",
    "landing.missionEyebrow": "Hobaneng SA Learn",
    "landing.missionTitle": "Morero wa rona",
    "landing.missionLead":
      "Ho ba sethala se tshepehang sa Afrika Borwa se hlakisang menyetla ya thuto kamora sekolo.",
    "landing.missionBody":
      "Ha re o thuse feela ho kgetha thuto. Re hokahanya ditsela tsa thuto, tshehetso, menyetla le bokgoni ba mosebetsi.",
    "landing.stepsEyebrow": "Mehato e meraro",
    "landing.stepsTitle": "Kamoo e sebetsang kateng",
    "landing.testimonialsEyebrow": "Mantswe a baithuti",
    "landing.testimonialsTitle": "Maikutlo a baithuti ba nnete",
    "landing.testimonialsEmpty":
      "Maikutlo a amohetsweng a tla hlaha mona kamora tlhahlobo. SA Learn ha e phatlalatse mantsoe a iqapetsweng.",
    "landing.testimonialSubmit": "Arolelana maikutlo",
    "landing.testimonialName": "Lebitso le bontshwang",
    "landing.testimonialProvince": "Porofense",
    "landing.testimonialQuote": "Maikutlo",
    "landing.testimonialConsent":
      "Ke dumela hore SA Learn e hlahlobe le ho phatlalatsa maikutlo ana ka lebitso la ka.",
    "landing.testimonialSubmitButton": "Romela bakeng sa tlhahlobo",
    "landing.testimonialSignIn": "Kena Akhaontong ho romela maikutlo.",
    "footer.discover": "Fumana",
    "footer.plan": "Rera",
    "footer.learn": "Ithute",
    "footer.verification": "Tlhahisoleseding e ka hloka netefatso.",
    "footer.sources": "Mehlodi: SAQA, DHET, NSFAS, SETAs le diphatlalatso tsa ditheo.",
  },
};

type I18nContextValue = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function isLanguageCode(value: string | null): value is LanguageCode {
  return LANGUAGES.some((language) => language.code === value);
}

export function readStoredLanguage(storage: Pick<Storage, "getItem">) {
  const stored = storage.getItem(STORAGE_KEY);
  return isLanguageCode(stored) ? stored : "en";
}

export function persistLanguage(
  language: LanguageCode,
  storage: Pick<Storage, "setItem">,
  documentElement: Pick<HTMLElement, "lang">,
) {
  documentElement.lang = language;
  storage.setItem(STORAGE_KEY, language);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    setLanguageState(readStoredLanguage(window.localStorage));
  }, []);

  useEffect(() => {
    persistLanguage(language, window.localStorage, document.documentElement);
  }, [language]);

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage: setLanguageState,
      t: (key) => DICTIONARIES[language][key] ?? DICTIONARIES.en[key] ?? key,
    }),
    [language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider");
  return context;
}
