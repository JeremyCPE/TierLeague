import { Tier } from "../types";

export const roles = ["Toplaner", "Jungle", "Midlaner", "Botlaner", "Support"]

export const tierLevel: Tier[] = [
  { tier: '-', color: 'text-white' },
  { tier: 'G', color: 'text-red-600' },
  { tier: 'S+', color: 'text-yellow-400' },
  { tier: 'S', color: 'text-yellow-300' },
  { tier: 'S-', color: 'text-yellow-200' },
  { tier: 'A+', color: 'text-green-400' },
  { tier: 'A', color: 'text-green-300' },
  { tier: 'A-', color: 'text-green-200' },
  { tier: 'B+', color: 'text-blue-400' },
  { tier: 'B', color: 'text-blue-300' },
  { tier: 'B-', color: 'text-blue-200' },
  { tier: 'C', color: 'text-purple-400' },
];

