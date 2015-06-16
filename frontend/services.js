angular.module('streamer', [])

.factory('Streams', function ($http) {

  var retrieveStreamers = function (gameName) {
    return $http.get('/get/streamer_stats/' + gameName);
  };

  return {
    retrieveStreamers: retrieveStreamers
  };
})

.controller('streamerControl', function ($scope, Streams) {

  //send a get request to get the top 20 streamers in the past hour
  $scope.data = {};
  $scope.getStreamers = function(gameName) {
    Streams.retrieveStreamers(gameName).success(function (data) {
      $scope.data.streamers = data.streamers;
    });
  };

  //select all games by default
  $scope.getStreamers('');

});