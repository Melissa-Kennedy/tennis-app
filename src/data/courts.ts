import { Address } from '../types/Address';
import addressesData from './addresses.json';

export const courts: Address[] = addressesData;

export const courtsById = new Map(courts.map((court) => [court.id, court]));
