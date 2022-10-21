// import dependencies
const mongoose = require('./connection')

// import user model for populate // incorrect - not your fault
const User = require('./user')// unused imports 
const Character = require('./character')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const animeSchema = new Schema( // capitalize our schemas ! they are JS classes
	{
		name: { type: String, required: true },
		characters: [{ type: Schema.Types.ObjectID, ref: 'Character' }], // YAS
		owner: { type: Schema.Types.ObjectID, ref: 'User' },
		desc: { type: String}
	},
	{ timestamps: true }
)

const Anime = model('Anime', animeSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Anime