import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick_bord}>
      {props.value_bord}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value_bord={this.props.squares_game[i]}
        onClick_bord={() => this.props.onClick_game(i)}
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
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares_game: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    // 巻き戻した際、別の世界線からやり直す場合の処理
    // state から history状態配列をコピーしておく。
    const history_arr = this.state.history.slice(0, this.state.stepNumber + 1);
    const current_arr = history_arr[history_arr.length - 1];
    const squares_arr = current_arr.squares_game.slice();

    // クリック時に既に桝目に NULL 以外（ X か O ）が記録されている場合 false となり、何も変化を起こさない。
    if (calculateWinner(squares_arr) || squares_arr[i]) {
      return;
    }

    squares_arr[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history_arr.concat([
        {
          squares_game: squares_arr
        }
      ]),
      stepNumber: history_arr.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  render() {
    const history_arr = this.state.history;
    const current_arr = history_arr[this.state.stepNumber];
    const winner = calculateWinner(current_arr.squares_game);

    const moves = history_arr.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";

      // console.log('steps =', step, '|', 'move =', move);
      return (
        <li key={move}>
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

    console.log(current_arr.squares_game);

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares_game={current_arr.squares_game}
            onClick_game={i => this.handleClick(i)}
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

// // 以下、無くてもいい。単にReact JSXの表現を理解するために記載したテスト用！
// class ShoppingList extends React.Component {
//   render() {
//     return (
//       <div className="shopping-list">
//         <h1>Shopping List for {this.props.name}</h1>
//         <ul>
//           <li>Instagram</li>
//           <li>WhatsApp</li>
//           <li>Oculus</li>
//         </ul>
//       </div>
//     );
//   }
// }

// function App() {
//   return (
//     <div className="App">
//       <h1>React Tutorial 三目並べ！</h1>
//       <Game />
//       <hr />
//       <h1>Hello CodeSandbox</h1>
//       <h2>Start editing to see some magic happen!</h2>

//       <ShoppingList name="カレーがいいな！" />
//     </div>
//   );
// }

// ========================================
// const rootElement = document.getElementById("root");
// ReactDOM.render(<Game />, rootElement);

// ========================================
ReactDOM.render(<Game />, document.getElementById("root"));

// ========================================
// Helper function
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
