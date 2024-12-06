import { TeamData } from "../types";
import IJC from "../assets/ijc.png"
import KCB from "../assets/KarmineCorp.png"
import BKRog from "../assets/BKRog.png"
import VitaBee from "../assets/Vitality.png"
import Gameward from "../assets/Gameward.png"
import Joblife from "../assets/joblife.png"
import TeamGo from "../assets/Go.png"
import Solary from "../assets/Solary.png"
import BDSAca from "../assets/BDSAca.png"
import Gentlemates from "../assets/Gentlemates.png"


export const fullteams: TeamData[] = [
  { id: 1, name: "IJC", rank: 1, logo : IJC },
  { id: 2, name: "KCB", rank: 2, logo : KCB },
  { id: 3, name: "BKRog", rank: 3, logo : BKRog },
  { id: 4, name: "VitaBee", rank: 4, logo : VitaBee },
  { id: 5, name: "Gameward", rank: 5, logo : Gameward },
  { id: 6, name: "Joblife", rank: 6, logo : Joblife },
  { id: 7, name: "TeamGO", rank: 7, logo : TeamGo },
  { id: 8, name: "Solary", rank: 8, logo : Solary },
  { id: 9, name: "BDS Aca", rank: 9, logo : BDSAca },
  { id: 10, name: "Gentlemates", rank: 10, logo : Gentlemates },]

export const totalTeams = fullteams.length;