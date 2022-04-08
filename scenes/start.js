const { SCENES, STEPS, TEXT } = require('../constants');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const textLocalization = require('../utils/textLocalization');

const startScreen = {
	[STEPS.FIRST]: async function ({ ctx, user }) {
		const isText = ctx.message.text ? true : false;
		const deeplink = isText && ctx.message.text.split(' ').length > 1 ? ctx.message.text.split(' ')[1] : false;
		// if (!user.phone && deeplink) {
		if (deeplink) {
			user.company_hash = deeplink;
			await user.save();
			ctx.reply(
				textLocalization(TEXT.REG_TEXT),
				Extra.markup((markup) => {
					return markup
						.resize()
						.keyboard([markup.contactRequestButton(textLocalization(TEXT.REG_BTN))])
						.oneTime()
						.resize();
				})
			);
			return { nextScene: SCENES.START, nextStep: STEPS.SECOND };
		} else if (!user.phone && !deeplink) {
			ctx.replyWithVideo('https://automobot.net/qr-manual.mp4', {
				caption: textLocalization(TEXT.START_RULES),
			});
		} else {
			ctx.reply(
				textLocalization(TEXT.MAIN_MENU),
				Markup.keyboard([[textLocalization(TEXT.CARS_BTN)]])
					.resize()
					.extra()
			);
		}
		return { nextScene: SCENES.MENU, nextStep: STEPS.FIRST };
	},
	[STEPS.SECOND]: async function ({ ctx, user }) {
		const phone = ctx.message ? (ctx.message.contact ? ctx.message.contact.phone_number : null) : null;
		if (!phone) {
			ctx.reply(
				textLocalization(TEXT.PRESS_SHARE_BNT),
				Extra.markup((markup) => {
					return markup
						.resize()
						.keyboard([markup.contactRequestButton(textLocalization(TEXT.REG_BTN))])
						.oneTime()
						.resize();
				})
			);
			return { nextScene: SCENES.START, nextStep: STEPS.SECOND };
		} else {
			user.phone = phone;
			let nextScene = { nextScene: SCENES.START, nextStep: STEPS.THIRD };
			//create user on backend
			await fetch(`${process.env.BACKEND_URL}/customers/add`, {
				method: 'post',
				body: JSON.stringify({
					phone: user.phone,
					customer_name: user.name,
					messenger: user.messenger,
					unique_id: user.chatId,
					company_hash: user.company_hash,
					mess_login: user.username,
				}),
				headers: { 'Content-Type': 'application/json' },
			})
				.then((res) => res.json())
				.then(async (data) => {
					if (data.hash) {
						const buttonUrl = `${process.env.SITE_URL}/driver-registration/?id=${data.hash}&messenger=telegram`;
						ctx.reply(
							textLocalization(TEXT.COMPLETE_REG),
							Extra.markup(Markup.inlineKeyboard([Markup.urlButton(textLocalization(TEXT.COMPLETE_REG_BTN), buttonUrl)]))
						);
					} else {
						await ctx.reply(textLocalization(TEXT.REENTER_GREETING) + user.name);
						await ctx.reply(
							textLocalization(TEXT.MAIN_MENU),
							Markup.keyboard([[textLocalization(TEXT.CARS_BTN)]])
								.resize()
								.extra()
						);
						return { nextScene: SCENES.MENU, nextStep: STEPS.FIRST };
					}
				})
				.catch((err) => {
					user.phone = null;
					ctx.reply(textLocalization(TEXT.ERROR_TEXT));
					console.log(`🚀 ~ file: start.js ~ line 89 ~ err`, JSON.stringify(err));
					nextScene = { nextScene: SCENES.START, nextStep: STEPS.FIRST };
				});
			return nextScene;
		}
	},
	[STEPS.THIRD]: async function ({ ctx, user }) {
		//do webhook
	},
};

module.exports = startScreen;
