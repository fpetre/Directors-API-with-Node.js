// BASE SETUP
// ==========================================================

// call packages
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

//configure app to use bodyParser()

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//configure mongoose to use monogDB modulus database
var mongoose   = require('mongoose');
mongoose.connect('mongodb://directorApi:directorApi@proximus.modulusmongo.net:27017/Pyzote2t')

// models
var Director   = require('./app/models/director');


var port = process.env.PORT || 3000;

// ROUTES FOR API
// ==========================================================

var router = express.Router();
router.get('/', function(req, res){
  res.json({message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// REGISTER ROUTES
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// ==========================================================

app.listen(port);
console.log('Magic happends on port ' + port);
