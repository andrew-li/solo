CREATE DATABASE twitch_stats;

USE twitch_stats;

CREATE TABLE crawl (
  crawl_id int(10) NOT NULL auto_increment,
  datetime_utc DATETIME,

  PRIMARY KEY (crawl_id)
);

CREATE TABLE crawl_streamer (
  crawl_id int(10),
  streamer_name VARCHAR(25),
  game_name VARCHAR(50),
  viewer_count int(15),

  FOREIGN KEY (crawl_id) REFERENCES crawl(crawl_id),
  PRIMARY KEY (crawl_id, streamer_name, game_name)
);

CREATE TABLE streamer_stats (
  stats_id int(10) NOT NULL auto_increment,
  streamer_name VARCHAR(25),
  game_name VARCHAR(50),
  avg_viewer_count int(15),
  datetime_utc DATETIME,  

  PRIMARY KEY (stats_id)
);
