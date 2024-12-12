import { TierList } from './components/TierList'
import { useState, useEffect } from 'react'
import { initialPlayersLFL } from './data/players'
import { initialPlayersLEC } from './data/playersLEC'
import { teamsLFL, teamsLEC } from './data/teams'
import LFLLogo from './assets/lfl_logo.png'
import LECLogo from './assets/LEC_Logo.png'

function App() {
  const [selectedLeague, setSelectedLeague] = useState('LFL');

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

    
  return (
    <>
      <header className='bg-black text-white'>
      <nav className="bg-black/50 backdrop-blur-sm border-b border-[#251c0d]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <div className="flex space-x-8">
              <a
                href='#LFL'
                onClick={() => setSelectedLeague('LFL')}
                className={`flex items-center px-6 py-2 rounded-md transition-all duration-300 ${
                  selectedLeague === 'LFL'
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
                className={`flex items-center px-6 py-2 rounded-md transition-all duration-300 ${
                  selectedLeague === 'LEC'
                    ? 'bg-[#251c0d] text-yellow-500 shadow-lg shadow-[#251c0d]/50'
                    : 'text-gray-300 hover:text-yellow-500 hover:bg-[#251c0d]/30'
                }`}
              >
                <img src={LECLogo} className={`w-4 h-4 mr-2 ${selectedLeague === 'LEC' ? 'text-yellow-500' : 'text-gray-400'}`} />
                <span className="font-bold tracking-wider">LEC</span>
              </a>
            </div>
          </div>
        </div>
      </nav>
      </header>

      <div className="min-h-screen bg-black flex py-8 px-4">
        <div className='max-w-6xl mx-auto'>
          {selectedLeague === 'LFL' ? (
            <TierList fullteams={teamsLFL} fullplayers={initialPlayersLFL} logo={LFLLogo} />
          ) : (
            <TierList fullteams={teamsLEC} fullplayers={initialPlayersLEC} logo={LECLogo} />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
