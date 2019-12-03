const mongoose = require('mongoose');
const Song = require('./Song');

const PlaylistSchema = mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  songs: {
    type: Array,
    items: {
      type: Song
    }
  }
});

module.exports = mongoose.model('Playlist', PlaylistSchema);
