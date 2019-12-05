const express = require('express');

const mongoose = require('mongoose');
const { Client } = require('discord.js');
const { config } = require('dotenv');
const ytdl = require('ytdl-core');
const Spotify = require('node-spotify-api');
const keys = require('./keys.js');
const search = require('youtube-search-promise');
const Server = require('./models/Server');
const Favourite = require('./models/Favourite');
const FavID = 0;

const bot = new Client();
const app = express();
var servers = []; //to save all songs in the queue
var SpotifyWebApi = require('spotify-web-api-node');

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () =>
  console.log('Connected to DB')
);
config({
  path: __dirname + '/.env'
});

const spotify = new Spotify(keys.spotify);

bot.on('ready', () => {
  console.log(`I'm Online and my name is ${bot.user.username}`);

  bot.user.setPresence({
    status: 'online',
    game: {
      name: 'Getting Developed',
      type: 'WATCHING'
    }
  });
});

bot.on('message', async (message) => {
  const prefix = '!';

  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const cmd = args.shift().toLowerCase();

  let searchTerm = args.toString().replace(',', ' ');

  console.log(args);
  if (cmd == 'hello') {
    const msg = await message.channel.send(
      `ahlan ya ${message.author.username}`
    );
  }
  if (cmd == 'play') {
    function play(connection, message) {
      //function to play song
      var server = servers[message.guild.id];
      server.dispatcher = connection.playStream(
        ytdl(server.queue[0], { filter: 'audioonly' })
      );
      server.queue.shift();
      server.dispatcher.on('end', function() {
        if (server.queue[0]) {
          play(connection, message);
        } else {
          connection.disconnect();
        }
      });
    }

    if (!message.member.voiceChannel) {
      const msg = await message.channel.send(
        'You must be in a voice channel!!'
      );
      return;
    }
    if (!servers[message.guild.id]) {
      servers[message.guild.id] = { queue: [] };
    }

    var opts = {
      maxResults: 1,
      key: process.env.KEY
    };
    search(searchTerm, opts)
      .then((results) => {
        let song = results[0].link;
        var server = servers[message.guild.id];
        server.queue.push(song);

        if (!message.guild.voiceConnection) {
          //to make bot join the voice channel
          message.member.voiceChannel.join().then(function(connection) {
            play(connection, message);
          });
        }
        console.log(results);
      })
      .catch((error) => {
        message.channel.send('Cannot find this song try another one');
      });
  }
  if (cmd == 'stop') {
    let server = servers[message.guild.id];
    if (message.guild.voiceConnection) {
      for (let i = server.queue.length - 1; i >= 0; i--) {
        server.queue.splice(i, 1);
      }
      server.dispatcher.end();
    }
    if (message.guild.connection) message.guild.voiceConnection.disconnect();
  }
  if (cmd == 'skip') {
    let server = servers[message.guild.id];
    if (server.dispatcher) server.dispatcher.end();
  }

  if (cmd == 'search') {
    spotify
      .search({ type: 'track', query: searchTerm, limit: '3' })
      .then(function(res) {
        res.tracks.items.forEach(async function(element) {
          await message.channel.send(
            `${element.name}, ${element.album.name}\n by: ${element.album.artists[0].name} \n ====================`
          );
        });
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  if (cmd == 'editfav') {
    if (Favourite.findOne(message.guild.id)) {
      const andrew = await Favourite.findById(message.guild.id);
      let SongTemp = andrew.songs;
      for (var i = 0; i < SongTemp.length; i++) {
        if (i === parseInt(searchTerm)) {
          SongTemp.splice(i, 1);
        }
      }
      Favourite.findByIdAndUpdate(
        message.guild.id,
        { songs: SongTemp },
        { new: true },
        (err, model) => {
          if (!err) {
          } else {
            return response.json({
              error: `Error, couldn't update a user given the following data`
            });
          }
        }
      );
    } else {
      message.channel.send('You dont have a fav');
    }
  }

  if (cmd == 'deletefav') {
    if (Favourite.findOne(message.guild.id)) {
      Favourite.findByIdAndUpdate(
        message.guild.id,
        { songs: null },
        { new: true },
        (err, model) => {
          if (!err) {
          } else {
            return response.json({
              error: `Error, couldn't update a user given the following data`
            });
          }
        }
      );
    } else {
      message.channel.send('You dont have a fav');
    }
  }

  if (cmd == 'fav') {
    function play(connection, message) {
      //function to play song
      var server = servers[message.guild.id];
      server.dispatcher = connection.playStream(
        ytdl(server.queue[0], { filter: 'audioonly' })
      );
      server.queue.shift();
      server.dispatcher.on('end', function() {
        if (server.queue[0]) {
          play(connection, message);
        } else {
          connection.disconnect();
        }
      });
    }
  }
  if (!servers[message.guild.id]) {
    servers[message.guild.id] = { queue: [] };
  }

  var opts = {
    maxResults: 1,
    key: process.env.KEY
  };
  search(searchTerm, opts)
    .then(async (results) => {
      let song = results[0].link;
      const serverExists = await Favourite.findById(message.guild.id);
      console.log(serverExists);
      if (serverExists) {
        const andrew = await Favourite.findById(message.guild.id);
        const SongTemp = andrew.songs;
        SongTemp.push({ url: results[0].link, name: results[0].title });
        Favourite.findByIdAndUpdate(
          message.guild.id,
          { songs: SongTemp },
          { new: true },
          (err, model) => {
            if (!err) {
            } else {
              return response.json({
                error: `Error, couldn't update a user given the following data`
              });
            }
          }
        );
      } else {
        Favourite.create({
          _id: message.guild.id,
          songs: [{ url: song, name: results[0].title }]
        });
      }

      if (!message.guild.voiceConnection) {
        //to make bot join the voice channel
        message.member.voiceChannel.join().then(function(connection) {
          play(connection, message);
        });
      }
    })
    .catch((error) => {
      message.channel.send('Cannot find this song try another one' + error);
    });
});

bot.login(process.env.TOKEN);
