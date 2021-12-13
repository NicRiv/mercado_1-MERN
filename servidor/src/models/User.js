const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	nombre: {
		type: String,
		required: true		
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	misCompras: {
		type: [String],
		default: []
	}
}, {
	timestamps: true
})

module.exports = mongoose.model('User', userSchema)