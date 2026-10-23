import { ExhibitorStats } from '../types';

/**
 * Generates a clean URL slug from a company name.
 * e.g.:
 *  "MPSEDC" -> "mpsedc"
 *  "Truechip Solutions" -> "truechip-solutions"
 *  "TrueSilicon" -> "truesilicon"
 *  "CDAC" -> "cdac"
 */
export function getCompanySlug(companyName: string): string {
  return companyName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Returns the canonical slug for an exhibitor.
 * Defaults to the company slug, falling back to ID if slug is empty.
 */
export function getExhibitorSlug(exhibitor: ExhibitorStats): string {
  const slug = getCompanySlug(exhibitor.company);
  return slug || exhibitor.id;
}

const SLUG_ALIASES: Record<string, string> = {
  'sgsts-indore': 'sgsits-indore',
  'sgsits-indore': 'sgsts-indore',
  'lakshmishri-pcb': 'laxmishri-pcb',
  'laxmishri-pcb': 'lakshmishri-pcb',
  'sagune-university': 'sage-university',
  'sage-university': 'sagune-university',
  'technisium-web-solutions': 'technisum-web-solutions',
  'technisum-web-solutions': 'technisium-web-solutions',
  'craftai': 'craftifai',
  'craftifai': 'craftai',
  'tourism': 'mp-tourism',
  'mp-tourism': 'tourism',
  'mcte': 'mcte-mhow',
  'mcte-mhow': 'mcte',
  'iiser-bhopal': 'iiser-bhopal-anuranan',
  'iiser-bhopal-anuranan': 'iiser-bhopal',
};

/**
 * Finds an exhibitor from a list using either:
 * 1) Exact ID match (e.g. "exh-1")
 * 2) Company slug match (e.g. "mpsedc", "truechip-solutions")
 * 3) Alias slug match (e.g. "sgsts-indore" <-> "sgsits-indore")
 * 4) Case-insensitive company name match
 */
export function findExhibitorBySlug(
  exhibitors: ExhibitorStats[],
  slug: string
): ExhibitorStats | undefined {
  if (!slug) return undefined;
  const normalizedSlug = slug.toLowerCase().trim();
  const aliasSlug = SLUG_ALIASES[normalizedSlug];

  return exhibitors.find((e) => {
    if (e.id.toLowerCase() === normalizedSlug) return true;
    const eSlug = getCompanySlug(e.company);
    if (eSlug === normalizedSlug || (aliasSlug && eSlug === aliasSlug)) return true;
    if (e.company.toLowerCase().trim() === normalizedSlug) return true;
    if (eSlug && (normalizedSlug.includes(eSlug) || eSlug.includes(normalizedSlug))) return true;
    return false;
  });
}
