/* define HTML elements*/
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');
/* define game variables  */
let snake = [{ x: 10, y: 10 }] /* 10th row and 10th column as starting position */
const gridSize = 20;
let food = generateFood();
let direction = 'right';
let gameInterval;
let gameSpeedDelay= 200;
let gameStarted = false;
let highScore = 0;

/* Draw game map */
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

/* Draw the snake */
function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    })
}

/* Create snake or food inside board */
function createGameElement( tag, classNameGiven) {
    const element = document.createElement(tag);

    element.className = classNameGiven;

    return element;
}

/* Set position of snake or food on board */
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

/* Draw Food inside board */
function drawFood() {
    if(gameStarted){
        
        const foodElement = createGameElement('div', 'food');

        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
}

/* Generate Food on board */
function generateFood(){
    const x = Math.floor(Math.random() * gridSize) + 1 ;
    const y = Math.floor(Math.random() * gridSize) + 1 ;

    return {x, y};
}

/* Moving the snake on the board */
function move() {
    const head = {...snake[0]};
    switch(direction) {
        case 'up':
            head.y--;
            break;
        case 'right':
            head.x++;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
    }

    snake.unshift(head);

    /* When the snake eats the food */
    if(head.x === food.x && head.y === food.y){
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval); // Clear past interval
        gameInterval = setInterval( () => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    } 
    else{
        snake.pop();
    }
}

/* Start game function */
function startGame() {
    gameStarted = true; /* Keep track of a running game */
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

/* Key press event listener */
function handleKeyPress(event) {
    if((!gameStarted && event.code === 'Space') || 
        (!gameStarted && event.key === ' ')){
        startGame();
    }
    else{
        switch(event.key){
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;  
            case 'ArrowDown':
                direction = 'down';
                break; 
            case 'ArrowLeft':
                direction = 'left';
                break;      
        }
    }
}

function checkCollision(){
    const head = snake[0];

    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize){
        resetGame();
    }

    for(let indx = 1; indx < snake.length; indx++){
        if((head.x === snake[indx].x) && (head.y === snake[indx].y)){
            resetGame();
        }
    }
}

function increaseSpeed(){
    return true;
}

function resetGame(){
    updateHighScore();
    stopGame();
    snake = [{ x: 10, y: 10}];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

function updateScore(){
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
}

function updateHighScore(){
    const currentScore = snake.length - 1;

    if(currentScore > highScore){
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }

    highScoreText.style.display = 'block';
}

function stopGame(){
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

document.addEventListener('keydown', handleKeyPress);

//need to add blink to show how game is over and speed issues after each time food is eaten 