import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Client } from '@freeboardgame.org/boardgame.io/client';
import { Client as ReactClient } from '@freeboardgame.org/boardgame.io/react';
import { CornerusGame } from './game';
import { MemoryRouter } from 'react-router';
import { Board } from './board';
import { GameMode } from '../../App/Game/GameModePicker';
import { expect } from 'chai';
import blue from '@material-ui/core/colors/blue';

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

test('controls', () => {
  const App = ReactClient({
    game: CornerusGame,
    debug: false,
    board: BoardTest,
  }) as any;
  const comp = Enzyme.mount(<App playerID={'0'} />);

  comp
    .find('#rotate-left')
    .at(0)
    .simulate('click');
  comp
    .find('#rotate-right')
    .at(0)
    .simulate('click');
  comp
    .find('#flip-x')
    .at(0)
    .simulate('click');
  comp
    .find('#flip-y')
    .at(0)
    .simulate('click');
  comp
    .find('#rotate-left')
    .at(0)
    .simulate('click');
  comp
    .find('#flip-x')
    .at(0)
    .simulate('click');
  comp
    .find('#flip-y')
    .at(0)
    .simulate('click');
  comp
    .find('#select-next')
    .at(0)
    .simulate('click');
  comp
    .find('#select-prev')
    .at(0)
    .simulate('click');
  comp
    .find('#place')
    .at(0)
    .simulate('click');

  expect(comp.find('Token').length).to.equal(1);
});

test('pieces', () => {
  const client = Client({
    game: CornerusGame,
  });
  const state0 = client.store.getState();
  const state1 = {
    ...state0,
    ctx: { ...state0.ctx, currentPlayer: '1' },
    G: { ...state0.G, board: new Array(64).fill('0') },
  };
  const comp = Enzyme.mount(
    <MemoryRouter>
      <Board
        G={state1.G}
        ctx={state1.ctx}
        moves={client.moves}
        playerID={'1'}
        gameArgs={{
          gameCode: 'cornerus',
          mode: GameMode.LocalFriend,
          players,
        }}
      />
    </MemoryRouter>,
  );

  expect(
    comp
      .find('rect')
      .at(0)
      .prop('style').fill,
  ).to.equal(blue[700]);
});

test('gameover - won', () => {
  const client = Client({
    game: CornerusGame,
  });
  const state0 = client.store.getState();
  const state1 = {
    ...state0,
    ctx: { ...state0.ctx, gameover: { scoreboard: [{ playerID: '0', score: -30 }, { playerID: '1', score: -65 }] } },
    G: { ...state0.G, board: new Array(64).fill('0') },
  };
  const comp = Enzyme.mount(
    <MemoryRouter>
      <Board
        G={state1.G}
        ctx={state1.ctx}
        moves={client.moves}
        playerID={'0'}
        gameArgs={{
          gameCode: 'cornerus',
          mode: GameMode.OnlineFriend,
          players,
        }}
      />
    </MemoryRouter>,
  );
  expect(comp.html()).to.contain('won');
});

test('gameover - lost', () => {
  const client = Client({
    game: CornerusGame,
  });
  const state0 = client.store.getState();
  const state1 = {
    ...state0,
    ctx: { ...state0.ctx, gameover: { scoreboard: [{ playerID: '0', score: -30 }, { playerID: '1', score: -65 }] } },
  };
  const comp = Enzyme.mount(
    <MemoryRouter>
      <Board
        G={state1.G}
        ctx={state1.ctx}
        moves={client.moves}
        playerID={'1'}
        gameArgs={{
          gameCode: 'cornerus',
          mode: GameMode.OnlineFriend,
          players,
        }}
      />
    </MemoryRouter>,
  );
  expect(comp.html()).to.contain('lost');
});

test('gameover - draw', () => {
  const client = Client({
    game: CornerusGame,
  });
  const state0 = client.store.getState();
  const state1 = {
    ...state0,
    ctx: { ...state0.ctx, gameover: { scoreboard: [{ playerID: '0', score: -65 }, { playerID: '1', score: -65 }] } },
  };
  const comp = Enzyme.mount(
    <MemoryRouter>
      <Board
        G={state1.G}
        ctx={state1.ctx}
        moves={client.moves}
        playerID={'0'}
        gameArgs={{
          gameCode: 'cornerus',
          mode: GameMode.OnlineFriend,
          players,
        }}
      />
    </MemoryRouter>,
  );
  expect(comp.html()).to.contain('draw');
});
