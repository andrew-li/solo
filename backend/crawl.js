//crawl twitch tv to get the viewer count for top 50 current streamers of all games, top 50 current streamers for 5 different hard coded games, and top 50 current games
//updates crawl and crawl_streamer tables

var mysql = require('mysql');
var getTopStreamers = require('./getTopStreamers.js');
var getTopGames = require('./getTopGames.js');

//function to get current datetime in UTC and mySql format from: http://stackoverflow.com/questions/5129624/convert-js-date-time-to-mysql-datetime
var getDate = function() {
  var date = new Date();
  date = date.getUTCFullYear() + '-' +
    ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
    ('00' + date.getUTCDate()).slice(-2) + ' ' + 
    ('00' + date.getUTCHours()).slice(-2) + ':' + 
    ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
    ('00' + date.getUTCSeconds()).slice(-2);

  return date;
};

var dbConnection = mysql.createConnection({
  user: "root",
  password: "",
  database: "twitch_stats"
});

var crawl = function() {

  //create a new record in the crawl table
  var query = "insert into crawl (datetime_utc) values ('" + getDate() + "');";
  dbConnection.query(query, function(err, result) {
    if (err) throw err;

    var crawl_id = result.insertId; //the last auto incremented key in the crawl table

    var callbacks_completed = 0; //(request) callback completed counter to know when to close db connection
    var MAX_CALLBACKS = 6; //the total number of callbacks that should be completed before ending the db connection

    //get the viewer count for top 50 current streamers of all games
    getTopStreamers(function(error, response, body) {

      if (!error && response.statusCode === 200)
      {
        body = JSON.parse(body);
        var streams = body.streams;

        //insert viewer count for each streamer into crawl_streamer table
        streams.forEach(function(stream, index) {

          query = "insert into crawl_streamer (crawl_id, streamer_name, game_name, viewer_count) values (" 
            + crawl_id + ", '"
            + stream.channel.display_name 
            + "', '', " //blank to categorize all games
            + stream.viewers + ");";

          dbConnection.query(query, function(err) {
            if (err) throw err;

            //when all records have been inserted, indicate that the callback has been completed
            if(index === streams.length - 1)
            {
              ++callbacks_completed; 

              console.log("Request callback " + callbacks_completed + " completed.");

              if(callbacks_completed === MAX_CALLBACKS)
                dbConnection.end();
            }
          });

        });
      }
      else
      {
        throw error; //will just throw null if no error and status !== 200
      }

    }, "limit=50");

    //get the viewer count for top 50 current streamers for 5 different hard coded games
    getTopStreamers(function(error, response, body) {
   
      if (!error && response.statusCode === 200)
      {
        body = JSON.parse(body);  
        var streams = body.streams;

        //insert viewer count for each streamer into crawl_streamer table
        streams.forEach(function(stream, index) {

          query = "insert into crawl_streamer (crawl_id, streamer_name, game_name, viewer_count) values (" 
            + crawl_id + ", '"
            + stream.channel.display_name + "', '"
            + stream.game + "', "
            + stream.viewers + ");";

          dbConnection.query(query, function(err) {
            if (err) throw err;

            //when all records have been inserted, indicate that the callback has been completed
            if(index === streams.length - 1)
            {
              ++callbacks_completed; 

              console.log("Request callback " + callbacks_completed + " completed.");    

              if(callbacks_completed === MAX_CALLBACKS)
                dbConnection.end();
            }
          });   

        });
      }
      else
      {
        throw error; //will just throw null if no error and status !== 200
      }

    }, ["game=League%20of%20Legends&limit=50", "game=Counter-Strike%3A%20Global%20Offensive&limit=50", "game=Dota%202&limit=50", "game=Hearthstone:%20Heroes%20of%20Warcraft&limit=50", "game=StarCraft%20II:%20Heart%20of%20the%20Swarm&limit=50"]);

    //get the viewer count for top 50 current games
    // getTopGames(function(error, response, body) {
    //   if (!error && response.statusCode === 200)
    //   {
    //     body = JSON.parse(body);  
    //     console.log(body);
    //   }
    // });

  });

};

crawl();