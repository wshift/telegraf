const { SCENES, STEPS } = require('../constants');

const startScreen = {
	[STEPS.FIRST]: async function ({ ctx }) {
		await ctx.reply(`start - step 1`);
		return { nextScene: SCENES.START, nextStep: STEPS.SECOND };
	},
	[STEPS.SECOND]: async function ({ ctx }) {
		await ctx.reply(`step 2 - return to step 1`);
		return { nextScene: SCENES.START, nextStep: STEPS.FIRST };
	},
};

module.exports = startScreen;
