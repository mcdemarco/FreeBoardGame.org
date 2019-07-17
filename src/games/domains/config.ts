import { IGameConfig } from '../index';
import { DomainsGame } from './game';
import { Board } from './board';

const config: IGameConfig = {
  bgioGame: DomainsGame,
  bgioBoard: Board,
};

export default config;
