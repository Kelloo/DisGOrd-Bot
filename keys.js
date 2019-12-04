const { config } = require('dotenv');

config({
    path: __dirname + '/.env'
  });

exports.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
};