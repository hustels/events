var express = require('express'); //Express
var bodyParser = require('body-parser');
var app = express(); // Define app
var mysql = require('mysql'); // Mysql
app.set('view engine' , 'ejs');// Set templates engine
app.set('views', './templates'); // Set default templates directory
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
var sessions= require('client-sessions');
var csrf = require('csurf');
var bcrypt = require('bcryptjs');
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
	res.render('login');
});


// Use session
app.use(sessions({
	cookieName: 'session',
	secret: 'blargadeeblargblargfryryyryvdgd',
	duration: 24 * 60 * 60 * 1000,
	activeDuration: 1000 * 60 * 5 
}));
// Create custom middleware
app.use(function(req, res ,next){
	if(req.session && req.session.user){
		connection.query ("select username  from users where username='" +req.session.user.username+"'", function(err, user){
		if(user.length >0){
				req.user = user;
				delete req.user.password; // Por seguridad para dejar la password en la sesion aunque este cifrado
				req.session.user = req.user;
				res.locals.user = req.user;
		}
		next();
	});
	
	}else{
		next();
	}
});
// Create Custom MiddleWare
function requireLogin (req, res , next){
	console.log(req.session.user);
	if(!req.session.user ){
		console.log('We dont a have in require login');
		res.redirect('/login');
	}else{

		next();
	}
}
app.get('/events' , requireLogin,  function(req, res){
	connection.query ('SELECT * FROM events order by createdAt desc', function(err, rows, fiels){
		if (err) throw err;
		res.json(rows);
		//res.send(rows);
	});

	
});
// Redirect home
app.get('/home' , requireLogin,  function(req, res){

	res.render('default');
	
});
app.post('/events/add', function(req, res, next){
		connection.query ("insert into events(title, description) values('"+req.body.title+"', '"+req.body.description+"')", function(err, rows, fiels){
		if (err) throw err;
	});

	res.send({message: 'Evento creado '});
	//res.redirect(301, 'http://localhost:3000' + message);
	next();
});
app.post('/events/delete', function(req, res, next){
		connection.query ("delete from events where id='" +req.body.id +"'", function(err, rows, fiels){
		if (err) throw err;
	});
	// var message = 'Evento borrado';
	// res.send({message: 'Evento creado '});
	res.send({message: 'Evento borrado '});
	//res.redirect(301, 'http://localhost:3000' + message);
	next();
});


// Login routes
app.get('/login', function(req, res){
	res.render('login');
});
app.post('/login', function(req, res){
		connection.query ("select *  from users where username='" +req.body.username+"'", function(err, user){
		if(user.length >0){

			if(bcrypt.compareSync(req.body.password,user[0].password)){
			// Store session info if the user login is valid
			req.session.user = user;
			res.redirect('/home');
			}
			else{
				res.render('login' , {login_error: 'Invalid creadentials'});
			}
		}else{
			res.redirect('/login');

		}
		if (err) throw err;
	});
});

// Logoout route
app.get('/logout', function(req, res){
	req.session.reset();
	res.redirect('/');
});
// Register routes
app.get('/register', function(req, res){
	res.render('register');
});
app.post('/register', function(req, res , next){
	var hash = bcrypt.hashSync(req.body.password , bcrypt.genSaltSync(10));
	connection.query ("insert into users(username, firstname , lastname , email, password) values('"+req.body.username+"','"+req.body.firstname+"','"+req.body.lastname+"','"+req.body.email+"','"+hash+"')", 
		function(err, rows, fiels){
		if (err) throw err;
		
	});
	res.redirect('/events');
	next();
});

app.listen(3000);
console.log('Listening on port 3000');