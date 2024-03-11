let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let mode = 'onePlayer'; // Default mode
let xScore = 0;
let oScore = 0;

const cells = document.querySelectorAll('.cell');
const switchButton = document.querySelector('button:nth-of-type(1)');
const resetButton = document.querySelector('button:nth-of-type(2)');
const xScoreDisplay = document.getElementById('xScore');
const oScoreDisplay = document.getElementById('oScore');
const message = document.querySelector('.msg');
const playerBtn = document.getElementById("player-mode");
const botMode = document.getElementById("bot-mode");
const player1 = document.getElementById("player1-name");
const player2 = document.getElementById("player2-name");
const player2icon = document.getElementById("player2-icon");

function checkWinner(player) {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return winConditions.some(condition => {
        return condition.every(index => board[index] === player);
    });
}

function checkTie() {
    return board.every(cell => cell !== '');
}

function addPlayerColor(currentPlayer,index) {
    if(currentPlayer === 'X'){                              //adding player move color
        cells[index].classList.add("playerXcolor");
    }else{
        cells[index].classList.add("playerOcolor");
    }
}

function addMessageColor(currentPlayer){
    if(currentPlayer === 'X'){
        message.classList.add("playerXBG");
    }else{
        message.classList.add("playerOBG");
    }
}

function makeMove(index) {
    if (board[index] === '' && !checkWinner('X') && !checkWinner('O') && !checkTie()) {
        board[index] = currentPlayer;
        cells[index].textContent = currentPlayer;
        // console.log(currentPlayer)
        addPlayerColor(currentPlayer,index);
        // console.log(cells[index].classList);

        if (checkWinner(currentPlayer)) {
            if (currentPlayer === 'X') {
                xScore++;
                xScoreDisplay.textContent = xScore;
            } else {
                oScore++;
                oScoreDisplay.textContent = oScore;
            }
            message.classList.remove("hide");
            message.innerText = `Congratulations, ${currentPlayer} Won!!`
            addMessageColor(currentPlayer);

        } else if (checkTie()) {
            message.classList.remove("hide");
            message.innerText = "Its a Draw."
            message.classList.add("drawBG");
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (mode === 'onePlayer' && currentPlayer === 'O') {
                makeBotMove();
            }
        }
    }
}

function clearScore() {
    xScore = 0;
    oScore = 0;
    xScoreDisplay.innerText = xScore;
    oScoreDisplay.innerText = oScore;
}

function removeColor(){
    for(let cell of cells){
        cell.classList.remove("playerXcolor");
        cell.classList.remove("playerOcolor");
    }
    message.classList.remove("playerXBG");
    message.classList.remove("playerOBG");
    message.classList.remove("drawBG");
}

function switchMode() {
    if (mode === 'onePlayer') {
        mode = 'twoPlayers';
        player1.textContent = "Player X";
        player2.textContent = "Player O";
        player2icon.classList.remove("fa-robot");
        player2icon.classList.add("fa-user");
    } else {
        mode = 'onePlayer';
        player1.textContent = "Player";
        player2.textContent = "Bot";
        player2icon.classList.remove("fa-user");
        player2icon.classList.add("fa-robot");
    }
    message.classList.add("hide");
    clearScore();
    resetGame();
}


function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    cells.forEach(cell => cell.textContent = '');
    message.classList.add("hide");
    removeColor();
}

function makeBotMove() {
    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    makeMove(bestMove);
}

function minimax(board, depth, isMaximizing) {
    if (checkWinner('O')) {
        return 1;
    } else if (checkWinner('X')) {
        return -1;
    } else if (checkTie()) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}