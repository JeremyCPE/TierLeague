import { FC, useRef, useState, useEffect } from 'react';
import { Download, FileSpreadsheetIcon, ImageIcon } from 'lucide-react';
import { WorkBook, writeFile } from 'xlsx';
import { toPng } from 'html-to-image';
import { Player, Team } from '../types';

interface ExportButtonsProps {
  workbook: WorkBook | null;
  selectedSheet: string;
  teams: Team[];
  players: Player[];
  fileName: string;
  tierListRef: React.RefObject<HTMLDivElement>;
}

export const ExportButtons: FC<ExportButtonsProps> = ({
  workbook,
  selectedSheet,
  teams,
  players,
  fileName,
  tierListRef
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  const exportToExcel = async () => {
    if (!workbook) return;

    const worksheet = workbook.Sheets[selectedSheet];
    if (!worksheet) return;

    teams.forEach((team) => {
      worksheet[team.rankAddress] = { v: team.rank };

      players.forEach((player) => {
        worksheet[player.tierAddress] = { v: player.tier };
      });
    });
    
    writeFile(workbook, `${fileName}`, { bookType: "xlsx", type: "file" });
  };

  const exportToPng = async () => {
    if (!workbook || !tierListRef.current) return;
    
    const worksheet = workbook.Sheets[selectedSheet];
    if (!worksheet) return;

    const originalDisplay = tierListRef.current.style.display;
    tierListRef.current.style.display = "block";
    
    const pngDataUrl = await toPng(tierListRef.current, {
      quality: 1.0,
      skipFonts: true
    });
    
    const link = document.createElement('a');
    link.download = 'my-rank2025';
    link.href = pngDataUrl;
    link.click();
    
    tierListRef.current.style.display = originalDisplay;
  };

  return (
    <div className='flex flex-1 justify-end text-white' ref={dropdownRef}>
      <button 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="bg-[#251c0d] border text-white px-3 py-3 rounded-full flex items-start gap-2 hover:bg-[#15100c] transition-colors md:space-x-2"
      >
        <Download className="w-5 h-5" />
        <span className='hidden md:inline'>
          Export vers ...
        </span>
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#15100c] border border-[#251c0d] rounded-md shadow-lg z-50">
          <button 
            onClick={() => { setIsDropdownOpen(false); exportToExcel(); }}
            className="block w-full text-left px-4 py-2 text-white hover:bg-[#251c0d] transition"
          >
            <FileSpreadsheetIcon className="w-4 h-4 inline-block mr-2" />
            Export Excel
          </button>
          <button 
            onClick={() => { setIsDropdownOpen(false); exportToPng(); }}
            className="block w-full text-left px-4 py-2 text-white hover:bg-[#251c0d] transition"
          >
            <ImageIcon className="w-4 h-4 inline-block mr-2" />
            Export PNG
          </button>
        </div>
      )}
    </div>
  );
}; 