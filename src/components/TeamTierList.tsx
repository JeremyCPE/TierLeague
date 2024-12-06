import React from 'react';
import { Player } from '../types';
import { TeamData } from '../types';
import { tierLevel } from '../data/tiers';

interface TeamTierListProps {
  players: Player[];
  teams: TeamData[]
}

export const TeamTierList: React.FC<TeamTierListProps> = ({ players, teams }) => {
  const getTeamTierCount = (teamId: number, tier: string) => {
    return players.filter((player) => player.teamId === teamId && player.tier === tier).length;
  };

  // Sort teams by their rank
  const sortedTeams = teams.sort();

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Team-based Tier Distribution</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team (Rank)
              </th>
              {tierLevel.map((tier,index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {tier.tier}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedTeams.map((team) => (
              <tr key={team.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  {team.rank} (#{team.rank})
                </td>
                {tierLevel.map((tier,index) => (
                  <td key={index} className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTeamTierCount(team.id, tier.tier)}`}>
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};