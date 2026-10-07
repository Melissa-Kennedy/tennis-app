import { Address } from '../types/Address';
import { Visit } from '../types/Passport';
import { getRegion, REGIONS } from './region';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  /** Short glyph shown in the centre of the medal */
  glyph: string;
  current: number;
  goal: number;
}

export interface RegionVisa {
  region: string;
  visited: number;
  total: number;
  /** Date of the first visit in this region, if any */
  firstVisit?: string;
}

export function getAchievements(stamped: Visit[], courtsById: Map<string, Address>): Achievement[] {
  const count = stamped.length;
  const stampedCourts = stamped.map((visit) => courtsById.get(visit.courtId)).filter(Boolean) as Address[];
  const lit = stampedCourts.filter((court) => court.lights === 'Yes').length;
  const winter = stampedCourts.filter((court) => court.winterplay === 'Yes').length;
  const reviews = stamped.filter((visit) => visit.review.length > 0).length;
  const photos = stamped.filter((visit) => visit.photoId).length;
  const regions = new Set(stampedCourts.map(getRegion)).size;
  const total = courtsById.size;

  const milestones: Achievement[] = [
    { id: 'first-serve', title: 'First Serve', description: 'Stamp your first court', glyph: '1', current: count, goal: 1 },
    { id: 'rally', title: 'Rally', description: 'Stamp 5 courts', glyph: '5', current: count, goal: 5 },
    { id: 'double-digits', title: 'Double Digits', description: 'Stamp 10 courts', glyph: '10', current: count, goal: 10 },
    { id: 'quarter', title: 'Quarter Final', description: 'Stamp 25 courts', glyph: '25', current: count, goal: 25 },
    { id: 'halfway', title: 'Halfway Set', description: `Stamp ${Math.ceil(total / 2)} courts`, glyph: '½', current: count, goal: Math.ceil(total / 2) },
    { id: 'grand-slam', title: 'Grand Slam', description: 'Stamp every court in the city', glyph: '★', current: count, goal: total },
    { id: 'night-match', title: 'Night Match', description: 'Play 3 courts with lights', glyph: '☾', current: lit, goal: 3 },
    { id: 'winter', title: 'Winter Warrior', description: 'Play 3 courts with winter play', glyph: '❄', current: winter, goal: 3 },
    { id: 'critic', title: 'Line Judge', description: 'Write 5 reviews', glyph: '✎', current: reviews, goal: 5 },
    { id: 'shutterbug', title: 'Photo Finish', description: 'Add 5 photos', glyph: '◉', current: photos, goal: 5 },
    { id: 'explorer', title: 'City Explorer', description: `Stamp a court in all ${REGIONS.length} districts`, glyph: '✦', current: regions, goal: REGIONS.length },
  ];

  return milestones;
}

export function getRegionVisas(stamped: Visit[], courts: Address[], courtsById: Map<string, Address>): RegionVisa[] {
  return REGIONS.map((region) => {
    const regionVisits = stamped.filter((visit) => {
      const court = courtsById.get(visit.courtId);
      return court && getRegion(court) === region;
    });
    return {
      region,
      visited: regionVisits.length,
      total: courts.filter((court) => getRegion(court) === region).length,
      firstVisit: regionVisits[0]?.date,
    };
  });
}
