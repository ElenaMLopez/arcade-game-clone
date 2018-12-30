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

/** Class representing an enemy. */
class Enemy {
    /**
     * Create an enemy.
     * @param {number} y - The y value.
     */
    constructor(y){
        this.sprite = 'images/enemy-bug.png';
        this.x = -100;  
        this.y = y; 
        this.speed = getRandomInt(50, 400);
    }
    /**
     * Update the enemy's position.
     * @param {number} dt - a time delta between ticks
     */
    update(dt){
        /* 
        If the enemy is outside the board, it returns to the same spot it started. 
        Else, the acceleration of the enemy' movement.     
        */ 
        if (this.x >= 600) {
            this.x = -100; 
        } else {
            this.x += (dt*this.speed);
        }
    }
    /**
     * Draw the enemy on the screen.
     */
    render () {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// Now write your own player class
class Player {
    constructor(){
        this.sprite = 'images/char-cat-girl.png';
        this.x = 200;  
        this.y = 400;
    }
    // This class requires an update(), render() and
    // a handleInput() method.
    update(){}
    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    handleInput(cmd){
        const yStep = 85;
        const xStep = 100; 
        if (cmd === 'up'){
            this.y -= yStep; 
        } else if (cmd === 'down'){
            this.y += yStep; 
        } else if (cmd === 'right'){
            this.x += xStep; 
        } else if (cmd === 'left'){
            this.x -= xStep; 
        }
    }
}

// Now instantiate your objects.

// Place all enemy objects in an array called allEnemies
const floors = [60,140,225] // `y` values for each floor
// We generate 3 new Enemyes for now...
const allEnemies = floors.map(y => new Enemy(y));

// Place the player object in a variable called player
const player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', e => {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
