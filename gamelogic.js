// Start screen div that disappears on button press
function switchVisible() {
            if (document.getElementById('start')) {

                if (document.getElementById('start').style.display == 'none') 
                {
                    document.getElementById('start').style.display = 'block';
                    document.getElementById('game').style.display = 'none';
                    document.getElementById('resetGame').style.display = 'none';
                }
                else 
                {
                    document.getElementById('start').style.display = 'none';
                    document.getElementById('game').style.display = 'block';
                    document.getElementById('startButton').style.display = 'none';
                    document.getElementById('resetGame').style.display = 'block';
                }
            }
}

// Describe the main area and message area and size of each square
var stage = document.querySelector("#stage");
var output = document.querySelector("#output");
window.addEventListener("keydown", keydownHandler, false);
var SIZE = 64;

// game  and objects maps
var gameMap = 
[
    [0,0,0,0,0,0,0,3],
    [0,0,2,0,0,1,0,0],
    [0,0,0,0,0,0,0,2],
    [1,0,0,0,0,0,0,0],
    [0,0,0,0,2,0,0,0],
    [0,0,1,0,0,0,0,0],
    [0,2,0,0,0,1,0,0],
    [0,0,0,0,2,0,0,0]
];

var gameItems = 
[
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,5,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [4,0,0,0,0,0,0,0]
];

// Game item codes
var GRASS = 0;
var MUSHROOM = 1;
var KOOPA = 2;
var CASTLE = 3;
var MARIO = 4;
var BOWSER = 5;

// Get rows and columns count
var ROWS = gameMap.length;
var COLUMNS = gameMap[0].length;

// Locate starting positions for Mario and BOWSER
var marioRow;
var marioColumn;
var bowserRow;
var bowserColumn;

for (var row = 0; row < ROWS; row ++)
    {
        for (var column = 0; column < COLUMNS; column ++)
            {
                if(gameItems[row][column] === MARIO)
                    {
                        marioRow = row;
                        marioColumn = column;
                    }
                if(gameItems[row][column] === BOWSER)
                    {
                        bowserRow = row;
                        bowserColumn = column;
                    }
            }
    }
// Assign codes for arrow keys
var UP = 38;
var DOWN = 40;
var LEFT = 37;
var RIGHT = 39;

// Starting values for time, coins, health
var time = 20;
var coins = 5;
var health = 1;
var gameMessage = "";

// Draw out map at start
render();

// sound effect functions
function powerUpSound() 
{
    document.getElementById("embed").innerHTML = "<embed src = 'sounds/smb3_power-up.wav' autostart=true loop=false hidden=true>";
}

function koopaWinsSound()
{
    document.getElementById("embed").innerHTML = "<embed src = 'sounds/smb3_pipe.wav' autostart=true loop=false hidden=true>";
}

function koopaLosesSound()
{
    document.getElementById("embed").innerHTML = "<embed src = 'sounds/smb3_jump.wav' autostart=true loop=false hidden=true>";
}

function marioAndKoopaTie()
{
    document.getElementById("embed").innerHTML = "<embed src = 'sounds/smb3_tie.wav' autostart=true loop=false hidden=true>";
}

function marioDies()
{
    document.getElementById("embed").innerHTML = "<embed src = 'sounds/smb3_player_down.wav' autostart=true loop=false hidden=true>";
}

function marioWins()
{
    document.getElementById("embed").innerHTML = "<embed src = 'sounds/smb3_level_clear.wav' autostart=true loop=false hidden=true>";
}
function movement()
{
    document.getElementById("embed").innerHTML = "<embed src = 'sounds/move.wav' autostart=true loop=false hidden=true>";
}

// Reset Button
function resetGame() {
    window.location.reload();
}

var resetButton = document.getElementById("resetGame");
resetButton.addEventListener("click", resetGame, false);

// arrow key movement function
function keydownHandler(event)
{
    movement();
    switch(event.keyCode)
    {
        case UP:
            if(marioRow > 0)
            {
                // clear out the current location
                gameItems[marioRow][marioColumn] = 0;
                // subtract 1 from the current row
                marioRow --;
                // update new location in array
                gameItems[marioRow][marioColumn] = MARIO;
                
            }
            break;
            
        case DOWN:
            if(marioRow < ROWS - 1)
            {
                gameItems[marioRow][marioColumn] = 0;
                marioRow ++;
                gameItems[marioRow][marioColumn] = MARIO; 
            }
            break;
            
        case LEFT:
            if(marioColumn > 0)
            {
                gameItems[marioRow][marioColumn] = 0;
                marioColumn --;
                gameItems[marioRow][marioColumn] = MARIO; 
            }
            break;
            
        case RIGHT:
            if(marioColumn < COLUMNS - 1)
            {
                gameItems[marioRow][marioColumn] = 0;
                marioColumn ++;
                gameItems[marioRow][marioColumn] = MARIO; 
            }
            break;           
        }
    
    // find location of Mario
    switch(gameMap[marioRow][marioColumn])
    {
        case GRASS:
            break;
            
        case MUSHROOM:
            powerUp();
            break;
            
        case KOOPA:
            battle();
            break;
            
        case CASTLE:
            endGame();
            break;
    }
    // Move BOWSER
    moveBowser();
    time --;
    
    // determine if Mario and BOWSER land on same space
    if(gameItems[marioRow][marioColumn] === BOWSER)
        {
            endGame();
        }
    
    
    if(time <= 0)
        {
            endGame();
        }
    if(health <= 0)
        {
            endGame();
        }
    // Redraw the game
    render();
}

// BOWSER's movement
function moveBowser()
{
    // Bowser can move in four different directions
    var UP = 1;
    var DOWN = 2;
    var LEFT = 3;
    var RIGHT = 4;
    
    // This array will store the direction Bowser can move in
    var validDirections = [];
    
    //  This is the last diretion Bowser will move in
    var direction;
    
    // Identify space contents around Bowser and if the space
    // is empty push that direction into the array
    if(bowserRow > 0)
        {
            var itemAbove = gameMap[bowserRow - 1][bowserColumn];
            if(itemAbove === GRASS)
                {
                    validDirections.push(UP);
                }
        }
    if(bowserRow < ROWS - 1)
        {
            var itemBelow = gameMap[bowserRow + 1][bowserColumn];
            if(itemBelow === GRASS)
                {
                    validDirections.push(DOWN);
                }
        }
    if(bowserColumn > 0)
        {
            var itemToLeft = gameMap[bowserRow][bowserColumn - 1];
            if(itemToLeft === GRASS)
                {
                    validDirections.push(LEFT);
                }
        }
    if(bowserColumn < COLUMNS - 1)
        {
            var itemToRight = gameMap[bowserRow][bowserColumn + 1];
            if(itemToRight === GRASS)
                {
                    validDirections.push(RIGHT);
                }
        }
    // now the valid array has between 0 and 4 directions that contain GRASS
    // this allows BOWSER to move in that direction
    if(validDirections.length !== 0)
        {
            // randomly move Goomab in one of those directions
            var randomNum = Math.floor(Math.random() * validDirections.length);
            direction = validDirections[randomNum];
        }
    // now its time to move BOWSER and update its location
    switch(direction)
    {
        case UP:
            // clear out the current location
            gameItems[bowserRow][bowserColumn] = 0;
            // subtract 1 from the current row
            bowserRow --;
            // update ne location in array
            gameItems[bowserRow][bowserColumn] = BOWSER;  
            break;
            
        case DOWN:
            gameItems[bowserRow][bowserColumn] = 0;
            bowserRow ++;
            gameItems[bowserRow][bowserColumn] = BOWSER;  
            break;
        
        case LEFT:
            gameItems[bowserRow][bowserColumn] = 0;
            bowserColumn --;
            gameItems[bowserRow][bowserColumn] = BOWSER;  
            break;
            
        case RIGHT:
            gameItems[bowserRow][bowserColumn] = 0;
            bowserColumn ++;
            gameItems[bowserRow][bowserColumn] = BOWSER;
            break;
        
        default:
            break;
    }
}

// function for eating mushrooms, or , powering up
function powerUp()
{
    
    // Mario can get mushroom is he has enough coins
    if(coins >= 5)
        {
            health += 2;
            coins -= 5;
            time += 1;
            
            gameMessage = "<br>Mario has powered up!";
            powerUpSound();
        }
    else
        {
            
            gameMessage = "<br>You don't have enough coins!";
        }
}

// FIGHT!
function battle()
{
    var marioPower = Math.floor((Math.random() * 10) + 1);
    var koopaPower = Math.floor((Math.random() * 10) + 1);
    
    if(koopaPower > marioPower)
        {
            health -= 1;
            gameMessage = "Koopa wins, Mario loses 1 health!";
            koopaWinsSound();
            
        }
    else if(koopaPower == marioPower)
        {
            gameMessage = "DRAW BATTLE!";
            marioAndKoopaTie();
        }
    else 
        {
            gameMessage = "Mario wins!" + "<br>Mario gains 5 coins and extra time!";
            coins += 5;
            time += 2;
            koopaLosesSound();
        }
}

function endGame()
{
    if(gameMap[marioRow][marioColumn] === CASTLE)
        {
            // calculate a score
            var score = time * (health + coins);
            score = score * time;
            
            // Show final score
            gameMessage = "You've made it to the castle! " + "<br>SCORE: " + score;
            marioWins();
        }
    else if (gameItems[marioRow][marioColumn] === BOWSER)
        {
            gameMessage = "Mario was defeated by BOWSER!";        
            marioDies();
        }
    else
        {
            if(time <=0)
            {
                gameMessage += "<br> OUT OF TIME!";
                marioDies();

            }
            else if(health <=0)
            {
                gameMessage += "<br>OUT OF HEALTH!";
                marioDies();
            }
            else
            {
                 marioDies();
            }
            gameMessage += "<br>YOU LOSE!";

        }
    window.removeEventListener("keydown", keydownHandler, false);
}

// Render function for redrawing game
function render()
{
    // clear out spaces from last turn
    if(stage.hasChildNodes())
        {
            for(var i = 0; i < ROWS * COLUMNS; i ++)
                {
                    stage.removeChild(stage.firstChild);
                }
        }
    // loop through map arrays to redraw game
    for(var row = 0; row < ROWS; row ++)
        {
            for(var column = 0; column < COLUMNS; column ++)
                {
                    // create an image tag called sprite
                    var sprite = document.createElement("img");
                    
                    // link sprite to it's CSS
                    sprite.setAttribute("class", "sprite");
                    
                    // Place tag in the correct location on HTML
                    stage.appendChild(sprite);
                    
                    // Get the corresponding picture for this sprite
                    switch(gameMap[row][column])
                    {
                        case GRASS:
                            sprite.src = "images/grass.png";
                            break;
                        
                        case MUSHROOM:
                            sprite.src = "images/mushroom.png";
                            break;
                        
                        case KOOPA:
                            sprite.src = "images/koopa.png";
                            break;
                            
                        case CASTLE:
                            sprite.src = "images/castle.png";
                            break;                           
                    }
                    
                    // Mario and BOWSER sprite
                    switch(gameItems[row][column])
                    {
                        case MARIO:
                            sprite.src = "images/mario.png";
                            break;
                            
                        case BOWSER:
                            sprite.src = "images/bowser.png";
                            break;                          
                    }
                    
                    // position the sprite
                    sprite.style.top = row * SIZE + "px";
                    sprite.style.left = column * SIZE + "px";
                }
        }
    // Update game messages, coins, health, time
    output.innerHTML = gameMessage;
    output.innerHTML += 
        "<br>Coins: " + coins + ", Health: " +
        health + ", Time: " + time;
    
}
