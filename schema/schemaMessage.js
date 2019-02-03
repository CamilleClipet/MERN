const mongoose = require('mongoose');
const jwt = require('jwt-simple');
const config = require('../config/config');

var messageSchema = mongoose.Schema({
	content: {
	type: String,
	validate:[stringLimit, "{PATH} exceeds the limit of 140"],
	required: true
	},
	author_id: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	hashtag:{
		type: Array
	}

},{ timestamps: { createdAt: 'created_at' }})

function stringLimit(val) {
	return val.length <= 140;
}


module.exports = mongoose.model('Message', messageSchema);
