import React from 'react';
import { totalTeams } from '../data/teams';
import { TeamData } from '../types';

interface TeamRankInputProps {
  team: TeamData;
  rank: number;
  onUpdateRank: (team: TeamData, rank: number) => void;
}

export const TeamRankInput: React.FC<TeamRankInputProps> = ({ team, rank, onUpdateRank }) => {
  return (
    <div className="flex space-x-2">
      <select
        value={rank}
        onChange={(e) => onUpdateRank(team, parseInt(e.target.value, 10))}
        className="w-12 h-12 inline-flex items-center rounded-full border border-white-500 bg-[#251c0d] text-white text-center text-lg font-bold cursor-pointer"
      >
        {Array.from({ length: totalTeams }, (_, i) => i + 1).map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>
    </div>
  );
};