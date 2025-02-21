import { useEffect, useRef, useState } from 'react'
import { read } from 'xlsx'
import type { WorkBook } from "xlsx"
import { ExcelPosition, Player, Team } from '../types'
import { v4 as uuidv4 } from 'uuid'
import { Upload } from 'lucide-react'
import { excelPosition } from '../data/excel.data'
import { roles } from '../data/common.data'
import { teamLogos } from '../data/logo.data'

interface ExcelInterface {
  onPlayersChange: (players: Player[]) => void
  onTeamsChange: (teams: Team[]) => void
  onWorkbookChange: (workbook: WorkBook, fileName: string) => void
  onSheetsChange: (sheets: { name: string }[]) => void
  onLoading: (loading: boolean) => void
  selectedSheet: string
}

export const Excel: React.FC<ExcelInterface> = ({ onPlayersChange, onTeamsChange, onWorkbookChange, onSheetsChange, selectedSheet, onLoading }) => {
  const [workBook, setWorkBook] = useState<WorkBook | null>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Permet lorsqu'on clique sur le bouton pour importer de faire comme si on cliquait sur le input
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  const importFromExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    onLoading(true)
    const file = event.target.files?.[0]
    if (!file) return
    const fileName = file.name

    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = read(data, { type: 'array' })

      setWorkBook(workbook)
      onWorkbookChange(workbook, fileName)

      // Transformer les noms des feuilles en objets { name: string }
      const formattedSheets = workbook.SheetNames.map(sheet => ({ name: sheet }))
      onSheetsChange(formattedSheets)

      if (formattedSheets.length === 1) {
        onSheetsChange(formattedSheets)
        setTimeout(() => { // Le timeout permet a react de terminer la mise à jour de selectedSheet dans App.tsx avant d'executer cette partie
          handleSheetChange(formattedSheets[0].name)
        }, 0)
      }
    }
    onLoading(false)
  }

  const handleSheetChange = (sheetName: string) => {
    if (!workBook) return

    let allPlayers: Player[] = []

    const teams = generateTeams(workBook, sheetName, excelPosition)

    teams.forEach((team, index) => {
      const teamPlayers = generatePlayers(workBook, sheetName, index, team)
      allPlayers = [...allPlayers, ...teamPlayers]
    })

    onPlayersChange(allPlayers)
    onTeamsChange(teams)
  }

  // Permet de charger automatiquement les données après avoir sélectionner un document à charger
  useEffect(() => {
    if (workBook && selectedSheet) {
      onLoading(true)
      handleSheetChange(selectedSheet)
      onLoading(false)
    }
  }, [workBook, selectedSheet])



  const generateTeams = (workBook: WorkBook, sheetName: string, excelPosition: ExcelPosition[]): Team[] => {
    const teams: Team[] = []
    for (let i = 0; i < excelPosition.length; i++) {
      const cellAddress = `${excelPosition[i].columnTeam}${excelPosition[i].startRow}`
      const teamName = readCell(workBook, sheetName, cellAddress) || ""
      const cellAdressRank = `${excelPosition[i].columnRank}${excelPosition[i].startRow}`
      const teamRank = readCell(workBook, sheetName, cellAdressRank) || "0"

      teams.push({
        id: i,
        name: teamName,
        rank: parseInt(teamRank),
        rankAddress: cellAdressRank,
        logo: teamLogos[teamName] || ""
      })
    }
    return teams
  }

  const generatePlayers = (workbook: WorkBook, sheetName: string, index: number, team: Team): Player[] => {
    const players: Player[] = []
    for (let i = 0; i < roles.length; i++) {
      const cellAddress = `${excelPosition[index].columnTeam}${excelPosition[index].startRow + 1 + i}`
      const teamName = team.name
      const teamId = team.id
      const playerName = readCell(workbook, sheetName, cellAddress)
      const tierAddress = `${excelPosition[index].columnRank}${excelPosition[index].startRow + 1 + i}`
      const playerTier = readCell(workbook, sheetName, tierAddress)
      if (!playerName) continue // Ignorer les cellules vides

      players.push({
        id: uuidv4(),
        name: playerName,
        teamId: teamId,
        teamName: teamName,
        role: roles[i],
        tier: playerTier ? playerTier.toString() : "",
        tierAddress: tierAddress
      })
    }
    return players
  }

  const readCell = (workbook: WorkBook, sheetName: string, cellAddress: string): string | null => {
    if (!workbook) return null
    const worksheet = workbook.Sheets[sheetName]
    if (!worksheet) return null

    const cell = worksheet[cellAddress]
    return cell ? cell.v : null // `.v` contient la valeur brute de la cellule
  }

  return (
    <div className='flex flex-1 justify-start text-white items-center space-x-1'>
      <input type="file" accept=".xls, .xlsx" id="file" ref={fileInputRef} onChange={e => importFromExcel(e)} className='hidden' />
      <button onClick={handleButtonClick} className="bg-[#251c0d] border text-white px-3 py-3 rounded-full flex items-start gap-2 hover:bg-[#15100c] transition-colors md:space-x-2">
        <Upload className='w-6 h-5 px-0 mx-0' />
        <span className='hidden md:inline'>
          Import des joueurs depuis excel
        </span>
      </button>
    </div>
  )
}
