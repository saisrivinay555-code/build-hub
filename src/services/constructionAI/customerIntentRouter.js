import {
  REGIONAL_RATES,
  COST_DISTRIBUTION,
  MATERIAL_THUMB_RULES,
  REGULATORY_GUIDELINES
} from './constructionData.js';

import {
  parsePlotDimensions,
  parseBudgetAmount,
  getRegionalRate,
  estimateConstructionCost,
  estimateMaterialQuantities,
  generateConstructionTimeline
} from './calculationEngine.js';

// ─────────────────────────────────────────────────────────────
// CUSTOMER CONVERSATION CONTEXT (Multi-turn state)
// Remembers homeowner parameters across conversational turns
// ─────────────────────────────────────────────────────────────
export class CustomerConversationContext {
  constructor() {
    this.state = {
      plotDimensions: null,     // { length, width, area, formatted }
      location: 'Hyderabad',
      bedrooms: '3BHK',
      buildingType: 'Duplex House',
      floors: 'G+1',
      budget: null,             // { amount, formatted }
      parking: '1 Car Parking',
      qualityTier: 'standard',
      hasExistingProject: true
    };
  }

  updateFromQuery(query) {
    const parsedPlot = parsePlotDimensions(query);
    if (parsedPlot) {
      this.state.plotDimensions = parsedPlot;
    }

    const parsedBudget = parseBudgetAmount(query);
    if (parsedBudget) {
      this.state.budget = parsedBudget;
    }

    const lower = query.toLowerCase();
    if (lower.includes('hyderabad')) this.state.location = 'Hyderabad';
    else if (lower.includes('bangalore') || lower.includes('bengaluru')) this.state.location = 'Bengaluru';
    else if (lower.includes('chennai')) this.state.location = 'Chennai';
    else if (lower.includes('mumbai')) this.state.location = 'Mumbai';
    else if (lower.includes('delhi')) this.state.location = 'Delhi';

    if (lower.includes('1bhk')) this.state.bedrooms = '1BHK';
    else if (lower.includes('2bhk')) this.state.bedrooms = '2BHK';
    else if (lower.includes('3bhk')) this.state.bedrooms = '3BHK';
    else if (lower.includes('4bhk')) this.state.bedrooms = '4BHK';

    if (lower.includes('duplex')) this.state.buildingType = 'Duplex House';
    else if (lower.includes('single floor') || lower.includes('ground floor only') || lower.includes('independent floor')) {
      this.state.buildingType = 'Single-Floor Independent House';
      this.state.floors = 'Ground Floor Only';
    } else if (lower.includes('villa')) {
      this.state.buildingType = 'Independent Villa';
    }

    if (lower.includes('economy') || lower.includes('basic') || lower.includes('budget finish')) {
      this.state.qualityTier = 'economy';
    } else if (lower.includes('premium') || lower.includes('luxury') || lower.includes('high-end')) {
      this.state.qualityTier = 'premium';
    }

    return this.state;
  }
}

// ─────────────────────────────────────────────────────────────
// CUSTOMER AI INTENT ROUTER & ADVISORY ENGINE
// ─────────────────────────────────────────────────────────────
export function routeAndGenerateCustomerResponse({
  message,
  customerName = 'Ramesh Kumar',
  customerProject,
  customerStages = [],
  customerPayments = [],
  customerDocuments = [],
  customerUpdates = [],
  context = new CustomerConversationContext(),
  setCurrentTab
}) {
  const query = message.trim();
  const lower = query.toLowerCase();
  const firstName = customerName?.split(' ')[0] || 'there';

  // Update conversation memory with inputs in this turn
  const ctx = context.updateFromQuery(query);

  // ───────────────────────────────────────────────────────────
  // 1. MIXED QUERIES (Existing Project + Financial / Progress Priority)
  // ───────────────────────────────────────────────────────────
  if (
    (lower.includes('reasonable') || lower.includes('amount i have paid') || lower.includes('is it fair') || lower.includes('fair payment')) &&
    (lower.includes('72%') || lower.includes('progress') || lower.includes('paid'))
  ) {
    const totalCost = customerProject?.totalCost || '₹45,00,000';
    const amountPaid = customerProject?.amountPaid || '₹32,50,000';
    const pendingAmount = customerProject?.pendingAmount || '₹12,50,000';
    const progress = customerProject?.progress || 72;

    const paidPercent = customerProject?.totalCostNum > 0
      ? Math.round((customerProject.amountPaidNum / customerProject.totalCostNum) * 100)
      : 72;

    let text = `💡 **Payment vs. Progress Analysis for ${customerProject?.name || 'Your Project'}**\n\n`;
    text += `• **Physical Progress Recorded:** **${progress}% completed**\n`;
    text += `• **Total Project Value:** ${totalCost}\n`;
    text += `• **Total Amount Paid:** **${amountPaid}** (${paidPercent}% of contract)\n`;
    text += `• **Remaining Balance:** ${pendingAmount}\n\n`;

    text += `**Is this reasonable?**\n`;
    if (Math.abs(paidPercent - progress) <= 5) {
      text += `✅ **Yes, your payments closely match your physical construction progress.** In standard milestone contracts, payments are released upon completion of certified stages (e.g., slab casting, brickwork, and plastering).\n\n`;
    } else if (paidPercent > progress + 10) {
      text += `⚠️ **Caution:** You have paid approximately ${paidPercent}% while physical progress is recorded at ${progress}%. It is common practice to hold remaining disbursements until pending milestone deliverables (like woodwork or tile finishing) are physically inspected.\n\n`;
    } else {
      text += `✅ **Your payments are conservative and well-protected.** You have paid only for verified stages.\n\n`;
    }

    text += `📌 **Important Rule of Thumb:** 72% physical progress does not automatically mean exactly 72% of contract value is due on that date. Payments must always follow the **agreed contract milestone schedule** in your agreement rather than rough percentage estimates.`;

    return {
      text,
      action: { label: '💳 View Payment Records', tab: 'payments' },
      followUps: ['Show my pending project payments', 'What should I check before paying my builder?', 'Check project progress']
    };
  }

  if (
    (lower.includes('left in my') || lower.includes('prioritize') || lower.includes('remaining budget')) &&
    (lower.includes('5 lakh') || lower.includes('lakhs') || lower.includes('budget'))
  ) {
    let text = `🎯 **Homeowner Budget Prioritization Guide**\n\n`;
    text += `When working with remaining construction funds, always allocate spending in this strict order of priority:\n\n`;
    text += `**1. High Priority (Must-Have for Durability & Safety):**\n`;
    text += `• **Plumbing & Sanitary Connections:** High-grade CPVC pipes and leak-proof drainage fixtures (~₹1.2 Lakhs).\n`;
    text += `• **Core Electrical Wiring & MCB Protection:** Fire-retardant (FRLS) wiring, earthing, and main switchboard distribution (~₹1.0 Lakh).\n`;
    text += `• **Terrace & Bathroom Waterproofing:** Never compromise on 2-coat chemical waterproofing (~₹50,000).\n\n`;
    text += `**2. Medium Priority (Essential Living Comfort):**\n`;
    text += `• **Durable Vitrified Flooring:** Standard 2ft×4ft vitrified tiles for living areas & bedrooms (~₹1.2 Lakhs).\n`;
    text += `• **Main Door & External Windows:** Weatherproof UPVC 2-track sliding windows and flush doors with quality locks (~₹80,000).\n\n`;
    text += `**3. Low Priority (Can be phased post-handover):**\n`;
    text += `• Decorative false ceilings, cove profile lighting, and modular wardrobes can easily be done in a later phase without touching the core building.`;

    return {
      text,
      action: { label: '🛠️ Check Project Progress', tab: 'project-progress' },
      followUps: ['How can I reduce my construction budget?', 'How much should I budget for interiors?', 'What should I inspect before accepting handover?']
    };
  }

  // ───────────────────────────────────────────────────────────
  // 2. DELAY INQUIRY
  // ───────────────────────────────────────────────────────────
  if (lower.includes('delayed') || lower.includes('behind schedule') || lower.includes('project is delayed')) {
    let text = `⏳ **What to Do When Construction is Delayed**\n\n`;
    text += `Construction delays are common in India due to labor shortages, material supply hiccups, or monsoon rains. Here is your step-by-step action plan:\n\n`;
    text += `1. **Review Your Construction Agreement:** Look up the **completion deadline clause** and the Grace Period (usually 60–90 days).\n`;
    text += `2. **Request an Updated CPM Schedule:** Ask your builder for a revised milestone catch-up plan showing which stages will be fast-tracked.\n`;
    text += `3. **Tie Milestone Payments to Progress:** Pause any advance disbursements until delayed physical milestones are completed.\n`;
    text += `4. **Document Site Discussions:** Send follow-up meeting notes via the Build Hub Messages portal so all commitments are recorded in writing.\n`;
    text += `5. **RERA Protection:** Under RERA guidelines, builders are obligated to deliver as per registered deadlines or provide statutory interest for unexcused delays.`;

    return {
      text,
      action: { label: '💬 Message Contractor', tab: 'messages' },
      followUps: [
        'What is my current project progress?',
        'What should I check before paying my builder?',
        'Show my pending project payments'
      ]
    };
  }

  // ───────────────────────────────────────────────────────────
  // 3. NO PROJECT QUERY (Helping new customer from scratch)
  // ───────────────────────────────────────────────────────────
  if (lower.includes("don't have any project") || lower.includes('no project in build hub') || lower.includes('help me plan my house')) {
    let text = `🎉 **Welcome! You Don't Need an Active Project to Get Started!**\n\n`;
    text += `I am your **Personal AI Home Construction & Planning Advisor**. Even if you haven't started construction yet, I can help you completely plan your future home from scratch:\n\n`;
    text += `• 📐 **Land & Room Planning:** Tell me your plot size (e.g., _"30×40 plot in Hyderabad"_), and I'll suggest a custom 2BHK/3BHK floor concept.\n`;
    text += `• 💰 **Budget Estimation:** Get an accurate itemized budget for any built-up area.\n`;
    text += `• 🧱 **Material Choices:** Compare AAC blocks vs red bricks, tiles vs marble, and paint types.\n`;
    text += `• 📝 **Builder Quote Review:** Compare any quotation you received from local contractors.\n\n`;
    text += `What are your plot dimensions, city, or target construction budget?`;

    return {
      text,
      followUps: [
        'I have a 30×40 plot. Suggest a 3BHK house.',
        'Estimate construction cost for a 1,500 sq. ft. house',
        'Can I build a duplex within ₹40 lakhs?'
      ]
    };
  }

  // ───────────────────────────────────────────────────────────
  // 4. BUILDER QUOTATION ANALYSIS
  // ───────────────────────────────────────────────────────────
  if (
    lower.includes('quoted') ||
    lower.includes('quotation') ||
    lower.includes('estimate from builder') ||
    lower.includes('is that expensive') ||
    lower.includes('is that reasonable') ||
    lower.includes('is it high')
  ) {
    const budgetParsed = parseBudgetAmount(query) || { amount: 5000000, formatted: '₹50 Lakhs' };
    const areaMatch = query.match(/(\d{1,3}(?:,\d{3})+|\d{3,5})\s*(?:sq\.?\s*ft|sqft|sft)/i);
    const area = areaMatch ? parseFloat(areaMatch[1].replace(/,/g, '')) : 1800;

    const ratePerSqFt = Math.round(budgetParsed.amount / area);
    const cityRates = getRegionalRate(ctx.location);

    let text = `📝 **Builder Quotation Evaluation Report**\n\n`;
    text += `• **Quoted Total Amount:** ${budgetParsed.formatted}\n`;
    text += `• **Built-Up Area:** ${area.toLocaleString()} sq. ft.\n`;
    text += `• **Calculated Rate:** **₹${ratePerSqFt.toLocaleString()} per sq. ft.** (City: ${cityRates.city})\n\n`;

    text += `**Market Comparison:**\n`;
    text += `• **Economy Range:** ₹${cityRates.economy.rate.toLocaleString()} / sq. ft.\n`;
    text += `• **Standard Range:** ₹${cityRates.standard.rate.toLocaleString()} / sq. ft.\n`;
    text += `• **Premium Range:** ₹${cityRates.premium.rate.toLocaleString()} / sq. ft.\n\n`;

    if (ratePerSqFt <= cityRates.standard.rate + 150 && ratePerSqFt >= cityRates.standard.rate - 200) {
      text += `✅ **Verdict: FAIR & REASONABLE.** The quoted rate falls right in the standard benchmark for ${cityRates.city}.\n\n`;
    } else if (ratePerSqFt > cityRates.standard.rate + 200) {
      text += `🔍 **Verdict: ON THE HIGHER SIDE.** ₹${ratePerSqFt.toLocaleString()}/sq.ft is higher than typical standard construction. It may be justified if it includes premium finishes (e.g., Italian marble, teakwood frames, smart switches, or false ceiling).\n\n`;
    } else {
      text += `⚠️ **Verdict: VERY LOW.** While tempting, check carefully whether electrical fixtures, painting, and municipal permits are excluded, as unusually low quotes often lead to unexpected extra charges later.\n\n`;
    }

    text += `📋 **5 Questions You Must Ask Your Builder Before Signing:**\n`;
    text += `1. **What brand of cement and steel is included?** (Look for Ultratech/Birla and Fe500D TMT steel).\n`;
    text += `2. **Is bathroom waterproofing and terrace tiling covered?**\n`;
    text += `3. **What is the tile allowance per square foot?** (Ensure it is at least ₹60-70/sq.ft).\n`;
    text += `4. **Are municipal approval and electricity meter connection fees included?**\n`;
    text += `5. **What is the payment milestone breakdown?** (Never agree to large upfront advances).`;

    return {
      text,
      followUps: [
        'What should I check before paying my builder?',
        'Estimate construction cost for a 1,500 sq. ft. house',
        'Which is better for my house: AAC blocks or red bricks?'
      ]
    };
  }

  // ───────────────────────────────────────────────────────────
  // 5. COST OPTIMIZATION (Reduce budget)
  // ───────────────────────────────────────────────────────────
  if (
    lower.includes('reduce my construction budget') ||
    lower.includes('reduce construction cost') ||
    lower.includes('how can i reduce') ||
    lower.includes('save money on construction') ||
    lower.includes('cost optimization')
  ) {
    let text = `💡 **How to Reduce Your Home Construction Costs (Without Cutting Quality)**\n\n`;
    text += `Here are proven ways homeowners can save **15% to 20% on overall construction costs** safely:\n\n`;
    text += `**1. Architectural Design Efficiency (Save ~10%):**\n`;
    text += `• **Simple Geometry:** Rectangular or square house layouts require far less formwork, structural steel, and corner labor than curved or jagged walls.\n`;
    text += `• **Optimize Circulation:** Reduce long corridors and unnecessary entry foyers; open-plan living and dining areas give a spacious feel while saving on brick partition walls.\n\n`;

    text += `**2. Smart Material Substitutions (Save ~8%):**\n`;
    text += `• **AAC Blocks over Red Bricks:** AAC blocks save ~15% on wall masonry and reduce mortar consumption by 60%.\n`;
    text += `• **Vitrified Tiles over Marble:** Premium glazed vitrified tiles (₹60/sq.ft) look gorgeous and save up to ₹2.5 Lakhs compared to imported marble and polishing labor.\n`;
    text += `• **Standard Doors & Windows:** Custom window sizes add a 25% manufacturer premium. Sticking to standard sizes (4×5 ft) saves substantial money.\n\n`;

    text += `**3. Phased Finishing:**\n`;
    text += `• Complete all civil work, plumbing, tiling, and base paint now.\n`;
    text += `• Phase non-essential decorative false ceilings and custom bedroom paneling after moving in.\n\n`;
    text += `⚠️ **What NEVER to cut:** Never reduce foundation depth, cement grade (min M20 for RCC), or steel rebar quantity.`;

    return {
      text,
      followUps: [
        'Estimate construction cost for a 1,500 sq. ft. house',
        'Which is better for my house: AAC blocks or red bricks?',
        'How much should I budget for interiors?'
      ]
    };
  }

  // ───────────────────────────────────────────────────────────
  // 6. MATERIAL SELECTION (AAC vs red bricks, cement, paints)
  // ───────────────────────────────────────────────────────────
  if (
    lower.includes('aac block') ||
    lower.includes('red brick') ||
    lower.includes('which is better') ||
    lower.includes('which cement') ||
    lower.includes('flooring is suitable') ||
    lower.includes('paint is best')
  ) {
    if (lower.includes('aac') || lower.includes('brick')) {
      let text = `🧱 **Homeowner's Guide: AAC Blocks vs. Red Clay Bricks**\n\n`;
      text += `| Comparison Factor | AAC (Autoclaved Aerated Concrete) Blocks | Traditional Red Clay Bricks |\n`;
      text += `| :--- | :--- | :--- |\n`;
      text += `| **Cost & Savings** | **Saves 15–20% on overall wall cost** (requires 60% less joint mortar) | Higher mortar and labor costs due to uneven sizes |\n`;
      text += `| **Weight** | **3 times lighter** (reduces dead load on columns & beams) | Heavy; puts more dead weight on building foundations |\n`;
      text += `| **Thermal Insulation** | **Excellent:** Keeps rooms cooler in summer & warmer in winter | Absorbs and radiates outdoor heat into bedrooms |\n`;
      text += `| **Construction Speed**| Large blocks (600×200mm) enable **2× faster wall construction** | Smaller size takes longer for masons to lay |\n`;
      text += `| **Eco-Friendliness** | Made from fly ash; highly eco-friendly | Consumes top fertile soil and burns coal in kilns |\n\n`;

      text += `💡 **Our Recommendation for Homeowners:**\n`;
      text += `For modern residential villas and duplex homes, **AAC blocks are generally the smarter choice** because they reduce AC electricity bills and produce cleaner, flatter walls with minimal plastering cracks. Red bricks remain preferred only for compound walls or heritage architectural looks.`;

      return {
        text,
        followUps: [
          'Which cement is suitable for house construction?',
          'Estimate construction cost for a 1,500 sq. ft. house',
          'How can I reduce my construction budget?'
        ]
      };
    }

    if (lower.includes('cement')) {
      let text = `🏗️ **Cement Selection Guide for Homeowners**\n\n`;
      text += `• **For Foundation, Columns, Beams & Slabs:** Use **OPC 53 Grade** (Ordinary Portland Cement) or **PPC** (Portland Pozzolana Cement) from top manufacturers (UltraTech, Birla, ACC, Dalmia). OPC 53 gains early strength rapidly.\n`;
      text += `• **For Brickwork & Wall Plastering:** Use **PPC Cement**. It produces a smoother finish, creates less heat of hydration, and offers superior resistance to shrinkage cracks.\n`;
      text += `⚠️ *Quality Checklist:* Check the manufacturing week printed on the cement bag. Never accept cement older than **90 days (3 months)**, as aged cement loses up to 20% of its bonding strength.`;

      return {
        text,
        followUps: [
          'Explain RCC construction in simple words',
          'Why is curing important?',
          'What should I check before slab casting?'
        ]
      };
    }
  }

  // ───────────────────────────────────────────────────────────
  // 7. INTERIORS & CONTINGENCY
  // ───────────────────────────────────────────────────────────
  if (lower.includes('interior') || lower.includes('interiors') || lower.includes('furniture')) {
    let text = `🛋️ **Home Interior Budgeting Guide for Homeowners**\n\n`;
    text += `As a general rule, you should budget **10% to 15% of your total construction cost** for interior woodwork and lighting.\n\n`;
    text += `**Typical Budget Allocation (for a 2BHK or 3BHK home):**\n`;
    text += `• **Modular Kitchen:** ₹1.8L to ₹3.5L (Marine-ply BWP carcass + acrylic/laminate shutters, tandem drawers).\n`;
    text += `• **Master Bedroom Wardrobe:** ₹90,000 to ₹1.8L (7ft floor-to-ceiling with lofts & sliding doors).\n`;
    text += `• **Guest / Kids Wardrobes:** ₹70,000 to ₹1.2L each.\n`;
    text += `• **TV Entertainment Unit & Shoe Rack:** ₹40,000 to ₹80,000.\n`;
    text += `• **False Ceiling & LED Profile Lights:** ₹110 to ₹140 per sq. ft. of ceiling area.\n\n`;
    text += `💡 *Cost-Saving Tip:* Use commercial MR-grade plywood for dry bedroom wardrobes and waterproof BWP/BWR ply strictly for the kitchen and bathroom vanity areas.`;

    return {
      text,
      followUps: [
        'How can I reduce my construction budget?',
        'How much contingency should I keep?',
        'Compare basic and premium construction'
      ]
    };
  }

  if (lower.includes('contingency') || lower.includes('emergency fund') || lower.includes('extra money')) {
    let text = `🛡️ **Contingency Fund Planning for Home Construction**\n\n`;
    text += `You should always set aside **5% to 8% of your total construction budget as an emergency contingency fund**.\n\n`;
    text += `**Why is a contingency fund necessary?**\n`;
    text += `• **Subsoil Surprises:** Extra excavation or deeper footings if loose soil or rock is encountered.\n`;
    text += `• **Material Price Fluctuations:** Unexpected surges in steel, cement, or sand prices during the 9-12 month build.\n`;
    text += `• **Design Modifications:** Choosing a higher-grade tile or adding an extra electrical point after seeing the physical rooms.\n`;
    text += `• **Utility Hook-ups:** Permanent electricity transformer charges or municipal road-cutting fees.\n\n`;
    text += `💡 *Example:* If your house estimate is **₹40 Lakhs**, keep **₹2.5 to ₹3 Lakhs** in reserve so unexpected site expenses never stop construction work.`;

    return {
      text,
      followUps: [
        'Can I build a duplex within ₹40 lakhs?',
        'How should I pay my builder?',
        'How can I reduce my construction budget?'
      ]
    };
  }

  // ───────────────────────────────────────────────────────────
  // 8. PAYMENT SAFETY RULES
  // ───────────────────────────────────────────────────────────
  if (
    lower.includes('before paying my builder') ||
    lower.includes('how should i pay') ||
    lower.includes('pay 50%') ||
    lower.includes('milestone-based payment')
  ) {
    let text = `💳 **Safe Payment Rules for Homeowners (Never Pay 50% Upfront!)**\n\n`;
    text += `⚠️ **Golden Rule:** **Never pay 50% or large lump sums before construction begins!** Standard practice is an initial booking advance of only **5% to 10%**.\n\n`;

    text += `**Recommended Milestone Payment Schedule:**\n`;
    text += `• **Booking Advance / Mobilization:** 10% (on contract signing & site setup)\n`;
    text += `• **Plinth Level Completion:** 15% (after foundation & ground beams)\n`;
    text += `• **Ground Floor Slab Cast:** 15% (after concrete curing)\n`;
    text += `• **First Floor Slab Cast:** 15% (after upper structural frame)\n`;
    text += `• **Brickwork & Plastering Done:** 15% (after wall surfaces are ready)\n`;
    text += `• **Flooring & Plumbing Done:** 15% (after tiles & concealed pipes)\n`;
    text += `• **Painting & Fixtures:** 10% (after doors, windows & paint)\n`;
    text += `• **Retention on Handover:** **5%** (held for 30 days after moving in to ensure zero plumbing or electrical snags)\n\n`;

    text += `🔍 **What to check before releasing any milestone payment:**\n`;
    text += `1. **Physically verify the stage:** Visit the site or verify uploaded photos on Build Hub.\n`;
    text += `2. **Check curing:** Ensure concrete was cured with water for at least 10–14 days.\n`;
    text += `3. **Get signed measurement sheets:** Never pay on verbal requests; always require a formal milestone invoice.`;

    return {
      text,
      action: { label: '💳 View My Project Payments', tab: 'payments' },
      followUps: [
        'How can I reduce my construction budget?',
        'What should I inspect before accepting handover?',
        'Show my pending project payments'
      ]
    };
  }

  // ───────────────────────────────────────────────────────────
  // 9. TIMELINE ADVISORY & STAGES
  // ───────────────────────────────────────────────────────────
  if (
    lower.includes('how long does it take') ||
    lower.includes('how many months') ||
    lower.includes('months does it take') ||
    lower.includes('construction timeline')
  ) {
    let text = `📅 **Home Construction Timeline: What to Expect**\n\n`;
    text += `Constructing a standard **G+1 residential home (1,500 to 2,500 sq. ft.) typically takes 9 to 12 months** from ground excavation to final key handover.\n\n`;
    text += `**Phase-by-Phase Roadmap:**\n`;
    text += `1. **Approvals & Site Setup (Month 1):** Municipal sanction, borewell water, soil check.\n`;
    text += `2. **Foundation & Plinth (Months 2–3):** Footing excavation, anti-termite treatment, plinth beam casting.\n`;
    text += `3. **Structural RCC Frame (Months 4–5):** Columns, Ground Floor slab, First Floor slab, and curing periods.\n`;
    text += `4. **Brick Walls & Conduiting (Months 6–7):** AAC/brick walls, internal electrical grooves, plumbing pipe rough-ins.\n`;
    text += `5. **Plastering & Waterproofing (Month 8):** Sand-face plastering, bathroom ponding water test.\n`;
    text += `6. **Flooring, Windows & Doors (Month 9):** Vitrified tile laying, UPVC window installation, granite frames.\n`;
    text += `7. **Painting & Fixtures (Month 10):** Wall putty, electrical switches, taps, bathroom accessories.\n`;
    text += `8. **Snag Check & Handover (Months 11–12):** Deep cleaning, final touchups, municipal Occupancy Certificate.\n\n`;

    text += `⏳ *Factors that cause delays:* Monsoons, municipal permit backlog, custom material delays, and client design changes midway.`;

    return {
      text,
      followUps: [
        'What should I inspect before accepting handover?',
        'Why is curing important?',
        'Estimate construction cost for a 1,500 sq. ft. house'
      ]
    };
  }

  // ───────────────────────────────────────────────────────────
  // 10. HOMEOWNER QUALITY & EDUCATION
  // ───────────────────────────────────────────────────────────
  if (lower.includes('rcc') || lower.includes('reinforced cement concrete')) {
    let text = `🏗️ **RCC Explained in Simple Homeowner Language**\n\n`;
    text += `**RCC** stands for **Reinforced Cement Concrete**.\n\n`;
    text += `Think of it like bones and muscles in the human body:\n`;
    text += `• **Concrete (Sand, Cement, Stone & Water):** Like stone, it has tremendous strength to resist heavy pressing weights (**compression**), but it will snap if pulled or bent.\n`;
    text += `• **Steel Rebars (TMT Rods):** Steel has tremendous flexibility and pulling strength (**tension**).\n`;
    text += `• **When combined together:** The steel bars are placed inside wooden or steel molds (shuttering) and liquid concrete is poured around them. When it sets, the steel handles pulling forces and the concrete handles crushing forces, creating a strong structure that can withstand earthquakes and last 60+ years!`;

    return {
      text,
      followUps: [
        'Why is curing important?',
        'What should I check before slab casting?',
        'Estimate construction cost for a 1,500 sq. ft. house'
      ]
    };
  }

  if (lower.includes('curing') || lower.includes('water curing')) {
    let text = `💧 **Why Concrete Curing is Critical (Homeowner Guide)**\n\n`;
    text += `Concrete does not "dry" to become hard; it undergoes a chemical reaction called **hydration** between cement and water.\n\n`;
    text += `• **Minimum Curing Period:** Wet ponding or continuous water spraying must be maintained for **at least 10 to 14 days**.\n`;
    text += `• **Why it matters:** If concrete dries out prematurely in the sun, it loses up to **50% of its compressive strength** and develops shrinkage cracks.\n`;
    text += `• **Homeowner Tip:** On your site visit, verify that brick ponding bunds on roof slabs are constantly filled with 2 inches of standing water.`;

    return {
      text,
      followUps: [
        'What should I check before slab casting?',
        'What should I inspect before accepting handover?',
        'Check project progress'
      ]
    };
  }

  if (lower.includes('handover') || lower.includes('inspect before')) {
    let text = `🔍 **Pre-Handover Inspection Checklist for Homeowners**\n\n`;
    text += `Before accepting final keys and signing the completion certificate, conduct this walkthrough checklist:\n\n`;
    text += `1. **Plumbing & Drainage:**\n`;
    text += `   • Flush all toilets and turn on all taps simultaneously to check water pressure.\n`;
    text += `   • Pour a bucket of water on bathroom and balcony floors to ensure water flows straight to the drain without pooling.\n\n`;
    text += `2. **Doors & Windows:**\n`;
    text += `   • Open and latch every window and door to ensure smooth sliding without sticking or squeaking.\n`;
    text += `   • Check that all door keys and cylindrical locks work effortlessly.\n\n`;
    text += `3. **Electrical:**\n`;
    text += `   • Test every switch, 16A geyser/AC point, and verify the main MCB trip function.\n\n`;
    text += `4. **Tiles & Finishes:**\n`;
    text += `   • Tap gently on floor tiles with a coin; a hollow ringing sound indicates improper mortar underneath.\n\n`;
    text += `5. **Essential Documents from Builder:**\n`;
    text += `   • Municipal Occupancy Certificate (OC), electrical schematic diagram, plumbing line layout, and paint shade codes.`;

    return {
      text,
      followUps: [
        'What should I check before paying my builder?',
        'How should I pay my builder?',
        'Check project progress'
      ]
    };
  }

  // ───────────────────────────────────────────────────────────
  // 11. MUNICIPAL APPROVALS & BUILDING PERMISSIONS
  // ───────────────────────────────────────────────────────────
  if (
    lower.includes('approvals do i need') ||
    lower.includes('approvals are required') ||
    lower.includes('approvals needed') ||
    lower.includes('building permission') ||
    lower.includes('ghmc') ||
    lower.includes('ts-bpass') ||
    lower.includes('bbmp') ||
    lower.includes('cmda')
  ) {
    let targetCity = ctx.location.toLowerCase();
    if (lower.includes('hyderabad')) targetCity = 'hyderabad';
    else if (lower.includes('chennai')) targetCity = 'chennai';
    else if (lower.includes('bangalore') || lower.includes('bengaluru')) targetCity = 'bengaluru';
    else if (lower.includes('mumbai')) targetCity = 'mumbai';
    else if (lower.includes('delhi')) targetCity = 'delhi';

    const regData = REGULATORY_GUIDELINES[targetCity] || REGULATORY_GUIDELINES.hyderabad;

    let text = `🏛️ **Building Permissions & Legal Approvals (${targetCity.toUpperCase()})**\n\n`;
    text += `**Sanctioning Authority:** ${regData.body}\n\n`;
    text += `**1. Required Permissions Before Building:**\n`;
    text += `${regData.approvals}\n\n`;
    text += `**2. Standard Setbacks (Open Space to Leave Around Plot):**\n`;
    text += `• ${regData.setbacks}\n\n`;
    text += `**3. Rainwater Harvesting & Green Rules:**\n`;
    text += `• ${regData.keyRule}\n\n`;
    text += `⚠️ *Homeowner Advice:* Always ensure your architect applies through the official municipal single-window portal (like TS-bPASS in Telangana) to receive a genuine digitally signed building permit.`;

    return {
      text,
      followUps: [
        'Estimate construction cost for a 1,500 sq. ft. house',
        'Can I build a duplex within ₹40 lakhs?',
        'How long does it take to construct a G+1 house?'
      ]
    };
  }

  // ───────────────────────────────────────────────────────────
  // 12. EXISTING PROJECT APPLICATION DATA
  // ───────────────────────────────────────────────────────────
  if (
    lower.includes('current project progress') ||
    lower.includes('what is my project progress') ||
    lower.includes('my project progress')
  ) {
    const completed = customerStages.filter(s => s.status === 'Completed');
    const inProgress = customerStages.find(s => s.status === 'In Progress');
    const upcoming = customerStages.filter(s => s.status === 'Upcoming');

    let text = `📊 **Current Progress for ${customerProject?.name || 'Your Project'}**\n\n`;
    text += `Your project is currently **${customerProject?.progress || 72}% complete**.\n\n`;
    text += `**Completed Stages:**\n`;
    completed.forEach(s => { text += `✅ ${s.name}\n`; });
    if (inProgress) {
      text += `\n**Currently Active Stage:**\n🔧 **${inProgress.name}** — *In Progress*\n`;
    }
    if (upcoming.length > 0) {
      text += `\n**Upcoming Next:**\n`;
      upcoming.slice(0, 2).forEach(s => { text += `⏳ ${s.name}\n`; });
    }

    return {
      text,
      action: { label: '🛠️ View Project Progress', tab: 'project-progress' },
      followUps: ['Show my pending project payments', 'When will it be completed?', 'View project documents']
    };
  }

  if (
    lower.includes('pending project payments') ||
    lower.includes('pending payment') ||
    lower.includes('payment details') ||
    lower.includes('show my payments')
  ) {
    const paidCount = customerPayments.filter(p => p.status === 'Paid').length;
    const payPercent = customerProject?.totalCostNum > 0
      ? Math.round((customerProject.amountPaidNum / customerProject.totalCostNum) * 100)
      : 72;

    let text = `💳 **Payment Summary for ${customerProject?.name || 'Your Project'}**\n\n`;
    text += `• **Total Project Value:** ${customerProject?.totalCost || '₹45,00,000'}\n`;
    text += `• **Amount Paid to Date:** **${customerProject?.amountPaid || '₹32,50,000'}** (${payPercent}%)\n`;
    text += `• **Pending Remaining Balance:** **${customerProject?.pendingAmount || '₹12,50,000'}**\n`;
    text += `• **Completed Milestone Invoices:** ${paidCount} payments verified\n\n`;
    text += `You can download formal tax receipts and inspect milestone certificates in the **Payments** tab.`;

    return {
      text,
      action: { label: '💳 Go to Payments Portal', tab: 'payments' },
      followUps: ['What is my current project progress?', 'What should I check before paying my builder?', 'View project documents']
    };
  }

  // ───────────────────────────────────────────────────────────
  // 13. BUDGET ESTIMATION BY SQUARE FOOTAGE
  // ───────────────────────────────────────────────────────────
  const isBudgetByArea = (
    lower.includes('estimate construction cost') ||
    lower.includes('cost of building a') ||
    lower.includes('cost for a') ||
    lower.includes('compare basic and premium')
  );

  if (isBudgetByArea) {
    const areaMatch = query.match(/(\d{1,3}(?:,\d{3})+|\d{3,5})\s*(?:sq\.?\s*ft|sqft|sft)/i);
    const area = areaMatch ? parseFloat(areaMatch[1].replace(/,/g, '')) : 1500;

    const isCompare = lower.includes('compare') || lower.includes('difference between basic');

    let tier = ctx.qualityTier || 'standard';
    if (lower.includes('basic') || lower.includes('economy')) tier = 'economy';
    if (lower.includes('premium') || lower.includes('luxury')) tier = 'premium';

    const costData = estimateConstructionCost({
      builtUpArea: area,
      city: ctx.location,
      qualityTier: tier
    });

    const reg = getRegionalRate(ctx.location);

    let text = `💰 **Estimated House Construction Budget**\n\n`;
    text += `**Project Overview:**\n`;
    text += `• **Location:** ${costData.city}\n`;
    text += `• **Proposed Built-Up Area:** ${area.toLocaleString()} sq. ft.\n`;
    text += `• **Quality Category:** ${tier === 'economy' ? 'Basic' : (tier === 'premium' ? 'Premium' : 'Standard')}\n`;
    text += `• **Benchmarked Rate:** ₹${costData.ratePerSqFt.toLocaleString()} per sq. ft.\n\n`;

    text += `| Component | Estimated Amount | What's Included |\n`;
    text += `| :--- | :--- | :--- |\n`;
    text += `| **Civil & Structural Work** | ₹${Math.round(costData.baseCost * 0.48).toLocaleString()} | Foundation, columns, beams, slab & steel |\n`;
    text += `| **Brickwork & Plastering** | ₹${Math.round(costData.baseCost * 0.14).toLocaleString()} | AAC / red brick walls with smooth plaster |\n`;
    text += `| **Flooring & Wall Tiling** | ₹${Math.round(costData.baseCost * 0.10).toLocaleString()} | Vitrified floor tiles, bathroom anti-skid tiles |\n`;
    text += `| **Electrical & Plumbing** | ₹${Math.round(costData.baseCost * 0.14).toLocaleString()} | Concealed pipes, copper wiring, standard fittings |\n`;
    text += `| **Doors & Windows** | ₹${Math.round(costData.baseCost * 0.06).toLocaleString()} | Main door frame, bedroom flush doors, UPVC windows |\n`;
    text += `| **Painting & Waterproofing**| ₹${Math.round(costData.baseCost * 0.05).toLocaleString()} | 2-coat putty, primer & premium acrylic paint |\n`;
    text += `| **Emergency Contingency (5%)**| ₹${costData.contingency.toLocaleString()} | Buffer for unforeseen site expenses |\n`;
    text += `| **Total Estimated Budget** | **₹${costData.totalCost.toLocaleString()} (~₹${(costData.totalCost / 100000).toFixed(2)} Lakhs)** | Complete turnkey construction |\n\n`;

    if (isCompare) {
      text += `🔍 **Basic vs. Standard vs. Premium Comparison:**\n`;
      text += `• **Basic (~₹${reg.economy.rate}/sq.ft):** Simple red bricks, basic ceramic tiles (₹35/sq.ft), local flush doors, 2-track aluminum windows, standard electrical switches.\n`;
      text += `• **Standard (~₹${reg.standard.rate}/sq.ft):** AAC blocks, 2×4 vitrified tiles (₹60-75/sq.ft), teak wood main frame, UPVC windows, Jaquar/Cera fittings, acrylic emulsion paint.\n`;
      text += `• **Premium (~₹${reg.premium.rate}/sq.ft):** Italian marble / wooden flooring, smart home automation, high-end Grohe/Kohler fixtures, acoustic UPVC/Schüco windows, designer exterior facade.\n\n`;
    }

    text += `📌 **Important Distinction for Homeowners:**\n`;
    text += `• **Plot Area:** The total land you own.\n`;
    text += `• **Built-Up Area:** The actual constructed area across all floors (typically 1.2× to 1.8× the plot area for multi-floor homes).\n`;
    text += `• **Carpet Area:** The usable room space inside the walls where you can lay a carpet (~75-80% of built-up area).`;

    return {
      text,
      followUps: [
        'How much should I budget for interiors?',
        'How can I reduce my construction budget?',
        'Which is better for my house: AAC blocks or red bricks?'
      ]
    };
  }

  // ───────────────────────────────────────────────────────────
  // 14. PERSONALIZED HOME PLANNING & LAYOUT CONCEPTS
  // ───────────────────────────────────────────────────────────
  const hasPlotSize = parsePlotDimensions(query) !== null || (ctx.plotDimensions && (lower.includes('plot') || lower.includes('duplex') || lower.includes('3bhk') || lower.includes('2bhk') || lower.includes('revise')));
  const isHomePlanning = hasPlotSize || lower.includes('suggest a 3bhk') || lower.includes('suggest a 2bhk') || lower.includes('can i build a duplex');

  if (isHomePlanning) {
    const plot = ctx.plotDimensions || { length: 30, width: 40, area: 1200, formatted: '30 ft × 40 ft (1,200 sq. ft.)' };
    const plotArea = plot.area || 1200;
    const is2BHK = lower.includes('2bhk') || ctx.bedrooms === '2BHK';
    const isSingleFloor = lower.includes('single') || lower.includes('ground floor only') || plotArea <= 1000;

    const groundCoverageRatio = 0.68;
    const groundFloorArea = Math.round(plotArea * groundCoverageRatio);
    const firstFloorArea = isSingleFloor ? 0 : Math.round(groundFloorArea * 0.90);
    const totalBuiltUp = isSingleFloor ? groundFloorArea : (groundFloorArea + firstFloorArea);

    const budgetParsed = ctx.budget ? ctx.budget.amount : (isSingleFloor ? 2800000 : 4000000);
    const costEstimate = estimateConstructionCost({
      builtUpArea: totalBuiltUp,
      city: ctx.location,
      qualityTier: ctx.qualityTier
    });

    let text = `🏡 **Personalized Home Planning & Space Advisory**\n\n`;
    text += `**Your Land & Requirements:**\n`;
    text += `• **Plot Size:** ${plot.formatted || `${plot.length} ft × ${plot.width} ft`} (~${plotArea.toLocaleString()} sq. ft.)\n`;
    text += `• **Location:** ${ctx.location}\n`;
    text += `• **Configuration:** ${is2BHK ? 'Compact 2BHK Home' : (isSingleFloor ? '3BHK Single Floor' : '3BHK Duplex Home')}\n`;
    text += `• **Estimated Built-Up Area:** ~**${totalBuiltUp.toLocaleString()} sq. ft.** (allowing for legal setbacks & air ventilation)\n`;
    text += `• **Target Budget:** ${ctx.budget ? ctx.budget.formatted : (is2BHK ? '₹30-35 Lakhs' : '₹40 Lakhs')}\n\n`;

    if (is2BHK || isSingleFloor) {
      text += `📐 **Suggested Ground Floor Layout (~${groundFloorArea} sq. ft.):**\n`;
      text += `• **Car / 2-Wheeler Parking:** 10 ft × 15 ft with independent gate\n`;
      text += `• **Living & Dining Room:** 13 ft × 15 ft (spacious open concept)\n`;
      text += `• **Kitchen:** 8 ft × 9 ft (East/South-East orientation for healthy sunlight)\n`;
      text += `• **Master Bedroom:** 11 ft × 12 ft with attached bathroom (6 ft × 4 ft)\n`;
      text += `• **Second Bedroom:** 10 ft × 11 ft with wardrobe niche\n`;
      text += `• **Common Bathroom:** 6 ft × 4.5 ft\n`;
      text += `• **Utility / Washing Space:** 4 ft wide at rear setback\n\n`;
    } else {
      text += `📐 **Suggested Duplex Layout (~${totalBuiltUp.toLocaleString()} sq. ft.):**\n`;
      text += `**Ground Floor (~${groundFloorArea} sq. ft.):**\n`;
      text += `• Covered parking porch (11 ft × 15 ft)\n`;
      text += `• Welcoming living hall (13 ft × 15 ft)\n`;
      text += `• Dining area + modular kitchen (10 ft × 12 ft)\n`;
      text += `• Elderly-friendly Bedroom 1 (11 ft × 12 ft) with common bath\n`;
      text += `• Internal staircase with storage space underneath\n\n`;

      text += `**First Floor (~${firstFloorArea} sq. ft.):**\n`;
      text += `• Master Bedroom 2 (13 ft × 13 ft) with attached bath & private balcony\n`;
      text += `• Children's Bedroom 3 (11 ft × 12 ft) with study desk space\n`;
      text += `• Cozy family seating lounge (11 ft × 10 ft)\n\n`;
    }

    text += `💰 **Budget & Cost Feasibility:**\n`;
    text += `• Standard construction in **${ctx.location}** costs ~**₹${costEstimate.ratePerSqFt}/sq.ft.**\n`;
    text += `• Total estimated construction cost: **₹${(costEstimate.totalCost / 100000).toFixed(2)} Lakhs**.\n`;

    if (budgetParsed < costEstimate.minCost) {
      text += `💡 **Budget Optimization Advice:** Since your budget of ₹${(budgetParsed / 100000).toFixed(1)}L is slightly below the estimated ₹${(costEstimate.totalCost / 100000).toFixed(1)}L, you can easily bridge the gap by: (1) trimming total built-up area to ~${Math.round(budgetParsed / 2050)} sq.ft, (2) opting for AAC blocks, and (3) phasing decorative false ceiling work.\n\n`;
    } else {
      text += `✅ **Feasibility:** Your budget is realistic and comfortably covers standard quality civil construction, tiles, plumbing, and painting!\n\n`;
    }

    text += `⚠️ *Note for Homeowners:* This is a conceptual space arrangement. Your local municipal authority requires set-backs for ventilation and fire safety before sanctioning final architectural blueprints.`;

    return {
      text,
      followUps: [
        'How can I reduce my construction budget?',
        'Estimate construction cost for a 1,500 sq. ft. house',
        'Which is better for my house: AAC blocks or red bricks?'
      ]
    };
  }

  // ───────────────────────────────────────────────────────────
  // 15. DEFAULT HOMEOWNER FRIENDLY ADVISORY
  // ───────────────────────────────────────────────────────────
  let text = `Hello ${firstName}! 👋 I'm your **Build Hub AI Home Construction & Planning Advisor**.\n\n`;
  text += `I can guide you through every aspect of building and monitoring a home:\n\n`;
  text += `• 🏡 **Plan Your Dream Home:** Land layouts for 30×40, 25×40, or any plot\n`;
  text += `• 💰 **Budget Estimation:** Accurate turnkey cost estimates by city & specifications\n`;
  text += `• 📝 **Builder Quote Review:** Compare contractor rates and identify missing items\n`;
  text += `• 🧱 **Material Choices:** Simple guidance on AAC blocks, cement, flooring & paints\n`;
  text += `• 💳 **Payment & Timeline Safety:** Milestone schedules, contingency, and inspection checklists\n`;
  text += `• 📊 **Your Active Project:** Real-time updates on your **${customerProject?.name || 'Home'}**\n\n`;
  text += `How can I help you today?`;

  return {
    text,
    followUps: [
      'What is my current project progress?',
      'I have a 30×40 plot. Suggest a 3BHK house.',
      'Estimate construction cost for a 1,500 sq. ft. house',
      'Which is better for my house: AAC blocks or red bricks?'
    ]
  };
}
