const express = require('express')
const router = express.Router()

// Login/Landing page
router.get('/', (req, res) => {
    res.render("login", {
        layout: 'login' // materialize framework's own login layout /layouts/login.hbs
    })
})

// Dashboard page
router.get('/dashboard', (req, res) => {
    res.render('dashboard')
})

module.exports = router