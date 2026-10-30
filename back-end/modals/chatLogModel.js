const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema(
	{
		role: {
			type: String,
			enum: ['user', 'assistant'],
			required: true,
		},
		message: {
			type: String,
			required: true,
			trim: true,
		},
		source: {
			type: String,
			enum: ['ai', 'local'],
			default: 'ai',
		},
		path: {
			type: String,
			default: '/',
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('ChatLog', chatLogSchema);