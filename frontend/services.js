angular.module('streamer', ['ngSanitize'])
.factory('Streams', function ($http) {

  var retrieveStreamers = function (gameName) {
    return $http.get('/get/streamer_stats/' + gameName);
  };

  var retrieveStreamerURL = function (streamerName) {
    return $http.jsonp('https://api.twitch.tv/kraken/streams/' + streamerName + '?callback=JSON_CALLBACK');
  };  

  return {
    retrieveStreamers: retrieveStreamers,
    retrieveStreamerURL: retrieveStreamerURL
  };
})

.controller('streamerControl', function ($scope, Streams, $sce) {

  //needed for iframe to work correctly with angular
  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }

  //send a get request to get the top 20 streamers in the past hour
  $scope.data = {};
  $scope.getStreamers = function(gameName) {
    Streams.retrieveStreamers(gameName).success(function (data) {
      $scope.data.streamers = data.streamers;
    });
  };

  //get the channel url of a streamer
  $scope.getStreamerURL = function(streamerName) { 
    Streams.retrieveStreamerURL(streamerName).success(function (data) {
      if(data.stream !== null)
      {
        $scope.data.url = data.stream.channel.url + '/embed';
        console.log($scope.data.url);
      }
      else
      {
        $scope.data.url = null;
        console.log("offline");
      }
    });
  };  

  //select all games by default
  $scope.getStreamers('');

});

