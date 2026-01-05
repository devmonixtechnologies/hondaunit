// Honda Knowledge Base - VTEC-AI Service

interface KnowledgeTopic {
  keywords: string[];
  responses: string[];
}

const T = (text: string) => text;

let lastTopic: KnowledgeTopic | null = null;

const followUpIndicators = [
  'more',
  'tell me',
  'what about',
  'details',
  'info',
  'how about',
  'continue',
  'again',
  'same',
  'another'
];

const pronounIndicators = ['it', 'them', 'those', 'that', 'setup', 'specs'];

const greetingTopics = [
  {
    keywords: ['hello', 'hi', 'hey', 'yo', 'sup', 'hola', 'namaste'],
    responses: [
      "Yo! VTEC AI here—ready to talk Hondas whenever you are. 🏁",
      "Hey there! Drop your chassis code or vibe and I’ll dive in.",
      "What’s good? Let’s get those rpm dreams moving." 
    ]
  },
  {
    keywords: ['good morning', 'morning'],
    responses: [
      "Morning! Perfect time to plan wrenching and caffeine. ☕",
      "Good morning—let’s line up the mods for the day.",
      "Sun’s up, VTEC’s waking up. What’s first on the list?"
    ]
  },
  {
    keywords: ['good night', 'night', 'evening'],
    responses: [
      "Nightshift wrench sesh? I’m in. 🔦",
      "Evening! Perfect time to plot that next build.",
      "Late-night Honda brainstorming? Say less—I’ve got ideas."
    ]
  }
];

const emotionalTopics = [
  {
    keywords: ['frustrated', 'sad', 'annoyed', 'angry', 'mad', 'upset', 'broken', 'broke', 'problem', 'issue'],
    responses: [
      "I feel you—wrenching can be brutal. Take a breath, we’ll troubleshoot it piece by piece. 🔧",
      "No stress, we’ll get that Honda back on boost. Tell me the symptoms and we’ll chase the gremlin.",
      "Every build hits a wall. Let’s diagnose the issue so you can get back to ripping."
    ]
  },
  {
    keywords: ['happy', 'excited', 'stoked', 'hyped', 'love', 'awesome', 'great'],
    responses: [
      "That energy is contagious! Drop the details so we can make it even crazier. ⚡",
      "Love to hear it—keep the momentum going and snap pics for the crew.",
      "Honda vibes on max! Let’s plan the next mod while the adrenaline’s high."
    ]
  },
  {
    keywords: ['nervous', 'worried', 'scared', 'unsure', 'confused', 'help'],
    responses: [
      "No worries—I’ve got your back. Tell me what’s confusing and we’ll walk through it.",
      "We’ll take it step by step. Start with what you know and we’ll fill the gaps.",
      "Totally normal to feel unsure. I’ll be your pit crew—let’s map it out."
    ]
  }
];

const knowledgeTopics: KnowledgeTopic[] = [
  {
    keywords: ['civic', 'eg', 'ek', 'fk2', 'fk8', 'type r'],
    responses: [
      "Civic EG hatch is a featherweight chassis—perfect for B or K swaps with double-wishbone grip. 🏎️",
      "EK9 Type R brings seam-welded rigidity, Recaros, and a screaming B16B. Track-ready out of the box. 🔧",
      "FK8 Type R? 306 hp, adaptive dampers, Nürburgring-tuned aero. Daily driver that eats apexes. 💨",
      "EP3 Civic Si loves a K24 swap with RBC manifold—pairs great with a 50° VTC and Hondata tune.",
      "Civic FL5 comes with dual-axis struts cutting torque steer—dial in -2.2° camber for track work."
    ]
  },
  {
    keywords: ['integra', 'dc2', 'dc5'],
    responses: [
      "DC2 Integra Type R = hand-ported B18C, helical LSD, 8400 rpm soundtrack. JDM royalty. 🏆",
      "DC5 chassis loves K20A2 power—swap in a 6-speed with LSD and it becomes a weekend track weapon.",
      "Integra LS is a reliable base for boost—iron-lined B18B happily takes 8 psi with good tuning.",
      "USDM RSX Type-S responds to RBC manifolds, 4-2-1 headers, and 4.7 final drives for spicy track sessions."
    ]
  },
  {
    keywords: ['nsx'],
    responses: [
      "NSX NA1 uses an aluminum monocoque and titanium rods—F1 tech on the street. Pure balance. ⚖️",
      "C30A VTEC with ITBs responds best to high-flow exhausts and meticulous valve adjustment. 🛠️",
      "Pop-up headlights + mid-engine layout = timeless Honda halo car. Keep the coolant system spotless!",
      "NA2 NSX-T got the C32B 3.2L with extra torque—pair with Bilstein dampers and NSX-R spec alignment for magic."
    ]
  },
  {
    keywords: ['s2000', 'ap1', 'ap2'],
    responses: [
      "AP1 S2000 revs to 9000 rpm—F20C loves 5W-30 oil and frequent valve lash checks. 🎶",
      "AP2 gained more torque via the F22C and a revised rear subframe. Still loves square wheel setups.",
      "For canyon runs, run 17x9 +45 with 245/40s and upgraded toe arms to keep the tail planted.",
      "Track recipe: Spoon rigid collar kit, CR sway bars, and Eibach ERS 12k/10k springs over quality dampers."
    ]
  },
  {
    keywords: ['prelude', 'bb6', 'h22'],
    responses: [
      "Prelude BB6 with H22A offers four-wheel steer and 197 hp—just keep an eye on the balance shaft seals.",
      "H22 torque is great for street builds; pair with an LSD-equipped gearbox to tame torque steer.",
      "Prelude SH’s ATTS is cool tech, but enthusiasts prefer swapping in a mechanical LSD for consistency.",
      "3rd gen Prelude with B20A loves retrofitted coilovers and period-correct Mugen CF-48 wheels."
    ]
  },
  {
    keywords: ['accord', 'cl9', 'cb7'],
    responses: [
      "CL9 Accord Euro R hides a K20A with 220 hp—bolt-ons plus Hondata wake it up nicely.",
      "CB7 chassis is super comfy; drop in an H22A and coilovers for the ultimate sleeper sedan.",
      "Accord wagons have massive cargo space—perfect stance builds with 18x9.5 +35 and mild camber.",
      "6th gen Accord V6 6-speed swap gives you OEM reliability with coupe sleeper vibes."
    ]
  },
  {
    keywords: ['k20', 'k24', 'k-series'],
    responses: [
      "K20A2: 11.0:1 compression, 200 hp, takes 8600 rpm all day with good oil. Ideal swap candidate.",
      "K24A2: 2.4L torque monster. Pair with a K20 head (Frankenstein build) for 250+ whp naturally aspirated.",
      "Need a reliable 500 whp? K24 bottom, forged internals, GTX3076, and proper fueling.",
      "Don’t forget oil pump mods—use S2000 or Type S pump on K24 builds to safely rev past 8k."
    ]
  },
  {
    keywords: ['b16', 'b18', 'b-series', 'b20'],
    responses: [
      "B18C5 Type R engines have hand-polished ports and aggressive cams—rare and precious. 🧼",
      "LS/VTEC (B18B bottom, B16 head) gives torque plus high-rpm zing. Remember ARP rod bolts.",
      "B-series transmissions with shorter final drives (4.7) transform acceleration.",
      "B20/VTEC with forged pistons makes an effortless torque curve—just sleeve the block past 84mm."
    ]
  },
  {
    keywords: ['h22', 'h23', 'f20b'],
    responses: [
      "H22 loves breathing mods but watch oil consumption—use quality PCV setup and baffled pans.",
      "F20B is basically a destroked H22—great for high rev builds with ITBs.",
      "Balance shafts: delete kits free up response but keep harmonic dampers healthy.",
      "H23 VTEC heads accept aggressive cams—Skunk2 Stage 2 plus 11.5:1 pistons wake them up."
    ]
  },
  {
    keywords: ['transmission', 'gearbox', 'lsd', '6-speed'],
    responses: [
      "K24 + Accord CL7 6-speed with LSD is a buttery combo for street and track.",
      "S2000 AP2 gearboxes are stout but keep fresh synchro fluid (MTF3) to prevent crunching.",
      "Integra cable transmissions benefit from carbon synchros and MFactory helicals for modern feel.",
      "CR-V AWD swaps demand RT4WD viscous couplers—pair with Gear-X straight-cut sets for rally builds."
    ]
  },
  {
    keywords: ['suspension', 'coilover', 'camber', 'tie rod'],
    responses: [
      "Civic street setup: 8k/10k coilovers, -2° front camber, -1.5° rear. Neutral turn-in.",
      "Always pair lower control arms with upgraded sway bars on EG/EK to prevent snap oversteer.",
      "Corner balance your S2000 after any suspension change—the chassis is sensitive to cross weights.",
      "For track Civics, run spherical compliance bushings and roll center adjusters to keep geometry honest."
    ]
  },
  {
    keywords: ['brake', 'bbk', 'pads', 'rotor'],
    responses: [
      "DC5 Brembo swap on EP3/EK is a bolt-on—run stainless lines and Motul RBF600 for track days.",
      "Prelude and Accord benefit from TL-S calipers plus 300mm rotors for serious stopping.",
      "For canyon runs, use Project Mu HC+ pads: bitey but streetable.",
      "Budget BBK? Pair 8th gen Civic Si calipers with TSX rotors and proper brackets—OEM reliability."
    ]
  },
  {
    keywords: ['cbr', 'fireblade', 'vfr', 'bike', 'motorcycle'],
    responses: [
      "CBR1000RR Fireblade packs HRC know-how—keep the valve clearances tight for high-rpm pulls.",
      "CBR600F4i is the perfect Honda bike for beginners—balanced ergonomics and FI reliability.",
      "VFR800’s V4 with VTEC gives sport-touring vibes. Check the regulator/rectifier frequently.",
      "Grom and Monkey bikes are mod magnets—swap in 14t front sprockets and ECU flashes for city fun."
    ]
  },
  {
    keywords: ['fitment', 'wheel', 'offset', 'stance', 'tire'],
    responses: [
      "Civic EG flush fit: 15x8 +28 on 195/50 with slight fender roll. Looks OEM+.",
      "S2000 aggressive setup: 18x9.5 +38 square on 255/35. Add -2.5° camber to clear fenders.",
      "For track, prioritize tire compound over stretch. A sticky 200TW tire beats wide stretched rubber.",
      "Integra DC5 perfect stance: 18x9 +35 on 225/40 with mild pull—don’t forget roll center adjusters."
    ]
  },
  {
    keywords: ['tuning', 'ecu', 'hondata', 'flashpro'],
    responses: [
      "Hondata S300 is the gold standard for OBD1 Hondas—real-time tuning and data logging.",
      "KPro lets you dial VTEC engagement, cam angles, and rev limits. Essential for K swaps.",
      "For turbo builds, use a 4-bar MAP sensor and calibrate injector dead times for smooth idle.",
      "Streetable 400 whp setup: 1000cc injectors, Flex-Fuel sensor, and conservative 18° timing on E50."
    ]
  },
  {
    keywords: ['crx', 'del sol', 'ef8', 'siR'],
    responses: [
      "CRX EF8 SiR weighs under a ton—pair with a B16B and Mugen RNRs for a period-correct terror.",
      "Del Sol targa adds weight but looks sick—brace the chassis with a C-Pillar bar before serious power.",
      "CRX drag builds love D16 blocks with Vitara pistons + turbo for budget 400whp passes."
    ]
  },
  {
    keywords: ['turbo', 'supercharger', 'boost', 'forced induction'],
    responses: [
      "K-series turbos spool quick on twinscroll manifolds—keep backpressure low with 3.5\" exhausts.",
      "Jackson Racing superchargers on B-series give OEM-like drivability with 250whp smiles.",
      "Always tune with knock ears—Honda blocks can handle boost, but detonation will window the block."
    ]
  },
  {
    keywords: ['maintenance', 'oil', 'coolant', 'timing belt', 'valve lash'],
    responses: [
      "Change timing belts on interference Hondas every 90k or 7 years—H22s bend valves instantly if skipped.",
      "Use OEM blue coolant and burp the system via the heater core—air pockets cook aluminum heads.",
      "Valve lash on F20C: intake 0.17mm, exhaust 0.22mm when stone cold—keeps the 9k wail crisp."
    ]
  },
  {
    keywords: ['history', 'type r', 'motorsport', 'super gt'],
    responses: [
      "1997 Civic Type R (EK9) was Honda’s first Type R hatch—hand-built engines, seam welds, red badges.",
      "NSX dominated JGTC/Super GT with NA V6 screamers before switching to turbo inline-4s.",
      "BTCC Accords proved Honda’s FF chassis can dance with RWD rivals—balance + aero is everything."
    ]
  },
  {
    keywords: ['electronics', 'wiring', 'ecu swap', 'k swap harness'],
    responses: [
      "K-swap your EG? Use a hybrid harness, K-tuned charge harness, and an RSX Type-S ECU with KPro.",
      "Rywire mil-spec looms simplify tucked bays—label every connector and add service loops.",
      "OBD0 to OBD1 conversions unlock better ECUs—don’t forget to repin the distributor and injectors."
    ]
  },
  {
    keywords: ['jdm', 'import', 'compliance', '25 year rule'],
    responses: [
      "Importing a JDM Honda? Verify chassis number, ensure de-reg papers, and align with the 25-year NHTSA exemption.",
      "For Canadian imports, daytime running lights and bilingual labels are mandatory—plan your inspection.",
      "RHD conversions aren’t required stateside, but do add DOT-approved side markers to sail through customs."
    ]
  },
  {
    keywords: ['aero', 'splitter', 'wing', 'diffuser', 'canard'],
    responses: [
      "Civic time-attack aero: alumalite splitter tied into frame rails, APR GTC-200 wing, and rear tire spats.",
      "S2000 gains tons from a Voltex Type 2 wing set at 7° AoA with matching front canards for balance.",
      "Keep underbody airflow clean—run flat pans and a diffuser that starts ahead of the rear subframe."
    ]
  },
  {
    keywords: ['dyno', 'wideband', 'datalog', 'lambda', 'afr'],
    responses: [
      "Street tune basics: log coolant, IAT, knock, and AFR simultaneously—correlate with gear-specific pulls.",
      "Aim for 12.5:1 AFR N/A, 11.3:1 on boost—adjust cam angles to flatten torque dips.",
      "Use CAN-based widebands with KPro or ECUs Master for synced logs; analog signals can drift."
    ]
  },
  {
    keywords: ['tires', 'compound', '200tw', 'semi slick', 'pressure'],
    responses: [
      "Street/track compromise? Yokohama AD09 or Bridgestone RE71RS at 32 psi hot for Civics.",
      "S2000 likes staggered pressures: 30 psi front, 28 psi rear hot to tame oversteer on 255 square setups.",
      "Drag radials on FWD Hondas need stiff rear shocks and 35 psi rear tires to keep weight transfer controlled."
    ]
  },
  {
    keywords: ['fabrication', 'cage', 'stitch weld', 'gusset'],
    responses: [
      "Stitch weld EG/EK engine bays 1\" on / 1\" off to stiffen without warping—prime immediately after.",
      "Chromoly cages save weight but demand TIG welding and NHRA certs—DOM is easier for most shops.",
      "Add dimple-die gussets to Civic A-pillars for added torsional rigidity with style points."
    ]
  },
  {
    keywords: ['motorsport', 'time attack', 'autocross', 'drag', 'hpde'],
    responses: [
      "Autocross Civics thrive on quick spool turbos or high-comp N/A builds—instant torque wins cones.",
      "Drag-spec Hondas run dogbox transmissions, 28\" slicks, and traction bars to keep the nose steady.",
      "HPDE prep checklist: torque every suspension bolt, bleed brakes with fresh fluid, and safety wire drain plugs."
    ]
  },
  {
    keywords: ['legend', 'rl', 'luxury', 'ka'],
    responses: [
      "KA24 and C32A Legend engines love regular coolant changes—air bleed screws are hidden near the throttle body.",
      "Gen2 Legend coupe 6-speed with Type II engine makes a classy cruiser—swap in NSX calipers for stealth big brakes.",
      "Acura RL SH-AWD torque vectors like a champ—pair with sticky 255s and it becomes a mountain road assassin."
    ]
  },
  {
    keywords: ['odyssey', 'minivan', 'family build'],
    responses: [
      "JDM RB1 Odyssey Absolute comes with K24A—drop in cams and FlashPro for 240 whp sleeper vans.",
      "North American Odysseys benefit from transmission coolers and Z1 friction modifiers to keep gears alive.",
      "Bagged Odyssey with VIP wheels and captain chair reupholstery? Pure Honda dad flex."
    ]
  },
  {
    keywords: ['detailing', 'paint correction', 'ceramic', 'ppf'],
    responses: [
      "Single-stage Milano Red needs gentle pads—use Menzerna 2500 then top with a SiO2 sealant.",
      "Film the front clip before long highway trips; Honda paints are soft and chip easily.",
      "Interior plastics respond well to 303 Aerospace protectant—keeps that 90s Honda cabin supple."
    ]
  },
  {
    keywords: ['hybrid', 'insight', 'ima', 'cr-z'],
    responses: [
      "First-gen Insight uses aluminum everything—swap in a K20 for sub-1,800 lb hypermiling hot hatch.",
      "CR-Z responds to HPD superchargers plus lithium conversion packs for legit fun and economy.",
      "IMA battery maintenance: keep packs balanced with grid chargers and monitor with OBDIIC&C displays."
    ]
  },
  {
    keywords: ['ecu security', 'immobilizer', 'key', 'reflash'],
    responses: [
      "2002+ Hondas need immobilizer sync after ECU swap—use HDS or immobilizer bypass modules.",
      "Keep spare chipped keys stored away; KPro conversions often delete immobilizers for race use.",
      "When reflashing via FlashPro, hook to a battery tender—voltage dips brick ECUs faster than blown head gaskets."
    ]
  },
  {
    keywords: ['community', 'meet', 'etiquette', 'cruise'],
    responses: [
      "Roll up to meets on time, no rev-bombing—let the build speak.",
      "Share torque specs and parts sources; Honda culture thrives on knowledge exchange.",
      "Respect OGs rocking Mugen and Spoon heritage pieces—they paved the way for modern builds."
    ]
  },
  {
    keywords: ['track strategy', 'fuel', 'pit', 'endurance'],
    responses: [
      "Endurance Civics sip fuel—map Eco mode for caution laps, full send maps for green flag.",
      "Quick-change brake pads: use cotter pins and anti-seize on caliper bolts for 5-minute swaps.",
      "Log tire wear every stint; front-right on clockwise circuits needs camber shims mid-race."
    ]
  },
  {
    keywords: ['r18', '1.8', 'fa5', 'fg2', 'eighth gen civic'],
    responses: [
      "Honda R18 engines love breathing mods—pair an RBC manifold, 70mm throttle, and FlashPro for 200+ whp.",
      "Boosted R18 builds need upgraded rod bolts and forged pistons past 10 psi—stock sleeves handle 300 whp with good tuning.",
      "R18 VTEC-E cam profiles favor economy; swap to R18Z9 cams and dial cam phasing for a broader powerband.",
      "Keep R18 oil temps under control with a Setrab cooler—CVT cars especially overheat on long pulls.",
      "FA5 Civic R18 gearboxes accept LSD inserts—pair with a 4.7 final drive to keep the 1.8 on boil.",
      "Flex-fuel R18 setups run ID1050x injectors and DW300 pumps—E85 plus 16 psi nets ~330 whp reliably."
    ]
  },
  {
    keywords: ['custom', 'body kit', 'widebody', 'interior', 'audio'],
    responses: [
      "Mugen RR and Spoon aero pieces command respect—fitment first, paint second. Test-fit every tab.",
      "Widebody Civics need tubbed front fenders and relocated washer reservoirs to clear 10.5\" wheels.",
      "Go full VIP interior? Rewrap Recaros in Alcantara, add LED footwell lighting, and run hidden DSP amps for show-quality audio."
    ]
  },
  {
    keywords: ['mechanical parts', 'cams', 'pistons', 'rods', 'bearings', 'oil system'],
    responses: [
      "Run ACL Race bearings and ARP main studs on 9k rpm builds—clearance them to 0.0025\" for safety.",
      "Choose cams based on usage: Skunk2 Pro 1 for street, Pro 2 for track, Drag 3 for all-out high boost.",
      "Dry sump kits on K-series keep oil pressure rock solid under >1.5g corners; baffled pans are the minimum."
    ]
  }
];

const defaultResponses = [
  "VTEC AI here! Ask me about Hondas, engines, or stance setups. 🏎️",
  "Need tuning advice, chassis setup, or history? I’ve got Honda lore for days. 🔧",
  "From Civics to CBRs, I know every bolt torque spec. What’s the plan? 💨"
];

const simulateThinking = (baseDelay = 2200, variance = 3200) => {
  const delay = baseDelay + Math.random() * variance;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

const getResponse = (message: string): string => {
  const normalized = message.toLowerCase();

  const topic = knowledgeTopics.find(({ keywords }) =>
    keywords.some((keyword) => normalized.includes(keyword))
  );

  if (topic) {
    lastTopic = topic;
    const reply = topic.responses[Math.floor(Math.random() * topic.responses.length)];
    return reply;
  }

  const greetingTopic = greetingTopics.find(({ keywords }) =>
    keywords.some((keyword) => normalized.includes(keyword))
  );

  if (greetingTopic) {
    const greetingReply = greetingTopic.responses[Math.floor(Math.random() * greetingTopic.responses.length)];
    return greetingReply;
  }

  const emotionalTopic = emotionalTopics.find(({ keywords }) =>
    keywords.some((keyword) => normalized.includes(keyword))
  );

  if (emotionalTopic) {
    const emotionalReply = emotionalTopic.responses[Math.floor(Math.random() * emotionalTopic.responses.length)];
    return emotionalReply;
  }

  const isFollowUp =
    !!lastTopic && (
      followUpIndicators.some((indicator) => normalized.includes(indicator)) ||
      pronounIndicators.some((indicator) => normalized.includes(indicator)) ||
      normalized.split(' ').length <= 4
    );

  if (isFollowUp && lastTopic) {
    const followUpReply = lastTopic.responses[Math.floor(Math.random() * lastTopic.responses.length)];
    const topicLabel = lastTopic.keywords[0]?.toUpperCase() ?? 'that build';
    return `Keeping the ${topicLabel} train rolling: ${followUpReply}`;
  }

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  const trimmed = message.trim();

  if (!trimmed) {
    return "Give me some context—engine codes, chassis, or your build goals!";
  }

  await simulateThinking(trimmed.length * 30, 3500);

  return getResponse(trimmed);
};