import React, { useState, useEffect } from 'react'
import { TeamTables } from './TeamTables'
import { Player, Team } from '../types'
import { toPng } from 'html-to-image'

interface TierListProps {
  fullplayers: Player[]
  fullteams: Team[]
  logo?: string
  onPlayersChange: (players: Player[]) => void
  onTeamsChange: (teams: Team[]) => void
}

export const TierList: React.FC<TierListProps> = ({ fullplayers, fullteams, logo, onPlayersChange, onTeamsChange }) => {
  const [players, setPlayers] = useState<Player[]>(fullplayers)
  const [teamRanking, setTeamRanking] = useState<Team[]>(fullteams)

  useEffect(() => {
    setPlayers(fullplayers)
    setTeamRanking(fullteams)
  }, [fullplayers, fullteams])

  const updatePlayerTier = (playerId: string, tier: string) => {
    const updatedPlayers = players.map(p => (p.id === playerId ? { ...p, tier } : p))
    setPlayers(updatedPlayers)
    onPlayersChange(updatedPlayers)
  }

  const saveAsPng = async () => {
    if (tableRef.current) {
      const pngDataUrl = await toPng(tableRef.current, { quality: 1.0 })
      const link = document.createElement('a')
      link.download = 'my-rank2025.png'
      link.href = pngDataUrl
      link.click()
    }
  }

  const updateTeamRank = (team: Team, newRank: number) => {

    const updatedTeams = teamRanking.map(t =>
      t.id === team.id ? { ...t, rank: newRank } : t.rank === newRank ? { ...t, rank: team.rank } : t
    )
    setTeamRanking(updatedTeams)
    onTeamsChange(updatedTeams)
  }

  const renderRanking = (hideChevron: boolean) => (
    <div className="grid grid-cols-5 gap-4">
      {teamRanking.map(team => (
        <TeamTables
          key={team.id}
          team={team}
          teamsLength={teamRanking.length}
          players={players}
          onUpdatePlayerTier={updatePlayerTier}
          onUpdateTeamRank={updateTeamRank}
          hideChevron={hideChevron}
        />
      ))}
    </div>
  )

  return (
    <div className="bg-[#251c0d]">
      <div className="px-4 py-4 flex items-center">
        {logo && <img src={logo} alt="Competition Logo" className="w-16" />}
        <h1 className="text-2xl text-white ml-4 mt-8">Ranking Winter 2025</h1>
      </div>
      {renderRanking(false)}
      <p className="text-gray-400 text-xs text-right">@_RedSeeds @than_ontweeter @VongoSanDi</p>
    </div>
  )
}
