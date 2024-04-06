const GoogleStrategy = require("passport-google-oauth20").Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function(passport) {
    passport.use(new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback'
        },
        async (accesstoken, refreshToken, profile, done) => {
            //console.log(profile)
            const newUser = {
                googleId: profile.id,
                displayName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                image: profile.photos[0].value
            }
            try {
                let user = await User.findOne({ googleId: profile.id })

                if(user) 
                    done(null, user)
                else {
                    user = await User.create(newUser)
                    done(null, user)
                }
            }
            catch(e) {
                console.log(e)
            }
        }
    ))
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser(async (id, done) => {
        done(null, await User.findById(id))
    })
}


//console.log(profile)

/* {
    id: '103454482999343387890',
    displayName: 'Jasmine X',
    name: { familyName: 'X', givenName: 'Jasmine' },
    photos: [
      {
        value: 'https://lh3.googleusercontent.com/a/ACg8ocKj4_mZhjRG5wRjUgZG2qWYhooPSobR8DUOVuWdNuoUnIKHqVw96Q=s96-c'
      }
    ],
    provider: 'google',
    _raw: '{\n' +
      '  "sub": "103454482999343387890",\n' +
      '  "name": "Jasmine X",\n' +
      '  "given_name": "Jasmine",\n' +
      '  "family_name": "X",\n' +
      '  "picture": "https://lh3.googleusercontent.com/a/ACg8ocKj4_mZhjRG5wRjUgZG2qWYhooPSobR8DUOVuWdNuoUnIKHqVw96Q\\u003ds96-c",\n' +       
      '  "locale": "en-GB"\n' +
      '}',
    _json: {
      sub: '103454482999343387890',
      name: 'Jasmine X',
      given_name: 'Jasmine',
      family_name: 'X',
      picture: 'https://lh3.googleusercontent.com/a/ACg8ocKj4_mZhjRG5wRjUgZG2qWYhooPSobR8DUOVuWdNuoUnIKHqVw96Q=s96-c',
      locale: 'en-GB'
    }
  } */