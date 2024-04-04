const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const passport = require('passport')
const session = require('express-session')

//Load config
dotenv.config({ path: './config/config.env'})

//passport config
require('./config/passport')(passport)

connectDB()

const app = express()

// For logging
if(process.env.NODE_ENV == 'development')
    app.use(morgan('dev'))

// Handlebars template engine to use short extension instead of .handlebars
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', '.hbs')

app.use(session({
    secret: 'storybooks',
    resave: false,
    saveUninitialized: false
}))

// Passport Initialize
app.use(passport.initialize())
app.use(passport.session())

//Routes
app.use('/', require('./routes/index'))

//static folder
app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`))