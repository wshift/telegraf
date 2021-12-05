const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const UserModel = sequelize.define('user', {
	id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
	name: { type: DataTypes.STRING },
	phone: { type: DataTypes.STRING },
	chatId: { type: DataTypes.STRING, unique: true },
	scene: { type: DataTypes.STRING, defaultValue: 'START' },
	step: { type: DataTypes.INTEGER, defaultValue: 1 },
	company_hash: { type: DataTypes.STRING },
	data: {
		type: DataTypes.JSONB,
		defaultValue: {},
	},
	messenger: { type: DataTypes.STRING },
	username: { type: DataTypes.STRING },
});

module.exports = { UserModel };
