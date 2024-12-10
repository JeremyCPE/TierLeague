import { TierList } from './components/TierList'

function App() {

  return (
    <>
    <div className="min-h-screen bg-black flex py-8 px-4">
      <div className='max-w-6xl mx-auto'><TierList /></div>
    </div>
    <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4 text-left">
          <p className="text-gray-400">©_RedSeeds @than_ontweeter</p>
        </div>
      </footer>
    </>
  )
}

export default App
