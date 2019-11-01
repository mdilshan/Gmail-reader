const passport = require('passport');

module.exports = (app) => {
    app.get('/auth/google', passport.authenticate('google', {scope : ['profile','email', 'https://www.googleapis.com/auth/gmail.labels', 'https://www.googleapis.com/auth/gmail.readonly'], accessType: 'offline', approvalPrompt: 'force' }));

    app.get('/auth/google/callback', passport.authenticate('google'), (req,res) => {
        res.redirect('/mails');
    });
    app.get('/auth/logout', (req,res) => {
        req.logout();
        res.redirect('/landing');
    })
}