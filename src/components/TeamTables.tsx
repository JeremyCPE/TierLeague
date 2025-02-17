import React from 'react';
import { Player, } from '../types';
import { roleLogos } from '../data/roles';
import { tierLevel } from '../data/tiers';
import { TeamRankInput } from './TeamRankInput';
import { Team } from '../types';

interface TeamTableProps {
  team: Team;
  teamsLength: number;
  players: Player[];
  onUpdatePlayerTier: (playerId: string, tier: string) => void;
  onUpdateTeamRank: (team: Team, rank: number) => void;
  hideChevron: boolean
}

export const TeamTables: React.FC<TeamTableProps> = ({
  team,
  teamsLength,
  players,
  onUpdatePlayerTier,
  onUpdateTeamRank,
  hideChevron
}) => {
  const teamPlayers = players.filter(player => player.teamId === team.id);

  if (teamPlayers.length === 0) return null;

  return (
    <div className="m-4">
      <div className="flex items-center mb-4 justify-between">
        <img src={team.logo} className='w-1/4 h-1/4'></img>
        <h2 className="text-lg font-bold text-white text-center">{team.name}</h2>
        <div className="flex items-center space-x-4">
          <TeamRankInput
            team={team}
            teamsLength={teamsLength}
            rank={team.rank}
            onUpdateRank={onUpdateTeamRank}
            hideChevron={hideChevron}
          />
        </div>

      </div>
      <div className="rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
            </tr>
          </thead>
          <tbody className="">
            {teamPlayers.map((player) => {

              const RoleLogo = roleLogos[player.role as keyof typeof roleLogos];
              let playerColor = tierLevel.find(d => d.tier === player.tier)?.color
              if (!playerColor) {
                playerColor = "#FFFFFF"
              }

              return (
                <tr key={player.id}>
                  <td className="pl-0 py-2 whitespace-nowrap flex items-center">
                    <img src={RoleLogo} className='w-8 h-8 text-white'></img>
                    <span className="text-left font-bold text-white pl-2">{player.name}</span>
                  </td>
                  <td className="whitespace-nowrap items-end w-10">
                    <select
                      className={`items-center text-lg rounded-lg bg-[#251c0d] hover:bg-[#15100c] ${hideChevron ? 'appearance-none' : ''} text-left font-bold`}
                      style={{ color: playerColor }}
                      value={player.tier}
                      onChange={(e) => onUpdatePlayerTier(player.id, e.target.value)}
                    >
                      {tierLevel.map((tier, index) => (
                        <option
                          key={index}
                          value={tier.tier}
                          className={`${tier.color}`}
                        >
                          {tier.tier}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
