const mongoose = require('mongoose');
const passwordHash = require('password-hash');
const jwt = require('jwt-simple');
const jwt2 = require('jsonwebtoken');
const config = require('../config/config');

var userSchema = mongoose.Schema({
	username: {
	type: String,
	unique: true,
	required: true
	},
	email: {
		type: String,
		lowercase: true,
		trim: true,
		unique: true,
		required: true
	},
	password: {
        type: String,
        required: true
    },
    followers: {
    	type: Array,
    },
    followed: {
    	type: Array,
    },
    blockedUsers: {
    	type: Array,
    }
},{ timestamps: { createdAt: 'created_at' }})


userSchema.methods = {
	authenticate: function (password) {
		return passwordHash.verify(password, this.password);
	},
	getToken: function () {
		const payload = {
			email: this.email,
			username: this.username,
			_id: this._id
		};
		return jwt.encode(payload, config.secret);
	},
	getToken2: function () {
		//console.log("toto");
		const payload = {
			email: this.email,
			username: this.username,
			_id: this._id
		};
		return jwt2.sign(payload, config.secret);
	}
}

module.exports = mongoose.model('User', userSchema);
