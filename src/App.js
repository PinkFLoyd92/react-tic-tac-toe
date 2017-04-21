import React, { Component } from 'react';
import Board from './board/Board';
import TicTacToe from './ticTacToe/TicTacToe';
import Storage from './storage/Storage';
import './App.css';

/**
 * Initialize the game asking for players information. Manage players
 * turns and set in the board fulfilled slots.
 * @author Fernando Souza nandosouzafilho@gmail.com
 **/
class App extends Component {
  constructor(prop) {
    super(prop);
    
    this.state = {
      fulfileedSlots: []
    }

    let { firstPlayer, secondPlayer } = this.props.match.params;
    this.game_ = new TicTacToe(firstPlayer, secondPlayer, this.onGameEnd_.bind(this));
    this.storage_ = new Storage('gameLeaderBoard');
  }

  /**
   * Callback method that will be called when the game is finished.
   * @param {Object} winner The Player object.
   * @private 
   **/
  onGameEnd_(winner) {
    if (winner) {
      this.setState({
        winner: winner.name
      });

      let gameLeaderBoard = this.storage_.getData();
      this.storage_.update([winner.name, ...gameLeaderBoard]);
    }
    this.props.history.push('/leaderboard');
  }

  /**
   * Handles the click event on the each slot, checks if it's empty and if so, 
   * fill it with the information of the current player. After that, changes 
   * the turn to the next player.
   * @param {Number} key The Board Slot index.
   * @private 
   **/
  onSlotClick_(key) {
    this.game_.fillSlot(key);
    this.setState({
      fulfileedSlots: this.game_.getBoard()
    });
  }

  /**
   * @inheritdoc
   **/
  render() {
    return <Board
      fulfilledSlots={this.state.fulfileedSlots}
      onSlotClick={this.onSlotClick_.bind(this)} />;
  }
}

export default App;
