import { ChangeEvent, useRef, useState } from 'react';
import { read } from 'xlsx'
import type { WorkBook } from "xlsx"
import { ExcelPosition, Player, Team } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Import } from 'lucide-react'

interface ExcelImportInterface {
  onPlayersChange: (players: Player[]) => void; // 🔹 Correction du nom de la prop
  onTeamsChange: (teams: Team[]) => void
}



export const ExcelImport: React.FC<ExcelImportInterface> = ({ onPlayersChange, onTeamsChange }) => {
  const [workBook, setWorkBook] = useState<WorkBook | null>(null)
  const [sheets, setSheets] = useState<{ name: string }[]>([])
  const [selectedSheet, setSelectedSheet] = useState(sheets.length > 0 ? sheets[0].name : "")

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const roles = ["Toplaner", "Jungle", "Midlaner", "Botlaner", "Support"];
  const excelPosition: ExcelPosition[] = [
    { columnTeam: "B", columnRank: 'C', startRow: 1 },
    { columnTeam: "E", columnRank: 'F', startRow: 1 },
    { columnTeam: "H", columnRank: 'I', startRow: 1 },
    { columnTeam: "K", columnRank: 'L', startRow: 1 },
    { columnTeam: "N", columnRank: 'O', startRow: 1 },
    { columnTeam: "B", columnRank: 'C', startRow: 8 },
    { columnTeam: "E", columnRank: 'F', startRow: 8 },
    { columnTeam: "H", columnRank: 'I', startRow: 8 },
    { columnTeam: "K", columnRank: 'L', startRow: 8 },
    { columnTeam: "N", columnRank: 'O', startRow: 8 },
  ];

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  };
  const importPlayers = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = read(data, { type: 'array' });

      // Transformer les noms des feuilles en objets { name: string }
      const formattedSheets = workbook.SheetNames.map(sheet => ({ name: sheet }));
      setSheets(formattedSheets);

      if (formattedSheets.length === 1) {
        // Sélection automatique si une seule feuille
        handleSheetChange(formattedSheets[0].name, workbook);
      } else {
        // Ne rien sélectionner si plusieurs feuilles
        setSelectedSheet("");
      }

      setWorkBook(workbook);
    };
  };
  const handleSheetSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sheetName = event.target.value;
    setSelectedSheet(sheetName);
    handleSheetChange(sheetName);
  };

  const handleSheetChange = (sheetName: string, workBookInstance?: WorkBook) => {
    const workbookToUse = workBookInstance || workBook;
    if (!workbookToUse) return;

    setSelectedSheet(sheetName);

    let allPlayers: Player[] = [];

    const teams = generateTeams(workbookToUse, sheetName, excelPosition)


    teams.forEach((team, index) => {
      const teamPlayers = generatePlayers(workbookToUse, sheetName, excelPosition[index].columnTeam, excelPosition[index].startRow + 1, team);
      allPlayers = [...allPlayers, ...teamPlayers];
    });

    onPlayersChange(allPlayers)
    onTeamsChange(teams)
  };

  const generateTeams = (workBook: WorkBook, sheetName: string, excelPosition: ExcelPosition[]): Team[] => {
    const teams: Team[] = []
    for (let i = 0; i < excelPosition.length; i++) {
      const cellAddress = `${excelPosition[i].columnTeam}${excelPosition[i].startRow}`;
      const teamName = readCell(workBook, sheetName, cellAddress) || ""
      const cellAdressRank = `${excelPosition[i].columnRank}${excelPosition[i].startRow}`;
      const teamRank = readCell(workBook, sheetName, cellAdressRank) || "0"

      teams.push({
        id: i,
        name: teamName,
        rank: parseInt(teamRank),
        logo: `https://raw.githubusercontent.com/VongoSaNDi/tier-list-lol/main/${teamName}.png`
      })
    }
    return teams
  }

  const generatePlayers = (workbook: WorkBook, sheetName: string, column: string, startRow: number, team: Team): Player[] => {
    const players: Player[] = [];
    for (let i = 0; i < roles.length; i++) {
      const cellAddress = `${column}${startRow + i}`;
      const teamName = team.name
      const teamId = team.id
      const playerName = readCell(workbook, sheetName, cellAddress);
      if (!playerName) continue; // Ignorer les cellules vides

      players.push({
        id: uuidv4(),
        name: playerName,
        teamId: teamId,
        teamName: teamName,
        logo: `/logos/${teamName.toLowerCase()}.png`,
        role: roles[i],
        tier: "",
      });
    }
    return players;
  };

  const readCell = (workbook: WorkBook, sheetName: string, cellAddress: string): string | null => {
    if (!workbook) return null;
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) return null;

    const cell = worksheet[cellAddress];
    return cell ? cell.v : null; // `.v` contient la valeur brute de la cellule
  };

  return (
    <div className='flex flex-1 justify-start text-white items-center space-x-1'>
      <input type="file" accept=".xls, .xlsx" id="file" ref={fileInputRef} onChange={e => importPlayers(e)} className='hidden' />
      <button onClick={handleButtonClick} className="bg-[#251c0d] border text-white px-3 py-3 rounded-full flex items-start gap-2 hover:bg-[#15100c] transition-colors">
        <Import className='w-6 h-5 px-0 mx-0' />
        Import des joueurs
      </button>
      <div className="w-[200px] h-[40px] flex items-center">
        {sheets.length > 1 && (
          <div className="w-full">
            <label htmlFor="sheet-select" className='px-1 whitespace-nowrap'> Page </label>
            <select id="sheet-select" value={selectedSheet} onChange={handleSheetSelection} className={`text-black w-full px-1 ${sheets.length > 1 ? "visible" : "invisible"}`}>
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

  )
}
