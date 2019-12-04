const mongoose = require('mongoose');
const Song = require('./Song');

const PlaylistSchema = mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  songs: {
    type: Array,
    url: {
      type: String,
      require: true
    }
  }
});

module.exports = mongoose.model('Playlist', PlaylistSchema);
