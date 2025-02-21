import { useEffect, useRef, useState } from 'react'
import { read } from 'xlsx'
import type { WorkBook } from "xlsx"
import { ExcelPosition, Player, Team } from '../types'
import { v4 as uuidv4 } from 'uuid'
import { Upload} from 'lucide-react'
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

  // 1. Initial load effect
  useEffect(() => {
    const loadTemplate = async () => {
      onLoading(true)
      try {
        const response = await fetch('/template/Template.xlsx')
        const arrayBuffer = await response.arrayBuffer()
        const data = new Uint8Array(arrayBuffer)
        const workbook = read(data, { type: 'array' })
        handleWorkbookLoad(workbook, 'Template.xlsx')
      } catch (error) {
        console.error('Error loading template:', error)
      }
      onLoading(false)
    }

    loadTemplate()
  }, [])

  // 2. Sheet change effect
  useEffect(() => {
    if (workBook && selectedSheet) {
      onLoading(true)
      handleSheetChange(selectedSheet)
      onLoading(false)
    }
  }, [workBook, selectedSheet])

  // 3. Core workbook handling methods
  const handleWorkbookLoad = (workbook: WorkBook, fileName: string) => {
    setWorkBook(workbook)
    onWorkbookChange(workbook, fileName)

    const formattedSheets = workbook.SheetNames.map(sheet => ({ name: sheet }))
    onSheetsChange(formattedSheets)


    if (formattedSheets.length > 0) {
      const firstSheet = formattedSheets[0].name
      onSheetsChange(formattedSheets)
      handleSheetChange(firstSheet)

      if (firstSheet !== selectedSheet) {
        setTimeout(() => {
          const selectElement = document.getElementById('sheet-select') as HTMLSelectElement
          if (selectElement) {
            selectElement.value = firstSheet
            selectElement.dispatchEvent(new Event('change', { bubbles: true }))
          }
        }, 0)
      }
    }
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

  // 4. Data generation methods
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
      const playerName = readCell(workbook, sheetName, cellAddress)?.toString()
      const tierAddress = `${excelPosition[index].columnRank}${excelPosition[index].startRow + 1 + i}`
      const playerTier = readCell(workbook, sheetName, tierAddress)
      if (!playerName) continue

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

  // 5. Utility methods
  const readCell = (workbook: WorkBook, sheetName: string, cellAddress: string): string | null => {
    if (!workbook) return null
    const worksheet = workbook.Sheets[sheetName]
    if (!worksheet) return null

    const cell = worksheet[cellAddress]
    return cell ? cell.v : null
  }

  // 6. UI event handlers
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

      handleWorkbookLoad(workbook, fileName)
    }
    onLoading(false)
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
