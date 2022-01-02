const { SCENES, STEPS } = require('../constants');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

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
		if (text === '⭐️ Мои авто') {
			const res = await fetch(`${process.env.BACKEND_URL}/customers/${user.chatId}/cars`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			});
			const { cars } = await res.json();
			cars.forEach((car, index) => {
				let content = `ℹ️ ${car.brand} ${car.model}(${car.manufactured_year})\n`;
				content += `Зарегистрирована: ${car.createdAt.split('T')[0]}\n`;
				content += `VIN: ${car.vincode}\n`;
				content += `Пробег: ${car.current_mileage}\n`;
				ctx.reply(
					content,
					Markup.keyboard([['⭐️ Мои авто']])
						.oneTime()
						.resize()
						.extra()
				);
			});
			// const keyboard = sliceIntoChunks(data.cars, 2);
			// ctx.reply(`Ваши авто:`, Markup.keyboard(keyboard).oneTime().resize().extra());
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
