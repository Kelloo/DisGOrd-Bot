const { Client } = require('discord.js');
const { config } = require('dotenv');
var SpotifyWebApi = require('spotify-web-api-node');
const bot = new Client();
 const ytdl = require('ytdl-core');
const Spotify = require('node-spotify-api');
const keys = require('./keys.js')

 var servers = {};//to save all songs in the queue

config({
  path: __dirname + '/.env'
});

 var spotifyApi = new SpotifyWebApi({
  clientId: 'e2c29922d0774173bdd62298f476d65a',
  clientSecret: '25b915a5b23748c2920930a2cb058027',
  redirectUri: 'http://www.example.com/callback'
});

var spotify = new Spotify(keys.spotify);

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
  const prefix = "!";

  if(message.author.bot) return;
  if(!message.guild) return;
  if(!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  let searchTerm= args.toString().replace(","," ");

  console.log(args);
  if(cmd == "hello"){
    const msg = await message.channel.send(`ahlan ya ${message.author.username}`);
  }
  if(cmd == "plays"){

    function play(connection,message){//function to play song
      var server = servers[message.guild.id];
      server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter:"audioonly"}));
      server.queue.shift();
      server.dispatcher.on("end",function(){
        if(server.queue[0]){
          play(connection,message);
        }else{
          connection.disconnect();
        }
      })

    }

    if(!message.member.voiceChannel){
      const msg = await message.channel.send("You must be in a voice channel!!");
      return;
    }
    if(!servers[message.guild.id]){
      servers[message.guild.id] = {queue:[]};
    }
    var server = servers[message.guild.id];
    server.queue.push("https://www.youtube.com/watch?v=sZgFubTaqWI");
    if(!message.guild.voiceConnection){//to make bot join the voice channel
      message.member.voiceChannel.join().then(function(connection){
        play(connection,message);
      })
    }
  }
  if(cmd == "stop"){
    var server = servers[message.guild.id];
    if(message.guild.voiceConnection){
      for(var i = server.queue.length-1;i>=0;i--){
        server.queue.splice(i,1);
      }
      server.dispatcher.end();
    }
    if(message.guild.connection) message.guild.voiceConnection.disconnect();
  }
  if(cmd == "skip"){
    var server = servers[message.guild.id];
    if(server.dispatcher) server.dispatcher.end();
  }

  if(cmd == "play"){
   
    spotify.search({type: 'track', query:searchTerm, limit: '3'})
    .then(function(res){
    
      res.tracks.items.forEach(async function(element){
        const separator = await message.channel.send(".......");
        const artistName = await message.channel.send(`Artist: ${element.album.artists[0].name}`);
        const songName = await message.channel.send(`Song Name: ${element.name}`);
        const previewLink = await message.channel.send(`Spotify Preview: ${element.preview_url}`);
        const albumName = await message.channel.send(`Album: ${element.album.name}`);
      });
    })
    .catch(function(err){
      console.log(err);
    })
  }
});

bot.login(process.env.TOKEN);
