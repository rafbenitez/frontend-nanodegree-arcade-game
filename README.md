# Front End Nanodegree Arcade Game Project

This is a recreation of a classic arcade game where the player has to reach the opposite side of the game board without collidng with an enemy. Enemies move at varying speeds across the game board. Once the player collides with an enemy, the player loses a life and moves back to the starting position. Once the player reaches the water the level is complete.

## Getting Started

To get started, clone this repository from GitHub:

```
$ git clone https://github.com/rafbenitez/frontend-nanodegree-arcade-game.git
```

## How to Play
### Goal
The goal of the game is to reach the top of the game board without colliding with an enemy

### Player
* Choose a Character
    * The opening screen shows all available player characters.
    * Use the left and right arrow keys to choose a character.
    * Press the enter key to start the game.
* Move your character to the top of the game board by using the left, right, up and down keys.
* Once your character reaches the top of the game board the level is complete and the next level starts
* Once you have completed all levels you win the game!
* Avoid the enemies moving across the game board. If you collide with an enemy you loose a life and the level restarts.
* If you lose all of your lives the game is over!

### Enemies
* Enemies move from left to right across the game board
* Enemies move at different speeds
    * Small beetles move the slowest
    * Large beetles move at medium speed
    * Wasps move the fastest

### Levels
* The game currently has six levels. Beat all levels to win the game.
* Enemies move at different speeds depending on the level you are on. Enemies at the lower levels move the slowest and enemies at the higher levels move the fastest.

## Built With

* No additonal libraries or components were used in building this game.

## Authors

* **Nicolas Artman** - *Initial work* - [nicolasartman](https://github.com/nicolasartman)
* **Mike Wales** - *Initial work*
* **Several others...**
* **Rafael Benitez** - *Customized game for Front End Nanodegree Project* - [rafbenitez](https://github.com/rafbenitez)

## License

This project is licensed under the [MIT License] - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* This is a project for the Udacity Front End Web Developer Nanodegree Program
* Forked from [udacity/frontend-nanodegree-arcade-game](https://github.com/udacity/frontend-nanodegree-arcade-game)
* Adding collision detection to images drawn on canvas
 https://stackoverflow.com/questions/13916966/adding-collision-detection-to-images-drawn-on-canvas
