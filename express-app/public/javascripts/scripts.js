$(document).ready(function() {
	$("#btnAddMessage").on("click", function() {

		var message = {
			subject: $("#txtSubject").val(),
			description: $("#txtDescription").val()
		}

		$.ajax({
				method: "POST",
				url: "http://localhost:8080/messages",
				data: message
			})
			.done(function(message) {
				console.log(message);
			});
	});

	$("#btnGetMessages").on("click", function() {
		$.ajax({
				method: "GET",
				url: "http://localhost:8080/messages"
			})
			.done(function(messages) {
				console.log(messages);
			});
	});
});