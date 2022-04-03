require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const cors = require('cors');
const app = express();
const router = require('./routes/index');
const token = process.env.BOT_TOKEN;

const { Telegraf, Markup } = require('telegraf');
const User = require('./controllers/user');
const Scene = require('./controllers/scene');
const { SCENES, STEPS } = require('./constants');

if (token === undefined) {
	throw new Error('BOT_TOKEN must be provided!');
}

const bot = new Telegraf(token);

(async () => {
	try {
		//db connect
		await sequelize.authenticate();
		await sequelize.sync({ alter: true });
		app.use(cors());
		app.use(express.json());
		app.use('/api/v1', router);
		app.listen(3001, () => console.log(`Server started, port: 3001`));

		bot.launch();

		// Enable graceful stop
		process.once('SIGINT', () => bot.stop('SIGINT'));
		process.once('SIGTERM', () => bot.stop('SIGTERM'));

		bot.on('message', async (ctx, next) => {
			const user = await User.get(ctx);
			let { scene, step } = { ...user.dataValues };
			if (ctx.message.text && ctx.message.text.includes('/start')) {
				scene = SCENES.START;
				step = STEPS.FIRST;
			}
			const { nextStep = STEPS.FIRST, nextScene = SCENES.START } = await Scene.run(ctx, scene, step, user);
			await User.update(user, nextStep, nextScene);
		});
	} catch (err) {
		console.log('[INDEX.JS Error] => ', err);
	}
})();
