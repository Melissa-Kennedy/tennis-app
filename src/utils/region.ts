import { Address } from '../types/Address';

export const REGIONS = ['Toronto', 'North York', 'Etobicoke', 'Scarborough', 'East York', 'York'];

/** Former-municipality name taken from the address, e.g. "43 Ancaster Rd, North York, ON M3K 1K8" -> "North York" */
export function getRegion(court: Address): string {
  const parts = court.address.split(',').map((part) => part.trim());
  const candidate = parts.length >= 3 ? parts[parts.length - 2] : parts[0];
  return REGIONS.includes(candidate) ? candidate : 'Toronto';
}
