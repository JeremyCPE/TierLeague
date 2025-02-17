
export interface Player {
  id: string;
  name: string;
  teamId: number;
  teamName: string;
  logo: string;
  role: string;
  tier: string;
}

export interface Team {
  id: number;
  name: string;
  rank: number;
  logo: string;
}

export interface Tier {
  tier: string;
  color: string;
}


export interface ExcelPosition {
  columnTeam: string;
  columnRank: string;
  startRow: number;
}
