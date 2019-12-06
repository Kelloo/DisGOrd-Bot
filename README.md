# DisGOrd-Bot
A bot to enhance Discord's user experience. 
___
# Introduction
DisGOrd-Bot is a discord bot whith the sole purpose of bringing the party to your discord server. Simply open this link, select the discord server, and verify: https://discordapp.com/api/oauth2/authorize?client_id=647909616268607537&permissions=0&scope=bot
___
# How it works
DisGOrd-Bot uses typed commands to function. the command prefix is an exclamation mark '!'. Simply follow the exclamation mark with any of the commands listed below and get this party started.
### Commands
* !play [SongName]: searches youtube and adds the first song that matches to queue
* !stop: stops playing the current song
* !skip: skips the current song
* !playfav: plays favourites
* !fav [SongName]: adds song to favourites
* !showfav: displays your favourites playlist
* !editfav [number of song in fav]: removes the song from favourites in this position
* !deletefav: clears your favourites playlist
* !search [songName]: gets you information about this song
___

### Dependencies
``` 
"dependencies": {
    "discord.js": "^11.5.1",  // Used to ease interaction with the discord API
    "dotenv": "^8.2.0",      // Used to allow usage of a .env file
    "ffmpeg": "0.0.4",      // Used to allow decoding and streaming of audio
    "google-auth-library": "^5.5.1", // allows the usage of a google's auth to seach youtube
    "googleapis": "^45.0.0",    //allows us to use youtube
    "mongoose": "^5.7.13",    //allows usage of mongoDB cloud
    "node-spotify-api": "^1.1.1", //get info from spotify
    "opusscript": "0.0.7",   //optimizes encoding for audio, used by ytdl
    "youtube-search-promise": "^1.0.3", //eases interaction with youtube API
    "ytdl-core": "^1.0.3"       // youtube downloader
  }
  ```
