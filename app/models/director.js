

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DirectorSchema = new Schema({
  livestream_id: {type: String, required: true},
  full_name: { type: String, required: true },
  dob: { type: Date, required: true },
  favorite_camera: String,
  favorite_movies: { type: String, required: true }
});

module.exports = mongoose.model('Director', DirectorSchema);
