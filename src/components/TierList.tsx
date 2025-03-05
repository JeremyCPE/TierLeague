import React, { useState, useEffect, forwardRef } from 'react'
import { TeamsTables } from './TeamsTables'
import { Player, Team } from '../types'
import { RolesTables } from './RolesTables'

interface TierListProps {
  fullplayers: Player[]
  fullteams: Team[]
  onPlayersChange: (players: Player[]) => void
  onTeamsChange: (teams: Team[]) => void
  rankingMode: string
}

export const TierList = React.memo(forwardRef<HTMLDivElement, TierListProps>(({ fullplayers, fullteams, onPlayersChange, onTeamsChange, rankingMode }, ref) => {
  console.log('tierList render');

  const [players, setPlayers] = useState<Player[]>(fullplayers)
  const [teamsRanking, setTeamRanking] = useState<Team[]>(fullteams)

  useEffect(() => {
    if (JSON.stringify(players) !== JSON.stringify(fullplayers)) {
      console.log('tierList render2');
      setPlayers(fullplayers);
    }
  }, [fullplayers]);

  useEffect(() => {
    if (JSON.stringify(teamsRanking) !== JSON.stringify(fullteams)) {
      console.log('tierList render3');
      setTeamRanking(fullteams);
    }
  }, [fullteams]);

  const updatePlayerTier = (playerId: string, tier: string) => {
    const updatedPlayers = players.map(p => (p.id === playerId ? { ...p, tier } : p))
    setPlayers(updatedPlayers)
    onPlayersChange(updatedPlayers)
  }

  const updateTeamRank = (team: Team, newRank: number) => {

    const updatedTeams = teamsRanking.map(t =>
      t.id === team.id ? { ...t, rank: newRank } : t.rank === newRank ? { ...t, rank: team.rank } : t
    )
    setTeamRanking(updatedTeams)
    onTeamsChange(updatedTeams)
  }

  const renderRanking = (hideChevron: boolean) => {
    if (rankingMode === 'teams') {
      return (
        <div className="grid grid-cols-5 gap-4">
          {teamsRanking.map(team => (
            <TeamsTables
              key={team.id}
              team={team}
              teamsLength={teamsRanking.length}
              players={players}
              onUpdatePlayerTier={updatePlayerTier}
              onUpdateTeamRank={updateTeamRank}
              hideChevron={hideChevron}
            />
          ))}
        </div>
      )
    } else {
      return (
        <RolesTables
          players={players}
        />
      )
    }
  }

  return (
    <div ref={ref} className="bg-[#251c0d]">
      {renderRanking(false)}
      <footer className="text-gray-400 text-xs text-center mt-6">
        <p>@_RedSeeds @than_ontweeter @VongoSanDi</p>
      </footer>
    </div>
  )
}
))
