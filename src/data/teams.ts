import { TeamData } from "../types";
import IJC from "../assets/ijc.png"
import KCB from "../assets/KarmineCorp.png"
import BKRog from "../assets/BKRog.png"
import VitaBee from "../assets/Vitality.png"
import Gameward from "../assets/Gameward.png"
import Joblife from "../assets/joblife.png"
import Galions from "../assets/GL.png"
import Solary from "../assets/Solary.png"
import BDSAca from "../assets/BDSAca.png"
import Gentlemates from "../assets/Gentlemates.png"


export const fullteams: TeamData[] = [
  { id: 1, name: "IJC", rank: 1, logo : IJC },
  { id: 2, name: "KCB", rank: 2, logo : KCB },
  { id: 3, name: "BKR", rank: 3, logo : BKRog },
  { id: 4, name: "VITB", rank: 4, logo : VitaBee },
  { id: 5, name: "GW", rank: 5, logo : Gameward },
  { id: 6, name: "JL", rank: 6, logo : Joblife },
  { id: 7, name: "GL", rank: 7, logo : Galions },
  { id: 8, name: "SLY", rank: 8, logo : Solary },
  { id: 9, name: "BDSA", rank: 9, logo : BDSAca },
  { id: 10, name: "M8", rank: 10, logo : Gentlemates },]

export const totalTeams = fullteams.length;