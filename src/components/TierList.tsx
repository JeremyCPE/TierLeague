import React, { useState, useRef } from 'react';
import { TeamTables } from './TeamTables';
import { fullteams } from '../data/teams';
import { initialPlayers } from '../data/players';
import { Player, TeamData} from '../types';
import LFLLogo from '../assets/lfl_logo.png'
import {Save} from 'lucide-react'
import { toPng } from 'html-to-image';

export const TierList: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [teamRanking, setTeamRanking] = useState<TeamData[]>(fullteams);
  const [loading, setLoading] = useState(false);

  const tableRef = useRef<HTMLDivElement>(null); 

  const saveAsPng = async () => {
    if (tableRef.current) {
      setLoading(true);
      tableRef.current.style.display = "block";
      const pngDataUrl = await toPng(tableRef.current, { quality: 1.0 });
      const link = document.createElement('a');
      link.download = 'my-lflrank2025';
      link.href = pngDataUrl;
      link.click();
      tableRef.current.style.display = "none";
      setLoading(false);
    }
  }

  const handleUpdatePlayerTier = (playerId: string, tier: string) => {
    setPlayers(currentPlayers =>
      currentPlayers.map(player =>
        player.id === playerId ? { ...player, tier } : player
      )
    );
  };

  const handleUpdateTeamRank = (team: TeamData, newRank: number) => {

    setTeamRanking((currentTeamRanks) => {
      const oldRank = team.rank;
  
      return currentTeamRanks.map((teamRank) => {
        
        if (teamRank.id === team.id) {
          return { ...teamRank, rank: newRank };
        }
  
        if (teamRank.rank === newRank) {
          return { ...teamRank, rank: oldRank };
        }  
        return teamRank;
      });
    })}

  return (
    <div>

    <div ref={tableRef} className='bg-black' style={{ display:"none", width: "1096px", height: "980px" }}>
        <div className='px-4 items-center flex justify-between'>
        <img src={LFLLogo} alt="LFL_Logo" className='w-20' />
        <h1 className="text-3xl font-bold text-left mb-8 text-white">
          Ranking Winter 2025
        </h1>  
        </div>
      <div className='grid grid-cols-5 gap-4'>
        {teamRanking.map(team => (
          <TeamTables
            key={team.id}
            team={team}
            players={players}
            onUpdatePlayerTier={handleUpdatePlayerTier}
            onUpdateTeamRank={handleUpdateTeamRank}
          />
        ))}
      </div>
    </div>

      <div className='bg-black'>
        <div className='px-4 items-center flex justify-between'>
        <img src={LFLLogo} alt="LFL_Logo" className='w-20' />
        <h1 className="text-3xl font-bold text-left mb-8 text-white">
          Ranking Winter 2025
        </h1> 
      </div>
      <div className='grid md:grid-cols-5 gap-4 mx-auto'>
          {teamRanking.map(team => (
            <TeamTables
              key={team.id}
              team={team}
              players={players}
              onUpdatePlayerTier={handleUpdatePlayerTier}
              onUpdateTeamRank={handleUpdateTeamRank}
            />
          ))}

      </div>
      </div>
      <div className='flex'>
            <button onClick={saveAsPng}
            className="bg-[#251c0d] text-white px-8 py-3 rounded-full flex items-end gap-2 hover:bg-[#15100c] transition-colors">
                <Save className="w-5 h-5" />
                Export
            </button>   
            {loading && <div className="spinner"></div>}
      </div>

    </div>
  );
};