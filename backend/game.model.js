const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Player = require('./player.model').schema;

let Game = new Schema({
    host: {
        type: String,
        default: "Host"
    },
    storiesSubmitted: {
      type: Number,
      default: 0
    },
    storiesReturned: {
      type: Number,
      default: 0
    },
    code: {
        type: String
    },
    rounds: {
      type: Number,
      default: 3
    },
    currentRound: {
      type: Number,
      default: 1
    },
    gameStarted: {
      type: Boolean,
      default: false
    },
    game_completed: {
        type: Boolean,
        default: false
    },
    players: [Player]
});

//I believe first string is what it's called in MongoDB, second is in here
module.exports = mongoose.model('Game', Game);
