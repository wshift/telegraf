const { UserModel } = require('../models/index');

class User {
	async get(ctx) {
		try {
			const chatId = ctx.message.from.id.toString();
			let user = await UserModel.findOne({ where: { chatId } });
			if (!user) {
				user = await UserModel.create({
					name: `${ctx.message.from.first_name}${ctx.message.from.last_name ? ` ${ctx.message.from.last_name}` : ''}`,
					chatId,
					messenger: `telegram`,
					username: `${ctx.message.from.username ? ctx.message.from.username : null}`,
				});
			}
			return user;
		} catch (e) {
			console.error(e);
		}
	}
	async update(user, nextStep, nextScene) {
		user.scene = nextScene;
		user.step = nextStep;
		return await user.save();
	}
}

module.exports = new User();
