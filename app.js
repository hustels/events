var express = require('express'); //Express
var app = express(); // Define app
app.set('view engine' , 'ejs');// Set templates engine
app.set('views', './templates'); // Set default templates directory
app.get('/', function(req, res){
	res.render('default');
})
app.listen(3000);
console.log('Listening on port 3000');