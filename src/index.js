import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square 
                key={'square-' + i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderBoard(rowCnt, colCnt) {

        //Initialize Board with empty Rows
        let boardRows = Array(rowCnt).fill();
        let squareCnt = 0;

        for (let i = 0; i < rowCnt ; i++) {

            //Initialize Cols of the current Row
            let boardCols = Array(colCnt).fill();

            //Initialize Squares of Cols
            for (let j = 0; j < colCnt ; j++) {
                boardCols[j] = this.renderSquare(squareCnt);
                squareCnt++; //Increase square count per initialized square
            }

            //Insert Cols with Squares to boardRows
            boardRows[i] = (
                <div 
                    key={'boardRow-' + i}
                    className="board-row"
                >
                    {boardCols}
                </div>
            );

        }

        //Return Rows
        return (
            <div>
                {boardRows}
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.renderBoard(3, 3)}
            </div>
        );
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [
                { squares: Array(9).fill(null) },
            ],
            stepNumber: 0,
            xIsNext: true,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([
                {squares: squares},
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    getMoveLocation(moveNumber) {

        if (!moveNumber) {
            return null;
        }

        const history = this.state.history.slice();
        const current = history[moveNumber].squares;
        const previous = history[moveNumber - 1].squares;

        for (let i = 0 ; i < current.length ; i++) {

            if (current[i] !== previous[i]) {
                return [
                    (i % 3),
                    Math.floor(i / 3)
                ];
            }
        }

        return null;

    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {

            const desc = move ?
                'Go to move #' + move :
                'Go to game start';

            const coordinates = this.getMoveLocation(move);

            const moveLoc = coordinates ?
                '( ' + coordinates.join(' , ') + (' )') :
                '';

            //Highlight if selected move
            const hasHighlightClass = (move === this.state.stepNumber) ? 'highlight' : '';

            return (
                <li 
                    key={move}
                    className={hasHighlightClass}
                >
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                    <span> {moveLoc} </span>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game/>, document.getElementById('root'));


function calculateWinner(squares) {

    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if ( (squares[a]) && (squares[a] === squares[b]) && (squares[a] === squares[c]) ) {
            return squares[a];
        }
    }

    return null;
}
