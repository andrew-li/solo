#solo
This is a project I completed as a student at [hackreactor](http://hackreactor.com). This project was done solo as part of a sprint to create a Minimum Viable Product (MVP).

For my MVP, I created a web app to display the top 50 streamers on Twitch.tv based on average viewer in the last hour.
In order to get the top streamers in the past hour, a script calls the Twitch.tv APIs to get the top streamers at the moment it is run. The script is then put on a scheduler (ie. cron) to run at a set interval. Then another script calculates the average viewer count in the last hour based on the retrieved data.

A Single-Page Application (SPA) built using AngularJS is used to display the data on the front-end. A web server built using Express is used to serve up the SPA and help retrieve the stored data.
