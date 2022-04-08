const { SCENES, STEPS, TEXT } = require('../constants');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const e = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const textLocalization = require('../utils/textLocalization');

const mileageScreen = {
	[STEPS.FIRST]: async function ({ ctx, user }) {
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
				textLocalization(TEXT.THANKS),
				Markup.keyboard([[textLocalization(TEXT.CARS_BTN)]])
					.resize()
					.extra()
			);
			return { nextScene: SCENES.MENU, nextStep: STEPS.FIRST };
		} else if (newMileage && newMileage < current_mileage) {
			ctx.reply(textLocalization(TEXT.LOW_MILAGE));
			return { nextScene: SCENES.MILEAGE, nextStep: STEPS.FIRST };
		} else {
			ctx.reply(textLocalization(TEXT.TEXT_INSTEAD_MILEAGE));
			return { nextScene: SCENES.MILEAGE, nextStep: STEPS.FIRST };
		}
	},
};

module.exports = mileageScreen;
