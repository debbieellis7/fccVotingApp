const express = require('express');
const router = express.Router();


// Load Models
Poll = require('../models/Poll');
Vote = require('../models/Vote');


// --------------------------------------------- API Routes --------------------------------------- //

// ------------------------- Votes Route -------------------------------

// Votes API
router.get('/votes', (req, res) => {
  Vote.getVotes((err, votes) => {
    if(err) throw err;
    res.json(votes);
  });
});

// Find Vote name by ID - API
router.get('/votes/:voteid', (req, res) => {
  Vote.getVoteById(req.params.voteid, (err, vote) =>  {
    if(err) throw err;
    res.json(vote);
  });
});


// ------------------------- Polls Route -------------------------------

// Polls API
router.get('/polls', (req, res) => {
  Poll.getPolls((err, polls) => {
    if(err) throw err;
    res.json(polls);
  })
})

// ----------------------------------------- End API Routes ---------------------------------------- //


module.exports = router;