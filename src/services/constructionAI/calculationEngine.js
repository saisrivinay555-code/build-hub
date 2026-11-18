import {
  REGIONAL_RATES,
  COST_DISTRIBUTION,
  MATERIAL_THUMB_RULES
} from './constructionData.js';

// ─────────────────────────────────────────────────────────────
// DETERMINISTIC CALCULATION SERVICES
// Provides verifiable mathematical formulas and estimates
// ─────────────────────────────────────────────────────────────

/**
 * Parses dimensions string like "30x40", "30*40", "30 by 40", "1200 sq ft"
 */
export function parsePlotDimensions(text) {
  if (!text) return null;
  const match = text.match(/(\d+)\s*(?:x|\*|by|X|×)\s*(\d+)/i);
  if (match) {
    const length = parseFloat(match[1]);
    const width = parseFloat(match[2]);
    const area = length * width;
    return { length, width, area, formatted: `${length} ft × ${width} ft` };
  }

  const plotAreaMatch = text.match(/(\d{3,5})\s*(?:sq\.?\s*ft|sqft|sft)\s*(?:plot|land|site)/i);
  if (plotAreaMatch) {
    const area = parseFloat(plotAreaMatch[1]);
    return { length: null, width: null, area, formatted: `${area} sq. ft. plot` };
  }

  return null;
}

/**
 * Extracts Indian currency amounts like "₹45 lakhs", "45L", "40,00,000"
 */
export function parseBudgetAmount(text) {
  if (!text) return null;
  const lakhMatch = text.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(?:lakhs?|lacs?|l)/i);
  if (lakhMatch) {
    const lakhs = parseFloat(lakhMatch[1]);
    return { amount: lakhs * 100000, formatted: `₹${lakhs} Lakhs` };
  }

  const croreMatch = text.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(?:crores?|cr)/i);
  if (croreMatch) {
    const cr = parseFloat(croreMatch[1]);
    return { amount: cr * 10000000, formatted: `₹${cr} Crores` };
  }

  const numMatch = text.match(/(?:₹|rs\.?|inr)?\s*(\d{2,3}(?:,\d{2,3})+|\d{6,8})/i);
  if (numMatch) {
    const cleanNum = parseFloat(numMatch[1].replace(/,/g, ''));
    if (!isNaN(cleanNum) && cleanNum > 50000) {
      return { amount: cleanNum, formatted: `₹${(cleanNum / 100000).toFixed(2)} Lakhs` };
    }
  }

  return null;
}

/**
 * Determines regional rates for a target city
 */
export function getRegionalRate(cityInput) {
  if (!cityInput) return REGIONAL_RATES.hyderabad;
  const city = cityInput.toLowerCase();

  if (city.includes('hyderabad') || city.includes('telangana') || city.includes('secunderabad')) {
    return REGIONAL_RATES.hyderabad;
  }
  if (city.includes('bangalore') || city.includes('bengaluru') || city.includes('karnataka')) {
    return REGIONAL_RATES.bengaluru;
  }
  if (city.includes('chennai') || city.includes('tamil nadu')) {
    return REGIONAL_RATES.chennai;
  }
  if (city.includes('mumbai') || city.includes('thane') || city.includes('pune') || city.includes('maharashtra')) {
    return REGIONAL_RATES.mumbai;
  }
  if (city.includes('delhi') || city.includes('noida') || city.includes('gurugram') || city.includes('gurgaon')) {
    return REGIONAL_RATES.delhi;
  }

  return REGIONAL_RATES.default;
}

/**
 * Calculates budget estimation with full itemized breakdown
 */
export function estimateConstructionCost({
  builtUpArea = 2000,
  city = 'Hyderabad',
  qualityTier = 'standard'
}) {
  const regional = getRegionalRate(city);
  const tierData = regional[qualityTier] || regional.standard;
  const ratePerSqFt = tierData.rate;

  const baseCost = builtUpArea * ratePerSqFt;
  const contingency = Math.round(baseCost * 0.05); // 5% contingency
  const totalCost = baseCost + contingency;

  // Cost range (-5% to +10%)
  const minCost = Math.round(baseCost * 0.95);
  const maxCost = Math.round(totalCost * 1.08);

  const breakdown = COST_DISTRIBUTION.map(item => ({
    category: item.item,
    share: `${item.percentage}%`,
    amount: Math.round((baseCost * item.percentage) / 100),
    description: item.desc
  }));

  return {
    builtUpArea,
    city: regional.city,
    authority: regional.authority,
    qualityTier: qualityTier.toUpperCase(),
    tierLabel: tierData.label,
    ratePerSqFt,
    baseCost,
    contingency,
    totalCost,
    minCost,
    maxCost,
    breakdown
  };
}

/**
 * Calculates material requirements for a given built-up area
 */
export function estimateMaterialQuantities(builtUpArea = 1500, buildingType = 'Residential G+1') {
  const cementBags = Math.round(builtUpArea * MATERIAL_THUMB_RULES.cementBagsPerSqFt);
  const steelKg = Math.round(builtUpArea * MATERIAL_THUMB_RULES.steelKgPerSqFt);
  const steelTonnes = (steelKg / 1000).toFixed(2);
  const sandCft = Math.round(builtUpArea * MATERIAL_THUMB_RULES.sandCftPerSqFt);
  const sandCuM = (sandCft / 35.315).toFixed(1);
  const aggregateCft = Math.round(builtUpArea * MATERIAL_THUMB_RULES.aggregateCftPerSqFt);
  const aggregateCuM = (aggregateCft / 35.315).toFixed(1);
  const redBricks = Math.round(builtUpArea * MATERIAL_THUMB_RULES.redBricksPerSqFt);
  const aacBlocks = Math.round(builtUpArea * MATERIAL_THUMB_RULES.aacBlocksPerSqFt);
  const flooringSqFt = Math.round(builtUpArea * MATERIAL_THUMB_RULES.tilesSqFtPerBuiltUpSqFt);
  const paintLiters = Math.round(builtUpArea * MATERIAL_THUMB_RULES.paintLitersPerSqFt);

  return {
    builtUpArea,
    buildingType,
    items: [
      {
        material: 'Cement (PPC / OPC 43/53)',
        quantity: `${cementBags.toLocaleString()} bags`,
        unit: '50kg Bags',
        basis: 'IS 456 thumb rule (~0.42 bags/sq.ft for RCC + Plaster + Masonry)',
        approxCost: `₹${(cementBags * 380).toLocaleString()} (@ ₹380/bag)`
      },
      {
        material: 'Reinforcement Steel (TMT Fe500D)',
        quantity: `${steelTonnes} MT (${steelKg.toLocaleString()} kg)`,
        unit: 'Tonnes / kg',
        basis: 'Residential G/G+1 structural allowance (~4.0 kg/sq.ft)',
        approxCost: `₹${(steelKg * 68).toLocaleString()} (@ ₹68/kg)`
      },
      {
        material: 'Sand (Manufactured M-Sand / River Sand)',
        quantity: `${sandCft.toLocaleString()} cft (~${sandCuM} m³)`,
        unit: 'Cubic Feet / m³',
        basis: '~1.75 cft/sq.ft for structural concrete & mortar work',
        approxCost: `₹${(sandCft * 55).toLocaleString()} (@ ₹55/cft)`
      },
      {
        material: 'Coarse Aggregate (20mm & 10mm crushed stone)',
        quantity: `${aggregateCft.toLocaleString()} cft (~${aggregateCuM} m³)`,
        unit: 'Cubic Feet / m³',
        basis: '~1.35 cft/sq.ft graded aggregate for slab, beams & footings',
        approxCost: `₹${(aggregateCft * 42).toLocaleString()} (@ ₹42/cft)`
      },
      {
        material: 'Red Clay Bricks (Standard 9"×4"×3")',
        quantity: `${redBricks.toLocaleString()} bricks`,
        unit: 'Nos.',
        basis: 'Outer 9" perimeter walls + internal 4.5" partition walls',
        approxCost: `₹${(redBricks * 9.5).toLocaleString()} (@ ₹9.50/brick)`
      },
      {
        material: 'Alternative: AAC Blocks (600×200×150mm)',
        quantity: `${aacBlocks.toLocaleString()} blocks`,
        unit: 'Blocks',
        basis: 'Lightweight alternative: Saves ~15-20% dead load & cement mortar',
        approxCost: `₹${(aacBlocks * 65).toLocaleString()} (@ ₹65/block)`
      },
      {
        material: 'Flooring Tiles & Skirting',
        quantity: `${flooringSqFt.toLocaleString()} sq. ft.`,
        unit: 'Sq. Ft.',
        basis: 'Net carpet area + 10% cutting wastage + 4" skirting',
        approxCost: `₹${(flooringSqFt * 65).toLocaleString()} (@ ₹65/sq.ft)`
      },
      {
        material: 'Paints & Wall Primer (Interior + Exterior)',
        quantity: `${paintLiters.toLocaleString()} Liters`,
        unit: 'Liters',
        basis: '2 coats acrylic putty + 1 coat primer + 2 coats premium emulsion',
        approxCost: `₹${(paintLiters * 280).toLocaleString()} (@ ₹280/L)`
      }
    ]
  };
}

/**
 * Generates structured construction schedule with stages, dependencies, and curing
 */
export function generateConstructionTimeline(builtUpArea = 2000, floors = 'G+1') {
  const isLarge = builtUpArea > 3500;
  const baseMonths = isLarge ? 12 : 9;

  return {
    totalEstimatedDuration: `${baseMonths} to ${baseMonths + 2} Months`,
    workingDays: `${(baseMonths * 24)} Working Days`,
    stages: [
      {
        stage: 1,
        title: 'Site Preparation & Soil Testing',
        duration: '2 Weeks',
        overlap: 'Independent',
        dependency: 'Municipal approval & water borewell connection',
        notes: 'Geotechnical borehole tests to confirm Safe Bearing Capacity (SBC).'
      },
      {
        stage: 2,
        title: 'Excavation & Footing Foundation',
        duration: '3 Weeks',
        overlap: 'Starts after Stage 1',
        dependency: 'PCC bed casting (M10/M15)',
        notes: 'Isolated/combined footings with anti-termite chemical spray.'
      },
      {
        stage: 3,
        title: 'Plinth Beam & Earth Backfilling',
        duration: '3 Weeks',
        overlap: 'Sequential',
        dependency: 'Column starter casting',
        notes: 'PCC compaction & damp proof course (DPC) installation.'
      },
      {
        stage: 4,
        title: 'Ground Floor Columns & Formwork',
        duration: '2.5 Weeks',
        overlap: 'Can overlap with plinth curing',
        dependency: 'Rebar binding & cover blocks',
        notes: 'Minimum 40mm cover blocks strictly mandated.'
      },
      {
        stage: 5,
        title: 'Ground Floor Roof Slab Casting & Curing',
        duration: '4 Weeks',
        overlap: 'Includes mandatory 14-day wet curing',
        dependency: 'Electrical conduit pipes inspection',
        notes: 'RMC M20/M25 mix with needle vibrators. Shuttering de-propping after 21 days.'
      },
      {
        stage: 6,
        title: 'First Floor Columns & Roof Slab Casting',
        duration: '4 Weeks',
        overlap: 'Starts when GF slab reaches 70% strength',
        dependency: 'Rebar tying & formwork inspection',
        notes: 'Sequential upper tier structural completion.'
      },
      {
        stage: 7,
        title: 'Brickwork / AAC Block Masonry',
        duration: '4 Weeks',
        overlap: 'Can begin on GF while FF cures',
        dependency: 'Lintel beam casting over window openings',
        notes: 'Raking of joints for plaster keying; chicken mesh over conduit chaces.'
      },
      {
        stage: 8,
        title: 'Electrical & Plumbing Rough-Ins (Conduiting)',
        duration: '3 Weeks',
        overlap: 'Parallel with masonry finish',
        dependency: 'Groove cutting in walls',
        notes: 'Pressure testing of plumbing lines before plastering.'
      },
      {
        stage: 9,
        title: 'Internal & External Plastering',
        duration: '4 Weeks',
        overlap: 'Sequential after rough-ins',
        dependency: '12mm internal plaster, 20mm external 2-coat sand-face',
        notes: 'Mandatory 7 to 10 days water curing for all plastered surfaces.'
      },
      {
        stage: 10,
        title: 'Waterproofing & Flooring / Tiling',
        duration: '3.5 Weeks',
        overlap: 'Parallel in dry rooms & wet areas',
        dependency: 'Ponding water test for toilets & terrace (min 72 hours)',
        notes: 'Vitrified tile laying with 2mm spacers and epoxy grouting.'
      },
      {
        stage: 11,
        title: 'Doors, Windows & Kitchen Granite Fitting',
        duration: '2 Weeks',
        overlap: 'Can overlap with flooring',
        dependency: 'Finished floor level (FFL) reference marks',
        notes: 'UPVC windows and teak main door frame installation.'
      },
      {
        stage: 12,
        title: 'Electrical Fixtures & Sanitary Ware Fitouts',
        duration: '2 Weeks',
        overlap: 'Parallel with carpentry',
        dependency: 'Final wiring termination & DB box',
        notes: 'Switches, LED lights, taps, showers, and water heater fixtures.'
      },
      {
        stage: 13,
        title: 'Painting & Final Wood Polish',
        duration: '3 Weeks',
        overlap: 'Final finishing phase',
        dependency: 'Dust-free floor conditions',
        notes: '2-coat wall putty sanding, 1 coat primer, 2 coats royal emulsion.'
      },
      {
        stage: 14,
        title: 'Deep Cleaning, Snag List Audit & Handover',
        duration: '1.5 Weeks',
        overlap: 'Final step',
        dependency: 'Client walkthrough and quality sign-off',
        notes: 'Key handover, warranty dossiers, and municipal occupancy audit.'
      }
    ]
  };
}

/**
 * Calculates remaining work and financial status for an active project (Mixed Queries)
 */
export function calculateRemainingProjectAnalysis(project) {
  if (!project) return null;

  const totalBudget = parseFloat(project.budget?.replace(/[^0-9.]/g, '') || '0') * 1000; // in dollars/rupees
  const spent = parseFloat(project.spent?.replace(/[^0-9.]/g, '') || '0') * 1000;
  const progressPercent = project.progress || 0;
  const remainingPercent = 100 - progressPercent;

  const remainingBudget = totalBudget - spent;
  const expectedTotalCost = progressPercent > 0 ? (spent / (progressPercent / 100)) : totalBudget;
  const projectedVariance = expectedTotalCost - totalBudget;

  const incompleteMilestones = (project.milestones || []).filter(m => !m.completed);

  return {
    projectName: project.name,
    customer: project.customer,
    location: project.location,
    status: project.status,
    progressPercent,
    remainingPercent,
    totalBudget: project.budget,
    spent: project.spent,
    remainingBudget: `$${(remainingBudget / 1000).toLocaleString()},000`,
    isInBudget: projectedVariance <= 0,
    projectedVarianceFormatted: projectedVariance > 0 
      ? `+$${(projectedVariance / 1000).toFixed(1)}k overrun risk` 
      : `Within budget ($${Math.abs(projectedVariance / 1000).toFixed(1)}k savings projected)`,
    incompleteMilestones
  };
}
