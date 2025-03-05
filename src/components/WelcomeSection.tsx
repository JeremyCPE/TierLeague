import { useEffect, useRef, useState } from 'react';
import { HelpCircle } from 'lucide-react';

export const WelcomeSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Ferme le menu si on clique ailleurs que sur les boutons de choix
  const quickHelpRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (quickHelpRef.current && !quickHelpRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isVisible]);


  return (
    <div className="fixed bottom-4 right-4 z-50" ref={quickHelpRef}>
      {isVisible && (
        <section className="absolute bottom-16 right-0 bg-gradient-to-br from-[#2a1f10] to-[#1a130a] border border-[#3d2d17] rounded-lg p-8 text-white w-[600px] min-h-[300px] mb-4 shadow-xl">
          <h2 className="text-2xl font-semibold mb-6 text-amber-200">Guide rapide</h2>
          <ul className="space-y-6 pl-6 list-disc text-xl text-gray-200">
            <li>
              Téléchargez le{' '}
              <a
                href="https://github.com/JeremyCPE/TierLeague/tree/main/public/template"
                className="font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                template
              </a>{' '}
              ou importez votre fichier Excel
            </li>
            <li>
              Sélectionnez une feuille de travail si nécessaire
            </li>
            <li>
              Modifiez vos classements
            </li>
            <li>
              Et exportez en format xlsx ou png !
            </li>
            <li>
              Si vous voyez des bugs, n'hésitez pas à envoyer un message sur Twitter
            </li>
          </ul>
        </section>
      )}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-gradient-to-br from-[#2a1f10] to-[#1a130a] hover:from-[#3d2d17] hover:to-[#251c0d] text-amber-200 p-3 rounded-full transition-all duration-300 shadow-lg border border-[#3d2d17]"
        title="Aide"
      >
        <HelpCircle size={32} />
      </button>
    </div>
  );
}; 
