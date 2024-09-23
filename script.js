const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('#score');
const buttons = document.querySelectorAll('.btn');

const easyButton = document.querySelector('#easy');
const mediumButton = document.querySelector('#medium');
const hardButton = document.querySelector('#hard');

const blockWidth = 100;
const blockHeight = 20;
const boardWidth = 560;
const boardHeight = 400;
const ballPosition = [270, 30];
const ballDiameter = 20;

let timerId;
let score = 0;
let xDirection = -2;
let yDirection = 2;
let finishGame = false;

const userPosition = [230, 10];
let currentPosition = userPosition;

// Create a User block
const user = document.createElement('div');
user.classList.add('user');
grid.appendChild(user);
drawUser();


// Create a ball
const ball = document.createElement('div');
ball.classList.add('ball');
grid.appendChild(ball);
drawBall();


//create Block
class Block {
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis];
        this.bottomRight = [xAxis + blockWidth, yAxis];
        this.topLeft = [xAxis, yAxis + blockHeight];
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
    }
}


const blocks = [
    new Block(10, 370),
    new Block(120, 370),
    new Block(230, 370),
    new Block(340, 370),
    new Block(450, 370),
    new Block(10, 340),
    new Block(120, 340),
    new Block(230, 340),
    new Block(340, 340),
    new Block(450, 340),
    new Block(10, 310),
    new Block(120, 310),
    new Block(230, 310),
    new Block(340, 310),
    new Block(450, 310),
]


// Draw a block
function drawBlock() {
    for (i = 0; i < blocks.length; i++) {
        const block = document.createElement('div');
        block.classList.add('block');
        block.style.left = blocks[i].bottomLeft[0] + 'px';
        block.style.bottom = blocks[i].bottomLeft[1] + 'px';
        grid.appendChild(block);
    }
}
drawBlock();

// Draw the user Block
function drawUser() {
    user.style.left = userPosition[0] + 'px';
    user.style.bottom = userPosition[1] + 'px';
}

function drawBall() {
    ball.style.left = ballPosition[0] + 'px';
    ball.style.bottom = ballPosition[1] + 'px';
}

function game() {
    // Moving the user block
    function moveUser(e) {
        switch (e.key) {
            case 'a':
                if (currentPosition[0] > 0) {
                    currentPosition[0] -= 10;
                    drawUser();
                }
                break;
            case 'd':
                if (currentPosition[0] < boardWidth - blockWidth) {
                    currentPosition[0] += 10;
                    drawUser();
                }
                break;
        }
    }
    document.addEventListener('keydown', moveUser);

    // Move the ball
    function moveBall() {
        ballPosition[0] += xDirection;
        ballPosition[1] += yDirection;
        drawBall();
        checkCollision();
    }

    // Changing The Speed based on the Difficulty...
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (button === easyButton) {
                timerId = setInterval(moveBall, 20);
                checkCollision();
            }

            if (button === mediumButton) {
                timerId = setInterval(moveBall, 10);
                checkCollision();
            }

            if (button === hardButton) {
                timerId = setInterval(moveBall, 5);
                checkCollision();
            }
        })
    });


    // Check for Collisions
    function checkCollision() {
        // Check for block Collisions 
        for (let i = 0; i < blocks.length; i++) {
            if (
                (ballPosition[0] > blocks[i].bottomLeft[0] && ballPosition[0] < blocks[i].bottomRight[0]) &&
                ((ballPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballPosition[1] < blocks[i].topLeft[1])
            ) {
                const allBlocks = Array.from(document.querySelectorAll('.block'));
                allBlocks[i].classList.remove('block');
                blocks.splice(i, 1);
                changeDirection();
            }
            // Check for win
            if (blocks.length == 0) {
                score++;
                scoreDisplay.innerText = "You Won! Total Wins: " + score;
                clearInterval(timerId);
                document.removeEventListener('keydown', moveUser);
            }
        }

        // Check for user Collisions
        if (
            (ballPosition[0] > userPosition[0] && ballPosition[0] < userPosition[0] + blockWidth) &&
            (ballPosition[1] > userPosition[1] && ballPosition[1] < userPosition[1] + blockHeight)
        ) {
            changeDirection()
        }


        // Check for wall Collisions
        if (
            ballPosition[0] >= (boardWidth - ballDiameter) ||
            ballPosition[1] >= (boardHeight - ballDiameter) ||
            ballPosition[0] <= 0
        ) {
            changeDirection();
        }

        // Check for game over
        if (ballPosition[1] <= 0) {
            scoreDisplay.innerText = "You lost! Total Wins: " + score;
            clearInterval(timerId);
            document.removeEventListener('keydown', moveUser);
        }
    }

    function changeDirection() {
        if (xDirection === 2 && yDirection === 2) {
            yDirection = -2;
            return
        }
        if (xDirection === 2 && yDirection === -2) {
            xDirection = -2;
            return
        }
        if (xDirection === -2 && yDirection === -2) {
            yDirection = 2;
            return
        }
        if (xDirection === -2 && yDirection === 2) {
            xDirection = 2;
            return
        }
    }
}

game();
