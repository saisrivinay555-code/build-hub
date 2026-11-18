// =========================================================================
// BUILD HUB — DOCUMENTS, BLUEPRINTS, RECEIPTS & BILLS DATASET
// High-fidelity blueprint representations, receipts, bills, and legal files
// =========================================================================

import floorPlanImg from '../assets/blueprint-floor-plan.png';
import elevationPlanImg from '../assets/blueprint-elevation-plan.png';
import structuralPlanImg from '../assets/blueprint-structural-plan.png';
import siteLayoutImg from '../assets/blueprint-site-layout.png';

export const BLUEPRINT_VECTORS = {
  'floor-plan': `
    <svg viewBox="0 0 800 550" xmlns="http://www.w3.org/2000/svg" className="w-full h-full bg-[#0E1E38] text-white select-none">
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E3A66" stroke-width="0.5" />
        </pattern>
        <pattern id="majorGrid" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#254B85" stroke-width="1" />
        </pattern>
      </defs>

      <!-- Blueprint Grid Background -->
      <rect width="100%" height="100%" fill="#0A182F" />
      <rect width="100%" height="100%" fill="url(#grid)" />
      <rect width="100%" height="100%" fill="url(#majorGrid)" opacity="0.6" />

      <!-- Outer Boundary Walls (Thick double lines) -->
      <rect x="70" y="50" width="660" height="420" fill="none" stroke="#60A5FA" stroke-width="4" />
      <rect x="76" y="56" width="648" height="408" fill="none" stroke="#93C5FD" stroke-width="1.5" />

      <!-- Room Partitions -->
      <!-- Master Bedroom -->
      <rect x="76" y="56" width="260" height="190" fill="#1E293B" fill-opacity="0.25" stroke="#93C5FD" stroke-width="2" />
      <text x="140" y="140" fill="#E2E8F0" font-size="14" font-weight="bold" font-family="monospace">MASTER BEDROOM</text>
      <text x="160" y="160" fill="#93C5FD" font-size="11" font-family="monospace">16'0" x 14'0"</text>

      <!-- Attached Bath -->
      <rect x="76" y="246" width="140" height="110" fill="#1E293B" fill-opacity="0.2" stroke="#93C5FD" stroke-width="2" />
      <text x="105" y="295" fill="#E2E8F0" font-size="11" font-weight="bold" font-family="monospace">TOILET</text>
      <text x="102" y="312" fill="#93C5FD" font-size="9" font-family="monospace">8'0" x 6'6"</text>

      <!-- Dressing Room -->
      <rect x="216" y="246" width="120" height="110" fill="#1E293B" fill-opacity="0.2" stroke="#93C5FD" stroke-width="2" />
      <text x="242" y="295" fill="#E2E8F0" font-size="11" font-weight="bold" font-family="monospace">DRESS</text>
      <text x="240" y="312" fill="#93C5FD" font-size="9" font-family="monospace">7'0" x 6'6"</text>

      <!-- Bedroom 2 -->
      <rect x="76" y="356" width="260" height="108" fill="#1E293B" fill-opacity="0.25" stroke="#93C5FD" stroke-width="2" />
      <text x="150" y="405" fill="#E2E8F0" font-size="13" font-weight="bold" font-family="monospace">BEDROOM 2</text>
      <text x="165" y="423" fill="#93C5FD" font-size="10" font-family="monospace">14'0" x 11'6"</text>

      <!-- Living & Foyer Central Hall -->
      <rect x="336" y="56" width="230" height="270" fill="#1E293B" fill-opacity="0.2" stroke="#93C5FD" stroke-width="2" />
      <text x="390" y="180" fill="#E2E8F0" font-size="15" font-weight="bold" font-family="monospace">LIVING HALL</text>
      <text x="405" y="202" fill="#93C5FD" font-size="12" font-family="monospace">18'6" x 15'0"</text>

      <!-- Dining Area -->
      <rect x="336" y="326" width="230" height="138" fill="#1E293B" fill-opacity="0.2" stroke="#93C5FD" stroke-width="2" />
      <text x="410" y="390" fill="#E2E8F0" font-size="13" font-weight="bold" font-family="monospace">DINING</text>
      <text x="405" y="408" fill="#93C5FD" font-size="11" font-family="monospace">14'0" x 10'0"</text>

      <!-- Kitchen & Utility -->
      <rect x="566" y="56" width="158" height="200" fill="#1E293B" fill-opacity="0.25" stroke="#93C5FD" stroke-width="2" />
      <text x="615" y="150" fill="#E2E8F0" font-size="13" font-weight="bold" font-family="monospace">KITCHEN</text>
      <text x="618" y="170" fill="#93C5FD" font-size="10" font-family="monospace">11'0" x 12'0"</text>

      <!-- Guest Bedroom 3 -->
      <rect x="566" y="256" width="158" height="208" fill="#1E293B" fill-opacity="0.25" stroke="#93C5FD" stroke-width="2" />
      <text x="600" y="350" fill="#E2E8F0" font-size="13" font-weight="bold" font-family="monospace">GUEST BED</text>
      <text x="610" y="370" fill="#93C5FD" font-size="10" font-family="monospace">11'0" x 13'6"</text>

      <!-- Dimension Lines -->
      <line x1="70" y1="35" x2="730" y2="35" stroke="#38BDF8" stroke-width="1.5" />
      <line x1="70" y1="28" x2="70" y2="42" stroke="#38BDF8" stroke-width="1.5" />
      <line x1="730" y1="28" x2="730" y2="42" stroke="#38BDF8" stroke-width="1.5" />
      <text x="360" y="28" fill="#38BDF8" font-size="12" font-family="monospace" font-weight="bold">TOTAL WIDTH: 45' 0"</text>

      <line x1="50" y1="50" x2="50" y2="470" stroke="#38BDF8" stroke-width="1.5" />
      <line x1="43" y1="50" x2="57" y2="50" stroke="#38BDF8" stroke-width="1.5" />
      <line x1="43" y1="470" x2="57" y2="470" stroke="#38BDF8" stroke-width="1.5" />
      <text x="42" y="270" fill="#38BDF8" font-size="12" font-family="monospace" font-weight="bold" transform="rotate(-90 42 270)">DEPTH: 32' 6"</text>

      <!-- Architectural Title Block -->
      <rect x="70" y="485" width="660" height="50" fill="#091428" stroke="#38BDF8" stroke-width="1.5" />
      <text x="85" y="505" fill="#F8FAFC" font-size="11" font-weight="bold" font-family="monospace">PROJECT: RESIDENTIAL VILLA (4BHK)</text>
      <text x="85" y="523" fill="#93C5FD" font-size="9" font-family="monospace">DWG: GROUND & FIRST FLOOR PLAN | SCALE: 1:100</text>
      <text x="440" y="505" fill="#F8FAFC" font-size="11" font-weight="bold" font-family="monospace">ARCHITECT: TECH BUILDERS / RAVI CONST.</text>
      <text x="440" y="523" fill="#34D399" font-size="9" font-family="monospace">STATUS: GHMC SANCTIONED #2026-HYD-441</text>
    </svg>
  `,

  'elevation-plan': `
    <svg viewBox="0 0 800 550" xmlns="http://www.w3.org/2000/svg" className="w-full h-full bg-[#0E1E38] text-white select-none">
      <defs>
        <pattern id="gridElev" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E3A66" stroke-width="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="#0A182F" />
      <rect width="100%" height="100%" fill="url(#gridElev)" />

      <!-- Ground Line -->
      <line x1="40" y1="430" x2="760" y2="430" stroke="#E2E8F0" stroke-width="4" />
      <text x="50" y="450" fill="#94A3B8" font-size="10" font-family="monospace">GROUND LEVEL ± 0.00m</text>

      <!-- House Main Elevation Massing -->
      <!-- Ground Floor Base -->
      <rect x="140" y="270" width="520" height="160" fill="#1E293B" stroke="#60A5FA" stroke-width="2.5" />
      <!-- First Floor Mass -->
      <rect x="160" y="130" width="480" height="140" fill="#1E293B" stroke="#60A5FA" stroke-width="2.5" />
      <!-- Parapet & Roof Slab -->
      <rect x="150" y="110" width="500" height="20" fill="#0F172A" stroke="#93C5FD" stroke-width="2" />
      <!-- Entry Portico & Pillars -->
      <rect x="340" y="290" width="120" height="140" fill="#0F172A" stroke="#93C5FD" stroke-width="2" />
      <rect x="360" y="320" width="80" height="110" fill="#3B82F6" fill-opacity="0.2" stroke="#60A5FA" stroke-width="2" />
      <text x="382" y="380" fill="#E2E8F0" font-size="11" font-weight="bold" font-family="monospace">ENTRY</text>

      <!-- Balcony Railing with Glass Texture -->
      <rect x="180" y="210" width="140" height="60" fill="#0284C7" fill-opacity="0.25" stroke="#38BDF8" stroke-width="1.5" />
      <line x1="180" y1="230" x2="320" y2="230" stroke="#38BDF8" stroke-width="1" />
      <line x1="180" y1="250" x2="320" y2="250" stroke="#38BDF8" stroke-width="1" />

      <!-- High Windows -->
      <rect x="480" y="160" width="130" height="70" fill="#0284C7" fill-opacity="0.3" stroke="#93C5FD" stroke-width="1.5" />
      <line x1="545" y1="160" x2="545" y2="230" stroke="#93C5FD" stroke-width="1.5" />
      <line x1="480" y1="195" x2="610" y2="195" stroke="#93C5FD" stroke-width="1.5" />

      <!-- Left Window Ground Floor -->
      <rect x="180" y="310" width="110" height="80" fill="#0284C7" fill-opacity="0.3" stroke="#93C5FD" stroke-width="1.5" />
      <line x1="235" y1="310" x2="235" y2="390" stroke="#93C5FD" stroke-width="1.5" />

      <!-- Right Window Ground Floor -->
      <rect x="510" y="310" width="110" height="80" fill="#0284C7" fill-opacity="0.3" stroke="#93C5FD" stroke-width="1.5" />
      <line x1="565" y1="310" x2="565" y2="390" stroke="#93C5FD" stroke-width="1.5" />

      <!-- Height Annotations -->
      <line x1="700" y1="430" x2="700" y2="110" stroke="#38BDF8" stroke-width="1.5" />
      <line x1="693" y1="430" x2="707" y2="430" stroke="#38BDF8" stroke-width="1.5" />
      <line x1="693" y1="270" x2="707" y2="270" stroke="#38BDF8" stroke-width="1.5" />
      <line x1="693" y1="110" x2="707" y2="110" stroke="#38BDF8" stroke-width="1.5" />
      <text x="715" y="360" fill="#38BDF8" font-size="11" font-family="monospace">GF: +3.3m</text>
      <text x="715" y="200" fill="#38BDF8" font-size="11" font-family="monospace">FF: +6.6m</text>
      <text x="715" y="115" fill="#38BDF8" font-size="11" font-family="monospace">ROOF: +7.2m</text>

      <!-- Architectural Title Block -->
      <rect x="50" y="485" width="700" height="50" fill="#091428" stroke="#38BDF8" stroke-width="1.5" />
      <text x="65" y="505" fill="#F8FAFC" font-size="11" font-weight="bold" font-family="monospace">PROJECT: RESIDENTIAL VILLA (4BHK)</text>
      <text x="65" y="523" fill="#93C5FD" font-size="9" font-family="monospace">DWG: FRONT ELEVATION & FACADE DETAILS | SCALE: 1:100</text>
      <text x="440" y="505" fill="#F8FAFC" font-size="11" font-weight="bold" font-family="monospace">ARCHITECT: TECH BUILDERS / RAVI CONST.</text>
      <text x="440" y="523" fill="#34D399" font-size="9" font-family="monospace">APPROVED SCHEME: CONTEMPORARY VILLA</text>
    </svg>
  `,

  'structural-plan': `
    <svg viewBox="0 0 800 550" xmlns="http://www.w3.org/2000/svg" className="w-full h-full bg-[#0E1E38] text-white select-none">
      <defs>
        <pattern id="gridStruct" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E3A66" stroke-width="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="#0A182F" />
      <rect width="100%" height="100%" fill="url(#gridStruct)" />

      <!-- Structural Grid Axes -->
      <!-- Vertical Grid Lines A, B, C, D -->
      <line x1="150" y1="60" x2="150" y2="440" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="6,4" />
      <circle cx="150" cy="40" r="14" fill="#1E293B" stroke="#F59E0B" stroke-width="2" />
      <text x="145" y="45" fill="#F59E0B" font-size="13" font-weight="bold" font-family="monospace">A</text>

      <line x1="310" y1="60" x2="310" y2="440" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="6,4" />
      <circle cx="310" cy="40" r="14" fill="#1E293B" stroke="#F59E0B" stroke-width="2" />
      <text x="305" y="45" fill="#F59E0B" font-size="13" font-weight="bold" font-family="monospace">B</text>

      <line x1="470" y1="60" x2="470" y2="440" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="6,4" />
      <circle cx="470" cy="40" r="14" fill="#1E293B" stroke="#F59E0B" stroke-width="2" />
      <text x="465" y="45" fill="#F59E0B" font-size="13" font-weight="bold" font-family="monospace">C</text>

      <line x1="630" y1="60" x2="630" y2="440" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="6,4" />
      <circle cx="630" cy="40" r="14" fill="#1E293B" stroke="#F59E0B" stroke-width="2" />
      <text x="625" y="45" fill="#F59E0B" font-size="13" font-weight="bold" font-family="monospace">D</text>

      <!-- Horizontal Grid Lines 1, 2, 3, 4 -->
      <line x1="120" y1="100" x2="660" y2="100" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="6,4" />
      <circle cx="95" cy="100" r="14" fill="#1E293B" stroke="#F59E0B" stroke-width="2" />
      <text x="91" y="105" fill="#F59E0B" font-size="13" font-weight="bold" font-family="monospace">1</text>

      <line x1="120" y1="210" x2="660" y2="210" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="6,4" />
      <circle cx="95" cy="210" r="14" fill="#1E293B" stroke="#F59E0B" stroke-width="2" />
      <text x="91" y="215" fill="#F59E0B" font-size="13" font-weight="bold" font-family="monospace">2</text>

      <line x1="120" y1="320" x2="660" y2="320" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="6,4" />
      <circle cx="95" cy="320" r="14" fill="#1E293B" stroke="#F59E0B" stroke-width="2" />
      <text x="91" y="325" fill="#F59E0B" font-size="13" font-weight="bold" font-family="monospace">3</text>

      <line x1="120" y1="410" x2="660" y2="410" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="6,4" />
      <circle cx="95" cy="410" r="14" fill="#1E293B" stroke="#F59E0B" stroke-width="2" />
      <text x="91" y="415" fill="#F59E0B" font-size="13" font-weight="bold" font-family="monospace">4</text>

      <!-- Connecting RCC Beams -->
      <rect x="145" y="95" width="490" height="10" fill="#3B82F6" fill-opacity="0.5" stroke="#60A5FA" stroke-width="1" />
      <rect x="145" y="205" width="490" height="10" fill="#3B82F6" fill-opacity="0.5" stroke="#60A5FA" stroke-width="1" />
      <rect x="145" y="315" width="490" height="10" fill="#3B82F6" fill-opacity="0.5" stroke="#60A5FA" stroke-width="1" />
      <rect x="145" y="405" width="490" height="10" fill="#3B82F6" fill-opacity="0.5" stroke="#60A5FA" stroke-width="1" />

      <!-- Columns (16 Structural Columns C1 to C16) -->
      <!-- Row 1 -->
      <rect x="140" y="90" width="20" height="20" fill="#EF4444" stroke="#FCA5A5" stroke-width="2" />
      <text x="135" y="80" fill="#FCA5A5" font-size="10" font-family="monospace">C1(9x15)</text>

      <rect x="300" y="90" width="20" height="20" fill="#EF4444" stroke="#FCA5A5" stroke-width="2" />
      <text x="295" y="80" fill="#FCA5A5" font-size="10" font-family="monospace">C2(9x15)</text>

      <rect x="460" y="90" width="20" height="20" fill="#EF4444" stroke="#FCA5A5" stroke-width="2" />
      <text x="455" y="80" fill="#FCA5A5" font-size="10" font-family="monospace">C3(9x15)</text>

      <rect x="620" y="90" width="20" height="20" fill="#EF4444" stroke="#FCA5A5" stroke-width="2" />
      <text x="615" y="80" fill="#FCA5A5" font-size="10" font-family="monospace">C4(9x15)</text>

      <!-- Row 2 -->
      <rect x="140" y="200" width="20" height="20" fill="#EF4444" stroke="#FCA5A5" stroke-width="2" />
      <rect x="300" y="200" width="20" height="20" fill="#EF4444" stroke="#FCA5A5" stroke-width="2" />
      <rect x="460" y="200" width="20" height="20" fill="#EF4444" stroke="#FCA5A5" stroke-width="2" />
      <rect x="620" y="200" width="20" height="20" fill="#EF4444" stroke="#FCA5A5" stroke-width="2" />

      <!-- Row 3 -->
      <rect x="140" y="310" width="20" height="20" fill="#EF4444" stroke="#FCA5A5" stroke-width="2" />
      <rect x="300" y="310" width="20" height="20" fill="#EF4444" stroke="#FCA5A5" stroke-width="2" />
      <rect x="460" y="310" width="20" height="20" fill="#EF4444" stroke="#FCA5A5" stroke-width="2" />
      <rect x="620" y="310" width="20" height="20" fill="#EF4444" stroke="#FCA5A5" stroke-width="2" />

      <!-- Row 4 -->
      <rect x="140" y="400" width="20" height="20" fill="#EF4444" stroke="#FCA5A5" stroke-width="2" />
      <rect x="300" y="400" width="20" height="20" fill="#EF4444" stroke="#FCA5A5" stroke-width="2" />
      <rect x="460" y="400" width="20" height="20" fill="#EF4444" stroke="#FCA5A5" stroke-width="2" />
      <rect x="620" y="400" width="20" height="20" fill="#EF4444" stroke="#FCA5A5" stroke-width="2" />

      <!-- Architectural Title Block -->
      <rect x="50" y="485" width="700" height="50" fill="#091428" stroke="#38BDF8" stroke-width="1.5" />
      <text x="65" y="505" fill="#F8FAFC" font-size="11" font-weight="bold" font-family="monospace">PROJECT: RESIDENTIAL VILLA (4BHK)</text>
      <text x="65" y="523" fill="#93C5FD" font-size="9" font-family="monospace">DWG: RCC COLUMN & PLINTH BEAM STRUCTURAL LAYOUT</text>
      <text x="440" y="505" fill="#F8FAFC" font-size="11" font-weight="bold" font-family="monospace">STRUCTURAL CONSULTANT: RAVI CONSTRUCTIONS</text>
      <text x="440" y="523" fill="#F59E0B" font-size="9" font-family="monospace">STEEL SPEC: Fe550D TMT | CONCRETE: GRADE M25</text>
    </svg>
  `,

  'site-layout': `
    <svg viewBox="0 0 800 550" xmlns="http://www.w3.org/2000/svg" className="w-full h-full bg-[#0E1E38] text-white select-none">
      <defs>
        <pattern id="gridSite" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E3A66" stroke-width="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="#0A182F" />
      <rect width="100%" height="100%" fill="url(#gridSite)" />

      <!-- Plot Boundary -->
      <rect x="70" y="40" width="660" height="420" fill="#13233D" stroke="#10B981" stroke-width="3" stroke-dasharray="10,5" />
      <text x="340" y="30" fill="#10B981" font-size="13" font-weight="bold" font-family="monospace">PLOT BOUNDARY: 60' x 40'</text>

      <!-- Road on North side -->
      <rect x="70" y="40" width="660" height="40" fill="#1E293B" stroke="#64748B" stroke-width="1" />
      <text x="310" y="65" fill="#CBD5E1" font-size="12" font-family="monospace">30 FT WIDE MUNICIPAL ROAD</text>

      <!-- Building Footprint inside Setbacks -->
      <rect x="140" y="130" width="520" height="270" fill="#1E3A8A" fill-opacity="0.3" stroke="#38BDF8" stroke-width="2.5" />
      <text x="310" y="260" fill="#E2E8F0" font-size="16" font-weight="bold" font-family="monospace">BUILDING FOOTPRINT</text>
      <text x="350" y="285" fill="#93C5FD" font-size="12" font-family="monospace">45' 0" x 32' 6"</text>

      <!-- Setback annotations -->
      <text x="360" y="105" fill="#38BDF8" font-size="11" font-family="monospace">FRONT SETBACK: 10' 0"</text>
      <text x="360" y="425" fill="#38BDF8" font-size="11" font-family="monospace">REAR SETBACK: 6' 0"</text>
      <text x="80" y="270" fill="#38BDF8" font-size="11" font-family="monospace" transform="rotate(-90 80 270)">SIDE 1: 5' 0"</text>
      <text x="710" y="270" fill="#38BDF8" font-size="11" font-family="monospace" transform="rotate(90 710 270)">SIDE 2: 5' 0"</text>

      <!-- Driveway & Parking -->
      <rect x="140" y="80" width="110" height="50" fill="#334155" stroke="#94A3B8" stroke-width="1.5" />
      <text x="165" y="110" fill="#F8FAFC" font-size="11" font-family="monospace">CAR PARKING</text>

      <!-- Rainwater Harvesting Pit & Sump -->
      <circle cx="630" cy="100" r="18" fill="#0284C7" stroke="#38BDF8" stroke-width="2" />
      <text x="618" y="105" fill="#FFFFFF" font-size="10" font-weight="bold" font-family="monospace">RWH</text>

      <rect x="580" y="415" width="50" height="35" fill="#0369A1" stroke="#38BDF8" stroke-width="1.5" />
      <text x="590" y="435" fill="#FFFFFF" font-size="9" font-family="monospace">SUMP</text>

      <!-- North Compass Indicator -->
      <circle cx="700" cy="80" r="22" fill="#0F172A" stroke="#EF4444" stroke-width="2" />
      <path d="M 700 62 L 706 78 L 700 74 L 694 78 Z" fill="#EF4444" />
      <path d="M 700 98 L 706 82 L 700 86 L 694 82 Z" fill="#94A3B8" />
      <text x="696" y="58" fill="#EF4444" font-size="12" font-weight="bold" font-family="monospace">N</text>

      <!-- Architectural Title Block -->
      <rect x="70" y="485" width="660" height="50" fill="#091428" stroke="#38BDF8" stroke-width="1.5" />
      <text x="85" y="505" fill="#F8FAFC" font-size="11" font-weight="bold" font-family="monospace">PROJECT: RESIDENTIAL VILLA (4BHK)</text>
      <text x="85" y="523" fill="#93C5FD" font-size="9" font-family="monospace">DWG: SITE LAYOUT & SETBACK CLEARANCE | SCALE: 1:200</text>
      <text x="440" y="505" fill="#F8FAFC" font-size="11" font-weight="bold" font-family="monospace">LOCATION: JUBILEE HILLS EXT., HYDERABAD</text>
      <text x="440" y="523" fill="#10B981" font-size="9" font-family="monospace">TOTAL SITE AREA: 266.6 SQ.YDS (2,400 SQ.FT)</text>
    </svg>
  `
};

export const INITIAL_PROJECT_DOCUMENTS = [
  // ─── 1. HOUSE PLANS & BLUEPRINTS (Tab 1) ───
  {
    id: 'pdoc-1',
    category: 'plans',
    title: 'Floor Plan',
    name: 'Floor Plan',
    previewUrl: floorPlanImg,
    vectorKey: 'floor-plan',
    date: 'Aug 15, 2026',
    version: 'Version 1.0',
    type: 'Architectural Blueprint',
    fileType: 'image/png',
    size: '4.8 MB',
    format: 'CAD Drawing',
    description: 'Detailed 4BHK ground and first floor structural layout with exact room dimensions, staircase, balcony and window placements.',
    projectId: 'cp_ramesh_1',
    builderName: 'Ravi Constructions'
  },
  {
    id: 'pdoc-2',
    category: 'plans',
    title: 'Elevation Plan',
    name: 'Elevation Plan',
    previewUrl: elevationPlanImg,
    vectorKey: 'elevation-plan',
    date: 'Aug 14, 2026',
    version: 'Version 1.0',
    type: 'Architectural Elevation',
    fileType: 'image/png',
    size: '3.6 MB',
    format: '2D Architectural',
    description: 'Front facade and 3D exterior architectural elevation showing parapet styling, glazing lines, portico heights and exterior cladding.',
    projectId: 'cp_ramesh_1',
    builderName: 'Ravi Constructions'
  },
  {
    id: 'pdoc-3',
    category: 'plans',
    title: 'Structural Plan',
    name: 'Structural Plan',
    previewUrl: structuralPlanImg,
    vectorKey: 'structural-plan',
    date: 'Aug 12, 2026',
    version: 'Version 1.0',
    type: 'Structural Drawing',
    fileType: 'image/png',
    size: '5.2 MB',
    format: 'Engineering CAD',
    description: 'RCC column grid axes, footing coordinates, plinth beam reinforcement schedules with Fe550D TMT bar specifications.',
    projectId: 'cp_ramesh_1',
    builderName: 'Ravi Constructions'
  },
  {
    id: 'pdoc-4',
    category: 'plans',
    title: 'Site Layout Plan',
    name: 'Site Layout Plan',
    previewUrl: siteLayoutImg,
    vectorKey: 'site-layout',
    date: 'Aug 10, 2026',
    version: 'Version 1.0',
    type: 'Site & Setback Plan',
    fileType: 'image/png',
    size: '4.1 MB',
    format: 'Master Plot Layout',
    description: 'Master plot boundary, GHMC sanctioned building setbacks (10ft front, 6ft rear, 5ft sides), rainwater percolation pit & water sump layout.',
    projectId: 'cp_ramesh_1',
    builderName: 'Ravi Constructions'
  },
  {
    id: 'pdoc-5',
    category: 'plans',
    title: 'Electrical Plan',
    name: 'Electrical Plan',
    previewUrl: floorPlanImg,
    vectorKey: 'floor-plan',
    date: 'Aug 08, 2026',
    version: 'Version 1.0',
    type: 'Electrical Conduits',
    fileType: 'image/png',
    size: '3.9 MB',
    format: 'Engineering CAD',
    description: 'Concealed conduit distribution, main switchgear board, AC power points, inverter backup lines and LED cove lighting layout.',
    projectId: 'cp_ramesh_1',
    builderName: 'Ravi Constructions'
  },
  {
    id: 'pdoc-6',
    category: 'plans',
    title: 'Plumbing Plan',
    name: 'Plumbing Plan',
    previewUrl: floorPlanImg,
    vectorKey: 'floor-plan',
    date: 'Aug 05, 2026',
    version: 'Version 1.0',
    type: 'Sanitary & Water Supply',
    fileType: 'image/png',
    size: '3.4 MB',
    format: 'Plumbing Schematic',
    description: 'CPVC hot and cold water piping, sanitary stack lines, solar water heater loop and underground inspection chambers.',
    projectId: 'cp_ramesh_1',
    builderName: 'Ravi Constructions'
  },
  {
    id: 'pdoc-7',
    category: 'plans',
    title: 'Foundation Plan',
    name: 'Foundation Plan',
    previewUrl: structuralPlanImg,
    vectorKey: 'structural-plan',
    date: 'Aug 02, 2026',
    version: 'Version 1.0',
    type: 'Civil Substructure',
    fileType: 'image/png',
    size: '4.6 MB',
    format: 'Foundation CAD',
    description: 'Soil bearing test compliance, raft foundation depth details, PCC bed casting and anti-termite treatment specifications.',
    projectId: 'cp_ramesh_1',
    builderName: 'Ravi Constructions'
  },
  {
    id: 'pdoc-8',
    category: 'plans',
    title: 'Interior Layout Plan',
    name: 'Interior Layout Plan',
    previewUrl: elevationPlanImg,
    vectorKey: 'elevation-plan',
    date: 'Jul 28, 2026',
    version: 'Version 1.0',
    type: 'Interior Architecture',
    fileType: 'image/png',
    size: '5.8 MB',
    format: 'Architectural Layout',
    description: 'Modular kitchen counter arrangement, master bedroom wardrobe joinery, living room false ceiling levels and TV unit details.',
    projectId: 'cp_ramesh_1',
    builderName: 'Ravi Constructions'
  },

  // ─── 2. PROJECT RECEIPTS (Tab 2) ───
  {
    id: 'rec-1',
    category: 'receipts',
    title: 'Advance Payment Receipt',
    name: 'Advance Payment Receipt',
    receiptNumber: 'REC-2026-101',
    date: 'Jan 02, 2026',
    amount: '₹3,00,000',
    amountNum: 300000,
    purpose: 'Stage 1 - Project Booking & Civil Foundation Advance',
    status: 'Paid',
    paymentMethod: 'Cheque Clearance #100293',
    builderName: 'Ravi Constructions',
    projectId: 'cp_ramesh_1',
    size: '1.2 MB'
  },
  {
    id: 'rec-2',
    category: 'receipts',
    title: 'Builder Payment Receipt',
    name: 'Builder Payment Receipt',
    receiptNumber: 'REC-2026-309',
    date: 'Feb 20, 2026',
    amount: '₹4,60,000',
    amountNum: 460000,
    purpose: 'Stage 2 - Foundation Plinth Beam & Earthwork Concreting',
    status: 'Paid',
    paymentMethod: 'RTGS Wire Transfer #441992',
    builderName: 'Ravi Constructions',
    projectId: 'cp_ramesh_1',
    size: '1.4 MB'
  },
  {
    id: 'rec-3',
    category: 'receipts',
    title: 'Material Purchase Receipt',
    name: 'Material Purchase Receipt',
    receiptNumber: 'REC-2026-412',
    date: 'Mar 15, 2026',
    amount: '₹2,85,000',
    amountNum: 285000,
    purpose: 'Purchase of High-grade Fe550D TMT Steel & UltraTech 53 Grade Cement',
    status: 'Verified',
    paymentMethod: 'Corporate Card #9914',
    builderName: 'Ravi Constructions',
    projectId: 'cp_ramesh_1',
    size: '1.6 MB'
  },
  {
    id: 'rec-4',
    category: 'receipts',
    title: 'Labour Payment Receipt',
    name: 'Labour Payment Receipt',
    receiptNumber: 'REC-2026-498',
    date: 'Apr 25, 2026',
    amount: '₹1,40,000',
    amountNum: 140000,
    purpose: 'Skilled Masonry, Barbending & Shuttering Crew Wage Settlement',
    status: 'Settled',
    paymentMethod: 'Direct Bank Transfer #55021',
    builderName: 'Ravi Constructions',
    projectId: 'cp_ramesh_1',
    size: '1.1 MB'
  },
  {
    id: 'rec-5',
    category: 'receipts',
    title: 'Equipment Purchase Receipt',
    name: 'Equipment Purchase Receipt',
    receiptNumber: 'REC-2026-533',
    date: 'May 10, 2026',
    amount: '₹95,000',
    amountNum: 95000,
    purpose: 'Concrete Mixer Rental, Needle Vibrators & Heavy Steel Scaffolding',
    status: 'Paid',
    paymentMethod: 'UPI Transaction #490182',
    builderName: 'Ravi Constructions',
    projectId: 'cp_ramesh_1',
    size: '980 KB'
  },
  {
    id: 'rec-6',
    category: 'receipts',
    title: 'Other Payment Receipts',
    name: 'Other Payment Receipts',
    receiptNumber: 'REC-2026-615',
    date: 'Jun 05, 2026',
    amount: '₹1,20,000',
    amountNum: 120000,
    purpose: 'GHMC Municipal Plan Sanction Fees, Water Connection & Temporary Power',
    status: 'Cleared',
    paymentMethod: 'Treasury Challan #882194',
    builderName: 'Ravi Constructions',
    projectId: 'cp_ramesh_1',
    size: '1.5 MB'
  },

  // ─── 3. BILLS & COST ESTIMATES (Tab 3) ───
  {
    id: 'bill-1',
    category: 'bills',
    title: 'Construction Quotation',
    name: 'Construction Quotation',
    billNumber: 'BILL-QT-001',
    date: 'Jan 01, 2026',
    amount: '₹20,00,000',
    amountNum: 2000000,
    builderName: 'Ravi Constructions',
    status: 'Approved',
    description: 'Turn-key construction contract quotation for 4BHK Duplex Villa (1,000 sq.ft plot, 2,400 sq.ft built-up area).',
    projectId: 'cp_ramesh_1',
    size: '2.8 MB'
  },
  {
    id: 'bill-2',
    category: 'bills',
    title: 'Material Cost Breakdown',
    name: 'Material Cost Breakdown',
    billNumber: 'BILL-MAT-042',
    date: 'Feb 15, 2026',
    amount: '₹9,80,000',
    amountNum: 980000,
    builderName: 'Ravi Constructions',
    status: 'Verified',
    description: 'Itemized material estimation covering ready-mix concrete, TMT steel rebars, red clay bricks, river sand, and CPVC piping.',
    projectId: 'cp_ramesh_1',
    size: '2.1 MB'
  },
  {
    id: 'bill-3',
    category: 'bills',
    title: 'Labour Cost Breakdown',
    name: 'Labour Cost Breakdown',
    billNumber: 'BILL-LAB-019',
    date: 'Mar 20, 2026',
    amount: '₹4,20,000',
    amountNum: 420000,
    builderName: 'Ravi Constructions',
    status: 'In Progress',
    description: 'Comprehensive labour breakdown across excavation, RCC staging, masonry, plastering, plumbing and electrical installation.',
    projectId: 'cp_ramesh_1',
    size: '1.7 MB'
  },
  {
    id: 'bill-4',
    category: 'bills',
    title: 'Additional Expenses',
    name: 'Additional Expenses',
    billNumber: 'BILL-ADD-007',
    date: 'Apr 10, 2026',
    amount: '₹65,000',
    amountNum: 65000,
    builderName: 'Ravi Constructions',
    status: 'Settled',
    description: 'Pre-construction soil core drilling, topography survey, site security fencing and safety nets.',
    projectId: 'cp_ramesh_1',
    size: '1.3 MB'
  },
  {
    id: 'bill-5',
    category: 'bills',
    title: 'Construction Stage Bills',
    name: 'Construction Stage Bills',
    billNumber: 'BILL-STG-003',
    date: 'May 15, 2026',
    amount: '₹5,00,000',
    amountNum: 500000,
    builderName: 'Ravi Constructions',
    status: 'Paid',
    description: 'Stage 3 sign-off bill: Ground floor RCC slab casting, first floor framing and structural curing certificate.',
    projectId: 'cp_ramesh_1',
    size: '2.4 MB'
  },
  {
    id: 'bill-6',
    category: 'bills',
    title: 'Final Project Invoice',
    name: 'Final Project Invoice',
    billNumber: 'BILL-INV-FINAL',
    date: 'Target: Aug 25, 2026',
    amount: '₹2,40,000',
    amountNum: 240000,
    builderName: 'Ravi Constructions',
    status: 'Pending',
    description: 'Provisional handover billing: Final finishing, Italian marble polish, electrical fittings inspection, and occupancy documentation.',
    projectId: 'cp_ramesh_1',
    size: '1.9 MB'
  },

  // ─── 4. OTHER DOCUMENTS (Tab 4) ───
  {
    id: 'oth-1',
    category: 'other',
    title: 'Construction Agreement',
    name: 'Construction Agreement',
    date: 'Jan 02, 2026',
    type: 'Legal Master Agreement',
    status: 'Signed & Verified',
    version: 'Version 2.0',
    description: 'Certified tripartite construction agreement executed between customer Sai Attada and builder Ravi Constructions.',
    size: '3.4 MB',
    projectId: 'cp_ramesh_1'
  },
  {
    id: 'oth-2',
    category: 'other',
    title: 'Municipal Approval',
    name: 'Municipal Approval',
    date: 'Jan 10, 2026',
    type: 'GHMC Building Sanction',
    status: 'Approved #GHMC-2026',
    version: 'Final Sanction',
    description: 'Greater Hyderabad Municipal Corporation official building plan sanction order & clearance certificate.',
    size: '4.2 MB',
    projectId: 'cp_ramesh_1'
  },
  {
    id: 'oth-3',
    category: 'other',
    title: 'Building Permit',
    name: 'Building Permit',
    date: 'Jan 18, 2026',
    type: 'HMDA Development Permit',
    status: 'Certified Official',
    version: 'Govt Stamp',
    description: 'Hyderabad Metropolitan Development Authority statutory building commencement certificate.',
    size: '2.9 MB',
    projectId: 'cp_ramesh_1'
  },
  {
    id: 'oth-4',
    category: 'other',
    title: 'Land Documents',
    name: 'Land Documents',
    date: 'Dec 15, 2025',
    type: 'Registered Title Deed & Link Documents',
    status: 'Legally Cleared',
    version: 'Registered',
    description: 'Certified copy of registered sale deed, Encumbrance Certificate (EC 30-year search) and patta passbook.',
    size: '6.5 MB',
    projectId: 'cp_ramesh_1'
  },
  {
    id: 'oth-5',
    category: 'other',
    title: 'Quality Test Reports',
    name: 'Quality Test Reports',
    date: 'Mar 28, 2026',
    type: 'NABL Certified Lab Report',
    status: 'Passed Grade M25',
    version: 'Audit Certified',
    description: '28-day concrete cube compressive strength test report (28.4 N/mm²) and Fe550 TMT tensile ductility test.',
    size: '3.8 MB',
    projectId: 'cp_ramesh_1'
  },
  {
    id: 'oth-6',
    category: 'other',
    title: 'Legal Documents',
    name: 'Legal Documents',
    date: 'Dec 22, 2025',
    type: 'Advocate Title Clearance Report',
    status: 'Clear Marketable Title',
    version: 'Legal Opinion',
    description: 'Senior High Court advocate legal scrutiny report confirming clear, unencumbered marketable title of plot.',
    size: '2.1 MB',
    projectId: 'cp_ramesh_1'
  },
  {
    id: 'oth-7',
    category: 'other',
    title: 'Other Supporting Documents',
    name: 'Other Supporting Documents',
    date: 'Jan 05, 2026',
    type: 'Soil Investigation Report',
    status: 'Safe SBC 220 kN/m²',
    version: 'Geotech Audit',
    description: 'Geotechnical soil investigation report confirming high safe bearing capacity for multi-storey RCC foundation.',
    size: '4.5 MB',
    projectId: 'cp_ramesh_1'
  }
];

