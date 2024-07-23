"use strict";
//From vue.js documentation
//Computer Never looses logic: https://www.geeksforgeeks.org/finding-optimal-move-in-tic-tac-toe-using-bestMove-algorithm-in-game-theory/

const app = Vue.createApp({
  data() {
    return {
      //from assignment 3 readme
      board: [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ],
      startingMove: "X",
      winingPlayer: null,
    };
  },
  methods: {
    //How players move on the grid and what symbol will show up
    clickOnCell(i, j) {
      if (this.endGame(this.board)) {
        return;
      }

      if (this.board[i][j] === "") {
        this.board[i][j] = this.startingMove;

        if (this.endGame(this.board)) {
          return;
        }

        this.startingMove = "O";
        this.computerPlay();
      }
    },

    //this finds the empty cells that both the user and computer can play
    getPlayableCells() {
      const empty = [];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (this.board[i][j] === "") {
            empty.push({ i, j });
          }
        }
      }
      return empty;
    },

    //This is the computer playing
    computerPlay() {
      if (!this.endGame(this.board)) {
        const bestMove = this.bestMove(this.board, "O");
        this.board[bestMove.i][bestMove.j] = "O";
        this.startingMove = "X";
      }
    },

    //This is the algorithm on how the computer chooses its moves based on bestMove
    //This is based on the minimax algorithm

    bestMove(board, player) {
      if (this.endGame(board)) {
        return this.whoWon(board);
      }

      const playableCell = this.getPlayableCells();

      const playMoves = [];

      playableCell.forEach((move) => {
        board[move.i][move.j] = player;

        if (player === "O") {
          move.score = this.bestMove(board, "X").score;
        } else {
          move.score = this.bestMove(board, "O").score;
        }

        board[move.i][move.j] = "";

        playMoves.push(move);
      });

      let bestMove;
      if (player === "O") {
        let bestScore = -Infinity;
        playMoves.forEach((move) => {
          if (move.score > bestScore) {
            bestScore = move.score;
            bestMove = move;
          }
        });
      } else {
        let bestScore = Infinity;
        playMoves.forEach((move) => {
          if (move.score < bestScore) {
            bestScore = move.score;
            bestMove = move;
          }
        });
      }
      if (!bestMove) {
        return { score: 0 };
      }
      return bestMove;
    },

    //Who won? lol
    whoWon(board) {
      //horizontal
      if (
        board[0][0] != "" &&
        board[0][0] == board[0][1] &&
        board[0][1] == board[0][2]
      ) {
        //if the computer wins return 1 else return -1
        if (board[0][0] == "O") {
          return 1;
        } else {
          return -1;
        }
      }
      if (
        board[1][0] != "" &&
        board[1][0] == board[1][1] &&
        board[1][1] == board[1][2]
      ) {
        //if the computer wins return 1 else return -1
        if (board[1][0] == "O") {
          return 1;
        } else {
          return -1;
        }
      }
      if (
        board[2][0] != "" &&
        board[2][0] == board[2][1] &&
        board[2][1] == board[2][2]
      ) {
        //if the computer wins return 1 else return -1
        if (board[2][0] == "O") {
          return 1;
        } else {
          return -1;
        }
      }

      //vertical
      if (
        board[0][0] != "" &&
        board[0][0] == board[1][0] &&
        board[1][0] == board[2][0]
      ) {
        //if the computer wins return 1 else return -1
        if (board[0][0] == "O") {
          return 1;
        } else {
          return -1;
        }
      }
      if (
        board[0][1] != "" &&
        board[0][1] == board[1][1] &&
        board[1][1] == board[2][1]
      ) {
        //if the computer wins return 1 else return -1
        if (board[0][1] == "O") {
          return 1;
        } else {
          return -1;
        }
      }
      if (
        board[0][2] != "" &&
        board[0][2] == board[1][2] &&
        board[1][2] == board[2][2]
      ) {
        //if the computer wins return 1 else return -1
        if (board[0][2] == "O") {
          return 1;
        } else {
          return -1;
        }
      }

      //diagonal
      if (
        board[0][0] != "" &&
        board[0][0] == board[1][1] &&
        board[1][1] == board[2][2]
      ) {
        //if the computer wins return 1 else return -1
        if (board[0][0] == "O") {
          return 1;
        } else {
          return -1;
        }
      }
      if (
        board[0][2] != "" &&
        board[0][2] == board[1][1] &&
        board[1][1] == board[2][0]
      ) {
        //if the computer wins return 1 else return -1
        if (board[0][2] == "O") {
          return 1;
        } else {
          return -1;
        }
      }

      //if there is a tie
      return 0;
    },

    //When the game ends
    endGame(board) {
      //horizontal
      if (
        board[0][0] != "" &&
        board[0][0] == board[0][1] &&
        board[0][1] == board[0][2]
      ) {
        return true;
      }
      if (
        board[1][0] != "" &&
        board[1][0] == board[1][1] &&
        board[1][1] == board[1][2]
      ) {
        return true;
      }
      if (
        board[2][0] != "" &&
        board[2][0] == board[2][1] &&
        board[2][1] == board[2][2]
      ) {
        return true;
      }

      //vertical
      if (
        board[0][0] != "" &&
        board[0][0] == board[1][0] &&
        board[1][0] == board[2][0]
      ) {
        return true;
      }
      if (
        board[0][1] != "" &&
        board[0][1] == board[1][1] &&
        board[1][1] == board[2][1]
      ) {
        return true;
      }
      if (
        board[0][2] != "" &&
        board[0][2] == board[1][2] &&
        board[1][2] == board[2][2]
      ) {
        return true;
      }

      //diagonal
      if (
        board[0][0] != "" &&
        board[0][0] == board[1][1] &&
        board[1][1] == board[2][2]
      ) {
        return true;
      }
      if (
        board[0][2] != "" &&
        board[0][2] == board[1][1] &&
        board[1][1] == board[2][0]
      ) {
        return true;
      }

      return false;
    },

    //Resets game
    resetGame() {
      //from assignment 3 readme
      this.board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ];
      this.startingMove = "X";
      this.winingPlayer = null;
    },
  },
});

app.mount("#myapp");
