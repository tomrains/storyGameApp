const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Story = require('./story.model').schema;

let Player = new Schema({
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    number: {
      type: Number,
      default: -1
    },
    story: []
});

//I believe first string is what it's called in MongoDB, second is in here
module.exports = mongoose.model('Player', Player);
