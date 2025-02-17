import KCB from "../assets/KC.png"
import VitaBee from "../assets/VIT.png"
import BDSAca from "../assets/BDSA.png"

import G2 from "../assets/G2.png"
import Fnatics from "../assets/FNC.png"
import Heretics from "../assets/TH.png"
import SK from "../assets/SK.png"
import Koi from "../assets/MKOI.png"
import Rogue from "../assets/RGE.png"
import GiantX from "../assets/GX.png"
import { Team } from "../types"

export const teamsLEC: Team[] = [
  { id: 1, name: "G2", rank: 1, logo: G2 },
  { id: 2, name: "KC", rank: 2, logo: KCB },
  { id: 3, name: "Fnatics", rank: 3, logo: Fnatics },
  { id: 4, name: "Vitality", rank: 4, logo: VitaBee },
  { id: 5, name: "Heretics", rank: 5, logo: Heretics },
  { id: 6, name: "SK", rank: 6, logo: SK },
  { id: 7, name: "KOI", rank: 7, logo: Koi },
  { id: 8, name: "Rogue", rank: 8, logo: Rogue },
  { id: 9, name: "BDS", rank: 9, logo: BDSAca },
  { id: 10, name: "GiantX", rank: 10, logo: GiantX },]

export const totalLECTeams = teamsLEC.length;
