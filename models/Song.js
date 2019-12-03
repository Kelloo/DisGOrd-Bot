const mongoose = require('mongoose');

const SongSchema = mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  artist: String,
  album: String,
  url: {
    type: String,
    require: true
  }
});

module.exports = mongoose.model('Song', SongSchema);
