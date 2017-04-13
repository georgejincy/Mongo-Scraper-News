var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//Create a comments schema
var ArticleSchema = new Schema ({
  title: {
    type: String
  },
  imageLink: {
    type: String
  },
  body: {
    type: String
  },
  articleLink: {
    type: String
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
	
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;