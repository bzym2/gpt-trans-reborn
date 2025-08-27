import { getSetting, setSetting } from './utils.js';


// from https://github.com/ztjhz/chatgpt-free-app
var url = 'https://api.openai.com/v1/chat/completions';
var model = 'gpt-3.5-turbo';
const getChatCompletionStreamCustomAPI = async (apiKey, messages, config = {presence_penalty: 0, temperature: 1}) => {
	if (getSetting('api-type', 'custom') == 'custom') {
		url = getSetting('custom-url', "");
		console.log("Custom " + url)
		model = getSetting('custom-model', 'gpt-3.5-turbo');
		console.log("Custom " + model)
	} else {
		model = getSetting('openai-model', 'gpt-3.5-turbo')
		console.log("OAI " + url)
		console.log("OAI " + model)
	}
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: getSetting('model', 'gpt-3.5-turbo'),
			messages,
			...config,
			stream: true
		})
	});
	if (!response.ok) {
		throw new Error(await response.text());
	}
	const stream = response.body;
	return stream;
}

export const getChatCompletionStream = async (messages, config = {presence_penalty: 0, temperature: 1}) => {
	if (getSetting('api-type', 'custom') == 'custom') {
		return getChatCompletionStreamCustomAPI(getSetting('custom-key', ''), messages, config);
	} else {
		console.log('using openai api key');
		return getChatCompletionStreamCustomAPI(getSetting('openai-key', ''), messages, config);
	}
}