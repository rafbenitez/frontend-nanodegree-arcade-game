/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make 
 * writing app.js a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    // canvas.width = 505;
    canvas.width = 707;
    canvas.height = 640;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        if (gameState === 'play') {
            checkCollisions();
        }
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        if (gameState === 'play') {
            allEnemies[level - 1].forEach(function(enemy) {
                enemy.update(dt);
            });
        }
        player.update();
    }

    function checkCollisions() {
        allEnemies[level - 1].forEach(function(enemy) {
            if (enemy.row === player.row) { // Only need to check enemies that are on the same row as the player
                if ((player.x + playerSpriteXPadding) < enemy.x + spriteWidth &&
                    (player.x + spriteWidth - playerSpriteXPadding) > enemy.x &&
                    player.y < enemy.y + spriteHeight &&
                    player.y + spriteHeight > enemy.y) {
                        gameState = 'playerDied';
                        setTimeout(function(){loseLife();}, 300);
                    }
            }
        });
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        let rowImages = [
                'images/water-block.png',   // Top row is water
                'images/dirt-block.png',    // Row 1 of 1 of dirt
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png'    // Row 1 of 1 of grass
            ],
            numRows = 6,
            numCols = 7,
            row, col;

        // Before drawing, clear existing canvas
        ctx.clearRect(0,0,canvas.width,canvas.height)

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * spriteWidth, row * spriteHeight);
            }
        }

        renderEntities();
        renderGameInfo();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies[level - 1].forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    function renderGameInfo() {
        // Render Player's Score
        ctx.font = '20px sans-serif';
        ctx.fillStyle = 'forestgreen';
        ctx.fillText(`SCORE: ${score.toString().padStart(6, '0')}`, 10, 40);

        // Render Player's Current Level
        ctx.font = '20px sans-serif';
        ctx.fillStyle = 'forestgreen';
        ctx.fillText(`LEVEL: ${level.toString().padStart(2, '0')}`, 605, 40);

        // Render Player's Lives Remaining
        for (let i = 0; i < player.lives; i++) {
            ctx.drawImage(Resources.get(player.sprite), i * (smallSpriteWidth - 15), 560, smallSpriteWidth, smallSpriteHeight);
        }

        // Render Game Messages
        switch (gameState) {
            case 'levelComplete':
                renderLevelComplete();
                break;
            case 'gameOver':
                renderGameOver();
                break;
            case 'gameComplete':
                renderGameComplete();
                break;
            case 'chooseCharacter':
                renderChooseCharacter();
                break;
        }
    }

    // Render Level Complete Message
    function renderLevelComplete() {
        renderMessageBox(204, 215, 300, 82);
        ctx.font = '20px sans-serif';
        ctx.fillStyle = 'forestgreen';
        ctx.fillText(`LEVEL ${level.toString().padStart(2, '0')} COMPLETE!`, 245, 263);
        if (appTimeout === -1) {
            appTimeout = setTimeout(function(){levelUp();}, 1500);
        }
    }

    // Render Game Over Message
    function renderGameOver() {
        renderMessageBox(204, 215, 300, 82);
        ctx.font = '30px sans-serif';
        ctx.fillStyle = 'forestgreen';
        ctx.fillText(`GAME OVER!`, 255, 266);
        if (appTimeout === -1) {
            appTimeout = setTimeout(function(){reset();}, 1500);
        }
    }

    // Render Game Complete Message
    function renderGameComplete() {
        renderMessageBox(204, 215, 300, 82);
        ctx.font = '30px sans-serif';
        ctx.fillStyle = 'forestgreen';
        ctx.fillText(`YOU WON!`, 275, 266);
        if (appTimeout === -1) {
            appTimeout = setTimeout(function(){reset();}, 2000);
        }
    }

    // Render Choose Character Dialog
    function renderChooseCharacter() {
        renderMessageBox(164, 215, 380, 182);
        ctx.font = '20px sans-serif';
        ctx.fillStyle = 'forestgreen';
        ctx.fillText(`CHOOSE YOUR CHARACTER`, 212, 246);
        // Render All Available Characters
        characters.forEach(function(character, i) {
            if (i === characterIndex) {
                ctx.drawImage(Resources.get(selectorSprite), i * (mediumSpriteWidth - 5) + 174, 250, mediumSpriteWidth, mediumSpriteHeight);
            }
            ctx.drawImage(Resources.get(character), i * (mediumSpriteWidth - 5) + 174, 250, mediumSpriteWidth, mediumSpriteHeight);
        });
    }

    // Render Message Box
    function renderMessageBox(x, y, w, h) {
        ctx.fillStyle = 'white';
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = 'forestgreen';
        ctx.lineWidth = 10;
        ctx.strokeRect(x, y, w, h);
    }

    // Reset Game
    function reset() {
        appTimeout = -1;
        player.lives = 5;
        score = 0;
        level = 1;
        characterIndex = 0;
        player.reset();
        gameState = 'chooseCharacter';
    }

    // Advance Player to the next level
    function levelUp() {
        appTimeout = -1;
        player.reset();
        level += 1;
        if (level > allEnemies.length) {
            gameState = 'gameComplete';
        } else {
            gameState = 'play';
        }
    }

    // Deduct one of Player's remaining lives
    function loseLife() {
        player.lives -= 1;
        if (player.lives > 0) {
            player.reset();
            gameState = 'play';
        } else {
            gameState = 'gameOver';
        }
    }

     // Load all images need to render the game including background, characters and enemies
    Resources.load([
        'images/dirt-block.png',
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-beetle.png',
        'images/enemy-bug.png',
        'images/enemy-wasp.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Selector.png'
    ]);

    // Set init as the callback method so that game starts after all images have been loaded
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
