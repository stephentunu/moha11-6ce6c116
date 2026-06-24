import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "sw";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const swTranslations: Record<string, string> = {
  // Navigation / Common
  "Home": "Nyumbani",
  "Priorities": "Vipaumbele",
  "Foundation": "Taasisi ya Moha",
  "Featured Stories": "Ushuhuda",
  "Top Stories": "Habari Kuu",
  "Polling": "Kura ya Maoni",
  "Advertise With Us": "Tangaza Nasi",
  "Ask Me": "Niulize",
  "Sign In": "Ingia",
  "Donate": "Changia",
  "Donate Now": "Changia Sasa",
  "Support the Movement": "Unga Mkono Harakati",
  "Read the Manifesto": "Soma Ilani",
  "Mathare MP Aspirant • 2027": "Mwaniaji Mbunge wa Mathare • 2027",
  "MOHA": "MOHA",
  "Mathare 2027": "Mathare 2027",
  "Scroll": "Sogeza chini",

  // Homepage Hero
  "Moha Delivers.": "Moha Anawasilisha.",
  "Kuna More na Moha!": "Kuna Zaidi na Moha!",
  "A son of Mathare. A voice for the hustler, the student, the mama, and the mzee.": "Mtoto wa Mathare. Sauti ya hustler, mwanafunzi, mama, na mzee.",
  "Building a constituency where every life matters and every dream has a runway.": "Kujenga eneo bunge ambalo maisha ya kila mmoja ni muhimu na kila ndoto ina nafasi ya kufanikiwa.",
  
  // Activities
  "Daily Campaign Activities": "Shughuli za Kila Siku za Kampeni",
  "Today & Tomorrow": "Leo na Kesho",
  "Where Moha and the team will be on the ground. Activities disappear automatically after the event date.": "Mahali ambapo Moha na timu watakuwa nyanjani. Shughuli hufutika zenyewe baada ya tarehe ya tukio kupita.",
  "No public activities scheduled right now": "Hakuna shughuli za umma zilizoratibiwa kwa sasa",
  "Check back soon — we update this calendar daily.": "Angalia tena baadaye — tunasasisha kalenda hii kila siku.",
  
  // Stats
  "Bursaries Issued": "Bursary Zilizotolewa",
  "Community Projects": "Miradi ya Jamii",
  "Lives Touched": "Maisha Yaliyoguswa",
  "Mathare First": "Mathare Kwanza",
  
  // Pillars
  "Our Four Pillars": "Nguzo Zetu Nne",
  "What Moha is delivering": "Kile Ambacho Moha Anawasilisha",
  "A focused, people-first plan grounded in the realities of Mathare — built with the community, for the community.": "Mpango wenye mwelekeo, unaotanguliza wananchi na unaojikita katika uhalisia wa Mathare — uliojengwa na jamii, kwa ajili ya jamii.",
  "Education": "Elimu",
  "Bursaries, sponsorships & digital learning for every Mathare child.": "Bursary, udhamini na masomo ya kidijitali kwa kila mtoto wa Mathare.",
  "Health & Environment": "Afya na Mazingira",
  "SHA registration, clean rivers, dignified care close to home.": "Usajili wa SHA, mito safi, huduma ya heshima karibu na nyumbani.",
  "Businesses": "Biashara",
  "Capital, infrastructure & security for hustlers and mama mbogas.": "Mtaji, miundombinu na usalama kwa ma-hustler na mama mboga.",
  "Security & Safety": "Usalama na Ulinzi",
  "Safer streets, lit estates, and protection for every household.": "Mitaa salama zaidi, mitaa yenye taa, na ulinzi kwa kila boma.",
  "Explore": "Gundua",
  
  // On the Ground / Gallery
  "On the Ground": "Nyanjani",
  "Real work. Real Mathare.": "Kazi Halisi. Mathare Halisi.",
  "Snapshots from bursary drives, water donations, school visits, and community days — the work that doesn't wait for elections.": "Picha za bursary, misaada ya maji, ziara za shule, na siku za jamii — kazi ambayo haisubiri uchaguzi.",
  
  // Quote
  "Mathare raised me. Now it's my turn to raise Mathare. We don't need promises — we need delivery.": "Mathare alinilea. Sasa ni zamu yangu kuilea Mathare. Hatuhitaji ahadi — tunahitaji utendaji.",
  "Meet the Foundation": "Kutana na Taasisi",
  "Vote on the Issues": "Piga Kura Kuhusu Masuala",

  // Service in Action
  "Service in Action": "Huduma kwa Vitendo",
  "Power the Foundation": "Nguvu kwa Taasisi",
  "The hands behind every delivery": "Marafiki wanaofanikisha kila kazi",
  "Volunteers, organisers and friends of Mathare — showing up week after week.": "Wajitoleaji, waandaaji na marafiki wa Mathare — wanaojitolea wiki baada ya wiki.",
  "Team Moha": "Timu Moha",

  // Foundations List
  "Mama & Mzee Care": "Huduma ya Mama na Mzee",
  "Monthly food parcels, dignity packs, and emergency support for widows, orphans, and elderly residents across all 6 wards of Mathare.": "Vifurushi vya chakula vya kila mwezi, taulo za kike, na msaada wa dharura kwa wajane, yatima, na wazee katika wadi zote 6 za Mathare.",
  "500+ households reached": "Kaya 500+ zimefikiwa",
  "Monthly food & sanitary support drives": "Harakati za kila mwezi za kusambaza chakula na taulo za kike",
  "Emergency shelter for displaced families": "Hifadhi ya dharura kwa familia zilizohamishwa",
  "Mental health & trauma counseling": "Ushauri wa afya ya akili na majeraha ya kisaikolojia",
  "Legal aid for GBV survivors": "Msaada wa kisheria kwa waathiriwa wa GBV",
  "Elderly Persons' Homes": "Nyumba za Wazee",
  "Monthly stipend program for elderly residents": "Mpango wa ruzuku ya kila mwezi kwa wakazi wazee",
  "24/7 GBV rescue & safe-house network": "Mtandaoni wa uokoaji na nyumba salama za GBV za 24/7",

  "Bursaries& Scholarships": "Bursary na Udhamini",
  "Education Fund": "Hazina ya Elimu",
  "From primary school fees to university tuition — Moha's bursary program ensures no Mathare child is locked out of class because of money.": "Kuanzia karo ya shule ya msingi hadi masomo ya chuo kikuu — mpango wa bursary wa Moha unahakikisha hakuna mtoto wa Mathare anayefungiwa nje ya darasa kwa sababu ya pesa.",
  "600+ bursaries issued": "Bursary 600+ zimetolewa",
  "600+ senior school students supported": "Wanafunzi 600+ wa shule za upili wamesaidiwa",
  "60+ students fully sponsored": "Wanafunzi 60+ wamefadhiliwa kikamilifu",
  "School uniforms & textbooks distributed": "Sare za shule na vitabu vya kiada vimesambazwa",
  "Boarding & transport stipends": "Ruzuku ya bweni na usafiri",
  "Mentorship programs sponsored": "Mipango ya ushauri imefadhiliwa",
  "sanitary pads issued to girls": "Taulo za kike zimetolewa kwa wasichana",
  "Overseas & international scholarship pipeline": "Njia ya udhamini wa masomo ya ng'ambo na kimataifa",
  "Mathare alumni mentorship network": "Mtandaoni wa ushauri wa wanachuo wa Mathare",
  "Digital learning labs in every ward": "Vituo vya masomo ya kidijitali katika kila wadi",
  "University and TVET tuition support": "Msaada wa karo ya chuo kikuu na TVET",
  "Job recruitment and industrial attachment opportunities": "Fursa za ajira na mafunzo ya viwandani (attachment)",

  "PWD Inclusion": "Ujumuishaji wa PWD",
  "Accessible Mathare is our promise — wheelchairs, sign-language services, ramps, and economic empowerment for our brothers and sisters living with disabilities.": "Mathare inayofikika ni ahadi yetu — viti vya magurudumu, huduma za lugha ya ishara, njia za mteremko, na uwezeshaji wa kiuchumi kwa ndugu zetu wanaoishi na ulemavu.",
  "350+ PWDs empowered": "PWDs 350+ wamewezeshwa",
  "Free assistive devices (wheelchairs, white canes)": "Vifaa vya kusaidia bure (viti vya magurudumu, fimbo nyeupe)",
  "PWD entrepreneur grants": "Ruzuku kwa wajasiriamali walemavu (PWD)",
  "Regular assistive devices rollout": "Usambazaji wa mara kwa mara wa vifaa vya kusaidia",
  "PWD-friendly vocational training centre": "Kituo cha mafunzo ya kazi kinachofaa walemavu",
  "Inclusive sports league for PWDs": "Ligi ya michezo jumuishi kwa walemavu",
  "Sign-language interpreters at events": "Wakalimani wa lugha ya ishara kwenye hafla",

  "Team Moha on the Ground": "Timu Moha Nyanjani",
  "Mentorship circles, skills bootcamps, and community drives that put Mathare's youth at the centre of every action — because the future is already here.": "Vikundi vya ushauri, mafunzo ya ujuzi, na kampeni za jamii zinazoweka vijana wa Mathare katikati ya kila hatua — kwa sababu maisha ya baadaye tayari yameanza.",
  "5,000+ youth mobilised": "Vijana 5,000+ wamehamasishwa",
  "Door-to-door community mobilisation": "Uhamasishaji wa jamii mlango kwa mlango",
  "Leadership & mentorship circles": "Vikundi vya uongozi na ushauri",
  "Civic education and voter awareness": "Elimu ya uraia na uelewa wa wapiga kura",
  "Volunteer & internship pipeline": "Njia ya kujitolea na mafunzo ya kazi (internship)",
  "Recruitment & industrial attachment opportunities": "Fursa za kuajiriwa na mafunzo ya viwandani",
  "Youth innovation hub with free Wi-Fi": "Kituo cha uvumbuzi cha vijana chenye Wi-Fi ya bure",
  "Annual Mathare youth leadership summit": "Mkutano wa kilele wa kila mwaka wa uongozi wa vijana wa Mathare",
  "Expanding Moha's Biz Mtaani initiatives": "Kupanua mipango ya Moha ya Biz Mtaani",

  "Mathare Plays": "Mathare Inacheza",
  "From dusty pitches to medal podiums — Moha sponsors tournaments, kits, prizes, and cheers loudest when Mathare's talented kids take the stage.": "Kuanzia nyanja zenye vumbi hadi majukwaa ya medali — Moha anafadhili mashindano, vifaa, zawadi, na kushangilia kwa nguvu wakati watoto wenye vipaji wa Mathare wanaposhiriki.",
  "3+ tournaments backed": "Mashindano 3+ yamefadhiliwa",
  "Ladies tournaments": "Mashindano ya akina dada",
  "Trophies and medal": "Trophy na medali",
  "Adults' fun day": "Siku ya kujifurahisha ya watu wazima",
  "More organized grassroot sports with cash prizes": "Michezo iliyoratibiwa zaidi ya mashinani yenye zawadi za pesa",
  "Talent academy for music, dance & arts": "Akademia ya vipaji ya muziki, densi na sanaa",
  "Modern community sports complex": "Uwanja wa kisasa wa michezo wa jamii",

  "Books, Pens & More": "Vitabu, Kalamu na Mengi Zaidi",
  "Textbooks, exercise books, pens, rulers and full stationery kits delivered straight to learners — so the only thing standing between a child and class is their dream.": "Vitabu vya kiada, vitabu vya mazoezi, kalamu, rula na vifaa kamili vya uandishi vinavyofikishwa moja kwa moja kwa wanafunzi — ili kitu pekee kinachosimama kati ya mtoto na darasa kiwe ndoto yake.",
  "1,000+ supplies distributed": "Vifaa 1,000+ vimesambazwa",
  "Exercise books, pens, pencils & rulers": "Vitabu vya mazoezi, kalamu, penseli na rula",
  "Full back-to-school textbooks and stationery kits": "Vitabu kamili vya kurudi shule na vifaa vya uandishi",
  "Sponsorship from suppliers": "Udhamini kutoka kwa wasambazaji",
  "Community library in every ward": "Maktaba ya jamii katika kila wadi",
  "Termly stationery restock drives": "Kampeni za kila muhula za kuongeza vifaa vya uandishi",
  "Job opportunities and industrial attachment from suppliers and publishers": "Fursa za kazi na mafunzo kutoka kwa wasambazaji na wachapishaji",

  "Hustlers First": "Hustlers Kwanza",
  "Moha's team walks the markets — from mama mbogas to boda riders — backing the small businesses that keep Mathare moving.": "Timu ya Moha inatembea masokoni — kuanzia kwa mama mboga hadi waendeshaji boda — ikisaidia biashara ndogo ndogo zinazoweka Mathare katika mwendo.",
  "1,800+ hustlers supported": "Ma-hustler 1,800+ wamesaidiwa",
  "Capital boosts for mama mbogas & kiosks": "Nyongeza ya mtaji kwa mama mboga na vibanda",
  "Equipment & stock support": "Msaada wa vifaa na bidhaa",
  "Visibility on the Mathare Business Hub": "Kuonekana kwenye Kituo cha Biashara cha Mathare",
  "Mentorship for youth-led startups": "Ushauri kwa biashara changa zinazoongozwa na vijana",
  "Low-interest revolving credit fund": "Hazina ya mkopo inayozunguka ya riba nafuu",
  "Modern market stalls & cold storage": "Vibanda vya soko vya kisasa na bohari ya baridi",
  "Business skills bootcamps for hustlers": "Mafunzo makali ya ujuzi wa biashara kwa ma-hustler",
  "Mentorship and market growth through adverts": "Ushauri na ukuaji wa soko kupitia matangazo",

  "ECD & Kids": "ECD na Watoto",
  "Safe, nurturing learning spaces for our youngest — because the journey to a transformed Mathare begins in the ECD classroom.": "Maeneo salama na yenye kulelea masomo kwa wadogo zetu — kwa sababu safari ya kugeuza Mathare inaanza katika darasa ya ECD.",
  "30+ ECD centres reached": "Vituo vya ECD 30+ vimefikiwa",
  "Learning materials and play kits": "Vifaa vya kujifunzia na vifaa vya kuchezea",
  "Nutrition support for young learners": "Msaada wa lishe kwa wanafunzi wadogo",
  "More learning materials and play kits": "Vifaa zaidi vya kujifunzia na vya kuchezea",
  "Upgraded playgrounds and pitches": "Viwanja vilivyoboreshwa vya michezo na kuchezea",
  "Caregiver training & certification": "Mafunzo na uthibitisho wa walezi",
  "Caregiver & teacher support": "Msaada kwa walezi na walimu",

  // CTA Cards
  "Ask Moha": "Muulize Moha",
  "Your questions deserve answers. Send a question directly to Moha.": "Maswali yako yanastahili majibu. Tuma swali moja kwa moja kwa Moha.",
  "Ask now": "Uliza sasa",
  "Share Your Opinion": "Toa Maoni Yako",
  "Tell us what Mathare needs. Every voice shapes the manifesto.": "Tueleze kile Mathare inahitaji. Kila sauti inaunda ilani.",
  "Send a message": "Tuma ujumbe",

  // Priorities Page & Tabs
  "Our Priorities": "Vipaumbele Vyetu",
  "Education, Health, Business, Environment.": "Elimu, Afya, Biashara, Mazingira.",
  "Key Challenges We Must Solve": "Changamoto Kuu Tunazopaswa Kutatua",
  "What We Have Done": "Kile Tulichofanya",
  "Our Future Roadmap": "Mipango Yetu ya Baadaye",
  "Every child reads. Every dream is funded.": "Kila mtoto anasoma. Kila ndoto inafadhiliwa.",
  "Clean Mathare. Healthy Mathare. Dignified care.": "Mathare Safi. Mathare Yenye Afya. Huduma ya Heshima.",
  "Empowering local businesses, mama mbogas, and youth hubs.": "Kuwezesha biashara za ndani, mama mboga, na vitovu vya vijana.",
  "Ensuring safety and security for all residents.": "Kuhakikisha usalama na ulinzi kwa wakazi wote.",
  "Supporting other community and development initiatives.": "Kusaidia mipango mingine ya jamii na maendeleo.",

  // Challenges/Initiatives/Future for Education
  "Fee challenges": "Changamoto za karo za shule",
  "Undeveloped infrastructure": "Miundombinu duni",
  "Inadequate digital penetration/ICT": "Ukosefu wa vifaa vya kidijitali/Teknolojia",
  "Shortage of teachers": "Upungufu wa walimu",
  "Few public schools": "Shule chache za umma",
  "High dropout rates": "Kiwango kikubwa cha wanafunzi wanaoacha shule",
  "Unsafe learning environment": "Mazingira yasiyo salama ya kusomea",
  "Inadequate food/malnutrition": "Chakula kisichotosha/Utapiamlo",
  "Severe Overcrowding in classes": "Msongamano mkubwa darasani",
  "600+ bursaries issued to needy students": "Bursary 600+ zimetolewa kwa wanafunzi wenye mahitaji",
  "Over 60 students fully sponsored": "Zaidi ya wanafunzi 60 wamedhaminiwa kikamilifu",
  "Food donation to needy households": "Msaada wa chakula kwa kaya zenye mahitaji",
  "Feeding program to school children": "Mpango wa chakula kwa watoto wa shule",
  "Empowerment programs to parents and guardians to get income": "Mipango ya uwezeshaji kwa wazazi na walezi kupata kipato",
  "Tuition organized for pre-primary, junior and senior students": "Masomo ya ziada kwa wanafunzi wa chekechea na sekondari",
  "Sanitary pads/towels to girls": "Taulo za kike (sodo) kwa wasichana",
  "Legal education to parents and guardians": "Elimu ya kisheria kwa wazazi na walezi",
  "Back to school sports tournaments": "Mashindano ya michezo ya kurudi shule",
  "Distribution of stationeries/books to students": "Usambazaji wa vitabu na vifaa vya kuandikia",
  "Bought and distributed uniforms and boarding items to needy students": "Kununua na kusambaza sare na vifaa vya bweni kwa wanafunzi wenye mahitaji",
  "Add more bursary allocation to all wards": "Kuongeza mgao wa bursary katika wadi zote",
  "Build more schools and upgrade the current ones": "Kujenga shule zaidi na kuboresha zilizopo sasa",
  "Establish digital learning centers in each ward": "Kuanzisha vituo vya masomo ya kidijitali katika kila wadi",
  "Source for more teachers from TSC": "Kutafuta walimu zaidi kutoka TSC",
  "Clear drainage and enhance security near learning centers": "Kusafisha mifereji na kuimarisha usalama karibu na shule",
  "Enhance school feeding programs": "Kuboresha mipango ya chakula mashuleni",

  // Challenges/Initiatives/Future for Health
  "Poor waste management": "Usimamizi duni wa taka",
  "Uncollected garbage": "Taka zisizozolewa",
  "Flooding during heavy rains": "Mafuriko wakati wa mvua kubwa",
  "Stagnant dirty water": "Maji machafu yaliyotuama",
  "Poor sanitation and drainage systems": "Mifumo duni ya usafi na mifereji ya maji",
  "Dirty water from sewer bursts": "Maji machafu kutoka kwa mabomba ya maji taka yaliyopasuka",
  "Inadequate clean/safe drinking water": "Ukosefu wa maji safi na salama ya kunywa",
  "Few healthcare centers": "Vituo vichache vya afya",
  "High cost of treatment": "Gharama kubwa ya matibabu",
  "Drug accessibility challenges": "Changamoto za kupata dawa",
  "NHIF/SHIF registration drives to help needy households access treatment": "Usajili wa NHIF/SHIF kusaidia kaya yenye mahitaji kupata matibabu",
  "Medical camps in Huruma and Mathare North": "Kambi za matibabu huko Huruma na Mathare Kaskazini",
  "Support for community health workers with stipends": "Msaada na marupurupu kwa wahudumu wa afya wa jamii",
  "Clean-up drives across Mathare River and local estates": "Harakati za kusafisha Mto Mathare na mitaa ya karibu",
  "Distribution of water tanks and clean drinking water to residents": "Usambazaji wa matanki na maji safi ya kunywa kwa wakazi",
  "Construct modern public clinics in every ward": "Kujenga zahanati za kisasa katika kila wadi",
  "Implement a sustainable garbage recycling program": "Kuanzisha mpango endelevu wa kurejesha taka (recycling)",
  "Establish mobile health clinics for quick response": "Kuanzisha kliniki zinazotembea kwa ajili ya huduma za haraka",
  "Collaborate with county government to fix drainage systems": "Kushirikiana na serikali ya kaunti kurekebisha mifumo ya maji taka",

  // Challenges/Initiatives/Future for Businesses
  "Lack of capital/business funds": "Ukosefu wa mtaji au fedha za biashara",
  "High interest rates on loans": "Viwango vya juu vya riba kwenye mikopo",
  "Harassment by county askaris": "Kusumbuliwa na askari wa kaunti (kanjo)",
  "Poor market infrastructure": "Miundombinu duni ya masoko",
  "Insecurity and theft of stock": "Ukosefu wa usalama na wizi wa bidhaa",
  "Lack of business skills/financial literacy": "Ukosefu wa ujuzi wa biashara au usimamizi wa fedha",
  "Established a Mama Mboga capital fund targeting KSh 50M": "Kuanzisha mfuko wa mtaji wa Mama Mboga wenye lengo la KSh 50M",
  "Youth business grants and mentorship programs": "Ruzuku za biashara kwa vijana na mipango ya ushauri",
  "Setup secure storage hubs for local traders": "Kuweka vituo salama vya kuhifadhia bidhaa za wafanyabiashara",
  "Financial literacy workshops for market vendors": "Warsha za usimamizi wa fedha kwa wachuuzi wa masoko",
  "Provide interest-free mini-loans to registered small businesses": "Kutoa mikopo midogo isiyo na riba kwa biashara ndogo zilizosajiliwa",
  "Build modern, covered markets with clean running water": "Kujenga masoko ya kisasa yenye maji safi ya kutiririka",
  "Advocate for fairer bylaws to protect small traders": "Kutetea sheria ndogo za haki ili kulinda wafanyabiashara wadogo",
  "Facilitate business registration and SACCO formations": "Kusaidia usajili wa biashara na uundaji wa SACCO",

  // Challenges/Initiatives/Future for Security
  "Dark streets/estates leading to muggings": "Mitaa yenye giza inayosababisha kuporwa",
  "Slow police response times": "Polisi kuchelewa kujibu dharura",
  "Drug and substance abuse among youth": "Matumizi ya dawa za kulevya miongoni mwa vijana",
  "Gangs and criminal networks": "Magenge ya wahalifu",
  "High rates of gender-based violence (GBV)": "Viwango vya juu vya unyanyasaji wa kijinsia (GBV)",
  "Installed solar-powered streetlights in crime hotspots": "Kuweka taa za barabarani zinazotumia umeme wa jua kwenye maeneo hatari",
  "Supported community policing forums and youth groups": "Kusaidia vikundi vya usalama vya jamii (community policing) na vijana",
  "Established a GBV rescue and legal counseling center": "Kuanzisha kituo cha uokoaji na ushauri wa kisheria kwa waathiriwa wa GBV",
  "Organized youth sensitization and drug rehabilitation programs": "Kuandaa mipango ya kuhamasisha vijana na kurekebisha watumiaji wa dawa za kulevya",
  "Expand street lighting project to cover all corners of Mathare": "Kupanua mradi wa taa za barabarani kufunika pembe zote za Mathare",
  "Lobby for more police posts and improved patrol infrastructure": "Kushawishi uwepo wa vituo vya polisi zaidi na doria bora",
  "Set up a drug rehab center within Mathare": "Kujenga kituo cha kurekebisha tabia (rehab) ndani ya Mathare",
  "Provide sports and alternative livelihoods to keep youth away from crime": "Kutoa michezo na njia mbadala za kujipatia riziki ili kuwaepusha vijana na uhalifu",

  // Challenges/Initiatives/Future for Others
  "Lack of youth engagement and talent promotion": "Ukosefu wa ushirikiano na kukuza vipaji vya vijana",
  "Poor public spaces for community meetings": "Ukosefu wa maeneo ya umma kwa ajili ya mikutano ya jamii",
  "Limited access to legal support for vulnerable residents": "Upatikanaji mdogo wa usaidizi wa kisheria kwa wakazi wanyonge",
  "High youth unemployment rates": "Kiwango cha juu cha ukosefu wa ajira kwa vijana",
  "Hosted the annual Moha Delivers sports tournament": "Kuandaa mashindano ya kila mwaka ya michezo ya Moha Delivers",
  "Constructed a community social hall": "Kujenga ukumbi wa kijamii wa mikutano",
  "Free legal aid clinics for land and civil disputes": "Kliniki za msaada wa kisheria bila malipo kwa migogoro ya ardhi na kiraia",
  "Partnerships with TVET institutes for technical skills training": "Ushirikiano na vyuo vya TVET kwa mafunzo ya kiufundi",
  "Establish a fully equipped youth talent center and recording studio": "Kuanzisha kituo chenye vifaa kamili cha vipaji vya vijana na studio ya kurekodia",
  "Launch a constituency innovation hub for tech and remote work": "Kuzindua kituo cha uvumbuzi cha eneo bunge kwa ajili ya kazi za teknolojia na mtandaoni",
  "Partner with local financial institutions for affordable youth credit": "Kushirikiana na taasisi za kifedha kwa ajili ya mikopo nafuu kwa vijana",

  // Foundations Page Sections
  "Vulnerable Groups": "Vikundi Vilivyo Kwenye Hatari",
  "Bursary Program": "Mpango wa Bursary",
  "People with Disabilities": "Watu Wenye Ulemavu",
  "Empowering over 8,500 households with food, dignity packs, and legal aid.": "Kuwezesha zaidi ya kaya 8,500 kwa chakula, vifurushi vya utu, na msaada wa kisheria.",
  "Supporting education from primary to university with over 12,000 bursaries issued.": "Kusaidia elimu kuanzia shule ya msingi hadi chuo kikuu na zaidi ya bursary 12,000 zilizotolewa.",
  "Providing tools, grants, and accessible spaces to empower over 1,200 PWDs.": "Kutoa zana, ruzuku, na maeneo yanayofikika ili kuwezesha watu wenye ulemavu zaidi ya 1,200.",
  "Apply for Bursary": "Omba Bursary",
  "Bursary Application Form": "Fomu ya Maombi ya Bursary",
  "The bursary application window is currently closed.": "Muda wa maombi ya bursary umefungwa kwa sasa.",
  "Applications open on": "Maombi yatafunguliwa mnamo",
  "Check back soon for updates.": "Angalia tena hivi karibuni kwa habari zaidi.",
  "Youth & Women": "Vijana na Wanawake",
  "Sports & Talent Development": "Maendeleo ya Michezo na Vipaji",
  "Community Empowerment Projects": "Miradi ya Uwezeshaji Jamii",
  "ECD & School Supplies Support": "Msaada wa Vifaa vya Shule na ECD",
  "See Details": "Angalia Maelezo",
  "Open Form": "Fungua Fomu",
  "Close": "Funga",

  // Forms & Inputs
  "Your Name": "Jina Lako",
  "Phone Number": "Nambari ya Simu",
  "Your Question": "Swali Lako",
  "Submit Question": "Tuma Swali",
  "Submitting...": "Inatuma...",
  "Select your Ward": "Chagua Wadi yako",
  "Your Message": "Ujumbe Wako",
  "Submit Opinion": "Tuma Maoni",
  "Thank you! Your message has been sent successfully.": "Asante! Ujumbe wako umetumwa kwa mafanikio.",
  "We will get back to you if needed.": "Tutawasiliana nawe ikihitajika.",
  "Send another message": "Tuma ujumbe mwingine",
  "Choose your ward": "Chagua wadi yako",
  "Type your message here...": "Andika ujumbe wako hapa...",
  "Type your question here...": "Andika swali lako hapa...",
  "Enter your phone number...": "Weka nambari yako ya simu...",
  "Enter your name...": "Weka jina lako...",
  
  // Wards
  "Mabatini": "Mabatini",
  "Huruma": "Huruma",
  "Hospital": "Hospital",
  "Kiamaiko": "Kiamaiko",
  "Ngei": "Ngei",
  "Mlango Kubwa": "Mlango Kubwa",

  // Polling
  "Community Polls": "Kura za Maoni za Jamii",
  "Your Voice Matters": "Sauti Yako ni Muhimu",
  "Vote on key community issues to help Moha build a better Mathare.": "Piga kura juu ya masuala muhimu ya jamii ili kumsaidia Moha kujenga Mathare bora.",
  "Polls": "Kura za Maoni",
  "Select Ward to Vote": "Chagua Wadi ili Upige Kura",
  "Submit Vote": "Tuma Kura",
  "Reset Poll": "Weka Upya Kura",
  "Total Votes": "Jumla ya Kura",
  "You voted!": "Umeshapiga kura!",
  "Thank you for voting.": "Asante kwa kupiga kura.",
  "Your Voice": "Sauti Yako",
  "Vote on what matters": "Piga kura juu ya masuala muhimu",
  "Pick your Mathare ward, then tell Moha where you stand. Every vote shapes the action plan.": "Chagua wadi yako ya Mathare, kisha umweleze Moha msimamo wako. Kila kura inaunda mpango wa utekelezaji.",
  "Step 1 — Select your ward": "Hatua ya 1 — Chagua wadi yako",
  "We use this only to break results down by ward. One vote per question per device.": "Tunatumia hii tu kupanga matokeo kulingana na wadi. Kura moja kwa kila swali kwa kila kifaa.",
  "Choose your Mathare ward": "Chagua wadi yako ya Mathare",
  "Voting as a resident of": "Unapiga kura kama mkazi wa wadi ya",
  "ward": "ward",
  "Rate how the following services are offered in Mathare by the Government and people's Representatives": "Kadiria jinsi huduma zifuatazo zinavyotolewa Mathare na Serikali na Wawakilishi wa wananchi",
  "Click a rating, then tick the services it applies to. One vote per service per device.": "Bonyeza kadirio, kisha uweke alama kwenye huduma zinazohusika. Kura moja kwa kila huduma kwa kila kifaa.",
  "↑ Select your ward above to unlock voting.": "↑ Chagua wadi yako hapo juu ili uweze kupiga kura.",
  "Select your ward above to unlock voting.": "Chagua wadi yako hapo juu ili uweze kupiga kura.",
  "Results are kept private and shared with Moha's team only.": "Matokeo huwekwa siri na kushirikiwa na timu ya Moha pekee.",
  "Asante! Your vote from {ward} ward has been recorded.": "Asante! Kura yako kutoka wadi ya {ward} imerekodiwa.",
  "Asante sana for voting! 🙏": "Asante sana kwa kupiga kura! 🙏",
  "Enter your mobile number to receive a thank-you message with a link you can share with friends.": "Weka nambari yako ya simu ili upokee ujumbe wa shukrani wenye kiungo unachoweza kushiriki na marafiki.",
  "Message sent to {phone}!": "Ujumbe umetumwa kwa {phone}!",
  "Share the link with your friends so they can also have their say.": "Shiriki kiungo hiki na marafiki zako ili nao pia watoe maoni yao.",
  "The SMS will include a link to": "SMS itajumuisha kiungo cha",
  "that you can forward to friends and family. Standard Safaricom / Airtel rates may apply.": "ambacho unaweza kusambaza kwa marafiki na familia. Ushuru wa kawaida wa Safaricom / Airtel unaweza kutozwa.",
  "Have a different idea? Send a message": "Je, una wazo tofauti? Tuma ujumbe",
  "voted": "kura zilizopigwa",
  "Rated": "Imekadiriwa",
  
  // Polling questions & options
  "What is the #1 issue Mathare needs solved first?": "Ni changamoto gani kuu inayopaswa kutatuliwa kwanza hapa Mathare?",
  "Education funding": "Ufadhili wa elimu",
  "Pollution and waste management": "Uchafuzi wa mazingira na usimamizi wa taka",
  "Drainage and flooding": "Mifereji ya maji na mafuriko",
  "Insecurity and safety": "Ukosefu wa usalama",
  "Financial constraints and credits inaccessibility": "Changamoto za kifedha na kutopata mikopo",
  "Crime, rape and GBV": "Uhalifu na unyanyasaji wa kijinsia",
  "Youth unemployment": "Ukosefu wa ajira kwa vijana",
  "Which education program should we expand next?": "Je, ni mpango gani wa elimu tunaopaswa kuupanua baadaye?",
  "University tuition fund": "Mfuko wa karo ya chuo kikuu",
  "Digital learning labs": "Vituo vya masomo ya kidijitali",
  "TVET scholarships": "Udhamini wa masomo ya TVET (vyuo vya ufundi)",
  "Adult literacy classes": "Masomo ya kusoma na kuandika kwa watu wazima",
  "High school Bursaries and scholarships": "Bursary na udhamini wa shule za upili",
  "How strongly do you agree with Moha's initiatives & projects in Mathare?": "Je, unakubaliana kwa kiasi gani na miradi na mipango ya Moha hapa Mathare?",
  "Strongly agree": "Nakubaliana kabisa",
  "Agree": "Nakubaliana",
  "Neutral": "Sina upande",
  "Disagree": "Sikubaliani",
  "Strongly disagree": "Sikubaliani kabisa",
  "Is Moha the best candidate for Mathare MP in 2027?": "Je, Moha ndiye mgombea bora wa ubunge Mathare mwaka 2027?",
  "Yes — he's the best option": "Ndiyo — yeye ndiye chaguo bora zaidi",
  "Likely yes": "Pengine ndiyo",
  "Undecided": "Bado sijaamua",
  "Likely no": "Pengine hapana",
  "No": "Hapana",
  
  // Service ratings
  "How do you rate Moha's delivery on Education?": "Unaonaje utendaji wa Moha katika sekta ya Elimu?",
  "How do you rate Moha's delivery on Health?": "Unaonaje utendaji wa Moha katika sekta ya Afya?",
  "How do you rate Moha's delivery on Security?": "Unaonaje utendaji wa Moha katika sekta ya Usalama?",
  "How do you rate Moha's delivery on Business Support?": "Unaonaje utendaji wa Moha katika sekta ya Kusaidia Biashara?",
  "How do you rate Moha's delivery on All Services Overall?": "Unaonaje utendaji mzima wa Moha katika huduma zote kwa ujumla?",
  "How do you rate Moha's delivery on Other (None of the above)?": "Unaonaje utendaji wa Moha katika sekta Nyinginezo?",
  "Best": "Bora Zaidi",
  "Fairly": "Wastani",
  "Worst": "Mbaya Zaidi",

  // Ask & Opinion Pages
  "Direct Line": "Njia ya Moja kwa Moja",
  "Ask Moha anything.": "Muulize Moha chochote.",
  "No filters. No PR speak. Submit your question and get a real answer from Moha or his team.": "Hakuna vichungi. Hakuna maneno ya urembo. Tuma swali lako na upate jibu halisi kutoka kwa Moha au timu yake.",
  "Phone or Email": "Simu au Barua Pepe",
  "07XX or you@email.com": "07XX au barua@pepe.com",
  "Ask Moha…": "Muulize Moha...",
  "Popular questions": "Maswali yanayoulizwa mara kwa mara",
  "Tip: try the floating chat (bottom-right) for instant manifesto answers from Moha's AI.": "Kidokezo: jaribu soga inayoelea (chini kulia) kwa majibu ya haraka ya ilani kutoka kwa AI ya Moha.",
  "What's your plan for youth unemployment?": "Una mpango gani kuhusu ukosefu wa kazi kwa vijana?",
  "How will you handle insecurity in Mathare?": "Utashughulikia vipi ukosefu wa usalama Mathare?",
  "Where can I find your full manifesto?": "Ninaweza kupata wapi ilani yako kamili?",
  "How do I volunteer for the campaign?": "Ninajitolea vipi kwa ajili ya kampeni?",
  "What is the bursary application process?": "Utaratibu wa kuomba bursary uko vipi?",
  "Question received! Moha or his team will get back to you.": "Swali limepokelewa! Moha au timu yake watawasiliana nawe.",
  "Speak Up": "Sema Upate Kusikika",
  "Your message. Real action.": "Ujumbe wako. Hatua halisi.",
  "Tell us what Mathare needs — ideas, complaints, suggestions, encouragement. Moha's team reads every single message.": "Tueleze kile Mathare inahitaji — mawazo, malalamiko, mapendekezo, au motisha. Timu ya Moha inasoma kila ujumbe.",
  "Ward / Estate": "Wadi / Mtaa",
  "e.g. Mlango Kubwa": "mfano Mlango Kubwa",
  "Tell Moha what's on your mind…": "Mweleze Moha kilicho moyoni mwako...",
  "Send to Moha": "Tuma kwa Moha",
  "Sending…": "Inatuma...",
  "Asante! Your message has reached Moha's team.": "Asante! Ujumbe wako umefika kwa timu ya Moha.",
  "4-step application": "maombi ya hatua 4",
  "Window closes": "Muda unafungwa",

  // Chat Widget
  "Karibu! 👋 I'm Moha's AI assistant. Ask me about the manifesto, donations, foundations, or how to get involved. Kuna More na Moha!":
    "Karibu! 👋 Mimi ni msaidizi wa AI wa Moha. Niulize kuhusu ilani, michango, taasisi, au jinsi ya kujiunga. Kuna More na Moha!",
  "What are Moha's priorities?": "Vipaumbele vya Moha ni vipi?",
  "How do I donate?": "Ninachangia vipi?",
  "Tell me about the bursary program": "Nieleze kuhusu mpango wa bursary",
  "Where is Moha's office?": "Ofisi ya Moha iko wapi?",
  "Network error. Please try again.": "Itilafu ya mtandao. Tafadhali jaribu tena.",
  "Something went wrong. Please try again.": "Kuna kitu kimeenda vibaya. Tafadhali jaribu tena.",
  "Yuko Mtandaoni — uliza chochote": "Yuko Mtandaoni — uliza chochote",
  "Online — ask anything": "Yuko Mtandaoni — uliza chochote",
  "Ask Moha AI…": "Muulize Moha AI...",
  "Try asking:": "Jaribu kuuliza:",
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("moha_lang");
    if (saved === "en" || saved === "sw") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("moha_lang", lang);
  };

  const t = (text: string): string => {
    if (language === "sw") {
      return swTranslations[text] || text;
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
