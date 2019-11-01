const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const app = express();

mongoose.connect('mongodb+srv://admin:4Bq7SQQTQ71GhEBV@cluster0-nmzdj.mongodb.net/test?retryWrites=true&w=majority')

require('./model/User');
require('./service/passport');

app.set('view engine', 'ejs');

app.use(
    cookieSession({
        maxAge: 30*24*60*60*1000,
        keys: ['91823yqwbedlaskjdh9p1hfg4234ewffddoiasdsaasdasld892e']
    })
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/auth')(app);
require('./routes/mail')(app);

app.get('/landing', (req,res) => {
    if(req.user){
        res.redirect('/mails');
    }else{
        res.render('pages/index', {data : 'This is data'});
    }
});

// app.get('/', requireAuth, (req, res) => {
//     const user = req.user;
//     //res.send(user);
//     oauth2Client.setCredentials({
//         refresh_token: user.refreshToken
//     })
//     const accessToken = oauth2Client.getAccessToken();
//     oauth2Client.setCredentials({
//         access_token : accessToken
//     })
//     res.send('Success');
// })


app.listen(9000, () => {
    console.log('server is listening');
});
