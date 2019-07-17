import Thumbnail from './media/thumbnail.png';
import { GameMode } from '../../App/Game/GameModePicker';
import { IGameDef } from '../../games';
import instructions from './instructions.md';

export const magnateGameDef: IGameDef = {
  code: 'magnate',
  name: 'Magnate',
  imageURL: Thumbnail,
  modes: [{ mode: GameMode.AI }, { mode: GameMode.OnlineFriend }],
  minPlayers: 2,
  maxPlayers: 3,
  description: 'A Decktet Game',
  descriptionTag: `Play Magnate, a free online game for\
 the Decktet. You can play the AI, or another player\
 online!`,
  instructions: {
    videoId: 'jcK2lXxdVmM',
    text: instructions,
  },
  config: () => import('./config'),
  aiConfig: () => import('./ai'),
};
