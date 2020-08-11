const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Story = new Schema({
    lines: {
        type: Array,
        default: []
    }
  });

//I believe first string is what it's called in MongoDB, second is in here
module.exports = mongoose.model('Story', Story);
