import { getOfficialBoothNumber } from './officialBooths';

/**
 * Extracts the first numeric value from a booth string.
 * Examples: "1-2" -> 1, "1, 2" -> 1, "Booth 9" -> 9, "56-57" -> 56, "58, 70" -> 58
 */
export const getBoothNumber = (boothStr?: string): number | null => {
  if (!boothStr) return null;
  const match = boothStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
};

/**
 * Checks if the exhibitor is MPSEDC (State Nodal Agency).
 */
export const isMpsedcExhibitor = (ex: { company?: string; booth?: string }): boolean => {
  const comp = (ex.company || '').trim().toLowerCase();
  const booth = (getOfficialBoothNumber(ex.company, ex.booth) || '').toLowerCase();
  return comp.includes('mpsedc') || booth.includes('mpsedc');
};

/**
 * Checks if the exhibitor is pavilion-only (without a booth number), excluding MPSEDC.
 */
export const isPavilionOnlyExhibitor = (ex: { company?: string; booth?: string }): boolean => {
  if (isMpsedcExhibitor(ex)) return false;
  const booth = (getOfficialBoothNumber(ex.company, ex.booth) || '').toLowerCase();
  const num = getBoothNumber(booth);
  return booth.includes('pavilion') || num === null;
};

/**
 * Sorts exhibitors:
 * 1. MPSEDC first
 * 2. Ascending sequence by official booth number (Booth 1, 2, 3...)
 * 3. Exhibitors with only pavilion (except MPSEDC) in the last positions
 */
export const sortExhibitors = <T extends { company: string; booth?: string }>(exhibitors: T[]): T[] => {
  // Deduplicate exhibitors by company name so each exhibitor appears only once
  const seen = new Set<string>();
  const uniqueExhibitors = exhibitors.filter((e) => {
    const key = (e.company || '').toLowerCase().trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return uniqueExhibitors.sort((a, b) => {
    // 1. MPSEDC is always first
    const aIsMp = isMpsedcExhibitor(a);
    const bIsMp = isMpsedcExhibitor(b);
    if (aIsMp && !bIsMp) return -1;
    if (!aIsMp && bIsMp) return 1;
    if (aIsMp && bIsMp) return 0;

    // 2. Pavilion-only exhibitors (except MPSEDC) go to the very end
    const aPav = isPavilionOnlyExhibitor(a);
    const bPav = isPavilionOnlyExhibitor(b);
    if (!aPav && bPav) return -1;
    if (aPav && !bPav) return 1;
    if (aPav && bPav) {
      return a.company.localeCompare(b.company);
    }

    // 3. Both have booth numbers: sort in numeric sequence (Booth 1, Booth 2, ...)
    const aOfficial = getOfficialBoothNumber(a.company, a.booth);
    const bOfficial = getOfficialBoothNumber(b.company, b.booth);
    const aNum = getBoothNumber(aOfficial) ?? 999999;
    const bNum = getBoothNumber(bOfficial) ?? 999999;
    if (aNum !== bNum) {
      return aNum - bNum;
    }

    // Secondary tie-breaker by company name
    return a.company.localeCompare(b.company);
  });
};
