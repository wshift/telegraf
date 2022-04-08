module.exports = textLocalization = (phrase, lang = 'ua', args = {}) => {
	let outputText = phrase[lang];

	//find vars in phrase
	const re = /\{{(.*?)\}}/g;
	let varsToReplace = [];
	let found;
	while ((found = re.exec(outputText))) {
		varsToReplace.push(found[1]);
	}
	//replace them
	varsToReplace.forEach((variable) => {
		outputText = outputtextLocalization(TEXT.replace(`{{${variable}}}`, args[variable]);
	});

	return outputText;
};
