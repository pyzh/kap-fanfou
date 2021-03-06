'use strict';

const os = require('os');
const path = require('path');
const Fanfou = require('./fanfou');

const action = async context => {
	context.setProgress('Uploading…');
	const filePath = await context.filePath();

	let token = {};

	if (context.config.get('useNofanConfig')) {
		const user = require(path.join(os.homedir(), '.nofan/config')).USER;
		const account = require(path.join(os.homedir(), '.nofan/account'))[user];
		token = {
			consumerKey: account.CONSUMER_KEY,
			consumerSecret: account.CONSUMER_SECRET,
			oauthToken: account.OAUTH_TOKEN,
			oauthTokenSecret: account.OAUTH_TOKEN_SECRET
		};
	} else {
		token = {
			consumerKey: context.config.get('consumerKey'),
			consumerSecret: context.config.get('consumerSecret'),
			oauthToken: context.config.get('oauthToken'),
			oauthTokenSecret: context.config.get('oauthTokenSecret')
		};
	}

	try {
		const result = await Fanfou.upload(token, filePath);
		context.notify(result);
	} catch (err) {
		context.notify(err.message);
	}
};

const fanfou = {
	title: 'Share to Fanfou',
	formats: ['gif'],
	action,
	config: {
		consumerKey: {
			title: 'Consumer Key',
			type: 'string',
			minLength: 32,
			default: 'Your consumer key',
			required: true
		},
		consumerSecret: {
			title: 'Consumer Secret',
			type: 'string',
			minLength: 32,
			default: 'Your consumer secret',
			required: true
		},
		oauthToken: {
			title: 'OAuth Token',
			type: 'string',
			minLength: 32,
			default: 'Your oauth token',
			required: true
		},
		oauthTokenSecret: {
			title: 'OAuth Token Secret',
			type: 'string',
			minLength: 32,
			default: 'Your oauth token secret',
			required: true
		},
		useNofanConfig: {
			title: 'Use nofan config',
			type: 'boolean',
			default: false,
			required: true
		}
	}
};

exports.shareServices = [fanfou];
