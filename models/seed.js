const mongoose = require('./connection')
const Anime = require('./anime')


const db = mongoose.connection

db.on('open', () => {
    const startAnimes = [
        { name: "Dragon Ball Z", characters: "Goku" },
        { name: "One Piece", characters: "Luffy" },  
        { name: "Naruto", characters: "Naruto" }, 
        { name: "Bleach", characters: "Ichigo" },
        { name: "HunterxHunter", characters: "Gon" }, 
        { name: "Attack on Titan", characters: "Naruto" }, 
        { name: "Demon Slayer", characters: "Tanjiro" }, 
        { name: "One Punch Man", characters: "Saitima" }, 
        { name: "My Hero Academia", characters: "Deku" }, 
        { name: "Jujutsu Kaisen", characters: "Itadori" }, 
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