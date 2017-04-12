// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var request = require("request");
var cheerio = require("cheerio");
var logger = require("morgan");
var mongoose = require('mongoose');
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;
/*mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("We are connected!")
});*/

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing and logger
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));//VS false??
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(process.cwd() + "/public"));

// Setting handlebars
// ---------------------
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Setup Mongoose
// ---------------
mongoose.connect("mongodb://localhost/diyscraper");
// Save our mongoose connection to db
var db = mongoose.connection;

// If there's a mongoose error, log it to console
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once we "open" a connection to mongoose, tell the console we're in
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// ROUTES
// ---------------

// Route for root
app.get("/", function(req, res){
	res.render("index", {});
});

// Route for scrape
app.get("/scrape", function(req, res){
	var obArr = [];
	request("http://www.diyncrafts.com/?s=woodworking", function(error, response, html){
		var $ = cheerio.load(html);
		console.log($('article').length);
		$("article").each(function(i, element){

			var title = $(this).children('.entry-header').find("h2 a").text();
			var imgLink = $(this).children('.entry-content').find('img').attr('src');
			var body = $(this).children('.entry-content').find('p').text();
			var articleLink = $(this).children('.entry-content').find('a.moretag').attr('href');
			console.log(imgLink);
			console.log(title);
			console.log(body);
			console.log(articleLink);
			console.log("-------------------\n")
			/*var link = $(this).children("a").attr("href");
			console.log(" Title | " + title +" imglink | "+ imglink + " body | " + body + " articleLink | " + articleLink);*/

		/*	if(title && articleLink){
				var newArticle = {
				"title": title,
				"imgLink": imgLink,
				"body": body,
				"articleLink": articleLink
				}
				obArr.push(newArticle);

			}	*/	
			if(title && imgLink){
				var newArticle = {
				"title": title,
				"imgLink": imgLink
				}
				obArr.push(newArticle);

			}			


		});

		res.render("index", {Article: obArr});
	
	});
	
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });

