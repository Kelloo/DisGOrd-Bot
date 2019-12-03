const mongoose = require('mongoose');
const Playlist = require('./Playlist');

const ServerSchema = mongoose.Schema({
  serverID: {
    type: String,
    require: true
  },

  playlists: {
    type: Array,
    items: {
      type: Playlist
    }
  }
});

module.exports = mongoose.model('Server', ServerSchema);
