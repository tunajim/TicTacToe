const gameBoard = (() => {
    let board;
    let playerOne;
    let playerTwo;
    let turn = 'x';
    const cells = document.getElementsByClassName('cell');
    const wins = [
        [0, 1, 2],
	    [3, 4, 5],
	    [6, 7, 8],
	    [0, 3, 6],
	    [1, 4, 7],
	    [2, 5, 8],
	    [0, 4, 8],
	    [6, 4, 2]
    ]

    const resetBoard = () => {
        turn = 'x';
        board = Array.from(Array(9).keys());
        for(let i=0;i<cells.length;i++){
             document.getElementById(cells[i].id).style.removeProperty('background-color');
             document.getElementById(cells[i].id).textContent = "";
        }
    }

    const resetBtnListener = () => {
            let resetBtn = document.getElementById('reset');
            resetBtn.addEventListener('click', function(){
                onReset()});
    }

    const onReset = () => {
        resetBoard();
        turn = 'x';
        document.getElementById('overlay').classList.remove('active');
    }

    const boardListener = () =>{
        let player1 = 'x';
        let player2 = 'o';
        let win = null;
        for(let i=0;i<cells.length;i++){
            cells[i].addEventListener('click', function _listener(){
                handleMove(cells[i]);
            });
        }
        return{
        }
    }

    const handleMove = (cell) => {
        let win, tie;
        if(checkPlayer1Turn(board[cell.id])) {
            setBoard(cell);
            tie = checkForTie();
            win = checkForWin();
            changeTurn();
            setTimeout(() => {
                if(checkIfComputerCanPlay(win, tie)) {
                    setBoard(computerPlay());
                    tie = checkForTie();
                    win = checkForWin();
                    changeTurn();
            }   
            }, 300);
            
        }
        if(checkPlayer2Turn(board[cell.id])) {
            setBoard(cell);
            tie = checkForTie();
            win = checkForWin();
            changeTurn();
        }
        console.log({board, turn, win});
    }

    const checkPlayer1Turn = (board) => {
        return (typeof board === 'number' && turn === 'x');
    }

    const checkPlayer2Turn = (board) => {
        return (typeof board === 'number' && turn === 'o'
            && gameBoard.playerTwo.isHuman() === true);
    }

    const checkIfComputerCanPlay = (win, tie) => {
        return (win === undefined && gameBoard.playerTwo.isHuman() === false
            && tie === undefined);
    }

    const computerPlay = () => {
        let unplayedCells;  
        unplayedCells = board.filter(cell => typeof cell == 'number');
        let randomCell = Math.floor(Math.random() * unplayedCells.length);
        let bestSpot = unplayedCells[randomCell];
        return document.getElementById(bestSpot); 
    }

    const setBoard = cell => {
        let getCell = document.getElementById(cell.id);
        getCell.textContent = turn;
        board[cell.id] = turn;
    }

    const changeTurn = () => {
        if(turn === 'x') {
            turn = 'o';
        }else if(turn === 'o') {
            turn = 'x';
        }
        
    }

    const checkForTie = () => {
        let tied;
        let boardFilter = board.filter(empty => typeof empty === 'number');
        if(boardFilter.length === 0) {
            tied = true;
            document.getElementById('information').textContent = "It's a draw!";
            setBackgroundForTie();
        }
        return tied;
    }

    const setBackgroundForTie = () => {
        for(let i=0;i<cells.length;i++){
                cells[i].style.backgroundColor = "gray";
        }
    }

    const checkForWin = () => {
        let cellPlayed = board.reduce((accumulator, currentCell, index) => 
            (currentCell === turn) ? accumulator.concat(index) : accumulator, []);
        let gameWon = checkWinArray(cellPlayed); 
        getRidOfListeners(gameWon);
        if(gameWon !== undefined) changeBackgroundColor(gameWon);
        return gameWon;
    }

    const checkWinArray = (cell) => {
        let won;
        for(let [index, win] of wins.entries()){
            console.log({board})
            if(win.every(elem => cell.indexOf(elem) > -1)){
                won = {index: index, player: turn};
                break;
            }
        }
        return won;
    }

    const changeBackgroundColor = winner => {
        for(let index of wins[winner.index]){
            document.getElementById(index).style.backgroundColor =
            (winner.player === 'x') ? "seagreen" : "salmon" ;
        }
        document.getElementById('information').textContent = 
        (winner.player === 'x') ? "Player 1 wins!" : "Player 2 wins!";
    }

    const updateBoard = () => {
        for(let i=0;i<cells.length;i++){
            if(typeof board[i] == 'number'){
                document.getElementById(cells[i].id).textContent = "";
            }else{
                document.getElementById(cells[i].id).textContent = `${board[i]}`;
            }
        }
    }

    const getRidOfListeners = won => {
        let overlay = document.getElementById('overlay');
        if(won !== undefined) overlay.classList.add('active');
    }

    return{
        turn: turn,
        board: board,
        playerOne: playerOne,
        playerTwo: playerTwo,
        resetBoard,
        updateBoard,
        boardListener,
        resetBtnListener,
    }
})();



// create player factory
const setPlayer = (player, human) => {
    
    const selectPlayer = () => player;
    const isHuman = () => human;

    return {
        selectPlayer,
        isHuman,
    }
}

const displayController = (() => {
    const cells = document.getElementsByClassName('cell');
    const onePlayerBtn = document.getElementById('onePlayer');
    const twoPlayerBtn = document.getElementById('twoPlayer');
    const informer = document.getElementById('information');
    let isHuman = true;

    const setThePlayers = () => {
        onePlayerBtn.addEventListener('click', function(){
            _onePlayer(onePlayerBtn)});
        twoPlayerBtn.addEventListener('click', function(){
            _twoPlayer(twoPlayerBtn)});
    }
    
    const _onePlayer = button => {
        let isAI = false;
        informer.textContent = "";
        twoPlayerBtn.style.removeProperty('background-color');
        onePlayerBtn.style.backgroundColor = 'salmon'; 
        gameBoard.playerOne = setPlayer('x', isHuman);
        gameBoard.playerTwo = setPlayer('o', isAI);
        document.getElementById('overlay').classList.remove('active');
        playRound();
        document.getElementById('reset').classList.add('active');
        console.log(gameBoard.playerOne);
        
    }

    const _twoPlayer = button => {
        informer.textContent = "";
        onePlayerBtn.style.removeProperty('background-color');
        twoPlayerBtn.style.backgroundColor = 'salmon';
        gameBoard.playerOne = setPlayer('x', isHuman);
        gameBoard.playerTwo = setPlayer('o', isHuman);
        document.getElementById('overlay').classList.remove('active');
        playRound();
        document.getElementById('reset').classList.add('active');
        console.log(gameBoard.playerOne.isHuman(), gameBoard.playerTwo.isHuman())
    }

    const playRound = () => {
        gameBoard.resetBoard();
        gameBoard.boardListener();
        console.log(gameBoard.board)
        gameBoard.updateBoard();
        gameBoard.resetBtnListener();

    }
    
    return {
        setThePlayers,
        playRound,
    }

})();

displayController.setThePlayers();
displayController.playRound();
document.getElementById('reset').addEventListener('click', function(){
    displayController.playRound();
})