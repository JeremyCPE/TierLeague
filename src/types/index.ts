export interface Player {
  id: string;
  name: string;
  teamId: number;
  role: string;
  tier: Tier
}

export interface TeamData {
  id : number;
  name: string;
  rank: number;
  logo : string;
}

export interface Tier {
    tier : string;
    color : string;
}