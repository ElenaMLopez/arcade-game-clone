// Variables
const [scoreSlctr, lifeSlctr] = document.querySelectorAll("#score > p");
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

function showModal(){
    modalSlctr.style.display = "block"; 
};

function hideModal (){
    modalSlctr.style.display = "none"; 
};

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

/** Class representing the player. */
class Player {
     /**
     * Create the player.
     */
    constructor(){
        this.sprite = 'images/char-cat-girl.png';
        this.x = 200;  
        this.y = 400;
        this.yStep = 85;
        this.xStep = 100; 
        this.score = 0; 
        this.life = 3; 
    }
    
    updateScore(){
        scoreSlctr.innerText = `Score: ${this.score}`;
    }
    
    updateLives(){
        lifeSlctr.innerText = `Lives x ${this.life}`
    }
    /**
     * Update the player's position.
     */
    update(){
        const mapLimits = [ this.x >= 0, this.x <= 400, this.y >= -25, this.y <= 400 ];
        // The player hits at least one enemy
        if (allEnemies.some(enemy => {
            const sameY = enemy.y === this.y;
            const playerArea = {
                min: this.x - (this.xStep/2),
                max: this.x + (this.xStep/2)
            }; 
            const sameArea = enemy.x >= playerArea.min && enemy.x <= playerArea.max;
            return sameY && sameArea;
        })){
            // Life counter
            this.life--;
            this.score = 0; 
            
            if (this.life === 0){
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
            this.score++; 
            this.updateScore();
            this.reset();
        }
        if (!mapLimits.every(limit => limit)){
            this.reset();
        }
    }
    /**
     * Draw the player on the screen.
     */
    render(){
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
    handleInput(cmd){
        if (cmd === 'up'){
            this.y -= this.yStep; 
        } else if (cmd === 'down'){
            this.y += this.yStep; 
        } else if (cmd === 'right'){
            this.x += this.xStep; 
        } else if (cmd === 'left'){
            this.x -= this.xStep; 
        }
    }
}

// Now instantiate your objects.

// Place all enemy objects in an array called allEnemies
const floors = [60,145,230] // `y` values for each floor
// We generate 3 new Enemyes for now...
const allEnemies = floors.map(y => new Enemy(y));

// Place the player object in a variable called player
const player = new Player();


// Events

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

// buttonSlctr
buttonSlctr.addEventListener("click", () => {
    hideModal();
});