// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var helpers = require('handlebars-helpers');
var math = helpers.math();
var request = require("request");
var cheerio = require("cheerio");
var logger = require("morgan");
var mongoose = require('mongoose');
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


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
			console.log(i);
			var id = i;
			console.log(" Title | " + title +" imglink | "+ imgLink + " body | " + body + " articleLink | " + articleLink);
			console.log("-------------------\n")

		if(title && imgLink){
				var newArticle = {
				"title": title,
				"imgLink": imgLink,
				"body": body,
				"articleLink": articleLink,
				"id": id
				}
				obArr.push(newArticle);
			}		

		});

		res.render("index", {Article: obArr});
	
	});
	
});

// api route to save an article
app.post('/api/savearticle', function(req, res){

	var newArticle = req.body.newArticle;

	//save article to DB
	

});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });

