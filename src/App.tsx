import { TierList } from './components/TierList'
import { Excel } from './components/Excel'
import { useEffect, useState } from 'react'
import LFLLogo from './assets/lfl_logo.png'
import LECLogo from './assets/LEC_Logo.png'
import { Player, Team } from './types'
import { Save } from 'lucide-react'
import { WorkBook, writeFile } from 'xlsx'
import { excelPosition } from './data/excel.data'
import { roles } from './data/common.data'

function App() {
  const [players, setPlayers] = useState<Player[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(false)
  const [workbook, setWorkbook] = useState<WorkBook | null>(null)
  const [sheets, setSheets] = useState<{ name: string }[]>([])
  const [selectedSheet, setSelectedSheet] = useState<string>("")
  const [logo, setLogo] = useState("")

  useEffect(() => {
    if (selectedSheet.includes('LEC')) {
      setLogo(LECLogo)
    } else if (selectedSheet.includes('LFL')) {
      setLogo(LFLLogo)
    }
  }, [selectedSheet])

  const handleOnPlayersChange = (updatedPlayers: Player[]): void => {
    setPlayers(updatedPlayers)
  }

  const handleOnTeamsChange = (updatedTeams: Team[]): void => {
    setTeams(updatedTeams)
  }

  const handleOnWorkbookChange = (workbook: WorkBook) => {
    setWorkbook(workbook)
  }

  const handleSheetSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sheetName = event.target.value
    setSelectedSheet(sheetName)

  }

  const handleOnSheetsChange = (sheetsList: { name: string }[]) => {
    setSheets(sheetsList)
    if (sheetsList.length === 1) {
      setSelectedSheet(sheetsList[0].name)
    } else {
      // On réinitialise le choix à vide pour laisser l'utilisateur choisir quelle feuille il veut afficher
      setSelectedSheet("")
    }
  }

  const exportToExcel = () => {
    console.log('export1', teams);
    console.log('export1', teams);

    if (!workbook) return

    const worksheet = workbook.Sheets[selectedSheet]

    teams.forEach((team) => {
      worksheet[team.rankAddress] = { v: team.rank }

      players.forEach((player) => {
        worksheet[player.tierAddress] = { v: player.tier }
      })
    })

    // Sauvegarde du fichier mis à jour
    writeFile(workbook, "TierList_Modifié.xlsx", { bookType: "xlsx", type: "file" })
  }

  return (
    <>
      <header className='bg-black text-white'>
        <nav className="bg-black/50 backdrop-blur-sm border-b border-[#251c0d]/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Excel onPlayersChange={handleOnPlayersChange} onTeamsChange={handleOnTeamsChange} onWorkbookChange={handleOnWorkbookChange} onSheetsChange={handleOnSheetsChange} selectedSheet={selectedSheet} />
              <div className="flex flex-1 justify-center space-x-8 px-0 mx-0">
                <div className="w-[200px] h-[40px] flex items-center">
                  {sheets.length > 0 && (
                    <div className="w-full">
                      <select id="sheet-select" value={selectedSheet} onChange={handleSheetSelection} className="bg-[#251c0d] border text-white px-4 py-3 rounded-full hover:bg-[#15100c] transition-colors w-full text-left">
                        <option value="" className='bg-black text-left'>-- Sélectionner une feuille --</option>
                        {sheets.map((sheet) => (
                          <option key={sheet.name} value={sheet.name} className='bg-black'>
                            {sheet.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
              <div className='flex flex-1 justify-end text-white'>
                <button onClick={exportToExcel}
                  className="bg-[#251c0d] border text-white px-8 py-3 rounded-full flex items-start gap-2 hover:bg-[#15100c] transition-colors">
                  <Save className="w-5 h-5" />
                  Export
                </button>
                {loading && <div className="spinner"></div>}
              </div>

            </div>
          </div>
        </nav>
      </header>

      <div className="min-h-screen bg-black flex py-8 px-4 overflow-hidden">
        <div className='max-w-6xl mx-auto'>
          <TierList fullteams={teams} fullplayers={players} {...(logo ? { logo } : {})} onPlayersChange={handleOnPlayersChange} onTeamsChange={handleOnTeamsChange} />
        </div>
      </div>
    </>
  )
}

export default App
