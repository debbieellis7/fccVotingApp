const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Create Schema
const PollSchema = new Schema({
  pollid:{
    type: String,
    required: true
  },
  title:{
    type: String,
    required: true
  },
  options:{
    type: Array,
    required: true
  },
  user:{
    type: String,
    required: true
  },
  date:{
    type: Date,
    default: Date.now
  }
});



const Poll = module.exports = mongoose.model('polls', PollSchema);


// Get Polls
module.exports.getPolls = function(callback, limit){
  Poll.find(callback).limit(limit);
}