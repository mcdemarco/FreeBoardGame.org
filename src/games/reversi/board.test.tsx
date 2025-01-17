import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Client } from '@freeboardgame.org/boardgame.io/client';
import { Client as ReactClient } from '@freeboardgame.org/boardgame.io/react';
import { RolitGame } from './game';
import { MemoryRouter } from 'react-router';
import { Board } from './board';
import { GameMode } from '../../App/Game/GameModePicker';
import { expect } from 'chai';

Enzyme.configure({ adapter: new Adapter() });

const players = [{ playerID: 0, name: 'foo', roomID: '' }, { playerID: 1, name: 'bar', roomID: '' }];

const BoardTest = (props: any) => (
  <MemoryRouter>
    <Board
      {...{
        ...props,
        gameArgs: {
          mode: GameMode.OnlineFriend,
          players,
        },
      }}
    />
  </MemoryRouter>
);

function getPosition(x: number, y: number) {
  return 8 * y + x;
}

test('round placing pieces', () => {
  const App = ReactClient({
    game: RolitGame,
    debug: false,
    board: BoardTest,
  }) as any;
  const comp = Enzyme.mount(<App playerID={'0'} />);

  comp
    .find('rect')
    .at(getPosition(5, 3))
    .simulate('click');

  expect(
    comp
      .find('rect')
      .at(getPosition(5, 3))
      .prop('style').fill,
  ).to.not.equal('black');

  comp.setProps({ playerID: '1' });
  comp.update();

  comp
    .find('rect')
    .at(getPosition(4, 2))
    .simulate('click');

  expect(
    comp
      .find('rect')
      .at(getPosition(4, 2))
      .prop('style').fill,
  ).to.not.equal('black');
});

test('gameover - won', () => {
  const client = Client({
    game: RolitGame,
  });
  const state0 = client.store.getState();
  const state1 = {
    ...state0,
    ctx: { ...state0.ctx, gameover: { scoreboard: [{ playerID: '0', score: 38 }, { playerID: '1', score: 26 }] } },
  };
  const comp = Enzyme.mount(
    <MemoryRouter>
      <Board
        G={state1.G}
        ctx={state1.ctx}
        moves={client.moves}
        playerID={'0'}
        gameArgs={{
          gameCode: 'rolit',
          mode: GameMode.LocalFriend,
          players,
        }}
      />
    </MemoryRouter>,
  );
  expect(comp.html()).to.contain('won');
});

test('gameover - lost', () => {
  const client = Client({
    game: RolitGame,
  });
  const state0 = client.store.getState();
  const state1 = {
    ...state0,
    ctx: { ...state0.ctx, gameover: { scoreboard: [{ playerID: '0', score: 38 }, { playerID: '1', score: 26 }] } },
  };
  const comp = Enzyme.mount(
    <MemoryRouter>
      <Board
        G={state1.G}
        ctx={state1.ctx}
        moves={client.moves}
        playerID={'1'}
        gameArgs={{
          gameCode: 'rolit',
          mode: GameMode.LocalFriend,
          players,
        }}
      />
    </MemoryRouter>,
  );
  expect(comp.html()).to.contain('lost');
});

test('gameover - draw', () => {
  const client = Client({
    game: RolitGame,
  });
  const state0 = client.store.getState();
  const state1 = {
    ...state0,
    ctx: { ...state0.ctx, gameover: { scoreboard: [{ playerID: '0', score: 38 }, { playerID: '1', score: 38 }] } },
  };
  const comp = Enzyme.mount(
    <MemoryRouter>
      <Board
        G={state1.G}
        ctx={state1.ctx}
        moves={client.moves}
        playerID={'0'}
        gameArgs={{
          gameCode: 'rolit',
          mode: GameMode.LocalFriend,
          players,
        }}
      />
    </MemoryRouter>,
  );
  expect(comp.html()).to.contain('draw');
});
