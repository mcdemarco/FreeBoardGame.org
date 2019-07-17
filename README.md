# FreeBoardGame.org

[![Build Status](https://travis-ci.com/freeboardgame/FreeBoardGame.org.svg?branch=master)](https://travis-ci.com/freeboardgame/FreeBoardGame.org)

FOSS platform for publishing your [boardgame.io](https://boardgame.io) games. We curate high quality implementations of board games and optimize your game for delivery so you can quickly reach hundreds of players.

Check our tutorial on how to [publish your boardgame.io game in FBG!](https://freeboardgame.org/blog)

Play now at [FreeBoardGame.org](https://FreeBoardGame.org/)

Download our [Android app here](https://play.google.com/store/apps/details?id=org.freeboardgame)

## Games

- :heavy_check_mark: Chess.
- :heavy_check_mark: TakeSix! (by [JosefKuchar](https://github.com/JosefKuchar), similar to 6 Nimmt)
- :heavy_check_mark: Nine Mens Morris (by [JosefKuchar](https://github.com/JosefKuchar))
- :heavy_check_mark: Reversi (by [JosefKuchar](https://github.com/JosefKuchar), similar to Rollit and Othelo)
- :heavy_check_mark: Seabattle (similar to Battleship).
- :heavy_check_mark: Cornerus (by [JosefKuchar](https://github.com/JosefKuchar), similar to Blokus)
- :heavy_check_mark: TicTacToe.
- :heavy_check_mark: Checkers
- :heavy_check_mark: Domains (similar to [Magnate](http://decktet.wikidot.com/game:magnate))

Check the [game development kanban](https://github.com/freeboardgame/FreeBoardGame.org/projects/11)

## Features

- :heavy_check_mark: Code splitting.
- :heavy_check_mark: Server side rendering.
- :heavy_check_mark: Installable.
- :heavy_check_mark: Loads fast - small javascript sizes.
- :heavy_check_mark: Works offline.
- :construction: Party/lobby system.
- :construction: i18n.

Check out the [infrastructure kanban](https://github.com/freeboardgame/FreeBoardGame.org/projects/6).

## Contributing

Contributions are always welcome, even if just reporting bugs (check the [known bugs kanban](https://github.com/freeboardgame/FreeBoardGame.org/projects/13)). Feel free to ask for any help :).

## Community

<a href="https://discord.gg/AaE6n3n" target="_blank"><img src="https://discordapp.com/assets/fc0b01fe10a0b8c602fb0106d8189d9b.png" alt="Discord Logo" width="240" height="80" /></a>

## Running locally

```
git clone https://github.com/freeboardgame/FreeBoardGame.org
cd FreeBoardGame.org

yarn install

yarn run dev
```

Open [http://localhost:8000/](http://localhost:8000/)

## Running with [Docker Compose](https://docs.docker.com/compose/)

[Install Docker Compose](https://docs.docker.com/compose/install/), then:

```
git clone https://github.com/freeboardgame/FreeBoardGame.org
cd FreeBoardGame.org

docker-compose up --build
```

Open [http://localhost:8000/](http://localhost:8000/)
