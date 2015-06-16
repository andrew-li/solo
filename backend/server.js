var express = require('express');
var path = require('path');
var mysql = require('mysql');
var app = express();

var connection = mysql.createConnection({
  user: "root",
  password: "",
  database: "twitch_stats"
});

//listen on selected port
app.set('port', 3000);

//serve the client files
app.use(express.static(__dirname + "/../frontend"));

//the following get request route should cause the server to perform a query and return the response
var query_route = '/get/streamer_stats';
app.get(query_route + '*', function(req, res){

  //perform query based on passed in game name 
  //need to decode url and use substr to get the game name from the path
  var gameName = decodeURIComponent(req.path.substr(query_route.length + 1));
  var query = "select streamer_name, avg_viewer_count, max(datetime_utc) as datetime_utc"
    + " from streamer_stats"
    + " where game_name = '"
    + gameName + "'"
    + " group by streamer_name"
    + " LIMIT 20";

  //perform the query and send the response containing the results embedded in an object
  connection.query(query, function(err, result){
    if(err) throw err;

    res.send({streamers: result});
  });
});

app.listen(app.get('port'));
console.log('Express server listening on port ' + app.get('port'));


