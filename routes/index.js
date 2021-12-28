const Router = require('express');
const router = new Router();
const { SCENES, STEPS } = require('../constants');

const User = require('../controllers/user');

router.post('/ask-mileage', async (req, res) => {
	const user = await User.get(null, req.query.chatId);
	const body = req.body;
	if (user) {
		user.data = { ...user.data, ...body };
		const nextScene = SCENES.MILEAGE;
		const nextStep = STEPS.FIRST;
		await User.update(user, nextStep, nextScene);
		res.json({ status: true }).send();
	} else {
		res.json({ status: false, error: 'Wrong userId' }).send();
	}
});

module.exports = router;
