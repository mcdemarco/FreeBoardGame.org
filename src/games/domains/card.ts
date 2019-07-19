export default class Card {
  number: number;
  rank: number;
  owner: number;

  constructor(num: number, rank: number, owner: number) {
    this.number = num;
    this.rank = rank;
    this.owner = owner;
  }
}
