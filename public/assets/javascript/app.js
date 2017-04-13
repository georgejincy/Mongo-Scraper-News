$(document).ready(function() {

	function saveArticle(newArticle){

		$.post("/api/savearticle", newArticle, function() {
      		window.location.href = "/saved";
    	});

	}

	$('.save').on("click", function(event){

		event.preventDefault();
		var id = $(this).data('id');
		console.log(id);
		var newArticle = {
			title: $("#title" + id).text().trim(),
			image:  $("#image" + id).attr('src').trim(),
			body: $("#body" + id).text().trim(),
			link:  $("#link" + id).attr('href').trim()
		};

		/*console.log(newArticle.title +" |" + newArticle.image + " |" newArticle.body + " |" + newArticle.link);*/
		console.log(newArticle);

		//Save article to database and redirect user to saved page
		saveArticle(newArticle);

		console.log("Button clicked");



	});
});