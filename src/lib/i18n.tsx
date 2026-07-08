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
    "nav.account": "Account",
    "nav.search": "Search",
    "nav.checkOptions": "Check My Options",
    "nav.openMenu": "Open menu",
    "nav.closeMenu": "Close menu",
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
    "footer.prototype": "Prototype - information not yet verified.",
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
    "nav.account": "I-akhawunti",
    "nav.search": "Sesha",
    "nav.checkOptions": "Hlola amathuba ami",
    "nav.openMenu": "Vula imenyu",
    "nav.closeMenu": "Vala imenyu",
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
    "footer.prototype": "I-prototype - ulwazi alukaqinisekiswa ngokuphelele.",
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
    "nav.account": "Rekening",
    "nav.search": "Soek",
    "nav.checkOptions": "Kyk na my opsies",
    "nav.openMenu": "Maak kieslys oop",
    "nav.closeMenu": "Maak kieslys toe",
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
    "footer.prototype": "Prototipe - inligting nog nie volledig geverifieer nie.",
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
    "nav.account": "Iakhawunti",
    "nav.search": "Khangela",
    "nav.checkOptions": "Jonga iinketho zam",
    "nav.openMenu": "Vula imenyu",
    "nav.closeMenu": "Vala imenyu",
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
    "footer.prototype": "Iprototype - ulwazi alukaqinisekiswa ngokupheleleyo.",
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
    "nav.account": "Akhaonto",
    "nav.search": "Batla",
    "nav.checkOptions": "Sheba dikgetho tsa ka",
    "nav.openMenu": "Bula menyu",
    "nav.closeMenu": "Kwala menyu",
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
    "footer.prototype": "Prototype - tlhahisoleseding ha e so netefatswe ka botlalo.",
    "footer.sources": "Mehlodi: SAQA, DHET, NSFAS, SETAs le diphatlalatso tsa ditheo.",
  },
};

type I18nContextValue = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function isLanguageCode(value: string | null): value is LanguageCode {
  return LANGUAGES.some((language) => language.code === value);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLanguageCode(stored)) setLanguageState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(STORAGE_KEY, language);
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
