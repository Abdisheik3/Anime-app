
const mongoose = require('./connection')
const Anime = require('./anime')


const db = mongoose.connection

db.on('open', () => {
    const startAnimes = [
        { name: "Dragon Ball Z"},
        { name: "One Piece"},  
        { name: "Naruto"}, 
        { name: "Bleach"},
        { name: "HunterxHunter"}, 
        { name: "Attack on Titan"}, 
        { name: "Demon Slayer"}, 
        { name: "One Punch Man"}, 
        { name: "My Hero Academia"}, 
        { name: "Jujutsu Kaisen"}
    ]
    Anime.deleteMany({})
        .then(deletedAnimes => {
            console.log('this is what .deleteMany returns', deletedAnimes)
            Anime.create(startAnimes)
                .then(data => {
                    console.log('here are the newly created animes', data)
                    db.close()
                })
                .catch(error => {
                    console.log(error)
                    db.close()
                })
        })
        .catch(error => {
            console.log(error)
            db.close()
        })
})