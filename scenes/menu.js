const { SCENES, STEPS } = require('../constants');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');

const menuScreen = {
	[STEPS.FIRST]: async function ({ ctx, user }) {
		const text = ctx.message ? ctx.message.text : null;
		if (text === '⭐️ Мои авто') {
			ctx.reply(
				'Доделаю в 12.12.2222 году',
				Markup.keyboard([['⭐️ Мои авто']])
					.oneTime()
					.resize()
					.extra()
			);
		} else {
			ctx.reply(
				'Не понял команду',
				Markup.keyboard([['⭐️ Мои авто']])
					.oneTime()
					.resize()
					.extra()
			);
		}
		return { nextScene: SCENES.MENU, nextStep: STEPS.FIRST };
	},
};

module.exports = menuScreen;
