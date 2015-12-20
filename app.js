var express = require('express'); //Express
var bodyParser = require('body-parser');
var app = express(); // Define app
var mysql = require('mysql'); // Mysql
app.set('view engine' , 'ejs');// Set templates engine
app.set('views', './templates'); // Set default templates directory
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Allows to access req.body
// Create the mysql connection
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root'
});
// Connect
connection.connect();
// Use DB
connection.query('USE events');
app.get('/', function(req, res){
	res.render('default');
});

app.post('/events/add', function(req, res, next){
		connection.query ("insert into events(title, description) values('"+req.body.title+"', '"+req.body.description+"')", function(err, rows, fiels){
		if (err) throw err;
	});
	res.send('Inserted');
	next();
});
app.listen(3000);
console.log('Listening on port 3000');