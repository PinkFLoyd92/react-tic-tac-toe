import PlayersManager from '../playersManager/PlayersManager';
import { isFunction } from 'underscore';

class TicTacToe {
  constructor(playerOne, playerTwo, onGameEnd) {
    this.board_ = new Map();
    this.playersManager_ = new PlayersManager([
      {
        id: 1,
        name: playerOne,
        class: 'player1'
      },
      {
        id: 2,
        name: playerTwo,
        class: 'player2'
      }
    ]);
    this.onGameEnd = onGameEnd;
  }

  /**
   * Walks through Board column looking for unmatched slots in order to 
   * determine if the current player got a column matching. Returns true if 
   * it has, otherwise returns false.
   * @param {Number} column The Column index.
   * @private 
   **/
  checkColumn_(column) {
    for (let j = column; j < column + 9; j += 3) {
      if (this.checkUnMatch_(j)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Walks through Board lines looking for unmatched slots in order to 
   * determine if the current player got a line matching. Returns true if 
   * it has, otherwise returns false.
   * @param {Number} line The Line index.
   * @private 
   **/
  checkLine_(line) {
    for (let j = line; j < line + 3; j++) {
      if (this.checkUnMatch_(j)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Logic to determine if a given slot is valid or not based on players. 
   * There is only two invalid cases. If the slot is empty or if the slot 
   * content doesn't match with the reference of the current player.
   * @param {Number} slotIndex The slot index.
   * @private 
   **/
  checkUnMatch_(slotIndex) {
    let currentPlayer = this.playersManager_.getCurrentPlayer();
    let slot = this.board_.get(slotIndex); 
    return (!slot || slot !== currentPlayer.id)
  }

  /**
   * Calls the onGameEnd listener callback with the winner's instance.
   * @param {Object|undefined} winner The user who won the game.
   * @private
   **/
  endGame_(winner) {
    if (isFunction(this.onGameEnd)) {
      this.onGameEnd(winner);
    }
  }

  /**
   * Logic to determine if a given slot is valid or not based on players. 
   * There is only two invalid cases. If the slot is empty or if the slot 
   * content doesn't match with the reference of the current player.
   * @returns {Array<Number>} The game board.
   **/
  getBoard() {
    return this.board_;
  }

  /**
   * Fills a specific board slot and also checks if there is a winner, 
   * if it has, do not call the next game turn and end the game.
   * @param {Number} index the slot index.
   **/
  fillSlot(index) {
    if (this.board_.get(index)) {
      return;
    }

    if (this.board_.size < 9) {
      let currentPlayer = this.playersManager_.getCurrentPlayer();
      this.board_.set(index, currentPlayer.id);
    }

    let winner = this.getWinner_();

    if (winner || this.board_.size === 9) {
      this.endGame_(winner);
    }
    else {
      this.playersManager_.nextPlayerTurn();
    }
  }

  /**
   * Checks all the possibilities of have a winner and return the Player instance.
   * @returns {Object|undefined} Returns the currentPlayer if a winner is found
   * @private 
   **/
  getWinner_() {
    let hasWinner = this.visitLines_() || this.visitColumns_() || 
      this.visitDiagonalUpLeft_() ||
      this.visitDiagonalUpRight_();

    if (hasWinner) {
      return this.playersManager_.getCurrentPlayer();
    }
  }

  /**
   * Walks through all Board columns looking for a matched one. 
   * @returns {boolean} Returns true if any column has been fulfilled by a player, 
   * otherwise, false.
   * @private
   **/
  visitColumns_() {
    for (let i = 0; i < 3; i++) {
      if (this.checkColumn_(i)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Checks if the diagonal line starting from the top-left slot has been 
   * fulfilled by the current player.
   * @returns {boolean} Returns true if the diagonal line has been fulfilled by 
   * a player, otherwise, false.
   * @private
   **/
  visitDiagonalUpLeft_() {
    for (let i = 0; i < 9; i += 4) {
      if (this.checkUnMatch_(i)) {
        return false;
      }
    }
    return true;
  }
  
  /**
   * Checks if the diagonal line starting from the top-right slot has been 
   * fulfilled by the current player.
   * @returns {boolean} Returns true if the diagonal line has been fulfilled by 
   * a player, otherwise, false.
   * @private
   **/
  visitDiagonalUpRight_() {
    for (let i = 2; i < 7; i += 2) {
      if (this.checkUnMatch_(i)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Walks through all Board lines looking for a matched one. 
   * @returns {boolean} Returns true if any column has been fulfilled by a player, 
   * otherwise, false.
   * @private
   **/
  visitLines_(callBack) {
    for (let i = 0; i < 9; i += 3) {
      if (this.checkLine_(i)) {
        return true;
      }
    }
    return false;
  }
}

export default TicTacToe;