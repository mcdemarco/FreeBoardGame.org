import Thumbnail from './media/thumbnail.png';
import { GameMode } from '../../App/Game/GameModePicker';
import { IGameDef } from '../../games';
import instructions from './instructions.md';

export const domainsGameDef: IGameDef = {
  code: 'domains',
  name: 'Domains',
  imageURL: Thumbnail,
  modes: [{ mode: GameMode.AI }, { mode: GameMode.OnlineFriend }],
  minPlayers: 2,
  maxPlayers: 3,
  description: 'Similar to Magnate',
  descriptionTag: `Control more domains than your opponent\
 by spending resources to distribute your ranks wisely.`,
  instructions: {
    videoId: 'jcK2lXxdVmM',
    text: instructions,
  },
  config: () => import('./config'),
  aiConfig: () => import('./ai'),
};
