import clubsData from '../data/clubs.json';
import type { ClubMap } from './types';

export const clubMap: ClubMap = clubsData as unknown as ClubMap;
