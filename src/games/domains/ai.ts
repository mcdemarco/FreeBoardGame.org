import { IAIConfig } from '../index';
import { IG, getCards, isAllowedDeck } from './game';
import { IGameCtx } from '@freeboardgame.org/boardgame.io/core';

interface IPlayState {
  G: IG;
  ctx: IGameCtx;
}

class DomainsBot {
  async play(state: IPlayState, playerID: string) {
    if (state.ctx.phase === 'CARD_SELECT') {
      const randomCard = Math.floor(state.G.players[playerID as any].cards.length * Math.random());
      return this.makeSelectCardMove(randomCard, playerID);
    } else {
      const deckId = this.getBestDeck(state.G, playerID);
      return this.makeSelectDeckMove(deckId, playerID);
    }
  }

  getBestDeck(G: IG, playerID: string): number {
    const { card, lastCards } = getCards(G, playerID);
    if (card.number < lastCards[0].number) {
      return G.decks
        .map((deck, i) => ({ rank: deck.reduce((acc, card) => acc + card.rank, 0), id: i }), 0)
        .sort((a, b) => a.rank - b.rank)[0].id;
    } else {
      return G.decks.findIndex((deck, i) => isAllowedDeck(G, i, playerID));
    }
  }

  makeSelectCardMove(cardId: number, playerID: string) {
    return { action: { type: 'MAKE_MOVE', payload: { type: 'selectCard', args: [cardId], playerID } } };
  }

  makeSelectDeckMove(deckId: number, playerID: string) {
    return { action: { type: 'MAKE_MOVE', payload: { type: 'selectDeck', args: [deckId], playerID } } };
  }
}

const config: IAIConfig = {
  bgioAI: () => {
    return {
      bot: DomainsBot,
    };
  },
};
export default config;
