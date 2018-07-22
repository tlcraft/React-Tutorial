import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button 
        className="square" 
        onClick={props.onClick} // functional components don't need to worry about the keyword this; they only need to key off of the parameters being passed in
      >
        {props.value}
      </button>
    );
}

function BoardRow(props) {
  return (
    <div 
      className="board-row"
    >
      {props.rowSquares}
    </div>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
     />
    );
  }

  renderBoardRow(rowSquares, i) {
    return (
      <BoardRow key={i}
        rowSquares={rowSquares}
      />
    );
  }

  render() {
    const board = [];
    let boardRow = [];

    let index = 0;
    for ( let i = 0; i < 3; i++) {
      boardRow = [];
      for ( let j = 0; j < 3; j++) {
        boardRow.push(this.renderSquare(index++));
      }
      board.push(this.renderBoardRow(boardRow, i));
    }

    return (
      <div>
        {board}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [{
        squares: Array(9).fill(null),
        index: 0,
      }],
      stepNumber: 0,
      xIsNext: true,
      isAscending: true,
    };
  }

  handleClick(i) {
    // .slice will create a copy of the squares array for modification
    // immutability is important in React fundamentally
    // one key use is for comparison of the state of an object
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
        
    // return if the game is over or the square is already filled
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        index: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  handleSortClick() {
    let isAscending = this.state.isAscending;
    this.setState({
      isAscending: !isAscending,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    if (!this.state.isAscending) {
      history.reverse();
    }

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' (' + getPosition(step.index) + ')':
        'Go to game start';
      const cssClass = this.state.stepNumber === move ? 'selected' : '';

      return (
        // Keys are important so that components can be updated correctly and maintain order.
        // Keys are not accessible from components themselves."A component cannot inquire about its key."
        // NOTE: It’s strongly recommended that you assign proper keys whenever you build dynamic lists.
        <li key={move}>
          <button className={cssClass} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    let btnText = (this.state.isAscending ? 'Sort descending' : 'Sort ascending');

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
          <button onClick={() => this.handleSortClick()}>{btnText}</button>
          <ul>{moves}</ul>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function getPosition(index) {
  let position = '';
  if (index >= 0 && index < 9) {
    const coordinates = [
      '0, 0',
      '0, 1',
      '0, 2',
      '1, 0',
      '1, 1',
      '1, 2',
      '2, 0',
      '2, 1',
      '2, 2',
    ]

    position = coordinates[index];
  } 
  
  return position;
}

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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

// TODO
// Display the location for each move in the format (col, row) in the move history list.
// Bold the currently selected item in the move list.
// Rewrite Board to use two loops to make the squares instead of hardcoding them.
// Add a toggle button that lets you sort the moves in either ascending or descending order.
// When someone wins, highlight the three squares that caused the win.
// When no one wins, display a message about the result being a draw.