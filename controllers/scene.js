const { User } = require('../models/index');
const scenes = require('../scenes');

class Scene {
	constructor() {
		this.ctx = null;
		this.scene = null;
		this.step = null;
	}
	async run(ctx, scene, step) {
		try {
			//executing
			const isScene = scenes.hasOwnProperty(scene);
			const isStep = isScene ? scenes?.[scene]?.[step] : false;
			if (isScene && isStep) {
				this.ctx = ctx;
				this.scene = scene;
				this.step = step;
				return await scenes[scene][step](this);
			} else if (!isStep) {
				ctx.reply(`No step ${step} in ${scene}`);
			} else {
				ctx.reply(`No ${scene}`);
			}
			return { nextStep: step, nextScene: scene };
		} catch (e) {
			console.error(e);
		}
	}
}

module.exports = new Scene();
