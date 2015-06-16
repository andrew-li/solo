//get the current top 50 streamers for all games and also for 5 hard coded games

var getRequest = require('./getRequest.js');

var getTopStreamers = function(callback, gameName) {

  if(gameName === undefined || gameName === null)
  {
    getRequest("https://api.twitch.tv/kraken/streams", "", callback);
  }
  else if(Array.isArray(gameName) === true)
  {
    gameName.forEach(function(name) {
      getRequest("https://api.twitch.tv/kraken/streams", name, callback);
    });
  }
  else if(typeof(gameName) === "string")
  {
    getRequest("https://api.twitch.tv/kraken/streams", gameName, callback);
  } 

};

module.exports = getTopStreamers;