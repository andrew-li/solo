//get the current top 50 games

var getRequest = require('./getRequest.js');

var getTopGames = function(callback) {
  getRequest("https://api.twitch.tv/kraken/games/top", "", callback);
};

module.exports = getTopGames;