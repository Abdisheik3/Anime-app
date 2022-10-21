// Import Dependencies
const express = require('express')
const Character = require('../models/character')
const Anime = require('../models/anime')

// Create router
const router = express.Router()

router.use((req, res, next) => {
	// checking the loggedIn boolean of our session
	if (req.session.loggedIn) {
		// if they're logged in, go to the next thing(thats the controller)
		next()
	} else {
		// if they're not logged in, send them to the login page
		res.redirect('/auth/login')
	}
})

router.get('/', (req, res) => {
	Character.find({})
		.then(characters => {
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			console.log('hfhfhfhf', characters)
			res.render('characters/index', { characters, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// index that shows only the user's examples
router.get('/mine', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	Character.find({ owner: userId })
		.then(characters => {
			res.render('characters/index', { characters, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// new route -> GET route that renders our page with the form
router.get('/new', (req, res) => {
	const { username, userId, loggedIn } = req.session
	res.render('characters/new', {  username, loggedIn, userId})
})

// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {// remove extra white space in this route
	// req.body.ready = req.body.ready === 'on' ? true : false // remove this

	req.body.owner = req.session.userId

	const animeId = req.body.anime 
	
	// character gets created in the db then we find anime, then we push to the char array in anime // NICE comment!
	Character.create(req.body)
		.then(character => {
			Anime.findById(animeId)
				.then(anime => {
					
					anime.characters.push(character.id)
					return anime.save()
				})
				.then(anime => {
					console.log('anime', anime)
					res.redirect('/characters')
				})
				.catch(error => {
					res.redirect(`/error?error=${error}`)
				})
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})


// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	// we need to get the id
	const characterId = req.params.id
	Character.findById(characterId)
		.then(character => {
			res.render('characters/edit', { character })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// update route
router.put("/:id", (req, res) => {
    console.log("req.body initially", req.body)
    const id = req.params.id
// remove extra white space
    
    
    Character.findById(id)
        .then(character => {
            if (character.owner == req.session.userId) {
                // must return the results of this query
                return character.updateOne(req.body)
            } else {
                res.sendStatus(401)
            }
        })
        .then(() => {
            // console.log('returned from update promise', data)
            res.redirect(`/characters/${id}`)
        })
        .catch(err => res.redirect(`/error?error=${err}`))
})

// show route
router.get('/:id', (req, res) => {
	const characterId = req.params.id
	Character.findById(characterId)
		.then(character => {
            const {username, loggedIn, userId} = req.session
			res.render('characters/show', { character, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// delete route
router.delete('/:id', (req, res) => {
	const characterId = req.params.id
	Character.findByIdAndRemove(characterId)
		.then(character => {
			res.redirect('/characters')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// Export the Router
module.exports = router