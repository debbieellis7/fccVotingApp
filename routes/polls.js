const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');


// Load Model
Poll = require('../models/Poll');

// --------------------------------------------- Polls Routes --------------------------------------- //


// Poll Index Page
router.get('/', ensureAuthenticated, (req, res) => {
  Poll.find({user: req.user.id})
    .sort({date:'desc'})
    .then(polls => {
      res.render('polls/index.handlebars', {
        polls:polls
      });
    });
});


// Add Poll Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('polls/add.handlebars');
});


// Process Add Form
router.post('/add', ensureAuthenticated, (req, res) => {
  let errors = [];

  var ID = function(){
    return '_' + Math.random().toString(36).substr(2, 9);
  };
  var privateID = ID();

  if(!req.body.title){
    errors.push({text:'Title is requried'});
  }

  if(!req.body.option1 || !req.body.option2){
    errors.push({text:'All options field is required'});
  }

  if(errors.length > 0){
    res.render('polls/add.handlebars', {
      errors: errors,
    });
  } else{
    if(req.body.option == null){
      const newUser = {
        pollid: privateID,
        title: req.body.title,
        options: [req.body.option1,req.body.option2],
        user: req.user.id
      }
      new Poll(newUser)
      .save()
      .then(poll => {
        req.flash('success_msg', 'Poll is added');
        res.redirect('/polls');
      })
    } else{
      const newUser = {
        pollid: privateID,
        title: req.body.title,
        options: [req.body.option1,req.body.option2,req.body.option],
        user: req.user.id
      }
      new Poll(newUser)
      .save()
      .then((poll) => {
        res.redirect('/polls');
      })
    }
  }
});



// Delete Poll
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Poll.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Poll is removed');
      res.redirect('/');
    });
});





// Vote ID Route
router.get('/:id', ensureAuthenticated, (req, res) => {
  Poll.findOne({
    _id: req.params.id
  })
  .then(poll => {
    if(poll.user != req.user.id){
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/polls');
    } else{
      res.render('polls/id.handlebars', { 
        poll:poll
      });
    } 
  });
});







// Process Vote Form
router.post('/voted', (req, res) => {
  Vote.find({votename: req.body.votename}, (err, vote) => {
      if(!vote.length){
        const newVote = {
          voteid: req.body.pollIDdsda,
          votename: req.body.votename,
          points: 1
        }
        new Vote(newVote)
        .save()
        .then(vote => {
          res.redirect('back');
        });
      } else{
        var id = req.body.votename;
        var vote = req.body;
        Vote.updateVote(id, vote, {}, (err, vote) => {
          if(err) throw err;
          res.redirect('back');
        })
      }
  });
});



router.put('/voted/:id', (req, res) => {
  Poll.findOne({
    _id: req.params.id
  })
    .then(poll => {
      // new values
      poll.options.push(req.body.newvotename);
      poll.save();
      Vote.find({votename: req.body.votename}, (err, vote) => {
        const newVote = {
          voteid: req.body.pollIDdsda,
          votename: req.body.newvotename,
          points: 1
        }
        new Vote(newVote)
        .save()
        .then(vote => {
          res.redirect('back');
        });
      });
    })
    
});


// router.put('/voted/:id', (req, res) => {
//   Poll.findOne({
//     _id: req.params.id
//   })
//     .then(poll => {
//       // new values
//       poll.options.push(req.body.newvotename);
//       poll.save()
//         .then(poll => {
//           res.redirect('back');
//         });
//     });
// });









// ------------------------------------------ End Polls Routes --------------------------------------- //



module.exports = router;