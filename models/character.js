const mongoose = require('./connection')

// import user model for populate
const User = require('./user') // remove unused imports

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const characterSchema = new Schema( // capitalize our schemas ! they are JS classes
    {
        name: { type: String, required: true},
        desc: { type: String},
        owner: { type: Schema.Types.ObjectID, ref: 'User', },
        anime: { type: Schema.Types.ObjectID, ref: 'Anime', } // a little confused here, if your intention is the origin/ native anime for the character then i'd suggest using a different name for this variable
        
    },
    { timestamps: true}
    )


const Character = model('Character', characterSchema)

module.exports = Character