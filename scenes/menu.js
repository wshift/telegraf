const { SCENES, STEPS, TEXT } = require('../constants');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const textLocalization = require('../utils/textLocalization');

// function sliceIntoChunks(arr, chunkSize) {
// 	arr = arr.map((car) => `${car.brand} ${car.model}(${car.manufactured_year})`);
// 	console.log(`🚀 ~ file: menu.js ~ line 8 ~ sliceIntoChunks ~ arr`, arr);
// 	const res = [];
// 	for (let i = 0; i < arr.length; i += chunkSize) {
// 		const chunk = arr.slice(i, i + chunkSize);
// 		console.log(`🚀 ~ file: menu.js ~ line 11 ~ sliceIntoChunks ~ chunk`, chunk);
// 		res.push(chunk);
// 	}
// 	return res;
// }

const menuScreen = {
	[STEPS.FIRST]: async function ({ ctx, user }) {
		const text = ctx.message ? ctx.message.text : null;
		if (text === textLocalization(TEXT.CARS_BTN)) {
			const res = await fetch(`${process.env.BACKEND_URL}/customers/${user.chatId}/cars`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			});
			const { cars } = await res.json();
			if (cars.length) {
				cars.forEach((car) => {
					let content = `ℹ️ ${car.brand} ${car.model}(${car.manufactured_year})\n`;
					content += `${textLocalization(TEXT.CAR_REG_DATE)} ${car.createdAt.split('T')[0]}\n`;
					content += `${textLocalization(TEXT.CAR_VIN)} ${car.vincode}\n`;
					content += `${textLocalization(TEXT.CAR_MILEAGE)} ${car.current_mileage}\n`;
					ctx.reply(
						content,
						Markup.keyboard([[textLocalization(TEXT.CARS_BTN)]])
							.oneTime()
							.resize()
							.extra()
					);
				});
			} else {
				ctx.reply(
					textLocalization(TEXT.NO_CARS),
					Markup.keyboard([[textLocalization(TEXT.CARS_BTN)]])
						.oneTime()
						.resize()
						.extra()
				);
			}
			// const keyboard = sliceIntoChunks(data.cars, 2);
			// ctx.reply(`Ваши авто:`, Markup.keyboard(keyboard).oneTime().resize().extra());
		} else {
			ctx.reply(
				textLocalization(TEXT.UNKNOWN_COMMAND),
				Markup.keyboard([[textLocalization(TEXT.CARS_BTN)]])
					.oneTime()
					.resize()
					.extra()
			);
		}
		return { nextScene: SCENES.MENU, nextStep: STEPS.FIRST };
	},
};

module.exports = menuScreen;
