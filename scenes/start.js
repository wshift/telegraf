const { SCENES, STEPS } = require('../constants');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const startScreen = {
	[STEPS.FIRST]: async function ({ ctx, user }) {
		const isText = ctx.message.text ? true : false;
		const deeplink = isText && ctx.message.text.split(' ').length > 1 ? ctx.message.text.split(' ')[1] : false;
		// if (!user.phone && deeplink) {
		if (deeplink) {
			user.company_hash = deeplink;
			await user.save();
			ctx.reply(
				'Меня зовут Automobot 😎\n\nМоя цель — помочь тебе вовремя обслужить свою машину. Всё что тебе нужно сделать — добавить своё авто. Погнали? 🔥',
				Extra.markup((markup) => {
					return markup
						.resize()
						.keyboard([markup.contactRequestButton('Зарегистрироваться ✅')])
						.oneTime()
						.resize();
				})
			);
			return { nextScene: SCENES.START, nextStep: STEPS.SECOND };
		} else if (!user.phone && !deeplink) {
			ctx.replyWithVideo(`https://i.imgur.com/0ArgQXc.mp4`, {
				caption:
					'Чтобы начать пользоваться ботом, обратитесь в автосервис, на котором вы обслуживаете свой автомобиль!\n\nВ случае, если у них нет Automobot - расскажите о нем!\n\nC уважением, команда Automobot.net',
			});
		} else {
			ctx.reply(
				'Главное меню',
				Markup.keyboard([['⭐️ Мои авто']])
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
				'Пожалуйста, нажмите на кнопку номера',
				Extra.markup((markup) => {
					return markup
						.resize()
						.keyboard([markup.contactRequestButton('Зарегистрироваться ✅')])
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
						const buttonUrl = `${process.env.SITE_URL}/driver-registration/?id=${data.hash}`;
						ctx.reply(
							'Для завершения регистрации, заполните форму о вашем авто ⬇️',
							Extra.markup(Markup.inlineKeyboard([Markup.urlButton('Зарегистрировать авто 🌐', buttonUrl)]))
						);
					} else {
						await ctx.reply(`Рад видеть вас снова, ${user.name}`);
						await ctx.reply(
							'Главное меню',
							Markup.keyboard([['⭐️ Мои авто']])
								.resize()
								.extra()
						);
						return { nextScene: SCENES.MENU, nextStep: STEPS.FIRST };
					}
				})
				.catch((err) => {
					user.phone = null;
					ctx.reply(
						'Упс, случилась непредвиденная ошибка в момент обработки запроса. Пожалуйста, повторите процедуру с начала 😅'
					);
					console.error(`Error at req: ${JSON.stringify(err)}`);
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
