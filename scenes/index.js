const startScreen = require('./start');
const menuScreen = require('./menu');
const mileageScreen = require('./mileage');
const { SCENES } = require('../constants');

module.exports = {
	[SCENES.START]: startScreen,
	[SCENES.MENU]: menuScreen,
	[SCENES.MILEAGE]: mileageScreen,
};
