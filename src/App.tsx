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
              <ExcelImport onPlayersChange={handleOnPlayersChange} onTeamsChange={handleOnTeamsChange} />
              {/* <button onClick={test}>test</button> */}
              <div className="flex flex-1 justify-center space-x-8 px-0 mx-0">
                <a
                  href='#LFL'
                  onClick={() => setSelectedLeague('LFL')}
                  className={`flex items-center px-4 py-2 rounded-md transition-all duration-300 ${selectedLeague === 'LFL'
                    ? 'bg-[#251c0d] text-yellow-500 shadow-lg shadow-[#251c0d]/50'
                    : 'text-gray-300 hover:text-yellow-500 hover:bg-[#251c0d]/30'
                    }`}
                >
                  <img src={LFLLogo} className={`w-4 h-4 mr-2 ${selectedLeague === 'LFL' ? 'text-yellow-500' : 'text-gray-400'}`} />
                  <span className="font-bold tracking-wider">LFL</span>
                </a>

                <a
                  href='#LEC'
                  onClick={() => setSelectedLeague('LEC')}
                  className={`flex items-center px-4 py-2 rounded-md transition-all duration-300 ${selectedLeague === 'LEC'
                    ? 'bg-[#251c0d] text-yellow-500 shadow-lg shadow-[#251c0d]/50'
                    : 'text-gray-300 hover:text-yellow-500 hover:bg-[#251c0d]/30'
                    }`}
                >
                  <img src={LECLogo} className={`w-4 h-4 mr-2 ${selectedLeague === 'LEC' ? 'text-yellow-500' : 'text-gray-400'}`} />
                  <span className="font-bold tracking-wider">LEC</span>
                </a>
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
