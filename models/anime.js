// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const animeSchema = new Schema(
	{
		name: { type: String, required: true },
		characters: { type: String, required: true },
		owner: { type: Schema.Types.ObjectID, ref: 'User', }
	},
	{ timestamps: true }
)

const Anime = model('Anime', animeSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Anime
