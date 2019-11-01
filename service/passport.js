const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('user');
const {clientId, clientSecret} =  require('../keys');

passport.serializeUser((user, done) => {
    done(null, user.id); 
});

passport.deserializeUser(async (id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user); //here passport will attatch user to req.user
            //passport will attatch logout function to req.logout
        })
        .catch(err => {
            done(err, null);
        })
})

passport.use(new googleStrategy({
    clientID : clientId,
    clientSecret : clientSecret,
    callbackURL : '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    // console.log('Email of the user',profile.emails[0].value);
    // console.log('Access Token', accessToken);
    console.log('Refresh Token', refreshToken);
    const existingUser = await User.findOne({googleId : profile.id});
    //if this profile is available in our db
    if(existingUser){
        done(null,existingUser);
    }else{
    //if this profile is not available in our db
        const user = new User({
            googleId : profile.id,
            email : profile.emails[0].value,
            refreshToken : refreshToken
        });
        await user.save();
        done(null, user);
    }
}));