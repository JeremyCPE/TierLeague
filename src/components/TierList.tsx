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
  const [isVisible, setIsVisible] = useState(true)

  // On check si on affiche le tuto ou pas
  useEffect(() => {
    if (players.length === 0) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [players, setIsVisible])

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
      {isVisible && <section className='text-white mt-4 mx-5'>
        <h2 className="text-lg font-semibold">Bienvenue sur notre site</h2>
        <p>
          Ce site vous permet de classer les joueurs et les équipes selon leurs performances.
          Vous pouvez importer un fichier Excel et modifier les classements en fonction de vos besoins.
        </p>
        <ul className='mt-4 list-disc'>
          <li>Vous pouvez soit télécharger le template depuis ce <a href="https://github.com/JeremyCPE/LFLTierList/template/blob/main/Template.xlsx" className='font-bold text-xl'>lien</a> ou bien importer un document Excel au format xlsx depuis votre ordinateur local.
          </li>
          <li>
            Une fois le document importé, si votre document Excel comporte plusieurs feuilles, vous devez sélectionner une feuille de travail.
          </li>
          <li>
            Si vous faites des modifications sur une feuille et que vous changez de feuille de travail en cours de route, les modifications ne seront pas sauvegardées.
          </li>
          <li>Une fois les modifications faites, vous pouvez exporter les modifications dans un nouveau document xlsx(attention le nom du nouveau document sera par défaut le nom du document importé, vous pouvez soit remplacer votre ancien fichier par le nouveau ou bien créer une nouveau document) et/ou au format png pour ensuite pouvoir partagez votre tier tier sur X ou ailleurs.
          </li>
        </ul>
      </section>}
      <footer className="text-gray-400 text-xs text-center mt-6">
        <p>@_RedSeeds @than_ontweeter @VongoSanDi</p>
      </footer>
    </div>
  )
}
)
