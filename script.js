
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let isAIMode = false;
let scores = {
    X: 0,
    O: 0,
    draws: 0
};


const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];


const cells = document.querySelectorAll('.cell');
const gameStatus = document.getElementById('gameStatus');
const currentPlayerDisplay = document.getElementById('currentPlayer');
const resetBtn = document.getElementById('resetBtn');
const pvpBtn = document.getElementById('pvpBtn');
const pvaiBtn = document.getElementById('pvaiBtn');
const scoreXDisplay = document.getElementById('scoreX');
const scoreODisplay = document.getElementById('scoreO');
const scoreDrawsDisplay = document.getElementById('scoreDraws');

// Event Listeners
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

resetBtn.addEventListener('click', resetGame);
pvpBtn.addEventListener('click', () => setGameMode(false));
pvaiBtn.addEventListener('click', () => setGameMode(true));


loadScores();
updateScoreDisplay();

// Game Functions

function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.getAttribute('data-index'));

    if (gameBoard[index] !== '' || !gameActive) {
        return;
    }

    gameBoard[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());

    if (checkWin()) {
        endGame(`Player ${currentPlayer} Wins!`, currentPlayer);
        return;
    }

    if (checkDraw()) {
        endGame("It's a Draw!", 'draw');
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateDisplay();

    if (isAIMode && currentPlayer === 'O' && gameActive) {
        setTimeout(() => {
            makeAIMove();
        }, 500);
    }
}

function makeAIMove() {
    const bestMove = findBestMove();
    gameBoard[bestMove] = 'O';
    const cell = document.querySelector(`[data-index="${bestMove}"]`);
    cell.textContent = 'O';
    cell.classList.add('o');

    if (checkWin()) {
        endGame("AI Wins!", 'O');
        return;
    }

    if (checkDraw()) {
        endGame("It's a Draw!", 'draw');
        return;
    }

    currentPlayer = 'X';
    updateDisplay();
}

function findBestMove() {
    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'O';
            let score = minimax(gameBoard, 0, false);
            gameBoard[i] = '';

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    return bestMove;
}
function minimax(board, depth, isMaximizing) {
    let result = checkWinner();

    if (result === 'O') return 10 - depth;
    if (result === 'X') return depth -10;
    if (isBoardFull()) return 0;

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

function checkWin() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (
           gameBoard[a] === '' ||
           gameBoard[b] === '' ||
           gameBoard[c] === ''

        ) {
            continue;
        }
        if (
            gameBoard[a] === gameBoard[b] &&
            gameBoard[a] === gameBoard[c]
        ) {
            return true;
        }
    }
    return false;
}

function checkWinner() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (
            gameBoard[a] === '' ||
            gameBoard[b] === '' ||
            gameBoard[c] === ''
        ) {
            continue;
        }
        if (
            gameBoard[a] === gameBoard[b] &&
            gameBoard[a] === gameBoard[c]
        ) {
            return gameBoard[a];
        }
    }
    return null;
}

function checkDraw() {
    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
            return false;
        }
    }
    return true;
}

function isBoardFull() {
    return gameBoard.every(cell => cell !== '');
}
function endGame(message, winner) {
    gameActive = false;
    gameStatus.textContent = message;
    gameStatus.style.color = winner === 'X' ? '#667eea' : winner === 'O' ? '#764ba2' : '#666';

    if (winner === 'X') {
        scores.X++;
    } else if (winner === 'O') {
        scores.O++;
    } else if (winner === 'draw') {
        scores.draws++;
    }

    updateScoreDisplay();
    saveScores();
    cells.forEach(cell => cell.classList.add('disabled'));
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    gameStatus.textContent = '';

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'disabled');
    });

    updateDisplay();
}

function setGameMode(useAI) {
    isAIMode = useAI;
    
    if (useAI) {
        pvaiBtn.classList.add('active');
        pvpBtn.classList.remove('active');
    } else {
        pvpBtn.classList.add('active');
        pvaiBtn.classList.remove('active');
    }

    resetGame();
}

function updateDisplay() {
    currentPlayerDisplay.textContent = currentPlayer;
}

function updateScoreDisplay() {
    scoreXDisplay.textContent = scores.X;
    scoreODisplay.textContent = scores.O;
    scoreDrawsDisplay.textContent = scores.draws;
}

function saveScores() {
    localStorage.setItem('tictacScores', JSON.stringify(scores));
}

function loadScores() {
    const savedScores = localStorage.getItem('tictacScores');
    if (savedScores) {
        scores = JSON.parse(savedScores);
    }

}