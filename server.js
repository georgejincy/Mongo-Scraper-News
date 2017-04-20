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
// Requiring our Article and Comment models
var Article = require("./models/Article.js");
var Comments = require("./models/Comments.js");


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
mongoose.connect("mongodb://heroku_wz3rfh94:krur096070rip01qhjn08vlfri@ds163340.mlab.com:63340/heroku_wz3rfh94");
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

// Route for home
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

		//Handlebar object variable
		var hbsObject = {
			homeTabIsActive: true,
			Article: obArr
		};

		res.render("index", hbsObject);
	
	});
	
});

// Route for getting saved articles from DB
app.get("/saved", function(req, res){

	Article.find({}, function(err, data){
		if(err){
			console.log(err);
		}
		else{

			if(data.length === 0){
				console.log("No saved articles");
			}
			console.log(data);

			var hbsObject = {
				savedTabIsActive : true,
				SavedArticle : data
			};

			res.render('saved', hbsObject);
		}
	});
	
});

// api route to save an article
app.post('/api/savearticle', function(req, res){

	console.log("save an article----------");
	console.log(req.body);
	var entry = new Article(req.body);

	Article.update(
		{"title": req.body.title},
		{$setOnInsert: entry},
		{upsert: true},
		 function (err, doc) {

			if(err){
				console.log(err);
			}


			

			});

	/*

	entry.save(function(err,doc){
		// Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
	});

	//save article to DB*/


});

// api route to save an note
app.post('/api/savenote', function(req, res){
	console.log('req.body--------------');
	console.log(req.body.newComment);

	var newComment = new Comments(req.body.newComment);

	newComment.save(function(err,doc){
		// Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
        	// Find article and push the new comment id into the Article's comment array
     		Article.findOneAndUpdate({"_id": req.body.articleId}, { $push: { "comment": doc._id } }, { new: true }, function(err, newdoc) {
	        // Send any errors to the browser
	        if (err) {
	          res.send(err);
	        }
	        // Or send the newdoc to the browser
	        else {
	          res.send(newdoc);
	     	}
      		});
    	}
	});

	//save note to DB


});

//Route for deleting Saved Articles
app.delete("/api/deletearticle/:id", function(req, res){

	Article.findByIdAndRemove(req.params.id, function(err){
		if(err) {
			res.send(err);
		}else{
			console.log("Article deleted successfully");
			//Set HTTP method to GET
    		req.method = 'GET'
			res.redirect('/saved');
		}
		
	});

});

//Route for deleting Saved Comments
app.delete("/api/deletecomment/:id", function(req, res){

	Comments.findByIdAndRemove(req.params.id, function(err){
		if(err) {
			res.send(err);
		}else{
			console.log("Comment deleted successfully");
			
		}
		
	});

});

// Route for getting saved notes for an article from DB
app.get("/savedNotes/:id", function(req, res){

	Article.findOne({"_id": req.params.id})
	.populate("comment")

	.exec(function(err, data){
		if(err){
			console.log(err);
		}
		else{
			console.log("saved notes=====")
			console.log(data);

			var hbsObject = {
				savedTabIsActive : true,
				id: req.params.id,
				/*title: data[0].title.substr(0,30).concat('....'),*/
				SavedNotes : data.comment
			};

			res.render('notes', hbsObject);
		}
	});
	
});


app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });

