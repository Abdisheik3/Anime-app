const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const characterSchema = new Schema(
    {
        name: { type: String, required: true},
        desc: { type: String},
        owner: { type: Schema.Types.ObjectID, ref: 'User', },
        anime: { type: Schema.Types.ObjectID, ref: 'Anime', }
        
    },
    { timestamps: true}
    )


const Character = model('Character', characterSchema)

module.exports = Character