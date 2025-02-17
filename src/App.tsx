import { TierList } from './components/TierList'
import { ExcelImport } from './components/ExcelImport'
import { useState, useEffect } from 'react'
import { initialPlayersLEC } from './data/playersLEC'
import { teamsLEC } from './data/teams'
import LFLLogo from './assets/lfl_logo.png'
import LECLogo from './assets/LEC_Logo.png'
import { Player, Team } from './types'
import { Save } from 'lucide-react'

function App() {
  const [selectedLeague, setSelectedLeague] = useState('LFL');
  const [players, setPlayers] = useState<Player[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(false)
  const [sheets, setSheets] = useState<{ name: string }[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>("");

  useEffect(() => {
    const fragment = window.location.hash.replace('#', '');
    if (fragment === 'LEC' || fragment === 'LFL') {
      setSelectedLeague(fragment);
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const fragment = window.location.hash.replace('#', '');
      if (fragment === 'LEC' || fragment === 'LFL') {
        setSelectedLeague(fragment);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOnPlayersChange = (updatedPlayers: Player[]): void => {
    setPlayers(updatedPlayers)
  }

  const handleOnTeamsChange = (updatedTeams: Team[]): void => {
    setTeams(updatedTeams)
  }

  const handleOnSheetsChange = (sheetsList: { name: string }[]) => {
    setSheets(sheetsList);
    if (sheetsList.length === 1) {
      setSelectedSheet(sheetsList[0].name);
    } else {
      setSelectedSheet("");
    }
  }

  const handleSheetSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSheet(event.target.value);
  }

  const test = () => {
    console.log('test', players);
    console.log('test2', teams);

  }

  //TODO
  const exportToExcel = () => { }

  return (
    <>
      <header className='bg-black text-white'>
        <nav className="bg-black/50 backdrop-blur-sm border-b border-[#251c0d]/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <ExcelImport onPlayersChange={handleOnPlayersChange} onTeamsChange={handleOnTeamsChange} onSheetsChange={handleOnSheetsChange} />
              {/* <button onClick={test}>test</button> */}
              <div className="flex flex-1 justify-center space-x-8 px-0 mx-0">
                <div className="w-[200px] h-[40px] flex items-center">
                  {sheets.length > 0 && (
                    <div className="w-full">
                      <label htmlFor="sheet-select" className='px-1 whitespace-nowrap'> Page </label>
                      <select id="sheet-select" value={selectedSheet} onChange={handleSheetSelection} className="text-black w-full px-1">
                        <option value="">-- Sélectionner une feuille --</option>
                        {sheets.map((sheet) => (
                          <option key={sheet.name} value={sheet.name}>
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
          {selectedLeague === 'LFL' ? (
            <TierList fullteams={teams} fullplayers={players} logolfl={LFLLogo} onPlayersChange={handleOnPlayersChange} onTeamsChange={handleOnTeamsChange} />
          ) : (
            <TierList fullteams={teamsLEC} fullplayers={initialPlayersLEC} logolfl={LECLogo} onPlayersChange={handleOnPlayersChange} />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
