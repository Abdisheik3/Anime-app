// Import Dependencies
const express = require('express')
const Anime = require('../models/anime')
const Character = require('../models/character') // unused import
// Create router
const router = express.Router()

// Router Middleware
// Authorization middleware
// If you have some resources that should be accessible to everyone regardless of loggedIn status, this middleware can be moved, commented out, or deleted. 
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

// Routes

// index ALL
router.get('/', (req, res) => {
	const username = req.session.username
    const loggedIn = req.session.loggedIn
	Anime.find({})
		.then(animes => { // animes is not a word, anime is both plural and singular maybe do allAnime ? 
			res.render('animes/index', { animes, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// index that shows only the user's examples
router.get('/mine', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	Anime.find({ owner: userId })
		.then(animes => { // see 29 - do myAnime here
			res.render('animes/index', { animes, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// new route -> GET route that renders our page with the form
router.get('/new', (req, res) => {
	const { username, userId, loggedIn } = req.session
	res.render('animes/new', {  username, loggedIn, userId})
})

// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {
	// req.body.ready = req.body.ready === 'on' ? true : false

	req.body.owner = req.session.userId
	Anime.create(req.body)
		.then(anime => {
			// console.log('this was returned from create', anime)
			res.redirect('/animes') // consider going to the new specific anime page instead
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	// we need to get the id
	const animeId = req.params.id
	Anime.findById(animeId)
		.then(anime => {
			res.render('animes/edit', { anime })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// update route
router.put("/:id", (req, res) => {
    console.log("req.body initially", req.body)
    const id = req.params.id
// remove this white space, it';s inconsistent with the rest of your app
    
    
    Anime.findById(id)
        .then(anime => {
            if (anime.owner == req.session.userId) {
                // must return the results of this query
                return anime.updateOne(req.body)
            } else {
                res.sendStatus(401)
            }
        })
        .then(() => {
            // console.log('returned from update promise', data)
            res.redirect(`/animes/${id}`)
        })
        .catch(err => res.redirect(`/error?error=${err}`))
})

// show route
router.get('/:id', (req, res) => {
	const animeId = req.params.id
	Anime.findById(animeId)
		.populate("characters")// good use of populate
		.then(anime => {
			console.log('this is the anime in show page', anime)
            const {username, loggedIn, userId} = req.session
			res.render('animes/show', { anime, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// delete route
router.delete('/:id', (req, res) => {
	const animeId = req.params.id
	Anime.findByIdAndRemove(animeId)
		.then(anime => {
			res.redirect('/animes')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// Export the Router
module.exports = router