import React from 'react';
import { Player, } from '../types';
import { roleLogos } from '../data/roles';
import { tierLevel } from '../data/tiers';
import { TeamRankInput } from './TeamRankInput';
import { TeamData } from '../types';

interface TeamTableProps {
  team: TeamData;
  players: Player[];
  onUpdatePlayerTier: (playerId: string, tier: string) => void;
  onUpdateTeamRank: (team: TeamData, rank: number) => void;
}

export const TeamTables: React.FC<TeamTableProps> = ({ 
  team, 
  players, 
  onUpdatePlayerTier,
  onUpdateTeamRank 
}) => {
  const teamPlayers = players.filter(player => player.teamId === team.id);

  if (teamPlayers.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4 justify-between ml-4 mr-4">
          <img src={team.logo} className='w-1/5 h-1/5'></img>
          <h2 className="text-lg font-bold text-white text-center">{team.name}</h2>
          <div className="flex items-center space-x-4">
          <TeamRankInput
            team={team}
            rank={team.rank}
            onUpdateRank={onUpdateTeamRank}
          />
        </div>

      </div>
      <div className="bg-[#251c0d] rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
            </tr>
          </thead>
          <tbody className="bg-[#251c0d] divide-y divide-gray-200">
            {teamPlayers.map((player) => {

              const RoleLogo = roleLogos[player.role as keyof typeof roleLogos];
              let playerColor = tierLevel.find(d => d.tier === player.tier)?.color
              if(!playerColor)
              {
                playerColor = "#FFFFFF"
              }

              
              return (
                <tr key={player.id}>
                  <td className="pl-0 py-4 whitespace-nowrap flex items-center">
                    <img src={RoleLogo} className='w-10 h-10 text-white'></img>
                    <span className="text-left font-bold text-white">{player.name}</span>
                  </td>
                  <td className="whitespace-nowrap items-end w-10">
                    <select
                      className='items-center rounded-lg bg-[#251c0d] hover:bg-[#15100c]'
                      style={{ color: playerColor, direction:"rtl"} }
                      value={player.tier}
                      onChange={(e) => onUpdatePlayerTier(player.id, e.target.value)}
                    >
                      {tierLevel.map((tier,index) => (
                        <option 
                          key={index} 
                          value={tier.tier}
                          style={{ color: tier.color} }
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