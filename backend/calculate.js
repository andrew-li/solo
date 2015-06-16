//query data and calculate streamer stats that will be queried by the site
//updates streamer_stats table

var mysql = require('mysql');

var dbConnection = mysql.createConnection({
  user: "root",
  password: "",
  database: "twitch_stats"
});

//function to get current datetime in UTC and mySql format from: http://stackoverflow.com/questions/5129624/convert-js-date-time-to-mysql-datetime
//can pass in number of hours to decrement the returned date by
var getDate = function(decrementByHours) {
  var date = new Date();
  date.setHours(date.getHours() - decrementByHours);
  date = date.getUTCFullYear() + '-' +
    ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
    ('00' + date.getUTCDate()).slice(-2) + ' ' + 
    ('00' + date.getUTCHours()).slice(-2) + ':' + 
    ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
    ('00' + date.getUTCSeconds()).slice(-2);

  return date;
};

var calculate = function() {

  //query crawl and crawl_streamer table to get viewer count for each streamer
  //only grab records within the number of previous hours
  var NUM_PREVIOUS_HOURS = 1;
  var query = "select streamer_name, game_name, sum(viewer_count), count(*) from crawl "
    + "inner join crawl_streamer "
    + "on crawl.crawl_id = crawl_streamer.crawl_id "
    + "where datetime_utc >= '"
    + getDate(NUM_PREVIOUS_HOURS)
    + "' group by streamer_name, game_name";

  dbConnection.query(query, function(err, result) {
    if (err) throw err;

    //insert the avg viewer count for each streamer into streamer stats table
    var datetime = getDate(0);
    result.forEach(function(stats_record, index) {

      query = "insert into streamer_stats (streamer_name, game_name, avg_viewer_count, datetime_utc) values ('"
        + stats_record["streamer_name"] + "', '"
        + stats_record["game_name"] + "', "
        + Math.floor(stats_record["sum(viewer_count)"] / stats_record["count(*)"]) + ", '" //divide viewer count sum by record count to get avg
        + datetime + "');";

      dbConnection.query(query, function(err) {
        if (err) throw err;

        //close the database connection when the final record has been inserted
        if(index === result.length - 1)
          dbConnection.end();
      });
 
    });
  });

};

calculate();