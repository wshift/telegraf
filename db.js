const { Sequelize } = require('sequelize');

module.exports = new Sequelize(process.env.DB_NAME, process.env.DB_LOGIN, process.env.DB_PASS, {
	host: 'localhost',
	port: '5432',
	dialect: 'postgres',
});
