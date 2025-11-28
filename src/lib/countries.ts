import countriesData from '../data/countries.json';
import type { CountryMap } from './types';

export const countryMap: CountryMap = countriesData as unknown as CountryMap;
