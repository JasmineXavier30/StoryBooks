const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Story = require('../models/Story')

// Login/Landing page
router.get('/', ensureGuest, (req, res) => {
    res.render("login", { //hbs file
        layout: 'login' // materialize framework's own login layout /layouts/login.hbs
    })
})

// Dashboard page
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id }).lean()

        res.render('dashboard', {
            name: req.user.displayName,
            stories
        })
    }
    catch(e) {
        console.log(e)
        res.render('errors/500')
    }
})

module.exports = router