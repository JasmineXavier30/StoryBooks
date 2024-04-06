module.exports = {
    ensureAuth: function(req, res, next) {
        if(req.isAuthenticated()) // passport method
            return next()
        else 
            res.redirect('/')
    },
    ensureGuest: function(req, res, next) {
        if(req.isAuthenticated())
            res.redirect('/dashboard')
        else
            return next()
    }
}