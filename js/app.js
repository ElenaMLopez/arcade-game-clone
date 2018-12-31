// Variables
const scoreSlctr = document.getElementById("score-value");
const lifeSlctr = document.getElementById("life-value");
const modalSlctr = document.getElementById("modal");
const buttonSlctr = document.querySelector("button");

// Functions

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * @see https://stackoverflow.com/a/1527820
 * @param {number} min - The minimun value.
 * @param {number} max - The maximun value.
 * @return {number} - Random integer number between min/max.
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Show the Game Over modal.
 */
function showModal() {
    modalSlctr.style.display = "block";
};

/**
 * Hide the Game Over modal.
 */
function hideModal() {
    modalSlctr.style.display = "none";
};

/**
 * Duplicate array content. 
 * @see: https://stackoverflow.com/a/33305263
 * @param {array} list - list of items.
 * @return {array} - list of duplicated items. 
 */
function duplicateElements(list) {
    return list.reduce(function(res, current, index, array) {
        return res.concat([current, current]);
    }, []);
}

/** Class representing an enemy. */
class Enemy {
    /**
     * Create an enemy.
     * @param {number} y - The y value.
     */
    constructor(y) {
        this.sprite = 'images/enemy-bug.png';
        this.x = -100;
        this.y = y;
        this.speed = getRandomInt(50, 400);
    }
    /**
     * Update the enemy's position.
     * @param {number} dt - a time delta between ticks
     */
    update(dt) {
        /* 
        If the enemy is outside the board, it returns to the same spot it started. 
        Else, the acceleration of the enemy' movement.     
        */
        if (this.x >= 600) {
            this.x = -100;
        } else {
            this.x += (dt * this.speed);
        }
    }
    /**
     * Draw the enemy on the screen.
     */
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

/** Class representing the player. */
class Player {
    /**
     * Create the player.
     */
    constructor() {
        this.sprite = 'images/char-cat-girl.png';
        this.x = 200;
        this.y = 400;
        this.yStep = 85;
        this.xStep = 100;
        this.score = 0;
        this.scoreStep = 100;
        this.life = 3;
    }
    /**
     * Update the player' score.
     */
    updateScore() {
        scoreSlctr.innerText = `Score = ${this.score}`;
    }

    /**
     * Update the player's lives.
     */
    updateLives() {
        lifeSlctr.innerText = `${this.life}`
    }

    /**
     * Update the player's position.
     * - Collision detecton
     * - Update life counter
     * - Update score counter
     */
    update() {
        const mapLimits = [this.x >= 0, this.x <= 400, this.y >= -25, this.y <= 400];
        // The player hits at least one enemy
        if (allEnemies.some(enemy => {
                const sameY = enemy.y === this.y;
                const playerArea = {
                    min: this.x - (this.xStep / 2),
                    max: this.x + (this.xStep / 2)
                };
                const sameArea = enemy.x >= playerArea.min && enemy.x <= playerArea.max;
                return sameY && sameArea;
            })) {
            // Life counter
            this.life--;
            this.score = 0;

            if (this.life === 0) {
                showModal();
                this.life = 3;
            }
            this.updateLives();
            this.updateScore();
            this.reset();
        }

        // Player reaches water!
        if (this.y <= 0) {

            // Score Text
            this.score += this.scoreStep;
            this.updateScore();
            this.reset();
        }
        if (!mapLimits.every(limit => limit)) {
            this.reset();
        }
    }
    /**
     * Draw the player on the screen.
     */
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    /**
     * Reset the player to the initial position.
     */
    reset() {
        this.x = 200;
        this.y = 400;
    }
    /**
     * Applies coordinates of player' movements through the keys.
     * @param {string} cmd - the pressed key.  
     */
    handleInput(cmd) {
        if (cmd === 'up') {
            this.y -= this.yStep;
        } else if (cmd === 'down') {
            this.y += this.yStep;
        } else if (cmd === 'right') {
            this.x += this.xStep;
        } else if (cmd === 'left') {
            this.x -= this.xStep;
        }
    }
}

// Events

// This listens for key presses and sends the keys to player.handleInput() method. 
document.addEventListener('keyup', e => {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Listens to the button click and hide the Game Over modal. 
buttonSlctr.addEventListener("click", hideModal);

// This array contains the enemies `y` position in the canvas' rows.
const rows = [60, 145, 230];
// We generate 6 new Enemyes for now (2 per row).
const allEnemies = duplicateElements(rows).map(y => new Enemy(y));

// The player generation. 
const player = new Player();