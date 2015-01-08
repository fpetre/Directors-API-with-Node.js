// BASE SETUP
// ==========================================================

// call packages
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var https      = require('https');
var concatStream     = require('concat-stream');

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
    var livestreamUrl = "https://api.new.livestream.com/accounts/" + req.body.livestream_id;
    

    https.get(livestreamUrl, function(httpsResponse){
      httpsResponse.setEncoding('utf8');
      
      // if livestream id invalid send livestream API error message
      if (httpsResponse.statusCode === 404) {
        return httpsResponse.pipe(res.status(404));
      } 
      //only create director one with same livestream id doesnt already exist
      Director.find({"livestream_id": req.body.livestream_id}, function(err, directors){
        if (err) {
          res.status(404).send(err);
        }else if (directors.length !== 0) {
          return res.status(404).send({message: "livestream_id is already registered"});
        } else {
          httpsResponse.pipe(concatStream(function(data){
            var directorInfo = JSON.parse(data);
            var director = new Director();
            director.livestream_id = req.body.livestream_id;
            director.full_name = directorInfo.full_name;
            director.dob = directorInfo.dob;
            director.favorite_camera = directorInfo.favorite_camera || "";
            director.favorite_movies = directorInfo.favorite_movies || [];

            director.save(function(err) {
              if (err) {
                res.status(404).send(err);
              }
              res.json({
                livestream_id: director.livestream_id,
                full_name: director.full_name,
                dob: director.dob,
                favorite_camera: director.favorite_camera,
                favorite_movies: director.favorite_movies
              });
            });
          }));
        }
      }); 
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
