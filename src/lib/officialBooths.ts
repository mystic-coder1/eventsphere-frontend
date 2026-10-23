/**
 * Canonical mapping of Summit Exhibitors to their Official Booth Numbers
 * Verified against the official MPSS26 Floor Plan & Exhibitor Directory.
 */

export const OFFICIAL_EXHIBITOR_BOOTHS: Record<string, string> = {
  // Right Wall (Booths 1 - 17)
  'digicomm semi': '1, 2',
  'digicomm': '1, 2',
  'digicomm semiconductors': '1, 2',
  'new age instruments': '3, 4, 5',
  'new age instruments & materials pvt ltd': '3, 4, 5',
  'new age instruments and materials': '3, 4, 5',
  'rrcat': '6, 7',
  'raja ramanna centre for advanced technology': '6, 7',
  'bio line india': '8',
  'bioline': '8',
  'andgate informatics': '9',
  'andgate': '9',
  'vlsi experts': '10',
  'vlsi for all private ltd.': '10',
  'vlsi for all': '10',
  'rackbank': '11, 12',
  'rackbank datacenters pvt ltd': '11, 12',
  'rackbank datacenters': '11, 12',
  'impute inc. japan': '13, 14',
  'impute inc': '13, 14',
  'impute inc.': '13, 14',
  'impute japan': '13, 14',
  'analog devices': '15, 16',
  'nanodroits technology': '17',
  'nanodroits': '17',

  // Bottom Wall (Booths 18 - 21)
  'manit bhopal': '18',
  'manit': '18',
  'hlbs technologies': '19',
  'hlbs': '19',
  'jetwave': '20',
  'abv-iiitm gwalior': '21',
  'abv iiitm gwalior': '21',
  'abv-iiitm': '21',
  'iiitm gwalior': '21',

  // Left Wall (Booths 22 - 42)
  'agrihub iit indore': '22',
  'agrihub': '22',
  'daksh instruments': '23',
  'daksh instruments pvt ltd': '23',
  'davv incubation center': '24',
  'davv incubation': '24',
  'iet-davv indore': '25',
  'iet-davv': '25',
  'iet davv': '25',
  'setu manufacturing': '26',
  'setu manufacturing solutions': '26',
  'tulshree': '26',
  'nirji semicon': '27',
  'siliciom semiconductors': '27',
  'stemrobo': '28',
  'iiser bhopal / anuranan': '29',
  'iiser bhopal / anuraran': '29',
  'iiser bhopal': '29',
  'anuranan': '29',
  'anuraran': '29',
  'techno support core inn': '30',
  'techno support': '30',
  'vit bhopal': '31',
  'sgsits indore': '32',
  'sgsits': '32',
  'sgsts indore': '32',
  'sgsts': '32',
  'samvit logix': '33',
  'leadsoc technologies': '33',
  'medicaps': '34',
  'medi-caps': '34',
  'medicaps university': '34',
  'laxmishri pcb': '35',
  'laxmishri printed circuit boad': '35',
  'laxmishri': '35',
  'lakshmishri pcb': '35',
  'lakshmishri': '35',
  'mehtab intl agro trade': '36',
  'mehtab': '36',
  'prestige piemr / soaring': '37',
  'prestige piemr': '37',
  'piemr': '37',
  'soaring': '37',
  'acropolis institute': '38',
  'acropolis institute of tecnology and research, indore': '38',
  'acropolis': '38',
  'sage university': '39',
  'sage university indore': '39',
  'sagune university': '39',
  'sagune': '39',
  'sistec': '39',
  'sagar group of institutions, sistec, bhopal': '39',
  'ies university': '40',
  'technisum web solutions': '41',
  'technisum': '41',
  'technisium web solutions': '41',
  'technisium': '41',
  'oriental university': '42',

  // Top Wall (Booths 43 - 46)
  'htl co india': '43, 44',
  'htl co india pvt ltd': '43, 44',
  'scientech': '45, 46',

  // Center Upper Island (Booths 47-49 & 59-61)
  'svvv indore': '47',
  'svvv': '47',
  'futurewiz': '48',
  'pine training academy': '48',
  'truechip solutions': '49',
  'truechip': '49',
  'truechip solutions private limited': '49',
  'truesilicon': '49',
  'indiesemic': '59',
  'indiesemic private limited': '59',
  'shubham iot homes': '60, 61',
  'shubham iot': '60, 61',
  'shubham electrotech': '60, 61',
  'smart home automation': '60, 61',

  // Center Pavilions
  'mpidc': 'MPIDC Pavilion',
  'scl mohali': 'SCL Mohali Pavilion',
  'scl': 'SCL Mohali Pavilion',

  // Center Spine Island (Booths 50-58 & 62-70)
  'msme': '50, 51',
  'msme mp': '50, 51',
  'mpcst': '52, 53',
  'technical education': '54',
  'technical education mp': '54',
  'nielit': '54',
  'higher education': '55',
  'higher education mp': '55',
  'teradyne': '56',
  'pisarv innovations': '57',
  'pisarv': '57',
  'tourism': '58, 70',
  'mp tourism': '58, 70',
  'craftifai': '62',
  'craftai': '62',
  'spintronics ai': '62',
  'csir ceeri pilani': '63',
  'csir ceeri': '63',
  'mcte mhow': '64, 65',
  'mcte': '64, 65',
  'paras semi': '66, 67',
  'paras semiconductor': '66, 67',
  'triveni semiconductor india': '66, 67',
  'triveni': '66, 67',
  'nsdcs lab, iit indore': '68, 69',
  'nsdcs lab': '68, 69',
  'nsdcs lab iit indore': '68, 69',
  'nsdcs': '68, 69',

  // Bottom Pavilion & Nodal Partners
  'mpsedc': 'MPSEDC Pavilion',
  'cdac': 'R&D Partner Pavilion',
  'ism (india semiconductor mission)': 'MeitY / ISM Pavilion',
  'ism': 'MeitY / ISM Pavilion',
};

// Sort entries by key length descending so longer/more specific phrases match first
const SORTED_BOOTH_ENTRIES = Object.entries(OFFICIAL_EXHIBITOR_BOOTHS).sort(
  (a, b) => b[0].length - a[0].length
);

/**
 * Cleanly resolves the official booth number for any exhibitor company.
 * Filters out legacy / dummy backend booth strings (e.g. 'Hall 1 · A-01').
 */
export function getOfficialBoothNumber(companyName?: string, rawBooth?: string): string {
  if (!companyName) {
    if (rawBooth && !rawBooth.toLowerCase().includes('hall') && !rawBooth.includes('·') && rawBooth !== 'TBA') return rawBooth;
    return 'TBA';
  }

  const normalized = companyName.toLowerCase().trim();

  // 1. Direct dictionary match
  if (OFFICIAL_EXHIBITOR_BOOTHS[normalized]) {
    return OFFICIAL_EXHIBITOR_BOOTHS[normalized];
  }

  // 2. More specific to less specific prefix / substring / word match
  for (const [key, booth] of SORTED_BOOTH_ENTRIES) {
    if (key.length <= 4) {
      // Use word-boundary match for short acronyms like 'ism', 'mcte', 'scl'
      const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(normalized)) {
        return booth;
      }
    } else {
      if (normalized.includes(key) || (normalized.length >= 5 && key.includes(normalized))) {
        return booth;
      }
    }
  }

  // 3. Fallback to rawBooth if it's clean (doesn't contain dummy 'hall' or '·')
  if (rawBooth && !rawBooth.toLowerCase().includes('hall') && !rawBooth.includes('·') && rawBooth !== 'TBA') {
    return rawBooth;
  }

  return 'TBA';
}

/**
 * Formats a booth string into a clean UI badge label:
 * - "MPSEDC Pavilion" -> "MPSEDC Pavilion"
 * - "1, 2" -> "Booth 1, 2"
 * - "3, 4, 5" -> "Booth 3, 4, 5"
 * - "24" -> "Booth 24"
 */
export function formatBoothBadge(booth: string): string {
  if (!booth || booth === 'TBA') return 'Booth TBA';
  if (booth.toLowerCase().includes('pavilion') || booth.toLowerCase().startsWith('booth')) {
    return booth;
  }
  return `Booth ${booth}`;
}
