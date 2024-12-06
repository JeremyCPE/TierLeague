import React, { useState, useRef } from 'react';
import { TeamTables } from './TeamTables';
import { fullteams } from '../data/teams';
import { initialPlayers } from '../data/players';
import { Player, TeamData} from '../types';
import LFLLogo from '../assets/lfl_logo.png'
import {Save} from 'lucide-react'
import { toPng } from 'html-to-image';
import Modal from './Modal';

export const TierList: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [teamRanking, setTeamRanking] = useState<TeamData[]>(fullteams);
  const [imagePreview, setImagePreview] = React.useState(String); 
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const tableRef = useRef(null); 

  const saveAsPng = async () => {
    if (tableRef.current) {
      const pngDataUrl = await toPng(tableRef.current, { quality: 1.0 });
      setImagePreview(pngDataUrl); 
      setIsModalOpen(true); 
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
    <div ref={tableRef}>
      <div className='px-4 items-center flex justify-between'>
      <img src={LFLLogo} alt="LFL_Logo" className='w-20' />
      <h1 className="text-3xl font-bold text-left mb-8 text-white">
        Ranking Winter 2025
      </h1>  

      {/* Image Preview */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className="text-lg font-semibold text-center mb-4">PNG Preview</h3>
        <div className="flex justify-center items-center h-64 overflow-hidden">
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Tier Table Preview"
              className="max-w-full max-h-full"
            />
          )}
        </div>
        <div className="mt-4 text-center">
          <a
            href={imagePreview}
            download="tier-table.png"
            className="px-4 py-2 bg-orange-900 text-white rounded-lg hover:bg-orange-950"
          >
            Download PNG
          </a>
        </div>
      </Modal>
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
          <button onClick={saveAsPng}
          className="bg-[#251c0d] text-white px-8 py-3 rounded-full flex items-end gap-2 hover:bg-[#15100c] transition-colors">
              <Save className="w-5 h-5" />
              Export
          </button>   
    </div>
  );
};