import type { Guide } from "./data";

type GuideBody = Pick<Guide, "title" | "summary" | "plainLanguage" | "keyPoints" | "steps">;

// Codex: Full isiZulu guide bodies
// Status: Every published guide has translated title, summary, explanation, key points and steps.
export const GUIDE_ZU: Record<string, GuideBody> = {
  "aps-explained": {
    title: "Ukuqonda i-APS",
    summary: "Indlela i-Admission Point Score esebenza ngayo nokubala amaphuzu akho.",
    plainLanguage: "I-APS iguqula amaphesenti akho kamatikuletsheni abe amaphuzu asetshenziswa izikhungo ukuhlola ukuthi uyahlangabezana yini nezidingo zokuqala zohlelo.",
    keyPoints: ["Indlela yokubala ingahluka ngesikhungo.", "I-Life Orientation ivamise ukungabalwa.", "Hlola nezifundo namamaki adingekayo, hhayi i-APS kuphela."],
    steps: ["Bhala izifundo namaphesenti akho.", "Susa i-Life Orientation uma ingabalwa.", "Guqula amamaki abe amaphuzu ngokwesikali sesikhungo.", "Hlanganisa inani lezifundo elidingekayo.", "Qhathanisa nesidingo sohlelo bese uhlola nemithetho yezifundo."],
  },
  "nqf-explained": {
    title: "Ukuqonda i-NQF",
    summary: "I-National Qualifications Framework nokuthi amazinga ayo asho ukuthini.",
    plainLanguage: "Amazinga e-NQF akhombisa indawo yeziqu ohlelweni lukazwelonke, kusukela ezitifiketini kuya ezifundweni eziphakeme.",
    keyPoints: ["Izinga le-NQF alisho ikhwalithi yodwa.", "Izitifiketi, amadiploma namadigri asemabangeni ahlukene.", "Qinisekisa ukuthi iziqu zibhalisiwe noma ziyaziwa."],
  },
  "saqa-explained": {
    title: "Ukuqonda i-SAQA",
    summary: "Indima ye-South African Qualifications Authority.",
    plainLanguage: "I-SAQA isiza abafundi bahlole iziqu ezibhalisiwe nokuthi zingena kanjani kuhlaka lukazwelonke.",
    keyPoints: ["I-SAQA iyindawo esemthethweni yokuhlola iziqu.", "Ikhasi lokukhangisa lomhlinzeki alanele njengobufakazi.", "Hlola izixhumanisi zemithombo esemthethweni."],
  },
  "dhet-explained": {
    title: "Ukuqonda i-DHET",
    summary: "Lokho okwenziwa uMnyango Wezemfundo Ephakeme Nokuqeqesha.",
    plainLanguage: "I-DHET ingumnyango kahulumeni obhekele imfundo yangemva kwesikole, amanyuvesi, amakolishi e-TVET nokuthuthukiswa kwamakhono.",
    keyPoints: ["I-DHET ibalulekile ohlelweni lwemfundo yangemva kwesikole.", "Amanyuvesi omphakathi nama-TVET ayingxenye yalolu hlelo.", "Abahlinzeki abazimele badinga ubufakazi bokubhaliswa noma ukugunyazwa."],
  },
  "nsfas-explained": {
    title: "Ukuqonda i-NSFAS",
    summary: "Ubani ofanelekayo, okukhokhelwayo nendlela yokufaka isicelo.",
    plainLanguage: "I-NSFAS isiza abafundi baseNingizimu Afrika abafanelekayo ukukhokhela izifundo ezigunyaziwe emanyuvesi omphakathi nasema-TVET.",
    keyPoints: ["Imithetho ingashintsha minyaka yonke; hlola i-NSFAS esemthethweni.", "Ukuhlolwa kwezimali kungase kusebenzise ulwazi lomuntu siqu.", "Ungakhokheli umuntu othembisa ukugunyazwa okuqinisekisiwe."],
    steps: ["Hlola ukuthi isikhungo nohlobo lweziqu kuyaxhaswa yini.", "Lungisa omazisi, imininingwane yasekhaya nemibhalo yezifundo.", "Faka isicelo ngesiteshi esisemthethweni se-NSFAS.", "Landela isimo sesicelo esisemthethweni.", "Gcina amakhophi emibhalo nemiyalezo."],
  },
  "university-vs-tvet": {
    title: "Inyuvesi noma i-TVET",
    summary: "Izindlela ezimbili ezisemthethweni nokukhetha ngokwemigomo yakho.",
    plainLanguage: "Inyuvesi ne-TVET kokubili kungaba ukukhetha okuhle. Isinqumo sincike emgomweni, endleleni yokufunda, emamakini, kwisabelomali nasemsebenzini owufunayo.",
    keyPoints: ["Amanyuvesi avamise ukugxila kumadigri nasethiyori.", "Ama-TVET avamise ukugxila ekusebenzeni nasemakhonweni omsebenzi.", "Indlela esebenzayo ayiphansi uma ihambisana nomgomo wakho."],
  },
  "diploma-vs-degree": {
    title: "IDiploma noma iDegree",
    summary: "Umehluko wesikhathi, izindleko namathuba omsebenzi.",
    plainLanguage: "Amadiploma namadigri kokubili kungaholela emsebenzini, kodwa kuyahluka ekujuleni, ezidingweni zokungena, esikhathini nasendleleni yomsebenzi.",
    keyPoints: ["IDiploma ivamise ukugxila emsebenzini nasekusebenzeni.", "IDegree iyadingeka kweminye imisebenzi noma izifundo eziphakeme.", "IHigher Certificate ingaba ibhuloho lokuya phambili."],
  },
  "how-applications-work": {
    title: "Indlela Izicelo Ezisebenza Ngayo",
    summary: "Imibhalo, izinsuku zokuvala nalokho okulindelekile.",
    plainLanguage: "Izicelo ziba lula uma ulandela imibhalo, izinsuku zokuvala nezixhumanisi ezisemthethweni ngaphambi kosuku lokuvala.",
    keyPoints: ["Faka isicelo kuphela ngeziteshi ezisemthethweni.", "Gcina ubufakazi bokuthumela.", "Ezinye izindlela zidinga izivivinyo, iphothifoliyo, inhlolokhono noma imibhalo eyengeziwe."],
    steps: ["Khetha isifundo noma ithuba.", "Hlola izidingo nosuku lokuvala emthonjeni osemthethweni.", "Qoqa imibhalo ngaphambi kokuqala.", "Thumela ngesixhumanisi esisemthethweni.", "Gcina ubufakazi bese ubheka imiyalezo yokulandelela."],
  },
  "avoiding-fake-colleges": {
    title: "Ukugwema Amakolishi Omgunyathi",
    summary: "Indlela yokuqinisekisa ukugunyazwa ngaphambi kokukhokha.",
    plainLanguage: "Ikolishi lingabonakala lithembekile ku-inthanethi kodwa lingaphephile. Qinisekisa ukubhaliswa, ukugunyazwa nobufakazi obusemthethweni ngaphambi kokukhokha.",
    keyPoints: ["Ungathembi ukucindezelwa noma izithembiso zomsebenzi oqinisekisiwe.", "Hlola amarejista nezixhumanisi ezisemthethweni.", "Qaphela uma umhlinzeki engakwazi ukuchaza iziqu nesimo sokubhaliswa."],
    steps: ["Thola igama elisemthethweni lomhlinzeki.", "Funa ubufakazi bokubhaliswa noma ukugunyazwa.", "Hlola igama leziqu nezinga le-NQF.", "Qinisekisa ngemininingwane kahulumeni noma yeziphathimandla.", "Ungakhokhi kuze kucace konke."],
  },
  "career-planning": {
    title: "Ukuhlela Umsebenzi",
    summary: "Indlela elula yokukhetha isinyathelo esilandelayo.",
    plainLanguage: "Ukuhlela umsebenzi kusho ukuqhathanisa okuthandayo, ongakwazi ukukufinyelela, okufanelekelayo nomsebenzi ongavela endleleni oyikhethayo.",
    keyPoints: ["Qala ngezindlela ezingaphezu kweyodwa.", "Qhathanisa izifundo, amakhono namathuba ndawonye.", "Uma uphuthelwa yisidingo esisodwa, bheka ezinye izindlela."],
  },
};

export const GLOSSARY_ZU: Record<string, string> = {
  APS: "I-Admission Point Score: isamba samaphuzu asuselwa emamakini kamatikuletsheni asetshenziswa ukuhlola ukungena.",
  NQF: "I-National Qualifications Framework: uhlelo lwamazinga oluqhathanisa iziqu zaseNingizimu Afrika.",
  SAQA: "I-South African Qualifications Authority: igunya eliphethe uhlaka lukazwelonke lweziqu.",
  DHET: "UMnyango Wezemfundo Ephakeme Nokuqeqesha.",
  NSFAS: "Uhlelo lukahulumeni losizo lwezimali lwabafundi abafanelekayo ezikhungweni zomphakathi.",
  TVET: "Imfundo nokuqeqeshwa kobuchwepheshe nemisebenzi egxile emakhonweni asebenzayo.",
  Accreditation: "Ubufakazi bokuthi isikhungo noma uhlelo luhlolwe yigunya elifanele.",
  Learnership: "Indlela ehlanganisa ukufunda nolwazi lwasemsebenzini, ngokuvamile ihlobene ne-SETA.",
  Diploma: "Iziqu zemfundo ephakeme ezigxile emsebenzini nasekusebenzeni.",
  Degree: "Iziqu zemfundo ephakeme ezivamise ukuhlinzekwa yinyuvesi.",
  "Higher Certificate": "Iziqu zokuqala zemfundo ephakeme ezingavula indlela eya ezifundweni eziqhubekayo.",
};
