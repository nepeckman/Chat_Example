$('li').click(function(){
	console.log("debug log");
	var index = $('this').text().indexOf(":");
	location.href = "http://localhost:3000/chat/" + $('this').text().substring(0, index);
});