// BASE SETUP
// ==========================================================

// call packages
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

// configure app to use bodyParser()

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// configure mongoose to use monogDB modulus database
var mongoose   = require('mongoose');
mongoose.connect('mongodb://directorApi:directorApi@proximus.modulusmongo.net:27017/Pyzote2t')

// models
var Director   = require('./app/models/director');


var port = process.env.PORT || 3000;

// ROUTES FOR API
// ==========================================================

var router = express.Router();

// midleware for all requests
router.use(function(req, res, next) {
  // log request
  console.log('Something is happening.');
  next();
});

router.get('/', function(req, res){
  res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// routes that end in /directors
// -----------------------------------------------------------
router.route('/directors')
  // create a director
  .post(function(req, res){

    var director = new Director();
    director.full_name = req.body.full_name;
    director.dob = req.body.dob;
    director.favorite_camera = req.body.favorite_camera;
    director.favorite_movies = req.body.favorite_movies;

    director.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Director created!' });
    });

  })

  // get all directors
  .get(function(req, res) {
    Director.find(function(err, directors){
      if (err) {
        res.send(err);
      }

      res.json(directors);
    });
  });

// routes that end in /directors/:director_id
// -----------------------------------------------------------
router.route('/directors/:director_id')

  // get director with that id
  .get(function(req, res){
    Director.findById(req.params.director_id, function(err, director) {
      if (err) {
        res.send(err);
      }
      res.json(director);
    });
  })
  // update the director with that id
  .put(function(req, res){
    Director.findById(req.params.director_id, function(err, director){
      if (err) {
        res.send(err);
      }
      //update info
      director.favorite_camera = req.body.favorite_camera;
      director.favorite_movies = req.body.favorite_movies;

      //save director
      director.save(function(err){
        if (err) {
          res.send(err);
        }
        res.json({ message: 'Director updated!'});
      });

    });
  })

  .delete(function(req, res){
    Director.remove({
      _id: req.params.director_id
    }, function(err, director){
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Successfully deleted' });
    });
  });

// REGISTER ROUTES
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// ==========================================================

app.listen(port);
console.log('Magic happens on port ' + port);
