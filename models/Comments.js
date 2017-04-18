var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//Create a comments schema
var CommentSchema = new Schema ({
  comment: {
    type: String
  }
	
});

// Create the Comment model with the CommentSchema
var Comment = mongoose.model("Comment", CommentSchema);

// Export the Comment model
module.exports = Comment;