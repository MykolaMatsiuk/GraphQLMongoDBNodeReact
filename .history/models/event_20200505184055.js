const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	price: {
		type: Date,
		required: true
	}
});

mongoose.model('Event', eventSchema);