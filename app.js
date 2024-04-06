const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

//Load config
dotenv.config({ path: './config/config.env'})

//passport config
require('./config/passport')(passport)

connectDB()

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))

app.use(methodOverride('_method'))

// For logging
if(process.env.NODE_ENV == 'development')
    app.use(morgan('dev'))

const { formatDate, stripTags, truncate, editIcon, isSelected } = require('./helpers/hbs')

// Handlebars template engine to use short extension instead of .handlebars
app.engine('.hbs', exphbs(
    { 
        defaultLayout: 'main', 
        extname: '.hbs',
        helpers: { formatDate, stripTags, truncate, editIcon, isSelected }
    }
))
app.set('view engine', '.hbs')

app.use(session({
    secret: 'storybooks',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        url: process.env.MONGO_URI
    })
}))

// Passport Initialize (middleware)
app.use(passport.initialize())
app.use(passport.session())

// set global vars middleware
app.use(function(req, res, next) {
    // setting req user to global user
    res.locals.user = req.user || null
    next()
})

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

//static folder
app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`))