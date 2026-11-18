// ─────────────────────────────────────────────────────────────
// BUILD HUB — CONSTRUCTION KNOWLEDGE & REFERENCE DATA
// Regional construction rates, material estimation thumb rules,
// scheduling benchmarks, and municipal regulatory guidelines.
// ─────────────────────────────────────────────────────────────

export const REGIONAL_RATES = {
  hyderabad: {
    city: 'Hyderabad',
    state: 'Telangana',
    authority: 'GHMC / HMDA / TS-bPASS',
    economy: { rate: 1650, label: 'Economy (Standard Red Brick / Basic Vitrified / Local Wood)' },
    standard: { rate: 2050, label: 'Standard (AAC / Premium Vitrified / Teak Main Door / Jaquar)' },
    premium: { rate: 2650, label: 'Premium (Italian Marble / High-end CP / Smart Home / UPVC)' },
    laborIndex: 1.0,
    materialIndex: 1.02
  },
  bengaluru: {
    city: 'Bengaluru',
    state: 'Karnataka',
    authority: 'BBMP / BDA',
    economy: { rate: 1750, label: 'Economy (Wirecut Brick / Basic Tiles)' },
    standard: { rate: 2200, label: 'Standard (Solid Concrete Blocks / Granite / Premium CP)' },
    premium: { rate: 2850, label: 'Premium (Engineered Wood / Marble / Automation)' },
    laborIndex: 1.08,
    materialIndex: 1.05
  },
  chennai: {
    city: 'Chennai',
    state: 'Tamil Nadu',
    authority: 'CMDA / GCC',
    economy: { rate: 1680, label: 'Economy (Chamber Brick / Ceramic Tiles)' },
    standard: { rate: 2100, label: 'Standard (Corrosion Resistant Fe500D / Somany / Kohler)' },
    premium: { rate: 2700, label: 'Premium (Coastal Grade Concrete / Italian Marble)' },
    laborIndex: 1.02,
    materialIndex: 1.03
  },
  mumbai: {
    city: 'Mumbai / MMR',
    state: 'Maharashtra',
    authority: 'BMC / MCGM / MMRDA',
    economy: { rate: 2100, label: 'Economy (AAC Block / Vitrified)' },
    standard: { rate: 2700, label: 'Standard (RMC M25 / Grohe / Schüco Windows)' },
    premium: { rate: 3600, label: 'Premium (High-rise Grade / Imported Marble / Automation)' },
    laborIndex: 1.25,
    materialIndex: 1.15
  },
  delhi: {
    city: 'Delhi NCR',
    state: 'Delhi / Haryana / UP',
    authority: 'MCD / DDA / DTCP',
    economy: { rate: 1700, label: 'Economy (Fly Ash / Basic Vitrified)' },
    standard: { rate: 2150, label: 'Standard (AAC / Kajaria / Hindware Italian)' },
    premium: { rate: 2800, label: 'Premium (Pergola / Hardwood / Smart Electricals)' },
    laborIndex: 1.04,
    materialIndex: 1.02
  },
  default: {
    city: 'Tier-2 / Pan-India Average',
    state: 'National Average',
    authority: 'Local Municipality / Town Planning',
    economy: { rate: 1600, label: 'Economy' },
    standard: { rate: 2000, label: 'Standard' },
    premium: { rate: 2600, label: 'Premium' },
    laborIndex: 1.0,
    materialIndex: 1.0
  }
};

// Itemized cost distribution breakdown (%)
export const COST_DISTRIBUTION = [
  { item: 'Substructure & RCC Superstructure', percentage: 48, desc: 'Excavation, footings, columns, beams, and RCC slab casting' },
  { item: 'Brickwork & Internal/External Plastering', percentage: 14, desc: 'AAC/red brick masonry, chicken mesh, 12mm & 20mm plaster' },
  { item: 'Flooring, Tiling & Countertops', percentage: 10, desc: 'Vitrified tiles, granite for staircase/kitchen, anti-skid bathroom tiles' },
  { item: 'Electrical Conduiting, Wiring & Fixtures', percentage: 7, desc: 'FRLS copper wiring, modular switch plates, distribution box' },
  { item: 'Plumbing, Drainage & Sanitary Ware', percentage: 7, desc: 'CPVC/UPVC pipelines, water tanks, sanitaryware and chrome fixtures' },
  { item: 'Doors, Windows & Fabrication', percentage: 6, desc: 'Teakwood/flush doors, UPVC/aluminum 3-track sliding windows, MS railings' },
  { item: 'Painting, Waterproofing & Finishing', percentage: 5, desc: 'Dr. Fixit chemical waterproofing, 2-coat wall putty, premium acrylic emulsion' },
  { item: 'Miscellaneous & Contingency Allowance', percentage: 3, desc: 'Testing, curing energy, site safety, unpredictable price fluctuations' }
];

// Material consumption thumb rules (Per sq. ft. of Built-Up Area)
// Sourced from CPWD Specifications, IS 456:2000 & Civil Engineering practical benchmarks
export const MATERIAL_THUMB_RULES = {
  cementBagsPerSqFt: 0.42,          // ~0.40 to 0.45 bags per sq.ft
  steelKgPerSqFt: 4.0,              // ~3.5 to 4.5 kg per sq.ft (TMT Fe500/550D)
  sandCftPerSqFt: 1.75,             // ~1.6 to 1.8 cft per sq.ft (M-Sand/River Sand)
  aggregateCftPerSqFt: 1.35,        // ~1.2 to 1.4 cft per sq.ft (20mm & 10mm metal)
  redBricksPerSqFt: 8.5,            // ~8 to 9 red clay bricks per sq.ft (or ~3 AAC blocks)
  aacBlocksPerSqFt: 3.2,            // 600x200x150mm blocks
  tilesSqFtPerBuiltUpSqFt: 1.25,    // Includes 10% wastage, skirting & balconies
  paintLitersPerSqFt: 0.20          // Primer + 2 coats interior + exterior weather-coat
};

// Regulatory reference summary by major Indian cities
export const REGULATORY_GUIDELINES = {
  hyderabad: {
    body: 'GHMC / HMDA (via TS-bPASS portal)',
    setbacks: 'For plots up to 100 sq.m: Front 1.5m. For 100-300 sq.m: Front 1.5m, Sides 1.0m, Rear 1.5m. Above 300 sq.m: Front 3.0m, Sides 1.5-2.0m.',
    fsi: 'FSI/FAR is liberal in Telangana, but governed by road width (minimum 30ft road required for G+2, 40ft road for higher).',
    approvals: '1. TS-bPASS Instant Registration (up to 75 sq. yards) or Instant Approval (up to 500 sq.m & 10m height).\n2. Structural Stability Certificate.\n3. Water & Sewerage Board (HMWSSB) NOC.\n4. Fire NOC required only if building height exceeds 15 meters.',
    keyRule: 'Rainwater Harvesting Pit is mandatory for plot area > 200 sq. meters.'
  },
  bengaluru: {
    body: 'BBMP / BDA',
    setbacks: 'Up to 60 sq.m: Front 1.0m. 60-150 sq.m: Front 1.5m, Rear 1.0m. 150-240 sq.m: Front 2.0m, Sides 1.0m, Rear 1.5m.',
    fsi: 'Standard FAR varies between 1.50 to 2.25 based on road width (under 9m road: FAR 1.50; 9-12m road: FAR 1.75). Premium FAR available.',
    approvals: '1. BBMP Building Plan Sanction (via online Suvarna Belaku).\n2. BWSSB Water & Sanitary NOC.\n3. BESCOM Power NOC.\n4. Tree Officer clearance if tree felling is required.',
    keyRule: 'RWH mandatory for all plots 1,200 sq. ft. (30x40) and above.'
  },
  chennai: {
    body: 'CMDA / Greater Chennai Corporation',
    setbacks: 'Non-high rise (up to 12m height): Front 1.5m (up to 9m road) or 3.0m (above 9m road); Sides: Min 1.0m each; Rear: 1.5m.',
    fsi: 'Standard FSI is 2.0 for residential buildings on roads ≥ 9.0 meters. Premium FSI up to 50% available on payment.',
    approvals: '1. CMDA / GCC Planning Permission & Building Permit.\n2. CMWSSB Water and Sewer Connection NOC.\n3. Structural Engineer declaration for seismic zone III.',
    keyRule: 'Coastal Zone Management rules apply within 500m of shoreline.'
  },
  mumbai: {
    body: 'BMC / MCGM (under DCPR 2034)',
    setbacks: 'Governed strictly by DCPR 2034 open space regulations (min 1.5m to 3.0m depending on height and tenement density).',
    fsi: 'Base FSI 1.0 for Island City & Suburbs, with permissible FSI up to 2.5 - 3.0 via TDR and Fungible compensatory FSI.',
    approvals: '1. IOD (Intimation of Disapproval).\n2. Commencement Certificate (CC).\n3. CFO Fire Safety NOC.\n4. OC (Occupancy Certificate) on completion.',
    keyRule: 'Seismic Zone III/IV and coastal humidity corrosion protection mandatory.'
  },
  delhi: {
    body: 'MCD / DDA (Master Plan for Delhi MPD-2021)',
    setbacks: 'For plots up to 100 sq.m: Front setback only. 100-250 sq.m: Front 3.0m, Rear 2.0m. Stilt parking mandatory for G+4 residential floors.',
    fsi: 'Ground Coverage 75% to 66.6%, Maximum FAR 200 - 350 based on plot size category.',
    approvals: '1. MCD Online Building Plan Sanction (OBPS).\n2. Delhi Jal Board (DJB) NOC.\n3. BSES/TPDDL Power Clearance.',
    keyRule: 'Seismic Zone IV design compulsory with vetted structural calculations.'
  }
};
