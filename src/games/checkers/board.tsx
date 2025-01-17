import * as React from 'react';
import { IGameArgs } from '../../App/Game/GameBoardWrapper';
import { GameLayout } from '../../App/Game/GameLayout';
import { IGameCtx } from '@freeboardgame.org/boardgame.io/core';
import { IG, toCoord, IMove, getValidMoves, areCoordsEqual } from './game';
import {
  Checkerboard,
  IAlgebraicCoords,
  ICartesianCoords,
  IOnDragData,
  applyInvertion,
  algebraicToCartesian,
  IColorMap,
  cartesianToAlgebraic,
} from '../../common/Checkerboard';
import { GameMode } from '../../App/Game/GameModePicker';
import { Token } from '@freeboardgame.org/boardgame.io/ui';
import Typography from '@material-ui/core/Typography';
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';

interface IBoardProps {
  G: IG;
  ctx: IGameCtx;
  moves: any;
  step?: any;
  playerID: string;
  gameArgs?: IGameArgs;
}

interface IBoardState {
  selected: ICartesianCoords;
  validMoves: IMove[];
}

function roundCoords(coords: ICartesianCoords) {
  return { x: Math.round(coords.x), y: Math.round(coords.y) };
}

export class Board extends React.Component<IBoardProps, IBoardState> {
  state: IBoardState = {
    selected: null,
    validMoves: getValidMoves(this.props.G, this.props.ctx.currentPlayer),
  };

  isInverted() {
    return this.isOnlineGame() && this.props.playerID === '1';
  }

  _isSelectable = (coords: ICartesianCoords) => {
    if (this.isOnlineGame() && this.props.playerID !== this.props.ctx.currentPlayer) {
      return false;
    }

    return this.state.validMoves.some(move => areCoordsEqual(move.from, coords));
  };

  _onClick = (coords: IAlgebraicCoords) => {
    const position = algebraicToCartesian(coords.square);
    if (this.state.selected === null && this._isSelectable(position)) {
      this.setState({
        ...this.state,
        selected: position,
      });
    } else {
      this._move(position);
    }
  };

  _shouldDrag = (coords: ICartesianCoords) => {
    return this._isSelectable(applyInvertion(coords, this.isInverted()));
  };

  _onDrag = (coords: IOnDragData) => {
    const x = coords.x;
    const y = coords.y;
    const originalX = coords.originalX;
    const originalY = coords.originalY;
    if (Math.sqrt((x - originalX) ** 2 + (y - originalY) ** 2) > 0.2) {
      this.setState({
        ...this.state,
        selected: applyInvertion({ x: originalX, y: originalY }, this.isInverted()),
      });
    } else {
      this.setState({
        ...this.state,
        selected: null,
      });
    }
  };

  stepAI = () => {
    setTimeout(async () => {
      await this.props.step();
      if (this.props.ctx.currentPlayer === '1') {
        this.stepAI();
      }
    }, 1000);
  };

  _onDrop = async (coords: ICartesianCoords) => {
    if (this.state.selected) {
      this._move(applyInvertion(roundCoords(coords), this.isInverted()));
    }
  };

  _move = async (coords: ICartesianCoords) => {
    if (this.state.selected === null || coords === null) {
      return;
    }

    await this.props.moves.move(this.state.selected, coords);
    this.setState({
      ...this.state,
      selected: null,
    });
    if (this.isAIGame() && this.props.ctx.currentPlayer === '1') {
      this.stepAI();
    }
  };

  _getHighlightedSquares() {
    const result = {} as IColorMap;

    if (this.state.selected !== null) {
      result[cartesianToAlgebraic(this.state.selected.x, this.state.selected.y, false)] = blue[700];
      this.state.validMoves
        .filter(move => areCoordsEqual(this.state.selected, move.from))
        .forEach(move => {
          result[cartesianToAlgebraic(move.to.x, move.to.y, false)] = blue[500];
        });
    }

    return result;
  }

  getPieces = () => {
    return this.props.G.board
      .map((piece, index) => ({ data: piece, index }))
      .filter(piece => piece.data !== null)
      .map(piece => {
        const { x, y } = toCoord(piece.index);
        return (
          <Token
            x={x}
            y={y}
            draggable={true}
            shouldDrag={this._shouldDrag}
            onDrop={this._onDrop}
            onDrag={this._onDrag}
            animate={true}
            key={piece.data.id}
          >
            <g>
              <circle r="0.4" fill={piece.data.playerID === '0' ? grey[50] : grey[900]} cx="0.5" cy="0.5" />
              {piece.data.isKing ? (
                <circle r="0.2" cx="0.5" cy="0.5" fill={piece.data.playerID === '1' ? grey[800] : grey[400]} />
              ) : null}
            </g>
          </Token>
        );
      });
  };

  isLocalGame() {
    return this.props.gameArgs && this.props.gameArgs.mode === GameMode.LocalFriend;
  }

  isOnlineGame() {
    return this.props.gameArgs && this.props.gameArgs.mode === GameMode.OnlineFriend;
  }

  isAIGame() {
    return this.props.gameArgs && this.props.gameArgs.mode === GameMode.AI;
  }

  _getStatus() {
    if (this.isOnlineGame()) {
      if (this.props.ctx.currentPlayer === this.props.playerID) {
        return 'Move piece';
      } else {
        return 'Waiting for opponent...';
      }
    } else {
      switch (this.props.ctx.currentPlayer) {
        case '0':
          return "White's turn";
        case '1':
          return "Black's turn";
      }
    }
  }

  _getGameOver() {
    const winner = this.props.ctx.gameover.winner;
    if (winner) {
      if (this.isLocalGame()) {
        if (winner === '0') {
          return 'white won';
        } else {
          return 'black won';
        }
      } else {
        if (winner === this.props.playerID) {
          return 'you won';
        } else {
          return 'you lost';
        }
      }
    }
  }

  componentDidUpdate(prevProps: IBoardProps) {
    if (prevProps.ctx.turn !== this.props.ctx.turn) {
      this.setState({
        ...this.state,
        validMoves:
          this.props.G.jumping === null
            ? getValidMoves(this.props.G, this.props.ctx.currentPlayer)
            : getValidMoves(this.props.G, this.props.ctx.currentPlayer, this.props.G.jumping),
      });
    }
  }

  render() {
    if (this.props.ctx.gameover) {
      return <GameLayout gameOver={this._getGameOver()} gameArgs={this.props.gameArgs} />;
    }

    return (
      <GameLayout>
        <Typography variant="h5" style={{ textAlign: 'center', color: 'white', marginBottom: '16px' }}>
          {this._getStatus()}
        </Typography>
        <Checkerboard
          onClick={this._onClick}
          invert={this.isInverted()}
          highlightedSquares={this._getHighlightedSquares()}
        >
          {this.getPieces()}
        </Checkerboard>
      </GameLayout>
    );
  }
}
