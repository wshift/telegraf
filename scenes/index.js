const startScreen = require('./start');
const menuScreen = require('./menu');
const { SCENES } = require('../constants');

module.exports = {
	[SCENES.START]: startScreen,
	[SCENES.MENU]: menuScreen,
};
