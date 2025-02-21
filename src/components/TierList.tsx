import { useState, useEffect, forwardRef } from 'react'
import { TeamTables } from './TeamTables'
import { Player, Team } from '../types'

interface TierListProps {
  fullplayers: Player[]
  fullteams: Team[]
  logo?: string
  onPlayersChange: (players: Player[]) => void
  onTeamsChange: (teams: Team[]) => void
}

export const TierList = forwardRef<HTMLDivElement, TierListProps>(({ fullplayers, fullteams, logo, onPlayersChange, onTeamsChange }, ref) => {
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
    <div ref={ref} className="bg-[#251c0d]">
      <div className="px-4 py-4 flex items-center w-25">
        {logo && <img src={logo} alt="Competition Logo" className="w-16" />}
        <h1 className="text-2xl text-white ml-4 mt-8">Ranking Teams </h1>
      </div>
      {renderRanking(false)}
      <footer className="text-gray-400 text-xs text-center mt-6">
        <p>@_RedSeeds @than_ontweeter @VongoSanDi</p>
      </footer>
    </div>
  )
}
)
