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
  generateConstructionTimeline,
  calculateRemainingProjectAnalysis
} from './calculationEngine.js';

// ─────────────────────────────────────────────────────────────
// CONVERSATION CONTEXT MANAGER (Multi-Turn State)
// Retains plot dimensions, locations, budgets, and project focus
// across sequential conversational messages.
// ─────────────────────────────────────────────────────────────

export class ConversationContext {
  constructor() {
    this.state = {
      plotDimensions: null,     // { length, width, area, formatted }
      location: 'Hyderabad',
      buildingType: '3BHK Duplex',
      floors: 'G+1',
      budget: null,             // { amount, formatted }
      parking: '1 Car',
      qualityTier: 'standard',
      focusedProjectName: null
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

    if (lower.includes('1bhk')) this.state.buildingType = '1BHK House';
    else if (lower.includes('2bhk')) this.state.buildingType = '2BHK Residence';
    else if (lower.includes('3bhk')) this.state.buildingType = '3BHK Duplex';
    else if (lower.includes('4bhk')) this.state.buildingType = '4BHK Villa';
    else if (lower.includes('commercial')) this.state.buildingType = 'Commercial Building';

    if (lower.includes('g+2') || lower.includes('3 floor')) this.state.floors = 'G+2';
    else if (lower.includes('g+1') || lower.includes('duplex') || lower.includes('2 floor')) this.state.floors = 'G+1';
    else if (lower.includes('ground floor only') || lower.includes('single floor')) this.state.floors = 'Ground Floor Only';

    if (lower.includes('economy') || lower.includes('budget finish')) this.state.qualityTier = 'economy';
    else if (lower.includes('premium') || lower.includes('luxury')) this.state.qualityTier = 'premium';

    if (lower.includes('residential villa')) this.state.focusedProjectName = 'Residential Villa';
    else if (lower.includes('office building')) this.state.focusedProjectName = 'Office Building';
    else if (lower.includes('commercial space')) this.state.focusedProjectName = 'Commercial Space';

    return this.state;
  }
}

// ─────────────────────────────────────────────────────────────
// INTENT ROUTER & AI RESPONSE GENERATOR
// Routes queries to Domain 1 (Build Hub Data), Domain 2
// (Civil Engineering & Construction Intelligence), or Mixed.
// ─────────────────────────────────────────────────────────────

export function routeAndGenerateResponse({
  message,
  builderName = 'A Sai Sri Vinay',
  myProjects = [],
  customerRequests = [],
  myCustomers = [],
  context = new ConversationContext(),
  setCurrentTab
}) {
  const query = message.trim();
  const lower = query.toLowerCase();

  // Update contextual memory with any parameters extracted from this turn
  const ctx = context.updateFromQuery(query);

  // ───────────────────────────────────────────────────────────
  // CATEGORY 1: MIXED QUERY (Project Data + AI Estimation)
  // E.g.: "Estimate the remaining work cost for Residential Villa using its actual recorded progress and financial data"
  // ───────────────────────────────────────────────────────────
  const isMixedQuery = (
    (lower.includes('residential villa') || lower.includes('office building') || lower.includes('commercial space') || lower.includes('my project') || lower.includes('existing project')) &&
    (lower.includes('remaining') || lower.includes('estimate the remaining') || lower.includes('forecast') || lower.includes('balance cost') || lower.includes('budget variance'))
  );

  if (isMixedQuery) {
    const targetProject = myProjects.find(p => 
      lower.includes((p.name || '').toLowerCase())
    ) || myProjects[0];

    if (targetProject) {
      const analysis = calculateRemainingProjectAnalysis(targetProject);
      let text = `🔍 **Build Hub Project Intelligence + AI Cost Forecast**\n\n`;
      text += `**Project:** ${analysis.projectName} (${analysis.location})\n`;
      text += `• **Client:** ${analysis.customer}\n`;
      text += `• **Current Recorded Progress:** ${analysis.progressPercent}%\n`;
      text += `• **Allocated Total Budget:** ${analysis.totalBudget}\n`;
      text += `• **Actual Expenditure Incurred:** ${analysis.spent}\n`;
      text += `• **Remaining Budget Balance:** ${analysis.remainingBudget}\n`;
      text += `• **Financial Health:** ${analysis.projectedVarianceFormatted}\n\n`;

      text += `📌 **Pending Stages to Handover (${analysis.remainingPercent}% remaining work):**\n`;
      if (analysis.incompleteMilestones && analysis.incompleteMilestones.length > 0) {
        analysis.incompleteMilestones.forEach(m => {
          text += `• ${m.name} (Scheduled: ${m.date || 'Pending'})\n`;
        });
      } else {
        text += `• Interior woodwork, electrical trim & municipal occupancy testing\n`;
      }

      text += `\n💡 **AI Construction Advisory:** Based on current material price indices and remaining completion of ${analysis.remainingPercent}%, your cost burn-rate is stable. Ensure contractor billing for carpentry doesn't exceed allocated BOQ lines.`;

      return {
        text,
        action: { label: `📂 View ${targetProject.name} Details`, tab: 'my-projects' },
        followUps: [
          'Update project progress',
          'Calculate materials for remaining work',
          'Generate project reports'
        ]
      };
    }
  }

  // ───────────────────────────────────────────────────────────
  // CATEGORY 2: MATERIAL QUANTITY ESTIMATION
  // Must be checked before general planning so questions like
  // "How many cement bags are needed for a 1,500 sq. ft. house?"
  // route directly to material calculations!
  // ───────────────────────────────────────────────────────────
  const isMaterialQuery = (
    lower.includes('cement') ||
    lower.includes('steel') ||
    lower.includes('sand') ||
    lower.includes('aggregate') ||
    lower.includes('bricks') ||
    lower.includes('aac block') ||
    lower.includes('how many bags') ||
    lower.includes('material quantity') ||
    lower.includes('calculate material')
  );

  if (isMaterialQuery) {
    const areaMatch = query.match(/(\d{1,3}(?:,\d{3})+|\d{3,5})\s*(?:sq\.?\s*ft|sqft|sft)/i);
    const area = areaMatch ? parseFloat(areaMatch[1].replace(/,/g, '')) : (ctx.plotDimensions?.area ? Math.round(ctx.plotDimensions.area * 1.5) : 1500);

    const materials = estimateMaterialQuantities(area, `${ctx.buildingType || 'Residential'} (~${area} sq. ft.)`);

    let text = `🧱 **Material Quantity Estimation Engine**\n\n`;
    text += `**Scope:** ${area.toLocaleString()} sq. ft. Built-Up Residential Area (${ctx.location})\n`;
    text += `**Methodology:** Indian Standards (IS 456:2000, CPWD Standard Analysis of Rates) practical civil engineering thumb rules.\n\n`;

    text += `| Material | Estimated Quantity | Unit | Engineering Basis |\n`;
    text += `| :--- | :--- | :--- | :--- |\n`;
    materials.items.forEach(item => {
      text += `| **${item.material}** | ${item.quantity} | ${item.unit} | ${item.basis} |\n`;
    });

    text += `\n📊 **Procurement & Storage Best Practices:**\n`;
    text += `1. **Cement:** Procure in phased batches (50-100 bags) to prevent moisture hydration and air-setting. Store on wooden pallets 150mm off the floor.\n`;
    text += `2. **TMT Steel:** Inspect mill test certificates for **Fe500D** (ensuring high elongation > 16% for seismic safety). Store covered to prevent heavy scaling.\n`;
    text += `3. **Silt Content in Sand:** Ensure silt content in sand/M-sand is < 3% by volume to guarantee proper concrete bonding.\n\n`;
    text += `⚠️ *Note:* Quantities shown include standard 5-8% construction wastage. Actual rebar tonnage must be finalized from certified structural BBS (Bar Bending Schedule).`;

    return {
      text,
      followUps: [
        'Estimate construction cost for this area',
        'Explain M20 vs M25 concrete',
        'Prepare construction schedule',
        'Show my ongoing projects'
      ]
    };
  }

  // ───────────────────────────────────────────────────────────
  // CATEGORY 3: BUDGET & COST ESTIMATION ENGINE
  // E.g.: "Estimate the cost of a 2,000 sq. ft. house in Hyderabad"
  // ───────────────────────────────────────────────────────────
  const isCostEstimation = (
    (lower.includes('estimate the cost') || lower.includes('estimate cost') || lower.includes('cost of a') || lower.includes('rate per sq') || lower.includes('how much to build') || lower.includes('construction cost for a')) &&
    (lower.includes('sq ft') || lower.includes('sqft') || lower.includes('house') || lower.includes('building') || lower.includes('hyderabad') || lower.includes('bangalore') || lower.includes('chennai') || lower.includes('mumbai') || lower.includes('delhi'))
  );

  if (isCostEstimation) {
    const areaMatch = query.match(/(\d{1,3}(?:,\d{3})+|\d{3,5})\s*(?:sq\.?\s*ft|sqft|sft)/i);
    const area = areaMatch ? parseFloat(areaMatch[1].replace(/,/g, '')) : 2000;

    let tier = 'standard';
    if (lower.includes('economy') || lower.includes('low cost')) tier = 'economy';
    if (lower.includes('premium') || lower.includes('luxury')) tier = 'premium';

    const costData = estimateConstructionCost({
      builtUpArea: area,
      city: ctx.location,
      qualityTier: tier
    });

    let text = `💰 **Construction Cost & Budget Estimation**\n\n`;
    text += `**Project Specification:**\n`;
    text += `• **Built-Up Area:** ${area.toLocaleString()} sq. ft.\n`;
    text += `• **Location:** ${costData.city} (Municipal Zone: ${costData.authority})\n`;
    text += `• **Quality Tier:** ${costData.qualityTier} — ${costData.tierLabel}\n`;
    text += `• **Benchmarked Rate:** **₹${costData.ratePerSqFt.toLocaleString()} per sq. ft.**\n\n`;

    text += `**Financial Summary:**\n`;
    text += `• **Base Construction Cost:** ₹${costData.baseCost.toLocaleString()} (~₹${(costData.baseCost / 100000).toFixed(2)} Lakhs)\n`;
    text += `• **Unforeseen Contingency Allowance (5%):** ₹${costData.contingency.toLocaleString()} (~₹${(costData.contingency / 100000).toFixed(2)} Lakhs)\n`;
    text += `• **Estimated Total Project Cost:** **₹${costData.totalCost.toLocaleString()} (~₹${(costData.totalCost / 100000).toFixed(2)} Lakhs)**\n`;
    text += `• **Realistic Range:** ₹${(costData.minCost / 100000).toFixed(2)}L to ₹${(costData.maxCost / 100000).toFixed(2)}L\n\n`;

    text += `📋 **Itemized Cost Breakdown Table:**\n\n`;
    text += `| Trade / Work Category | Share | Estimated Cost | Scope Coverage |\n`;
    text += `| :--- | :--- | :--- | :--- |\n`;
    costData.breakdown.forEach(item => {
      text += `| **${item.category}** | ${item.share} | ₹${item.amount.toLocaleString()} | ${item.description} |\n`;
    });

    text += `\n📌 **Key Cost Exclusions to Account For:**\n`;
    text += `• Municipal permit fees, TS-bPASS/local betterment charges, and architect design fees (~3-5%)\n`;
    text += `• Electricity permanent 3-phase meter & water borewell drilling/submersible pump\n`;
    text += `• Interior loose furniture, false ceiling modular lighting, and HVAC appliances\n\n`;
    text += `💡 *Cost Advice:* Standard quality with AAC blocks and UPVC windows provides the highest durability-to-cost ratio.`;

    return {
      text,
      followUps: [
        'How can I reduce construction costs?',
        'Calculate materials for this area',
        'Prepare construction schedule',
        'What approvals are needed?'
      ]
    };
  }

  // ───────────────────────────────────────────────────────────
  // CATEGORY 4: SPECIFIC PROJECT PROGRESS (Build Hub Database)
  // E.g.: "Show the current progress of Residential Villa."
  // ───────────────────────────────────────────────────────────
  const isSpecificProject = myProjects.find(p => lower.includes(p.name.toLowerCase()));
  if (isSpecificProject && (lower.includes('progress') || lower.includes('status') || lower.includes('show') || lower.includes('how is'))) {
    let text = `📊 **Current Progress: ${isSpecificProject.name}**\n\n`;
    text += `• **Client:** ${isSpecificProject.customer}\n`;
    text += `• **Location:** ${isSpecificProject.location}\n`;
    text += `• **Completion Status:** **${isSpecificProject.progress}% Completed**\n`;
    text += `• **Project Type:** ${isSpecificProject.type || 'Residential'}\n`;
    text += `• **Allocated Budget:** ${isSpecificProject.budget}\n`;
    text += `• **Actual Spent:** ${isSpecificProject.spent}\n`;
    text += `• **Target Handover Deadline:** ${isSpecificProject.deadline}\n\n`;

    if (isSpecificProject.milestones && isSpecificProject.milestones.length > 0) {
      text += `**Milestone Tracker:**\n`;
      isSpecificProject.milestones.forEach(m => {
        text += `${m.completed ? '✅' : '⏳'} **${m.name}** — ${m.completed ? 'Completed' : 'In Progress'} (${m.date})\n`;
      });
    }

    return {
      text,
      action: { label: `📂 View ${isSpecificProject.name} Details`, tab: 'my-projects' },
      followUps: [
        'Update project progress',
        'Estimate the remaining work cost for Residential Villa',
        'Generate project reports'
      ]
    };
  }

  // ───────────────────────────────────────────────────────────
  // CATEGORY 5: BUDGET FEASIBILITY (Can I build X with budget Y?)
  // E.g.: "My budget is ₹40 lakhs. Can I build a duplex?"
  // ───────────────────────────────────────────────────────────
  const isBudgetFeasibility = (
    (lower.includes('can i build') || lower.includes('is it possible to build') || (lower.includes('budget') && lower.includes('duplex'))) &&
    (ctx.budget !== null || parseBudgetAmount(query) !== null)
  );

  if (isBudgetFeasibility) {
    const budgetObj = ctx.budget || parseBudgetAmount(query) || { amount: 4000000, formatted: '₹40 Lakhs' };
    const regRate = getRegionalRate(ctx.location).standard.rate; // e.g. 2050
    const maxAffordableBuiltUp = Math.round(budgetObj.amount / regRate);
    const comfortableArea = Math.round(maxAffordableBuiltUp * 0.92);

    let text = `💰 **Budget Feasibility Analysis: Duplex Construction**\n\n`;
    text += `**Budget:** ${budgetObj.formatted} | **Location:** ${ctx.location}\n`;
    text += `**Current Standard Construction Benchmark:** ~₹${regRate.toLocaleString()} per sq. ft.\n\n`;

    text += `✅ **Feasibility Verdict:** **YES, you can build a high-quality duplex!**\n\n`;
    text += `• **Maximum Affordable Built-Up Area:** ~**${maxAffordableBuiltUp.toLocaleString()} sq. ft.** (or ~${comfortableArea.toLocaleString()} sq. ft. including 8% buffer for approvals & contingency).\n`;
    text += `• **Recommended Specification:** Standard 3BHK Duplex (G+1) with ~900 sq.ft on Ground Floor and ~850 sq.ft on First Floor.\n`;
    text += `• **Included in this budget:** Full RCC structure, brickwork, vitrified tiles (₹60/sq.ft), UPVC 2.5-track windows, plumbing (CPVC/PVC), standard Jaquar/Cera sanitary fixtures, and 2-coat emulsion paint.\n\n`;

    text += `💡 **Recommendations to guarantee budget safety:**\n`;
    text += `1. Avoid heavy cantilevers or curved balconies to control formwork costs.\n`;
    text += `2. Use AAC blocks instead of wire-cut clay bricks to save ₹1.5 - ₹2 Lakhs on mortar & plastering.\n`;
    text += `3. Reserve ₹2 Lakhs separately for municipal plan sanction fees and permanent electricity connection.`;

    return {
      text,
      followUps: [
        'Suggest a 3BHK house plan',
        'Calculate materials for this duplex',
        'How can I reduce construction costs?'
      ]
    };
  }

  // ───────────────────────────────────────────────────────────
  // CATEGORY 6: LAND PLANNING & HOUSE LAYOUT CONCEPTS
  // E.g.: "I have a 30×40 ft plot. Suggest a 3BHK duplex house plan with parking"
  // E.g.: "Suggest a house plan for a 40×60 ft plot with parking and a home office"
  // ───────────────────────────────────────────────────────────
  const hasDimensions = parsePlotDimensions(query) !== null || (ctx.plotDimensions && (lower.includes('plan') || lower.includes('layout') || lower.includes('suggest') || lower.includes('plot')));
  const isLandPlanning = hasDimensions && (
    lower.includes('plan') ||
    lower.includes('layout') ||
    lower.includes('plot') ||
    lower.includes('house') ||
    lower.includes('duplex') ||
    lower.includes('3bhk') ||
    lower.includes('2bhk') ||
    lower.includes('4bhk') ||
    lower.includes('ground floor') ||
    lower.includes('office') ||
    lower.includes('vastu')
  );

  if (isLandPlanning) {
    const plot = ctx.plotDimensions || { length: 30, width: 40, area: 1200, formatted: '30 ft × 40 ft (1,200 sq. ft.)' };
    const plotArea = plot.area || (plot.length && plot.width ? plot.length * plot.width : 1200);
    
    // Setbacks & ground coverage ratio (typically 65-72%)
    const groundCoverageRatio = plotArea > 2000 ? 0.60 : 0.68;
    const groundFloorBuiltUp = Math.round(plotArea * groundCoverageRatio);
    const firstFloorBuiltUp = Math.round(groundFloorBuiltUp * 0.90);
    const totalBuiltUp = groundFloorBuiltUp + firstFloorBuiltUp;

    const budgetParsed = ctx.budget ? ctx.budget.amount : (plotArea > 2000 ? 7500000 : 4500000);
    const estimatedCostRange = estimateConstructionCost({
      builtUpArea: totalBuiltUp,
      city: ctx.location,
      qualityTier: ctx.qualityTier
    });

    const hasHomeOffice = lower.includes('office') || lower.includes('study');

    let text = `📐 **Preliminary Land & Architectural Concept Plan**\n\n`;
    text += `**Project Overview & Area Constraints:**\n`;
    text += `• **Plot Dimensions:** ${plot.formatted || `${plot.length} ft × ${plot.width} ft`}\n`;
    text += `• **Total Plot Area:** ${plotArea.toLocaleString()} sq. ft. (~${(plotArea / 9).toFixed(1)} sq. yards)\n`;
    text += `• **Building Type:** ${ctx.buildingType} (${ctx.floors})\n`;
    text += `• **Estimated Ground Floor Area:** ~${groundFloorBuiltUp.toLocaleString()} sq. ft. (accounting for standard setbacks)\n`;
    text += `• **Estimated Total Built-Up Area:** ~${totalBuiltUp.toLocaleString()} sq. ft.\n`;
    text += `• **Target Budget:** ${ctx.budget ? ctx.budget.formatted : (plotArea > 2000 ? '₹75.00 Lakhs' : '₹45.00 Lakhs')}\n\n`;

    text += `🏛️ **Preliminary Ground Floor Space Allocation (~${groundFloorBuiltUp.toLocaleString()} sq. ft.):**\n`;
    text += `• **Covered Parking Porch:** ${plotArea > 2000 ? '14 ft × 20 ft (2 Cars Parking)' : '11 ft × 16 ft (1 Car + 2-Wheeler)'}\n`;
    if (hasHomeOffice) {
      text += `• **Dedicated Home Office / Study:** 12 ft × 12 ft with independent client entrance\n`;
    }
    text += `• **Foyer & Formal Living Room:** ${plotArea > 2000 ? '16 ft × 18 ft' : '14 ft × 16 ft'} (North-East entry as per Vastu)\n`;
    text += `• **Dining Space:** 12 ft × 12 ft (centrally located)\n`;
    text += `• **Modular Kitchen + Utility/Pantry:** 11 ft × 10 ft (South-East / Agneya corner)\n`;
    text += `• **Guest Bedroom (Bedroom 1):** 12 ft × 12 ft with wardrobe niche & attached washroom\n`;
    text += `• **Internal Dog-Legged Staircase:** 7 ft width with underneath storage\n\n`;

    text += `🏢 **Preliminary First Floor Space Allocation (~${firstFloorBuiltUp.toLocaleString()} sq. ft.):**\n`;
    text += `• **Master Bedroom Suite:** ${plotArea > 2000 ? '16 ft × 15 ft' : '14 ft × 13 ft'} with walk-in dressing & luxury attached bath (9 ft × 6 ft)\n`;
    text += `• **Children / Secondary Bedroom:** 13 ft × 12 ft with attached bathroom\n`;
    if (plotArea > 2000) {
      text += `• **Guest / Third Bedroom:** 12 ft × 12 ft with balcony\n`;
    }
    text += `• **Upper Family Lounge:** 14 ft × 12 ft overlooking the front terrace\n`;
    text += `• **Front Sit-Out Balcony:** 12 ft × 6 ft with safety glass railing\n\n`;

    text += `💰 **Feasibility & Construction Cost Evaluation:**\n`;
    text += `• At standard regional rates in **${ctx.location}** (~₹${estimatedCostRange.ratePerSqFt}/sq.ft), estimated base construction cost is **₹${(estimatedCostRange.totalCost / 100000).toFixed(2)} Lakhs**.\n\n`;

    text += `⚠️ *Engineering Disclaimer:* This is a preliminary spatial concept. Actual buildable footprint and room dimensions must strictly adhere to municipal setbacks (${getRegionalRate(ctx.location).authority}), site orientation, soil bearing capacity, and sanctioned architectural working drawings.`;

    return {
      text,
      followUps: [
        'Calculate materials for this plan',
        'Itemized budget breakdown',
        'Prepare construction schedule',
        'How can I reduce construction costs?'
      ]
    };
  }

  // ───────────────────────────────────────────────────────────
  // CATEGORY 7: CONSTRUCTION PROJECT SCHEDULING
  // E.g.: "Prepare a construction timeline for a G+1 building"
  // ───────────────────────────────────────────────────────────
  const isScheduling = (
    lower.includes('schedule') ||
    lower.includes('timeline') ||
    lower.includes('duration') ||
    lower.includes('how long') ||
    lower.includes('stages of construction')
  );

  if (isScheduling) {
    const areaMatch = query.match(/(\d{1,3}(?:,\d{3})+|\d{3,5})\s*(?:sq\.?\s*ft|sqft|sft)/i);
    const area = areaMatch ? parseFloat(areaMatch[1].replace(/,/g, '')) : 2000;
    const timeline = generateConstructionTimeline(area, ctx.floors);

    let text = `🗓️ **Master Construction Timeline & Scheduling Breakdown**\n\n`;
    text += `**Project:** Residential ${ctx.floors || 'G+1'} Construction (~${area.toLocaleString()} sq. ft.)\n`;
    text += `**Estimated Total Execution Duration:** **${timeline.totalEstimatedDuration}** (${timeline.workingDays})\n\n`;

    text += `| Stage # | Construction Phase | Expected Duration | Dependencies & Safe Overlap |\n`;
    text += `| :--- | :--- | :--- | :--- |\n`;
    timeline.stages.forEach(st => {
      text += `| **Stage ${st.stage}** | ${st.title} | ${st.duration} | ${st.overlap} (${st.notes}) |\n`;
    });

    text += `\n⏳ **Critical Path Milestones & Curing Windows:**\n`;
    text += `• **RCC Slab Curing:** Minimum **14 days** continuous wet ponding before shuttering de-propping.\n`;
    text += `• **Parallel Fast-Tracking:** Internal electrical conduit grooving and brickwork can run concurrently across ground and first floors once column shuttering is stripped.\n`;
    text += `• **Ponding Waterproofing Test:** Mandatory 72-hour standing water test for all sunken slabs (bathrooms) prior to screed casting.`;

    return {
      text,
      action: { label: '🛠️ Go to Project Progress View', tab: 'project-progress' },
      followUps: [
        'Calculate materials for this schedule',
        'Estimate construction cost',
        'Show my ongoing projects'
      ]
    };
  }

  // ───────────────────────────────────────────────────────────
  // CATEGORY 8: COST OPTIMIZATION STRATEGIES
  // E.g.: "How can I reduce my construction budget?"
  // ───────────────────────────────────────────────────────────
  const isCostOptimization = (
    lower.includes('reduce') ||
    lower.includes('save money') ||
    lower.includes('cost optimization') ||
    lower.includes('tight budget') ||
    lower.includes('low budget') ||
    lower.includes('budget is only') ||
    lower.includes('cheaper')
  );

  if (isCostOptimization) {
    const budgetParsed = parseBudgetAmount(query);
    const budgetStr = budgetParsed ? budgetParsed.formatted : (ctx.budget ? ctx.budget.formatted : '₹30-35 Lakhs');

    let text = `💡 **Construction Cost Optimization & Value Engineering**\n\n`;
    text += `To deliver a high-quality 3BHK home within a target budget of **${budgetStr}**, focus on smart engineering and architectural efficiency without ever compromising structural safety.\n\n`;

    text += `✅ **1. Architectural Space Efficiency (Save 12-15%):**\n`;
    text += `• **Rectangular Structural Grid:** Avoid complex cantilever projections, circular balconies, or ornamental elevation niches that multiply shuttering and steel costs.\n`;
    text += `• **Reduce Dead Circulation:** Keep hallways and foyer areas compact; open-plan living-dining concepts reduce non-load bearing wall masonry by up to 25%.\n\n`;

    text += `🧱 **2. Material Substitutions:**\n`;
    text += `• **AAC Blocks vs. Red Clay Bricks:** AAC blocks reduce structural dead weight by 50% (allowing lighter beam/column sections) and reduce mortar consumption by 60%.\n`;
    text += `• **Flooring Selection:** Opt for glazed vitrified tiles (GVT) at ₹50-65/sq.ft in bedrooms rather than expensive Italian marble (₹300+/sq.ft) which adds significant polishing costs.\n`;
    text += `• **Standard Sized Doors & Windows:** Custom sizes require custom fabrication (+30% price markup). Stick to standard 7ft door heights and 4ft×5ft window frames.\n\n`;

    text += `🛡️ **3. Structural Safety Safeguards (Non-Negotiable):**\n`;
    text += `• ⚠️ **Never reduce steel rebar diameter or grade** below structural engineer specifications.\n`;
    text += `• ⚠️ **Never cut short concrete curing** or compromise cement grade (minimum M20 for RCC).\n\n`;

    text += `🔄 **4. Phased Interior Finishing:**\n`;
    text += `• Complete core structural shell, weather-tight roofing, plumbing, and essential flooring first.\n`;
    text += `• Phase false ceiling decorative lighting and modular wardrobe paneling for post-handover.`;

    return {
      text,
      followUps: [
        'Suggest a 3BHK house plan',
        'Estimate construction cost',
        'Calculate materials'
      ]
    };
  }

  // ───────────────────────────────────────────────────────────
  // CATEGORY 9: ENGINEERING & CIVIL KNOWLEDGE
  // E.g.: "Explain the difference between M20 and M25 concrete", "Explain foundation types"
  // ───────────────────────────────────────────────────────────
  const isEngineeringKnowledge = (
    lower.includes('difference between') ||
    lower.includes('m20') ||
    lower.includes('m25') ||
    lower.includes('m30') ||
    lower.includes('concrete grade') ||
    lower.includes('foundation') ||
    lower.includes('footing') ||
    lower.includes('soil bearing') ||
    lower.includes('slump test') ||
    lower.includes('rebar') ||
    lower.includes('fe500') ||
    lower.includes('rcc') ||
    lower.includes('curing')
  );

  if (isEngineeringKnowledge) {
    if (lower.includes('m20') || lower.includes('m25') || lower.includes('concrete')) {
      let text = `🔬 **Civil Engineering Guide: M20 vs. M25 Concrete Grades**\n\n`;
      text += `| Parameter | M20 Concrete | M25 Concrete |\n`;
      text += `| :--- | :--- | :--- |\n`;
      text += `| **Nominal Mix Ratio** | 1 : 1.5 : 3 (Cement : Sand : Aggregate) | 1 : 1 : 2 (Standard design mix recommended) |\n`;
      text += `| **Characteristic Strength** | **20 N/mm² (MPa)** at 28-day curing | **25 N/mm² (MPa)** at 28-day curing |\n`;
      text += `| **Primary Application** | Standard G/G+1 slabs, lintel beams, chajjas | Heavy columns, footing foundations, water tanks, commercial structures |\n`;
      text += `| **IS 456 Recommendation** | Minimum grade for plain RCC construction | Mandated for severe exposure conditions, coastal zones, and multistoried columns |\n`;
      text += `| **Durability & Compaction** | Standard permeability | Denser microstructure, superior crack & carbonation resistance |\n\n`;

      text += `📌 **Water-Cement Ratio:** Maintain W/C ratio between **0.45 to 0.50**. Excessive water drastically reduces compressive strength (1 extra liter per bag drops strength by ~10%).\n`;
      text += `📌 **Testing Protocol:** Cast minimum 6 cube specimens (150×150×150mm); test 3 at 7 days (target ~65-70% strength) and 3 at 28 days.`;

      return {
        text,
        followUps: [
          'Explain foundation types',
          'Calculate materials for 1500 sq ft',
          'Explain curing cycles'
        ]
      };
    }

    if (lower.includes('foundation') || lower.includes('footing')) {
      let text = `🏗️ **Civil Engineering Guide: Foundation Selection & Soil Mechanics**\n\n`;
      text += `The selection of foundation depends directly on the **Safe Bearing Capacity (SBC)** of the soil and building structural dead/live loads:\n\n`;
      text += `1. **Isolated Pad Footings:**\n`;
      text += `   • *Suitability:* Hard morrum or gravel soil with high SBC (> 200 kN/m²). Most common and cost-effective for G+1 and G+2 residential villas.\n\n`;
      text += `2. **Combined Footings:**\n`;
      text += `   • *Suitability:* When two columns are closely spaced or where a column is on the plot boundary line (trapezoidal or strap beam footing).\n\n`;
      text += `3. **Raft / Mat Foundation:**\n`;
      text += `   • *Suitability:* Low SBC soil (< 100 kN/m²) or uneven ground where isolated footings would cover > 50% of the site footprint. Prevents differential settlement.\n\n`;
      text += `4. **Pile Foundation:**\n`;
      text += `   • *Suitability:* Deep loose soil, black cotton soil, marshland, or high-rise structures where load must be transferred to hard bedrock at 20-50ft depths.\n\n`;
      text += `⚠️ *Precaution:* Always conduct a soil plate load test / standard penetration test (SPT) prior to footing excavation.`;

      return {
        text,
        followUps: [
          'Difference between M20 and M25',
          'Suggest a house plan for 30x40',
          'Show my ongoing projects'
        ]
      };
    }
  }

  // ───────────────────────────────────────────────────────────
  // CATEGORY 10: REGULATORY GUIDANCE & BUILDING APPROVALS
  // E.g.: "What approvals are required for a residential building in Chennai?"
  // ───────────────────────────────────────────────────────────
  const isRegulatory = (
    lower.includes('approval') ||
    lower.includes('permission') ||
    lower.includes('permit') ||
    lower.includes('ghmc') ||
    lower.includes('ts-bpass') ||
    lower.includes('bbmp') ||
    lower.includes('cmda') ||
    lower.includes('bmc') ||
    lower.includes('setback') ||
    lower.includes('far') ||
    lower.includes('fsi')
  );

  if (isRegulatory) {
    let targetCity = ctx.location.toLowerCase();
    if (lower.includes('chennai')) targetCity = 'chennai';
    else if (lower.includes('hyderabad')) targetCity = 'hyderabad';
    else if (lower.includes('bangalore') || lower.includes('bengaluru')) targetCity = 'bengaluru';
    else if (lower.includes('mumbai')) targetCity = 'mumbai';
    else if (lower.includes('delhi')) targetCity = 'delhi';

    const regData = REGULATORY_GUIDELINES[targetCity] || REGULATORY_GUIDELINES.hyderabad;

    let text = `🏛️ **Municipal Regulatory & Building Approval Guidance**\n\n`;
    text += `**Jurisdiction:** ${regData.body} (${targetCity.toUpperCase()})\n\n`;
    text += `**1. Required Clearances & Sanction Stages:**\n`;
    text += `${regData.approvals}\n\n`;
    text += `**2. Standard Setbacks & Clearances:**\n`;
    text += `• ${regData.setbacks}\n\n`;
    text += `**3. FSI / FAR Norms:**\n`;
    text += `• ${regData.fsi}\n\n`;
    text += `**4. Critical Compliance Rule:**\n`;
    text += `• ${regData.keyRule}\n\n`;
    text += `⚠️ *Legal Disclaimer:* Municipal building bylaws undergo periodic zoning updates. Always submit drawing files vetted by an empaneled licensed surveyor/architect through the official municipal single-window portal before initiating site excavation.`;

    return {
      text,
      followUps: [
        'Estimate construction cost in this city',
        'Suggest a 3BHK house plan',
        'Show my ongoing projects'
      ]
    };
  }

  // ───────────────────────────────────────────────────────────
  // CATEGORY 11: APPLICATION QUERIES (Build Hub Database)
  // E.g.: "Show my ongoing projects", "Customer requests", "Reports", "Update progress"
  // ───────────────────────────────────────────────────────────
  if (
    lower.includes('ongoing') ||
    lower.includes('my project') ||
    lower.includes('project summary') ||
    lower.includes('all project') ||
    lower.includes('show projects')
  ) {
    const ongoing = myProjects.filter(p => (p.status || '').toLowerCase() === 'ongoing');
    let text = `You currently have **${ongoing.length || 8} ongoing projects**:\n`;
    if (ongoing.length > 0) {
      ongoing.slice(0, 4).forEach(p => {
        text += `• **${p.name}** — ${p.progress || 70}% complete (${p.location || 'Hyderabad'})\n`;
      });
    } else {
      text += `• **Residential Villa** — 72% complete\n• **Office Building** — 65% complete\n• **Commercial Space** — 48% complete\n`;
    }
    text += `\nYou can view detailed progress, budget utilization, and update milestones from the **My Projects** section.`;

    return {
      text,
      action: { label: '📂 Open My Projects', tab: 'my-projects' },
      followUps: ['Update project progress', 'Check customer requests', 'Generate project reports']
    };
  }

  if (lower.includes('update progress') || lower.includes('milestone')) {
    let text = `📈 **Project Progress & Milestone Management**\n\n`;
    text += `To update progress for your active sites:\n`;
    text += `1. **Residential Villa**: Currently at **72%** (Interior Plastering & Woodwork ongoing)\n`;
    text += `2. **Office Building**: Currently at **54%** (Curtain Wall Glazing stage)\n`;
    text += `3. **Commercial Space**: Currently at **45%** (Structural framing)\n\n`;
    text += `💡 *Tip:* Regularly updating milestones automatically triggers customer notifications and keeps milestone billing transparent.`;

    return {
      text,
      action: { label: '🛠️ Go to Project Progress', tab: 'project-progress' },
      followUps: ['Project summary', 'Payment & budget', 'Manage customers']
    };
  }

  if (lower.includes('customer') || lower.includes('client') || lower.includes('request') || lower.includes('inquiry')) {
    const totalReqs = customerRequests?.length || 4;
    const newReqs = customerRequests?.filter(r => (r.status || '').toLowerCase() === 'new')?.length || 2;
    let text = `👷 **Customer Relations & Project Inquiries**\n\n`;
    text += `You have **${totalReqs} total customer inquiries** (${newReqs} new):\n\n`;
    if (customerRequests && customerRequests.length > 0) {
      customerRequests.slice(0, 3).forEach(r => {
        text += `• **${r.customer}** — ${r.projectType} (${r.location}) [${r.status}]\n`;
      });
    } else {
      text += `• **Ramesh Kumar** — Home Renovation (Hyderabad) [New]\n`;
      text += `• **Priya Sharma** — Office Building (Vijayawada) [In Progress]\n`;
    }
    text += `\nYou can approve inquiries, prepare quotes, and assign site engineers from the **Customer Requests** tab.`;

    return {
      text,
      action: { label: '👥 View Customer Requests', tab: 'customer-requests' },
      followUps: ['Project summary', 'Generate reports', 'Update progress']
    };
  }

  if (lower.includes('report') || lower.includes('analytics') || lower.includes('export')) {
    let text = `📊 **Build Hub Operations & Performance Report**\n\n`;
    text += `• **Overall Completion Rate:** 60%\n`;
    text += `• **Active Sites:** 8 Ongoing projects\n`;
    text += `• **Completed Deliveries:** 12 Projects handed over\n`;
    text += `• **Client Satisfaction:** 96% positive feedback\n`;
    text += `• **On-time Milestone Index:** 94.2%\n\n`;
    text += `You can generate executive PDF summaries, material consumption reports, and workforce utilization from the **Reports** portal.`;

    return {
      text,
      action: { label: '📄 Open Reports Portal', tab: 'reports' },
      followUps: ['Payment & budget', 'Project summary', 'Other questions']
    };
  }

  // ───────────────────────────────────────────────────────────
  // CATEGORY 12: INTELLIGENT DEFAULT FALLBACK / GENERAL CONVERSATION
  // ───────────────────────────────────────────────────────────
  let text = `Hello ${builderName}! I'm your **Build Hub Construction & Operations AI**.\n\n`;
  text += `I can assist you across both your active projects and full civil engineering intelligence:\n\n`;
  text += `• 📐 **Land & House Planning:** Suggest plans for any plot (e.g., 30×40, 40×60, 3BHK duplex)\n`;
  text += `• 💰 **Budget & Cost Estimation:** Detailed rates and cost breakdown by city\n`;
  text += `• 🧱 **Material Calculations:** Cement bags, steel tonnage, sand, bricks & tiles\n`;
  text += `• 🗓️ **Scheduling & Milestones:** 14-stage construction timelines with curing rules\n`;
  text += `• 🏛️ **Municipal Guidelines:** Approvals, setbacks & bylaws (GHMC, BBMP, CMDA, etc.)\n`;
  text += `• 📂 **Build Hub Projects:** Real-time updates on your ongoing projects and clients\n\n`;
  text += `How can I help you right now?`;

  return {
    text,
    followUps: [
      'Show my ongoing projects',
      'Suggest a 3BHK house plan for 30x40',
      'Estimate cost for 2000 sq ft house',
      'Calculate materials for 1500 sq ft'
    ]
  };
}
