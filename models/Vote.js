const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VoteSchema = new Schema({
  voteid:{
    type: String,
    required: true
  },
  votename:{
    type: String,
    required: true
  },
  points:{
    type: Array,
    required: true
  }
});


// Create collection and add schema
const Vote = module.exports = mongoose.model('vote', VoteSchema);



// Get Votes
module.exports.getVotes = function(callback, limit){
  Vote.find(callback).limit(limit);
}

// Get Vote Name
// module.exports.getVotename = function(votename, fields, options, callback){
//   var query = {votename: votename};
//   Vote.find(query, fields, options, callback);
// }

// Get Vote by VoteID
module.exports.getVoteById = function(voteid, fields, options, callback){
  var query = {voteid: voteid};
  Vote.find(query, fields, options, callback);
}


// Update Vote
module.exports.updateVote = function(id, vote, options, callback){
  var query = {votename: id};
  var update = {
    voteid: vote.pollIDdsda,
    votename: vote.votename, 
    $push:{
      points: 1
    }
  };
  Vote.findOneAndUpdate(query, update, options, callback);
}