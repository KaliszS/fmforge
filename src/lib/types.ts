export interface Player {
  record_type: "DETAILED_FUTURE_REGEN" | "SUPPORT STAFF";
  first_name: string;
  common_name?: string;
  last_name: string;
  birth_date: string;
  nationality_id: number;
  favourite_team_id?: number;
  ethnicity: number;
  skin_tone: number;
  hair_color: number;
  height: number;
  weight: number;
  preferred_foot: number;
  position: string;
  favourite_number?: number;
  birth_city?: string;
  ca: number;
  pa: number;
  club_id: number;
}

export type PlayerRecord = {
  id: number;
  player: Player;
};

export type Country = {
  code: string;
  name: string;
};

export type CountryMap = Record<number, Country>;

export type ClubMap = Record<number, string>;
