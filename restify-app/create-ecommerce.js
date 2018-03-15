const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// setup the mysql configuration
const sql = new Sequelize('ecommerce', 'root', '!Mysql99', {
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

// create the models
var Product = sql.define('product', {
	id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
	name: { type: Sequelize.STRING },
	description: { type: Sequelize.STRING },
	price: { type: Sequelize.DECIMAL }
});

var User = sql.define('user', {
	id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
	firstname: { type: Sequelize.STRING },
	lastname: { type: Sequelize.STRING },
	email: { type: Sequelize.STRING }
});

var Cart = sql.define('cart', {
	id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 }
});

var CartItem = sql.define('cartitem', {});

// create associations
Cart.User = Cart.belongsTo(User);
Product.belongsToMany(Cart, { through: CartItem });
Cart.belongsToMany(Product, { through: CartItem });

// the force flag will drop the tables if they exist and recreate them - NOT FOR PRODUCTION
sql.sync({ force: true }).then(() => {
	populateDataTables();
});

function populateDataTables() {
	// create products
	Product.create({
		name: 'Camera',
		description: 'This is a cool camera.',
		price: 1499.99
	});
	Product.create({
		name: 'TV',
		description: 'This is a cool tv.',
		price: 1999.99
	});
	Product.create({
		name: 'Smartphone',
		description: 'This is a cool smartphone.',
		price: 999.99
	});

	// create users
	User.create({
		firstname: 'Ken',
		lastname: 'Jackson',
		email: 'ken@inventive.io'
	});
	User.create({
		firstname: 'Andrew',
		lastname: 'Siemer',
		email: 'andy@inventive.io'
	});
	User.create({
		firstname: 'Miguel',
		lastname: 'Gonzalez',
		email: 'miguel@inventive.io'
	}).then((user) => {

		// create cart and associate with user
		Cart.create({}).then((cart) => {
			return cart.setUser(user);
		}).then((cart) => {

			// get all products and add them to the cart
			Product.findAll().then((products) => {
				cart.setProducts(products);
			});
		});

	});
}