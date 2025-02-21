import { TierList } from './components/TierList'
import { Excel } from './components/Excel'
import { useEffect, useRef, useState } from 'react'
import LFLLogo from './assets/lfl_logo.png'
import LECLogo from './assets/LEC_Logo.png'
import { Player, Team } from './types'
import { WorkBook, } from 'xlsx'
import { WelcomeSection } from './components/WelcomeSection'
import { ExportButtons } from './components/ExportButtons'

function App() {
  const [players, setPlayers] = useState<Player[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(false)
  const [workbook, setWorkbook] = useState<WorkBook | null>(null)
  const [fileName, setFileName] = useState("")
  const [sheets, setSheets] = useState<{ name: string }[]>([])
  const [selectedSheet, setSelectedSheet] = useState<string>("")
  const [logo, setLogo] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const tierListRef = useRef<HTMLDivElement>(null);


  // Ferme le menu si on clique ailleurs que sur les boutons de choix
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);

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

  const handleOnWorkbookChange = (workbook: WorkBook, fileName: string) => {
    setWorkbook(workbook)
    setFileName(fileName)
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

  const handleLoading = (updateLoading: boolean) => {
    setLoading(updateLoading)
  }
  return (
    <>
      <header className='bg-black text-white'>
        <nav className="bg-black/50 backdrop-blur-sm border-b border-[#251c0d]/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Excel
                onPlayersChange={handleOnPlayersChange}
                onTeamsChange={handleOnTeamsChange}
                onWorkbookChange={handleOnWorkbookChange}
                onSheetsChange={handleOnSheetsChange}
                selectedSheet={selectedSheet}
                onLoading={handleLoading} />
              <div className="flex flex-1 justify-center space-x-8 px-0 mx-0">
                <div className="w-[200px] h-[40px] flex items-center">
                  {sheets.length > 0 && (
                    <div className="w-full">
                      <select 
                        id="sheet-select" 
                        value={selectedSheet} 
                        onChange={handleSheetSelection} 
                        className="bg-[#251c0d] border text-white w-fit px-4 py-3 rounded-full hover:bg-[#15100c] transition-colors text-center"
                      >
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
              <ExportButtons
                workbook={workbook}
                selectedSheet={selectedSheet}
                teams={teams}
                players={players}
                fileName={fileName}
                tierListRef={tierListRef}
              />
            </div>
          </div>
        </nav>
      </header>
      <WelcomeSection />
      <div className="min-h-screen bg-black flex py-8 px-4 overflow-hidden">
        <div className='max-w-6xl mx-auto'>
          <TierList ref={tierListRef} fullteams={teams} fullplayers={players} {...(logo ? { logo } : {})} onPlayersChange={handleOnPlayersChange} onTeamsChange={handleOnTeamsChange} />
        </div>
      </div>
    </>
  )
}

export default App
