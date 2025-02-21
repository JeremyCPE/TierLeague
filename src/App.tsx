import { TierList } from './components/TierList'
import { Excel } from './components/Excel'
import { useEffect, useRef, useState } from 'react'
import LFLLogo from './assets/lfl_logo.png'
import LECLogo from './assets/LEC_Logo.png'
import { Player, Team } from './types'
import { FileImage, FileSpreadsheet, Upload } from 'lucide-react'
import { WorkBook, writeFile } from 'xlsx'
import { toPng } from 'html-to-image'

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

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

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

  const exportToExcel = async () => {
    if (!workbook) return

    const worksheet = workbook.Sheets[selectedSheet]
    if (!worksheet) return

    teams.forEach((team) => {
      worksheet[team.rankAddress] = { v: team.rank }

      players.forEach((player) => {
        worksheet[player.tierAddress] = { v: player.tier }
      })
    })
    // Sauvegarde du fichier mis à jour
    writeFile(workbook, `${fileName}`, { bookType: "xlsx", type: "file" });
  }

  const exportToPng = async () => {
    if (!workbook) return
    const worksheet = workbook.Sheets[selectedSheet]
    if (!worksheet) return

    if (tierListRef.current) {
      const originalDisplay = tierListRef.current.style.display
      tierListRef.current.style.display = "block";
      const pngDataUrl = await toPng(tierListRef.current, {
        quality: 1.0,
        skipFonts: true // Évite les erreurs de lecture des CSS distants
      });
      const link = document.createElement('a')
      link.download = 'my-lflrank2025'
      link.href = pngDataUrl
      link.click()
      tierListRef.current.style.display = originalDisplay
    }
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
                      <select id="sheet-select" value={selectedSheet} onChange={handleSheetSelection} className="bg-[#251c0d] border text-white w-fit px-4 py-3 rounded-full hover:bg-[#15100c] transition-colors text-center">
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
              <div className='flex flex-1 justify-end text-white' ref={dropdownRef}>
                <button onClick={toggleDropdown}
                  className="bg-[#251c0d] border text-white px-3 py-3 rounded-full flex items-start gap-2 hover:bg-[#15100c] transition-colors md:space-x-2">
                  <Upload className="w-5 h-5" />
                  <span className='hidden md:inline'>
                    Export vers ...
                  </span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#15100c] border border-[#251c0d] rounded-md shadow-lg z-50">
                    <button onClick={() => { setIsDropdownOpen(false); exportToExcel(); }}
                      className="block w-full text-left px-4 py-2 text-white hover:bg-[#251c0d] transition">
                      <FileSpreadsheet className="w-4 h-4 inline-block mr-2" />
                      Export Excel
                    </button>
                    <button onClick={() => { setIsDropdownOpen(false); exportToPng(); }}
                      className="block w-full text-left px-4 py-2 text-white hover:bg-[#251c0d] transition">
                      <FileImage className="w-4 h-4 inline-block mr-2" />
                      Export PNG
                    </button>
                  </div>
                )}
                {loading && <div className="spinner"></div>}
              </div>

            </div>
          </div>
        </nav>
      </header>

      <div className="min-h-screen bg-black flex py-8 px-4 overflow-hidden">
        <div className='max-w-6xl mx-auto'>
          <TierList ref={tierListRef} fullteams={teams} fullplayers={players} {...(logo ? { logo } : {})} onPlayersChange={handleOnPlayersChange} onTeamsChange={handleOnTeamsChange} />
        </div>
      </div>
    </>
  )
}

export default App
