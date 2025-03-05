import React from 'react';
import { Team } from '../types';

interface TeamRankInputProps {
  team: Team;
  teamsLength: number;
  rank: number;
  hideChevron: boolean;
  onUpdateRank: (team: Team, rank: number) => void;
}

export const TeamsRankInput: React.FC<TeamRankInputProps> = ({ team, teamsLength, rank, onUpdateRank, hideChevron }) => {

  // C'est normal que le rank s'initialise à 1 et non pas à 0, car le rank 0
  return (
    <div className="flex space-x-2">
      <select
        value={rank}
        onChange={(e) => onUpdateRank(team, parseInt(e.target.value, 10))}
        className={`w-12 h-12 inline-flex items-center rounded-full border border-white-500 bg-[#251c0d] text-white text-center text-lg font-bold cursor-pointer ${hideChevron ? 'appearance-none' : ''}`}
      >
        {Array.from({ length: teamsLength }, (_, i) => i + 1).map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>
    </div>
  );
};
