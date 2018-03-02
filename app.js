const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');


const app = express();

// Load Routes
const api = require('./routes/api');
const polls = require('./routes/polls');
const users = require('./routes/users');

// Passport Config
require('./config/passport')(passport);


// DB Config
const db = require('./config/database');

// Connect to mongoose
mongoose.connect(db.mongoURI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));


// Load Models
Poll = require('./models/Poll');
Vote = require('./models/Vote');


// Static Folder Path Middleware
app.use('/public', express.static('public'));
//app.use(express.static(path.join(__dirname, 'public')));


// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


// Body-Parser Middleware
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());


// Method override Middleware
app.use(methodOverride('_method'));


// Express Session Middleware
app.use(session({
  secret: 'secretpod',
  resave: true,
  saveUninitialized: true
}));

//  Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


// Connect-Flash Middleware
app.use(flash());


// Global Variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



// Enable CORS
app.use(cors());


// Index Route
app.get('/', (req, res) => {
  Poll.find({})
    .sort({date:'desc'})
    .then(polls => {
      res.render('index.handlebars', {
        polls:polls
      });
    });
});


// Vote ID Route
app.get('/allpolls/:id', (req, res) => {
  Poll.findOne({
    _id: req.params.id
  })
  .then(poll => {
    // if(poll.user != req.user.id){
    //   req.flash('error_msg', 'Not Authorized');
    //   res.redirect('/polls');
    // } else{
    //   res.render('polls/id.handlebars', {
    //     poll:poll
    //   });
    // }
    res.render('polls/allpollsid.handlebars', {
      poll:poll
    });
  });
});


// Process Vote Form
app.post('/voted', (req, res) => {
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




// --------------- Use routes --------------//

// Use routes
app.use('/api', api);
app.use('/polls', polls);
app.use('/users', users);

// ---------- End Use routes ---------------//


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});