$(document).ready(function() {

	function saveArticle(newArticle){

		$.post("/api/savearticle", newArticle, function() {
      		window.location.href = "/saved";
    	});

	}

	function saveNote(newNote){

		$.post("/api/savenote", newNote, function() {
			console.log(newNote);
      		window.location.href = "/savedNotes/" + newNote.articleId;
    	});

	}

			
	$('.save-article').on("click", function(event){

		event.preventDefault();
		var id = $(this).data('id');
		console.log(id);
		var newArticle = {
			title: $("#title" + id).text().trim(),
			imageLink:  $("#image" + id).attr('src').trim(),
			body: $("#body" + id).text().trim(),
			articleLink:  $("#link" + id).attr('href').trim()
		};

		/*console.log(newArticle.title +" |" + newArticle.image + " |" newArticle.body + " |" + newArticle.link);*/
		console.log(newArticle);

		//Save article to database and redirect user to saved page
		saveArticle(newArticle);

		console.log("Button clicked");

	});

	$('.save-comment').on("click", function(event){

		event.preventDefault();
		var id = $(this).data('id');
		console.log(id);
		var newComment = {
			comment: $("#comment" + id).val().trim()
		};

		/*console.log(newArticle.title +" |" + newArticle.image + " |" newArticle.body + " |" + newArticle.link);*/
		console.log(newComment);

		var noteObj = {
			newComment: newComment,
			articleId: id
		};

		//Save article to database and redirect user to saved page
		saveNote(noteObj);

		console.log("Button clicked");

	});

	$('.delete-article').on('click', function(event) {
		
		var id = $(this).data('id');
		$.ajax({
			method: "DELETE",
			url: "/api/deletearticle/" + id
		})
		.done(function(){
			window.location.href = "/saved";
		});


	});

	$('.delete-comment').on('click', function(event) {
		
		var id = $(this).data('id');
		$.ajax({
			method: "DELETE",
			url: "/api/deletecomment/" + id
		})
		.done(function(){
			//window.location.href = "/saved";
		});


	});

/*	$('.notes').on("click", function(){

		var thisId = $(this).attr("data-id");

		$.ajax({
			method: "GET",
			url: "/savedNotes/" + thisId
		})
		.done(function(data) {

			if(data){
				console.log(data); 
			}else{
				$('.savedNotes').text("No saved Notes");
			}

		});

	});*/

});