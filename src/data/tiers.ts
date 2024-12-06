import { Tier } from "../types";

const COLORS = {
  RED: '#ff1b0e',
  YELLOW: '#ffeb38',
  GREEN: '#58fd3a',
  BLUE: '#4b92fd',
  PURPLE: '#c543fc',
  WHITE: '#FFFFFF',
};

export const tierLevel: Tier[] = [
  { tier: '_', color: COLORS.WHITE },
  { tier: 'G', color: COLORS.RED },
  { tier: 'S+', color: COLORS.YELLOW },
  { tier: 'S', color: COLORS.YELLOW },
  { tier: 'A+', color: COLORS.GREEN },
  { tier: 'A', color: COLORS.GREEN },
  { tier: 'B+', color: COLORS.BLUE },
  { tier: 'B', color: COLORS.BLUE },
  { tier: 'C', color: COLORS.PURPLE },
];
