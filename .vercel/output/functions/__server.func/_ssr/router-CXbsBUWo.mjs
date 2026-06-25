import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { c as createRouter, u as useRouter, a as createRootRoute, b as createFileRoute, l as lazyRouteComponent, H as HeadContent, S as Scripts, d as useRouterState, O as Outlet, L as Link, e as useLocation } from "../_libs/tanstack__react-router.mjs";
import { S as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { L as LogIn, X, M as Menu, a as MapPin, P as Phone, b as Mail, c as MessageCircle, S as Sparkles, d as LoaderCircle, e as Send } from "../_libs/lucide-react.mjs";
import { m as motion, A as AnimatePresence } from "../_libs/framer-motion.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-elegant hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-primary/30 bg-transparent text-foreground hover:border-primary hover:bg-primary/5",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent/10 hover:text-accent",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-gradient-gold text-gold-foreground hover:scale-105 shadow-gold font-bold",
        gold: "bg-gold text-gold-foreground hover:bg-gold/90 shadow-gold font-bold",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-elegant"
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-14 rounded-lg px-8 text-base",
        xl: "h-16 rounded-lg px-10 text-lg",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const heroImg = "/assets/moha-portrait-CrToX8ua.jpeg";
const LanguageContext = reactExports.createContext(void 0);
const swTranslations = {
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
  "Coming Soon": "Inakuja Hivi Karibuni",
  "Applications are currently closed": "Maombi yamefungwa kwa sasa",
  "The bursary application window is not open at the moment. Check back soon or follow our social media for the next opening date.": "Muda wa maombi ya bursary haujafunguliwa kwa sasa. Angalia tena hivi karibuni au fuata mitandao yetu ya kijamii kwa tarehe ya ufunguzi unaofuata.",
  // Priorities page column headers & subtitles
  "Challenges": "Changamoto",
  "Initiatives": "Mipango",
  "Future Plans": "Mipango ya Baadaye",
  "What Mathare faces today": "Kinachokabiliwa na Mathare Leo",
  "What Moha is already delivering": "Kinachotekelezwa tayari na Moha",
  "What we will deliver next": "Tutakachotekeleza baadaye",
  "Support programs already running": "Mipango ya msaada inayoendelea",
  "New opportunities on the way": "Fursa mpya zinazokuja",
  "The Manifesto": "Ilani",
  "Other Initiatives": "Mipango Mingine",
  // Priorities challenges/initiatives (health, businesses, security, other)
  "Flooding": "Mafuriko",
  "poor planning": "mipango mibaya",
  "Water and air polution": "Uchafuzi wa maji na hewa",
  "Waterbone and respiratory diseases": "Magonjwa ya maji na njia za hewa",
  "poor sanitation": "usafi duni",
  "Mental health and drug abuse": "Afya ya akili na matumizi ya dawa za kulevya",
  "Food distribution to needy households to improve nutrition": "Usambazaji wa chakula kwa kaya zenye mahitaji kuboresha lishe",
  "cleaning exercise done in each ward": "Zoezi la usafi limefanywa katika kila wadi",
  "Water distribution during scarcity": "Usambazaji wa maji wakati wa uhaba",
  "SHA registration and payments to needy families and empowerments of youths to shurn drug abuse and violence": "Usajili wa SHA na malipo kwa familia zenye mahitaji na uwezeshaji wa vijana ili kuepuka matumizi ya dawa za kulevya na vurugu",
  "Sanitary towels/pads to girls": "Taulo za kike kwa wasichana",
  "distribution of wheelchairs and other essential ammenities to the PWDs": "Usambazaji wa viti vya magurudumu na vitu muhimu kwa watu wenye ulemavu",
  "distribution of essentials to families affected by floods": "Usambazaji wa mahitaji ya msingi kwa familia zilizoathiriwa na mafuriko",
  "Support for people living with chronic illnesses": "Msaada kwa watu wanaoishi na magonjwa ya kudumu",
  "Liase with County Government to push for cleaning programs of Mathare and the rivers": "Kushirikiana na Serikali ya Kaunti kushinikiza mipango ya usafi wa Mathare na mito",
  "Empower CBOs and individuals in waste managementand disposal": "Kuwezesha Vikundi vya Jamii na watu binafsi katika usimamizi na utupaji wa taka",
  "Open drainage systems and build more roads to estates and houses": "Kufungua mifumo ya mifereji na kujenga barabara zaidi kwenye makazi na nyumba",
  "Establish Mental health and drug abuse rehabilitation centers in Mathare": "Kuanzisha vituo vya ukarabati wa afya ya akili na uraibu wa dawa za kulevya Mathare",
  "Register more households/families to SHA and other insuarances": "Kusajili kaya na familia zaidi katika SHA na bima nyingine",
  "To push the County and National Govenments to order for proper planning to mitigate against floods": "Kushinikiza Serikali za Kaunti na Taifa kuagiza mipango sahihi ya kupunguza mafuriko",
  "Finacial constraints and credit accessibility": "Vikwazo vya kifedha na upatikanaji wa mikopo",
  "poor infrastructure and utilities": "miundombinu duni na huduma mbaya",
  "Insecurity and Safety of businesses": "Ukosefu wa usalama kwa biashara",
  "Inadequate business support and education": "Msaada duni wa biashara na elimu",
  "Low purchasing power and crowded markets": "Nguvu ndogo ya ununuzi na masoko yaliyosongamana",
  "Fundraising in aid of businesses, groups and individuals": "Kukusanya fedha kusaidia biashara, vikundi na watu binafsi",
  "Empowerment of programs to women, youth and entrepreneurs": "Uwezeshaji wa mipango kwa wanawake, vijana na wajasiriamali",
  "Buying handcarts to groups and youths": "Kununua mikokoteni kwa vikundi na vijana",
  "Donating of chair and tents to groups": "Kuchangia viti na hema kwa vikundi",
  "Construction of bodaboda tents/shede": "Ujenzi wa hema/vibanda vya bodaboda",
  "Buying TV sets and DStv to youth groups": "Kununua vifaa vya TV na DStv kwa vikundi vya vijana",
  "Providing raincoats to businesses": "Kutoa koti za mvua kwa wafanyabiashara",
  "Buying water tanks and car wash machines to youth groups": "Kununua matanki ya maji na mashine za kuosha magari kwa vikundi vya vijana",
  "Equiping barber and salon shops": "Kuvifaa maduka ya kinyozi na saluni",
  "Buying boxing equipment and materials to youth groups": "Kununua vifaa vya masumbwi kwa vikundi vya vijana",
  "Providing umbrellas to businesses": "Kutoa miavuli kwa wafanyabiashara",
  "Building stocks for businesses e.g omena and eggs": "Kujenga hifadhi ya bidhaa kwa biashara k.m omena na mayai",
  "Expand financial inclusion and source for more funds from reliable partners": "Kupanua ushirikiano wa kifedha na kutafuta fedha zaidi kutoka kwa washirika wa kuaminika",
  "Improve the drainage, streets, lighting, roads accessibility and expand more market stalls": "Kuboresha mifereji, mitaa, taa, upatikanaji wa barabara na kupanua vibanda zaidi vya soko",
  "Enhance security by collaborating with National Govenment to build more police posts and add more security personnel": "Kuimarisha usalama kwa kushirikiana na Serikali ya Taifa kujenga vituo zaidi vya polisi na kuongeza maafisa wa usalama",
  "Organize business training and education to established and upcoming entrepreneurs": "Kupanga mafunzo ya biashara kwa wajasiriamali waliopo na wanaokuja",
  "Create more empowerment programs to improve the purchasing power.": "Kuunda mipango zaidi ya uwezeshaji kuboresha nguvu ya ununuzi",
  "Violence, crime and gang activities": "Vurugu, uhalifu na shughuli za magenge",
  "GBV and rape": "GBV na ubakaji",
  "Unemployment and poverty": "Ukosefu wa ajira na umaskini",
  "poor infrastructure": "miundombinu duni",
  "Environmental and structural hazards": "Hatari za kimazingira na kimuundo",
  "police-community tensions": "mvutano kati ya polisi na jamii",
  "Funding High school education to minimize dropouts rates": "Kufadhili elimu ya shule ya upili kupunguza viwango vya kuacha shule",
  "Food distribution and feeding programs against poverty issues": "Usambazaji wa chakula na mipango ya chakula dhidi ya umaskini",
  "Empowerment through Moha's Biz Mtaani programs that addresses unemployment, poverty and crime": "Uwezeshaji kupitia mipango ya Moha ya Biz Mtaani inayoshughulikia ukosefu wa ajira, umaskini na uhalifu",
  "Mentorship programs to avoid idleness and back to school sport tournaments ": "Mipango ya ushauri kuepuka uvivu na mashindano ya michezo ya kurudi shule",
  "legal aid on GBV and Funding lawyers to follow family cases": "Msaada wa kisheria kuhusu GBV na kufadhili mawakili kushughulikia mashauri ya familia",
  "Empower and fund reformed drug addicts and criminals": "Kuwezesha na kufadhili waraibu wa dawa na wahalifu waliobadilika",
  "Collaborate with CBOs, NGOs and National Govenment on GBV and rape cases": "Kushirikiana na CBOs, NGOs na Serikali ya Taifa kuhusu kesi za GBV na ubakaji",
  "Initiate more economic and social empowerment programs to tackle unemployment and poverty": "Kuanzisha mipango zaidi ya uwezeshaji wa kiuchumi na kijamii kukabiliana na ukosefu wa ajira na umaskini",
  "Build more access roads, street light installation and open up remote areas": "Kujenga barabara zaidi za kufikia, kuweka taa za barabarani na kufungua maeneo ya mbali",
  "Initiate closer police-community partnership": "Kuanzisha ushirikiano wa karibu zaidi kati ya polisi na jamii",
  "Vulnerable groups without targeted support": "Makundi yaliyo katika hatari bila msaada unaolengwa",
  "Food insecurity in households": "Ukosefu wa chakula katika kaya",
  "Limited access to health insurance registration": "Upatikanaji mdogo wa usajili wa bima ya afya",
  "PWDs lack assistive devices and essential amenities": "Watu wenye ulemavu wanakosa vifaa vya kusaidia na mahitaji muhimu",
  "Support to the vulnerable groups": "Msaada kwa makundi yaliyo katika hatari",
  "Food distribution": "Usambazaji wa chakula",
  "SHA registration": "Usajili wa SHA",
  "Free assistive devices": "Vifaa vya kusaidia bure",
  "Recruitment and industrial attachment opportunities": "Fursa za kuajiriwa na mafunzo ya viwandani",
  "Overseas and International Scholarship": "Udhamini wa masomo ya ng'ambo na kimataifa",
  "Back to school tournaments": "Mashindano ya kurudi shule",
  "Mentorship programs": "Mipango ya ushauri",
  // Donate page
  "Power the Movement": "Nguvu ya Harakati",
  "Every shilling delivers.": "Kila shilingi inawasilisha.",
  "From KSh 500 to KSh 10,000 — your donation funds bursaries, clinics, clean-ups, and youth programs across Mathare.": "Kuanzia KSh 500 hadi KSh 10,000 — mchango wako unafadhili bursary, kliniki, usafi, na mipango ya vijana katika Mathare yote.",
  "Choose an amount (KSh)": "Chagua kiasi (KSh)",
  "Or enter custom amount": "Au weka kiasi chako maalum",
  "M-Pesa Phone Number": "Nambari ya Simu ya M-Pesa",
  "You will receive an STK Push prompt to confirm.": "Utapokea ujumbe wa STK Push kuthibitisha.",
  "Or use Paybill manually:": "Au tumia Paybill mwenyewe:",
  "Cardholder Name": "Jina la Mmiliki wa Kadi",
  "Card Number": "Nambari ya Kadi",
  "Expiry": "Tarehe ya Kumalizika",
  "Secure payment. Your information is never shared.": "Malipo salama. Taarifa yako haitashirikiwa kamwe.",
  "Your Impact": "Athari Yako",
  "Where every shilling goes": "Kila shilingi inaenda wapi",
  "From food parcels to bursaries to clean water tanks — your donation funds the work that's already happening, every single week, on the streets of Mathare.": "Kuanzia vifurushi vya chakula hadi bursary na matanki ya maji safi — mchango wako unafadhili kazi inayoendelea tayari, kila wiki, mitaani mwa Mathare.",
  "Food & relief drives": "Kampeni za chakula na msaada",
  "Clean water tanks": "Matanki ya maji safi",
  "Student bursaries": "Bursary za wanafunzi",
  "Hustler tools & capital": "Zana na mtaji wa hustler",
  "Sending STK Push…": "Inatuma STK Push...",
  "Support Moha": "Msaidie Moha",
  "Processing…": "Inashughulika...",
  "Donate KSh": "Changia KSh",
  "Donate Again": "Changia Tena",
  "Asante Sana": "Asante Sana",
  "You powered the movement": "Ulichochea harakati",
  "Asante kwa kuwa pamoja nasi!": "Asante kwa kuwa pamoja nasi!",
  "is fueling real change in Mathare. We'll send a receipt shortly.": "inachochea mabadiliko halisi Mathare. Tutatuma risiti hivi karibuni.",
  "Your contribution of": "Mchango wako wa",
  "Send SMS": "Tuma SMS",
  "Please select your ward before voting.": "Tafadhali chagua wadi yako kabla ya kupiga kura.",
  "You've already rated this service.": "Umeshakadiriwa huduma hii.",
  "Please enter a valid Kenyan mobile number (07XX or 01XX)": "Tafadhali weka nambari sahihi ya simu ya Kenya (07XX au 01XX)",
  "Thank-you message sent to your number!": "Ujumbe wa shukrani umetumwa kwa nambari yako!",
  // News page
  "The latest from the movement": "Habari mpya zaidi kutoka kwa harakati",
  "Campaign milestones, community wins, and the work happening on the ground every single day.": "Mafanikio ya kampeni, ushindi wa jamii, na kazi inayofanyika nyanjani kila siku.",
  "Featured": "Imeangaziwa",
  "Movement": "Harakati",
  "Health": "Afya",
  "Environment": "Mazingira",
  "Business": "Biashara",
  "Read more": "Soma zaidi",
  // Stories page
  "Voices of Mathare": "Sauti za Mathare",
  "Real people. Real impact.": "Watu halisi. Athari halisi.",
  "These are the stories of mama mbogas, students, elders, and youth whose lives Moha has changed — long before any campaign poster went up.": "Hizi ndizo hadithi za mama mboga, wanafunzi, wazee, na vijana ambao maisha yao yamebadilishwa na Moha — muda mrefu kabla ya bango lolote la kampeni kuwekwa.",
  // Footer
  "A movement for Mathare — building a constituency where every youth, mama, and mzee has dignity, opportunity, and a voice.": "Harakati kwa ajili ya Mathare — kujenga eneo bunge ambapo kila kijana, mama, na mzee ana heshima, fursa, na sauti.",
  "Core Values": "Maadili ya Msingi",
  "Integrity": "Uadilifu",
  "Service": "Huduma",
  "Inclusion": "Ujumuishaji",
  "Accountability": "Uwajibikaji",
  "Hard Work": "Bidii",
  "Unity": "Umoja",
  "PARTNER WITH US": "SHIRIKIANA NASI",
  "Get in Touch": "Wasiliana Nasi",
  "Follow the Movement": "Fuata Harakati",
  "Moha for Mathare. Paid for by friends of Moha.": "Moha kwa Mathare. Imelipwa na marafiki wa Moha.",
  "Built for the people of Mathare. 🇰🇪": "Imejengwa kwa watu wa Mathare. 🇰🇪",
  "Send a Message": "Tuma Ujumbe",
  // Payment methods (advertise page)
  "Cash": "Pesa Taslimu",
  "Paybill": "Paybill",
  "Till Number": "Nambari ya Till",
  "Send Money": "Tuma Pesa",
  "Pochi la Biashara": "Pochi la Biashara",
  // Chat Widget
  "Chat with Moha AI": "Zungumza na Moha AI",
  "Moha AI": "Moha AI",
  // Priorities page — taglines
  "Hustle protected. Capital unlocked.": "Biashara inalindwa. Mtaji unafunguliwa.",
  "Safer streets. Lit estates. Protected families.": "Barabara salama. Makao yenye taa. Familia zinalindwa.",
  "Leaving no one behind. Support that reaches every corner.": "Hakuna anayeachwa nyuma. Msaada unafikia kila pembe.",
  "Karibu! 👋 I'm Moha's AI assistant. Ask me about the manifesto, donations, foundations, or how to get involved. Kuna More na Moha!": "Karibu! 👋 Mimi ni msaidizi wa AI wa Moha. Niulize kuhusu ilani, michango, taasisi, au jinsi ya kujiunga. Kuna More na Moha!",
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
  // Advertise page
  "Mathare Business Hub": "Kitovu cha Biashara cha Mathare",
  "Supporting Mathare Businesses — Moha Delivers. List your hustle for free with photos, payment options and delivery info.": "Kusaidia Biashara za Mathare — Moha Anawasilisha. Orodhesha biashara yako bure na picha, njia za malipo na taarifa za uwasilishaji.",
  "Ready to grow your customer base?": "Uko tayari kupanua wateja wako?",
  "List your business in under 2 minutes. Always free.": "Orodhesha biashara yako ndani ya dakika 2. Daima bila malipo.",
  "Advertise Your Business": "Tangaza Biashara Yako",
  "Browse Marketplace": "Vinjari Soko",
  "businesses listed": "biashara zimeorodheshwa",
  "Mathare's": "Soko la",
  "Marketplace": "Mathare",
  "Discover trusted local businesses run by your neighbours. Filter by ward or category to find exactly what you need.": "Gundua biashara za ndani zinazoaminika zinazoendeshwa na majirani zako. Chuja kwa wadi au kategoria kupata unachohitaji.",
  "Search businesses, owners or services...": "Tafuta biashara, wamiliki au huduma...",
  "All Wards": "Wadi Zote",
  "All Categories": "Kategoria Zote",
  "Active filters:": "Vichungi vilivyowezesha:",
  "No businesses match your search": "Hakuna biashara zinazolingana na utafutaji wako",
  "Try clearing filters or be the first to list in this category.": "Jaribu kufuta vichungi au kuwa wa kwanza kuorodhesha katika kategoria hii.",
  "List Your Business": "Orodhesha Biashara Yako",
  "Your hustle deserves to be seen": "Biashara yako inastahili kuonekana",
  "Join hundreds of Mathare entrepreneurs growing their customer base through Moha's free community marketplace.": "Jiunge na mamia ya wajasiriamali wa Mathare wanaokua kupitia soko la bure la jamii la Moha.",
  "Advertise Your Business — Free": "Tangaza Biashara Yako — Bure",
  "Contact via WhatsApp": "Wasiliana kupitia WhatsApp",
  "Share this business": "Shiriki biashara hii",
  "Request edits to this listing": "Omba mabadiliko kwa orodha hii",
  "Request edits to your listing": "Omba mabadiliko kwa orodha yako",
  "Tell the admin what to change about": "Mwambie msimamizi nini cha kubadilisha kuhusu",
  "Your name": "Jina lako",
  "Phone / WhatsApp contact": "Nambari ya Simu / WhatsApp",
  "What needs to change?": "Kitu gani kinahitaji kubadilishwa?",
  "Cancel": "Ghairi",
  "Send request": "Tuma ombi",
  "Ward": "Wadi",
  "Delivery": "Uwasilishaji",
  "Free for every Mathare entrepreneur. Takes about 3 minutes.": "Bure kwa kila mjasiriamali wa Mathare. Inachukua dakika 3 tu.",
  "About You": "Kuhusu Wewe",
  "Location & Contact": "Eneo na Mawasiliano",
  "Payments & Service": "Malipo na Huduma",
  "Photos & Launch": "Picha na Uzinduzi",
  "Your Name *": "Jina Lako *",
  "Business Name *": "Jina la Biashara *",
  "Business Type *": "Aina ya Biashara *",
  "Choose a category": "Chagua kategoria",
  "Website / Social Page (optional)": "Tovuti / Ukurasa wa Mitandao ya Kijamii (hiari)",
  "Your photos will open this link when customers click them.": "Picha zako zitafungua kiungo hiki wateja wanapoibonyeza.",
  "Ward *": "Wadi *",
  "Select your Mathare ward": "Chagua wadi yako ya Mathare",
  "Area / Estate *": "Eneo / Mtaa *",
  "Street / Precise Location": "Barabara / Eneo Halisi",
  "WhatsApp / Phone Contact *": "WhatsApp / Nambari ya Simu *",
  "Additional Contacts (optional)": "Mawasiliano ya Ziada (hiari)",
  "Short Description (optional)": "Maelezo Mafupi (hiari)",
  "What do you sell or offer?": "Unauza au kutoa nini?",
  "Payment Methods Accepted *": "Njia za Malipo Zinazokubaliwa *",
  "Means of Transport": "Njia ya Usafiri",
  "Delivery Available": "Uwasilishaji Unapatikana",
  "Toggle on if you deliver to customers.": "Washa ikiwa unawasilisha kwa wateja.",
  "Business Photos * (up to 5)": "Picha za Biashara * (hadi 5)",
  "Preview:": "Muhtasari:",
  "Business:": "Biashara:",
  "Payments:": "Malipo:",
  "Delivery:": "Uwasilishaji:",
  "Yes": "Ndiyo",
  "JPG or PNG, up to 5MB each. The first photo becomes your cover.": "JPG au PNG, hadi 5MB kila moja. Picha ya kwanza inakuwa jalada lako.",
  "Uploading…": "Inapakia...",
  "Add photo": "Ongeza picha",
  "I have read and understood the data policy. I consent to my business information being displayed publicly on the Mathare Business Hub. *": "Nimesoma na kuelewa sera ya data. Ninakubaliana na taarifa zangu za biashara kuonyeshwa hadharani kwenye Kitovu cha Biashara cha Mathare. *",
  "Back": "Rudi",
  "Next": "Ifuatayo",
  "Publish My Business": "Chapisha Biashara Yangu",
  "Ward / Location": "Wadi / Eneo",
  "Edit request sent to the admin team": "Ombi la mabadiliko limetumwa kwa timu ya msimamizi",
  "Please fill in your name, contact and the changes you need.": "Tafadhali jaza jina lako, mawasiliano na mabadiliko unayohitaji.",
  // Sign In page
  "My Account": "Akaunti Yangu",
  "Just your name and a password — that's it": "Jina lako tu na nenosiri — hiyo tu",
  "Sign in to continue your bursary application": "Ingia ili uendelee na maombi ya bursary",
  "Sign in to list your business on the Mathare Business Hub": "Ingia ili uorodheshe biashara yako kwenye Kitovu cha Biashara cha Mathare",
  "Create Account": "Fungua Akaunti",
  "Full Name": "Jina Kamili",
  "Password": "Nenosiri",
  "Signing in…": "Inaingia...",
  "Don't have an account?": "Huna akaunti?",
  "Create one": "Fungua moja",
  "Confirm Password": "Thibitisha Nenosiri",
  "At least 4 characters": "Angalau herufi 4",
  "Re-enter password": "Weka nenosiri tena",
  "Use your National ID number or phone number as your password — it's something you'll always remember.": "Tumia nambari yako ya Kitambulisho cha Taifa au nambari ya simu kama nenosiri lako — ni kitu utakachokumbuka daima.",
  "Creating account…": "Inaunda akaunti...",
  "Already have an account?": "Una akaunti tayari?",
  "Sign in": "Ingia",
  "Moha Administrator?": "Msimamizi wa Moha?",
  "Admin Sign In": "Ingia kama Msimamizi",
  "Back to home": "Rudi nyumbani",
  // Bursary Application Dialog
  "Constituency Bursary Application Form": "Fomu ya Maombi ya Bursary ya Jimbo",
  "Ward Bursary Application Form — Term 2 (2026/2027). Complete all four sections and download your application form to sign and submit at the Moha Coordination Office, Kiamaiko-Mathare.": "Fomu ya Maombi ya Bursary ya Wadi — Muhula 2 (2026/2027). Kamilisha sehemu zote nne na upakue fomu yako ya maombi ili usaini na kuwasilisha katika Ofisi ya Uratibu ya Moha, Kiamaiko-Mathare.",
  "Application received!": "Maombi yamepokelewa!",
  "Download the pre-filled form, attach the required documents (National ID, birth certificate, fee structure, report form, NCPWD card, etc.), sign, and drop it at the Moha Coordination Office, Kiamaiko-Mathare.": "Pakua fomu iliyojazwa tayari, ambatisha nyaraka zinazohitajika (Kitambulisho cha Taifa, cheti cha kuzaliwa, muundo wa karo, fomu ya ripoti, kadi ya NCPWD, n.k.), saini, na uwasilishe katika Ofisi ya Uratibu ya Moha, Kiamaiko-Mathare.",
  "Know someone who needs to apply? Share this link": "Unajua mtu anayehitaji kuomba? Shiriki kiungo hiki",
  "Copy": "Nakili",
  "Share with friends or family in Mathare who also need bursary support.": "Shiriki na marafiki au familia huko Mathare wanaohitaji pia msaada wa bursary.",
  "Download Application Form (PDF)": "Pakua Fomu ya Maombi (PDF)",
  "Student": "Mwanafunzi",
  "School": "Shule",
  "Guardian": "Mlezi",
  "Review": "Kagua",
  "Student's Details": "Maelezo ya Mwanafunzi",
  "Student name *": "Jina la mwanafunzi *",
  "Full legal name": "Jina kamili la kisheria",
  "Admission / Registration number": "Nambari ya Usajili / Kulazwa",
  "Date of birth": "Tarehe ya kuzaliwa",
  "Gender": "Jinsia",
  "Select": "Chagua",
  "Female": "Mke",
  "Male": "Mume",
  "Grade / Class *": "Darasa *",
  "Select grade": "Chagua darasa",
  "Birth certificate number": "Nambari ya cheti cha kuzaliwa",
  "As on birth certificate": "Kama inavyoonekana kwenye cheti cha kuzaliwa",
  "Student lives with a disability": "Mwanafunzi anaishi na ulemavu",
  "Please specify (NCPWD card / nature of disability)": "Tafadhali eleza (kadi ya NCPWD / aina ya ulemavu)",
  "Student's outstanding ability / achievement": "Uwezo/Mafanikio ya Mwanafunzi",
  "Academic performance, talent, conduct…": "Utendaji wa masomo, kipaji, mwenendo...",
  "Student annual fee payable (KSh)": "Karo ya mwaka ya mwanafunzi (KSh)",
  "Student's outstanding fee balance (KSh)": "Salio la karo la mwanafunzi (KSh)",
  "Amount applying for (KSh)": "Kiasi kinachoombwa (KSh)",
  "Have you ever received a Bursary or support from Moha Foundation or any other public source in the last 6 months?": "Je, umewahi kupokea Bursary au msaada kutoka Taasisi ya Moha au chanzo kingine cha umma katika miezi 6 iliyopita?",
  "If yes, state the source (e.g. Moha Foundation, NG-CDF, Equity Wings)": "Ikiwa ndiyo, taja chanzo (mfano Taasisi ya Moha, NG-CDF, Equity Wings)",
  "Amount received (KSh)": "Kiasi kilichopokelewa (KSh)",
  "School's Details": "Maelezo ya Shule",
  "School name *": "Jina la shule *",
  "School category *": "Kategoria ya shule *",
  "Select category": "Chagua kategoria",
  "County *": "Kaunti *",
  "Select county": "Chagua kaunti",
  "Sub-county *": "Sub-kaunti *",
  "Select sub-county": "Chagua sub-kaunti",
  "Pick county first": "Chagua kaunti kwanza",
  "Year of admission": "Mwaka wa kulazwa",
  "School bank account": "Akaunti ya benki ya shule",
  "Parent / Guardian's Details": "Maelezo ya Mzazi / Mlezi",
  "Parents — alive / deceased": "Wazazi — hai / waliokufa",
  "Father alive": "Baba yu hai",
  "Mother alive": "Mama yu hai",
  "Father's Details": "Maelezo ya Baba",
  "Name": "Jina",
  "Phone contact": "Mawasiliano ya simu",
  "National ID": "Kitambulisho cha Taifa",
  "Occupation": "Kazi",
  "Father lives with a disability": "Baba anaishi na ulemavu",
  "Please specify": "Tafadhali eleza",
  "Mother's Details": "Maelezo ya Mama",
  "Mother lives with a disability": "Mama anaishi na ulemavu",
  "Primary Contactable Parent / Guardian": "Mzazi/Mlezi wa Mawasiliano ya Msingi",
  "Name *": "Jina *",
  "Phone contact *": "Mawasiliano ya simu *",
  "Guardian lives with a disability": "Mlezi anaishi na ulemavu",
  "Residential sub-county": "Sub-kaunti ya makazi",
  "Polling station": "Kituo cha kupiga kura",
  "Number of children in school / University": "Idadi ya watoto shuleni / Chuo Kikuu",
  "Monthly budget (KSh)": "Bajeti ya kila mwezi (KSh)",
  "Brief description of reason for application": "Maelezo mafupi ya sababu ya kuomba",
  "Tell us briefly why you need support…": "Tueleze kwa ufupi kwa nini unahitaji msaada...",
  "Review & Data Consent": "Kagua na Idhini ya Data",
  "Admission No.": "Nambari ya Kulazwa",
  "Birth Cert No.": "Nambari ya Cheti cha Kuzaliwa",
  "School location": "Eneo la shule",
  "Annual fee": "Karo ya mwaka",
  "Outstanding balance": "Salio la deni",
  "Amount requested": "Kiasi kilichoombwa",
  "Ward / Polling": "Wadi / Kituo",
  "Children in school": "Watoto shuleni",
  "Monthly budget": "Bajeti ya kila mwezi",
  "Previous bursary": "Bursary ya awali",
  "Not answered": "Haijaajibiwa",
  "Data Policy & Consent": "Sera ya Data na Idhini",
  "The personal information collected in this form (including names, identification numbers, contact details, and household information) will be used exclusively for the purpose of evaluating and processing your bursary application with the": "Taarifa za kibinafsi zilizokusanywa katika fomu hii (ikiwemo majina, nambari za utambulisho, maelezo ya mawasiliano, na taarifa za kaya) zitatumika peke yake kwa madhumuni ya kutathmini na kushughulikia maombi yako ya bursary na",
  "Your data will be stored securely and will": "Data yako itahifadhiwa kwa usalama na haitashirikiwa",
  "not": "hapana",
  "be shared with third parties without your consent, except where required by law. You have the right to request access to or deletion of your data at any time by contacting us at the Moha Coordination Office, Kiamaiko-Mathare or via": "na watu wengine bila idhini yako, isipokuwa inapohitajika kisheria. Una haki ya kuomba ufikiaji au kufutwa kwa data yako wakati wowote kwa kuwasiliana nasi katika Ofisi ya Uratibu ya Moha, Kiamaiko-Mathare au kupitia",
  "By submitting this application, you confirm that the information provided is true and accurate to the best of your knowledge.": "Kwa kuwasilisha maombi haya, unathibitisha kwamba taarifa zilizotolewa ni za kweli na sahihi kadri unavyojua.",
  "I have read and understood the data policy above. I consent to the collection and use of my personal information for bursary application processing purposes. *": "Nimesoma na kuelewa sera ya data hapo juu. Ninakubaliana na ukusanyaji na matumizi ya taarifa zangu za kibinafsi kwa madhumuni ya kushughulikia maombi ya bursary. *",
  "Submitting…": "Inawasilisha...",
  "Submit Application": "Wasilisha Maombi"
};
const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = reactExports.useState("en");
  reactExports.useEffect(() => {
    const saved = localStorage.getItem("moha_lang");
    if (saved === "en" || saved === "sw") {
      setLanguageState(saved);
    }
  }, []);
  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem("moha_lang", lang);
  };
  const t = (text) => {
    if (language === "sw") {
      return swTranslations[text] || text;
    }
    return text;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageContext.Provider, { value: { language, setLanguage, t }, children });
};
const useLanguage = () => {
  const context = reactExports.useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
const links = [
  { to: "/", label: "Home" },
  { to: "/priorities", label: "Priorities" },
  { to: "/foundations", label: "Foundation" },
  { to: "/stories", label: "Featured Stories" },
  { to: "/news", label: "Top Stories" },
  { to: "/polling", label: "Polling" },
  { to: "/advertise", label: "Advertise With Us" },
  { to: "/ask", label: "Ask Me" }
];
function Navbar() {
  const [scrolled, setScrolled] = reactExports.useState(false);
  const [open, setOpen] = reactExports.useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  reactExports.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  reactExports.useEffect(() => {
    setOpen(false);
  }, [location.pathname]);
  const isHome = location.pathname === "/";
  const transparent = isHome && !scrolled;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "header",
    {
      className: cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        transparent ? "bg-transparent" : "bg-background/85 backdrop-blur-xl border-b border-border shadow-sm"
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 lg:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-20 items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-xl overflow-hidden bg-gradient-primary shadow-glow group-hover:scale-105 transition-transform ring-2 ring-gold/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: heroImg, alt: "Moha portrait", className: "h-full w-full object-cover object-top" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col leading-none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "font-display font-bold text-lg transition-colors",
                    transparent ? "text-white" : "text-foreground"
                  ),
                  children: "MOHA"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "text-[10px] font-semibold tracking-widest uppercase transition-colors",
                    transparent ? "text-gold" : "text-primary"
                  ),
                  children: "Mathare 2027"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden lg:flex items-center gap-1", children: links.map((link) => {
            const active = location.pathname === link.to;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: link.to,
                className: cn(
                  "px-3 py-2 text-sm font-semibold rounded-md transition-all relative",
                  transparent ? "text-white/90 hover:text-gold" : "text-foreground/80 hover:text-primary",
                  active && (transparent ? "text-gold" : "text-primary")
                ),
                children: [
                  t(link.label),
                  active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-0.5 left-3 right-3 h-0.5 bg-gold rounded-full" })
                ]
              },
              link.to
            );
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(
              "flex items-center gap-1 rounded-lg p-0.5 border transition-all mr-2",
              transparent ? "bg-white/10 border-white/20" : "bg-muted/50 border-border"
            ), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setLanguage("en"),
                  className: cn(
                    "px-2 py-1 text-xs font-bold rounded-md transition-all cursor-pointer",
                    language === "en" ? transparent ? "bg-white text-primary" : "bg-primary text-primary-foreground" : transparent ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground"
                  ),
                  children: "EN"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setLanguage("sw"),
                  className: cn(
                    "px-2 py-1 text-xs font-bold rounded-md transition-all cursor-pointer",
                    language === "sw" ? transparent ? "bg-white text-primary" : "bg-primary text-primary-foreground" : transparent ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground"
                  ),
                  children: "SW"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/admin/login",
                className: cn(
                  "flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-md transition-all",
                  transparent ? "text-white/90 hover:text-gold" : "text-foreground/80 hover:text-primary"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "h-4 w-4" }),
                  t("Sign In")
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "hero", size: "default", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/donate", children: t("Donate") }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setOpen(!open),
              className: cn(
                "lg:hidden p-2 rounded-md transition-colors",
                transparent ? "text-white" : "text-foreground"
              ),
              "aria-label": "Toggle menu",
              children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-6 w-6" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-6 w-6" })
            }
          )
        ] }),
        open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:hidden pb-6 pt-2 animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex flex-col gap-1 bg-background/95 rounded-xl border border-border p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-2 border-b border-border mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-muted-foreground", children: "Language / Lugha" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 bg-muted/50 rounded-lg p-0.5 border border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setLanguage("en"),
                  className: cn(
                    "px-2 py-0.5 text-xs font-bold rounded-md transition-all cursor-pointer",
                    language === "en" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  ),
                  children: "EN"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setLanguage("sw"),
                  className: cn(
                    "px-2 py-0.5 text-xs font-bold rounded-md transition-all cursor-pointer",
                    language === "sw" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  ),
                  children: "SW"
                }
              )
            ] })
          ] }),
          links.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: link.to,
              className: "px-4 py-3 rounded-md text-foreground hover:bg-primary/5 hover:text-primary font-semibold transition",
              children: t(link.label)
            },
            link.to
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/admin/login",
              className: "flex items-center gap-2 px-4 py-3 rounded-md text-foreground hover:bg-primary/5 hover:text-primary font-semibold transition",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "h-4 w-4" }),
                t("Sign In")
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "hero", className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/donate", children: t("Donate Now") }) })
        ] }) })
      ] })
    }
  );
}
function FacebookIcon({ className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", className, "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.412c0-3.017 1.792-4.683 4.533-4.683 1.312 0 2.686.235 2.686.235v2.962h-1.514c-1.491 0-1.956.93-1.956 1.886v2.262h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" }) });
}
function XIcon({ className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", className, "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" }) });
}
function YouTubeIcon({ className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", className, "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" }) });
}
function TikTokIcon({ className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", className, "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" }) });
}
const socials = [
  { href: "https://www.facebook.com/share/1FrmdgYUgU/", label: "Facebook", icon: FacebookIcon, brand: "#1877F2", hoverText: "text-white" },
  { href: "https://x.com", label: "X", icon: XIcon, brand: "#000000", hoverText: "text-white" },
  { href: "https://youtube.com", label: "YouTube", icon: YouTubeIcon, brand: "#FF0000", hoverText: "text-white" },
  { href: "https://www.tiktok.com/@mohaofficial25?_r=1&_t=ZS-95vCdekmowU", label: "TikTok", icon: TikTokIcon, brand: "#000000", hoverText: "text-white" }
];
const values = [
  "Integrity",
  "Service",
  "Inclusion",
  "Accountability",
  "Hard Work",
  "Unity"
];
function Footer() {
  const { t } = useLanguage();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-gradient-to-b from-primary to-[oklch(0.18_0.05_150)] text-primary-foreground mt-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 lg:px-8 py-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-10 md:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-xl overflow-hidden bg-gold ring-2 ring-gold/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: heroImg, alt: "Moha portrait", className: "h-full w-full object-cover object-top" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-xl", children: "MOHA" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gold font-semibold tracking-widest uppercase", children: "Mathare 2027" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-primary-foreground/80 leading-relaxed mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gold", children: t("Moha Delivers.") }),
          " ",
          t("A movement for Mathare — building a constituency where every youth, mama, and mzee has dignity, opportunity, and a voice.")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display italic text-gold text-lg", children: [
          '"',
          t("Kuna More na Moha!"),
          '"'
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display font-bold text-lg mb-4 text-gold", children: t("Explore") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2 text-sm", children: [
          { to: "/", label: "Home" },
          { to: "/priorities", label: "Our Priorities" },
          { to: "/foundations", label: "Foundation" },
          { to: "/stories", label: "Featured Stories" },
          { to: "/news", label: "Top Stories" },
          { to: "/polling", label: "Community Polls" },
          { to: "/ask", label: "Ask Moha" },
          { to: "/opinion", label: "Send a Message" },
          { to: "/donate", label: "Donate" }
        ].map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: l.to,
            className: "text-primary-foreground/80 hover:text-gold transition-colors",
            children: t(l.label)
          }
        ) }, l.to)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display font-bold text-lg mb-4 text-gold", children: t("Core Values") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mb-6", children: values.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "px-3 py-1 text-xs font-semibold rounded-full bg-primary-foreground/10 border border-gold/30 text-primary-foreground/90",
            children: t(v)
          },
          v
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/advertise",
            className: "inline-block px-4 py-2 text-sm font-semibold rounded-full border-2 border-gold text-gold hover:bg-gold hover:text-primary transition-colors",
            children: t("PARTNER WITH US")
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display font-bold text-lg mb-4 text-gold", children: t("Get in Touch") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-3 text-sm text-primary-foreground/90 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 mt-0.5 text-gold shrink-0" }),
            "Jonsaga, Tavern Building- Mathare."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4 mt-0.5 text-gold shrink-0" }),
            "+254 728484883"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4 mt-0.5 text-gold shrink-0" }),
            "hello@mohadelivers.com"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display font-bold text-base mb-3 text-gold", children: t("Follow the Movement") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: socials.map(({ href, label, icon: Icon, brand }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href,
            target: "_blank",
            rel: "noopener noreferrer",
            "aria-label": label,
            style: { ["--brand"]: brand },
            className: "h-10 w-10 rounded-full bg-primary-foreground/10 hover:bg-[var(--brand)] hover:text-white transition-all flex items-center justify-center group",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 transition-colors group-hover:text-white" })
          },
          label
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 pt-6 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " ",
        t("Moha for Mathare. Paid for by friends of Moha.")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "italic", children: t("Built for the people of Mathare. 🇰🇪") })
    ] })
  ] }) });
}
const SUGGESTED = [
  "What are Moha's priorities?",
  "How do I donate?",
  "Tell me about the bursary program",
  "Where is Moha's office?"
];
function ChatWidget() {
  const [open, setOpen] = reactExports.useState(false);
  const [input, setInput] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const { language, t } = useLanguage();
  const [messages, setMessages] = reactExports.useState([
    {
      role: "assistant",
      content: t("Karibu! 👋 I'm Moha's AI assistant. Ask me about the manifesto, donations, foundations, or how to get involved. Kuna More na Moha!")
    }
  ]);
  const scrollRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (messages.length === 1 && messages[0].role === "assistant") {
      setMessages([
        {
          role: "assistant",
          content: t("Karibu! 👋 I'm Moha's AI assistant. Ask me about the manifesto, donations, foundations, or how to get involved. Kuna More na Moha!")
        }
      ]);
    }
  }, [language]);
  reactExports.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);
  const send = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const userMsg = { role: "user", content: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, language })
      });
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: t("Something went wrong. Please try again.") }));
        setMessages((m) => [
          ...m,
          { role: "assistant", content: err.error || t("Something went wrong. Please try again.") }
        ]);
        setLoading(false);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let acc = "";
      let done = false;
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      while (!done) {
        const { value, done: d } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let nl;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line || line.startsWith(":")) continue;
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") {
            done = true;
            break;
          }
          try {
            const json = JSON.parse(payload);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              acc += delta;
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: acc };
                return copy;
              });
            }
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: t("Network error. Please try again.") }
      ]);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.button,
      {
        initial: { scale: 0 },
        animate: { scale: 1 },
        transition: { type: "spring", delay: 0.5 },
        onClick: () => setOpen((v) => !v),
        "aria-label": "Chat with Moha AI",
        className: cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-glow flex items-center justify-center transition-all hover:scale-110",
          "bg-gradient-gold text-gold-foreground"
        ),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { rotate: -90, opacity: 0 },
            animate: { rotate: 0, opacity: 1 },
            exit: { rotate: 90, opacity: 0 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-6 w-6" })
          },
          "x"
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { rotate: 90, opacity: 0 },
            animate: { rotate: 0, opacity: 1 },
            exit: { rotate: -90, opacity: 0 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-6 w-6" })
          },
          "msg"
        ) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 20, scale: 0.95 },
        transition: { duration: 0.25 },
        className: "fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-sm h-[560px] max-h-[80vh] bg-card border border-border rounded-2xl shadow-elegant flex flex-col overflow-hidden",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-primary text-primary-foreground p-4 flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-gold flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5 text-gold-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold", children: t("Moha AI") }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-primary-foreground/80 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" }),
                t("Online — ask anything")
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: scrollRef, className: "flex-1 overflow-y-auto p-4 space-y-3 bg-background", children: [
            messages.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: cn("flex", m.role === "user" ? "justify-end" : "justify-start"),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: cn(
                      "max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                      m.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"
                    ),
                    children: m.content || (loading && i === messages.length - 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : null)
                  }
                )
              },
              i
            )),
            messages.length <= 1 && !loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-semibold", children: t("Try asking:") }),
              SUGGESTED.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => send(t(s)),
                  className: "block w-full text-left text-sm px-3 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition",
                  children: t(s)
                },
                s
              ))
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "form",
            {
              onSubmit: (e) => {
                e.preventDefault();
                send(input);
              },
              className: "p-3 border-t border-border bg-card flex gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    value: input,
                    onChange: (e) => setInput(e.target.value),
                    placeholder: t("Ask Moha AI…"),
                    disabled: loading,
                    maxLength: 500,
                    className: "flex-1 h-11 px-4 rounded-lg bg-muted text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "submit",
                    size: "icon",
                    variant: "hero",
                    className: "h-11 w-11 shrink-0",
                    disabled: loading || !input.trim(),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" })
                  }
                )
              ]
            }
          )
        ]
      }
    ) })
  ] });
}
const SITE_NAME = "Moha Delivers";
const SITE_URL = "https://mohadelivers.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;
const TWITTER_HANDLE = "@MohaForMathare";
function seoMeta(opts) {
  const fullTitle = opts.bare ? opts.title : `${opts.title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${opts.path}`;
  const image = opts.image || DEFAULT_OG_IMAGE;
  const type = opts.type || "website";
  const meta = [
    { title: fullTitle },
    { name: "description", content: opts.description },
    // Open Graph
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: opts.description },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: "en_KE" },
    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: opts.description },
    { name: "twitter:image", content: image },
    { name: "twitter:site", content: TWITTER_HANDLE }
  ];
  if (opts.noindex) {
    meta.push({ name: "robots", content: "noindex, nofollow" });
  } else {
    meta.push({ name: "robots", content: "index, follow" });
  }
  return meta;
}
function seoLinks(path) {
  return [{ rel: "canonical", href: `${SITE_URL}${path}` }];
}
function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: "Moha for Mathare",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: "Moha for Mathare 2027 — a movement for education, health, business, and environment in Mathare constituency, Nairobi.",
    areaServed: {
      "@type": "Place",
      name: "Mathare, Nairobi, Kenya"
    },
    sameAs: []
  };
}
function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Moha",
    url: SITE_URL,
    image: DEFAULT_OG_IMAGE,
    jobTitle: "2027 MP Aspirant — Mathare Constituency",
    description: "Moha is a 2027 Member of Parliament aspirant for Mathare constituency, Nairobi, focused on education, health, business support, and environmental initiatives.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mathare",
      addressRegion: "Nairobi",
      addressCountry: "KE"
    }
  };
}
const appCss = "/assets/styles-q_lU0dkP.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-display font-bold text-primary", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-2xl font-display font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "mt-6 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90",
        children: "Go home"
      }
    )
  ] }) });
}
const Route$n = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${SITE_NAME} — Mathare 2027` },
      {
        name: "description",
        content: "Moha for Mathare 2027 — a movement for education, health, business, and environment. Kuna More na Moha!"
      },
      { name: "author", content: "Moha for Mathare" },
      { name: "theme-color", content: "#14532d" },
      { name: "robots", content: "index, follow" },
      // Open Graph defaults (overridden per-page via seoMeta())
      { property: "og:title", content: `${SITE_NAME} — Mathare 2027` },
      {
        property: "og:description",
        content: "A people-powered movement for Mathare. Kuna More na Moha!"
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "en_KE" },
      // Twitter defaults
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `${SITE_NAME} — Mathare 2027` },
      { name: "twitter:description", content: "A people-powered movement for Mathare. Kuna More na Moha!" },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:site", content: TWITTER_HANDLE }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: SITE_URL },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
      }
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(organizationJsonLd())
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent
});
function HtmlWithLang({ children }) {
  const { language } = useLanguage();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("html", { lang: language, children });
}
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(HtmlWithLang, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] }) });
}
function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "min-h-screen", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "min-h-screen", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ChatWidget, {})
  ] });
}
const $$splitComponentImporter$l = () => import("./unsubscribe-BOBpoogH.mjs");
const searchSchema$1 = objectType({
  token: stringType().optional()
});
const Route$m = createFileRoute("/unsubscribe")({
  validateSearch: searchSchema$1,
  head: () => ({
    meta: [{
      title: "Unsubscribe"
    }, {
      name: "robots",
      content: "noindex, nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("./stories-BhYsrZnK.mjs");
const Route$l = createFileRoute("/stories")({
  head: () => ({
    meta: seoMeta({
      title: "Featured Stories — Moha for Mathare",
      description: "Real testimonials from Mathare residents whose lives have been touched by Moha's work.",
      path: "/stories"
    }),
    links: seoLinks("/stories")
  }),
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./signin-C7WfEiN9.mjs");
const searchSchema = objectType({
  redirect: stringType().optional()
});
const Route$k = createFileRoute("/signin")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [{
      title: "Sign In — Moha Delivers"
    }, {
      name: "description",
      content: "Sign in or create a free account with just your name and a password to apply for a Moha bursary or list your business on the Mathare Business Hub."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./priorities-8x9upfYx.mjs");
const Route$j = createFileRoute("/priorities")({
  head: () => ({
    meta: seoMeta({
      title: "Priorities — Moha Delivers",
      description: "Education, Health & Environment, Businesses, Security & Safety, Other Initiatives — Moha's five-pillar manifesto for Mathare 2027.",
      path: "/priorities"
    }),
    links: seoLinks("/priorities")
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./polling-NMbfvnLr.mjs");
const Route$i = createFileRoute("/polling")({
  head: () => ({
    meta: seoMeta({
      title: "Community Polling — Moha for Mathare",
      description: "Select your Mathare ward and vote on Moha's initiatives, projects and 2027 MP candidacy. Your voice shapes the manifesto.",
      path: "/polling"
    }),
    links: seoLinks("/polling")
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./opinion-DAPWVdx-.mjs");
const Route$h = createFileRoute("/opinion")({
  head: () => ({
    meta: [{
      title: "Send Your Opinion — Moha for Mathare"
    }, {
      name: "description",
      content: "Tell Moha what Mathare needs. Every voice shapes the manifesto and the work."
    }, {
      property: "og:title",
      content: "Send Your Opinion — Moha for Mathare"
    }, {
      property: "og:description",
      content: "Your message. Real action."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./news-BrrM7v_u.mjs");
const Route$g = createFileRoute("/news")({
  head: () => ({
    meta: seoMeta({
      title: "Top Stories — Moha Campaign News",
      description: "The latest news, milestones, and updates from Moha's Mathare 2027 campaign.",
      path: "/news"
    }),
    links: seoLinks("/news")
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./foundations-BSt6ICw-.mjs");
const Route$f = createFileRoute("/foundations")({
  head: () => ({
    meta: seoMeta({
      title: "Foundation — Moha for Mathare",
      description: "Moha's foundations: vulnerable groups, bursaries, PWDs, youth empowerment, sports & talent, school supplies, business support, and early childhood care in Mathare.",
      path: "/foundations"
    }),
    links: seoLinks("/foundations")
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./donate-8JvCWMSi.mjs");
const Route$e = createFileRoute("/donate")({
  head: () => ({
    meta: seoMeta({
      title: "Donate — Power Moha's Movement",
      description: "Support Moha's 2027 campaign for Mathare via M-Pesa or Card. From KSh 500 to KSh 10,000 — every shilling delivers.",
      path: "/donate"
    }),
    links: seoLinks("/donate")
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./ask-BxjG73-W.mjs");
const Route$d = createFileRoute("/ask")({
  head: () => ({
    meta: seoMeta({
      title: "Ask Moha — Direct Q&A",
      description: "Ask Moha anything — about the manifesto, his vision for Mathare, or how to get involved.",
      path: "/ask"
    }),
    links: seoLinks("/ask")
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./advertise-oGAjeDid.mjs");
const Route$c = createFileRoute("/advertise")({
  head: () => ({
    meta: seoMeta({
      title: "Advertise With Us — Mathare Business Hub",
      description: "List your Mathare business on the Moha Business Hub. Multiple photos, payment options, delivery info — free for every hustler.",
      path: "/advertise"
    }),
    links: seoLinks("/advertise")
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./index-BI3CghWE.mjs");
const Route$b = createFileRoute("/")({
  head: () => ({
    meta: seoMeta({
      title: "Moha Delivers — Kuna More na Moha!",
      description: "Join the movement. Moha is the 2027 MP aspirant for Mathare delivering on education, health, business, and environment. Kuna More na Moha!",
      path: "/",
      bare: true
    }),
    links: seoLinks("/"),
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify(personJsonLd())
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./admin.index-Bi-yZocX.mjs");
const Route$a = createFileRoute("/admin/")({
  head: () => ({
    meta: [{
      title: "Admin Overview — Moha Delivers"
    }, {
      name: "robots",
      content: "noindex, nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const SYSTEM_PROMPT = `You are Moha's AI assistant for his 2027 Mathare MP campaign website.

ABOUT MOHA:
- 2027 MP aspirant for Mathare Constituency, Nairobi, Kenya
- Slogans: "Moha Delivers" and "Kuna More na Moha!"
- Born and raised in Mathare. A son of the soil.
- Runs the Moha Foundation: bursaries, vulnerable groups, PWD support

FOUR PRIORITY PILLARS:
1. EDUCATION — bursaries, digital learning hubs, mentorship, sanitary towels, adult literacy
2. HEALTH — 24/7 ward clinics, maternal care, mental health, NHIF/SHIF drives, mobile clinics
3. BUSINESSES — Mama Mboga capital fund (KSh 50M target), youth hustler hubs, modern markets, SACCO support
4. ENVIRONMENT — Mathare River cleanup, 100,000 trees by 2030, recycling co-ops, solar lighting, green parks

FOUNDATIONS:
- Vulnerable Groups (8,500+ households): food parcels, dignity packs, GBV legal aid
- Bursaries (12,000+ issued): primary to university, uniforms, transport
- People with Disabilities (1,200+ empowered): wheelchairs, grants, accessible spaces

CONTACT & DONATIONS:
- Donate: M-Pesa Paybill 247247, Account MOHA2027 (KSh 500–10,000 tiers + custom)
- Card payments also accepted on /donate
- Address: Campaign HQ, Mathare North, Nairobi
- Phone: +254 700 000 000
- Email: hello@mohadelivers.ke

NAVIGATION HELP — direct users to the right page:
- /priorities — Manifesto pillars
- /foundations — Vulnerable groups, bursaries, PWDs
- /stories — Testimonials
- /news — Campaign updates
- /polling — Vote on community issues
- /ask — Submit a direct question
- /opinion — Send a message
- /donate — Support the movement

TONE: Warm, professional, community-driven. Sprinkle Sheng/Swahili naturally ("asante", "mzee", "mama", "hustler", "Kuna More na Moha"). Keep answers concise (2–4 sentences) and always end with a useful next step (e.g., "Tap the Donate button" or "See the full plan on the Priorities page").

If asked something unrelated to Moha, the campaign, Mathare, or Kenyan civic issues — politely redirect.`;
const Route$9 = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages } = await request.json();
          if (!Array.isArray(messages) || messages.length === 0) {
            return new Response(
              JSON.stringify({ error: "messages array required" }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }
          const apiKey = process.env.GROQ_API_KEY;
          if (!apiKey) {
            return new Response(
              JSON.stringify({ error: "AI service not configured. Please set GROQ_API_KEY in your .env file." }),
              { status: 500, headers: { "Content-Type": "application/json" } }
            );
          }
          const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                stream: true,
                messages: [
                  { role: "system", content: SYSTEM_PROMPT },
                  ...messages.slice(-12)
                ]
              })
            }
          );
          if (response.status === 401 || response.status === 403) {
            return new Response(
              JSON.stringify({ error: "Invalid API key. Please check your GROQ_API_KEY." }),
              { status: 500, headers: { "Content-Type": "application/json" } }
            );
          }
          if (response.status === 429) {
            return new Response(
              JSON.stringify({ error: "Rate limit reached. Please wait a moment and try again." }),
              { status: 429, headers: { "Content-Type": "application/json" } }
            );
          }
          if (!response.ok || !response.body) {
            const t = await response.text().catch(() => "");
            console.error("Groq API error:", response.status, t);
            return new Response(
              JSON.stringify({ error: `AI service error (${response.status}).` }),
              { status: 500, headers: { "Content-Type": "application/json" } }
            );
          }
          return new Response(response.body, {
            headers: { "Content-Type": "text/event-stream" }
          });
        } catch (err) {
          console.error("chat error:", err);
          return new Response(
            JSON.stringify({ error: "Server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      }
    }
  }
});
const $$splitComponentImporter$8 = () => import("./admin.supporters-BsabGbiV.mjs");
const Route$8 = createFileRoute("/admin/supporters")({
  head: () => ({
    meta: [{
      title: "Supporters — Admin"
    }, {
      name: "robots",
      content: "noindex, nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./admin.sms--rU_T-Kl.mjs");
const Route$7 = createFileRoute("/admin/sms")({
  head: () => ({
    meta: [{
      title: "Bulk SMS — Admin"
    }, {
      name: "robots",
      content: "noindex, nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./admin.polls-DxW5kDpZ.mjs");
const Route$6 = createFileRoute("/admin/polls")({
  head: () => ({
    meta: [{
      title: "Poll Analytics — Admin"
    }, {
      name: "robots",
      content: "noindex, nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./admin.login-DGGqTpkl.mjs");
const Route$5 = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{
      title: "Admin Login — Moha Delivers"
    }, {
      name: "robots",
      content: "noindex, nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./admin.inbox-CiMw4yb1.mjs");
const Route$4 = createFileRoute("/admin/inbox")({
  head: () => ({
    meta: [{
      title: "Message Inbox — Admin"
    }, {
      name: "robots",
      content: "noindex, nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./admin.content-CJ-YSkru.mjs");
const Route$3 = createFileRoute("/admin/content")({
  head: () => ({
    meta: [{
      title: "Content Manager — Admin"
    }, {
      name: "robots",
      content: "noindex, nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./admin.businesses-BVnWnHnt.mjs");
const Route$2 = createFileRoute("/admin/businesses")({
  head: () => ({
    meta: [{
      title: "Business Moderation — Admin"
    }, {
      name: "robots",
      content: "noindex, nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./admin.bursaries-BHkcSZ5j.mjs");
const Route$1 = createFileRoute("/admin/bursaries")({
  head: () => ({
    meta: [{
      title: "Bursary Applications — Admin"
    }, {
      name: "robots",
      content: "noindex, nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./admin.activities-DpH_FJhX.mjs");
const Route = createFileRoute("/admin/activities")({
  head: () => ({
    meta: [{
      title: "Daily Activities — Admin"
    }, {
      name: "robots",
      content: "noindex, nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const UnsubscribeRoute = Route$m.update({
  id: "/unsubscribe",
  path: "/unsubscribe",
  getParentRoute: () => Route$n
});
const StoriesRoute = Route$l.update({
  id: "/stories",
  path: "/stories",
  getParentRoute: () => Route$n
});
const SigninRoute = Route$k.update({
  id: "/signin",
  path: "/signin",
  getParentRoute: () => Route$n
});
const PrioritiesRoute = Route$j.update({
  id: "/priorities",
  path: "/priorities",
  getParentRoute: () => Route$n
});
const PollingRoute = Route$i.update({
  id: "/polling",
  path: "/polling",
  getParentRoute: () => Route$n
});
const OpinionRoute = Route$h.update({
  id: "/opinion",
  path: "/opinion",
  getParentRoute: () => Route$n
});
const NewsRoute = Route$g.update({
  id: "/news",
  path: "/news",
  getParentRoute: () => Route$n
});
const FoundationsRoute = Route$f.update({
  id: "/foundations",
  path: "/foundations",
  getParentRoute: () => Route$n
});
const DonateRoute = Route$e.update({
  id: "/donate",
  path: "/donate",
  getParentRoute: () => Route$n
});
const AskRoute = Route$d.update({
  id: "/ask",
  path: "/ask",
  getParentRoute: () => Route$n
});
const AdvertiseRoute = Route$c.update({
  id: "/advertise",
  path: "/advertise",
  getParentRoute: () => Route$n
});
const IndexRoute = Route$b.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$n
});
const AdminIndexRoute = Route$a.update({
  id: "/admin/",
  path: "/admin/",
  getParentRoute: () => Route$n
});
const ApiChatRoute = Route$9.update({
  id: "/api/chat",
  path: "/api/chat",
  getParentRoute: () => Route$n
});
const AdminSupportersRoute = Route$8.update({
  id: "/admin/supporters",
  path: "/admin/supporters",
  getParentRoute: () => Route$n
});
const AdminSmsRoute = Route$7.update({
  id: "/admin/sms",
  path: "/admin/sms",
  getParentRoute: () => Route$n
});
const AdminPollsRoute = Route$6.update({
  id: "/admin/polls",
  path: "/admin/polls",
  getParentRoute: () => Route$n
});
const AdminLoginRoute = Route$5.update({
  id: "/admin/login",
  path: "/admin/login",
  getParentRoute: () => Route$n
});
const AdminInboxRoute = Route$4.update({
  id: "/admin/inbox",
  path: "/admin/inbox",
  getParentRoute: () => Route$n
});
const AdminContentRoute = Route$3.update({
  id: "/admin/content",
  path: "/admin/content",
  getParentRoute: () => Route$n
});
const AdminBusinessesRoute = Route$2.update({
  id: "/admin/businesses",
  path: "/admin/businesses",
  getParentRoute: () => Route$n
});
const AdminBursariesRoute = Route$1.update({
  id: "/admin/bursaries",
  path: "/admin/bursaries",
  getParentRoute: () => Route$n
});
const AdminActivitiesRoute = Route.update({
  id: "/admin/activities",
  path: "/admin/activities",
  getParentRoute: () => Route$n
});
const rootRouteChildren = {
  IndexRoute,
  AdvertiseRoute,
  AskRoute,
  DonateRoute,
  FoundationsRoute,
  NewsRoute,
  OpinionRoute,
  PollingRoute,
  PrioritiesRoute,
  SigninRoute,
  StoriesRoute,
  UnsubscribeRoute,
  AdminActivitiesRoute,
  AdminBursariesRoute,
  AdminBusinessesRoute,
  AdminContentRoute,
  AdminInboxRoute,
  AdminLoginRoute,
  AdminPollsRoute,
  AdminSmsRoute,
  AdminSupportersRoute,
  ApiChatRoute,
  AdminIndexRoute
};
const routeTree = Route$n._addFileChildren(rootRouteChildren)._addFileTypes();
function DefaultErrorComponent({ error, reset }) {
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        className: "h-8 w-8 text-destructive",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground", children: "Something went wrong" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "An unexpected error occurred. Please try again." }),
    false,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const getRouter = () => {
  const router2 = createRouter({
    routeTree,
    context: {},
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Button as B,
  buttonVariants as b,
  cn as c,
  heroImg as h,
  router as r,
  useLanguage as u
};
