
import { useState } from "react"
import { Player } from "../types"
import { roles, tierLevel } from "../data/common.data" // Liste des tiers

interface RolesTablesProps {
  players: Player[]
}

export const RolesTables: React.FC<RolesTablesProps> = ({ players }) => {
  console.log("rolesTables render", players)

  const playersByRole = roles.map((role) => ({
    role,
    players: [] as Player[]
  }))

  players.forEach(player => {
    const roleGroup = playersByRole.find(group => group.role === player.role)
    if (roleGroup) {
      roleGroup.players.push(player)
    }
  })

  // États pour stocker les joueurs classés (nom + tier)
  const [rankedPlayers, setRankedPlayers] = useState<{ [role: string]: ({ name: string, tier: string } | null)[] }>(
    Object.fromEntries(playersByRole.map(({ role }) => [role, Array(10).fill(null)]))
  )

  // États pour stocker les joueurs en attente par rôle
  const [availablePlayers, setAvailablePlayers] = useState<{ [role: string]: Player[] }>(
    Object.fromEntries(playersByRole.map(({ role, players }) => [role, [...players]]))
  )

  /** Met à jour une cellule d’un tableau classé */
  const updateRankedPlayer = (role: string, rowIndex: number, playerName: string) => {
    const player = availablePlayers[role].find((p) => p.name === playerName)
    if (!player) return // Vérification pour éviter d'ajouter un joueur inexistant

    setRankedPlayers((prev) => {
      const updatedRolePlayers = [...prev[role]]
      updatedRolePlayers[rowIndex] = { name: playerName, tier: "-" } // Ajout avec tier par défaut
      return { ...prev, [role]: updatedRolePlayers }
    })

    // Retirer le joueur de la liste des joueurs en attente
    setAvailablePlayers((prev) => ({
      ...prev,
      [role]: prev[role].filter((p) => p.name !== playerName),
    }))
  }

  /** Met à jour le tier du joueur */
  const updateTier = (role: string, rowIndex: number, newTier: string) => {
    setRankedPlayers((prev) => {
      const updatedRolePlayers = [...prev[role]]
      if (updatedRolePlayers[rowIndex]) {
        updatedRolePlayers[rowIndex] = { ...updatedRolePlayers[rowIndex]!, tier: newTier }
      }
      return { ...prev, [role]: updatedRolePlayers }
    })
  }

  /** Supprime un joueur classé et le remet dans la liste d'attente */
  const removeRankedPlayer = (role: string, rowIndex: number) => {
    const playerData = rankedPlayers[role][rowIndex]

    if (playerData) {
      const playerToReturn = playersByRole.find((group) => group.role === role)?.players.find((p) => p.name === playerData.name)

      if (playerToReturn) {
        setAvailablePlayers((prev) => ({
          ...prev,
          [role]: [...prev[role], playerToReturn], // Remet le joueur en attente
        }))
      }
    }

    setRankedPlayers((prev) => {
      const updatedRolePlayers = [...prev[role]]
      updatedRolePlayers[rowIndex] = null // Vide la cellule
      return { ...prev, [role]: updatedRolePlayers }
    })
  }



  return (
    <div className="flex flex-col space-y-2 px-4">
      {/* TABLEAUX DE CLASSEMENT */}
      <div className="grid grid-cols-5 gap-4 py-0">
        {playersByRole.map(({ role }) => (
          <div key={role} className="w-full">
            <h2 className="text-lg font-bold text-white text-center mb-1">{role}</h2>
            <table className="w-full border-collapse border border-gray-600">
              <tbody>
                {rankedPlayers[role].map((playerData, rowIndex) => {

                  const playerColor = tierLevel.find(d => d.tier === playerData?.tier)?.color

                  return (
                    <tr key={rowIndex} className="border border-gray-600 py-8">
                      {/* Bouton de suppression */}
                      <td className="py-1">
                        {playerData && (
                          <button
                            onClick={() => removeRankedPlayer(role, rowIndex)}
                            className="ml-2 px-2 py-1 text-sm bg-red-600 text-white rounded"
                          >
                            X
                          </button>
                        )}
                      </td>
                      <td className="px-1 py-1 text-white flex items-center space-x-2 w-32">
                        {/* Input avec autocomplétion */}
                        <input
                          type="text"
                          className="bg-gray-700 text-white p-1 rounded w-full"
                          list={`autocomplete-${role}-${rowIndex}`}
                          value={playerData?.name || ""}
                          onChange={(e) => updateRankedPlayer(role, rowIndex, e.target.value)}
                          onBlur={(e) => {
                            if (!e.target.value) removeRankedPlayer(role, rowIndex)
                          }}
                          spellCheck={false}
                        />
                        <datalist id={`autocomplete-${role}-${rowIndex}`}>
                          {availablePlayers[role].map((player) => (
                            <option key={player.id} value={player.name} />
                          ))}
                        </datalist>
                      </td>
                      {/* Sélection du tier */}
                      <td className="p-1">
                        {playerData && (
                          <select
                            className={`bg-gray-700 p-1 rounded w-12 ${playerColor}`}
                            value={playerData.tier}
                            onChange={(e) => updateTier(role, rowIndex, e.target.value)}
                          >
                            {tierLevel.map((tier) => (
                              <option key={tier.tier} value={tier.tier} className={`${tier.color}`}
                              >
                                {tier.tier}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* LISTE DES JOUEURS EN ATTENTE */}
      <div className="grid grid-cols-5 gap-4">
        {playersByRole.map(({ role }) => (
          <div key={role} className="w-full">
            <h2 className="text-lg font-bold text-white text-center mb-2 pb-1">Joueurs disponibles {role}</h2>
            <div className="border border-gray-600 p-2 rounded">
              {availablePlayers[role].length === 0 ? (
                <p className="text-gray-400 text-center">Aucun joueur disponible</p>
              ) : (
                availablePlayers[role].map((player) => (
                  <p key={player.id} className="text-white text-center py-1 bg-gray-700 rounded">
                    {player.name}
                  </p>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
