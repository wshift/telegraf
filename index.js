require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const sequelize = require('./db');
const User = require('./controllers/user');
const Scene = require('./controllers/scene');
const { SCENES, STEPS } = require('./constants');

const token = process.env.BOT_TOKEN;
if (token === undefined) {
	throw new Error('BOT_TOKEN must be provided!');
}

const bot = new Telegraf(token);

(async () => {
	try {
		//db connect
		await sequelize.authenticate();
		await sequelize.sync({ alter: true });
	} catch (err) {
		console.log('Db connection problem => ', err);
	}
	bot.on('message', async (ctx, next) => {
		const user = await User.get(ctx);
		let { scene, step } = { ...user.dataValues };
		if (ctx.message.text && ctx.message.text.includes('/start')) {
			scene = SCENES.START;
			step = STEPS.FIRST;
		}
		const { nextStep, nextScene } = await Scene.run(ctx, scene, step, user);
		await User.update(user, nextStep, nextScene);
	});
})();

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
