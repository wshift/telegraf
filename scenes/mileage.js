const { SCENES, STEPS } = require('../constants');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const e = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const mileageScreen = {
	[STEPS.FIRST]: async function ({ ctx, user }) {
		console.log(`🚀 ~ file: mileage.js ~ line 9 ~ user`, user);
		const text = ctx.message.text;
		const regex = /\d+/;
		const userInput = text.match(regex);
		const newMileage = userInput ? parseInt(userInput[0]) : false;
		const current_mileage = user.data.carInfo.current_mileage;
		const car_hash = user.data.carInfo.hash;
		if (newMileage && newMileage >= current_mileage) {
			await fetch(`${process.env.BACKEND_URL}/customers/update-car/${car_hash}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ current_mileage: newMileage }),
			});
			ctx.reply(
				'Спасибо за информацию!',
				Markup.keyboard([['⭐️ Мои авто']])
					.resize()
					.extra()
			);
			return { nextScene: SCENES.MENU, nextStep: STEPS.FIRST };
		} else if (newMileage && newMileage < current_mileage) {
			ctx.reply('Пожалуйста, введите корректную информацию о пробеге вашего авто👇');
			return { nextScene: SCENES.MILEAGE, nextStep: STEPS.FIRST };
		} else {
			ctx.reply('Пожалуйста, введите пробег авто, только цифры, к примеру 14800 👇');
			return { nextScene: SCENES.MILEAGE, nextStep: STEPS.FIRST };
		}
	},
};

module.exports = mileageScreen;
