// require the modules
const restify = require('restify');
const server = restify.createServer();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// setup restify
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

// setup the mysql configuration
const sql = new Sequelize('messages', 'root', '!Mysql99', {
	host: 'localhost',
	port: 3306,
	dialect: 'mysql',
	operatorsAliases: false,
	pool: {
		max: 5,
		min: 0,
		acuire: 30000,
		idle: 10000
	}
});

// make the connection
sql
	.authenticate()
	.then(() => {
		console.log("The connection was successful!");
	})
	.catch(err => {
		console.log("There was an error when connecting!");
	});

var Message = sql.define('message', {
	id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
	subject: { type: Sequelize.STRING },
	description: { type: Sequelize.STRING }
});

sql.sync();

function getMessages(req, res, next) {
	// Restify currently has a bug which doesn't allow you to set default headers
	// These headers comply with CORS and allow us to serve our response to any origin
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

	Message.findAll().then((messages) => {
		res.send(messages);
	});
}

function postMessage(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

	console.log(req.body);

	Message.create({
		subject: req.body.subject,
		description: req.body.description
	}).then((message) => {
		res.send(message);
	});
}

// Set up our routes and start the server
server.get('/messages', getMessages);
server.post('/messages', postMessage);

server.listen(8080, function() {
	console.log('%s listening at %s', server.name, server.url);
});