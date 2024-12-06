import Top from '../assets/toplaner.png'
import Jungle from '../assets/jungler.png'
import Mid from '../assets/midlane.png'
import Botlaner from '../assets/botlaner.png'
import Support from '../assets/support.png'

export const roleLogos = {
  'Toplaner': Top,
  'Jungle': Jungle,
  'Midlaner': Mid,
  'Botlaner': Botlaner,
  'Support': Support,
} as const;

export type Role = keyof typeof roleLogos;