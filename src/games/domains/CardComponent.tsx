import * as React from 'react';
import Card from './card';
import css from './CardComponent.css';
import Typography from '@material-ui/core/Typography';

export interface ICardProps {
  card: Card;
  click?: () => void;
}

export class CardComponent extends React.Component<ICardProps, {}> {
  render() {
    const ranks: any = {
      0: '#b9bbbd',
      1: '#e66b2f',
      2: '#52a3e8',
      3: '#c37132',
      4: '#58ca33',
      5: '#e3f940',
    };

    return (
      <div
        onClick={this.props.click}
        className={css.Card}
        style={{
          background: ranks[this.props.card.rank],
        }}
      >
        <Typography
          className="CardRank"
          style={{
            textAlign: 'center',
            lineHeight: '20px',
          }}
          variant="body2"
        >
          {this.props.card.rank}
        </Typography>
        <Typography
          className="CardNumber"
          style={{
            textAlign: 'center',
            lineHeight: '45px',
            verticalAlign: 'middle',
          }}
          variant="h4"
        >
          {this.props.card.number}
        </Typography>
      </div>
    );
  }
}
