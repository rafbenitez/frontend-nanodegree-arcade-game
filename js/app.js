// Game Constants
const spriteWidth = 101;
const spriteHeight = 83;
const imageHeight = 171;
const enemyYOffset = 20;
const playerYOffset = 30;
const playerSpriteXPadding = 15;

// Enemies our player must avoid
var Enemy = function(row, speed, startingXOffset) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.row = row;
    this.startingXOffset = startingXOffset;
    this.x = spriteWidth * startingXOffset;
    this.y = (this.row * spriteHeight) - enemyYOffset;
    this.speed = speed;
    if (this.speed >= 3) {
        this.sprite = 'images/enemy-wasp.png';
    } else if (this.speed >= 2) {
        this.sprite = 'images/enemy-beetle.png';
    } else {
        this.sprite = 'images/enemy-bug.png';
    }
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt * 100;
    if (this.x > ctx.canvas.width) {
        this.x = -spriteWidth;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
let Player = function() {
    this.lives = 5;
};

Player.prototype.reset = function() {
    this.sprite = characters[characterIndex];
    // Play starts at bottom center of canvas
    this.col = 3;
    this.x = 0;
    this.row = 5;
    this.y = 0;
    this.lowestRow = 5;
};

Player.prototype.update = function() {
    this.x = this.col * spriteWidth;
    this.y = (this.row * spriteHeight) - playerYOffset;
}

Player.prototype.render = function() {
    let tombstoneYOffset = 60;
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    if (gameState === 'playerDied') {
        // Draw X over player after colliding with enemy
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 15;
        ctx.moveTo(this.x + playerSpriteXPadding, this.y + tombstoneYOffset);
        ctx.lineTo(this.x + spriteWidth - playerSpriteXPadding, this.y + spriteHeight + tombstoneYOffset);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 15;
        ctx.moveTo(this.x + spriteWidth - playerSpriteXPadding, this.y + tombstoneYOffset);
        ctx.lineTo(this.x + playerSpriteXPadding, this.y + spriteHeight + tombstoneYOffset);
        ctx.stroke();

    }
};

Player.prototype.handleInput = function(inputKey) {
    switch (inputKey) {
        case 'left':
            this.col -= 1;
            if (this.col < 0) {
                this.col = 0;
            }
            break;
        case 'up':
            this.row -= 1;
            if (this.row < 0) {
                this.row = 0;
            }
            if (this.row < this.lowestRow) {
                score += 10;
                this.lowestRow = this.row;
                if (this.lowestRow === 0) {
                    score += 100;
                    if (level < allEnemies.length) {
                        gameState = 'levelComplete';
                    } else {
                        gameState = 'gameComplete';
                    }
                }
            }
            break;
        case 'right':
            this.col += 1;
            if (this.col > 6) {
                this.col = 6;
            }
            break;
        case 'down':
            this.row += 1;
            if (this.row > 5) {
                this.row = 5;
            }
            break;
    }
};

Player.prototype.handleChooseInput = function(inputKey) {
    switch (inputKey) {
        case 'left':
            characterIndex -= 1;
            if (characterIndex < 0) {
                characterIndex = characters.length - 1;
            }
            player.reset();
            break;
        case 'right':
            characterIndex += 1;
            if (characterIndex > characters.length - 1) {
                characterIndex = 0;
            }
            player.reset();
            break;
        case 'enter':
            gameState = 'play';
            break;
    }
};

let gameState = 'play';
let selectorSprite = 'images/Selector.png';
let characterIndex = 0;
let characters = [
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
    ];

let score = 0;
let level = 1;
let appTimeout = -1;

let smallSpriteWidth = spriteWidth * 0.5;
let smallSpriteHeight = imageHeight * 0.5;
let mediumSpriteWidth = spriteWidth * 0.75;
let mediumSpriteHeight = imageHeight * 0.75;

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

let player = new Player();
player.reset();

let enemyR1S3 = new Enemy(1, 3); // Top row enemy is the fastest
let enemyR2S2 = new Enemy(2, 2); // Middle row enemy is medium speed
let enemyR3S1 = new Enemy(3, 1); // Bottom row enemy is slowest

let allEnemies = [
    [   // Level 1 Enemies
        new Enemy(1, 1.25, -1),
        new Enemy(2, 1, -1),
        new Enemy(3, 0.75, 1),
        new Enemy(4, 0.6, 2)
    ],
    [   // Level 2 Enemies
        new Enemy(1, 1.5, -2),
        new Enemy(2, 1.25, 3),
        new Enemy(3, 1, 2),
        new Enemy(4, 0.75, 1)
    ],
    [   // Level 3 Enemies
        new Enemy(1, 2, -1),
        new Enemy(2, 1.5, 2),
        new Enemy(3, 1.25, 1),
        new Enemy(4, 1, 1)
    ],
    [   // Level 4 Enemies
        new Enemy(1, 3, -2),
        new Enemy(2, 2.5, -1),
        new Enemy(3, 2, -1),
        new Enemy(4, 1.75, -1)
    ],
    [   // Level 5 Enemies
        new Enemy(1, 4, -2),
        new Enemy(2, 3, -2),
        new Enemy(3, 2.5, -1),
        new Enemy(4, 2.25, -1)
    ],
    [   // Level 6 Enemies
        new Enemy(1, 4.5, -1),
        new Enemy(2, 4.25, 5),
        new Enemy(3, 4, 1),
        new Enemy(4, 3.75, 2)
    ]
];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        13: 'enter',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    if (gameState === 'chooseCharacter') {
        player.handleChooseInput(allowedKeys[e.keyCode]);
    } else if (gameState === 'play') {
        player.handleInput(allowedKeys[e.keyCode]);
    }

});
