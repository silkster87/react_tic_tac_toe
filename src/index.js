import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
//We lift the state up by calling the "props". So in the props.onClick we look at the parent of the Square for the onClick Method
//Also for the props.value we look at the parent for what value was set to it. The parent of Square is Board.
//the props.value on Line 11 is determined by the value set to it on Line 21.
  return (
    <button className="square" onClick={props.onClick}>
      {props.value} 
    </button>
  );
}

class Board extends React.Component {
  //We lift the state up again by calling "props" to look at the parent value and onClick method. The parent of Board is Game.
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]} //The value of this is set on Line 121
        onClick={() => this.props.onClick(i)} //The onClick method will go up to the parent on Line 122
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  //Now we have a constructor for props and define what the value and onClick methods do.
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  

  //The handleClick method responds to the onClick method from the children. The argument 'i' passed in will determine what 
  //square was clicked.
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          squareClicked: i,
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  //Even though we have set the state for the history, that is fine as it will not overwrite it and it remains the same.
  //When handleClick is next called it will cut out the history up to the stepnumber
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    
    
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      const squareClicked = step.squareClicked;
      
        return (
          <li key={move}>
            <p>{findColRowfromSquareClicked(squareClicked)}</p>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares} //This displays the current game status telling which squares have X or O etc
            onClick={i => this.handleClick(i)} //We tell specifically to use the handleClick method with the argument 'i' passed to it
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

ReactDOM.render(<Game />, document.getElementById("root"));

//This goes through all the different possible winning combinations and checks to see if any squares match
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function findColRowfromSquareClicked(squareClicked) {
  let colRow = null;
  switch(squareClicked) {
    case 0:
      colRow = 'Col 1, Row 1';
      break;
    case 1:
      colRow = 'Col 2, Row 1';
      break;
    case 2:
      colRow = 'Col 3, Row 1';
      break;
    case 3:
      colRow = 'Col 1, Row 2';
      break;
    case 4:
      colRow = 'Col 2, Row 2';
      break;
    case 5:
      colRow = 'Col 3, Row 2';
      break;
    case 6:
      colRow = 'Col 1, Row 3';
      break;
    case 7:
      colRow = 'Col 2, Row 3';
      break;
    case 8:
      colRow = 'Col 3, Row 3';
      break;
    default:
      colRow = null;
  }
  return colRow;
}
